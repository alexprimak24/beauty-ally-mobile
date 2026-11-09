# Security Policy

## Supported code

Security fixes target the latest code on the repository's default branch. Older snapshots and store builds may not receive separate patches.

## Reporting a vulnerability

Please do not open a public issue for a suspected vulnerability.

Use GitHub's **Security** tab to submit a private vulnerability report. Include:

- The affected screen, module, or endpoint.
- Reproduction steps and expected impact.
- The platform and application version.
- A minimal proof of concept without real user data.

Do not include access tokens, private keys, photographs, health-related profile data, or other personal information in the report.

Issues in Clerk, RevenueCat, Expo, PostHog, Sentry, Apple, or Google infrastructure should also be reported through the responsible provider's security process when appropriate.

## Scope notes

The mobile application is a public client. Values prefixed with `EXPO_PUBLIC_` are embedded in the distributed bundle and are not secrets. Authorization and data-access controls must always be enforced by the backend, regardless of client behavior.
