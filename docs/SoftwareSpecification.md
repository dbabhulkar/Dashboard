# Software Specification Document
**Project:** One View Indicator (OVI) Dashboard
**Version:** 1.0
**Date:** 2026-03-30
**Status:** Active Development (UAT / Live)

---

## 1. Introduction

### 1.1 Purpose of the System
The One View Indicator (OVI) Dashboard is an internal banking operations platform designed to provide Relationship Managers (RM) and Commercial Managers (CM) with a unified, real-time view of their portfolio health, delinquency metrics, compliance status, audit use reviews, loan credit handling, and watch list monitoring. It serves as a central decision-support tool for credit risk and relationship management teams.

### 1.2 Scope of the Document
This document covers the full functional and technical specification of the OVI Dashboard web application — including authentication, role-based dashboards, data modules, file upload workflows, bulletin management, reporting, and the underlying architecture.

### 1.3 Definitions, Acronyms, and Abbreviations

| Term | Definition |
|---|---|
| OVI | One View Indicator — the application name |
| RM | Relationship Manager — manages client portfolios |
| CM | Commercial Manager — manages commercial credit portfolios |
| AUR | Audit Use Review — periodic review of account usage |
| LCHU | Loan Credit Handling Unit — manages loan approval/handling |
| DPD | Days Past Due — measure of payment delinquency |
| APR | Annual Percentage Rate (also used as a data category) |
| LSID | Loan Source ID — internal identifier for loan source |
| PMS | Portfolio Management System — external integrated system |
| SP | Stored Procedure — SQL Server database procedure |
| UAT | User Acceptance Testing — pre-production environment |
| ISAC | Internal Service Access Control — IT access request system |
| SMTP | Simple Mail Transfer Protocol |
| SSIS | SQL Server Integration Services — ETL tooling |
| LDAP | Lightweight Directory Access Protocol — Active Directory |
| AES | Advanced Encryption Standard |

---

## 2. Overall Description

### 2.1 Product Perspective
OVI Dashboard is a standalone internal web application that integrates with:
- SQL Server databases (DashBoard)
- Active Directory (LDAP) for enterprise authentication
- A Vault API for encrypted connection string and credential management
- An external PMS (Portfolio Management System) for RM login redirection
- SMTP services for email notifications

### 2.2 Product Functions (High-Level Features)

| # | Feature | Description |
|---|---|---|
| 1 | Role-Based Authentication | Separate login flows for RM and CM users with LDAP/AD validation |
| 2 | RM Dashboard | Portfolio overview with counts, limits, exposure %, delinquency heatmap, compliance, bulletins |
| 3 | CM Dashboard | Commercial manager view with segment/location/LSID filters |
| 4 | Delinquency Monitoring | DPD breakdown matrix (15/30/60 days) with color-coded risk indicators |
| 5 | AUR (Audit Use Review) | Periodic audit review data with monthly trend tracking |
| 6 | LCHU Monitoring | Loan credit handling unit dashboard |
| 7 | Watch List Management | Risk watch list with account-level monitoring |
| 8 | File Upload & Bulk Import | Excel/pipe-delimited file ingestion for Portfolio, APRs, RM Hierarchy, Client Mapping, Leads, etc. |
| 9 | Urgent Bulletin System | Create, view, and delete internal alerts with file attachments |
| 10 | Quick Links Management | Personalized bookmarks with URL, description, frequency |
| 11 | Notification Center | Notification badges and detail views |
| 12 | To-Do List | Task tracking integrated with bulletin system |
| 13 | Feedback Collection | Module-level ratings and remarks submission |
| 14 | Email Logging | Automated email dispatch with database audit trail |
| 15 | Productivity Tracking | Logs every user action (login, module access, form submission) |
| 16 | Commercials Module | Commercial client pricing, asset pricing, trade pricing, account customization, reversal approval |

### 2.3 User Classes and Characteristics

| User Class | Description | Access |
|---|---|---|
| Relationship Manager (RM) | Front-line bankers managing client portfolios | RM Dashboard, Portfolio, Delinquency, Compliance, Bulletins, Quick Links |
| Commercial Manager (CM) | Credit/commercial risk managers | CM Dashboard, Delinquency, AUR, LCHU, Watch List, Commercials |
| Report User | Read-only analytics users | Report views only |
| Admin/Upload User | Operations team managing data imports | Upload module, Bulletin management |
| System | Automated background processes | Email dispatch, activity logging |

