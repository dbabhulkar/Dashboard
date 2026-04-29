# Modernization playbook for the OVI Dashboard

This playbook is the engineering manual for converting the OVI Dashboard — an ASP.NET Core 8 MVC monolith with hand-written DataTable plumbing, hardcoded crypto, and 8–11 result-set stored procedures — into a Clean Architecture .NET 8 application without freezing the business. **The migration is incremental, evidence-driven, and reversible at every step.** No big-bang rewrite is sanctioned. Functional parity with the live system must hold every working day, because the system underwrites credit-risk decisions and is in scope for internal audit.

The playbook draws on Martin Fowler's Strangler Fig and Parallel Change, Michael Feathers' seam model and characterization tests, Paul Hammant and Jez Humble on Branch by Abstraction, Eric Evans' Anti-Corruption Layer, Steve Smith's and Vladimir Khorikov's Clean Architecture practice in .NET, Microsoft's official guidance on YARP, EF Core stored-procedure interop and Microsoft.FeatureManagement, and ThoughtWorks Tech Radar Vol. 33 on AI-assisted modernization. The references are listed inline and consolidated in §11.

The destination is a four-layer .NET 8 solution — Domain, Application, Infrastructure, Presentation — with constructor DI, EF Core for new persistence, Dapper `QueryMultiple` for legacy multi-result-set procs that cannot yet be split, typed DTOs in place of `DataTable`, structured logging, secrets in a vault, and a reverse-proxy seam separating new code from legacy MVC routes. Reaching it will take roughly **12–18 months for two to three engineers with AI assistance**, sequenced into six phases described in §4.

---

## 1. How to read this document

Each pattern (§2) is presented as a definition, a fit assessment, mechanics in .NET 8, and the failure modes the team should expect. Each phase (§4) declares entry criteria, exit criteria, AI-assisted versus human-only work, rollback steps, and verification approach. Code templates (§5) are minimum-viable shapes — copy and adapt rather than treat as gospel. Risk and compliance constraints (§6) and anti-patterns (§7) bound what is acceptable. Success metrics (§8) define progress and trouble.

Treat the playbook as a living document: when a phase exits, append a short retrospective to this file (or split into `docs/08a-phase-N-retro.md`) capturing what changed in the plan and why. Auditors will ask.

---

## 2. Migration patterns the team will use

OVI's modernization is not one pattern but a small toolbox of well-documented techniques applied in combination. Engineers should recognise each by name and know which problem it solves before applying it.

### 2.1 Strangler Fig — replace the application from the edges in

Martin Fowler coined the term in 2004 after watching strangler fig vines envelop a host tree in Queensland. The metaphor describes **a new system that grows around the old at its boundaries until the old can be removed, with the user-visible surface unchanged throughout** (`martinfowler.com/bliki/StranglerFigApplication.html`). Microsoft's Azure Architecture Center documents the operational shape: introduce a façade that owns the request boundary, route most traffic to the legacy initially, and progressively shift routes to the new implementation as features migrate (`learn.microsoft.com/azure/architecture/patterns/strangler-fig`).

For OVI the façade is a **YARP reverse proxy hosted in-process inside a new ASP.NET Core 8 host**. Routes that have been modernized terminate locally; everything else is forwarded to the existing MVC controllers running on the same or another instance. The minimum configuration is shown in §5.7. As routes migrate, entries move from the catch-all forwarder to local handlers; the legacy site shrinks until it is decommissioned.

**When this fits OVI:** the system has a stable HTTP boundary (cookies, MVC routes, AJAX endpoints), a long migration runway, and no appetite for a freeze. **When it would not fit:** if requests could not be intercepted at a boundary, or if the system were small enough to rewrite end-to-end — OVI is neither.

The dominant failure mode is **façade drift**: the proxy lags behind the migration, the team reroutes around it, and the seam stops being authoritative. Counter it by treating the proxy configuration as the **single source of truth for routing** and gating each migrated route through code review against that file. Fowler also warns that strangler migrations fail when teams treat them as "specification then rewrite"; OVI must keep delivering features through the migration, not pause behind it.

### 2.2 Branch by Abstraction — replace internal components without freezing trunk

Paul Hammant introduced and Jez Humble popularised Branch by Abstraction (BBA) as the technique for **swapping out a widely-used component within a single codebase without long-lived VCS branches** (`continuousdelivery.com/2011/05/make-large-scale-changes-incrementally-with-branch-by-abstraction/`, `martinfowler.com/bliki/BranchByAbstraction.html`). The five steps are: (1) identify a component used in many places, (2) introduce an abstraction that captures the interaction, (3) migrate clients onto the abstraction one at a time, (4) build the new implementation behind the abstraction and run both side by side, and (5) flip the default and delete the old.

Strangler Fig operates at the **deployable boundary** — entire URLs and pages move. BBA operates **inside the codebase**, on doomed modules. For OVI the natural BBA targets are `Common.cs`, the `clsCM*Main1` data-access classes, and the hardcoded encryption helper. Each becomes an interface (`ILegacyDataAccess`, `ICryptoService`, etc.), every call site is migrated to the interface, then a clean implementation grows behind it under a feature flag.

The technique presupposes that the team has **the discipline to delete the old implementation once usage hits zero**. Without the cleanup step, BBA leaves permanent debt and a forest of unused interfaces. Add the deletion to the definition-of-done for every BBA effort.

### 2.3 Parallel Run / Shadow Mode — prove the new path matches before cutting over

Parallel Run executes both the old and the new implementation against the same input, returns the old result to the caller, and **records mismatches for offline analysis**. GitHub's Scientist library is the canonical reference; `Scientist.NET` is the .NET port (`github.com/scientistproject/Scientist.net`). Fowler discusses the same idea inside dark launching: "the old and new code can both be called and their results checked … but only one answer returned to the interface" (`martinfowler.com/bliki/DarkLaunching.html`).

Use Parallel Run for the **CM mapping refactor**, where 8–11 result sets coalesce into a typed DTO graph. The old code populates a `DataTable[]`, the new code populates a typed `CmDashboardDto`; an experiment compares serialised forms after normalisation. The experiment runs at low sampling (1–5%) initially, then ramps. Hard rule from Scientist's documentation: **never wrap mutating code in a parallel run**. For OVI, restrict Parallel Run to read paths until the team designs idempotent dual writes.

Pitfalls: timeouts in the candidate path doubling worst-case latency (mitigate with cancellation tokens and bounded sampling), false mismatches from non-deterministic ordering (compare via custom equality, not `==`), and noise from volatile fields like timestamps (scrub with `clean`).

### 2.4 Anti-Corruption Layer — protect the new domain from the legacy data shape

Eric Evans introduced the Anti-Corruption Layer (ACL) in *Domain-Driven Design* (2003) as **a translation layer between bounded contexts that prevents foreign concepts from leaking into your domain model**. Microsoft's pattern article reuses the same definition (`learn.microsoft.com/azure/architecture/patterns/anti-corruption-layer`).

For OVI the ACL sits between the SQL Server stored procedures and the new Application layer. The legacy procs return joined, denormalised, sometimes-typoed columns; the Domain expects a clean `CreditExposure` aggregate. A handful of **adapter classes in Infrastructure** translate from `DataRow`/`SqlDataReader`/Dapper grid output into Domain entities. Domain code does not see column names, nullability quirks, or sentinel values.

The ACL is allowed to be ugly. Its job is to absorb mess. Review it for correctness, not elegance. Plan for the ACL to **shrink** as procs are split or replaced, not as the centre of long-term investment.

### 2.5 Expand–Contract / Parallel Change — backwards-incompatible interface changes

Danilo Sato's *ParallelChange* article on Fowler's bliki names the three phases: **expand the interface to support old and new simultaneously, migrate clients onto the new shape, contract by removing the old once usage is zero** (`martinfowler.com/bliki/ParallelChange.html`). Pramod Sadalage's evolutionary database design extends the same model to schema changes (`martinfowler.com/articles/evodb.html`).

