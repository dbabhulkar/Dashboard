using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;

namespace Dashboard.Models
{
    public class CustomFilter : ActionFilterAttribute
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ISession _session;
        readonly ILogger _logger;
        public CustomFilter() { }
        //public CustomFilter(ILogger<ErrorController> logger) => _logger = logger;
        //public CustomFilter(IHttpContextAccessor httpContextAccessor)
        //{
        //    _httpContextAccessor = httpContextAccessor;
        //    _session = _httpContextAccessor.HttpContext.Session;
        //}
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            //_logger.LogWarning("Inside OnActionExecuting method...");
            string userName = filterContext.HttpContext.Session.GetString("EmpId");
            if (userName == null)
            {
                var controller = (ControllerBase)filterContext.Controller;
                filterContext.Result = controller.RedirectToAction("SessionExpiry", "Common");

                //filterContext.Result = new RedirectResult("~/Home/Login");
                return;
            }
            base.OnActionExecuting(filterContext);
        }
    }
}
