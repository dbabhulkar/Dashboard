using Microsoft.FeatureManagement;
using OVI.Domain.DTOs;
using OVI.Domain.Interfaces;
using OVI.Infrastructure.Repositories;

namespace Dashboard.Adapters;

/// <summary>
/// Feature-flag gate for CM Portfolio/Dashboard data.
/// Routes to Dapper or legacy adapter based on Module.CM.UseNewDataAccess.
/// </summary>
internal sealed class FeatureFlaggedCmPortfolioService(
    LegacyCmPortfolioAdapter legacy,
    DapperCmPortfolioRepository dapper,
    IFeatureManager featureManager) : ICmPortfolioService
{
    private bool UseNew => featureManager.IsEnabledAsync("Module.CM.UseNewDataAccess").GetAwaiter().GetResult();

    public CmDashboardDataDto GetDashboardData(string type, string empCode, string date, string? delFilterVal = null)
        => UseNew ? dapper.GetDashboardData(type, empCode, date, delFilterVal) : legacy.GetDashboardData(type, empCode, date, delFilterVal);

    public CmDashboardLchuDto GetDashboardLchuData(string type, string empCode, string date)
        => UseNew ? dapper.GetDashboardLchuData(type, empCode, date) : legacy.GetDashboardLchuData(type, empCode, date);

    public CmDashboardHousekeepingDto GetHousekeepingData(string empCode, string date)
        => UseNew ? dapper.GetHousekeepingData(empCode, date) : legacy.GetHousekeepingData(empCode, date);

    public CmHubDataDto GetHubData(string type, string empCode, string date, string? delFilterVal = null)
        => UseNew ? dapper.GetHubData(type, empCode, date, delFilterVal) : legacy.GetHubData(type, empCode, date, delFilterVal);

    public PortfolioPageDto GetPortfolioPageData(string empCode, string date)
        => UseNew ? dapper.GetPortfolioPageData(empCode, date) : legacy.GetPortfolioPageData(empCode, date);

    public void LogActivity(string empCode, string formName, string moduleName, string activity, string activityDetails)
        => (UseNew ? (ICmPortfolioService)dapper : legacy).LogActivity(empCode, formName, moduleName, activity, activityDetails);
}
