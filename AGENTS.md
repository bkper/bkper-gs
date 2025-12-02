# AGENTS.md

Guidance for AI coding agents working with bkper-gs.

## Overview

Google Apps Script library providing access to the Bkper REST API for bookkeeping within Google Workspace.

## Commands

| Command | Purpose |
|---------|---------|
| `bun test` | Run test suite |
| `bun build` | Full build (clean, test, generate types) |
| `bun run dev` | Watch mode with auto-deploy |
| `bun run push` | Deploy to Google Apps Script |
| `bun run clasp:activate` | Activate stored clasp credentials |

## Architecture

### Class Hierarchy
- `Resource<T>` → Base class with payload management
- `ResourceProperty<T>` → Adds custom property support (key/value pairs)
- Entity classes (`Account`, `Book`, `Transaction`, `Group`, etc.) extend `ResourceProperty`

### Key Patterns
- **Fluent builders**: All entities use method chaining (`.setX().setY().create()`)
- **Service layer**: Namespaces suffixed with `_` handle API communication (e.g., `AccountService_`)
- **Lazy loading**: `Book` loads data on first access via `checkBookLoaded_()`
- **Global namespace**: No ES6 imports/exports; uses `/// <reference path="..."/>` directives

### File Structure
- `src/model/` - Entity classes
- `src/service/` - API communication (internal, suffixed with `_`)
- `src/BkperApp.ts` - Main public API entry point
- `src/Utils_.ts`, `src/CachedProperties_.ts` - Utilities

## Constraints

### Google Apps Script
- Target ES2019 (V8 runtime)
- Module system: `"none"` - all code runs in global scope
- File push order defined in `.clasp.json` for dependency resolution
- Requires HttpRequestApp library for HTTP requests

### TypeScript
- API types from `@bkper/bkper-api-types` under `bkper` namespace
- No implicit any/returns enforced

### Testing
- Mocha + Chai, bundled into single file before execution
- Limited coverage: `test/Group.spec.ts`, `test/Utils_.spec.ts`

## Conventions

- Internal/private items suffixed with `_` (e.g., `Utils_`, `checkBookLoaded_()`)
- Hidden properties end with `_` (filtered by `getVisibleProperties()`)
- Services use static methods for CRUD with JSON serialization
- HTTP requests include retry logic with exponential backoff (up to 5 retries)
