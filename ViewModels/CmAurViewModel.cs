using Microsoft.AspNetCore.Mvc.Rendering;
using OVI.Domain.DTOs;

namespace Dashboard.ViewModels;

/// <summary>
/// Typed view model for the CMAUR Razor view, replacing clsCMAURMain.
/// Property names match existing Razor bindings exactly to allow incremental migration
/// without changing every @Model reference in the view.
/// </summary>
public class CmAurViewModel
{
    public string? HiddenDatetime { get; set; }
    public string? AURAccount { get; set; }
    public string? AURAmount { get; set; }

    public List<CmAurItemDto> clsCMAUR { get; set; } = [];
    public List<CmAurActionItemDto> ActionItemAUR { get; set; } = [];
    public List<MonthNameDto> clsMonthAUR { get; set; } = [];
    public List<MonthTotalDto> clsMonthTotalAUR { get; set; } = [];
    public List<ColorCodeDto> clsColorCode { get; set; } = [];

    public List<SelectListItem> lstLocation { get; set; } = [];
    public string[]? SelectedSegment { get; set; }
    public string[]? SelectedLocation { get; set; }
    public List<SelectListItem> lstSegment { get; set; } = [];
    public string? LSId { get; set; }

    /// <summary>
    /// Maps from the clean Domain DTO to the view model shape the Razor view expects.
    /// </summary>
    public static CmAurViewModel FromDto(CmAurResultDto dto)
    {
        return new CmAurViewModel
        {
            HiddenDatetime = dto.HiddenDatetime,
            AURAccount = dto.AURAccount,
            AURAmount = dto.AURAmount,
            clsCMAUR = dto.Items,
            ActionItemAUR = dto.ActionItems,
            clsMonthAUR = dto.Months,
            clsMonthTotalAUR = dto.MonthTotals,
            clsColorCode = dto.ColorCodes,
            lstLocation = dto.Locations.Select(l => new SelectListItem(l.Text, l.Value)).ToList(),
            lstSegment = dto.Segments.Select(s => new SelectListItem(s.Text, s.Value)).ToList(),
        };
    }
}
