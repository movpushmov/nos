# NOS — not openapi spec, new generation of specs describing.

NOS introduces a novel approach to defining and managing specifications for your projects. Instead of writing traditional OpenAPI specs, you organize your specs as TypeScript files inside a source directory. Each file declares one or more "projects" — collections of specs, endpoints, and types relevant to your application's domain.

In your backend and frontend projects, you simply create configuration files that point to this shared source directory. From these TypeScript sources, NOS automatically generates types and constants that are fully synchronized between your backend and frontend. This ensures type safety, reduces duplication, and prevents inconsistencies that often arise when maintaining separate spec and implementation files.

**Why NOS is better than a default specification approach:**

- **Unified Source of Truth:** Your specs live alongside your code in TypeScript, eliminating the drift between code and documentation.
- **Zero Boilerplate:** No need for verbose adapters or transformers — just organize your source files and reference them in your config.
- **Automatic Type Generation:** Types and constants are generated directly from your TypeScript sources. This enables instant, type-safe API usage across your stack.
- **Framework Agnostic:** NOS works with any library or framework (like Elysia, Hono, Express, NestJS, etc.) because it operates independently of your backend implementation.
- **No Manual Sync:** Say goodbye to manually updating OpenAPI (or other spec) files every time your API changes. Update your source, and everything stays in sync.

This approach streamlines development, enhances safety and maintainability, and keeps your project agile as it grows.
