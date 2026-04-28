using Dashboard.Models;
using Dashboard.Middleware;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.FeatureManagement;
using Serilog;
using Serilog.Events;

namespace Dashboard
{
    public class Program
    {
        public static void Main(string[] args)
        {
            // Configure Serilog early so startup errors are captured
            Log.Logger = new LoggerConfiguration()
                .MinimumLevel.Information()
                .MinimumLevel.Override("Microsoft.AspNetCore", LogEventLevel.Warning)
                .Enrich.FromLogContext()
                .WriteTo.Console(outputTemplate:
                    "[{Timestamp:HH:mm:ss} {Level:u3}] {CorrelationId} {Message:lj}{NewLine}{Exception}")
                .WriteTo.File(
                    path: "wwwroot/Logs/ovi-.log",
                    rollingInterval: RollingInterval.Day,
                    outputTemplate:
                        "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] {CorrelationId} | {RequestPath} | {UserId} | {Message:lj}{NewLine}{Exception}",
                    retainedFileCountLimit: 90)
                .CreateLogger();

            try
            {
                Log.Information("Starting OVI Dashboard");

                var builder = WebApplication.CreateBuilder(args);

                // Initialize static configuration bridge for legacy callers
                AppConfiguration.Initialize(builder.Configuration);

                // Register OviSettings as a typed option for DI consumers
                builder.Services.Configure<OviSettings>(
                    builder.Configuration.GetSection("OviSettings"));

                // Replace default logging with Serilog
                builder.Host.UseSerilog();

                // Add services to the container.
                builder.Services.AddControllersWithViews();
                builder.Services.Configure<CookiePolicyOptions>(options =>
                {
                    options.CheckConsentNeeded = context => true;
                    options.MinimumSameSitePolicy = SameSiteMode.None;
                });
                builder.Services.AddSession(options =>
                {
                    options.IdleTimeout = TimeSpan.FromMinutes(30);
                    options.Cookie.IsEssential = true;
                });

                builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
                builder.Services.AddSingleton<IActionContextAccessor, ActionContextAccessor>();

                // Feature management
                builder.Services.AddFeatureManagement(
                    builder.Configuration.GetSection("FeatureManagement"));

                var app = builder.Build();

                // Configure the HTTP request pipeline.
                if (!app.Environment.IsDevelopment())
                {
                    app.UseExceptionHandler("/Home/Error");
                    app.UseHsts();
                }

                app.UseHttpsRedirection();
                app.UseStaticFiles();
                app.UseCookiePolicy();
                app.UseSession();

                // Correlation ID middleware — stamps every request
                app.UseMiddleware<CorrelationIdMiddleware>();

                // Serilog request logging with enriched properties
                app.UseSerilogRequestLogging(options =>
                {
                    options.EnrichDiagnosticContext = (diagnosticContext, httpContext) =>
                    {
                        diagnosticContext.Set("UserId",
                            httpContext.Session.GetString("EmpId") ?? "anonymous");
                    };
                });

                app.UseRouting();
                app.UseAuthorization();

                app.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Login}/{action=Index}/{id?}");

                app.Run();
            }
            catch (Exception ex)
            {
                Log.Fatal(ex, "OVI Dashboard terminated unexpectedly");
            }
            finally
            {
                Log.CloseAndFlush();
            }
        }
    }
}
