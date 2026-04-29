using Microsoft.Extensions.Logging;
using OVI.Domain.DTOs;
using OVI.Domain.Interfaces;

namespace Dashboard.Adapters;

/// <summary>
/// ACL adapter: wraps legacy DashboardRepository behind IDashboardRepository.
/// Maps legacy model types to typed DTOs.
/// Phase 2+: replaced by DapperDashboardRepository in OVI.Infrastructure.
/// </summary>
internal sealed class LegacyDashboardAdapter(ILogger<LegacyDashboardAdapter> logger) : IDashboardRepository
{
    public List<DelinquencyDaysCountDto> GetDelinquencyDetails(string userId)
    {
        logger.LogDebug("Delegating to legacy DashboardRepository.GetDelinquencyDetails");
        var repo = new Repositories.DashboardRepository();
        var legacy = repo.GetDelinquencyDetails(userId);
        return legacy.Select(x => new DelinquencyDaysCountDto
        {
            Days_15 = x.Days_15, Days_30 = x.Days_30, Days_60 = x.Days_60,
            Items = x.Items, No = x.No, Percent = x.Percent, Value = x.Value, UploadedDate = x.UploadedDate
        }).ToList();
    }

    public List<ComplianceDto> GetComplianceItem(string userId)
    {
        logger.LogDebug("Delegating to legacy DashboardRepository.GetComplianceItem");
        var repo = new Repositories.DashboardRepository();
        var legacy = repo.GetComplianceItem(userId);
        return legacy.Select(x => new ComplianceDto
        {
            ComplianceItem = x.ComplianceItem, ItemCount = x.ItemCount, ItemDate = x.ItemDate
        }).ToList();
    }

    public void CaptureProductivityDetails(string empCode, string formName, string moduleName, int totalCount, string activity, string activityDetails)
    {
        logger.LogDebug("Delegating to legacy DashboardRepository.CaptureProductivityDetails");
        var repo = new Repositories.DashboardRepository();
        // Legacy method takes SqlConnection as first param — create one from config
        using var sqlCon = new System.Data.SqlClient.SqlConnection(Models.clsConnectionString.GetConnectionString());
        repo.CaptureProductivityDetails(sqlCon, empCode, formName, moduleName, totalCount, activity, activityDetails);
    }
}
