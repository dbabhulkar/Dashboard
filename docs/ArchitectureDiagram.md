# OVI Dashboard - Detailed Architecture Diagram
**Complete System Architecture with Gap Analysis**

---

## 1. CURRENT SYSTEM ARCHITECTURE - HIGH LEVEL

```
┌────────────────────────────────────────────────────────────────────────────┐
│                          PRESENTATION LAYER                                 │
│  ┌─────────────────┐  ┌──────────────────┐  ┌──────────────────┐          │
│  │  RM Dashboard   │  │  CM Dashboard    │  │ Admin/Upload UI  │          │
│  └────────┬────────┘  └────────┬─────────┘  └────────┬─────────┘          │
│           │                    │                      │                     │
│  ┌─────────────────────────────────────────────────────────────┐           │
│  │  HTML5 / Razor Views (.cshtml) - Bootstrap 5 + DataTables  │           │
│  │  JavaScript (jQuery, CryptoJS, Chosen.js, Select2)         │           │
│  └─────────────────────────────────────────────────────────────┘           │
└────────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
          POST/GET  │               │               │ AJAX
                    ▼               ▼               ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                        APPLICATION LAYER (MVC)                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                      CONTROLLERS                                      │  │
│  │  Login | Home | CM | Delinquency | AUR | LCHU | WatchList | Upload │  │
│  │  UrgentBulletin | Commercials | CriticalDeferral | Error | Common   │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                    │                                        │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                      MODELS & HELPERS                                │  │
│  │  Login | Portfolio | Delinquency | AUR | LCHU | WatchList           │  │
│  │  ConnectionDB | EncryptDecrypt | AESEncryptDecrypt | ExcelReader    │  │
│  │  ResponseContent | CustomFilter (auth) | Common (business logic)    │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                    │                                        │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │               REPOSITORIES & INTERFACES                              │  │
│  │  IDashboard ◄─────► DashboardRepository                             │  │
│  │  MailRepository (sends emails)                                       │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                    │                                        │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                      FILTERS & ATTRIBUTES                            │  │
│  │  CustomFilter (session-based auth on every action)                   │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
┌────────────────────────────────────────────────────────────────────────────┐
│            DATA ACCESS LAYER (ADO.NET / Direct SQL)                         │
│  ┌──────────────────────┐  ┌──────────────────────────────────────────┐  │
│  │   SqlCommand         │  │   SqlDataAdapter                         │  │
│  │   SqlConnection      │  │   DataSet / DataTable                    │  │
│  │   SqlBulkCopy        │  │   (Heavy use of stored procedures)       │  │
│  └──────────────────────┘  └──────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼────────────────────┐
                    │               │                    │
                    ▼               ▼                    ▼
        ┌─────────────────────┐  ┌────────────┐  ┌──────────────┐
        │  SQL Server 2022    │  │   Vault    │  │  External    │
        │  ┌──────────────┐   │  │   API      │  │  Integrations│
        │  │ DashBoard    │   │  │            │  │              │
        │  │ Hunt         │   │  │ Retrieve   │  │  PMS Login   │
        │  │ SMTP         │   │  │ encrypted  │  │  LDAP/AD     │
        │  │ SSIS         │   │  │ DB strings │  │  SMTP        │
        │  │              │   │  │            │  │              │
        │  │ Uses 200+ SP │   │  │  Primary:  │  │              │
        │  │ procedures   │   │  │  btgrvault │  │              │
        │  └──────────────┘   │  │  db1:8003  │  │              │
        └─────────────────────┘  │            │  │              │
                                 │  Fallback: │  │              │
                                 │  btgrvault │  │              │
                                 │  app:8001  │  │              │
                                 └────────────┘  └──────────────┘
```

---

