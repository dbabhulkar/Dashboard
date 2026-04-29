using NetArchTest.Rules;
using Xunit;

namespace OVI.ArchitectureTests;

/// <summary>
/// Machine-checked dependency rules for Clean Architecture layers.
/// Domain references nothing. Application references only Domain.
/// Infrastructure references Application (and transitively Domain).
/// </summary>
public class DependencyRuleTests
{
    private static readonly System.Reflection.Assembly DomainAssembly =
        typeof(OVI.Domain.Interfaces.ICryptoService).Assembly;

    private static readonly System.Reflection.Assembly ApplicationAssembly =
        typeof(OVI.Application.DependencyInjection).Assembly;

    private static readonly System.Reflection.Assembly InfrastructureAssembly =
        typeof(OVI.Infrastructure.DependencyInjection).Assembly;

    [Fact]
    public void Domain_Should_Not_Reference_Application()
    {
        var result = Types.InAssembly(DomainAssembly)
            .ShouldNot()
            .HaveDependencyOn("OVI.Application")
            .GetResult();

        Assert.True(result.IsSuccessful,
            "OVI.Domain must not reference OVI.Application");
    }

    [Fact]
    public void Domain_Should_Not_Reference_Infrastructure()
    {
        var result = Types.InAssembly(DomainAssembly)
            .ShouldNot()
            .HaveDependencyOn("OVI.Infrastructure")
            .GetResult();

        Assert.True(result.IsSuccessful,
            "OVI.Domain must not reference OVI.Infrastructure");
    }

    [Fact]
    public void Domain_Should_Not_Reference_AspNetCore()
    {
        var result = Types.InAssembly(DomainAssembly)
            .ShouldNot()
            .HaveDependencyOn("Microsoft.AspNetCore")
            .GetResult();

        Assert.True(result.IsSuccessful,
            "OVI.Domain must not reference ASP.NET Core");
    }

    [Fact]
    public void Application_Should_Not_Reference_Infrastructure()
    {
        var result = Types.InAssembly(ApplicationAssembly)
            .ShouldNot()
            .HaveDependencyOn("OVI.Infrastructure")
            .GetResult();

        Assert.True(result.IsSuccessful,
            "OVI.Application must not reference OVI.Infrastructure");
    }

    [Fact]
    public void Application_Should_Not_Reference_AspNetCore()
    {
        var result = Types.InAssembly(ApplicationAssembly)
            .ShouldNot()
            .HaveDependencyOn("Microsoft.AspNetCore")
            .GetResult();

        Assert.True(result.IsSuccessful,
            "OVI.Application must not reference ASP.NET Core");
    }

    [Fact]
    public void Infrastructure_Should_Not_Reference_Web()
    {
        var result = Types.InAssembly(InfrastructureAssembly)
            .ShouldNot()
            .HaveDependencyOn("Dashboard")
            .GetResult();

        Assert.True(result.IsSuccessful,
            "OVI.Infrastructure must not reference the Dashboard (Web) project");
    }

    // --- Phase 2: No DataTable in clean layers ---

    [Fact]
    public void Domain_Should_Not_Use_SqlClient()
    {
        var result = Types.InAssembly(DomainAssembly)
            .ShouldNot()
            .HaveDependencyOn("System.Data.SqlClient")
            .GetResult();

        Assert.True(result.IsSuccessful,
            "OVI.Domain must not reference System.Data.SqlClient (no ADO.NET in Domain)");
    }

    [Fact]
    public void Application_Should_Not_Use_DataTable()
    {
        var result = Types.InAssembly(ApplicationAssembly)
            .ShouldNot()
            .HaveDependencyOn("System.Data")
            .GetResult();

        Assert.True(result.IsSuccessful,
            "OVI.Application must not reference System.Data (no DataTable in Application)");
    }

    // --- Phase 5: Observability isolation ---

    [Fact]
    public void Domain_Should_Not_Reference_OpenTelemetry()
    {
        var result = Types.InAssembly(DomainAssembly)
            .ShouldNot()
            .HaveDependencyOn("OpenTelemetry")
            .GetResult();

        Assert.True(result.IsSuccessful,
            "OVI.Domain must not reference OpenTelemetry");
    }

    [Fact]
    public void Domain_Should_Not_Reference_Serilog()
    {
        var result = Types.InAssembly(DomainAssembly)
            .ShouldNot()
            .HaveDependencyOn("Serilog")
            .GetResult();

        Assert.True(result.IsSuccessful,
            "OVI.Domain must not reference Serilog");
    }
}