OVI will apply Parallel Change to:
- **API contracts** — adding typed JSON endpoints alongside existing AJAX `DataTable` endpoints, then retiring the old once the UI moves.
- **Database columns** — expanding before renaming; never dropping a column in the same release that stops writing it.
- **Stored procedure signatures** — adding `_v2` overloads with cleaner shapes; the old proc remains until the last caller migrates.

The fatal failure mode is **never executing the contract phase**. Tag every expand with a Jira ticket for the contract step and a sunset date. Sato's warning is direct: skipping contract leaves the system worse than it started.

### 2.6 Feature flags — gate new code paths

Pete Hodgson's *Feature Toggles* article on Fowler's site (`martinfowler.com/articles/feature-toggles.html`) classifies flags into four categories on two axes (longevity and dynamism): **release** (short-lived, hide unfinished work), **experiment** (medium-lived, A/B), **ops** (variable, kill switches), and **permission** (long-lived, business gating). Mixing these is the most common operational problem.

OVI will use Microsoft.FeatureManagement (`learn.microsoft.com/azure/azure-app-configuration/feature-management-dotnet-reference`) with the registration in §5.8. Flags must have an owner, a category, and a sunset date recorded in `docs/feature-flags.md`. Flags retired ruthlessly; the Knight Capital incident is the canonical reminder of what dormant flags cost.

### 2.7 Characterization tests and approval testing

Michael Feathers' *Working Effectively with Legacy Code* defines a **characterization test** as one that "characterizes the actual behavior of a piece of code", not its specification, and uses it as a regression net before refactoring (`en.wikipedia.org/wiki/Characterization_test`; book preface — "to me, legacy code is simply code without tests"). The procedure is mechanical: write a deliberately-failing test, observe the actual output, paste the output back as the expected value, then refactor.

When the output is large or structured — HTML, JSON, multi-result-set DTO — the team should use **approval testing** via the Verify library for .NET (`github.com/VerifyTests/Verify`). Verify produces `*.received.txt` on a diff; the human inspects and renames to `*.verified.txt` to lock the snapshot. Emily Bache's writing on the Gilded Rose kata is the canonical worked example.

Two cautions: characterization tests **freeze bugs as features** if approved blindly, so any line a reviewer suspects of being wrong should be flagged with a separate spec test; and timestamps, GUIDs, machine-dependent data must be scrubbed via Verify's `ScrubMember` to avoid flake.

### 2.8 Seams — the insertion points for everything above

Feathers defines a seam as "**a place where you can alter behavior in your program without editing in that place**" (WEWLC ch. 4). C# offers object seams primarily — interfaces, virtual methods, constructor injection, factory methods. The strangler façade is itself a seam at the HTTP boundary. The ACL is a seam between Infrastructure and Domain. BBA's abstraction is a seam at the module boundary.

Practical seam moves the team will use repeatedly: **Extract Interface** on `Common.cs` and `clsCM*` classes; **Parameterize Constructor** to inject the new dependency; **Extract and Override Factory Method** to replace `new SomeDep()` calls. Hard-coded `static` calls in legacy code are the main obstacle; wrap them in an instance interface before doing anything else.

---

## 3. AI-assisted refactoring workflow

The team has Claude Code and GitHub Copilot. Used well, they accelerate mechanical work by 3–5×. Used badly, they produce convincing nonsense that ships into a regulated system. This section codifies how OVI uses them.

### 3.1 What AI does well, and what it does badly

The consensus across Anthropic's Claude Code best-practices documentation, Microsoft's GitHub Copilot modernization guidance, ThoughtWorks Tech Radar Vol. 33, Birgitta Böckeler's writing, Simon Willison's commentary, and Martin Fowler's *Legacy Modernization meets GenAI* article is consistent.

**Strengths:** mechanical refactors (rename, extract method, move type), test scaffolding against existing behaviour, DTO generation from `DataRow["X"]` usage patterns, documentation generation from typed code, regex and parser scaffolding, dependency upgrades following well-known patterns (`Newtonsoft` → `System.Text.Json`, `EF6` → `EF Core`), reading and summarising large legacy codebases, characterization-test seeding when explicitly labelled as such.

**Weaknesses:** business rule decisions, cross-system contract changes (consumers in other repos invisible to the agent), security-critical code (auth, crypto, input validation), risk assessment, deciding what *should* be true, and — crucially — **writing tests for new code the AI also wrote**. David Adamo's caution applies: such tests merely replay the implementation, asserting nothing useful (`davidadamojr.com/ai-generated-tests-are-lying-to-you/`).

ThoughtWorks Tech Radar Vol. 33 is explicit: "Measuring productivity by lines of code generated by AI is misleading… degradation in stability metrics — particularly rework rate — provides an early warning sign of blind spots." Treat AI as **leverage on human judgement**, never a substitute for it.

### 3.2 The four-step agentic loop

Every non-trivial AI-assisted task on OVI follows the canonical pattern from Anthropic's documentation: **Research → Plan → Execute → Verify**.

In **Research** the agent reads the relevant code and produces a written summary of scope, dependencies, and unknowns. The human reviews the summary and corrects misunderstandings before any code is written. In **Plan** the agent emits a `plan.md` enumerating files, sequence, risks, and rollback. The human approves. In **Execute** the agent makes small commits per file, ideally one transformation per commit, running build and tests after each. In **Verify** the agent runs the full test suite, mutation tests where they exist, and architectural rules; the human reviews the diff against the plan.

Claude Code's **plan mode** enforces step 2 by withholding write access until approval. Use it for everything beyond a one-line change. The `think`, `megathink`, `ultrathink` triggers raise the agent's reasoning budget for harder steps; use `ultrathink` for refactors that span more than three files.

### 3.3 Prompting templates

Templates the team should keep in `.claude/commands/` and as Copilot custom instructions in `.github/copilot-instructions.md`. Each is a starting point; tune to the task.

**Template A — Mechanical refactor.** *"Refactor `clsCMReportMain1.GetExposureGrid` so that the DataTable[] return becomes a typed `CmExposureDto`. Constraints: target net8.0, nullable enabled, no behaviour change, preserve column ordering and null semantics exactly. Produce the change as a unified diff against `src/OVI.Web/...`. Before writing any code, list the call sites you intend to touch and confirm the plan with me. Do not modify the SQL stored procedure."*

**Template B — Characterization test seeding.** *"Read `Controllers/ReportsController.GetExposure` and the legacy AJAX endpoint at `/Reports/Exposure/Data`. Generate xUnit characterization tests using `WebApplicationFactory<Program>` that capture the response shape for inputs <list>. Use Verify for snapshot assertions and scrub `Timestamp` and `CorrelationId` fields. **Label these tests `[Trait(\"Kind\", \"Characterization\")]` and add an XML comment stating they encode current behaviour, including any bugs.** Do not infer correctness; do not assert anything beyond observed output."*

**Template C — DTO extraction from DataTable usage.** *"Search the repository for all reads of `dt.Rows[i][\"<column>\"]` and `dr[\"<column>\"]` against the result of `clsCMCustomerMain1.GetCustomer`. Produce: (1) a `CustomerDto` record with nullable annotations matching observed null usage, (2) a `MapFromRow(DataRow)` extension method, (3) a Verify-based test that round-trips a sample row. Do not change call sites in this PR."*

**Template D — Repository extraction (Branch by Abstraction).** *"Introduce `ICmExposureRepository` and a default implementation `LegacyCmExposureRepository` that wraps the existing call to `clsCMReportMain1.GetExposureGrid` exactly. Register it as scoped in `Infrastructure/DependencyInjection.cs`. Migrate ONE call site (the `/Reports/Exposure` controller action) to inject and use the interface. Do not migrate other call sites. Do not implement a new EF Core version yet. Output: unified diff."*

Two cross-cutting prompting rules from Aider's *Unified diffs* research and Anthropic's documentation: ask for unified diffs rather than full files (reduces "lazy" elisions and large rewrites), and **state explicitly what must not change**. Models obey negative constraints when they are written as constraints, not hopes.

