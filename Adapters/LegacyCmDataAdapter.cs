using Microsoft.Extensions.Logging;
using OVI.Domain.DTOs;
using OVI.Domain.Interfaces;

namespace Dashboard.Adapters;

/// <summary>
/// ACL adapter: wraps legacy Common.cs CM methods, maps legacy model types to typed DTOs.
/// This is the "ugly" translation layer — it absorbs mess from the legacy code.
/// Phase 2+: replaced by DapperCmDataRepository in OVI.Infrastructure.
/// </summary>
internal sealed class LegacyCmDataAdapter(ILogger<LegacyCmDataAdapter> logger) : ICmDataService
{
    public CmDelinquencyResultDto GetCmDelinquency(string selectedSegment, string selectedLocation, string lsid, string datetime, string empId)
    {
        logger.LogDebug("Delegating to legacy Common.clsCMDelinquency11");
        var common = new Models.Common();
        var legacy = common.clsCMDelinquency11(selectedSegment, selectedLocation, lsid, datetime, empId);
        return MapDelinquency(legacy);
    }

    public CmLchuResultDto GetCmLchu(string selectedSegment, string selectedLocation, string lsid, string datetime, string empId)
    {
        logger.LogDebug("Delegating to legacy Common.clsCMLCHUMain1");
        var common = new Models.Common();
        var legacy = common.clsCMLCHUMain1(selectedSegment, selectedLocation, lsid, datetime, empId);
        return MapLchu(legacy);
    }

    public CmAurResultDto GetCmAur(string selectedSegment, string selectedLocation, string lsid, string datetime, string empId)
    {
        logger.LogDebug("Delegating to legacy Common.clsCMAURMain1");
        var common = new Models.Common();
        var legacy = common.clsCMAURMain1(selectedSegment, selectedLocation, lsid, datetime, empId);
        return MapAur(legacy);
    }

    public CmWatchListResultDto GetCmWatchList(string selectedSegment, string selectedLocation, string lsid, string datetime, string empId)
    {
        logger.LogDebug("Delegating to legacy Common.clsCMWatchListMain1");
        var common = new Models.Common();
        var legacy = common.clsCMWatchListMain1(selectedSegment, selectedLocation, lsid, datetime, empId);
        return MapWatchList(legacy);
    }

    // --- Mapping methods (ACL translation layer) ---

    private static CmDelinquencyResultDto MapDelinquency(Models.clsCMDelinquencyMain m) => new()
    {
        HiddenDatetime = m.HiddenDatetime,
        OverDueAccount = m.OverDueAccount,
        OverDueAmount = m.OverDueAmount,
        Items = m.clsCMDelinquency?.Select(x => new CmDelinquencyItemDto
        {
            Segment = x.Segment, Month = x.Month, NOOFAcc = x.NOOFAcc, Utilization = x.Utilization, Total = x.Total
        }).ToList() ?? [],
        ActionItems = m.ActionItem?.Select(x => new CmActionItemDto
        {
            LSID = x.LSID, CustomerName = x.CustomerName, Segment = x.Segment, PMG = x.PMG,
            SANEXP = x.SANEXP, OSEXP = x.OSEXP, Overdue = x.Overdue, DPD = x.DPD, RM = x.RM, TH = x.TH
        }).ToList() ?? [],
        Months = m.clsMonth?.Select(x => new MonthNameDto { MonthName = x.MonthName }).ToList() ?? [],
        MonthTotals = m.clsMonthTotal?.Select(MapMonthTotal).ToList() ?? [],
        MonthExposures = m.clsMonthExposure?.Select(MapMonthTotal).ToList() ?? [],
        DpdExposures = m.clsDPDExposure?.Select(x => new DpdExposureDto
        {
            Segment = x.Segment, OverdueAccount = x.OverdueAccount, OverdueAmount = x.OverdueAmount,
            OverdueExposure = x.OverdueExposure, DPDPeriod = x.DPDPeriod
        }).ToList() ?? [],
        DpdPeriods = m.clsDPDPeriod?.Select(x => new DpdPeriodDto { DPDPeriodNM = x.DPDPeriodNM }).ToList() ?? [],
        ColorCodes = m.clsColorCode?.Select(MapColorCode).ToList() ?? [],
        Locations = m.lstLocation?.Select(x => new LocationDto { Value = x.Value, Text = x.Text }).ToList() ?? [],
        Segments = m.lstSegment?.Select(x => new SegmentDto { Value = x.Value, Text = x.Text }).ToList() ?? [],
    };