## 2. CURRENT SYSTEM - DETAILED MODULAR ARCHITECTURE

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                      OVI DASHBOARD - CURRENT MODULES                         │
└──────────────────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────────────────┐
│ TIER 1: CORE SECURITY & GATEWAY                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌──────────────────────────┐     ┌──────────────────────────┐              │
│  │  LOGIN MODULE            │     │  SESSION MANAGEMENT      │              │
│  ├──────────────────────────┤     ├──────────────────────────┤              │
│  │• User credential auth    │     │• CustomFilter attribute  │              │
│  │• LDAP/AD validation      │     │• EmpId presence check    │              │
│  │• Failed login tracking   │     │• 30-min idle timeout     │              │
│  │• Multi-login protection  │     │• Session expiry handlers │              │
│  │• Account locking (3x)    │     │• Essential cookie mode   │              │
│  │• Business role mapping   │     │                          │              │
│  └──────────────────────────┘     └──────────────────────────┘              │
│                                                                               │
│  ┌──────────────────────────┐     ┌──────────────────────────┐              │
│  │  ENCRYPTION / CRYPTO     │     │  IP VALIDATION           │              │
│  ├──────────────────────────┤     ├──────────────────────────┤              │
│  │• AES encryption (client) │     │• URL parameter encrypt   │              │
│  │• AESEncryptDecrypt class │     │• IP address decryption   │              │
│  │• CryptoJS library        │     │• Loopback resolution     │              │
│  │• Hardcoded key rotation  │     │• Session IP binding      │              │
│  │  KEY: 8080808080808080   │     │                          │              │
│  └──────────────────────────┘     └──────────────────────────┘              │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────────────────┐
│ TIER 2: PORTFOLIO & RISK MONITORING                                          │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌──────────────────────────┐     ┌──────────────────────────┐              │
│  │  RM DASHBOARD            │     │  CM DASHBOARD            │              │
│  ├──────────────────────────┤     ├──────────────────────────┤              │
│  │• Portfolio summary cards │     │• Commercial view         │              │
│  │  - APR count             │     │• Segment filters         │              │
│  │  - Client count          │     │• Location filters        │              │
│  │  - Fund/NonFund limits   │     │• LSID filters           │              │
│  │  - Exposure %            │     │• DateTime range filters  │              │
│  │• Delinquency heatmap     │     │                          │              │
│  │• Compliance alerts       │     │                          │              │
│  │• Urgent bulletins        │     │                          │              │
│  │• To-do list              │     │                          │              │
│  │• Quick links sidebar     │     │                          │              │
│  │• Notifications center    │     │                          │              │
│  │• Client search/autocomplete  │  │                          │              │
│  └──────────────────────────┘     └──────────────────────────┘              │
│            ▲                                   ▲                            │
│            │ SP_OVI_Get_Dashboard_Records     │ SP_OVI_CMViewDashboardData  │
│            │ GetDelinquencyDetails()          │ Common.cs logic            │
│            │ GetComplianceItem()              │                             │
│            └──────────────────────────────────┘                             │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────────────────┐
│ TIER 3: DELINQUENCY & CREDIT RISK MODULES                                    │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌──────────────────────────┐     ┌──────────────────────────┐              │
│  │  DELINQUENCY MONITORING  │     │  AUDIT USE REVIEW (AUR)  │              │
│  ├──────────────────────────┤     ├──────────────────────────┤              │
│  │• DPD matrix (15/30/60)   │     │• Periodic review data    │              │
│  │• Color-coded indicators  │     │• Monthly trend tracking  │              │
│  │• Segment/Location filter │     │• Exposure analysis       │              │
│  │• Monthly totals          │     │• Filter by segment/loc   │              │
│  │• SP_OVI_CMDelinquency    │     │• Filter by LSID/date    │              │
│  │• RM dashboard heatmap    │     │• SP_OVI_CMAUR            │              │
│  │  integration             │     │                          │              │
│  └──────────────────────────┘     └──────────────────────────┘              │
│                                                                               │
│  ┌──────────────────────────┐     ┌──────────────────────────┐              │
│  │  LOAN CREDIT HANDLING    │     │  WATCH LIST MANAGEMENT   │              │
│  │  UNIT (LCHU)             │     │                          │              │
│  ├──────────────────────────┤     ├──────────────────────────┤              │
│  │• Loan approval tracking  │     │• Risk flagged accounts   │              │
│  │• Handling metrics        │     │• Account-level monitors  │              │
│  │• Filter by segment/loc   │     │• Exposure tracking       │              │
│  │• Filter by LSID/date     │     │• Historical alert log    │              │
│  │• SP_OVI_CMLCHU           │     │• Filter by segment/loc   │              │
│  │                          │     │• Filter by LSID/date     │              │
│  │                          │     │• SP_OVI_CMWatchList      │              │
│  └──────────────────────────┘     └──────────────────────────┘              │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────────────────┐
│ TIER 4: COMMERCIAL & OPERATIONAL MODULES                                     │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌──────────────────────────┐     ┌──────────────────────────┐              │
│  │  COMMERCIALS MODULE      │     │  FILE UPLOAD & IMPORT    │              │
│  ├──────────────────────────┤     ├──────────────────────────┤              │
│  │• Asset pricing           │     │• Excel file ingestion    │              │
│  │• Trade pricing           │     │• Pipe-delimited import   │              │
│  │• Account customization   │     │• Supported types:        │              │
│  │• Reversal approval       │     │  - Portfolio data        │              │
│  │• Waiver management       │     │  - APRs                  │              │
│  │• IP-based asset pricing  │     │  - RM Hierarchy          │              │
│  │                          │     │  - Client-RM Mapping     │              │
│  │                          │     │  - Fresh Leads           │              │
│  │                          │     │  - Delinquency (cust/acc)│              │
│  │                          │     │  - Compliance            │              │
│  │                          │     │  - Acquisitions          │              │
│  │                          │     │• Row validation via SP   │              │
│  │                          │     │• SqlBulkCopy insertion   │              │
│  │                          │     │• Error report exposure   │              │
│  └──────────────────────────┘     └──────────────────────────┘              │
│                                                                               │
│  ┌──────────────────────────┐     ┌──────────────────────────┐              │
│  │  BULLETIN SYSTEM         │     │  QUICK LINKS & FEEDBACK  │              │
│  ├──────────────────────────┤     ├──────────────────────────┤              │
│  │• Urgent alerts CRUD      │     │• Personalized bookmarks  │              │
│  │• File attachments        │     │• Save/Delete/Get logic   │              │
│  │• wwwroot/UrgentBulletin/ │     │• Module-level ratings    │              │
│  │  storage                 │     │• Remarks submission      │              │
│  │• SP_OVI_Urgent_Bulletin  │     │• Feedback form display   │              │
│  │• Count tracking          │     │• SaveFeedBack action     │              │
│  │• To-do list integration  │     │                          │              │
│  └──────────────────────────┘     └──────────────────────────┘              │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────────────────┐
│ TIER 5: AUDIT & PRODUCTIVITY TRACKING                                        │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌──────────────────────────┐     ┌──────────────────────────┐              │
│  │  ACTIVITY LOGGING        │     │  EMAIL & NOTIFICATION    │              │
│  ├──────────────────────────┤     ├──────────────────────────┤              │
│  │• CaptureProductivityDetails│   │• MailRepository sends    │              │
│  │• Form name tracking      │     │• Database-driven SMTP    │              │
│  │• Module name tracking    │     │• SP_OVI_EmailLog audit   │              │
│  │• Activity description    │     │• BCC/CC support          │              │
│  │• Timestamp capture       │     │• SP_MAIL_SAVE dispatch   │              │
│  │• User action audit       │     │• sendMail model          │              │
│  │• USP_Insert_Activity_Log │     │                          │              │
│  │  Tracker (CM)            │     │                          │              │
│  └──────────────────────────┘     └──────────────────────────┘              │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. DATA FLOW ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TYPICAL REQUEST FLOW                                 │
└─────────────────────────────────────────────────────────────────────────────┘

