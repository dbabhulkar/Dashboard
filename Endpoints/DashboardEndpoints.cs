using OVI.Domain.Interfaces;

namespace Dashboard.Endpoints;

/// <summary>
/// Minimal API endpoints for RM Dashboard data.
/// Typed JSON replacements for legacy DataTable-returning AJAX actions.
/// </summary>
public static class DashboardEndpoints
{
    public static void MapDashboardEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/dashboard")
            .WithTags("RM Dashboard");

        group.MapGet("/delinquency", (HttpContext ctx, IDashboardRepository repo) =>
        {
            var empId = ctx.Session.GetString("EmpId");
            if (string.IsNullOrEmpty(empId))
                return Results.Unauthorized();

            var data = repo.GetDelinquencyDetails(empId);
            return Results.Ok(data);
        });

        group.MapGet("/compliance", (HttpContext ctx, IDashboardRepository repo) =>
        {
            var empId = ctx.Session.GetString("EmpId");
            if (string.IsNullOrEmpty(empId))
                return Results.Unauthorized();

            var data = repo.GetComplianceItem(empId);
            return Results.Ok(data);
        });
    }
}
