# TUI Authentication Analysis

## The Question
Does the TUI work when the server auto-generates a password?

## The Setup
1. TUI runs `Server.App().fetch()` - internal, in-process
2. Server has auto-generated password in `_generatedPassword`
3. TUI reads `OPENCODE_SERVER_PASSWORD` from env (empty)
4. TUI doesn't send Authorization header
5. Server expects auth...

## The Problem?
TUI calls Server.App().fetch() WITHOUT auth header
→ Auth middleware runs
→ Expects Basic Auth
→ TUI doesn't provide it
→ 401 Unauthorized

## BUT WAIT...
Need to test if this actually happens. The TUI might:
- Already work (auth bypass for internal?)
- Have special handling we missed
- Be broken in upstream too?

## Action Required
Test the TUI with no OPENCODE_SERVER_PASSWORD set
See if it actually fails or if there's something we're missing

