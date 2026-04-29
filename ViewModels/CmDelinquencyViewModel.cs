using Microsoft.AspNetCore.Mvc.Rendering;
using OVI.Domain.DTOs;

namespace Dashboard.ViewModels;

/// <summary>
/// Typed view model for Delinquency Razor view, replacing clsCMDelinquencyMain.
/// Property names match the existing Razor bindings (@Model.clsCMDelinquency, etc.)
/// to allow incremental migration without changing every view reference at once.
/// </summary>
public class CmDelinquencyViewModel
{
    public string? HiddenDatetime { get; set; }
    public string? OverDueAccount { get; set; }
    public string? OverDueAmount { get; set; }

    public List<CmDelinquencyItemDto> clsCMDelinquency { get; set; } = [];
    public List<CmActionItemDto> ActionItem { get; set; } = [];
    public List<MonthNameDto> clsMonth { get; set; } = [];
    public List<MonthTotalDto> clsMonthTotal { get; set; } = [];
    public List<MonthTotalDto> clsMonthExposure { get; set; } = [];
    public List<DpdExposureDto> clsDPDExposure { get; set; } = [];
    public List<DpdPeriodDto> clsDPDPeriod { get; set; } = [];
    public List<ColorCodeDto> clsColorCode { get; set; } = [];

    public List<SelectListItem> lstLocation { get; set; } = [];
    public string[]? SelectedSegment { get; set; }
    public string[]? SelectedLocation { get; set; }
    public List<SelectListItem> lstSegment { get; set; } = [];
    public string? LSId { get; set; }

    /// <summary>
    /// Maps from the clean Domain DTO to the view model shape the Razor view expects.
    /// </summary>
    public static CmDelinquencyViewModel FromDto(CmDelinquencyResultDto dto)
    {
        return new CmDelinquencyViewModel
        {
            HiddenDatetime = dto.HiddenDatetime,
            OverDueAccount = dto.OverDueAccount,
            OverDueAmount = dto.OverDueAmount,
            clsCMDelinquency = dto.Items,
            ActionItem = dto.ActionItems,
            clsMonth = dto.Months,
            clsMonthTotal = dto.MonthTotals,
            clsMonthExposure = dto.MonthExposures,
            clsDPDExposure = dto.DpdExposures,
            clsDPDPeriod = dto.DpdPeriods,
            clsColorCode = dto.ColorCodes,
            lstLocation = dto.Locations.Select(l => new SelectListItem(l.Text, l.Value)).ToList(),
            lstSegment = dto.Segments.Select(s => new SelectListItem(s.Text, s.Value)).ToList(),
        };
    }
}
