using Dashboard.Models;
using Dashboard.ViewModels;
using Microsoft.AspNetCore.Mvc;
using OVI.Domain.Interfaces;

namespace Dashboard.Controllers
{
    public class CMLCHUController : Controller
    {
        private readonly ICmDataService _cmDataService;
        private readonly IDashboardRepository _dashboardRepository;

        public CMLCHUController(ICmDataService cmDataService, IDashboardRepository dashboardRepository)
        {
            _cmDataService = cmDataService;
            _dashboardRepository = dashboardRepository;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost, CustomFilter]
        public IActionResult CMLCHU(CmLchuViewModel viewModel)
        {
            var selectedSegment = viewModel.SelectedSegment != null
                ? string.Join(",", viewModel.SelectedSegment) : "";
            var selectedLocation = viewModel.SelectedLocation != null
                ? string.Join(",", viewModel.SelectedLocation) : "";
            string empId = HttpContext.Session.GetString("EmpId");

            var dto = _cmDataService.GetCmLchu(
                selectedSegment, selectedLocation,
                viewModel.LSId ?? "", viewModel.HiddenDatetime ?? "", empId);

            return View(CmLchuViewModel.FromDto(dto));
        }

        [CustomFilter]
        public IActionResult CMLCHU(string datetime = null)
        {
            string empId = HttpContext.Session.GetString("EmpId");
            if (datetime is null)
                datetime = DateTime.Now.ToString("yyyy-MM-dd");

            _dashboardRepository.CaptureProductivityDetails(
                empId.Trim(), "CMLCHU", "OneViewIndicator-CM", 1,
                "LCHU View", "LCHU View for Emp - " + empId.Trim());

            var dto = _cmDataService.GetCmLchu("", "", "", datetime, empId);
            return View(CmLchuViewModel.FromDto(dto));
        }

        [CustomFilter]
        public JsonResult GetCMLCHUPageData(string dateTime)
        {
            string empId = HttpContext.Session.GetString("EmpId");
            var dto = _cmDataService.GetCmLchu("", "", "", dateTime, empId);
            return new JsonResult(new
            {
                dto.LCHUAccount,
                dto.LCHUAmount,
                clsColorCode = dto.ColorCodes,
                clsMonthTotalLCHUExposure = dto.MonthExposures
            });
        }
    }
}
