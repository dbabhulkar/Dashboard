using Microsoft.AspNetCore.Mvc.Rendering;
using OVI.Domain.DTOs;

namespace Dashboard.ViewModels;

/// <summary>
/// Typed view model for the CMLCHU Razor view, replacing clsCMLCHUMain.
/// Property names match existing Razor bindings exactly to allow incremental migration
/// without changing every @Model reference in the view.
/// </summary>
public class CmLchuViewModel
{
    public string? HiddenDatetime { get; set; }
    public string? LCHUAccount { get; set; }
    public string? LCHUAmount { get; set; }

    public List<CmLchuItemDto> clsCMLCHU { get; set; } = [];
    public List<CmLchuActionItemDto> ActionItemLCHU { get; set; } = [];
    public List<MonthNameDto> clsMonthLCHU { get; set; } = [];
    public List<MonthTotalDto> clsMonthTotalLCHU { get; set; } = [];
    public List<MonthTotalDto> clsMonthTotalLCHUExposure { get; set; } = [];
    public List<LchuExposureDto> clsDPDExposureLCHU { get; set; } = [];
    public List<DpdPeriodDto> clsDPDPeriodLCHU { get; set; } = [];
    public List<ColorCodeDto> clsColorCode { get; set; } = [];

    public List<SelectListItem> lstLocation { get; set; } = [];
    public string[]? SelectedSegment { get; set; }
    public string[]? SelectedLocation { get; set; }
    public List<SelectListItem> lstSegment { get; set; } = [];
    public string? LSId { get; set; }

    /// <summary>
    /// Maps from the clean Domain DTO to the view model shape the Razor view expects.
    /// </summary>
    public static CmLchuViewModel FromDto(CmLchuResultDto dto)
    {
        return new CmLchuViewModel
        {
            HiddenDatetime = dto.HiddenDatetime,
            LCHUAccount = dto.LCHUAccount,
            LCHUAmount = dto.LCHUAmount,
            clsCMLCHU = dto.Items,
            ActionItemLCHU = dto.ActionItems,
            clsMonthLCHU = dto.Months,
            clsMonthTotalLCHU = dto.MonthTotals,
            clsMonthTotalLCHUExposure = dto.MonthExposures,
            clsDPDExposureLCHU = dto.LchuExposures,
            clsDPDPeriodLCHU = dto.DpdPeriods,
            clsColorCode = dto.ColorCodes,
            lstLocation = dto.Locations.Select(l => new SelectListItem(l.Text, l.Value)).ToList(),
            lstSegment = dto.Segments.Select(s => new SelectListItem(s.Text, s.Value)).ToList(),
        };
    }
}