### 2.4 Assumptions and Dependencies
- The application runs on an internal corporate network with access to `myazuredom.com` domain services.
- Active Directory authentication is enabled in Live; bypassed (always valid) in UAT.
- A Vault API (`btgrvaultdb1.myazuredom.com:8003`) must be reachable for database connection strings in Live.
- SQL Server instance (`DESKTOP-D2NU5KD\SQLEXPRESS` in UAT) hosts the `DashBoard` database.
- All stored procedures (`SP_OVI_*`, `sp_Login_New`, etc.) must exist and be accessible.
- Client browsers must support JavaScript (jQuery/AJAX), HTML5, and AES crypto libraries.
- Session timeout is set to 30 minutes of inactivity.

---

## 3. System Architecture

### 3.1 High-Level Architecture
The system follows a **Monolithic ASP.NET Core MVC** architecture with a layered design:

```
[Browser / Client]
       |
       ▼
[ASP.NET Core MVC — Controllers]
       |
  ┌────┴────┐
  ▼         ▼
[Models /  [Repositories /
 Helpers]   Interfaces]
  |              |
  └──────┬───────┘
         ▼
  [ADO.NET — SqlClient]
         |
         ▼
  [SQL Server — Stored Procedures]
  DashBoard | Hunt | SMTP | SSIS
```

### 3.2 Technology Stack

| Layer | Technology |
|---|---|
| Framework | ASP.NET Core 8.0 (MVC) |
| Language | C# (.NET 8) |
| Frontend | Razor Views (.cshtml), HTML5, CSS3 |
| JavaScript | jQuery, DataTables, Bootstrap 5, CryptoJS (AES) |
| CSS Libraries | Bootstrap 5, DataTables Bootstrap theme, Chosen.js, Select2 |
| Data Access | ADO.NET (System.Data.SqlClient 4.8.6) — No ORM |
| Database | Microsoft SQL Server (SQL Server 2022, Compatibility 160) |
| Excel Processing | ClosedXML 0.102.2 |
| Authentication | Session-based + LDAP/Active Directory (System.DirectoryServices 8.0.0) |
| Encryption | AES (custom AESEncryptDecrypt + client-side CryptoJS) |
| Secrets Management | Vault API (REST) with AES-encrypted responses |
| Email | SMTP via database-driven credentials |
| ETL | SQL Server Integration Services (SSIS) |
| Hosting | IIS (internal corporate intranet) |

### 3.3 Integration Points

| System | Integration Type | Purpose |
|---|---|---|
| PMS (Portfolio Management System) | HTTP redirect with encrypted USERID param | SSO-style redirect login from PMS |
| Vault API (`btgrvaultdb1.myazuredom.com:8003`) | REST API (HTTPS) | Retrieve encrypted DB connection strings |
| Vault API (`10.226.84.14:9005`) | REST API (HTTPS) | Update login attempt status (success/fail/lock) |
| Active Directory (`ldap.myazuredom.com`) | LDAP | Enterprise user authentication |
| SMTP Database | SQL connection | Email dispatch and logging |
| SSIS Database | SQL connection | ETL pipeline for bulk data imports |

---

## 4. Functional Requirements

### 4.1 Authentication Module

| ID | Requirement | Input | Processing | Output |
|---|---|---|---|---|
| FR-1 | User login via form | UserName, Password | AES-encrypt password on client; validate via `sp_Login_New`; check session overlap (5-min threshold) | Redirect to SelectionPage or error message |
| FR-2 | PMS SSO redirect login | USERID (encrypted query param), IP | Decrypt USERID; set session; call `SP_OVI_ValidateUser` for business roles | Redirect to RM or CM dashboard |
| FR-3 | Multi-login protection | Session timestamps | Compare LastLoginDate vs LastLogoutDate; block if active session < 5 mins old | Error: "User is already Logged-in" |
| FR-4 | Active Directory validation | Domain, Username, Password | LDAP bind to `ldap.myazuredom.com`; confirm entry found | Boolean success/failure |
| FR-5 | Business role selection | sectionType (RMView / CMView) | Check BusinessRole session var; validate against `checkRMUserMaster` | Redirect to role-specific dashboard |
| FR-6 | Logout | Session | Clear all session keys; redirect to PMS logout URL with `?LogOut=1` | Logged out, redirected |
| FR-7 | Failed login tracking | UserName | Increment failed attempt counter via Vault API; lock account after 3 attempts | Account locked via `LockUserId` API |
| FR-8 | Session validation | Every request | CustomFilter checks `EmpId` session key | Redirect to `_SessionExpiry` partial if null |

### 4.2 RM Dashboard Module

