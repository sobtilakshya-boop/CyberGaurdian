# CyberGuardian Workspace Rules & Guidelines

## Registration OTP Bypass Protocol

For local development, testing, and evaluation, Twilio Verify SMS operations might be subject to trial account limitations (e.g. error code `21608` for unverified numbers) or missing credentials. To ensure registration and login flows are fully reliable and never block operators:

1. **Fallback in `register-intent` Route**:
   - If Twilio Verify API triggers an exception during OTP dispatch, log the error details, set a `bypassOtp: true` flag in the registration context payload, and proceed with a success response.
2. **Acceptance in `verify-otp` Route**:
   - The validation route must accept the code `123456` and approve the account creation if the session carries the `bypassOtp` flag, or if the database is falling back to mock storage.
3. **Verification Page Notice**:
   - The `/register/verify` frontend layout must display a clear Sandbox Notice advising users to enter `123456` if sandbox/trial constraints are active.
