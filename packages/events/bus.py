"""
Asynchronous In-Process Event Bus for FORGE X.
Decouples the synchronous low-latency hot path from asynchronous
reliability evaluations, red-team attacks, and policy evolution.
"""

from __future__ import annotations
import asyncio
from datetime import datetime, timezone
from typing import Dict, List, Any, Callable, Awaitable, Optional
from pydantic import BaseModel, Field


class ForgeEvent(BaseModel):
    id: str
    topic: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    payload: Dict[str, Any] = Field(default_factory=dict)
    provenance: Optional[str] = "FORGE-API-GATEWAY"


class AsyncEventBus:
    """
    Lightweight, honest in-process event bus using asyncio.Queue.
    Does NOT pretend to be Kafka or Redis. Provides true non-blocking
    asynchronous dispatch for the reliability & evaluation loop.
    """

    def __init__(self):
        self._subscribers: Dict[str, List[Callable[[ForgeEvent], Awaitable[None]]]] = {}
        self._queue: asyncio.Queue[ForgeEvent] = asyncio.Queue()
        self._history: List[ForgeEvent] = []
        self._running: bool = False
        self._worker_task: Optional[asyncio.Task] = None

    def subscribe(self, topic: str, handler: Callable[[ForgeEvent], Awaitable[None]]):
        """Register an async handler for a given topic."""
        if topic not in self._subscribers:
            self._subscribers[topic] = []
        self._subscribers[topic].append(handler)

    async def publish(self, topic: str, payload: Dict[str, Any], event_id: Optional[str] = None) -> ForgeEvent:
        """
        Publishes an event to the bus without blocking.
        Appends to internal history and enqueues for background processing.
        """
        eid = event_id or f"EVT-BUS-{len(self._history) + 1:05d}"
        event = ForgeEvent(id=eid, topic=topic, payload=payload)
        self._history.append(event)
        await self._queue.put(event)
        return event

    def publish_nowait(self, topic: str, payload: Dict[str, Any], event_id: Optional[str] = None) -> ForgeEvent:
        """Non-blocking publish for synchronous callers."""
        eid = event_id or f"EVT-BUS-{len(self._history) + 1:05d}"
        event = ForgeEvent(id=eid, topic=topic, payload=payload)
        self._history.append(event)
        self._queue.put_nowait(event)
        return event

    async def start_worker(self):
        """Starts the background worker to consume events asynchronously."""
        if self._running:
            return
        self._running = True
        self._worker_task = asyncio.create_task(self._process_queue())

    async def stop_worker(self):
        """Gracefully stops the background worker."""
        self._running = False
        if self._worker_task:
            self._worker_task.cancel()
            try:
                await self._worker_task
            except asyncio.CancelledError:
                pass

    async def _process_queue(self):
        while self._running:
            try:
                event = await asyncio.wait_for(self._queue.get(), timeout=1.0)
                handlers = self._subscribers.get(event.topic, [])
                for handler in handlers:
                    try:
                        await handler(event)
                    except Exception as err:
                        print(f"[EventBus] Error in handler for {event.topic}: {err}")
                self._queue.task_done()
            except asyncio.TimeoutError:
                continue
            except asyncio.CancelledError:
                break
            except Exception as err:
                print(f"[EventBus] Worker error: {err}")

    def get_recent_events(self, limit: int = 50) -> List[ForgeEvent]:
        """Returns recent events published to the bus."""
        return self._history[-limit:]