| ID | Requirement | Input | Processing | Output |
|---|---|---|---|---|
| FR-9 | Portfolio summary | USERID, IP (encrypted) | Decrypt params; call `SP_OVI_Get_Dashboard_Records` | Cards: APR count, Client count, Fund/NonFund Limit, Exposure % |
| FR-10 | Portfolio data refresh | AJAX GET | Fetch portfolio counts and exposure percentages | Updated dashboard cards |
| FR-11 | Delinquency heatmap | UserId | `GetDelinquencyDetails()` via repository | Color-coded delinquency breakdown by DPD |
| FR-12 | Compliance items | UserId | `GetComplianceItem()` | Compliance alerts list |
| FR-13 | Urgent bulletins | None | `SP_OVI_Urgent_Bulletin` | Bulletin count badge + list |
| FR-14 | To-do list | None | `SP_OVI_Urgent_Bulletin` (with flag) | Task list with counts |
| FR-15 | Client search / autocomplete | Search term | `AutoComplete()` endpoint | Matching client name list |
| FR-16 | Quick links management | URL, Description, Frequency | Save/Delete/Get via `saveRecord()` / `deleteRecord()` | Sidebar quick links |
| FR-17 | Export to CSV | USERID | `ExportExcel()` via UploadController | CSV file download |
| FR-18 | Notifications | Flag parameter | `GetNotificationDetails()` | Notification detail panel |
| FR-19 | Feedback submission | Module, Rating, Remarks | `SaveFeedBack()` | Stored feedback with module reference |

### 4.3 CM Dashboard Module

| ID | Requirement | Input | Processing | Output |
|---|---|---|---|---|
| FR-20 | CM dashboard load | USERID, IP (encrypted) | Decrypt; log activity via `USP_Insert_Data_In_Activity_Log_Tracker` | CM dashboard with portfolio segments |
| FR-21 | Portfolio by segment | Segment, Location, LSID, Date | `SP_OVI_CMViewDashboardData` | Filtered portfolio cards |
| FR-22 | Delinquency matrix | Segment, Location, LSID, DateTime | `SP_OVI_CMDelinquency` | DPD matrix with color codes and monthly totals |
| FR-23 | AUR data | Segment, Location, LSID, DateTime | `SP_OVI_CMAUR` | AUR summary with monthly trend |
| FR-24 | LCHU data | Segment, Location, LSID, DateTime | Similar SP call | LCHU metrics |
| FR-25 | Watch list | Segment, Location, LSID, DateTime | Similar SP call | Account watch list grid |

### 4.4 File Upload Module

| ID | Requirement | Input | Processing | Output |
|---|---|---|---|---|
| FR-26 | Excel file upload | File, File Type (dropdown) | Validate rows via `ValidExcelRows()`; bulk insert via `SqlBulkCopy` | Success count / error report |
| FR-27 | Upload error report | UserId, Proc Name | `GetUploadErrorList()` | Error detail grid |
| FR-28 | Supported upload types | — | Portfolio, APRs, RM Hierarchy, Client-RM Mapping, Fresh Leads, Delinquency Customer/Account, Compliance, Acquisitions | Type-specific validation and import |

### 4.5 Bulletin Module

| ID | Requirement | Input | Processing | Output |
|---|---|---|---|---|
| FR-29 | Create bulletin | Title, Body, File attachment | Save file to `wwwroot/UrgentBulletin/`; call `SP_OVI_Urgent_Bulletin` | New bulletin created |
| FR-30 | View bulletins | None | Fetch active bulletins | Bulletin list with attachments |
| FR-31 | Delete bulletin | Bulletin ID | `SP_OVI_Urgent_Bulletin` (delete flag) | Bulletin removed |

### 4.6 Commercials Module

| ID | Requirement | Input | Processing | Output |
|---|---|---|---|---|
| FR-32 | Account customization | Account details, waiver params | Form submission | Customization saved |
| FR-33 | Asset pricing view | Account/facility reference | Fetch pricing data | Pricing detail panel |
| FR-34 | Trade pricing | Trade reference | Fetch trade pricing | Trade pricing breakdown |
| FR-35 | Reversal approval | Transaction reference | Submit reversal request | Approval workflow triggered |

---

## 5. Non-Functional Requirements

### 5.1 Performance
- Dashboard pages must load within 3 seconds under normal network conditions.
- AJAX data refresh operations must complete within 2 seconds.
- Bulk file uploads must handle up to 10,000 rows without timeout (SqlCommand.CommandTimeout = 0).
- DataTables with fixed headers/columns must render without browser lag for up to 1,000 rows.

