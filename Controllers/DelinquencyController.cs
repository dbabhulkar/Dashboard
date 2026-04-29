using Dashboard.Models;
using Dashboard.ViewModels;
using Microsoft.AspNetCore.Mvc;
using OVI.Domain.Interfaces;

namespace Dashboard.Controllers
{
    public class DelinquencyController : Controller
    {
        private readonly ICmDataService _cmDataService;
        private readonly IDashboardRepository _dashboardRepository;

        public DelinquencyController(ICmDataService cmDataService, IDashboardRepository dashboardRepository)
        {
            _cmDataService = cmDataService;
            _dashboardRepository = dashboardRepository;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost, CustomFilter]
        public IActionResult Delinquency(CmDelinquencyViewModel viewModel)
        {
            var selectedSegment = viewModel.SelectedSegment != null
                ? string.Join(",", viewModel.SelectedSegment)
                : "";
            var selectedLocation = viewModel.SelectedLocation != null
                ? string.Join(",", viewModel.SelectedLocation)
                : "";
            string empId = HttpContext.Session.GetString("EmpId");

            var dto = _cmDataService.GetCmDelinquency(
                selectedSegment, selectedLocation,
                viewModel.LSId ?? "", viewModel.HiddenDatetime ?? "", empId);

            return View(CmDelinquencyViewModel.FromDto(dto));
        }

        [CustomFilter]
        public IActionResult Delinquency(string datetime = null)
        {
            string empId = HttpContext.Session.GetString("EmpId");

            if (datetime is null)
            {
                datetime = DateTime.Now.ToString("yyyy-MM-dd");
            }

            _dashboardRepository.CaptureProductivityDetails(
                empId.Trim(), "Delinquecy", "OneViewIndicator-CM", 1,
                "Delinquecy View", "Delinquency View for Emp - " + empId.Trim());

            var dto = _cmDataService.GetCmDelinquency("", "", "", datetime, empId);
            return View(CmDelinquencyViewModel.FromDto(dto));
        }

        /// <summary>
        /// AJAX endpoint returning typed JSON — replaces inline SqlCommand data access.
        /// </summary>
        [CustomFilter]
        public JsonResult GetCMDelinquencyPageData(string dateTime)
        {
            string empId = HttpContext.Session.GetString("EmpId");
            var dto = _cmDataService.GetCmDelinquency("", "", "", dateTime, empId);
            return new JsonResult(new
            {
                dto.OverDueAccount,
                dto.OverDueAmount,
                clsColorCode = dto.ColorCodes,
                clsMonthExposure = dto.MonthExposures
            });
        }
    }
}
