# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is **bkper-gs**, a Google Apps Script library that provides access to the Bkper REST API for bookkeeping and accounting solutions within Google Workspace.

## Development Commands

### Essential Commands
- `bun test` - Run complete test suite (bundles and executes tests)
- `bun build` - Full build process (clean, test, generate types)
- `bun run dev` - Development mode with file watching
- `bun run push` - Deploy to Google Apps Script

### Testing Commands
- `bun run test:bundle` - Compile TypeScript tests to single bundle
- `bun run test:run` - Execute bundled tests with Mocha
- Individual test execution requires running specific describe blocks since all tests are bundled together

### Google Apps Script Integration
- `bun run clasp:login` - Authenticate with Google Apps Script
- `bun run clasp:activate` - Activate stored Bkper clasp credentials
- `bun run open` - Open project in Google Apps Script editor

## Architecture

### Core Structure
- **Entity Classes** - Business objects (Account, Book, Transaction, Group, etc.)
- **Service Classes** - API communication (suffixed with `Service_`)
- **Builder Classes** - Data structure construction (DataTableBuilder variants)
- **Utilities** - Helper functions (Utils_, CachedProperties_)
- **Entry Point** - BkperApp.ts provides the main public API

### TypeScript Configuration
- Target: ES2019 (V8 engine compatibility)
- Module system: "none" (Google Apps Script constraint)
- No ES6 imports/exports - uses global namespace approach

### Testing Architecture
- Framework: Mocha + Chai
- Tests are bundled into single file due to module system constraints
- Source maps enabled for debugging
- Limited test coverage (only Group.spec.ts and Utils_.spec.ts)

## Key Technical Constraints

### Google Apps Script Environment
- Must use V8 runtime (ES2019 features only)
- No module system support - all code runs in global scope
- OAuth scopes required for external requests and user info
- Dependency on HttpRequestApp library for HTTP requests

### Build Process Gotchas
- Uses custom clasp credential management (`~/.clasprc-bkper.json`)
- Mixed package managers (Bun primary, Yarn legacy)
- TypeScript definitions published separately to npm as `@bkper/bkper-gs-types`
- Tests must be bundled before execution due to module constraints

## Development Workflow

1. **Setup**: Ensure clasp authentication with `bun run clasp:activate`
2. **Code Changes**: Use `bun run dev` for automatic deployment during development
3. **Testing**: Run `bun test` to validate changes
4. **Build**: Use `bun build` for complete validation before commits
5. **Deploy**: `bun run push` for manual deployment to Google Apps Script

## Code Patterns

### API Service Pattern
Services follow a consistent pattern:
- Static methods for CRUD operations
- HTTP request handling via HttpRequestApp
- JSON serialization/deserialization
- Error handling with BkperException

### Entity Builder Pattern
Entities use builder pattern for complex object construction:
- Fluent interface for configuration
- Validation before build
- Immutable result objects

### Caching Strategy
- CachedProperties_ utility for performance optimization
- Book-level caching for frequently accessed data
- Time-based cache invalidation