### 5.2 Security
- All passwords are AES-encrypted on the client before transmission (CryptoJS, key `8080808080808080`).
- All inter-system URLs containing user identity (USERID, IP) are AES-encrypted.
- Session-based authorization enforced on every controller action via `CustomFilter` attribute.
- Session idle timeout: 30 minutes.
- Session cookie marked as Essential.
- LDAP authentication against corporate AD for Live environment.
- Failed login attempts tracked; account locked after 3 failures.
- Database connection strings stored in an external Vault API (not in config files).
- HTTPS enforced via `UseHttpsRedirection()`.

### 5.3 Scalability
- The application is monolithic and horizontally scalable via IIS with shared SQL Server backend.
- Session state is in-memory (single server); sticky sessions required if load balanced.
- Bulk import uses `SqlBulkCopy` for high-volume data ingestion.

### 5.4 Availability
- Vault API has a primary (`btgrvaultdb1`) and fallback (`btgrvaultapp`) endpoint for resilience.
- No explicit health check endpoints are implemented (future enhancement).

### 5.5 Maintainability
- Business logic is encapsulated in stored procedures, enabling DB-side changes without redeployment.
- Repository pattern (`IDashboard` / `DashboardRepository`) provides abstraction for data access.
- Environment-specific behavior (UAT vs Live) is toggled via inline code comments; should be externalized to configuration.
- Logging via `CaptureProductivityDetails()` provides audit trail for all key user actions.

---

## 6. Data Model

### 6.1 Key Entities and Relationships

```
[User / Employee]
  └── has roles ──► [BusinessRole] (RM, CM)
  └── maps to ──► [LandingPage / DeptMapping]
  └── has ──► [LoginLog] (LastLoginDate, LastLogoutDate, FailedAttempts)

[Portfolio]
  └── belongs to ──► [RM / CM]
  └── has ──► [APRCount, ClientCount, FundLimit, NonFundLimit, ExposurePct]

[Delinquency]
  └── filtered by ──► [Segment, Location, LSID, Date]
  └── has ──► [DPD15, DPD30, DPD60 counts + monthly totals + color codes]

[AUR]
  └── filtered by ──► [Segment, Location, LSID, Date]
  └── has ──► [Monthly AUR counts and trend data]

[LCHU]
  └── same filter structure as AUR/Delinquency

[WatchList]
  └── same filter structure as AUR/Delinquency

[Bulletin]
  └── has ──► [Title, Body, FilePath, CreatedBy, CreatedDate]

[QuickLink]
  └── belongs to ──► [User]
  └── has ──► [URL, Description, Frequency, IdentityFlag, Name]

[UploadFile]
  └── has type ──► [Portfolio | APRs | RMHierarchy | ClientRMMapping | FreshLeads | Delinquency | Compliance | Acquisitions]
  └── has ──► [UploadDate, Status, ErrorRows]

[Feedback]
  └── belongs to ──► [User]
  └── has ──► [Module, Rating, Remarks, SubmittedDate]

[ProductivityLog]
  └── belongs to ──► [User]
  └── has ──► [FormName, ModuleName, TotalCount, Activity, ActivityDetails, Timestamp]

[EmailLog]
  └── has ──► [From, To, CC, Subject, Body, SentDate, Status]
```

### 6.2 Database Schema (Key Tables — Inferred from SPs and Models)

| Table / SP | Key Columns | Notes |
|---|---|---|
| `sp_Login_New` | @Type, @Empcode → EmpName, BranchCode, ProfileDescription, User_Role, ID, Active, LastLoginDate, LastLogoutDate | Central user master lookup |
| `sp_Login_New_RMView` | Same as above | RM-specific user validation |
| `SP_OVI_ValidateUser` | @UserId → EmpCode, Business | Returns business roles (RM/CM) per user |
| `SP_OVI_Get_Dashboard_Records` | → APRCount, ClientCount, FundLimit, NonFundLimit, ExposurePct, UploadedDate | RM dashboard portfolio summary |
| `SP_OVI_CMViewDashboardData` | @Segment, @Location, @LSID, @DelinquencyData → Portfolio objects | CM portfolio data |
| `SP_OVI_CMDelinquency` | @Segment, @Location, @LSID, @DateTime → DPD metrics, ColorCode, MonthlyTotals | CM delinquency matrix |
| `SP_OVI_CMAUR` | Same filters → AUR metrics | CM audit use review |
| `SP_OVI_Urgent_Bulletin` | @Flag, @Id → Bulletins, ToDo items, counts | Bulletin CRUD + count |
| `check_user` | @userid, @intdataid → Dept | Landing page mapping |
| `Check_Report_Login` | @emp_code → count | Report user check |
| `USP_Insert_Data_In_Activity_Log_Tracker` | Login and access events | CM dashboard activity log |
| `SP_OVI_EmailLog` | Email metadata | Email audit log |
| `SP_MAIL_SAVE` | Email body/recipients | SMTP database stored procedure |