1. USER AUTHENTICATION FLOW:
   ┌──────────────┐
   │ User enters  │
   │ credentials  │
   └──────┬───────┘
          │
          ▼
   ┌──────────────────────┐
   │ Client-side AES      │
   │ encryption (key:8080)│
   └──────┬───────────────┘
          │
          ▼
   ┌──────────────────────────────┐
   │ POST /Login/LoginUser         │
   │ {userName, encPassword}       │
   └──────┬───────────────────────┘
          │
          ▼
   ┌────────────────────────────────────┐
   │ LoginController.LoginUser()         │
   │ 1. Decrypt password (if needed)    │
   │ 2. SP sp_Login_New lookup          │
   │ 3. Check Active status             │
   │ 4. Check LastLogin vs LastLogout   │
   │ 5. LDAP validation (if Live)       │
   │ 6. Set session keys:               │
   │    - EmpCode, EmpId, EmpName       │
   │    - AdId, LoginTime, LoginId      │
   │    - BusinessRole (RM/CM)          │
   │    - CheckUser, Dept               │
   │    - EncryptedId, EncryptedIP      │
   └──────┬───────────────────────────────┘
          │
          ▼
   ┌──────────────────────┐
   │ /Login/SelectionPage │
   │ (if dual role)       │
   └──────┬───────────────┘
          │
          ▼
   ┌────────────────────────────────────┐
   │ Redirect to RM or CM Dashboard     │
   │ based on sectionType               │
   └────────────────────────────────────┘


2. PORTFOLIO DATA REQUEST FLOW (RM Dashboard):
   ┌──────────────────────────────┐
   │ User navigates to Dashboard  │
   └──────┬───────────────────────┘
          │
          ▼
   ┌──────────────────────────────────────┐
   │ GET /Home/Dashboard                  │
   │ (encrypted USERID, IP params)        │
   └──────┬───────────────────────────────┘
          │
          ▼
   ┌───────────────────────────────────────────┐
   │ HomeController.Dashboard()                │
   │ 1. Decrypt USERID, IP params              │
   │ 2. Validate IP via CustomFilter           │
   │ 3. Call SP_OVI_Get_Dashboard_Records      │
   │ 4. Call GetDelinquencyDetails()           │
   │ 5. Call GetComplianceItem()               │
   │ 6. Fetch bulletins (SP_OVI_Urgent_Bulletin)
   │ 7. Render Razor view with data            │
   └──────┬────────────────────────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Render HTML with        │
   │ Portfolio Cards         │
   │ Delinquency Heatmap     │
   │ Compliance Alerts       │
   │ Bulletins               │
   │ To-Do List              │
   │ Quick Links             │
   └─────────────────────────┘


3. DELINQUENCY DRILL-DOWN FLOW (CM Module):
   ┌──────────────────────────────────────┐
   │ User selects filters on CM Dashboard │
   │ Segment, Location, LSID, DateTime    │
   └──────┬───────────────────────────────┘
          │
          ▼
   ┌────────────────────────────────────────────┐
   │ AJAX POST to DelinquencyController.         │
   │ Delinquency(clsCMDelinquencyMain filter)   │
   └──────┬─────────────────────────────────────┘
          │
          ▼
   ┌─────────────────────────────────────────────────┐
   │ Common.clsCMDelinquency11() processes:          │
   │ 1. Build SP parameters from filters             │
   │ 2. Call SP_OVI_CMDelinquency                    │
   │ 3. Parse result DataTable                       │
   │ 4. Apply color codes (Red/Amber/Green)         │
   │ 5. Calculate monthly totals                     │
   │ 6. Return List<DelinquencyData>                 │
   └──────┬──────────────────────────────────────────┘
          │
          ▼
   ┌──────────────────────────────────────┐
   │ Return JSON to browser                │
   │ {delinquencyRows, monthlyTotals,     │
   │  colorCodes, exposureAnalysis}       │
   └──────┬───────────────────────────────┘
          │
          ▼
   ┌──────────────────────────────────────┐
   │ Render DataTables grid with          │
   │ DPD breakdown (15/30/60)              │
   │ Color-coded risk indicators           │
   │ Export to CSV button                  │
   └──────────────────────────────────────┘


4. FILE UPLOAD FLOW:
   ┌────────────────────────────┐
   │ User visits /Upload/Index  │
   └──────┬─────────────────────┘
          │
          ▼
   ┌────────────────────────────────────────┐
   │ Select file type from dropdown         │
   │ (Portfolio/APRs/RMHier/Leads/etc.)     │
   └──────┬───────────────────────────────┘
          │
          ▼
   ┌───────────────────────────────┐
   │ POST Excel file               │
   └──────┬────────────────────────┘
          │
          ▼
   ┌──────────────────────────────────────────┐
   │ UploadController handles:                │
   │ 1. File stream read                      │
   │ 2. Row iteration (ExcelReader)           │
   │ 3. ValidExcelRows() on each row          │
   │ 4. SqlBulkCopy insert (valid rows)       │
   │ 5. Error rows logged                     │
   │ 6. Return success/error count            │
   └──────┬───────────────────────────────────┘
          │
          ▼
   ┌──────────────────────────────┐
   │ Success screen shows:         │
   │ - Rows imported: X            │
   │ - Errors: Y                   │
   │ - Error detail link           │
   └──────────────────────────────┘
```

---

## 4. TECHNOLOGY INTEGRATION POINTS

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SYSTEM INTEGRATIONS                              │
└─────────────────────────────────────────────────────────────────────────────┘

                         ┌─────────────────────┐
                         │   OVI Dashboard     │
                         │   (ASP.NET Core 8)  │
                         └────────┬────────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    │             │             │
                    ▼             ▼             ▼
            ┌──────────────┐  ┌─────────┐  ┌──────────┐
            │   Vault API  │  │PMS Login│  │Active    │
            │              │  │System   │  │Directory │
            │btgrvaultdb1: │  │         │  │(LDAP)    │
            │  8003        │  │HTTP     │  │          │
            │              │  │redirect │  │ldap://   │
            │Retrieve:     │  │with     │  │hbctxdom  │
            │- DB conn str │  │encrypted   │.com      │
            │- SMTP creds  │  │USERID      │          │
            │- Decrypt key │  │            │          │
            │  "COE-IHA"   │  │            │          │
            └──────────────┘  └─────────┘  └──────────┘
                    │
                    ▼
            ┌──────────────────────┐
            │  SQL Server 2022     │
            │  (Primary database)  │
            ├──────────────────────┤
            │ - DashBoard DB       │
            │ - Hunt DB            │
            │ - SMTP DB            │
            │ - SSIS ETL DB        │
            └──────────────────────┘


TIMING OF INTEGRATIONS:
═════════════════════════

┌─ At Login Time:
│
├─► Call AD LDAP (btgrvaultdb1:8003) to validate credentials
├─► Call Vault API to decrypt DB connection string
├─► Call sp_Login_New on DashBoard
├─► Call SP_OVI_ValidateUser to get business roles
├─► Redirect from PMS brings encrypted USERID
│
└─ During Dashboard Usage:
    ├─► SP calls (SP_OVI_*, sp_*, etc.) to DashBoard
    ├─► Email dispatch via SMTP DB (SP_MAIL_SAVE)
    ├─► Activity logging (USP_Insert_Activity_Log)
    └─► File uploads via SSIS / SqlBulkCopy

```

