using System.Data;
using Dapper;
using Microsoft.Extensions.Logging;
using OVI.Domain.DTOs;
using OVI.Domain.Interfaces;

namespace OVI.Infrastructure.Repositories;

/// <summary>
/// Dapper-based implementation of ICmDataService using QueryMultipleAsync.
/// Replaces the legacy Common.cs multi-result-set DataTable[] mapping with typed DTOs.
/// Result-set order is contractual with the stored procedures.
/// </summary>
public sealed class DapperCmDataRepository(
    IDbConnectionFactory connectionFactory,
    ILogger<DapperCmDataRepository> logger) : ICmDataService
{
    public CmDelinquencyResultDto GetCmDelinquency(string selectedSegment, string selectedLocation, string lsid, string datetime, string empId)
    {
        logger.LogDebug("DapperCmDataRepository.GetCmDelinquency for {EmpId}", empId);

        using var connection = connectionFactory.CreateConnection();
        connection.Open();

        using var grid = connection.QueryMultiple(
            "SP_OVI_CMDelinquency",
            new
            {
                IdentFlag = "CMDelinquency",
                CM_Emp_Code = empId,
                SelectedDate = datetime,
                SelectedSegment = selectedSegment,
                SelectedLocation = selectedLocation,
                LSID = lsid
            },
            commandType: CommandType.StoredProcedure,
            commandTimeout: 60);

        // Result-set order matches legacy Common.clsCMDelinquency11 mapping:
        // 0: CMDelinquency items, 1: ActionItems, 2: Months, 3: OverDue summary,
        // 4: MonthTotals, 5: ColorCodes, 6: DPD Exposures, 7: DPD Periods,
        // 8: Locations, 9: Segments, 10: (unused), 11: MonthExposures
        var items = grid.Read<CmDelinquencyItemDto>().ToList();
        var actionItems = grid.Read<CmActionItemDto>().ToList();
        var months = grid.Read<MonthNameDto>().ToList();
        var overdueSummary = grid.Read<OverdueSummaryRow>().FirstOrDefault();
        var monthTotals = grid.Read<MonthTotalDto>().ToList();
        var colorCodes = grid.Read<ColorCodeDto>().ToList();
        var dpdExposures = grid.Read<DpdExposureDto>().ToList();
        var dpdPeriods = grid.Read<DpdPeriodDto>().ToList();
        var locations = grid.Read<LocationDto>().ToList();
        var segments = grid.Read<SegmentDto>().ToList();

        // Try to read remaining result sets safely
        List<MonthTotalDto> monthExposures = [];
        try
        {
            if (!grid.IsConsumed)
                grid.Read(); // skip unused result set 10
            if (!grid.IsConsumed)
                monthExposures = grid.Read<MonthTotalDto>().ToList();
        }
        catch { /* fewer result sets than expected — legacy proc variation */ }

        return new CmDelinquencyResultDto
        {
            HiddenDatetime = datetime,
            OverDueAccount = overdueSummary?.OverDueAccount,
            OverDueAmount = overdueSummary?.OverDueAmount,
            Items = items,
            ActionItems = actionItems,
            Months = months,
            MonthTotals = monthTotals,
            MonthExposures = monthExposures,
            DpdExposures = dpdExposures,
            DpdPeriods = dpdPeriods,
            ColorCodes = colorCodes,
            Locations = locations,
            Segments = segments,
        };
    }

    public CmLchuResultDto GetCmLchu(string selectedSegment, string selectedLocation, string lsid, string datetime, string empId)
    {
        logger.LogDebug("DapperCmDataRepository.GetCmLchu for {EmpId}", empId);

        using var connection = connectionFactory.CreateConnection();
        connection.Open();

        using var grid = connection.QueryMultiple(
            "SP_OVI_CMLCHU",
            new
            {
                IdentFlag = "CMLCHU",
                CM_Emp_Code = empId,
                SelectedDate = datetime,
                SelectedSegment = selectedSegment,
                SelectedLocation = selectedLocation,
                LSID = lsid
            },
            commandType: CommandType.StoredProcedure,
            commandTimeout: 60);

        var items = grid.Read<CmLchuItemDto>().ToList();
        var actionItems = grid.Read<CmLchuActionItemDto>().ToList();
        var months = grid.Read<MonthNameDto>().ToList();
        var summary = grid.Read<LchuSummaryRow>().FirstOrDefault();
        var monthTotals = grid.Read<MonthTotalDto>().ToList();
        var colorCodes = grid.Read<ColorCodeDto>().ToList();
        var lchuExposures = grid.Read<LchuExposureDto>().ToList();
        var dpdPeriods = grid.Read<DpdPeriodDto>().ToList();
        var locations = grid.Read<LocationDto>().ToList();
        var segments = grid.Read<SegmentDto>().ToList();

        List<MonthTotalDto> monthExposures = [];
        try
        {
            if (!grid.IsConsumed)
                monthExposures = grid.Read<MonthTotalDto>().ToList();
        }
        catch { }

        return new CmLchuResultDto
        {
            HiddenDatetime = datetime,
            LCHUAccount = summary?.LCHUAccount,
            LCHUAmount = summary?.LCHUAmount,
            Items = items,
            ActionItems = actionItems,
            Months = months,
            MonthTotals = monthTotals,
            MonthExposures = monthExposures,
            LchuExposures = lchuExposures,
            DpdPeriods = dpdPeriods,
            ColorCodes = colorCodes,
            Locations = locations,
            Segments = segments,
        };
    }

    public CmAurResultDto GetCmAur(string selectedSegment, string selectedLocation, string lsid, string datetime, string empId)
    {
        logger.LogDebug("DapperCmDataRepository.GetCmAur for {EmpId}", empId);

        using var connection = connectionFactory.CreateConnection();
        connection.Open();

        using var grid = connection.QueryMultiple(
            "SP_OVI_CMAUR",
            new
            {
                IdentFlag = "CMAUR",
                CM_Emp_Code = empId,
                SelectedDate = datetime,
                SelectedSegment = selectedSegment,
                SelectedLocation = selectedLocation,
                LSID = lsid
            },
            commandType: CommandType.StoredProcedure,
            commandTimeout: 60);

        var items = grid.Read<CmAurItemDto>().ToList();
        var actionItems = grid.Read<CmAurActionItemDto>().ToList();
        var months = grid.Read<MonthNameDto>().ToList();
        var summary = grid.Read<AurSummaryRow>().FirstOrDefault();
        var monthTotals = grid.Read<MonthTotalDto>().ToList();
        var colorCodes = grid.Read<ColorCodeDto>().ToList();
        var locations = grid.Read<LocationDto>().ToList();
        var segments = grid.Read<SegmentDto>().ToList();

        List<MonthTotalDto> monthExposures = [];
        try
        {
            if (!grid.IsConsumed)
                monthExposures = grid.Read<MonthTotalDto>().ToList();
        }
        catch { }

        return new CmAurResultDto
        {
            HiddenDatetime = datetime,
            AURAccount = summary?.AURAccount,
            AURAmount = summary?.AURAmount,
            Items = items,
            ActionItems = actionItems,
            Months = months,
            MonthTotals = monthTotals,
            MonthExposures = monthExposures,
            ColorCodes = colorCodes,
            Locations = locations,
            Segments = segments,
        };
    }

    public CmWatchListResultDto GetCmWatchList(string selectedSegment, string selectedLocation, string lsid, string datetime, string empId)
    {
        logger.LogDebug("DapperCmDataRepository.GetCmWatchList for {EmpId}", empId);

        using var connection = connectionFactory.CreateConnection();
        connection.Open();

        using var grid = connection.QueryMultiple(
            "SP_OVI_CMWatchList",
            new
            {
                IdentFlag = "CMWatchList",
                CM_Emp_Code = empId,
                SelectedDate = datetime,
                SelectedSegment = selectedSegment,
                SelectedLocation = selectedLocation,
                LSID = lsid
            },
            commandType: CommandType.StoredProcedure,
            commandTimeout: 60);

        var items = grid.Read<CmWatchListItemDto>().ToList();
        var actionItems = grid.Read<CmWatchListActionItemDto>().ToList();
        var months = grid.Read<MonthNameDto>().ToList();
        var summary = grid.Read<WatchListSummaryRow>().FirstOrDefault();
        var monthTotals = grid.Read<MonthTotalDto>().ToList();
        var colorCodes = grid.Read<ColorCodeDto>().ToList();
        var locations = grid.Read<LocationDto>().ToList();
        var segments = grid.Read<SegmentDto>().ToList();

        List<MonthTotalDto> monthExposures = [];
        try
        {
            if (!grid.IsConsumed)
                monthExposures = grid.Read<MonthTotalDto>().ToList();
        }
        catch { }

        return new CmWatchListResultDto
        {
            HiddenDatetime = datetime,
            WatchListAccount = summary?.WatchListAccount,
            WatchListAmount = summary?.WatchListAmount,
            Items = items,
            ActionItems = actionItems,
            Months = months,
            MonthTotals = monthTotals,
            MonthExposures = monthExposures,
            ColorCodes = colorCodes,
            Locations = locations,
            Segments = segments,
        };
    }

    // --- Internal row types for summary result sets ---

    private record OverdueSummaryRow
    {
        public string? OverDueAccount { get; init; }
        public string? OverDueAmount { get; init; }
    }

    private record LchuSummaryRow
    {
        public string? LCHUAccount { get; init; }
        public string? LCHUAmount { get; init; }
    }

    private record AurSummaryRow
    {
        public string? AURAccount { get; init; }
        public string? AURAmount { get; init; }
    }

    private record WatchListSummaryRow
    {
        public string? WatchListAccount { get; init; }
        public string? WatchListAmount { get; init; }
    }
}