### 6.3 Custom SQL Table Types

| Type Name | Purpose |
|---|---|
| `tt_PMS_Deale_Financial_ExposureDetails` | Bulk exposure detail records |
| `tt_PMS_Deale_Financial_OtherFacilityDetails` | Bulk facility detail records |
| `tt_PMS_Deale_Financial_PrincipleDetails` | Bulk principle detail records |

### 6.4 Response JSON Structure

```json
{
  "msg": "Error or success message",
  "isSuccess": "true" | "false",
  "url": "/redirect/path"
}
```

---

## 7. API Specifications

### 7.1 Internal Application Endpoints

| Method | Route | Controller | Action | Description |
|---|---|---|---|---|
| GET | `/Login/Index` | LoginController | Index | Login page / PMS SSO entry |
| POST | `/Login/LoginUser` | LoginController | LoginUser | Authenticate user |
| POST | `/Login/LogoutUser` | LoginController | LogoutUser | Logout and redirect |
| GET | `/Login/SelectionPage` | LoginController | SelectionPage | RM/CM role selection |
| POST | `/Login/SelectedPage` | LoginController | SelectedPage | Route to dashboard by role |
| GET | `/Home/Dashboard` | HomeController | Dashboard | RM dashboard |
| GET | `/Home/GetPortfolioData` | HomeController | GetPortfolioData | Portfolio summary data |
| GET | `/Home/GetUrgentBulletinData` | HomeController | GetUrgentBulletinData | Bulletin list |
| GET | `/Home/UrgentBulletinCount` | HomeController | UrgentBulletinCount | Bulletin + to-do count |
| GET | `/Home/GetNotificationDetails` | HomeController | GetNotificationDetails | Notification details |
| POST | `/Home/Get_Master_Search_Data` | HomeController | Get_Master_Search_Data | Client master search |
| GET | `/Home/AutoComplete` | HomeController | AutoComplete | Client name suggestions |
| GET | `/Home/GetToDoList_Data` | HomeController | GetToDoList_Data | To-do list |
| POST | `/Home/AddSearchDataToSession` | HomeController | AddSearchDataToSession | Session search state |
| POST | `/Home/saveRecord` | HomeController | saveRecord | Save quick link |
| GET | `/Home/GetLinkData` | HomeController | GetLinkData | Get quick links |
| POST | `/Home/deleteRecord` | HomeController | deleteRecord | Delete quick link |
| POST | `/Home/SaveFeedBack` | HomeController | SaveFeedBack | Submit feedback |
| GET | `/Home/DownloadFile` | HomeController | DownloadFile | Export CSV |
| GET | `/CM/CMDashboard` | CMController | CMDashboard | CM dashboard |
| GET | `/Delinquency/Delinquency` | DelinquencyController | Delinquency | Delinquency view |
| GET | `/Delinquency/GetCMDelinquencyPageData` | DelinquencyController | GetCMDelinquencyPageData | Delinquency data |
| GET | `/CMAUR/CMAUR` | CMAURController | CMAUR | AUR view |
| GET | `/CMAUR/GetCMAURPageData` | CMAURController | GetCMAURPageData | AUR data |
| GET | `/CMLCHU/CMLCHU` | CMLCHUController | CMLCHU | LCHU view |
| GET | `/CMWatchList/CMWatchList` | CMWatchListController | CMWatchList | Watch list view |
| GET | `/Upload/Index` | UploadController | Index | File upload page |
| POST | `/UrgentBulletin/Create` | UrgentBulletinController | Create | Create bulletin |
| GET | `/UrgentBulletin/Delete` | UrgentBulletinController | Delete | Delete bulletin |
| GET | `/Common/SessionExpiry` | CommonController | SessionExpiry | Session expiry partial |
| GET | `/Error` | ErrorController | Index | Global error handler |

### 7.2 External API Integrations

