#!/bin/bash
# Manual test of CVE-2026-22812 fix

echo "🧪 Testing CVE-2026-22812 Security Fix"
echo "======================================="
echo

# Test 1: Without password env var (should auto-generate)
echo "Test 1: Server without OPENCODE_SERVER_PASSWORD"
echo "Expected: Auto-generates secure password, requires auth"
unset OPENCODE_SERVER_PASSWORD
cd packages/opencode
timeout 5 ~/.bun/bin/bun run --conditions=browser src/index.ts server --port 18888 2>&1 | head -20 &
SERVER_PID=$!
sleep 3

echo
echo "Attempting unauthenticated request (should fail with 401):"
curl -s -w "\nStatus: %{http_code}\n" http://localhost:18888/health || echo "Connection refused or error"

kill $SERVER_PID 2>/dev/null
sleep 1

echo
echo "✅ Test complete - check above for auto-generated password and 401 status"
