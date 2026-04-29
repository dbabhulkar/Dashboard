using System.Security.Claims;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using Microsoft.FeatureManagement;

namespace Dashboard.Models
{
    public class CustomFilter : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            var httpContext = filterContext.HttpContext;
            var user = httpContext.User;

            // Check if cookie-based auth should be the primary check
            var featureManager = httpContext.RequestServices.GetService<IFeatureManager>();
            var requireCookie = featureManager != null
                && featureManager.IsEnabledAsync("Auth.RequireCookieAuth").GetAwaiter().GetResult();

            if (requireCookie)
            {
                // Claims-based check (cookie auth)
                if (user.Identity?.IsAuthenticated == true)
                {
                    // Rehydrate session from claims if session expired but cookie is valid
                    if (httpContext.Session.GetString("EmpId") == null)
                    {
                        var empId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                        if (empId != null)
                        {
                            httpContext.Session.SetString("EmpId", empId);
                            httpContext.Session.SetString("EmpCode", empId);
                            httpContext.Session.SetString("EmpName",
                                user.FindFirst(ClaimTypes.Name)?.Value ?? empId);
                            httpContext.Session.SetString("BusinessRole",
                                user.FindFirst("BusinessRole")?.Value ?? "");
                            httpContext.Session.SetString("sectionType",
                                user.FindFirst("sectionType")?.Value ?? "");
                        }
                    }
                    base.OnActionExecuting(filterContext);
                    return;
                }
            }
            else
            {
                // Legacy session-based check
                if (httpContext.Session.GetString("EmpId") != null)
                {
                    base.OnActionExecuting(filterContext);
                    return;
                }
            }

            // Not authenticated — redirect to session expiry
            var controller = (ControllerBase)filterContext.Controller;
            filterContext.Result = controller.RedirectToAction("SessionExpiry", "Common");
        }
    }
}
