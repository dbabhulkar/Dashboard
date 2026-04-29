using Microsoft.FeatureManagement;
using OVI.Domain.DTOs;
using OVI.Domain.Interfaces;
using OVI.Infrastructure.Audit;

namespace Dashboard.Adapters;

/// <summary>
/// Routes audit events to StructuredAuditService or LegacyAuditAdapter
/// based on the Audit.UseStructuredEvents feature flag.
/// </summary>
internal sealed class FeatureFlaggedAuditService : IAuditService
{
    private readonly StructuredAuditService _structured;
    private readonly LegacyAuditAdapter _legacy;
    private readonly IFeatureManager _featureManager;

    public FeatureFlaggedAuditService(
        StructuredAuditService structured,
        LegacyAuditAdapter legacy,
        IFeatureManager featureManager)
    {
        _structured = structured;
        _legacy = legacy;
        _featureManager = featureManager;
    }

    private bool UseStructured =>
        _featureManager.IsEnabledAsync("Audit.UseStructuredEvents").GetAwaiter().GetResult();

    public void Record(AuditEventDto auditEvent)
    {
        if (UseStructured)
            _structured.Record(auditEvent);
        else
            _legacy.Record(auditEvent);
    }
}
