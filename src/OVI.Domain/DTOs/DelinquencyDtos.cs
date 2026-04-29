namespace OVI.Domain.DTOs;

/// <summary>
/// RM delinquency day-count summary (from SP_OVI_GetDelinquencyDaysCount).
/// </summary>
public record DelinquencyDaysCountDto
{
    public string Days_15 { get; init; } = "-";
    public string Days_30 { get; init; } = "-";
    public string Days_60 { get; init; } = "-";
    public string? Items { get; init; }
    public int No { get; init; }
    public double Percent { get; init; }
    public double Value { get; init; }
    public string? UploadedDate { get; init; }
}

/// <summary>
/// Compliance checklist item (from SP_OVI_GetComplianceList).
/// </summary>
public record ComplianceDto
{
    public string? ComplianceItem { get; init; }
    public int ItemCount { get; init; }
    public string? ItemDate { get; init; }
}
