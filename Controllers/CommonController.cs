using Dashboard.Models;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;

namespace Dashboard.Controllers
{
    public class CommonController : Controller
    {
        SqlConnection sqlCon = new SqlConnection(clsConnectionString.GetConnectionString());
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult SessionExpiry()
        {
            return PartialView("_SessionExpiry");
        }

    }
}