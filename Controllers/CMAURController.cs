using Dashboard.Models;
using Dashboard.ViewModels;
using Microsoft.AspNetCore.Mvc;
using OVI.Domain.Interfaces;

namespace Dashboard.Controllers
{
    public class CMAURController : Controller
    {
        private readonly ICmDataService _cmDataService;
        private readonly IDashboardRepository _dashboardRepository;

        public CMAURController(ICmDataService cmDataService, IDashboardRepository dashboardRepository)
        {
            _cmDataService = cmDataService;
            _dashboardRepository = dashboardRepository;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost, CustomFilter]
        public IActionResult CMAUR(CmAurViewModel viewModel)
        {
            var selectedSegment = viewModel.SelectedSegment != null
                ? string.Join(",", viewModel.SelectedSegment) : "";
            var selectedLocation = viewModel.SelectedLocation != null
                ? string.Join(",", viewModel.SelectedLocation) : "";
            string empId = HttpContext.Session.GetString("EmpId");

            var dto = _cmDataService.GetCmAur(
                selectedSegment, selectedLocation,
                viewModel.LSId ?? "", viewModel.HiddenDatetime ?? "", empId);

            return View(CmAurViewModel.FromDto(dto));
        }

        [CustomFilter]
        public IActionResult CMAUR(string datetime = null)
        {
            string empId = HttpContext.Session.GetString("EmpId");
            if (datetime is null)
                datetime = DateTime.Now.ToString("yyyy-MM-dd");

            _dashboardRepository.CaptureProductivityDetails(
                empId.Trim(), "CMAUR", "OneViewIndicator-CM", 1,
                "AUR View", "AUR View for Emp - " + empId.Trim());

            var dto = _cmDataService.GetCmAur("", "", "", datetime, empId);
            return View(CmAurViewModel.FromDto(dto));
        }

        [CustomFilter]
        public JsonResult GetCMAURPageData(string dateTime)
        {
            string empId = HttpContext.Session.GetString("EmpId");
            var dto = _cmDataService.GetCmAur("", "", "", dateTime, empId);
            return new JsonResult(new
            {
                dto.AURAccount,
                dto.AURAmount,
                clsColorCode = dto.ColorCodes,
                clsMonthTotalAURExposure = dto.MonthExposures
            });
        }
    }
}
