namespace OVI.Domain.DTOs;

/// <summary>
/// Typed DTO graph for CM Delinquency data (from SP_OVI_CMDelinquency, 8+ result sets).
/// Replaces the legacy clsCMDelinquencyMain DataTable[] mapping.
/// </summary>
public record CmDelinquencyResultDto
{
    public string? HiddenDatetime { get; init; }
    public string? OverDueAccount { get; init; }
    public string? OverDueAmount { get; init; }
    public List<CmDelinquencyItemDto> Items { get; init; } = [];
    public List<CmActionItemDto> ActionItems { get; init; } = [];
    public List<MonthNameDto> Months { get; init; } = [];
    public List<MonthTotalDto> MonthTotals { get; init; } = [];
    public List<MonthTotalDto> MonthExposures { get; init; } = [];
    public List<DpdExposureDto> DpdExposures { get; init; } = [];
    public List<DpdPeriodDto> DpdPeriods { get; init; } = [];
    public List<ColorCodeDto> ColorCodes { get; init; } = [];
    public List<LocationDto> Locations { get; init; } = [];
    public List<SegmentDto> Segments { get; init; } = [];
}

public record CmDelinquencyItemDto
{
    public string? Segment { get; init; }
    public string? Month { get; init; }
    public string? NOOFAcc { get; init; }
    public string? Utilization { get; init; }
    public string? Total { get; init; }
}

public record CmActionItemDto
{
    public string? LSID { get; init; }
    public string? CustomerName { get; init; }
    public string? Segment { get; init; }
    public string? PMG { get; init; }
    public string? SANEXP { get; init; }
    public string? OSEXP { get; init; }
    public string? Overdue { get; init; }
    public string? DPD { get; init; }
    public string? RM { get; init; }
    public string? TH { get; init; }
}

/// <summary>Shared across CM modules — month name for chart headers.</summary>
public record MonthNameDto
{
    public string? MonthName { get; init; }
}

/// <summary>Shared across CM modules — monthly aggregation row.</summary>
public record MonthTotalDto
{
    public string? MonthName { get; init; }
    public string? NoOFAcc { get; init; }
    public string? TotalAmount { get; init; }
    public string? TotalExpoAmount { get; init; }
    public string? Segment { get; init; }
}

/// <summary>DPD exposure breakdown.</summary>
public record DpdExposureDto
{
    public string? Segment { get; init; }
    public string? OverdueAccount { get; init; }
    public string? OverdueAmount { get; init; }
    public string? OverdueExposure { get; init; }
    public string? DPDPeriod { get; init; }
}

public record DpdPeriodDto
{
    public string? DPDPeriodNM { get; init; }
}

/// <summary>Color code for UI chart segments.</summary>
public record ColorCodeDto
{
    public string? Segment { get; init; }
    public string? Div { get; init; }
    public string? BackgroundColor { get; init; }
    public string? HoverBackgroundColor { get; init; }
    public string? FileName { get; init; }
}

/// <summary>Location dropdown item.</summary>
public record LocationDto
{
    public string? Value { get; init; }
    public string? Text { get; init; }
}

/// <summary>Segment dropdown item.</summary>
public record SegmentDto
{
    public string? Value { get; init; }
    public string? Text { get; init; }
}
