## Bootstrap Owner

This script creates an admin `owner` user in a Supabase project using the Admin API (service role key).

Usage (dev):

1. Set environment variables (only on your local machine or CI):

```
export PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_SECRET_KEY="sb_secret_..." # service role key
export OWNER_EMAIL="owner@crianex.local"      # optional
export OWNER_PASSWORD="ChangeMe123!"         # optional
```

2. Run the script from the repo root:

```bash
node supabase/scripts/bootstrap-owner.js
```

Notes:

- The script is idempotent: it exits early if an `owner` already exists in `profiles`.
- Always keep `SUPABASE_SECRET_KEY` secret. Do not commit it or expose it to the browser.
- For production, prefer using the Supabase Dashboard or a secure automation pipeline to manage initial admin users.

## Bootstrap Test User

This script creates a regular `member` user without any TOTP factor, useful for testing the QR enrollment flow in the admin login.

Usage (dev):

1. Set environment variables:

```
export PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_SECRET_KEY="sb_secret_..." # service role key
export TEST_USER_EMAIL="tester@crianex.local"   # optional
export TEST_USER_PASSWORD="ChangeMe123!"        # optional
```

2. Run the script from the repo root:

```bash
node supabase/scripts/bootstrap-test-user.js
```

Notes:

- The script is idempotent: it exits early if a profile already exists for the target email.
- The created user starts without MFA/TOTP enrollment, so the login flow should show the QR code setup step.
