using Microsoft.AspNetCore.Mvc.Rendering;
using OVI.Domain.DTOs;

namespace Dashboard.ViewModels;

/// <summary>
/// Typed view model for the CMWatchList Razor view, replacing clsCMWatchListMain.
/// Property names match existing Razor bindings exactly to allow incremental migration
/// without changing every @Model reference in the view.
/// </summary>
public class CmWatchListViewModel
{
    public string? HiddenDatetime { get; set; }
    public string? WatchListAccount { get; set; }
    public string? WatchListAmount { get; set; }

    public List<CmWatchListItemDto> clsCMWatchList { get; set; } = [];
    public List<CmWatchListActionItemDto> ActionItemWatchList { get; set; } = [];
    public List<MonthNameDto> clsMonthWatchList { get; set; } = [];
    public List<MonthTotalDto> clsMonthTotalWatchList { get; set; } = [];
    public List<ColorCodeDto> clsColorCode { get; set; } = [];

    public List<SelectListItem> lstLocation { get; set; } = [];
    public string[]? SelectedSegment { get; set; }
    public string[]? SelectedLocation { get; set; }
    public List<SelectListItem> lstSegment { get; set; } = [];
    public string? LSId { get; set; }

    /// <summary>
    /// Maps from the clean Domain DTO to the view model shape the Razor view expects.
    /// </summary>
    public static CmWatchListViewModel FromDto(CmWatchListResultDto dto)
    {
        return new CmWatchListViewModel
        {
            HiddenDatetime = dto.HiddenDatetime,
            WatchListAccount = dto.WatchListAccount,
            WatchListAmount = dto.WatchListAmount,
            clsCMWatchList = dto.Items,
            ActionItemWatchList = dto.ActionItems,
            clsMonthWatchList = dto.Months,
            clsMonthTotalWatchList = dto.MonthTotals,
            clsColorCode = dto.ColorCodes,
            lstLocation = dto.Locations.Select(l => new SelectListItem(l.Text, l.Value)).ToList(),
            lstSegment = dto.Segments.Select(s => new SelectListItem(s.Text, s.Value)).ToList(),
        };
    }
}