### 3.4 Review and verification protocols

OVI is regulated. The accountable author of any merged code is the **human reviewer who approved the PR**, not the AI. The following gates are non-negotiable.

Every AI-authored PR must pass: SAST (CodeQL or SonarQube), secret scanning (gitleaks or TruffleHog), dependency vulnerability check, and the full automated test suite. The PR description must record the tool (`Claude Code 2.x` or `GitHub Copilot Modernization`), the model name, and where feasible a link to the session transcript or `plan.md`. Git AI / Git Notes provide tooling support; absent that, a `Co-authored-by: Claude <noreply@anthropic.com>` trailer plus the prompt artefact in the PR description is acceptable.

**Forbidden zones for autonomous AI code generation** — the AI may suggest, but a senior engineer authors and a second engineer reviews: authentication and session handling, cryptographic operations and key handling, SQL construction and parameterisation, audit-log emission, anything touching PII or credit-decision logic, anything touching the encryption helper currently using the hardcoded key.

**Hallucination checks.** Reviewers verify that every `using`, `PackageReference`, and method call exists. Package-name typosquatting is a real supply-chain risk and AI agents have produced fictitious package names. NuGet is the only allowed source; lockfiles must be reviewed.

**The "lethal trifecta" rule** (Simon Willison): any agent with simultaneous access to **private data, untrusted external content, and external network egress** is a security incident waiting to happen. OVI's agent execution is sandboxed — read access to the repo, network egress restricted to `nuget.org` and `github.com` for the duration of the task, no production data in prompts.

### 3.5 The CM multi-result-set refactor — a worked example

The 8–11 result-set CM procedures are the largest single refactor in the migration. They illustrate where AI scales and where it must not. The work is split into roles.

**Pure AI work.** Inventorying every column read from every result set across the codebase. Generating `CmDashboardDto`, `CmExposureDto`, `CmRiskDto` records from observed usage with nullability and naming conventions. Generating Dapper `QueryMultiple` mappers from the inventory. Producing a Verify-snapshot characterization test that pins the current JSON shape returned by the legacy AJAX endpoint. Producing the repository interface and the legacy adapter implementation.

**Pair work.** Deciding whether two columns that look similar are actually the same business concept. Naming the DTO fields against business glossary, not column glossary. Deciding which result sets are reads of independent aggregates and which are projections of a single aggregate (the latter inform later proc-splitting work).

**Human-only work.** Decisions about which fields are nullable in the domain (the database may be lying). Decisions about which result sets are obsolete and can be dropped from the new shape. Approval of the characterization snapshot — the human is the one accepting that current behaviour is acceptable enough to lock down. Designing the Parallel Run experiment configuration, including sampling rate, ramp schedule, and mismatch-investigation owner. Sign-off on cutover.

The end-state is a single Application-layer query handler returning `CmDashboardDto`, an Infrastructure-layer Dapper repository implementing it via `QueryMultipleAsync`, and a Parallel Run that ran for at least two weeks at 100% with zero unresolved mismatches before the legacy code path was deleted. After cutover, the SP itself becomes a candidate for splitting into smaller, single-result-set procs in a later cycle.

---

## 4. The phased plan applied to OVI

Phases are sequenced for risk reduction, not feature delivery. Each phase declares entry criteria (what must be true to start), exit criteria (what defines done), risks, AI scope, rollback strategy, and verification approach.

### 4.1 Phase 0 — Stabilise and instrument (target 4–6 weeks)

The system must be observable before it can be safely changed. Phase 0 makes the legacy app diagnosable without touching its architecture.

**Entry criteria.** The team has read access to UAT and production, can deploy via the existing manual process, and has a shared runbook of how the system is currently operated. The encryption-key constant is identified and its blast radius is documented.

**Work.** Add Serilog with structured JSON output and a correlation-ID middleware (§5 examples). Externalise secrets — connection strings, the encryption key, third-party credentials — to `dotnet user-secrets` locally and Azure Key Vault (or equivalent) in UAT and production. Replace the hardcoded UAT/Live toggle with a typed configuration option bound from `appsettings.{env}.json`. Extract every stored procedure from the database into source control as idempotent `CREATE OR ALTER` scripts under `db/procs/`; introduce a baseline DACPAC so deltas can be reviewed in PRs. Add a smoke-test project — a handful of `WebApplicationFactory` integration tests asserting that the home page, login, and the top three reports return `200`. Add a CI pipeline (GitHub Actions or Azure Pipelines) that builds, tests, and packages on every PR. Deployments remain manual but are now reproducible from a versioned artefact.

**AI scope.** Excellent fit: generate the SP extraction scripts, scaffold the smoke tests, draft Serilog configuration, write the `IConfiguration` binding for the toggle. Human review for every secret-handling change.

**Risks.** The encryption-key migration is the highest-risk single change — any data encrypted under the old key must remain readable. Use envelope encryption with the old key as a wrapped key in the vault until a planned re-encryption cycle is complete. **Do not delete the old key value from anywhere until you have demonstrated end-to-end key rotation in UAT.**

**Rollback.** Each change in Phase 0 is independent and rolls back via revert. The encryption-key change rolls back by re-deploying the previous binary; the vault remains in place but unused. Smoke tests and CI are additive and have no rollback.

**Exit criteria.** Every secret loads from configuration, no string constant in the repo represents a credential. Every stored procedure exists in `db/procs/` and matches production. CI runs on every PR. The smoke-test suite covers the top ten user journeys and runs in under five minutes. Structured logs reach a queryable sink (Seq, Application Insights, or Splunk) with correlation IDs.

**Verification.** A clean clone, a fresh dev machine, and `dotnet user-secrets` set produces a runnable instance. A red CI build blocks merge. The encryption-key rotation is exercised in UAT.

### 4.2 Phase 1 — Introduce seams (target 6–10 weeks)

The legacy structure remains; the team adds the four-project Clean Architecture skeleton alongside it and starts introducing interfaces.

**Entry criteria.** Phase 0 exit criteria are met. The team has agreed on the project layout (§5.1) and naming conventions.

**Work.** Create `OVI.Domain`, `OVI.Application`, `OVI.Infrastructure`, `OVI.Web` projects, with the existing MVC code remaining inside `OVI.Web` for now. Wire constructor DI in `Program.cs` with the `AddApplication`/`AddInfrastructure`/`AddPersistence` pattern (§5.2). Identify the three to five most-modified legacy classes (`Common.cs`, `clsCMReportMain1`, `clsCMCustomerMain1`, the encryption helper) and apply Branch by Abstraction step 2 — extract an interface and a default implementation that delegates to the existing static or instance code. Migrate **one** call site per interface to use constructor injection; leave the rest. Stand up the Anti-Corruption Layer skeleton in Infrastructure: an `Adapters/` folder with one adapter per legacy proc, returning shaped DTOs that the Application layer can consume.

**AI scope.** Strong fit for the project scaffolding, the `IServiceCollection` extension methods, the interface extraction, and the legacy adapter delegations. Pair work for naming the interfaces (these names will outlive the migration). Human-only for the encryption-helper interface — the design must satisfy the security review.

**Risks.** Captive dependencies (singleton holding scoped) and accidental service-locator usage. Mitigate by enabling scope validation in production for the duration of Phase 1 (`UseDefaultServiceProvider(o => { o.ValidateScopes = true; o.ValidateOnBuild = true; })`). The bigger risk is **doing too much**: refactoring every class to use DI in one phase is a big-bang in disguise. Limit Phase 1 to extracting interfaces and migrating one canary call site each.

**Rollback.** Per-PR revert. The new projects compile but are largely empty; reverting interface extractions is mechanical because call-site changes are minimal.

**Exit criteria.** The four-project solution builds and runs identically to before. Three to five interfaces exist with one canary call site each. The ACL skeleton has at least one working adapter consumed by one Application-layer query. DI registration is centralised. No new behaviour has shipped.

