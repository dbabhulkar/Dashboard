namespace OVI.Domain.DTOs;

/// <summary>
/// Typed DTO graph for CM LCHU data (from SP_OVI_CMLCHU, multi-result-set).
/// </summary>
public record CmLchuResultDto
{
    public string? HiddenDatetime { get; init; }
    public string? LCHUAccount { get; init; }
    public string? LCHUAmount { get; init; }
    public List<CmLchuItemDto> Items { get; init; } = [];
    public List<CmLchuActionItemDto> ActionItems { get; init; } = [];
    public List<MonthNameDto> Months { get; init; } = [];
    public List<MonthTotalDto> MonthTotals { get; init; } = [];
    public List<MonthTotalDto> MonthExposures { get; init; } = [];
    public List<LchuExposureDto> LchuExposures { get; init; } = [];
    public List<DpdPeriodDto> DpdPeriods { get; init; } = [];
    public List<ColorCodeDto> ColorCodes { get; init; } = [];
    public List<LocationDto> Locations { get; init; } = [];
    public List<SegmentDto> Segments { get; init; } = [];
}

public record CmLchuItemDto
{
    public string? Segment { get; init; }
    public string? Month { get; init; }
    public string? NOOFAcc { get; init; }
    public string? Utilization { get; init; }
    public string? Total { get; init; }
}

public record CmLchuActionItemDto
{
    public string? LSID { get; init; }
    public string? CustomerName { get; init; }
    public string? Segment { get; init; }
    public string? PMG { get; init; }
    public string? SANEXP { get; init; }
    public string? OSEXP { get; init; }
    public string? No_of_times_in_LCHU { get; init; }
    public string? RM { get; init; }
    public string? TH { get; init; }
}

public record LchuExposureDto
{
    public string? Segment { get; init; }
    public string? LCHUAccount { get; init; }
    public string? LCHUAmount { get; init; }
    public string? LCHUExposure { get; init; }
    public string? LCHUPeriod { get; init; }
}
