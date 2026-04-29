namespace OVI.Domain.DTOs;

/// <summary>
/// Typed DTO graph for CM WatchList data (from SP_OVI_CMWatchList, multi-result-set).
/// </summary>
public record CmWatchListResultDto
{
    public string? HiddenDatetime { get; init; }
    public string? WatchListAccount { get; init; }
    public string? WatchListAmount { get; init; }
    public List<CmWatchListItemDto> Items { get; init; } = [];
    public List<CmWatchListActionItemDto> ActionItems { get; init; } = [];
    public List<MonthNameDto> Months { get; init; } = [];
    public List<MonthTotalDto> MonthTotals { get; init; } = [];
    public List<MonthTotalDto> MonthExposures { get; init; } = [];
    public List<ColorCodeDto> ColorCodes { get; init; } = [];
    public List<LocationDto> Locations { get; init; } = [];
    public List<SegmentDto> Segments { get; init; } = [];
}

public record CmWatchListItemDto
{
    public string? Segment { get; init; }
    public string? Month { get; init; }
    public string? NOOFAcc { get; init; }
    public string? Utilization { get; init; }
    public string? Total { get; init; }
}

public record CmWatchListActionItemDto
{
    public string? LSID { get; init; }
    public string? CustomerName { get; init; }
    public string? Segment { get; init; }
    public string? PMG { get; init; }
    public string? SANEXP { get; init; }
    public string? OSEXP { get; init; }
    public string? RM { get; init; }
    public string? TH { get; init; }
}
