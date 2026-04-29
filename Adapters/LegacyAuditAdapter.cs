using OVI.Domain.DTOs;
using OVI.Domain.Interfaces;

namespace Dashboard.Adapters;

/// <summary>
/// Legacy adapter that delegates audit events to CaptureProductivityDetails
/// on IDashboardRepository. Used as fallback when Audit.UseStructuredEvents is off.
/// </summary>
internal sealed class LegacyAuditAdapter : IAuditService
{
    private readonly IDashboardRepository _dashboardRepository;

    public LegacyAuditAdapter(IDashboardRepository dashboardRepository)
    {
        _dashboardRepository = dashboardRepository;
    }

    public void Record(AuditEventDto auditEvent)
    {
        _dashboardRepository.CaptureProductivityDetails(
            auditEvent.Actor,
            auditEvent.EventType,
            auditEvent.Module,
            1,
            auditEvent.EventType,
            auditEvent.Description);
    }
}
