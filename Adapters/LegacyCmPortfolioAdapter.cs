using Microsoft.Extensions.Logging;
using OVI.Domain.DTOs;
using OVI.Domain.Interfaces;
using Dashboard.Models;

namespace Dashboard.Adapters;

/// <summary>
/// ACL adapter: wraps legacy GetData.cs and CMController inline SQL.
/// Maps legacy model types to typed DTOs.
/// Phase 4: replaced by DapperCmPortfolioRepository.
/// </summary>
internal sealed class LegacyCmPortfolioAdapter(ILogger<LegacyCmPortfolioAdapter> logger) : ICmPortfolioService
{
    public CmDashboardDataDto GetDashboardData(string type, string empCode, string date, string? delFilterVal = null)
    {
        logger.LogDebug("Legacy GetDashboardData type={Type}", type);
        var getData = new GetData();
        var v = new clsDashboardVariable { Type = type, EmployeeCode = empCode, Date = date, FilterId = delFilterVal ?? "" };
        var result = getData.GetPortfolioMain(v);
        return new CmDashboardDataDto
        {
            clsPortfolio = result.clsPortfolio?.Select(MapPortfolioItem).ToList() ?? [],
            clsCode = result.clsCode?.Select(MapColorCode).ToList() ?? [],
        };
    }

    public CmDashboardLchuDto GetDashboardLchuData(string type, string empCode, string date)
    {
        logger.LogDebug("Legacy GetDashboardLchuData type={Type}", type);
        // Legacy code uses inline SQL in CMController for LCHU/AUR/Delinquency dashboard data.
        // The GetData path only returns portfolio + color codes. For the full LCHU shape,
        // CMController had separate inline SQL. This adapter delegates to GetData for the subset.
        var getData = new GetData();
        var v = new clsDashboardVariable { Type = type, EmployeeCode = empCode, Date = date };
        var result = getData.GetPortfolioMain(v);
        return new CmDashboardLchuDto
        {
            clsPortfolio = result.clsPortfolio?.Select(MapPortfolioItem).ToList() ?? [],
            clsCode = result.clsCode?.Select(MapColorCode).ToList() ?? [],
        };
    }

    public CmDashboardHousekeepingDto GetHousekeepingData(string empCode, string date)
    {
        logger.LogDebug("Legacy GetHousekeepingData — not fully supported via GetData path");
        return new CmDashboardHousekeepingDto();
    }

    public CmHubDataDto GetHubData(string type, string empCode, string date, string? delFilterVal = null)
    {
        logger.LogDebug("Legacy GetHubData — not fully supported via GetData path");
        return new CmHubDataDto();
    }

    public PortfolioPageDto GetPortfolioPageData(string empCode, string date)
    {
        logger.LogDebug("Legacy GetPortfolioPageData — not fully supported via GetData path");
        return new PortfolioPageDto();
    }

    public void LogActivity(string empCode, string formName, string moduleName, string activity, string activityDetails)
    {
        logger.LogDebug("Legacy LogActivity — delegating to inline SQL");
        using var sqlCon = new System.Data.SqlClient.SqlConnection(clsConnectionString.GetConnectionString());
        using var cmd = new System.Data.SqlClient.SqlCommand("USP_Insert_Data_In_Activity_Log_Tracker", sqlCon);
        cmd.CommandType = System.Data.CommandType.StoredProcedure;
        cmd.Parameters.AddWithValue("@Form_Name", formName);
        cmd.Parameters.AddWithValue("@Emp_Code", empCode);
        cmd.Parameters.AddWithValue("@Module_Name", moduleName);
        cmd.Parameters.AddWithValue("@Total_Count", "-");
        cmd.Parameters.AddWithValue("@Activity", activity);
        cmd.Parameters.AddWithValue("@Activity_Details", activityDetails);
        sqlCon.Open();
        cmd.ExecuteNonQuery();
    }

    private static PortfolioItemDto MapPortfolioItem(clsPortfolio x) => new()
    {
        Segment = x.Segment, NO = x.NO, ApprLmt = x.ApprLmt,
        Disbursed = x.Disbursed, MonthName = x.MonthName,
        AgriType = x.AgriType, CityName = x.CityName,
    };

    private static ColorCodeDto MapColorCode(clsCode x) => new()
    {
        Segment = x.Segment, Div = x.Div, BackgroundColor = x.BackgroundColor,
        HoverBackgroundColor = x.HoverBackgroundColor, FileName = x.FileName,
    };
}
