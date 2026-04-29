using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.FeatureManagement;

namespace Dashboard.Middleware;

/// <summary>
/// Global MVC filter that validates antiforgery tokens on non-safe HTTP methods
/// (POST, PUT, DELETE, PATCH) when the Security.EnforceAntiforgery feature flag is ON.
/// When the flag is OFF, all requests pass through without validation.
/// </summary>
public sealed class ConditionalAntiforgeryFilter : IAsyncAuthorizationFilter
{
    private readonly IAntiforgery _antiforgery;
    private readonly IFeatureManager _featureManager;

    public ConditionalAntiforgeryFilter(IAntiforgery antiforgery, IFeatureManager featureManager)
    {
        _antiforgery = antiforgery;
        _featureManager = featureManager;
    }

    public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
    {
        if (!await _featureManager.IsEnabledAsync("Security.EnforceAntiforgery"))
            return;

        var method = context.HttpContext.Request.Method;
        if (HttpMethods.IsGet(method) ||
            HttpMethods.IsHead(method) ||
            HttpMethods.IsOptions(method) ||
            HttpMethods.IsTrace(method))
        {
            return;
        }

        try
        {
            await _antiforgery.ValidateRequestAsync(context.HttpContext);
        }
        catch (AntiforgeryValidationException)
        {
            context.Result = new StatusCodeResult(400);
        }
    }
}
