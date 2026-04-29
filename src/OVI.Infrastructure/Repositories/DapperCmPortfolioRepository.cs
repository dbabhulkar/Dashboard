using System.Data;
using Dapper;
using Microsoft.Extensions.Logging;
using OVI.Domain.DTOs;
using OVI.Domain.Interfaces;

namespace OVI.Infrastructure.Repositories;

/// <summary>
/// Dapper-based implementation of ICmPortfolioService.
/// Replaces legacy GetData.cs (SP_OVI_CMViewDashboardData) and
/// inline SqlCommand calls in CMController (SP_OVI_PortFolioData, USP_Insert_Data_In_Activity_Log_Tracker).
/// </summary>
public sealed class DapperCmPortfolioRepository(
    IDbConnectionFactory connectionFactory,
    ILogger<DapperCmPortfolioRepository> logger) : ICmPortfolioService
{
    public CmDashboardDataDto GetDashboardData(string type, string empCode, string date, string? delFilterVal = null)
    {
        logger.LogDebug("GetDashboardData type={Type} emp={EmpId}", type, empCode);

        using var connection = connectionFactory.CreateConnection();
        connection.Open();

        var p = new DynamicParameters();
        p.Add("@IdentFlag", type);
        p.Add("@CM_Code", empCode);
        p.Add("@SelectedDate", DateTime.Parse(date));
        if (delFilterVal != null)
            p.Add("@DelqFlag", delFilterVal);

        using var grid = connection.QueryMultiple(
            "SP_OVI_CMViewDashboardData", p,
            commandType: CommandType.StoredProcedure, commandTimeout: 60);

        // Result-set 0: status/header (skip), 1: Portfolio items, 2: Color codes
        try { grid.Read(); } catch { } // skip result set 0
        var portfolioItems = grid.Read<PortfolioItemDto>().ToList();
        var colorCodes = grid.Read<ColorCodeDto>().ToList();

        return new CmDashboardDataDto
        {
            clsPortfolio = portfolioItems,
            clsCode = colorCodes,
        };
    }

    public CmDashboardLchuDto GetDashboardLchuData(string type, string empCode, string date)
    {
        logger.LogDebug("GetDashboardLchuData type={Type} emp={EmpId}", type, empCode);

        using var connection = connectionFactory.CreateConnection();
        connection.Open();

        using var grid = connection.QueryMultiple(
            "SP_OVI_CMViewDashboardData",
            new { IdentFlag = type, CM_Code = empCode, SelectedDate = DateTime.Parse(date) },
            commandType: CommandType.StoredProcedure, commandTimeout: 60);

        // Result-set 0: months, 1: portfolio items, 2: color codes, 3: totals
        var months = grid.Read<MonthListDto>().ToList();
        var items = grid.Read<PortfolioItemDto>().ToList();
        var codes = grid.Read<ColorCodeDto>().ToList();

        List<PortfolioItemDto> totals = [];
        try { if (!grid.IsConsumed) totals = grid.Read<PortfolioItemDto>().ToList(); } catch { }

        return new CmDashboardLchuDto
        {
            clsMonthList = months,
            clsPortfolio = items,
            clsCode = codes,
            clsPortfolioTotal = totals,
        };
    }

    public CmDashboardHousekeepingDto GetHousekeepingData(string empCode, string date)
    {
        logger.LogDebug("GetHousekeepingData emp={EmpId}", empCode);

        using var connection = connectionFactory.CreateConnection();
        connection.Open();

        using var grid = connection.QueryMultiple(
            "SP_OVI_CMViewDashboardData",
            new { IdentFlag = "HousekeepingData", CM_Code = empCode, SelectedDate = DateTime.Parse(date) },
            commandType: CommandType.StoredProcedure, commandTimeout: 60);

        // Result-set 0: skip, 1: housekeeping items, 2: color codes
        try { grid.Read(); } catch { }
        var items = grid.Read<HousekeepingItemDto>().ToList();
        var codes = grid.Read<ColorCodeDto>().ToList();

        return new CmDashboardHousekeepingDto
        {
            clsHouskeeping = items,
            clsCode = codes,
        };
    }

    public CmHubDataDto GetHubData(string type, string empCode, string date, string? delFilterVal = null)
    {
        logger.LogDebug("GetHubData type={Type} emp={EmpId}", type, empCode);

        using var connection = connectionFactory.CreateConnection();
        connection.Open();

        var p = new DynamicParameters();
        p.Add("@IdentFlag", type);
        p.Add("@CM_Code", empCode);
        p.Add("@SelectedDate", DateTime.Parse(date));
        if (delFilterVal != null)
            p.Add("@DelqFlag", delFilterVal);

        using var grid = connection.QueryMultiple(
            "SP_OVI_CMViewDashboardData", p,
            commandType: CommandType.StoredProcedure, commandTimeout: 60);

        // Result-set 0: skip, 1: hub items
        try { grid.Read(); } catch { }
        var items = grid.Read<PortfolioItemDto>().ToList();

        return new CmHubDataDto { Items = items };
    }

    public PortfolioPageDto GetPortfolioPageData(string empCode, string date)
    {
        logger.LogDebug("GetPortfolioPageData emp={EmpId}", empCode);

        using var connection = connectionFactory.CreateConnection();
        connection.Open();

        using var grid = connection.QueryMultiple(
            "SP_OVI_PortFolioData",
            new { IdentFlag = "PortfolioPageData", CM_Code = empCode, SelectedDate = DateTime.Parse(date) },
            commandType: CommandType.StoredProcedure, commandTimeout: 60);

        // Result-set order: 0: status, 1: portfolio, 2: summary, 3: trend,
        // 4: ABC categories, 5: risk categories, 6: industry, 7: color codes, 8: industry colors
        try { grid.Read(); } catch { } // skip 0
        var portfolio = grid.Read<PortfolioItemDto>().ToList();
        var summary = grid.Read<PortfolioSummaryRowDto>().ToList();
        var trend = grid.Read<TrendDto>().ToList();
        var abc = grid.Read<AbcCategoryDto>().ToList();
        var risk = grid.Read<RiskCategoryDto>().ToList();
        var industry = grid.Read<IndustryWiseDto>().ToList();
        var codes = grid.Read<ColorCodeDto>().ToList();

        List<ColorCodeDto> industryCodes = [];
        try { if (!grid.IsConsumed) industryCodes = grid.Read<ColorCodeDto>().ToList(); } catch { }

        return new PortfolioPageDto
        {
            clsPortfolio = portfolio,
            PortfolioSummary = summary,
            Trend = trend,
            ABCCategores = abc,
            RiskCategories = risk,
            IndustryWise = industry,
            clsCode = codes,
            clsCodeIndustryColor = industryCodes,
        };
    }

    public void LogActivity(string empCode, string formName, string moduleName, string activity, string activityDetails)
    {
        logger.LogDebug("LogActivity emp={EmpId} form={Form}", empCode, formName);

        using var connection = connectionFactory.CreateConnection();
        connection.Open();

        connection.Execute(
            "USP_Insert_Data_In_Activity_Log_Tracker",
            new
            {
                Form_Name = formName,
                Emp_Code = empCode,
                Module_Name = moduleName,
                Total_Count = "-",
                Activity = activity,
                Activity_Details = activityDetails,
            },
            commandType: CommandType.StoredProcedure);
    }
}