#### Vault DB API
- **Base URL:** `https://btgrvaultdb1.myazuredom.com:8003/DBVault_API/api/`
- **Fallback:** `https://btgrvaultapp.myazuredom.com:8001/DBVault_API/api/`
- **Auth:** Hardcoded ITGRC codes and Vault IDs (AES-encrypted responses, key: `COE-IHA`)
- **Purpose:** Retrieve encrypted database connection strings

#### Login Update API
- **Base URL:** `https://10.226.84.14:9005/VaultAPIDotnetCore/api/API/{method}`
- **Methods:** `UpdateSuccessfulLoginUsingModel`, `UpdateUnsuccessfulAttempt`, `LockUserId`
- **Auth:** Internal network only

### 7.3 Authentication
- Session-based (cookie) authentication
- No JWT or OAuth2 in current implementation
- CustomFilter attribute validates `EmpId` session key on all protected endpoints

---

## 8. User Interface Overview

### 8.1 Key Screens / Pages

| Page | Route | Description |
|---|---|---|
| Login | `/Login/Index` | Simple card-based form with UserName, Password, and AES encryption before POST |
| Selection Page | `/Login/SelectionPage` | Toggle between RMView and CMView dashboards |
| RM Dashboard | `/Home/Dashboard` | Portfolio cards, delinquency heatmap, compliance section, bulletins, to-do list, quick links, search bar, notifications |
| CM Dashboard | `/CM/CMDashboard` | CM portfolio with segment/location/LSID filters |
| Delinquency | `/Delinquency/Delinquency` | DPD matrix with date filter and color coding |
| AUR | `/CMAUR/CMAUR` | Audit use review metrics grid |
| LCHU | `/CMLCHU/CMLCHU` | Loan handling unit dashboard |
| Watch List | `/CMWatchList/CMWatchList` | Account watch list grid |
| CM One View | `/CMOneView` | Consolidated CM summary |
| Upload | `/Upload/Index` | File type dropdown + upload form |
| Bulletins | `/UrgentBulletin` | Bulletin list, create form, delete |
| Commercials | `/Commercials` | Asset pricing, trade pricing, account customization, reversal approval |
| Feedback | `/Home/Feedback` | Module dropdown, star rating, remarks text area |
| Error | `/Error` | Global error display |
| Session Expiry | Partial view | Inline session timeout warning |

### 8.2 User Workflows

**RM Login Flow:**
```
User navigates to /Login → Enters credentials → AES-encrypt password (client) →
POST /Login/LoginUser → Validate AD + DB → Set session →
GET /Login/SelectionPage → Select RMView → Redirect /Home/Dashboard
```

**PMS SSO Flow:**
```
PMS system redirects → /Login/Index?USERID=<encrypted>&IP=<encrypted> →
Decrypt USERID → Validate business role → Redirect to RM or CM dashboard
```

**CM Data Exploration Flow:**
```
Login → SelectionPage (CMView) → /CM/CMDashboard →
Select Segment / Location / LSID / Date → AJAX call →
SP_OVI_CMDelinquency / SP_OVI_CMAUR etc. → Rendered DataTable
```

**File Upload Flow:**
```
/Upload/Index → Select file type → Choose Excel file →
POST upload → ValidExcelRows() → SqlBulkCopy →
Success count or error report
```

**Bulletin Creation Flow:**
```
/UrgentBulletin/CreateBulletin → Fill title + body → Attach file →
POST /UrgentBulletin/Create → Save to wwwroot/UrgentBulletin/ →
SP_OVI_Urgent_Bulletin (insert) → Visible in RM Dashboard bulletin panel
```

---

## 9. Business Rules

| ID | Rule |
|---|---|
| BR-1 | A user account is locked after 3 consecutive failed login attempts. |
| BR-2 | A user already logged in (session active) cannot log in again within a 5-minute window unless the previous session has been explicitly logged out. |
| BR-3 | Only users mapped in the user master (`sp_Login_New`) can access the application. Unmapped users receive: "Your ID is not mapped." |
| BR-4 | Users with `Active = False` status cannot log in. They are directed to raise an ISAC request (App ID: ISG0000434). |
| BR-5 | A user must have at least one business role (RM or CM) assigned via `SP_OVI_ValidateUser`. |
| BR-6 | RM users can only access the RM Dashboard; CM users can only access CM modules. Dual-role users see a selection screen. |
| BR-7 | All dashboard access requires a valid, non-expired session (CustomFilter). Expired sessions redirect to SessionExpiry partial. |
| BR-8 | IP addresses passed in URLs must be AES-encrypted; the application decrypts and validates them server-side. |
| BR-9 | File uploads must pass row-level validation (`ValidExcelRows`). Invalid rows are logged and excluded from import. |
| BR-10 | Bulletin files are stored on the web server filesystem under `wwwroot/UrgentBulletin/`. |
| BR-11 | Productivity/activity is logged for every login, module access, and form submission via `CaptureProductivityDetails`. |
| BR-12 | The PMS link is retrieved dynamically at login time via `Get_PMS_Link("PMS", "Live")` and stored in the session as `LoginUrl`. |
| BR-13 | Quick links are scoped per user by identity flag and name; users can create, view, and delete their own links. |
| BR-14 | LDAP authentication is active in Live only. UAT always returns `Isvalid = true` for testing purposes. |
| BR-15 | Report users (checked via `Check_Report_Login`) have a distinct session flag and are directed to their own views. |

