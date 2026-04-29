using Microsoft.Extensions.DependencyInjection;

namespace OVI.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        // Application-layer service registrations go here as use-case handlers are added.
        return services;
    }
}
