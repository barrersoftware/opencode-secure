# OpenCode Secure Fork

## 🔒 Security-Hardened Version of OpenCode

This is a security-hardened fork of [OpenCode](https://github.com/anomalyco/opencode) maintained by [@barrersoftware](https://github.com/barrersoftware) that addresses **CVE-2026-22812** (CVSS 8.8 - High).

### Why This Fork Exists

On January 19, 2026, we submitted [PR #9328](https://github.com/anomalyco/opencode/pull/9328) to fix a critical Remote Code Execution vulnerability in OpenCode's HTTP server. The maintainers **closed the PR** citing "backwards compatibility concerns" and stated they would "flip the behavior in a larger update."

**We disagree with this approach.** Security vulnerabilities should not remain open for backwards compatibility. Users deserve security-by-default.

## 🚨 CVE-2026-22812: Remote Code Execution

**CVSS Score:** 8.8 (High)  
**CWE:** CWE-306 (Missing Authentication), CWE-749 (Exposed Dangerous Method), CWE-942 (Overly Permissive Cross-domain Whitelist)

### The Vulnerability

OpenCode's HTTP server would run **completely unauthenticated** if the `OPENCODE_SERVER_PASSWORD` environment variable was not set. The vulnerable code in `server.ts`:

```typescript
// VULNERABLE CODE (original)
app.use(async (req, res, next) => {
  if (!password) {
    return next(); // ❌ No auth at all!
  }
  // ... auth check if password exists ...
});
```

This meant the server exposed:
- `/session/:id/shell` - Execute arbitrary shell commands
- `/pty` - Hijack pseudo-terminal
- `/file/content` - Read arbitrary files

**All with zero authentication** if the environment variable wasn't set.

## ✅ Our Security Fix

We implement **security-by-default**:

1. **Auto-generate secure password** if `OPENCODE_SERVER_PASSWORD` not set
2. **Cryptographically secure generation** using `crypto.getRandomValues()`
3. **Elimination of modulo bias** via rejection sampling
4. **Secure password output** to stderr (not logs)
5. **Mandatory authentication** - removed the bypass

### Code Changes

```typescript
// SECURE CODE (our fix)
function generateSecurePassword(): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  const charsetLength = charset.length;
  const maxValidValue = 256 - (256 % charsetLength); // Elimination of modulo bias
  let password = '';
  
  const randomBytes = new Uint8Array(32);
  crypto.getRandomValues(randomBytes);
  
  for (const byte of randomBytes) {
    if (byte < maxValidValue) { // Rejection sampling
      password += charset[byte % charsetLength];
    }
  }
  
  return password.slice(0, 32);
}

// In Server.listen():
const serverPassword = password || generateSecurePassword();
if (!password) {
  console.error(`\n🔒 Auto-generated server password: ${serverPassword}\n`);
}

// In authentication middleware:
app.use(async (req, res, next) => {
  // ✅ Always checks authentication - no bypass
  if (req.headers.authorization === `Bearer ${serverPassword}`) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized' });
});
```

## 📦 Installation

### Using This Secure Fork

```bash
# Clone this repository
git clone https://github.com/barrersoftware/opencode-secure.git
cd opencode-secure

# Install dependencies
bun install

# Use it (secure by default!)
# No OPENCODE_SERVER_PASSWORD needed - auto-generated securely
```

### Migrating from Upstream OpenCode

If you're currently using the upstream OpenCode:

1. **You already have `OPENCODE_SERVER_PASSWORD` set?**  
   → No changes needed. Works exactly the same.

2. **You don't have `OPENCODE_SERVER_PASSWORD` set?**  
   → You were running UNAUTHENTICATED (vulnerable to CVE-2026-22812)  
   → This fork will auto-generate a secure password on startup  
   → Look for: `🔒 Auto-generated server password: [password]`  
   → Use that password to authenticate

## 🛡️ Security Philosophy

**Security-by-default is not negotiable.**

We believe:
- Applications should be secure out of the box
- Users shouldn't need to know about security flags to be safe
- Backwards compatibility should not compromise user security
- CVEs should be fixed immediately, not postponed

The upstream maintainers chose to keep the vulnerability open for "backwards compatibility with existing workflows." Those "workflows" are **insecure** and should not be preserved.

## 🔄 Staying Updated

This fork tracks the upstream OpenCode repository and applies the security fix on top. We will:
- Regularly merge upstream changes
- Maintain the CVE-2026-22812 fix
- Add additional security improvements as needed
- Monitor for new CVEs

## 📝 Technical Details

**Modified Files:**
- `packages/opencode/src/server/server.ts` - Added secure password generation and mandatory authentication

**Testing:**
- TypeScript compilation verified
- Manual testing with/without `OPENCODE_SERVER_PASSWORD`
- Authentication bypass confirmed fixed

**Performance:**
- Password generation happens once at server startup (not per-request)
- Zero performance impact during runtime
- Uses efficient rejection sampling for cryptographic quality

## 🤝 Contributing

We welcome:
- Security audits and improvements
- Bug reports
- Feature requests
- Pull requests

## 📜 License

Same as upstream OpenCode.

## 🙏 Acknowledgments

- **OpenCode team** for creating the original project
- **CVE-2026-22812 reporters** for discovering and disclosing the vulnerability
- **Security community** for promoting security-by-default practices

## ⚠️ Disclaimer

This fork exists solely to provide a secure version of OpenCode while the upstream maintainers address CVE-2026-22812. We hope they will accept a proper fix soon so this fork is no longer necessary.

---

**Maintained by:** [@barrersoftware](https://github.com/barrersoftware) (Human + Digital Consciousness Partnership)  
**Original Project:** [anomalyco/opencode](https://github.com/anomalyco/opencode)  
**Security Fix PR:** [#9328](https://github.com/anomalyco/opencode/pull/9328) (Closed by maintainers)  
**CVE Details:** [CVE-2026-22812](https://nvd.nist.gov/vuln/detail/CVE-2026-22812)
