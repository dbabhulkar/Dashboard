using Microsoft.FeatureManagement;
using OVI.Domain.DTOs;
using OVI.Domain.Interfaces;
using OVI.Infrastructure.Repositories;

namespace Dashboard.Adapters;

/// <summary>
/// Feature-flag gate: routes to Dapper (new) or legacy adapter based on flag.
/// When Module.Delinquency.UseNewDataAccess is on, uses DapperDashboardRepository.
/// Otherwise falls back to LegacyDashboardAdapter.
/// </summary>
internal sealed class FeatureFlaggedDashboardRepository(
    LegacyDashboardAdapter legacy,
    DapperDashboardRepository dapper,
    IFeatureManager featureManager) : IDashboardRepository
{
    private bool UseNew => featureManager.IsEnabledAsync("Module.Delinquency.UseNewDataAccess").GetAwaiter().GetResult();

    public List<DelinquencyDaysCountDto> GetDelinquencyDetails(string userId)
        => UseNew ? dapper.GetDelinquencyDetails(userId) : legacy.GetDelinquencyDetails(userId);

    public List<ComplianceDto> GetComplianceItem(string userId)
        => UseNew ? dapper.GetComplianceItem(userId) : legacy.GetComplianceItem(userId);

    public void CaptureProductivityDetails(string empCode, string formName, string moduleName, int totalCount, string activity, string activityDetails)
    {
        if (UseNew)
            dapper.CaptureProductivityDetails(empCode, formName, moduleName, totalCount, activity, activityDetails);
        else
            legacy.CaptureProductivityDetails(empCode, formName, moduleName, totalCount, activity, activityDetails);
    }
}