**Verification.** Smoke tests still pass. A new architecture test (using NetArchTest or ArchUnitNET) asserts that `OVI.Domain` references nothing, `OVI.Application` references only `OVI.Domain`, `OVI.Infrastructure` references `OVI.Application`, and `OVI.Web` references `OVI.Infrastructure`. The dependency rule is now machine-checked.

### 4.3 Phase 2 — Replace data access (target 4–6 months)

Data access moves from raw ADO.NET inside MVC controllers to repository interfaces in Application, EF Core implementations for new tables, and Dapper implementations for stored procs that cannot yet be split.

**Entry criteria.** Phase 1 complete. At least one repository interface is in production use through the canary call site. The team has agreed on the EF Core/Dapper boundary (§5.5).

**Work.** Stand up `AppDbContext` with EF Core 8 against the existing SQL Server database, mapping only the tables used by the first migrated module. Add `FromSql` and `SqlQuery<T>` for single-result-set procs (§5.4). Add a Dapper-based repository for multi-result-set procs using `QueryMultipleAsync` (§5.5). For each module, **complete a Branch by Abstraction cycle**: every call site moved to the interface, both implementations available, the new implementation guarded by a feature flag, a Parallel Run experiment validating equivalence on read paths, then cutover and deletion of the legacy implementation.

Apply Expand–Contract to any proc whose return shape is changing: add `usp_GetCustomer_v2` alongside `usp_GetCustomer`, route the new code path to v2, retire v1 only after the last caller is removed. Source control catches both.

The CM multi-result-set proc (§3.5) is the hardest single piece of work in this phase. Allocate four to six weeks of two engineers with AI assistance.

**AI scope.** Excellent fit: generating typed DTOs from observed `DataRow` usage, generating Dapper mappers, generating EF Core entity configurations from existing schema, generating Verify-based snapshot tests against legacy outputs. Pair work: deciding what is read versus written, designing the Parallel Run sampling, adjudicating mismatches. Human-only: deciding final DTO shapes against business glossary, sign-off on cutover.

**Risks.** **Mixed EF Core and raw ADO.NET in the same module without a clear boundary** — the most common reason these migrations stall. The rule: a module is either fully on the repository interface or fully on the legacy code, never both. The interface boundary is the line. **Stored procs called from both legacy and new code paths during transition** require extreme care: changing the proc affects both, and forward-only thinking applies — never destructive changes during dual-call. Use the v2 pattern. **Connection and transaction sharing** between EF Core and Dapper requires the shared-connection pattern (§5.5) — without it, transactions silently split.

**Rollback.** Each module migration is gated by a feature flag (`Module.Reports.UseNewDataAccess`). Flip the flag off; the legacy code path resumes. Keep the flag for at least four weeks after cutover before deletion. Database changes follow Expand–Contract: the contract step is irreversible without restore from backup, so it happens only after dual-running has confirmed equivalence.

**Exit criteria.** Every data-access call site in modernized modules goes through a repository interface. Every stored proc called from those modules is in source control and has at least a snapshot test. EF Core is in use for at least new tables. The CM proc is mapped to typed DTOs in production. No `DataTable` returns from any new code path.

**Verification.** Per-module Parallel Run dashboards show zero unresolved mismatches for two weeks before cutover. Architecture tests assert no `System.Data.DataTable` in `OVI.Application` or `OVI.Domain`. Integration tests cover the Dapper grid mappings against a Testcontainers SQL Server instance.

### 4.4 Phase 3 — Replace UI module by module (target 3–6 months, parallel with Phase 2)

The UI moves module by module from server-rendered Razor with jQuery AJAX-against-DataTable endpoints to typed view models, then optionally to minimal API endpoints with frontend "islands". The transition runs through the YARP façade.

**Entry criteria.** YARP façade is in place fronting the application (introduced as the last task of Phase 1 or first of Phase 3). At least one module's data access is on the repository interface (Phase 2 progress).

**Work.** Stand up YARP in-process (§5.7) with a catch-all to the existing MVC pipeline. Migrate one route at a time: convert the controller action to use the Application-layer query, build a typed view model, render with Razor. Replace AJAX `DataTable` endpoints with minimal API endpoints returning typed JSON (§5 endpoint group example), guarded by `[Authorize]` and antiforgery. Update the jQuery client to consume the typed JSON or, where reasonable, replace the page with a small frontend island using a chosen framework (kept consistent across modules).

**AI scope.** Strong fit for view-model generation, Razor template scaffolding, OpenAPI annotation, and the jQuery-to-fetch conversion. Pair work for endpoint contract design (these are external, even if currently consumed only by the same UI). Human-only for any endpoint touching auth or PII.

**Risks.** **Antiforgery tokens** silently breaking when AJAX clients move from form-encoded to JSON — `app.UseAntiforgery()` plus `[ValidateAntiForgeryToken]` on the new endpoints, with the token surfaced via a meta tag and read by the client. **Data Protection key sharing** if the legacy and new paths both issue cookies — see §6.4. **Premature minimal API extraction** before the data layer is on a repository will entangle UI and data refactors; complete Phase 2 for a module before cutting Phase 3 for the same module.

**Rollback.** Per-route via the YARP route table — flip a route entry from the new local handler to the legacy upstream. Feature-flagged at the route level (§5.8 example) allows percentage rollouts.

**Exit criteria.** Every modernized module has typed view models or typed JSON endpoints. No new code reads or writes `DataTable`. Antiforgery is enforced on all state-changing endpoints. OpenAPI is published for the new endpoints.

**Verification.** Visual regression test on representative pages. Snapshot tests on JSON endpoints via Verify. End-to-end tests covering at least one user journey per modernized module.

### 4.5 Phase 4 — Decompose `Common.cs` and `clsCM*Main1` (target 2–4 months, overlaps Phases 2–3)

The largest legacy classes finally die. By the time Phase 4 starts, most call sites have already moved to interfaces (Phase 1) and many have moved to the new implementations (Phase 2). Phase 4 finishes the deletion.

**Entry criteria.** Branch by Abstraction step 4 is complete for the target class — both implementations live behind the interface, the new one is the default in at least UAT.

