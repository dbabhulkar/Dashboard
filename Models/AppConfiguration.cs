namespace Dashboard.Models
{
    /// <summary>
    /// Static configuration holder initialized once at startup from IConfiguration.
    /// Provides config values to legacy static callers without requiring DI everywhere.
    /// This is a Phase 0 bridge — Phase 1 will migrate callers to constructor injection.
    /// </summary>
    public static class AppConfiguration
    {
        private static IConfiguration? _configuration;

        public static void Initialize(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public static string GetConnectionString()
        {
            if (_configuration == null)
                throw new InvalidOperationException(
                    "AppConfiguration has not been initialized. Call AppConfiguration.Initialize(configuration) in Program.cs.");

            return _configuration.GetConnectionString("Default")
                ?? throw new InvalidOperationException(
                    "ConnectionStrings:Default is not configured in appsettings.json.");
        }

        public static OviSettings GetOviSettings()
        {
            if (_configuration == null)
                throw new InvalidOperationException("AppConfiguration has not been initialized.");

            var settings = new OviSettings();
            _configuration.GetSection("OviSettings").Bind(settings);
            return settings;
        }
    }

    /// <summary>
    /// Typed configuration for environment-specific toggles.
    /// Replaces the //UAT / //LIVE comment-toggle pattern.
    /// </summary>
    public class OviSettings
    {
        /// <summary>
        /// When true, LDAP validation is bypassed (UAT behaviour).
        /// In production, set to false.
        /// </summary>
        public bool BypassLdap { get; set; } = true;

        /// <summary>
        /// When true, the Active status check on user login is bypassed (UAT behaviour).
        /// In production, set to false.
        /// </summary>
        public bool BypassActiveStatusCheck { get; set; } = true;
    }
}
