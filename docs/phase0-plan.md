# Phase 0 — Stabilise and Instrument

## Goal
Make the legacy app observable, config-driven, and testable without touching its architecture.

## Changes (in order)

### 1. Externalize Connection Strings & Configuration
**Files:** `appsettings.json`, `appsettings.Development.json`, `Models/clsConnectionString.cs`, `Program.cs`

- Add `ConnectionStrings:Default` to `appsettings.json` (empty/placeholder)
- Add the UAT connection string to `appsettings.Development.json`
- Modify `clsConnectionString.GetConnectionString()` to read from `IConfiguration` instead of hardcoded string
- Register `IConfiguration` and make it accessible to the static method via a static holder (minimal change) or by injecting into callers
- Remove the `//UAT` / `//LIVE` comment-toggle pattern — environment drives the value

**Approach for static access:** Since `clsConnectionString.GetConnectionString()` is called from ~15+ static/instance sites, introduce a minimal `AppConfiguration` static class that is initialized once in `Program.cs` from `IConfiguration`. This avoids a massive DI refactor in Phase 0 while still externalizing the value.

### 2. Add Serilog Structured Logging
**Files:** `Dashboard.csproj` (new packages), `Program.cs`, new `Middleware/CorrelationIdMiddleware.cs`

- Add NuGet: `Serilog.AspNetCore`, `Serilog.Sinks.Console`, `Serilog.Sinks.File`
- Configure Serilog in `Program.cs` with JSON file sink under `wwwroot/Logs/`
- Add correlation-ID middleware that stamps every request
- Configure Serilog to enrich with correlation ID, request path, user identity (from session)

### 3. Replace UAT/Live Toggle with Environment Configuration
**Files:** `appsettings.json`, `appsettings.Development.json`, `appsettings.Production.json` (new), `Models/clsConnectionString.cs`, `Controllers/LoginController.cs`

- Add a typed `OviSettings` class with `Environment` (UAT/Live), `BypassLdap`, `BypassActiveStatusCheck`
- Bind from `appsettings.{env}.json`
- Replace `if ("True" == "True")` guards in LoginController with config reads
- Replace `Isvalid = true` LDAP bypass with config flag
- Make `AppConfiguration` expose these settings statically for legacy callers

### 4. Add Smoke Test Project
**Files:** New `Dashboard.Tests/` project

- xUnit + `Microsoft.AspNetCore.Mvc.Testing` (WebApplicationFactory)
- Tests conditionally skip when no DB connection is available (via environment variable or connection test)
- Smoke tests:
  - App starts without error
  - Login page returns 200
  - Static assets (CSS/JS) serve correctly
  - Session expiry redirect works

### 5. Add CI Pipeline (GitHub Actions)
**Files:** New `.github/workflows/build.yml`

- Build on every PR and push to master
- `dotnet restore` → `dotnet build` → `dotnet test` (smoke tests skip if no DB)
- No deployment (manual deploys remain)

### 6. Feature Flags Infrastructure
**Files:** `Dashboard.csproj`, `Program.cs`, `appsettings.json`, new `docs/feature-flags.md`

- Add NuGet: `Microsoft.FeatureManagement.AspNetCore`
- Register in Program.cs
- Create initial `docs/feature-flags.md` tracking document
- No flags active yet — infrastructure only

## Files NOT changed (forbidden zones)
- No changes to stored procedures
- No changes to encryption logic (ConnectionDB.cs crypto, AESEncryptDecrypt.cs)
- No changes to authentication flow logic (only config-driving existing toggles)
- No changes to data access patterns

## Rollback
Every change is independent and reverts via `git revert`. No destructive changes.

## Exit Criteria
- Connection string loads from `appsettings.{env}.json`, not hardcoded
- UAT/Live toggle is config-driven
- Serilog writes structured JSON logs with correlation IDs
- Smoke test project exists and runs
- CI pipeline builds and tests on every PR
- Feature management NuGet is registered