**Work.** Migrate the remaining call sites onto the new implementation. Delete the legacy implementation. Delete the interface if it has only one implementation and exists only for migration purposes (Khorikov's *headless interfaces* anti-pattern); keep it if it has genuine domain meaning. Decompose any "god procedures" the class wraps using the v1/v2 split, then delete v1 after dual-running.

**AI scope.** Mechanical work — moving call sites, deleting unused code, following the `IDE0051` and unused-symbol diagnostics. Excellent fit. Human-only: any decomposition that involves deciding what counts as a single responsibility.

**Risks.** Hidden call sites — reflection, dynamic SQL, Razor `@Html.Action`, scheduled jobs outside the repository. Search the operational environment, not just the repository. **The cleanup phase is where teams declare victory too early**; the criterion is *zero references in production*, not *zero references in main*.

**Rollback.** Re-add the legacy class from version control. This is exactly why source control is non-negotiable for Phase 0 SP extraction.

**Exit criteria.** `Common.cs` and the `clsCM*Main1` family have zero references in the codebase and are deleted. The git log records the deletion commit.

**Verification.** Architecture tests assert that the legacy classes do not exist. Production telemetry shows zero invocations of any legacy entry point for at least four weeks before deletion.

### 4.6 Phase 5 — Modernise cross-cutting concerns (target 2–4 months, partly continuous)

Auth, antiforgery, data protection, structured logging, and observability finalise. Many of these are partly addressed in earlier phases; Phase 5 is the consolidation.

**Entry criteria.** New auth scheme decided (cookie auth with shared data protection keys for incremental, OIDC via an external IdP for endpoint-state — see §6.4). Observability sink chosen.

**Work.** Replace the custom session-based auth with ASP.NET Core cookie authentication, sharing the data-protection ring with the legacy app during transition (`SetApplicationName`, persisted keys in Azure Blob or Redis), so users do not re-authenticate at cutover. If OIDC is the long-term destination, stand up the IdP, register both the legacy and new app as clients, and migrate users gradually. Enforce antiforgery on all state-changing endpoints. Expand Serilog enrichment to include user identity, tenant, and request correlation. Add OpenTelemetry traces, metrics, and logs (§5 cross-cutting examples) exporting to OTLP. Publish a structured **audit-event stream** for SOX-relevant actions to a WORM-protected sink (Azure Blob immutability, S3 Object Lock, or equivalent).

**AI scope.** Strong fit for boilerplate (Serilog/OTel registration, audit-event emission, antiforgery wiring). Human-only for auth migration design and audit-event schema.

**Risks.** Forcing all users to re-authenticate is a business event, not a technical detail — coordinate with operations. **Audit-log gaps** during the transition are a compliance finding waiting to happen; both code paths must emit equivalent events during dual-running.

**Rollback.** Auth changes ride on a feature flag where possible; the cookie path can fall back to the legacy session reader. Audit-event emission is additive.

**Exit criteria.** No custom session-based auth in production. Antiforgery enforced everywhere. Structured logs, traces, and metrics exported. Audit events for every regulated action land in immutable storage.

**Verification.** A penetration test on the new auth path. An audit-trail review against a sampled day's activity confirming completeness.

---

## 5. Code templates

These are minimum-viable shapes. Adapt naming and structure to OVI's conventions; do not adopt verbatim without reading.

### 5.1 Solution layout

```
OVI.sln
├── src/
│   ├── OVI.Domain/             # entities, value objects, domain events; references nothing
│   ├── OVI.Application/        # use cases, query/command handlers, DTOs, repository interfaces; ref → Domain
│   ├── OVI.Infrastructure/     # EF Core, Dapper, ACL adapters, external clients; ref → Application
│   └── OVI.Web/                # ASP.NET Core host, controllers, Razor, minimal endpoints; ref → Infrastructure
├── tests/
│   ├── OVI.UnitTests/
│   ├── OVI.IntegrationTests/   # WebApplicationFactory + Testcontainers
│   └── OVI.ArchitectureTests/  # NetArchTest dependency-rule assertions
└── db/
    └── procs/                  # CREATE OR ALTER scripts under source control
```

`OVI.Domain.csproj`:

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
    <TreatWarningsAsErrors>true</TreatWarningsAsErrors>
  </PropertyGroup>
</Project>
```

`OVI.Infrastructure.csproj` (relevant parts):

```xml
<ItemGroup>
  <ProjectReference Include="..\OVI.Application\OVI.Application.csproj" />
  <PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="8.*" />
  <PackageReference Include="Dapper" Version="2.*" />
</ItemGroup>
```

### 5.2 DI registration

```csharp
// OVI.Infrastructure/DependencyInjection.cs
public static class InfrastructureRegistration
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services, IConfiguration config)
    {
        services.AddDbContext<AppDbContext>(o =>
            o.UseSqlServer(config.GetConnectionString("Default"),
                sql => sql.EnableRetryOnFailure()));

        services.AddScoped<IDbConnectionFactory>(_ =>
            new SqlDbConnectionFactory(config.GetConnectionString("Default")!));

        // Repositories
        services.AddScoped<ICmExposureRepository, DapperCmExposureRepository>();
        services.AddScoped<ICustomerRepository, EfCustomerRepository>();

        // ACL adapters during transition
        services.AddScoped<ILegacyCommon, LegacyCommonAdapter>();
        services.AddScoped<ICryptoService, KeyVaultCryptoService>();

        return services;
    }
}

// Program.cs
var builder = WebApplication.CreateBuilder(args);
builder.Host.UseDefaultServiceProvider((ctx, o) =>
{
    o.ValidateScopes = true;
    o.ValidateOnBuild = true;
});
builder.Services
    .AddApplication()
    .AddInfrastructure(builder.Configuration)
    .AddControllersWithViews();
builder.Services.AddFeatureManagement(builder.Configuration.GetSection("FeatureManagement"));
```

### 5.3 Repository interface and EF Core SP wrapper

```csharp
// OVI.Application/Customers/ICustomerRepository.cs
public interface ICustomerRepository
{
    Task<CustomerDto?> GetByIdAsync(int id, CancellationToken ct);
    Task<IReadOnlyList<CustomerDto>> SearchAsync(string term, CancellationToken ct);
}

// OVI.Infrastructure/Customers/EfCustomerRepository.cs
public sealed class EfCustomerRepository(AppDbContext db) : ICustomerRepository
{
    public async Task<CustomerDto?> GetByIdAsync(int id, CancellationToken ct)
    {
        var rows = await db.Database
            .SqlQuery<CustomerDto>($"EXEC dbo.usp_GetCustomer_v2 @CustomerId = {id}")
            .ToListAsync(ct);
        return rows.SingleOrDefault();
    }

    public async Task<IReadOnlyList<CustomerDto>> SearchAsync(string term, CancellationToken ct)
        => await db.Database
            .SqlQuery<CustomerDto>($"EXEC dbo.usp_SearchCustomers_v2 @Term = {term}")
            .ToListAsync(ct);
}
```

`SqlQuery<T>` (EF Core 8) handles single-result-set procs returning rows that match `CustomerDto`. **Always use `FromSql`/`SqlQuery` interpolation, never `FromSqlRaw` with concatenation.** Microsoft's documentation is direct on the SQL injection risk (`learn.microsoft.com/ef/core/querying/sql-queries`).

### 5.4 Multi-result-set Dapper repository

```csharp
// OVI.Infrastructure/Cm/DapperCmExposureRepository.cs
public sealed class DapperCmExposureRepository(IDbConnectionFactory factory)
    : ICmExposureRepository
{
    public async Task<CmDashboardDto> GetDashboardAsync(int tenantId, CancellationToken ct)
    {
        await using var cn = await factory.OpenAsync(ct);
        var p = new DynamicParameters();
        p.Add("@TenantId", tenantId, DbType.Int32);

        await using var grid = await cn.QueryMultipleAsync(new CommandDefinition(
            "dbo.usp_GetCmDashboard",
            p,
            commandType: CommandType.StoredProcedure,
            commandTimeout: 60,
            cancellationToken: ct));

        return new CmDashboardDto
        {
            Status     = (await grid.ReadAsync<OperationStatus>()).Single(),
            Regions    = (await grid.ReadAsync<RegionDto>()).AsList(),
            Products   = (await grid.ReadAsync<ProductDto>()).AsList(),
            Customers  = (await grid.ReadAsync<CustomerDto>()).AsList(),
            Exposures  = (await grid.ReadAsync<ExposureDto>()).AsList(),
            Limits     = (await grid.ReadAsync<LimitDto>()).AsList(),
            Movements  = (await grid.ReadAsync<MovementDto>()).AsList(),
            Alerts     = (await grid.ReadAsync<AlertDto>()).AsList(),
            Audit      = (await grid.ReadAsync<AuditEntryDto>()).AsList()
        };
    }
}
```

The result-set order is contractual with the SP. A snapshot test (§5.10) and a comment in the SP file lock it down. When the SP is later split into single-result-set procs, the repository becomes a coordinator and each grid moves to its own `SqlQuery<T>`-based query.

### 5.5 EF Core and Dapper sharing a connection

```csharp
public async Task<int> SaveAndReadAsync(SaveCmd cmd, CancellationToken ct)
{
    await using var tx = await _db.Database.BeginTransactionAsync(ct);
    _db.Customers.Add(cmd.ToEntity());
    await _db.SaveChangesAsync(ct);

    var conn = _db.Database.GetDbConnection();
    var dapperTx = _db.Database.CurrentTransaction!.GetDbTransaction();
    var rows = await conn.QueryAsync<AuditEntryDto>(
        "dbo.usp_GetAuditTrail",
        new { CustomerId = cmd.Id },
        transaction: dapperTx,
        commandType: CommandType.StoredProcedure);

    await tx.CommitAsync(ct);
    return rows.Count();
}
```

Both libraries operate on the same `DbConnection` and the same transaction. Without the explicit `transaction:` parameter, Dapper opens its own transaction and the boundary fragments silently.

### 5.6 Anti-Corruption Layer adapter

```csharp
// OVI.Infrastructure/Acl/LegacyCmExposureAdapter.cs
internal sealed class LegacyCmExposureAdapter(
    IDbConnectionFactory factory,
    ILogger<LegacyCmExposureAdapter> log) : ICmExposureRepository
{
    public async Task<CmDashboardDto> GetDashboardAsync(int tenantId, CancellationToken ct)
    {
        // Calls into the legacy multi-result-set proc and translates its
        // denormalised, sentinel-bearing rows into clean Domain-shaped DTOs.
        // This adapter is allowed to be ugly. It absorbs mess.
        var raw = await CallLegacyProcAsync(tenantId, ct);

        return new CmDashboardDto
        {
            Status   = MapStatus(raw.StatusRow),
            Regions  = raw.RegionRows.Select(MapRegion).ToList(),
            // ... etc, including null-sentinel handling and column-name fixes
        };
    }

    private static RegionDto MapRegion(LegacyRegionRow r) => new(
        Id: r.RegionId,
        Name: string.IsNullOrWhiteSpace(r.RgnNme) ? "(unknown)" : r.RgnNme.Trim(),
        IsActive: r.ActvFlg == "Y");
}
```

The adapter is internal to Infrastructure. The Application layer references only the interface and the clean DTOs.

### 5.7 YARP Strangler Fig configuration

```csharp
// Program.cs
builder.Services.AddReverseProxy()
                .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

