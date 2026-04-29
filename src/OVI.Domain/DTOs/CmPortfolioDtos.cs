namespace OVI.Domain.DTOs;

/// <summary>
/// DTOs for CM Dashboard data (SP_OVI_CMViewDashboardData) and Portfolio page (SP_OVI_PortFolioData).
/// Property names match the legacy JSON shape consumed by jQuery clients.
/// </summary>

public class CmDashboardDataDto
{
    public List<PortfolioItemDto> clsPortfolio { get; set; } = [];
    public List<ColorCodeDto> clsCode { get; set; } = [];
}

public class CmDashboardLchuDto
{
    public List<MonthListDto> clsMonthList { get; set; } = [];
    public List<PortfolioItemDto> clsPortfolio { get; set; } = [];
    public List<ColorCodeDto> clsCode { get; set; } = [];
    public List<PortfolioItemDto> clsPortfolioTotal { get; set; } = [];
}

public class CmDashboardHousekeepingDto
{
    public List<HousekeepingItemDto> clsHouskeeping { get; set; } = [];
    public List<ColorCodeDto> clsCode { get; set; } = [];
}

public class CmHubDataDto
{
    public List<PortfolioItemDto> Items { get; set; } = [];
}

public class PortfolioItemDto
{
    public string? Segment { get; set; }
    public string? NO { get; set; }
    public string? ApprLmt { get; set; }
    public string? Disbursed { get; set; }
    public string? MonthName { get; set; }
    public string? AgriType { get; set; }
    public string? CityName { get; set; }
}

public class MonthListDto
{
    public string? monthName { get; set; }
}

public class HousekeepingItemDto
{
    public string? Segment { get; set; }
    public string? sCount { get; set; }
    public string? FileName1 { get; set; }
    public string? BackgroundColor { get; set; }
    public string? HoverBackgroundColor { get; set; }
}

public class PortfolioPageDto
{
    public List<PortfolioItemDto> clsPortfolio { get; set; } = [];
    public List<TrendDto> Trend { get; set; } = [];
    public List<AbcCategoryDto> ABCCategores { get; set; } = [];
    public List<RiskCategoryDto> RiskCategories { get; set; } = [];
    public List<IndustryWiseDto> IndustryWise { get; set; } = [];
    public List<ColorCodeDto> clsCode { get; set; } = [];
    public List<ColorCodeDto> clsCodeIndustryColor { get; set; } = [];
    public List<PortfolioSummaryRowDto> PortfolioSummary { get; set; } = [];
}

public class TrendDto
{
    public string? MonthName { get; set; }
    public string? Exposure { get; set; }
    public string? sCount { get; set; }
}

public class AbcCategoryDto
{
    public string? Categories { get; set; }
    public string? No { get; set; }
    public string? Exposure { get; set; }
    public string? Utilization { get; set; }
}

public class RiskCategoryDto
{
    public string? RiskType { get; set; }
    public string? No { get; set; }
    public string? Exposure { get; set; }
    public string? Utilization { get; set; }
}

public class IndustryWiseDto
{
    public string? Industy { get; set; }
    public string? Count { get; set; }
    public string? Value { get; set; }
}

public class PortfolioSummaryRowDto
{
    public string? LSID { get; set; }
    public string? Name { get; set; }
    public string? Segment { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? Exposure { get; set; }
    public string? RM { get; set; }
    public string? CAM { get; set; }
}