    private static CmLchuResultDto MapLchu(Models.clsCMLCHUMain m) => new()
    {
        HiddenDatetime = m.HiddenDatetime,
        LCHUAccount = m.LCHUAccount,
        LCHUAmount = m.LCHUAmount,
        Items = m.clsCMLCHU?.Select(x => new CmLchuItemDto
        {
            Segment = x.Segment, Month = x.Month, NOOFAcc = x.NOOFAcc, Utilization = x.Utilization, Total = x.Total
        }).ToList() ?? [],
        ActionItems = m.ActionItemLCHU?.Select(x => new CmLchuActionItemDto
        {
            LSID = x.LSID, CustomerName = x.CustomerName, Segment = x.Segment, PMG = x.PMG,
            SANEXP = x.SANEXP, OSEXP = x.OSEXP, No_of_times_in_LCHU = x.No_of_times_in_LCHU, RM = x.RM, TH = x.TH
        }).ToList() ?? [],
        Months = m.clsMonthLCHU?.Select(x => new MonthNameDto { MonthName = x.MonthName }).ToList() ?? [],
        MonthTotals = m.clsMonthTotalLCHU?.Select(x => new MonthTotalDto
        {
            MonthName = x.MonthName, NoOFAcc = x.NoOFAcc, TotalAmount = x.TotalAmount, TotalExpoAmount = x.TotalExpoAmount, Segment = x.Segment
        }).ToList() ?? [],
        MonthExposures = m.clsMonthTotalLCHUExposure?.Select(x => new MonthTotalDto
        {
            MonthName = x.MonthName, NoOFAcc = x.NoOFAcc, TotalAmount = x.TotalAmount, TotalExpoAmount = x.TotalExpoAmount, Segment = x.Segment
        }).ToList() ?? [],
        LchuExposures = m.clsDPDExposureLCHU?.Select(x => new LchuExposureDto
        {
            Segment = x.Segment, LCHUAccount = x.LCHUAccount, LCHUAmount = x.LCHUAmount, LCHUExposure = x.LCHUExposure, LCHUPeriod = x.LCHUPeriod
        }).ToList() ?? [],
        DpdPeriods = m.clsDPDPeriodLCHU?.Select(x => new DpdPeriodDto { DPDPeriodNM = x.DPDPeriodNM }).ToList() ?? [],
        ColorCodes = m.clsColorCode?.Select(MapColorCode).ToList() ?? [],
        Locations = m.lstLocation?.Select(x => new LocationDto { Value = x.Value, Text = x.Text }).ToList() ?? [],
        Segments = m.lstSegment?.Select(x => new SegmentDto { Value = x.Value, Text = x.Text }).ToList() ?? [],
    };

