import urllib.request
import json
import sys

endpoints = [
    '/api/health',
    '/api/metrics/moss',
    '/api/command-center',
    '/api/archaeology',
    '/api/genomes',
    '/api/playbooks',
    '/api/audit/ledger',
    '/api/policies/summary',
    '/api/risk/findings',
    '/api/incidents',
    '/api/red-team/scenarios',
    '/api/red-team/evolution',
    '/api/reliability/summary',
    '/api/memory/summary'
]

success = True
for ep in endpoints:
    url = f'http://localhost:8000{ep}'
    try:
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req, timeout=5) as resp:
            print(f'[OK] {ep} -> {resp.status}')
    except Exception as e:
        print(f'[FAIL] {ep} -> {e}')
        success = False

sys.exit(0 if success else 1)