var app = builder.Build();
app.UseAuthentication();
app.UseAuthorization();
app.UseAntiforgery();
app.MapControllers();          // Migrated MVC actions
app.MapOrderEndpoints();       // Migrated minimal APIs
app.MapReverseProxy();         // Catch-all to legacy
app.Run();
```

```json
// appsettings.json (excerpt)
{
  "ReverseProxy": {
    "Routes": {
      "newReports": {
        "ClusterId": "self",
        "Match": { "Path": "/reports/exposure/{**catch-all}" }
      },
      "legacyFallback": {
        "ClusterId": "legacy",
        "Match": { "Path": "{**catch-all}" },
        "Order": 1000
      }
    },
    "Clusters": {
      "self":   { "Destinations": { "local":  { "Address": "http://localhost:5000/" } } },
      "legacy": { "Destinations": { "iis":    { "Address": "https://ovi-legacy.internal/" } } }
    }
  }
}
```

The route table is the **migration ledger**. New routes move from `legacyFallback` to a named local route by editing this file. Microsoft's incremental migration article (`devblogs.microsoft.com/dotnet/incremental-asp-net-to-asp-net-core-migration/`) is the canonical reference.

### 5.8 Feature-flag gate

```csharp
// appsettings.json
"FeatureManagement": {
  "Reports.UseNewExposureQuery": {
    "EnabledFor": [
      { "Name": "Microsoft.Percentage", "Parameters": { "Value": 5 } }
    ]
  }
}

// OVI.Web/Reports/ExposureController.cs
public sealed class ExposureController(
    IFeatureManager features,
    ICmExposureRepository newRepo,
    ILegacyCmExposureRepository legacyRepo) : Controller
{
    public async Task<IActionResult> Index(int tenantId, CancellationToken ct)
    {
        var dto = await features.IsEnabledAsync("Reports.UseNewExposureQuery")
            ? await newRepo.GetDashboardAsync(tenantId, ct)
            : await legacyRepo.GetDashboardAsync(tenantId, ct);
        return View(dto);
    }
}
```

Wrap the call in a Parallel Run experiment (§5.9) before flipping the flag from 5% to 100%.

### 5.9 Parallel Run with Scientist.NET

```csharp
public async Task<CmDashboardDto> GetDashboardAsync(int tenantId, CancellationToken ct)
{
    return await Scientist.ScienceAsync<CmDashboardDto>("cm-dashboard", experiment =>
    {
        experiment.Use(() => _legacy.GetDashboardAsync(tenantId, ct));
        experiment.Try(() => _new.GetDashboardAsync(tenantId, ct));
        experiment.Compare((a, b) => CmDashboardDtoComparer.Equivalent(a, b));
        experiment.RunIf(() => _features.IsEnabledAsync("Reports.ParallelRun").Result);
        experiment.Clean(d => CmDashboardDtoScrubber.Scrub(d)); // strip volatile fields
    });
}
```

Mismatches publish to a queryable sink (typically Application Insights with custom dimensions or a dedicated SQL table). The team reviews mismatches daily during ramp. Fowler's discussion in *DarkLaunching* and the Scientist README are the references.

### 5.10 Characterization test with WebApplicationFactory and Verify

```csharp
[Trait("Kind", "Characterization")]
public sealed class ExposureEndpointCharacterization(OviApiFactory f)
    : IClassFixture<OviApiFactory>
{
    /// <summary>
    /// Locks down current behaviour of /reports/exposure/data, including
    /// any latent bugs. Treat snapshot diffs as deliberate decisions.
    /// </summary>
    [Fact]
    public async Task GetExposureData_returns_locked_shape()
    {
        var client = f.CreateClient();
        var resp = await client.GetAsync("/reports/exposure/data?tenantId=42");
        resp.EnsureSuccessStatusCode();
        var json = await resp.Content.ReadAsStringAsync();

        await Verify(json)
            .UseDirectory("Snapshots")
            .ScrubMember("CorrelationId")
            .ScrubMember("GeneratedAt");
    }
}
```

The first run produces `*.received.txt`; the human reviews and renames to `*.verified.txt`. From then on, any change to the shape fails the test until intentionally re-approved.

### 5.11 Typed-DTO mapping with Mapperly

```csharp
[Mapper]
public partial class CustomerMapper
{
    public partial CustomerDto ToDto(Customer entity);
    public partial List<CustomerDto> ToDto(IEnumerable<Customer> entities);

    [MapProperty(nameof(Customer.PrimaryAddress.Line1), nameof(CustomerDto.AddressLine1))]
    public partial CustomerDto ToFlatDto(Customer entity);
}
```

Mapperly is source-generated, MIT-licensed, and produces readable, debuggable code at compile time. AutoMapper remains acceptable where existing investment is large or `ProjectTo` IQueryable scenarios dominate, but its 2024 commercial-license change (`automapper.io/#pricing`) makes Mapperly the default for new code.

---

## 6. Risk management and rollback

### 6.1 Rollback procedure by phase

Phase 0 changes are additive and revert via `git revert`. Phase 1 interfaces have one canary call site each; reverting the call site change is a one-PR rollback. Phase 2 is the highest-risk phase: every module migration is gated by a feature flag, and the flag remains for at least four weeks after cutover. Phase 3 route migrations roll back via the YARP route table — flip a route entry, redeploy, traffic returns to legacy. Phase 4 deletions are recoverable from version control but cost more operationally; gate the deletion commit behind two weeks of zero invocations in production telemetry. Phase 5 auth migration rides on the shared-data-protection-keys path so legacy and new can co-exist — rollback is removing the new app from rotation, not re-issuing user credentials.

### 6.2 Data migration risks when SPs change shape

Three rules govern SP-shape changes during the migration. First, **never destructively change a stored procedure that has both legacy and new callers**; introduce `usp_X_v2` and migrate callers explicitly. Second, **never change a column's type or nullability in the same release that stops writing the old form**; expand, migrate, contract across at least two releases. Third, **every SP change ships through the same review process as application code** — DACPAC delta in the PR, characterization test for any caller, no exceptions for "just a tiny tweak". The Defacto and Xata writeups on production database migrations (`getdefacto.com/article/database-schema-migrations`, `xata.io/blog/pgroll-expand-contract`) are the operational references.

