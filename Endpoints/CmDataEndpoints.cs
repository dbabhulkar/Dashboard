using OVI.Domain.Interfaces;

namespace Dashboard.Endpoints;

/// <summary>
/// Minimal API endpoints returning typed JSON for CM module AJAX calls.
/// These replace the inline SqlCommand-based JsonResult actions in CM controllers.
/// Mapped under /api/cm/* to avoid collisions with MVC routes.
/// </summary>
public static class CmDataEndpoints
{
    public static void MapCmDataEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/cm")
            .WithTags("CM Data");

        group.MapGet("/delinquency", (string? dateTime, HttpContext ctx, ICmDataService svc) =>
        {
            var empId = ctx.Session.GetString("EmpId");
            if (string.IsNullOrEmpty(empId))
                return Results.Unauthorized();

            var dto = svc.GetCmDelinquency("", "", "", dateTime ?? DateTime.Now.ToString("yyyy-MM-dd"), empId);
            return Results.Ok(dto);
        });

        group.MapGet("/lchu", (string? dateTime, HttpContext ctx, ICmDataService svc) =>
        {
            var empId = ctx.Session.GetString("EmpId");
            if (string.IsNullOrEmpty(empId))
                return Results.Unauthorized();

            var dto = svc.GetCmLchu("", "", "", dateTime ?? DateTime.Now.ToString("yyyy-MM-dd"), empId);
            return Results.Ok(dto);
        });

        group.MapGet("/aur", (string? dateTime, HttpContext ctx, ICmDataService svc) =>
        {
            var empId = ctx.Session.GetString("EmpId");
            if (string.IsNullOrEmpty(empId))
                return Results.Unauthorized();

            var dto = svc.GetCmAur("", "", "", dateTime ?? DateTime.Now.ToString("yyyy-MM-dd"), empId);
            return Results.Ok(dto);
        });

        group.MapGet("/watchlist", (string? dateTime, HttpContext ctx, ICmDataService svc) =>
        {
            var empId = ctx.Session.GetString("EmpId");
            if (string.IsNullOrEmpty(empId))
                return Results.Unauthorized();

            var dto = svc.GetCmWatchList("", "", "", dateTime ?? DateTime.Now.ToString("yyyy-MM-dd"), empId);
            return Results.Ok(dto);
        });
    }
}
