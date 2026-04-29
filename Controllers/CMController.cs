using Dashboard.Models;
using Microsoft.AspNetCore.Mvc;
using OVI.Domain.DTOs;
using OVI.Domain.Interfaces;
using System.Net;

namespace Dashboard.Controllers
{
    public class CMController : Controller
    {
        private readonly ICmPortfolioService _portfolioService;
        private readonly ICryptoService _cryptoService;

        public CMController(ICmPortfolioService portfolioService, ICryptoService cryptoService)
        {
            _portfolioService = portfolioService;
            _cryptoService = cryptoService;
        }

        public IActionResult Index()
        {
            return View();
        }

        [CustomFilter]
        public IActionResult CMDashboard(string USERID, string IP)
        {
            try
            {
                string CurrentIP = Response.HttpContext.Connection.RemoteIpAddress.ToString();
                if (CurrentIP == "::1")
                {
                    CurrentIP = Dns.GetHostEntry(Dns.GetHostName()).AddressList[1].ToString();
                }
                string DecryIP = EncryptDecrypt.Decrypt(IP);

                HttpContext.Session.SetString("EncryptedIP", IP);
                HttpContext.Session.SetString("EncryptedId", USERID);
                HttpContext.Session.SetString("CentralTeam", "No");

                if (DecryIP == CurrentIP)
                {
                    string user_id = HttpContext.Session.GetString("EmpId");
                    _portfolioService.LogActivity(user_id, "CMView", "CM Module", "Dashboard View", "View Data Graphically");
                }
                else
                {
                    string url = Global.LoginUrl;
                    HttpContext.Session.Clear();
                    HttpContext.Session.Remove("EmpId");
                    return Redirect(url);
                }
            }
            catch (Exception)
            {
                // Preserve legacy behavior — swallow exceptions on dashboard entry
            }
            return View();
        }

        [HttpGet]
        public IActionResult Portfolio()
        {
            try
            {
                string empId = HttpContext.Session.GetString("EmpId");
                _portfolioService.LogActivity(empId, "Portfolio", "Portfolio Module", "Portfolio View", "View Data Graphically");
            }
            catch (Exception)
            {
            }
            return View();
        }

        #region Dashboard

        [HttpGet]
        public JsonResult GetPortfolioData(string dateTime)
        {
            string empId = HttpContext.Session.GetString("EmpId");
            var result = _portfolioService.GetDashboardData("Portfolio", empId, dateTime);
            return new JsonResult(result);
        }

        [HttpGet]
        public JsonResult GetLCHUData1(string dateTime)
        {
            string empId = HttpContext.Session.GetString("EmpId");
            var result = _portfolioService.GetDashboardData("LCUHData", empId, dateTime);
            return new JsonResult(result);
        }

        [HttpGet]
        public JsonResult GetAURData1(string dateTime)
        {
            string empId = HttpContext.Session.GetString("EmpId");
            var result = _portfolioService.GetDashboardData("AURData", empId, dateTime);
            return new JsonResult(result);
        }

        [HttpGet]
        public JsonResult GetDelinquencyData1(string delFilterVal, string dateTime)
        {
            string empId = HttpContext.Session.GetString("EmpId");
            var result = _portfolioService.GetDashboardData("DelinquencyData", empId, dateTime, delFilterVal);
            return new JsonResult(result);
        }

        [HttpGet]
        public JsonResult GetLCHUData(string dateTime)
        {
            string empId = HttpContext.Session.GetString("EmpId");
            var result = _portfolioService.GetDashboardLchuData("LCUHData", empId, dateTime);
            return new JsonResult(result);
        }

        [HttpGet]
        public JsonResult GetDelinquencyData(string delFilterVal, string dateTime)
        {
            string empId = HttpContext.Session.GetString("EmpId");
            var result = _portfolioService.GetDashboardLchuData("DelinquencyData", empId, dateTime);
            return new JsonResult(result);
        }

        [HttpGet]
        public JsonResult GetAURData(string dateTime)
        {
            string empId = HttpContext.Session.GetString("EmpId");
            var result = _portfolioService.GetDashboardLchuData("AURData", empId, dateTime);
            return new JsonResult(result);
        }

        [HttpGet]
        public JsonResult GetHouskeepingData(string dateTime)
        {
            string empId = HttpContext.Session.GetString("EmpId");
            var result = _portfolioService.GetHousekeepingData(empId, dateTime);
            return new JsonResult(result);
        }

        [HttpGet]
        public JsonResult GetPortfolioHubData(string dateTime)
        {
            string empId = HttpContext.Session.GetString("EmpId");
            var result = _portfolioService.GetHubData("GetPortfolioHubData", empId, dateTime);
            return new JsonResult(result.Items);
        }

        [HttpGet]
        public JsonResult GetLCHUHubData(string dateTime)
        {
            string empId = HttpContext.Session.GetString("EmpId");
            var result = _portfolioService.GetHubData("GetLCHUHubData", empId, dateTime);
            return new JsonResult(result.Items);
        }

        [HttpGet]
        public JsonResult GetAURHubData(string dateTime)
        {
            string empId = HttpContext.Session.GetString("EmpId");
            var result = _portfolioService.GetHubData("GetAURHubData", empId, dateTime);
            return new JsonResult(result.Items);
        }

        [HttpGet]
        public JsonResult GetDelinquencyHubData(string delFilterVal, string dateTime)
        {
            string empId = HttpContext.Session.GetString("EmpId");
            var result = _portfolioService.GetHubData("GetDelinquencyHubData", empId, dateTime, delFilterVal);
            return new JsonResult(result.Items);
        }

        #endregion

        #region Portfolio

        [HttpGet]
        public JsonResult GetPortfolioPageData(string dateTime)
        {
            string empId = HttpContext.Session.GetString("EmpId");
            var result = _portfolioService.GetPortfolioPageData(empId, dateTime);
            return new JsonResult(result);
        }

        #endregion
    }
}
