using Microsoft.AspNetCore.Mvc;

namespace Dashboard.Controllers
{
    public class CommonController : Controller
    {
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
