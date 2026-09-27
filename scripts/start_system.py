"""
FORGE X Unified Launcher Script.
Starts FastAPI backend server on http://localhost:8000 and Vite frontend on http://localhost:5173.
"""

import subprocess
import sys
import time
import os

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def main():
    print("=" * 60)
    print("FORGE X — ORGANIZATIONAL INTELLIGENCE COMPILER")
    print("From how people work -> to how machines can reason.")
    print("=" * 60)

    # Start FastAPI Backend
    print("[1/2] Launching FastAPI Backend on http://localhost:8000...")
    backend_proc = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "apps.api.main:app", "--host", "0.0.0.0", "--port", "8000"],
        cwd=ROOT_DIR,
    )

    # Start Frontend Dev Server
    print("[2/2] Launching Vite Frontend on http://localhost:5173...")
    frontend_proc = subprocess.Popen(
        ["npm", "run", "dev"],
        cwd=os.path.join(ROOT_DIR, "apps", "web"),
        shell=True,
    )

    print("\n" + "=" * 60)
    print("SYSTEM OPERATIONAL!")
    print("  -> Frontend Command Center: http://localhost:5173")
    print("  -> Backend API & Docs:      http://localhost:8000/docs")
    print("  -> Moss Sub-10ms Retrieval: ACTIVE")
    print("Press Ctrl+C to terminate.")
    print("=" * 60)

    try:
        while True:
            time.sleep(1)
            if backend_proc.poll() is not None:
                print(f"\n[!] Backend process exited unexpectedly with code {backend_proc.returncode}")
                break
            if frontend_proc.poll() is not None:
                print(f"\n[!] Frontend process exited unexpectedly with code {frontend_proc.returncode}")
                break
    except KeyboardInterrupt:
        print("\nShutting down FORGE X services...")
    finally:
        if backend_proc.poll() is None:
            backend_proc.terminate()
        if frontend_proc.poll() is None:
            frontend_proc.terminate()
        print("Shutdown complete.")


if __name__ == "__main__":
    main()
