using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace Dashboard.Controllers
{
    public class ErrorController : Controller
    {
        readonly ILogger _logger;
        public ErrorController(ILogger<ErrorController> logger) => _logger = logger;

        [HttpGet("/Error")]
        public IActionResult Index()
        {
            var exception = HttpContext.Features.Get<IExceptionHandlerFeature>();
            return View(exception);
        }

        [HttpGet("/Error/NotFound/{statusCode}")]
        public IActionResult NotFound(int statusCode)
        {
            var exception = HttpContext.Features.Get<IStatusCodeReExecuteFeature>();
            _logger.LogError($"PAGE NOT FOUND: {exception.OriginalPath}");
            return View("~/Error/Error", exception.OriginalPath);
        }
    }
}
