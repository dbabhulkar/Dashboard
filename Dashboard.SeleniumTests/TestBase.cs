using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Edge;
using WebDriverManager;
using WebDriverManager.DriverConfigs.Impl;

namespace Dashboard.SeleniumTests;

/// <summary>
/// Base class for all Selenium tests. Handles WebDriver setup/teardown.
/// Configure the target URL via environment variable OVI_BASE_URL (default: http://localhost:5252).
/// Configure browser via OVI_BROWSER (chrome|edge, default: edge).
/// </summary>
public abstract class TestBase
{
    protected IWebDriver Driver { get; private set; } = null!;
    protected string BaseUrl { get; private set; } = null!;

    [SetUp]
    public void SetUpDriver()
    {
        BaseUrl = Environment.GetEnvironmentVariable("OVI_BASE_URL") ?? "http://localhost:5252";
        var browser = Environment.GetEnvironmentVariable("OVI_BROWSER")?.ToLower() ?? "edge";

        Driver = browser switch
        {
            "chrome" => CreateChromeDriver(),
            _ => CreateEdgeDriver()
        };

        Driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(5);
        Driver.Manage().Window.Maximize();
    }

    [TearDown]
    public void TearDownDriver()
    {
        try
        {
            Driver?.Quit();
        }
        catch
        {
            // Swallow disposal errors
        }
    }

    private static IWebDriver CreateChromeDriver()
    {
        new DriverManager().SetUpDriver(new ChromeConfig());
        var options = new ChromeOptions();
        if (IsHeadless())
            options.AddArgument("--headless=new");
        options.AddArgument("--no-sandbox");
        options.AddArgument("--disable-dev-shm-usage");
        return new ChromeDriver(options);
    }

    private static IWebDriver CreateEdgeDriver()
    {
        new DriverManager().SetUpDriver(new EdgeConfig());
        var options = new EdgeOptions();
        if (IsHeadless())
            options.AddArgument("--headless=new");
        options.AddArgument("--no-sandbox");
        options.AddArgument("--disable-dev-shm-usage");
        return new EdgeDriver(options);
    }

    private static bool IsHeadless()
    {
        var val = Environment.GetEnvironmentVariable("OVI_HEADLESS");
        return val == null || val.Equals("true", StringComparison.OrdinalIgnoreCase);
    }
}
