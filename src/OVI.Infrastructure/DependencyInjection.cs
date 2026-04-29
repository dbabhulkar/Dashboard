using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using OVI.Domain.Interfaces;
using OVI.Infrastructure.Persistence;
using OVI.Infrastructure.Repositories;

namespace OVI.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // Database connection factory — MySQL for new data access
        var connectionString = configuration.GetConnectionString("Default")
            ?? throw new InvalidOperationException("ConnectionStrings:Default is not configured.");

        services.AddSingleton<IDbConnectionFactory>(new MySqlDbConnectionFactory(connectionString));

        // Dapper-based repositories (new implementations, gated by feature flags)
        services.AddScoped<DapperDashboardRepository>();
        services.AddScoped<DapperCmDataRepository>();

        return services;
    }
}