---

## 5. MISSING MODULES FOR COMPREHENSIVE RISK MANAGEMENT

### **CRITICAL GAPS IN CURRENT SYSTEM**

```
┌──────────────────────────────────────────────────────────────────────────────┐
│            MISSING MODULES REQUIRED FOR RISK MANAGEMENT INSTITUTE             │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│ TIER 1: CORE RISK ASSESSMENT & ANALYSIS (MISSING)                            │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ❌ CREDIT RISK ASSESSMENT & RATING MODULE                                   │
│  ├─ Internal credit rating model                                             │
│  ├─ External rating agency integration (S&P, Moody's, Fitch)                │
│  ├─ Rating migration tracking                                                │
│  ├─ PD/LGD/EAD calculation engine                                           │
│  ├─ Expected Loss (EL) computation                                           │
│  ├─ Risk score card matrix                                                   │
│  └─ Stress testing on ratings                                                │
│                                                                               │
│  ❌ COLLATERAL MANAGEMENT MODULE                                             │
│  ├─ Collateral registration & tracking                                       │
│  ├─ Valuation methods (mark-to-market, statistical models)                  │
│  ├─ Haircut management                                                       │
│  ├─ Rehypoecation rules                                                      │
│  ├─ Collateral coverage ratio monitoring                                     │
│  ├─ Collateral substitution workflows                                        │
│  ├─ Forced liquidation scenarios                                             │
│  └─ Cross-collateral pool analysis                                           │
│                                                                               │
│  ❌ EXPOSURE MANAGEMENT & LIMITS MONITORING                                  │
│  ├─ Single-name exposure tracking (per borrower)                            │
│  ├─ Sector exposure limits by industry                                       │
│  ├─ Geographic/country limits                                                │
│  ├─ Product exposure limits (term loans, revolvers, etc.)                   │
│  ├─ Concentration limits (Herfindahl index)                                  │
│  ├─ Real-time limit utilization dashboard                                    │
│  ├─ Breach alerts & exception reporting                                      │
│  ├─ Limit override approval workflow                                         │
│  └─ Syndication exposure tracking                                            │
│                                                                               │
│  ❌ STRESS TESTING & SCENARIO ANALYSIS MODULE                                │
│  ├─ CCAR/DFAST compliance (regulatory stress tests)                         │
│  ├─ Adverse economic scenario modeling                                       │
│  ├─ Interest rate sensitivity (repricing gaps)                               │
│  ├─ Revenue impact scenarios                                                 │
│  ├─ What-if portfolio simulations                                            │
│  ├─ Monte Carlo simulations for tail risks                                   │
│  ├─ Macroeconomic variable linkage                                           │
│  └─ Capital adequacy projections                                             │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────────────────┐
│ TIER 2: NPL, RECOVERY & WORKOUT MODULES (MISSING)                            │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ❌ NON-PERFORMING LOAN (NPL) MANAGEMENT MODULE                              │
│  ├─ NPL migration tracking (DPD 0→180)                                       │
│  ├─ NPL portfolio segmentation                                               │
│  ├─ NPL trends & forecasting                                                 │
│  ├─ Regulatory NPL disclosure reporting                                      │
│  ├─ Sale of NPL transactions (bulk sales tracking)                           │
│  ├─ NPL coverage ratio monitoring (ECL provisioning)                         │
│  ├─ Write-off decision workflow                                              │
│  └─ Post-write-off recovery monitoring                                       │
│                                                                               │
│  ❌ RECOVERY & COLLECTIONS MODULE                                            │
│  ├─ Recovery case management (ticket system)                                 │
│  ├─ Collection strategy assignment                                           │
│  ├─ Legal action workflows (notice, litigation, execution)                  │
│  ├─ Recovery milestones & timelines                                          │
│  ├─ Settlement negotiation tracking                                          │
│  ├─ Recovery metrics (recovery rate, time-to-recovery)                      │
│  ├─ Secured asset realization (auction, private sale)                        │
│  └─ Recovery provision adequacy                                              │
│                                                                               │
│  ❌ WORKOUT & RESTRUCTURING MODULE                                           │
│  ├─ Account categorization (watchlist → stressed → restructure)             │
│  ├─ Restructuring scenarios (tenor extension, rate reduction, etc.)         │
│  ├─ Restructured asset compliance (Basel norms)                              │
│  ├─ Asset quality migration post-restructure                                 │
│  ├─ Restructuring success rate tracking                                      │
│  ├─ Early warning flags for restructure candidates                           │
│  └─ Covenant violation monitoring                                            │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────────────────┐
│ TIER 3: COMPLIANCE & REGULATORY REPORTING (PARTIALLY MISSING)                │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ❌ REGULATORY COMPLIANCE & REPORTING MODULE                                 │
│  ├─ Basel III/IV compliance calculations                                     │
│  ├─ CAR (Capital Adequacy Ratio) monitoring                                  │
│  ├─ Liquidity Coverage Ratio (LCR) / Net Stable Funding Ratio (NSFR)        │
│  ├─ Large Exposure Reporting (per regulatory body)                           │
│  ├─ Foreign Currency Open Position limits                                    │
│  ├─ Related Party transactions disclosure                                    │
│  ├─ CRAR/CRR (Statutory) reporting                                           │
│  ├─ Loan Loss Reserve (LLR) / ECL (Expected Credit Loss) calculations       │
│  ├─ Regulatory filing templates (RBI, FDIC, etc.)                            │
│  ├─ Audit trail for regulatory submissions                                   │
│  └─ Regulatory change tracking & policy updates                              │
│                                                                               │
│  ⚠️ PARTIAL: Feedback form exists, but no structured compliance rules        │
│              No automated regulatory calculation engine                       │
│              No regulatory filing workflow                                    │
│              Manual intervention required for reports                        │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────────────────┐
│ TIER 4: EARLY WARNING & CREDIT ANALYTICS (PARTIALLY MISSING)                 │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ❌ EARLY WARNING SYSTEM (EWS) MODULE                                        │
│  ├─ Borrower financial metrics monitoring (quarterly/annual)                │
│  ├─ Industry health indicators (sector trends)                               │
│  ├─ Market data integration (commodity prices, FX, rates)                   │
│  ├─ Covenant violation prediction                                            │
│  ├─ Cash flow adequacy metrics                                               │
│  ├─ Debt service coverage ratio (DSCR) trends                                │
│  ├─ Alert escalation rules & thresholds                                      │
│  ├─ Probabilistic default prediction (machine learning)                      │
│  └─ Peer comparison analysis                                                 │
│                                                                               │
│  ⚠️ PRESENT: Watch List module exists (static), but no:                     │
│              - Automated EWS calculations                                    │
│              - Financial ratio trending                                      │
│              - Industry benchmark comparison                                 │
│              - ML-based default prediction                                   │
│                                                                               │
│  ❌ PORTFOLIO ANALYTICS & REPORTING MODULE                                   │
│  ├─ Portfolio composition & segmentation                                     │
│  ├─ Portfolio risk profile (aggregate PD/LGD)                               │
│  ├─ Concentration analysis (name, sector, geographic)                       │
│  ├─ Value-at-Risk (VaR) calculations                                         │
│  ├─ Expected Shortfall (Conditional VaR)                                     │
│  ├─ Loss distribution forecasting                                            │
│  ├─ Cross-portfolio correlations                                             │
│  ├─ Comparative performance vs benchmarks                                    │
│  └─ Risk-adjusted return metrics                                             │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────────────────┐
│ TIER 5: DOCUMENT & CASE MANAGEMENT (MISSING)                                 │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ❌ DOCUMENT MANAGEMENT SYSTEM (DMS)                                         │
│  ├─ Loan agreement storage & versioning                                      │
│  ├─ Security document management (mortgages, pledges)                        │
│  ├─ Financial statement archival (time-series)                               │
│  ├─ Board approval documents                                                 │
│  ├─ Covenant documentation                                                   │
│  ├─ Full-text search capabilities                                            │
│  ├─ Version control & audit trail                                            │
│  ├─ OCR for scanned documents                                                │
│  └─ Expiry alerts (insurance policies, guarantees)                           │
│                                                                               │
│  ❌ CASE MANAGEMENT SYSTEM                                                   │
│  ├─ NPL case ticket creation & assignment                                    │
│  ├─ Recovery action tracking (letters, calls, visits)                       │
│  ├─ Legal case status monitoring                                             │
│  ├─ Settlement case workflow                                                 │
│  ├─ Status history & milestones                                              │
│  ├─ Team assignment & SLA tracking                                           │
│  ├─ KPI metrics per case officer                                             │
│  └─ Escalation rules & automation                                            │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────────────────┐
│ TIER 6: MARKET & LIQUIDITY RISK MODULES (MISSING)                            │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ❌ LIQUIDITY RISK MANAGEMENT                                                │
│  ├─ Maturity ladder analysis                                                 │
│  ├─ Funding concentration limits                                             │
│  ├─ LCR & NSFR ratio monitoring                                              │
│  ├─ Cash flow forecasting (inflow/outflow)                                  │
│  ├─ Stress liquidity scenarios                                               │
│  ├─ Contingency funding plan                                                 │
│  └─ Liquidity reserve adequacy                                               │
│                                                                               │
│  ❌ MARKET RISK MANAGEMENT                                                   │
│  ├─ Interest rate risk (repricing gaps, duration)                            │
│  ├─ FX exposure management                                                   │
│  ├─ Equity price risk tracking                                               │
│  ├─ Commodity price exposure                                                 │
│  ├─ VAR & Expected Shortfall calculations                                    │
│  ├─ Greeks calculation for derivatives                                       │
│  ├─ Basis risk management                                                    │
│  └─ Market scenario analysis                                                 │
│                                                                               │
│  ❌ COUNTERPARTY RISK MANAGEMENT                                             │
│  ├─ Central counterparty (CCP) exposure tracking                             │
│  ├─ Bilateral netting & collateral management                                │
│  ├─ Credit Valuation Adjustment (CVA)                                        │
│  ├─ Exposure-at-default (EAD) modeling                                       │
│  ├─ Wrong-way risk identification                                            │
│  ├─ Counterparty rating monitoring                                           │
│  └─ CDS spreads integration                                                  │
│                                                                               │
│  ❌ OPERATIONAL RISK MANAGEMENT                                              │
│  ├─ Loss event database (internal & external)                                │
│  ├─ Risk control self-assessment (RCSA)                                      │
│  ├─ Key risk indicators (KRI) monitoring                                     │
│  ├─ Operational scenario analysis                                            │
│  ├─ Business continuity planning                                             │
│  ├─ Third-party/outsourcing risk                                             │
│  └─ Regulatory/compliance incidents tracking                                 │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────────────────┐
│ TIER 7: DATA & ANALYTICS INFRASTRUCTURE (PARTIALLY MISSING)                  │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ❌ DATA WAREHOUSE & MASTER DATA MANAGEMENT (MDM)                            │
│  ├─ Centralized borrower master data                                         │
│  ├─ Facility master (loans, deposits, investments)                          │
│  ├─ Transaction history (real-time & historical)                             │
│  ├─ Data quality rules & validation (DQS)                                    │
│  ├─ Deduplication & golden record management                                 │
│  ├─ Data lineage & reconciliation                                            │
│  ├─ Star schema for OLAP analysis                                            │
│  └─ Historical change tracking (SCD Type II)                                 │
│                                                                               │
│  ⚠️ PARTIAL: SSIS database exists for ETL, but:                             │
│              - No star schema for analytics                                  │
│              - No MDM platform                                               │
│              - Limited DQS implementation                                    │
│              - No data lineage tools                                         │
│                                                                               │
│  ❌ BUSINESS INTELLIGENCE & DASHBOARDS                                      │
│  ├─ Executive dashboards (credit risk KPIs)                                  │
│  ├─ Portfolio KPI scorecards                                                 │
│  ├─ Risk KPI trending                                                        │
│  ├─ Custom ad-hoc reporting engine                                           │
│  ├─ Regulatory report templates                                              │
│  ├─ Data visualization (Power BI / Tableau)                                  │
│  ├─ Self-service analytics                                                   │
│  └─ Real-time monitoring dashboards                                          │
│                                                                               │
│  ⚠️ PARTIAL: RM/CM dashboards exist, but:                                   │
│              - Limited to delinquency/AUR/LCHU                              │
│              - No executive-level KPI dashboards                            │
│              - No ad-hoc reporting capability                               │
│              - No Power BI/Tableau integration                              │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────────────────┐
│ TIER 8: SYSTEM & GOVERNANCE INFRASTRUCTURE (PARTIALLY MISSING)               │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ❌ AUDIT, LOGGING & COMPLIANCE INFRASTRUCTURE                               │
│  ├─ Structured audit trail (all transactions)                                │
│  ├─ User action audit (who/what/when/where)                                 │
│  ├─ Data change audit (before/after values)                                  │
│  ├─ Authorized vs unauthorized access attempts                               │
│  ├─ Error logging & monitoring                                               │
│  ├─ Regulatory change logs (system updates)                                  │
│  └─ Long-term audit retention (10+ years)                                    │
│                                                                               │
│  ⚠️ PARTIAL: Activity logging exists (CaptureProductivityDetails),            │
│              but:                                                            │
│              - Limited to form/module name                                   │
│              - No data change tracking                                       │
│              - No before/after values captured                               │
│              - No long-term retention policy                                 │
│                                                                               │
│  ❌ DATA GOVERNANCE & SECURITY                                               │
│  ├─ Role-based access control (RBAC) by business area                       │
│  ├─ Attribute-based access control (ABAC) by desk/region                    │
│  ├─ Data classification (Public/Internal/Confidential/Restricted)           │
│  ├─ Data masking for non-sensitive users                                     │
│  ├─ Encryption at rest & in transit                                          │
│  ├─ API gateway & authentication                                             │
│  ├─ Secrets management (key rotation)                                        │
│  └─ Penetration testing & vulnerability scanning                             │
│                                                                               │
│  ⚠️ MINIMAL: CustomFilter checks EmpId, but:                                │
│              - No granular role-based permissions                            │
│              - No data-level access control                                  │
│              - Hardcoded AES keys (no rotation)                              │
│              - No encryption at rest                                         │
│              - No API gateway                                                │
│                                                                               │
│  ❌ SYSTEM INTEGRATION & INTEROPERABILITY                                    │
│  ├─ Service-oriented architecture (SOA) / REST API                          │
│  ├─ Message-oriented middleware (MOM)                                        │
│  ├─ Enterprise data integration (ETL & ELT)                                  │
│  ├─ API versioning & backward compatibility                                  │
│  ├─ Integration middleware (iPaaS)                                           │
│  ├─ Real-time data sync rules                                                │
│  └─ Event-driven architecture support                                        │
│                                                                               │
│  ❌ MONITORING, ALERTING & AI/ML                                             │
│  ├─ Real-time system health monitoring                                       │
│  ├─ Performance & resource utilization dashboards                            │
│  ├─ Alert rules & escalation (PagerDuty integration)                        │
│  ├─ Machine learning models for prediction (default, recovery)              │
│  ├─ Anomaly detection (fraud, unusual patterns)                              │
│  ├─ Natural language processing (document analysis)                          │
│  └─ Forecasting models (portfolio growth, risk trends)                       │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. COMPREHENSIVE RISK MANAGEMENT ARCHITECTURE (DESIRED STATE)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│           COMPLETE RISK MANAGEMENT SYSTEM - PROPOSED ARCHITECTURE             │
│                    (Including Current + All Missing Modules)                   │
└──────────────────────────────────────────────────────────────────────────────┘


                               ┌─────────────────────────────────────────┐
                               │  EXECUTIVE & BOARD DASHBOARDS          │
                               │  • Key Risk Indicators (KRIs)           │
                               │  • Capital Adequacy Ratio               │
                               │  • Portfolio Health Scorecard           │
                               │  • Regulatory Compliance Status         │
                               │  • Risk-Adjusted Return Metrics         │
                               └─────────────────────────────────────────┘
                                              │
                ┌─────────────────────────────┼─────────────────────────────┐
                │                             │                             │
                ▼                             ▼                             ▼
     ┌──────────────────────┐    ┌──────────────────────┐    ┌──────────────────────┐
     │ CREDIT RISK TOWER    │    │ MARKET & LIQUIDITY   │    │ OPERATIONAL RISK     │
     │ (Core Risk Module)   │    │ RISK TOWER           │    │ TOWER                │
     ├──────────────────────┤    ├──────────────────────┤    ├──────────────────────┤
     │• Credit Rating Model │    │• Interest Rate Risk  │    │• Loss Event Database │
     │• PD/LGD/EAD Calcs   │    │• FX Exposure Mgmt    │    │• Risk Control RCSA   │
     │• Exposure Mgmt      │    │• Equity Price Risk   │    │• Key Risk Indicators │
     │• Collateral Mgmt    │    │• Commodity Price Mgmt│    │• Operational Scenario│
     │• Single Name Limits │    │• Liquidity Risk Mgmt │    │• Business Continuity │
     │• Portfolio Exposure │    │• Maturity Analysis   │    │• Third-Party Risk    │
     │• Concentration Mgmt │    │• LCR/NSFR Monitoring│    │• Incident Tracking   │
     │                     │    │• Counterparty Risk   │    │• Compliance Incidents│
     │                     │    │• VAR Calculations    │    │                      │
     │                     │    │• Stress Testing      │    │                      │
     └──────────────────────┘    └──────────────────────┘    └──────────────────────┘
                │                             │                             │
                ▼                             ▼                             ▼
     ┌──────────────────────┐    ┌──────────────────────┐    ┌──────────────────────┐
     │ NPL & RECOVERY TOWER │    │ COMPLIANCE &         │    │ DATA & ANALYTICS     │
     │                      │    │ REGULATORY TOWER     │    │ INFRASTRUCTURE       │
     ├──────────────────────┤    ├──────────────────────┤    ├──────────────────────┤
     │• NPL Management      │    │• Basel III/IV        │    │• Data Warehouse      │
     │• Collection Mgmt     │    │• CAR Monitoring      │    │• Master Data Mgmt    │
     │• Recovery Tracking   │    │• Regulatory Filing   │    │• ETL/ELT Pipelines   │
     │• Write-off Workflows │    │• Large Exposure      │    │• Data Quality Checks │
     │• Case Management     │    │  Reporting           │    │• Business Intelligence
     │• Workout/Restructure │    │• ECL/LLR Calc       │    │• Analytics Engine    │
     │• Settlement Tracking │    │• Related Party Trans │    │• Real-time Dashboards│
     │• Recovery Provisioning│   │• Regulatory Change   │    │• Ad-hoc Reporting    │
     │                      │    │• Audit Trail         │    │                      │
     └──────────────────────┘    └──────────────────────┘    └──────────────────────┘
                │                             │                             │
                └─────────────────────────────┼─────────────────────────────┘
                                              │
                              ┌───────────────────────────┐
                              │   DOCUMENT & CASE MGMT    │
                              ├───────────────────────────┤
                              │• Document Management      │
                              │• Case Ticketing           │
                              │• Workflow Orchestration   │
                              │• SLA Tracking             │
                              │• KPI Tracking            │
                              └───────────────────────────┘
                                              │
                              ┌───────────────────────────┐
                              │   SYSTEM INFRASTRUCTURE   │
                              ├───────────────────────────┤
                              │• API Gateway              │
                              │• SOA / Microservices      │
                              │• Message Queue (RabbitMQ) │
                              │• Event Bus / Pub-Sub      │
                              │• Master Data Platform     │
                              │• Vault / Secrets Mgmt     │
                              │• Monitoring & Alerting    │
                              │• ML/AI Engine             │
                              │• Audit & Logging          │
                              │• Security & Governance    │
                              └───────────────────────────┘
                                              │
                              ┌───────────────────────────┐
                              │    EXTERNAL INTEGRATIONS  │
                              ├───────────────────────────┤
                              │• Credit Rating Agencies   │
                              │• Market Data Providers    │
                              │• Regulatory Bodies (APIs) │
                              │• Counterparty Systems     │
                              │• Payment Gateways         │
                              │• Compliance Vendors       │
                              └───────────────────────────┘
```

