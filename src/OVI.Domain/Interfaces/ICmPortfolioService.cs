using OVI.Domain.DTOs;

namespace OVI.Domain.Interfaces;

/// <summary>
/// Abstraction over CM Dashboard data (SP_OVI_CMViewDashboardData) and
/// Portfolio page data (SP_OVI_PortFolioData).
/// Replaces legacy GetData.cs and inline SqlCommand calls in CMController.
/// </summary>
public interface ICmPortfolioService
{
    CmDashboardDataDto GetDashboardData(string type, string empCode, string date, string? delFilterVal = null);
    CmDashboardLchuDto GetDashboardLchuData(string type, string empCode, string date);
    CmDashboardHousekeepingDto GetHousekeepingData(string empCode, string date);
    CmHubDataDto GetHubData(string type, string empCode, string date, string? delFilterVal = null);
    PortfolioPageDto GetPortfolioPageData(string empCode, string date);
    void LogActivity(string empCode, string formName, string moduleName, string activity, string activityDetails);
}
