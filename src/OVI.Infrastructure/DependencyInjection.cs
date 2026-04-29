using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using OVI.Domain.Interfaces;
using OVI.Infrastructure.Audit;
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
        services.AddScoped<DapperCmPortfolioRepository>();
        services.AddScoped<DapperLinkRepository>();

        // Structured audit service (WORM JSON + legacy SP dual-write)
        var wormPath = configuration["AuditSettings:WormPath"] ?? "wwwroot/Logs/audit-.jsonl";
        services.AddSingleton(sp =>
            new StructuredAuditService(sp.GetRequiredService<IDbConnectionFactory>(), wormPath));

        return services;
    }
}