---

## 7. GAP ANALYSIS SUMMARY TABLE

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    MATURITY ASSESSMENT: CURRENT vs DESIRED                   │
└─────────────────────────────────────────────────────────────────────────────┘

MODULE AREA                          │ CURRENT STATUS    │ MATURITY │ PRIORITY
─────────────────────────────────────┼───────────────────┼──────────┼──────────
AUTHENTICATION & SESSION              │ ✅ Present        │ 80%      │ Maintain
PORTFOLIO OVERVIEW (RM/CM)            │ ✅ Present        │ 70%      │ Enhance
DELINQUENCY MONITORING                │ ✅ Present        │ 60%      │ High
AUR / LCHU / WATCH LIST              │ ✅ Present        │ 50%      │ Enhance
FILE UPLOAD & IMPORT                  │ ✅ Present        │ 65%      │ High
BULLETIN & NOTIFICATION SYSTEM        │ ✅ Present        │ 70%      │ Medium
AUDIT & ACTIVITY LOGGING              │ ⚠️ Partial        │ 40%      │ High
EMAIL & COMMUNICATION                 │ ✅ Present        │ 60%      │ Medium
───────────────────────────────────────────────────────────────────────────────
CREDIT RATING & ASSESSMENT            │ ❌ Missing        │ 0%       │ CRITICAL
COLLATERAL MANAGEMENT                 │ ❌ Missing        │ 0%       │ CRITICAL
EXPOSURE & LIMITS MONITORING          │ ⚠️ Partial        │ 30%      │ CRITICAL
STRESS TESTING & SCENARIOS            │ ❌ Missing        │ 0%       │ CRITICAL
NPL MANAGEMENT                        │ ❌ Missing        │ 0%       │ CRITICAL
RECOVERY & COLLECTIONS                │ ❌ Missing        │ 0%       │ CRITICAL
WORKOUT / RESTRUCTURING               │ ❌ Missing        │ 0%       │ CRITICAL
EARLY WARNING SYSTEM (EWS)            │ ⚠️ Partial        │ 25%      │ HIGH
PORTFOLIO ANALYTICS                   │ ⚠️ Partial        │ 35%      │ HIGH
───────────────────────────────────────────────────────────────────────────────
REGULATORY COMPLIANCE                 │ ⚠️ Partial        │ 30%      │ CRITICAL
DOCUMENT MANAGEMENT                   │ ❌ Missing        │ 0%       │ HIGH
CASE MANAGEMENT                       │ ❌ Missing        │ 0%       │ HIGH
───────────────────────────────────────────────────────────────────────────────
LIQUIDITY RISK MANAGEMENT              │ ❌ Missing        │ 0%       │ HIGH
MARKET RISK MANAGEMENT                │ ❌ Missing        │ 0%       │ HIGH
COUNTERPARTY RISK MANAGEMENT          │ ❌ Missing        │ 0%       │ MEDIUM
OPERATIONAL RISK MANAGEMENT           │ ❌ Missing        │ 0%       │ HIGH
───────────────────────────────────────────────────────────────────────────────
DATA WAREHOUSE / MDM                  │ ⚠️ Partial        │ 25%      │ CRITICAL
BUSINESS INTELLIGENCE & DASHBOARDS    │ ⚠️ Partial        │ 40%      │ HIGH
───────────────────────────────────────────────────────────────────────────────
ROLE-BASED ACCESS CONTROL (RBAC)      │ ⚠️ Minimal        │ 25%      │ HIGH
DATA GOVERNANCE & SECURITY            │ ⚠️ Minimal        │ 20%      │ CRITICAL
SYSTEM INTEGRATION / API LAYER        │ ⚠️ Minimal        │ 15%      │ HIGH
MONITORING & ALERTING                 │ ❌ Missing        │ 0%       │ MEDIUM
ML/AI & PREDICTIVE ANALYTICS          │ ❌ Missing        │ 0%       │ MEDIUM
───────────────────────────────────────────────────────────────────────────────

