# Feature Flags Registry

All feature flags must be registered here with an owner, category, and sunset date.
Flags older than their sunset date must be reviewed and either extended or removed.

| Flag Name | Category | Owner | Created | Sunset Date | Status | Description |
|-----------|----------|-------|---------|-------------|--------|-------------|
| Module.Delinquency.UseNewDataAccess | release | Team | 2026-04-29 | 2026-08-29 | off | Routes RM Delinquency data access through Dapper/MySQL instead of legacy ADO.NET |
| Module.CM.UseNewDataAccess | release | Team | 2026-04-29 | 2026-08-29 | off | Routes CM module data access through Dapper/MySQL instead of legacy Common.cs |

## Categories
- **release**: Short-lived, hide unfinished work
- **experiment**: Medium-lived, A/B testing
- **ops**: Variable lifespan, kill switches
- **permission**: Long-lived, business gating

## Rules
1. Every flag must have an owner and a sunset date
2. Flags past their sunset date are reviewed weekly
3. Dead flags are deleted, not left dormant