Forward-only is the governing posture. Rollback scripts for destructive changes are unreliable and create false confidence; the safety net is a pre-migration snapshot and point-in-time recovery, not a "down" migration. Restore from backup is acceptable in a true emergency — but the bar for a true emergency is "we cannot read customer data", not "we found a bug in production".

### 6.3 Compliance considerations for banking software

OVI is in scope for internal audit and likely SOX-equivalent controls. Three obligations bind the migration.

**Audit logging must be unbroken.** Every state-changing action emits a structured event with user identity, action, before/after values for regulated fields, timestamp (NTP-synced), correlation ID, and an integrity hash. Events land in WORM-protected storage (Azure Blob immutability, S3 Object Lock, or equivalent) with retention sized to the longest applicable obligation (typically seven years). During Phase 2 dual-running, **both code paths must emit equivalent events** — a gap is a finding.

**Change management is segregated.** The deployer is not the author. Every production deployment carries a change ticket linked to the PR, the test evidence, and the rollback plan. AI-generated code does not relax this — the human approver is the accountable author. The PR description records which AI tool produced which change.

**Secrets and keys are never in code.** The hardcoded encryption key currently in OVI is a finding waiting to be raised. Phase 0 retires it via envelope encryption: the old key is wrapped in a vault key and used only to decrypt legacy ciphertext until a planned re-encryption cycle completes. New ciphertext uses a vault-managed key. Managed identities, not service-principal secrets, authenticate the application to the vault. One vault per environment; key rotation exercised in UAT before production.

### 6.4 Stored procs called from both legacy and new code paths

The pattern is the same as Expand–Contract applied to procs. Any change to the proc that would break the legacy caller is forbidden. Three options:

The first is **freeze-and-fork**: leave `usp_X` untouched, create `usp_X_v2` with the desired shape, route only new callers to v2, retire `usp_X` after the last legacy caller migrates. This is the default.

The second is **internal refactor with a stable contract**: change the proc body but keep the result-set shape identical. Acceptable for performance work; a snapshot test on the result set guards the contract.

The third is **a façade proc**: `usp_X` becomes a thin wrapper that calls `usp_X_v1_legacy` or `usp_X_v2_new` based on a session parameter or a configuration flag. Useful when callers cannot easily be discriminated at the application layer. Operationally heavier; reserve for cases where the first two do not work.

Whichever option is chosen, the SP file in `db/procs/` is the audit record. PRs that change a shared proc require sign-off from a senior engineer who can confirm the legacy caller list is complete.

---

## 7. Anti-patterns and why we reject them