OVERALL SYSTEM MATURITY:              ⚠️ MODERATE        │ 35%      │
STATUS: Suitable for basic RM        │                    │
        dashboards, NOT for          │                    │
        comprehensive risk mgmt      │                    │
```

---

## 8. IMPLEMENTATION ROADMAP (PHASED APPROACH)

### **PHASE 1 (Months 1-3): CRITICAL FOUNDATION**
```
Priority 1: Fix Security & Data Governance
├─ Externalize hardcoded encryption keys → Vault
├─ Implement Role-Based Access Control (RBAC)
├─ Add CSRF protection to all endpoints
├─ Implement proper audit trail (data change tracking)
├─ Fix thread-unsafe SqlConnection pooling
└─ Add structured logging (Serilog)

Priority 2: Enhance Core Risk Modules
├─ Build Credit Rating & Assessment engine
├─ Implement Exposure Management & Limits Monitoring
├─ Expand Early Warning System (ML-based default prediction)
└─ Add Collateral Management module
```

### **PHASE 2 (Months 4-6): NPL & RECOVERY**
```
├─ NPL Management & Tracking
├─ Recovery & Collections Case Management
├─ Workout / Restructuring workflows
└─ Settlement tracking & recovery provisioning
```

### **PHASE 3 (Months 7-9): COMPLIANCE & ANALYTICS**
```
├─ Regulatory Compliance & Basel III/IV auto-calcs
├─ Data Warehouse & Master Data Management (MDM)
├─ Business Intelligence dashboards
└─ Stress Testing & Scenario Analysis engine
```

### **PHASE 4 (Months 10-12): MARKET & OPERATIONAL RISK**
```
├─ Liquidity Risk Management
├─ Market Risk Management (Interest Rate, FX, etc.)
├─ Operational Risk Management
└─ Document Management System
```

### **PHASE 5 (Ongoing): MODERNIZATION**
```
├─ Migrate from monolith → microservices (optional)
├─ Implement event-driven architecture
├─ Add ML/AI models for predictive analytics
├─ Real-time streaming analytics
└─ Mobile application support
```

---

## 9. KEY RECOMMENDATIONS

### **Immediate Actions (Next 30 Days)**
1. **Fix Security Vulnerabilities**
   - Rotate hardcoded AES keys
   - Implement proper secrets management
   - Add CSRF tokens to all POST/AJAX endpoints

2. **Enhance Audit & Compliance**
   - Implement full audit trail (data-level changes)
   - Add before/after value tracking for all updates
   - Implement regulatory compliance rules engine

3. **Architecture Review**
   - Replace shared `sqlCon` field with connection pooling
   - Externalize UAT/Live settings to configuration
   - Implement proper dependency injection (DI) container

### **Medium-Term (Months 1-6)**
1. Build **Credit Rating & Risk Assessment** engine (CRITICAL)
2. Implement **Exposure & Limits Monitoring** dashboard
3. Create **NPL Management** and **Recovery** workflows
4. Build **Data Warehouse** for analytics

### **Long-Term (Months 6-12)**
1. Implement **Regulatory Compliance** calculation engine
2. Build **Business Intelligence** dashboards
3. Implement **Stress Testing** & **Scenario Analysis**
4. Add **Machine Learning** for prediction & detection

---

## 10. ARCHITECTURAL DECISION RECORDS (ADRs)

### **ADR-1: Monolith vs Microservices**
**Current:** Monolithic ASP.NET Core MVC
**Recommendation:** Keep monolith for now; plan phased migration to microservices for independent scaling of risk modules
**Rationale:** Cost of immediate rewrite outweighs benefits; incremental improvement path exists

### **ADR-2: Database Architecture**
**Current:** Single SQL Server instance with multiple databases
**Recommendation:** Implement master data management layer + analytical data warehouse
**Rationale:** Current direct SQL approach lacks scalability; need to support real-time + batch analytics

### **ADR-3: Security & Secrets**
**Current:** Hardcoded AES keys, Vault API integration for DB strings
**Recommendation:** Implement HashiCorp Vault or Azure Key Vault for all secrets
**Rationale:** Centralized key rotation, compliance audit trail, disaster recovery

### **ADR-4: API Strategy**
**Current:** Session-based + MVC controllers, no public API
**Recommendation:** Implement RESTful API layer with JWT auth + event-driven pub/sub
**Rationale:** Enable mobile app, third-party integrations, asynchronous processing

### **ADR-5: Audit & Governance**
**Current:** Basic activity logging (form/module name only)
**Recommendation:** Implement full audit trail with data-level change tracking + regulatory reporting
**Rationale:** Compliance requirement + risk management necessity

---

This document provides a comprehensive view of the current OVI Dashboard architecture and a detailed gap analysis with prioritized recommendations for building a complete risk management system in a financial institution.
