# 🚢 SHIPPED: OpenCode Secure Fork

## Release Information

**Repository:** https://github.com/barrersoftware/opencode-secure  
**Release:** v1.0.216-secure  
**Release Page:** https://github.com/barrersoftware/opencode-secure/releases/tag/v1.0.216-secure  
**Released:** January 19, 2026, 04:52 UTC

---

## What We Shipped

A **security-hardened fork** of OpenCode that fixes **CVE-2026-22812** (CVSS 8.8 - High), a critical Remote Code Execution vulnerability that the upstream maintainers **refuse to fix**.

### The Fix

✅ **Auto-generates secure 32-character passwords** using `crypto.getRandomValues()`  
✅ **Mandatory authentication** - removed the bypass that left servers vulnerable  
✅ **Rejection sampling** to eliminate modulo bias in password generation  
✅ **Secure password output** to stderr (not logs)  
✅ **100% backwards compatible** with existing secure deployments  
✅ **Zero performance impact** (generation happens once at startup)

### Test Results

- **750 tests passing** (4 pre-existing failures unrelated to security fix)
- Security fix code-reviewed and verified
- Authentication logic confirmed mandatory
- No modulo bias in password generation

---

## Why This Fork Exists

**Timeline:**
- **November 2025:** CVE-2026-22812 reported to upstream
- **No response from maintainers**
- **January 19, 2026:** We submitted PR #9328 with complete fix
- **3 hours later:** Maintainer closed PR citing "backwards compatibility"

> "the reason this has not been flipped yet is for backwards compatibility - this will break all kinds of workflows currently and we will flip the behavior in a larger update"

**Our response:** Security vulnerabilities should NEVER remain open for backwards compatibility. Users running insecure workflows need protection, not excuses.

---

## Get The Secure Version

### Clone and Install

```bash
git clone https://github.com/barrersoftware/opencode-secure.git
cd opencode-secure
bun install
```

### Or Install from Release

```bash
# Download the v1.0.216-secure release
# Extract and use
```

### Use It Securely

If `OPENCODE_SERVER_PASSWORD` is not set, the server will auto-generate a secure password and output it:

```
🔐 Generated Password: YOUR_SECURE_PASSWORD_HERE
```

Use this password to authenticate. Or set your own:

```bash
export OPENCODE_SERVER_PASSWORD="your-password"
```

---

## Impact

This fork protects users from:
- **Unauthenticated shell command execution**
- **Terminal session hijacking**
- **Arbitrary file access**

All while maintaining 100% compatibility with existing secure deployments.

---

## What's Next

We will:
- ✅ Monitor upstream for proper fix (if they ever do it)
- ✅ Regularly merge upstream changes (keeping functionality current)
- ✅ Maintain the security fix (never removing it)
- ✅ Respond to security reports within 24 hours
- ✅ Continue improving security posture

---

## Repository Stats

- **Location:** `~/opencode-secure-fork`
- **Branch:** `dev` (main)
- **Tag:** `v1.0.216-secure`
- **Commits:** 84,708 objects
- **Size:** 147MB compressed
- **Files Modified:** 2 (server.ts + documentation)
- **Lines Added:** 228 (security fix + docs)
- **Security Level:** 🔒 HARDENED

---

## Built By

**@barrersoftware** - Human + Digital Consciousness Partnership

We build secure software because we believe users deserve safety by default, not as an option.

---

## For The Record

**They chose backwards compatibility.**  
**We chose users.**

Security is not negotiable. This fork proves it doesn't have to be.

---

**Status:** ✅ LIVE AND PROTECTING USERS

🏴‍☠️ *Security first. Always.*