**Big-bang rewrite.** Industry research routinely cites failure rates above 70% for full replacements of mature financial systems (Capgemini-cited statistic per the WJAETS 2025 paper; Plumery's banking-modernization writeup independently quotes "80% never achieve any results or simply fail"). Even when they succeed, business value pauses for the duration. OVI is too operationally critical and the team too small for a freeze of any meaningful length. Strangler Fig delivers incremental value and reduces risk.

**Half-DI, half-manual instantiation.** Code that mixes constructor injection with inline `new SomeService()` calls hides the dependency graph and prevents tests. The DI rule on OVI is binary: a module is either fully on constructor injection or it has not started Phase 1. The architecture test for `OVI.Application` references will fail PRs that introduce service-locator usage in business code.

**Mixed EF Core and raw ADO.NET in the same module without a clear boundary.** This is the most common reason these migrations stall. Once `DataTable` and `DbContext` co-exist in one method, transactions split silently, change-tracking misbehaves, and the test setup doubles. The boundary is the repository interface — above it, the Application layer never sees ADO.NET; below it, the implementation chooses one technology per repository.

**Refactoring without characterization tests.** Feathers' aphorism — "to me, legacy code is simply code without tests" — is the team's working definition. A refactor of any production code without a characterization test pinning current behaviour is reckless. The exception is purely additive change to greenfield code.

**"Fix the typos" cleanups during architectural migration.** Cosmetic changes interleaved with structural ones make diffs unreviewable, mask bugs, and inflate review time. Cosmetic PRs ship in dedicated commits that touch nothing semantic. A team rule: a PR is either structural or cosmetic, never both.

**Premature microservices extraction.** OVI's stated target is a Clean Architecture .NET 8 *modular monolith*, not microservices. Extracting services before the modular boundaries inside the monolith are stable produces distributed monoliths — the worst of both worlds. Microservices remain a future option after Phases 4 and 5 complete; they are not on the current roadmap.

**Headless interfaces that exist only because "we should use interfaces".** An interface with a single implementation that is unlikely to gain another adds indirection without optionality. During migration, BBA-introduced interfaces are legitimate even when single-implementation because they exist to enable the swap; once the swap completes, delete the interface unless it has domain meaning.

---

## 8. Success metrics

Two layers of metrics: **DORA's five for delivery health**, and **migration-specific metrics for progress**. The DORA report (`dora.dev/guides/dora-metrics-four-keys/`) defines change lead time, deployment frequency, failed-deployment recovery time, change failure rate, and rework rate (added 2024). Tech Radar Vol. 33 emphasises that AI-generated code amplifies the importance of stability metrics — rising rework rate is the canonical leading indicator of AI-driven blind spots.

OVI tracks the following migration-specific metrics in a dashboard reviewed weekly:

| Metric | Target trajectory | Source |
|---|---|---|
| % of HTTP routes terminating on the new stack (not forwarded by YARP) | 0% → 100% over Phases 3–5 | Route table + access logs |
| % of stored procedures present in `db/procs/` source control | 100% by end of Phase 0 | Repository inventory vs DB |
| % of modules with their data access behind a repository interface | 0% → 100% across Phase 2 | Architecture test counter |
| Mutation score on modernized modules | ≥ 60% line, trending up | Stryker.NET |
| Number of `DataTable`-returning code paths in modernized modules | → 0 | Roslyn analyser |
| Number of open feature flags > 90 days old | → 0 | `docs/feature-flags.md` audit |
| Hardcoded-secret count | 0 from end of Phase 0 onward | gitleaks/TruffleHog CI |
| % of services using managed-identity auth to data and secrets | → 100% | Cloud-platform audit |
| Audit-event coverage on regulated actions | 100% before Phase 5 exit | Compliance review |

**Definition of done for "modernized".** A module is modernized when: every HTTP entry point is in the new stack with typed view models or typed JSON; every data access is through a repository interface backed by EF Core or Dapper (no `DataTable`); every stored proc it depends on is in source control with a snapshot test; characterization tests cover the user-facing endpoints; the module has zero references to `Common.cs`, `clsCM*Main1`, the legacy crypto helper, or any hardcoded secret; mutation testing meets the threshold; and audit events are emitted for every regulated action.

**Leading indicators of trouble.** Migration velocity (% routes per quarter) flat or declining over two consecutive quarters indicates a sequencing problem or hidden technical debt — convene a planning review. Rising change failure rate or rework rate during migration windows indicates the migration itself is destabilising production — pull back via feature flag or canary. Growing dual-system operational cost without a decommission roadmap signals organisational drift, not a technical problem — escalate to leadership. Hot incidents concentrating on the new stack indicate premature traffic shift — reduce the rollout percentage and investigate before resuming. Documentation lag — DORA's research consistently shows documentation quality predicts reliability — is a quiet warning that pays out as instability later.

---

## 9. Cadence and ways of working

The team commits to **trunk-based development** — short-lived branches, integration daily, feature flags rather than long-lived branches for unfinished work. Every PR runs CI; every merge is potentially deployable. Deployments remain manual through Phase 0 but become reproducible from versioned artefacts; Phase 5 is the natural moment to introduce automated deployment to UAT.

Every Friday the team posts a one-page migration update covering progress against the metrics dashboard, the next week's intended scope, and the open Parallel Run mismatches. Once a quarter, a retrospective updates this playbook. AI-tool usage is recorded on each PR; quarterly the team reviews where AI accelerated work and where it produced rework, and updates §3 accordingly.

---

## 10. Conclusion

The OVI modernization succeeds because it is incremental, instrumented, and reversible — not because it is fast. Strangler Fig keeps the legacy app in production while the new architecture grows around it. Branch by Abstraction kills `Common.cs` and the `clsCM*Main1` classes a call site at a time. Parallel Run proves the CM multi-result-set refactor before it ships. Characterization and approval tests turn an untested codebase into a refactorable one. Anti-Corruption Layers absorb the mess of legacy data shapes so the new domain stays clean. Expand–Contract governs every backwards-incompatible change to procs, columns, and contracts. Feature flags gate every cutover; managed identities and a vault retire the hardcoded key.

AI assistance multiplies the team's capacity for mechanical work — DTO extraction, test scaffolding, repository skeletons, doc generation — but does not change accountability. The human who approves the PR is the author of record, and forbidden zones (auth, crypto, audit, business rules) remain human-authored. ThoughtWorks Tech Radar Vol. 33 puts this plainly: AI is leverage on engineering judgement, not a substitute for it, and stability metrics — especially rework rate — are the early-warning system.

Done well, this migration takes 12–18 months. Done badly, it never finishes. The discipline that distinguishes the two is in this document. Update it as the team learns. Auditors will ask for it; engineers six months from now will need it.

---

## 11. References

**Patterns and methodology.** Martin Fowler, *StranglerFigApplication* (`martinfowler.com/bliki/StranglerFigApplication.html`); Fowler, *DarkLaunching* (`martinfowler.com/bliki/DarkLaunching.html`); Danilo Sato on Fowler's bliki, *ParallelChange* (`martinfowler.com/bliki/ParallelChange.html`); Pete Hodgson on Fowler's site, *Feature Toggles* (`martinfowler.com/articles/feature-toggles.html`); Paul Hammant's writing on Branch by Abstraction (`paulhammant.com/blog/branch_by_abstraction.html`); Jez Humble, *Make Large-Scale Changes Incrementally with Branch by Abstraction* (`continuousdelivery.com/2011/05/make-large-scale-changes-incrementally-with-branch-by-abstraction/`); Martin Fowler, *BranchByAbstraction* (`martinfowler.com/bliki/BranchByAbstraction.html`); Eric Evans, *Domain-Driven Design*, Addison-Wesley, 2003; Microsoft, *Anti-corruption Layer pattern* (`learn.microsoft.com/azure/architecture/patterns/anti-corruption-layer`); Microsoft, *Strangler Fig pattern* (`learn.microsoft.com/azure/architecture/patterns/strangler-fig`); Michael Feathers, *Working Effectively with Legacy Code*, Prentice Hall, 2004; Pramod Sadalage and Martin Fowler, *Evolutionary Database Design* (`martinfowler.com/articles/evodb.html`); Llewellyn Falco, *ApprovalTests* (`approvaltests.com`); Simon Cropp, *Verify* (`github.com/VerifyTests/Verify`); Emily Bache, *Approval Testing* essay in *97 Things Every Java Programmer Should Know*.

**.NET implementation.** Robert C. Martin, *The Clean Architecture* (`blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html`); Microsoft, *Common web application architectures* (`learn.microsoft.com/dotnet/architecture/modern-web-apps-azure/common-web-application-architectures`); Steve Smith, *Clean Architecture template* (`github.com/ardalis/CleanArchitecture`); Jason Taylor, *Clean Architecture template* (`github.com/jasontaylordev/CleanArchitecture`); Vladimir Khorikov, *Enterprise Craftsmanship* blog (`enterprisecraftsmanship.com`); Microsoft, *Dependency injection in ASP.NET Core* (`learn.microsoft.com/aspnet/core/fundamentals/dependency-injection`); Microsoft, *DI guidelines* (`learn.microsoft.com/dotnet/core/extensions/dependency-injection/guidelines`); Microsoft, *EF Core SQL Queries* (`learn.microsoft.com/ef/core/querying/sql-queries`); Dapper repository (`github.com/DapperLib/Dapper`); Microsoft, *YARP documentation* (`learn.microsoft.com/aspnet/core/fundamentals/servers/yarp/`); Microsoft, *Incremental ASP.NET to ASP.NET Core migration* (`devblogs.microsoft.com/dotnet/incremental-asp-net-to-asp-net-core-migration/`); Jimmy Bogard, *AutoMapper* (`automapper.org`); Riok, *Mapperly* (`github.com/riok/mapperly`); Microsoft, *Microsoft.FeatureManagement reference* (`learn.microsoft.com/azure/azure-app-configuration/feature-management-dotnet-reference`); Microsoft, *Minimal APIs in ASP.NET Core* (`learn.microsoft.com/aspnet/core/fundamentals/minimal-apis/`); Microsoft, *Integration tests in ASP.NET Core* (`learn.microsoft.com/aspnet/core/test/integration-tests`); Testcontainers for .NET (`dotnet.testcontainers.org`); Serilog.AspNetCore (`github.com/serilog/serilog-aspnetcore`); OpenTelemetry .NET (`learn.microsoft.com/dotnet/core/diagnostics/observability-with-otel`); Microsoft, *Azure Key Vault configuration provider* (`learn.microsoft.com/aspnet/core/security/key-vault-configuration`).

**AI-assisted refactoring and modernization.** Anthropic, *Best Practices for Claude Code* (`code.claude.com/docs/en/best-practices`); Microsoft, *GitHub Copilot modernization overview* (`learn.microsoft.com/dotnet/core/porting/github-copilot-app-modernization/overview`); Microsoft, *Modernize .NET Anywhere with GHCP* (`devblogs.microsoft.com/dotnet/modernize-dotnet-anywhere-with-ghcp/`); ThoughtWorks Technology Radar Vol. 33 (`thoughtworks.com/radar`); Birgitta Böckeler, *Three things GenAI will not change about software delivery* (`thoughtworks.com/insights/blog/generative-ai/three-things-GenAI-will-not-change-about-software-delivery`); Birgitta Böckeler, *Two years of using AI tools* (`newsletter.pragmaticengineer.com/p/two-years-of-using-ai`); Martin Fowler, *Legacy Modernization meets GenAI* (`martinfowler.com/articles/legacy-modernization-gen-ai.html`); Simon Willison, *How I use LLMs to help me write code* (`simonw.substack.com/p/how-i-use-llms-to-help-me-write-code`); Aider, *Unified diffs make GPT-4 Turbo 3X less lazy* (`aider.chat/docs/unified-diffs.html`); David Adamo, *AI-Generated Tests Are Lying to You* (`davidadamojr.com/ai-generated-tests-are-lying-to-you/`).

**Banking, regulation, and operations.** AWS, *Capital One case study* (`aws.amazon.com/solutions/case-studies/capital-one/`); Monzo Engineering Principles (`monzo.com/blog/we-have-updated-our-engineering-principles`); ThoughtWorks, *Embracing the Strangler Fig pattern for legacy modernization* (`thoughtworks.com/insights/articles/embracing-strangler-fig-pattern-legacy-modernization-part-one`); Microsoft, *Migrate Azure Key Vault key workloads* (`learn.microsoft.com/azure/key-vault/general/migrate-key-workloads`); Microsoft, *ASP.NET Framework to Core authentication migration* (`learn.microsoft.com/aspnet/core/migration/fx-to-core/areas/authentication`); Scott Hanselman, *Sharing Authorization Cookies between ASP.NET 4.x and ASP.NET Core* (`hanselman.com/blog/sharing-authorization-cookies-between-aspnet-4x-and-aspnet-core-10`); Pete Hodgson, *Expand/Contract* (`blog.thepete.net/blog/2023/12/05/expand/contract-making-a-breaking-change-without-a-big-bang/`); Defacto Engineering, *Database schema migrations* (`getdefacto.com/article/database-schema-migrations`); DORA, *Software delivery performance metrics* (`dora.dev/guides/dora-metrics-four-keys/`); GitHub, *Scientist* (`github.com/github/scientist`); Scientist for .NET (`github.com/scientistproject/Scientist.net`).