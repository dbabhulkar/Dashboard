# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**One View Indicator (OVI) Dashboard** — internal banking/credit-risk web app for Relationship Managers (RM) and Commercial Managers (CM). ASP.NET Core 8.0 MVC (monolithic), SQL Server backend, Razor/jQuery UI.

See [SoftwareSpecification.md](SoftwareSpecification.md) and [ArchitectureDiagram.md](ArchitectureDiagram.md) for functional scope and layered diagrams.

## Commands

Build, run, and restore from the repo root (containing [Dashboard.sln](Dashboard.sln)):

```bash
dotnet restore
dotnet build
dotnet run --project Dashboard.csproj                      # http profile, dev env
dotnet run --project Dashboard.csproj --launch-profile https
```

Dev URLs come from [Properties/launchSettings.json](Properties/launchSettings.json): `http://localhost:5252`, `https://localhost:7179`. Default route is `Login/Index` (see [Program.cs:61-63](Program.cs#L61-L63)).

No test project, lint config, or CI is present in this repo — don't assume `dotnet test` or similar will run anything.

## Architecture

### Request flow
1. `Login/Index` accepts a pre-authenticated `USERID` (and `IP`) via query string, calls `SP_OVI_ValidateUser` to load the user's `BusinessRole(s)` into session, then redirects to `Home/Dashboard` (RM) or `CM/CMDashboard` (CM) based on role. LDAP fallback lives in the same controller.
2. Every authenticated action is decorated with `[CustomFilter]` ([Models/CustomFilter.cs](Models/CustomFilter.cs)) which checks `Session["EmpId"]` and redirects to `Common/SessionExpiry` when missing. Session lifetime is 30 minutes ([Program.cs:23-26](Program.cs#L23-L26)).
3. Controllers call stored procedures directly via `SqlCommand` + `SqlDataAdapter`/`DataTable` — there is no ORM. `Interfaces/IDashboard` + `Repositories/DashboardRepository` is the one repository-pattern seam; most other controllers do data access inline.
4. Views are server-rendered Razor (`.cshtml`) with Bootstrap 5, jQuery, DataTables, Chosen/Select2. AJAX endpoints return `JsonResult` / `ResponseContent`.

### RM vs CM data flow
- **RM modules** (`Home`, `Delinquency`, `Upload`) do data access directly in the controller or via `DashboardRepository`.
- **CM modules** delegate heavy lifting to [Models/Common.cs](Models/Common.cs), which contains `clsCMDelinquency11()`, `clsCMLCHUMain1()`, `clsCMAURMain1()`, `clsCMWatchListMain1()`. Each of these calls a single stored procedure that returns 8–11 result sets (`DataSet.Tables[0..N]`), which are mapped into nested view-model graphs. When editing CM features, trace the SP result-set ordinal carefully — the table index is the contract.
- [Models/GetData.cs](Models/GetData.cs) follows the same multi-result-set pattern for the CM Portfolio dashboard (`SP_OVI_CMViewDashboardData`).

### UAT / Live toggle
The codebase uses `//UAT` and `//LIVE` comment markers to toggle between environments. Key locations:
- [Models/clsConnectionString.cs:16-19](Models/clsConnectionString.cs#L16-L19) — hardcoded UAT connection string vs. vault-backed Live string.
- [Controllers/LoginController.cs:102-104](Controllers/LoginController.cs#L102-L104) — `Isvalid = true` bypasses LDAP in UAT; `ValidateActiveDirectoryLogin` returns `true` unconditionally at line 391.
- `if ("True" == "True")` guards throughout `LoginController` ([line 113](Controllers/LoginController.cs#L113), [line 496](Controllers/LoginController.cs#L496)) replace the live `Active` status check.

When switching to Live, all `//UAT` / `//LIVE` blocks must be toggled together — they are not wired to a single flag.

### Global static state
[Models/Common.cs:961-964](Models/Common.cs#L961-L964) defines `class Global` with a `public static string LoginUrl`. This is set per-login and read on logout — it is inherently racy under concurrent requests. Don't add more static mutable state; if you need cross-request data, use session.

### Connections & secrets
- [Models/clsConnectionString.cs](Models/clsConnectionString.cs) `GetConnectionString()` is the single entry point. **The UAT string is currently hardcoded and returned unconditionally; the Live branch (via `ConnectionDB.getConString`) is commented out.** Toggling environments means editing that file — there is no config-driven switch.
- [Models/ConnectionDB.cs](Models/ConnectionDB.cs) calls the internal DBVault API (`btgrvaultdb1.hbctxdom.com:8003` with fallback to `btgrvaultapp.hbctxdom.com:8001`) to retrieve AES-encrypted connection strings, then decrypts with `key = "COE-IHA"` via SHA-256-derived key/IV. `ServerCertificateValidationCallback` is set to accept any cert — preserve this only because it matches existing behavior; do not extend that pattern.
- [Models/AESEncryptDecrypt.cs](Models/AESEncryptDecrypt.cs) / `EncryptDecrypt.cs` are used for URL token round-tripping between OVI and the external PMS.
- Mail auth uses a separate vault id (`NewDbVaultIdMail`) through [Repositories/MailRepository.cs](Repositories/MailRepository.cs).

### Data-access conventions (important when editing)
- Many controllers/repositories declare `SqlConnection sqlCon = new SqlConnection(clsConnectionString.GetConnectionString());` as an **instance field** (see [Controllers/LoginController.cs:18](Controllers/LoginController.cs#L18), [Repositories/DashboardRepository.cs:10](Repositories/DashboardRepository.cs#L10)). Controllers are per-request in ASP.NET Core so this is per-request, but the pattern still leaks connections on exceptions — when touching these files, keep `Open`/`Close` pairs balanced and prefer `using` for any new `SqlCommand`/`SqlDataAdapter` you add.
- `DataHelper/SqlHelper.cs` holds a **`public static SqlConnection con`** plus `static` open/close/execute helpers. This is shared across requests and is not thread-safe. Don't add new callers to the static helpers — use a local `SqlConnection` inside the method instead.
- Bulk imports go through `SqlHelper.Upload_Excel` (pipe-delimited `|` text files, not real Excel) and `SqlBulkCopy`. Column ordering must match the destination table exactly; the error-message branches in that method are the user-visible feedback for common failures.
- Stored procedure names follow `SP_OVI_*`. Parameters are passed with `AddWithValue` throughout — match the existing style when adding queries.

### Sessions & roles
Session keys in active use: `EmpId`, `EmpCode`, `EmpName`, `BusinessRole` (comma-joined list, checked with `.Contains("RM")` / `.Contains("CM")`), `sectionType` (`RMView`/`CMView`). Role gating is done by string match on `BusinessRole`, not by a typed enum or `[Authorize(Roles=...)]`.

### Key model classes
- [Models/Common.cs](Models/Common.cs) — **not a utility file**: contains CM business-logic methods, the `Global` static class, and ~30 view-model/DTO classes (`DelinquencyDaysCount`, `AssetPricing`, `TradePricing`, `PortfolioSummary`, `UrgentBulletin`, `QuickLink`, etc.). Most view models used across RM and CM views are defined here.
- [Models/GetData.cs](Models/GetData.cs) — CM Portfolio data access (`GetPortfolioMain`).
- [Models/ResponseContent.cs](Models/ResponseContent.cs) — standard AJAX response shape (`Msg`, `isSuccess`, `Url`). All AJAX endpoints return this or `MessageModel`.
- `CommonClass.SaveLog()` in [Models/Common.cs:1066-1086](Models/Common.cs#L1066-L1086) — audit log writer via `SP_OVI_Log`. Use this pattern when you need to log user actions to the database.

### File layout
- `Controllers/` — one controller per module (RM under `Home`/`Delinquency`/`Upload`/`UrgentBulletin`, CM prefixed `CM*`). `CommonController` handles session expiry and shared lookups.
- `Models/` — view models, the `DBClass`/`ConnectionDB` vault client, `CustomFilter`, crypto helpers, and business-logic classes (`cls*` prefix: `clsCMAUR`, `clsCMDelinquency`, `clsCMLCHU`, `clsCMWatchList`, `clsPortfolio`).
- `Views/<Controller>/` — Razor views. Shared layout and session-expiry partial live in `Views/Shared/`.
- `wwwroot/` — static assets plus runtime folders `Logs/`, `FacilityFiles/`, `AccountCustomizationFiles/`, `SampleFiles/`. `Files/` and `UrgentBulletin/` (outside wwwroot) hold uploaded attachments.
- `bin/` and `obj/` — build output, in `.gitignore`.

### NuGet dependencies
Key packages in [Dashboard.csproj](Dashboard.csproj): `System.Data.SqlClient` (ADO.NET), `ClosedXML` (Excel export), `System.DirectoryServices` (LDAP/AD auth), `Nancy` (legacy, present but lightly used). There is no ORM package.

## Known constraints (mind these when editing)
- No structured logging: errors are frequently swallowed in empty `catch (Exception ex) { }` blocks. If you need to surface a failure, add a `try/catch` that rethrows or writes to the response — don't assume something upstream will log it.
- AJAX endpoints have no antiforgery token wiring; don't add `[ValidateAntiForgeryToken]` without also updating the JS callers.
- Encryption keys (`ConnectionDB.key`, AES keys in `Models/`) are hardcoded. When changing encryption behavior, change both encrypt and decrypt call sites together — there is no central rotation mechanism.
- There is no DI registration for repositories; `LoginController` constructs `DashboardRepository` directly ([Controllers/LoginController.cs:26](Controllers/LoginController.cs#L26)). Follow the same manual-instantiation pattern unless the user asks to introduce DI.