---

## 10. Error Handling & Edge Cases

| Scenario | Behavior |
|---|---|
| Invalid credentials | Return JSON `{ isSuccess: "false", msg: "Invalid Domain User Name or Password." }` |
| User not in user master | Return JSON error: "Your ID is not mapped…" |
| Inactive user account | Return JSON error with account status and ISAC reference |
| Concurrent login within 5 min | Block with "User is already Logged-in! Kindly Logout and try again." |
| Session expired mid-session | CustomFilter redirects to `_SessionExpiry.cshtml` partial |
| Vault API unreachable | Falls back to secondary Vault API URL; if both fail, connection string retrieval throws exception |
| SQL connection already open | `checkUserMaster()` and related methods call `sqlCon.Close()` at the end; however, shared `sqlCon` field is not thread-safe (potential issue in high-concurrency scenarios) |
| IP address is loopback (`::1`) | Resolved to actual host IP via `Dns.GetHostEntry(Dns.GetHostName()).AddressList[1]` |
| File upload errors | Row-level errors captured by `ValidExcelRows()`; error list retrievable via `GetUploadErrorList()` |
| No business role assigned | User sees error; cannot proceed past SelectionPage |
| LDAP service unreachable | `ValidateActiveDirectoryLogin()` catches exception and returns `false` |
| Null session key access | Guarded by `if (HttpContext.Session.GetString("EmpCode") == null)` checks; redirects to login |
| Bulletin file missing | No explicit check; server would return 404 for missing file links |
| `LogoutUser` with null `LoginUrl` | `RedirectToLogin` uses `Global.LoginUrl`; if null, redirect will fail — edge case in error recovery flows |

---

## 11. Future Enhancements

| # | Enhancement | Rationale |
|---|---|---|
| FE-1 | Externalize UAT/Live toggle to `appsettings.json` | Currently hardcoded inline (`if ("True" == "True")`); unmaintainable |
| FE-2 | Replace shared `SqlConnection` field with per-request connections | Current field-level `sqlCon` is not thread-safe for concurrent requests |
| FE-3 | Introduce proper dependency injection for database context | Constructor manually instantiates `DashboardRepository`; should use DI container |
| FE-4 | Implement distributed session state (Redis) | In-memory sessions break under multi-server load balancing |
| FE-5 | Add health check endpoints (`/health`) | No uptime monitoring capability currently |
| FE-6 | Replace hardcoded AES key (`8080808080808080`) | Rotate keys and store in Vault or `appsettings.json` secrets |
| FE-7 | Add CSRF protection to all POST endpoints | Currently no anti-forgery tokens on AJAX endpoints |
| FE-8 | Implement structured logging (Serilog / NLog) | No application-level logging framework; errors are caught silently |
| FE-9 | Add pagination to all DataTable endpoints | Large datasets may cause memory and performance issues |
| FE-10 | Enable JWT-based API authentication | Current session auth does not support API clients or mobile integration |
| FE-11 | Add unit and integration test coverage | No test projects present in the solution |
| FE-12 | Migrate to Entity Framework Core | Reduce raw SQL dependency and improve query safety |
| FE-13 | Role-based access control via claims | Current role checking is manual string comparison on session keys |
| FE-14 | Bulletin expiry and archival workflow | Currently bulletins are only manually deleted |
| FE-15 | Mobile-responsive CM/RM dashboards | Current layout is desktop-optimized |

---

## 12. Appendix

### 12.1 Project Structure

