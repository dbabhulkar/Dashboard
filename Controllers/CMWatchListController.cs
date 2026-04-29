using Dashboard.Models;
using Dashboard.ViewModels;
using Microsoft.AspNetCore.Mvc;
using OVI.Domain.Interfaces;

namespace Dashboard.Controllers
{
    public class CMWatchListController : Controller
    {
        private readonly ICmDataService _cmDataService;
        private readonly IDashboardRepository _dashboardRepository;

        public CMWatchListController(ICmDataService cmDataService, IDashboardRepository dashboardRepository)
        {
            _cmDataService = cmDataService;
            _dashboardRepository = dashboardRepository;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost, CustomFilter]
        public IActionResult CMWatchList(CmWatchListViewModel viewModel)
        {
            var selectedSegment = viewModel.SelectedSegment != null
                ? string.Join(",", viewModel.SelectedSegment) : "";
            var selectedLocation = viewModel.SelectedLocation != null
                ? string.Join(",", viewModel.SelectedLocation) : "";
            string empId = HttpContext.Session.GetString("EmpId");

            var dto = _cmDataService.GetCmWatchList(
                selectedSegment, selectedLocation,
                viewModel.LSId ?? "", viewModel.HiddenDatetime ?? "", empId);

            return View(CmWatchListViewModel.FromDto(dto));
        }

        [CustomFilter]
        public IActionResult CMWatchList(string datetime = null)
        {
            string empId = HttpContext.Session.GetString("EmpId");
            if (datetime is null)
                datetime = DateTime.Now.ToString("yyyy-MM-dd");

            _dashboardRepository.CaptureProductivityDetails(
                empId.Trim(), "CMWatchList", "OneViewIndicator-CM", 1,
                "WatchList View", "WatchList View for Emp - " + empId.Trim());

            var dto = _cmDataService.GetCmWatchList("", "", "", datetime, empId);
            return View(CmWatchListViewModel.FromDto(dto));
        }

        [CustomFilter]
        public JsonResult GetCMWatchListPageData(string dateTime)
        {
            string empId = HttpContext.Session.GetString("EmpId");
            var dto = _cmDataService.GetCmWatchList("", "", "", dateTime, empId);
            return new JsonResult(new
            {
                dto.WatchListAccount,
                dto.WatchListAmount,
                clsColorCode = dto.ColorCodes,
                clsMonthTotalWatchListExposure = dto.MonthExposures
            });
        }
    }
}