    private static CmAurResultDto MapAur(Models.clsCMAURMain m) => new()
    {
        HiddenDatetime = m.HiddenDatetime,
        AURAccount = m.AURAccount,
        AURAmount = m.AURAmount,
        Items = m.clsCMAUR?.Select(x => new CmAurItemDto
        {
            Segment = x.Segment, Month = x.Month, NOOFAcc = x.NOOFAcc, Utilization = x.Utilization, Total = x.Total
        }).ToList() ?? [],
        ActionItems = m.ActionItemAUR?.Select(x => new CmAurActionItemDto
        {
            LSID = x.LSID, CustomerName = x.CustomerName, Segment = x.Segment, PMG = x.PMG,
            SANEXP = x.SANEXP, OSEXP = x.OSEXP, ReasonforExit = x.ReasonforExit, TypeofPlan = x.TypeofPlan,
            PlanStatus = x.PlanStatus, RM = x.RM, TH = x.TH
        }).ToList() ?? [],
        Months = m.clsMonthAUR?.Select(x => new MonthNameDto { MonthName = x.MonthName }).ToList() ?? [],
        MonthTotals = m.clsMonthTotalAUR?.Select(x => new MonthTotalDto
        {
            MonthName = x.MonthName, NoOFAcc = x.NoOFAcc, TotalAmount = x.TotalAmount, TotalExpoAmount = x.TotalExpoAmount, Segment = x.Segment
        }).ToList() ?? [],
        MonthExposures = m.clsMonthTotalAURExposure?.Select(x => new MonthTotalDto
        {
            MonthName = x.MonthName, NoOFAcc = x.NoOFAcc, TotalAmount = x.TotalAmount, TotalExpoAmount = x.TotalExpoAmount, Segment = x.Segment
        }).ToList() ?? [],
        ColorCodes = m.clsColorCode?.Select(MapColorCode).ToList() ?? [],
        Locations = m.lstLocation?.Select(x => new LocationDto { Value = x.Value, Text = x.Text }).ToList() ?? [],
        Segments = m.lstSegment?.Select(x => new SegmentDto { Value = x.Value, Text = x.Text }).ToList() ?? [],
    };

    private static CmWatchListResultDto MapWatchList(Models.clsCMWatchListMain m) => new()
    {
        HiddenDatetime = m.HiddenDatetime,
        WatchListAccount = m.WatchListAccount,
        WatchListAmount = m.WatchListAmount,
        Items = m.clsCMWatchList?.Select(x => new CmWatchListItemDto
        {
            Segment = x.Segment, Month = x.Month, NOOFAcc = x.NOOFAcc, Utilization = x.Utilization, Total = x.Total
        }).ToList() ?? [],
        ActionItems = m.ActionItemWatchList?.Select(x => new CmWatchListActionItemDto
        {
            LSID = x.LSID, CustomerName = x.CustomerName, Segment = x.Segment, PMG = x.PMG,
            SANEXP = x.SANEXP, OSEXP = x.OSEXP, RM = x.RM, TH = x.TH
        }).ToList() ?? [],
        Months = m.clsMonthWatchList?.Select(x => new MonthNameDto { MonthName = x.MonthName }).ToList() ?? [],
        MonthTotals = m.clsMonthTotalWatchList?.Select(x => new MonthTotalDto
        {
            MonthName = x.MonthName, NoOFAcc = x.NoOFAcc, TotalAmount = x.TotalAmount, TotalExpoAmount = x.TotalExpoAmount, Segment = x.Segment
        }).ToList() ?? [],
        MonthExposures = m.clsMonthTotalWatchListExposure?.Select(x => new MonthTotalDto
        {
            MonthName = x.MonthName, NoOFAcc = x.NoOFAcc, TotalAmount = x.TotalAmount, TotalExpoAmount = x.TotalExpoAmount, Segment = x.Segment
        }).ToList() ?? [],
        ColorCodes = m.clsColorCode?.Select(MapColorCode).ToList() ?? [],
        Locations = m.lstLocation?.Select(x => new LocationDto { Value = x.Value, Text = x.Text }).ToList() ?? [],
        Segments = m.lstSegment?.Select(x => new SegmentDto { Value = x.Value, Text = x.Text }).ToList() ?? [],
    };

    // Shared mappers
    private static MonthTotalDto MapMonthTotal(Models.clsMonthTotal x) => new()
    {
        MonthName = x.MonthName, NoOFAcc = x.NoOFAcc, TotalAmount = x.TotalAmount, TotalExpoAmount = x.TotalExpoAmount, Segment = x.Segment
    };

    private static ColorCodeDto MapColorCode(Models.clsCode x) => new()
    {
        Segment = x.Segment, Div = x.Div, BackgroundColor = x.BackgroundColor,
        HoverBackgroundColor = x.HoverBackgroundColor, FileName = x.FileName
    };
}