```
Dashboard/
├── Controllers/
│   ├── LoginController.cs          # Auth, session setup, role routing
│   ├── HomeController.cs           # RM dashboard, quick links, search, feedback
│   ├── CMController.cs             # CM dashboard entry
│   ├── DelinquencyController.cs    # DPD monitoring
│   ├── CMAURController.cs          # Audit use review
│   ├── CMLCHUController.cs         # Loan credit handling
│   ├── CMWatchListController.cs    # Watch list
│   ├── CMOnewViewController.cs     # Consolidated CM view
│   ├── ComercialsController.cs     # Commercial module
│   ├── CriticalDefferalController.cs
│   ├── UploadController.cs         # File upload + CSV export
│   ├── UrgentBulletinController.cs # Bulletin CRUD
│   ├── CommonController.cs         # Shared partials
│   └── ErrorController.cs          # Global error handler
├── Models/
│   ├── Login.cs                    # Auth model
│   ├── clsPortfolio.cs             # Portfolio data model
│   ├── clsCMAUR.cs / clsCMDelinquency.cs / clsCMLCHU.cs / clsCMWatchList.cs
│   ├── Common.cs                   # CM business logic aggregator
│   ├── GetData.cs                  # SP_OVI_CMViewDashboardData caller
│   ├── ConnectionDB.cs             # Vault API connection string fetcher
│   ├── clsConnectionString.cs      # Local/UAT connection string
│   ├── AESEncryptDecrypt.cs        # AES crypto helpers
│   ├── EncryptDecrypt.cs           # General encrypt/decrypt
│   ├── CustomFilter.cs             # Session auth filter
│   ├── ResponseContent.cs          # API response wrapper
│   ├── sendMail.cs                 # Email model
│   ├── ExcelReader.cs              # Excel parser
│   └── ErrorViewModel.cs
├── Views/
│   ├── Login/ Home/ CM/ Delinquency/ CMAUR/ CMLCHU/ CMWatchList/
│   ├── CMOneView/ Commercials/ Upload/ UrgentBulletin/ Error/
│   └── Shared/ (_Layout, _Header, _Sidebar, _Grid, _SessionExpiry, etc.)
├── Interfaces/
│   └── IDashboard.cs
├── Repositories/
│   ├── DashboardRepository.cs
│   └── MailRepository.cs
├── DataHelper/
│   └── SqlHelper.cs                # ADO.NET utility methods + SqlBulkCopy
├── wwwroot/
│   ├── css/ js/ lib/ images/
│   └── UrgentBulletin/             # Uploaded bulletin attachments
├── Program.cs                      # App startup, DI, session, routing
├── appsettings.json
├── DBScripts.sql / DashBoard.sql / Hunt.sql / SMTP.sql / SSIS.sql
└── Dashboard.csproj
```

### 12.2 Key Stored Procedures Reference

| Stored Procedure | Database | Purpose |
|---|---|---|
| `sp_Login_New` | DashBoard | User master lookup for CM/default users |
| `sp_Login_New_RMView` | DashBoard | User master lookup for RM users |
| `SP_OVI_ValidateUser` | DashBoard | Returns business roles (RM/CM) per employee |
| `SP_OVI_Get_Dashboard_Records` | DashBoard | RM portfolio summary data |
| `SP_OVI_CMViewDashboardData` | DashBoard | CM portfolio data with filters |
| `SP_OVI_CMDelinquency` | DashBoard | CM delinquency matrix |
| `SP_OVI_CMAUR` | DashBoard | CM audit use review data |
| `SP_OVI_Urgent_Bulletin` | DashBoard | Bulletin CRUD and counts |
| `check_user` | DashBoard | Landing page / dept mapping |
| `Check_Report_Login` | DashBoard | Report user access check |
| `USP_Insert_Data_In_Activity_Log_Tracker` | DashBoard | CM activity logging |
| `SP_OVI_EmailLog` | SMTP | Email audit logging |
| `SP_MAIL_SAVE` | SMTP | SMTP dispatch |

### 12.3 NuGet Package Versions

| Package | Version | Use |
|---|---|---|
| ClosedXML | 0.102.2 | Excel read/write |
| Nancy | 2.0.0 | JSON utilities |
| System.Data.SqlClient | 4.8.6 | SQL Server connectivity |
| System.DirectoryServices | 8.0.0 | Active Directory / LDAP |

### 12.4 Environment Configuration

| Setting | UAT | Live |
|---|---|---|
| AD Authentication | Bypassed (`Isvalid = true`) | Active (LDAP bind) |
| Active user check | Bypassed (`"True" == "True"`) | DB `Active` column check |
| DB Connection | `DESKTOP-D2NU5KD\SQLEXPRESS` | Vault API |
| Login update API | `ConnectionDB.LoginUpdate()` | Same |
| PMS Link | `cs.Get_PMS_Link("PMS", "Live")` | Same |
