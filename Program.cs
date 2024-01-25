using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Dashboard
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllersWithViews();
            builder.Services.Configure<CookiePolicyOptions>(options =>
            {
                // This lambda determines whether user consent for non-essential cookies is needed for a given request.
                options.CheckConsentNeeded = context => true;
                options.MinimumSameSitePolicy = SameSiteMode.None;
            });
            //  services.AddSession(); // added to enable session
            builder.Services.AddSession(options => {
                options.IdleTimeout = TimeSpan.FromMinutes(30);
                options.Cookie.IsEssential = true; // make the session cookie Essential
            });

            //services.AddMvc();
            //services.AddDistributedMemoryCache();
            //services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
            builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            builder.Services.AddSingleton<IActionContextAccessor, ActionContextAccessor>();
            var app = builder.Build();

            /* Some other code */
            //loggerFactory.AddConsole(Configuration.GetSection("Logging"));   // Read Level of logging
            //loggerFactory.AddDebug(); // Log everything
            //loggerFactory.AddFile($"{env.WebRootPath}/Logs/{DateTime.Today:MMM_yyyy}.txt");  // FileName to log error in a folder logs

            //DataBaseConnection.ConnectionDB connection = new DataBaseConnection.ConnectionDB();
            //string strConnection = connection.getConString("1408481", string.Empty, "gTGE/RRRz2ocdWgCJYJjsg==",false);
            //connectionstring = strConnection;

            // Configure the HTTP request pipeline.
            if (!app.Environment.IsDevelopment())
            {
                //connectionstring = this.Configuration.GetConnectionString("DevConnection");
                app.UseExceptionHandler("/Home/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseCookiePolicy();
            app.UseSession();
            app.UseRouting();

            app.UseAuthorization();

            app.MapControllerRoute(
                name: "default",
                pattern: "{controller=Login}/{action=Index}/{id?}");

            app.Run();
        }
    }
}
