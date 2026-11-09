# Contributing

> [!IMPORTANT]
> **Contributions are temporarily limited.** Beauty Ally currently has no public or self-hostable API endpoint that can be shared with contributors. The mobile client therefore cannot be run end-to-end from a fresh clone, and normal feature contributions cannot be tested reliably yet. For now, this repository is primarily a portfolio and architecture snapshot. This notice will be updated when a contributor-ready backend or development API becomes available.

Thank you for taking the time to improve Beauty Ally.

## Development setup

1. Use the Node.js version in `.nvmrc`.
2. Run `npm ci`.
3. Copy `.env.example` to `.env.local` and add your development configuration.
4. Run `npm run ios` or `npm run android` to create a development build.
5. Run `npm run check` before opening a pull request.

Never commit `.env` files, signing material, access tokens, production credentials, or user data.

## Code organization

- Keep files in `app/` as composition roots: assemble the screen there and move domain behavior into the owning feature.
- Put feature-specific components, hooks, and models under `features/<feature>`.
- Keep `components/ui` domain-agnostic and reusable.
- Put authenticated backend calls behind `services/` and use the centralized API client.
- Validate new backend response shapes with Zod.
- Use TanStack Query for server state rather than duplicating remote data in local component state.
- Add analytics through the typed analytics client and never include sensitive user data.

Prefer a cohesive extraction over splitting code solely to reduce line count.

## Tests

Add or update the narrowest useful test when changing behavior. Tests should describe user-visible outcomes or domain rules rather than implementation details.

```bash
npm run test:ci
npm run check
```

## Pull requests

- Keep the change focused and explain the user-facing outcome.
- Include screenshots or recordings for visual changes.
- Document configuration or migration requirements.
- Confirm iOS and Android behavior when changing native capabilities.
- Keep generated artifacts, local IDE state, and credentials out of the commit.
