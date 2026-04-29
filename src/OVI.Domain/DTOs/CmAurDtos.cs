namespace OVI.Domain.DTOs;

/// <summary>
/// Typed DTO graph for CM AUR data (from SP_OVI_CMAUR, multi-result-set).
/// </summary>
public record CmAurResultDto
{
    public string? HiddenDatetime { get; init; }
    public string? AURAccount { get; init; }
    public string? AURAmount { get; init; }
    public List<CmAurItemDto> Items { get; init; } = [];
    public List<CmAurActionItemDto> ActionItems { get; init; } = [];
    public List<MonthNameDto> Months { get; init; } = [];
    public List<MonthTotalDto> MonthTotals { get; init; } = [];
    public List<MonthTotalDto> MonthExposures { get; init; } = [];
    public List<ColorCodeDto> ColorCodes { get; init; } = [];
    public List<LocationDto> Locations { get; init; } = [];
    public List<SegmentDto> Segments { get; init; } = [];
}

public record CmAurItemDto
{
    public string? Segment { get; init; }
    public string? Month { get; init; }
    public string? NOOFAcc { get; init; }
    public string? Utilization { get; init; }
    public string? Total { get; init; }
}

public record CmAurActionItemDto
{
    public string? LSID { get; init; }
    public string? CustomerName { get; init; }
    public string? Segment { get; init; }
    public string? PMG { get; init; }
    public string? SANEXP { get; init; }
    public string? OSEXP { get; init; }
    public string? ReasonforExit { get; init; }
    public string? TypeofPlan { get; init; }
    public string? PlanStatus { get; init; }
    public string? RM { get; init; }
    public string? TH { get; init; }
}
