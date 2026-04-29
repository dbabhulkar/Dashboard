using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;

namespace Dashboard.SeleniumTests.Pages;

/// <summary>
/// Page Object for the Login page (/Login/Index).
/// Maps to Views/Login/Index.cshtml elements.
/// </summary>
public class LoginPage
{
    private readonly IWebDriver _driver;
    private readonly WebDriverWait _wait;

    // Element locators matching the Razor view
    private readonly By _userNameInput = By.Id("UserName");
    private readonly By _passwordInput = By.Id("Password");
    private readonly By _loginButton = By.Id("btnLogin");
    private readonly By _messageLabel = By.Id("lbl_message");

    public LoginPage(IWebDriver driver)
    {
        _driver = driver;
        _wait = new WebDriverWait(driver, TimeSpan.FromSeconds(10));
    }

    public void NavigateTo(string baseUrl)
    {
        _driver.Navigate().GoToUrl($"{baseUrl}/Login/Index");
        _wait.Until(d => d.FindElement(_loginButton).Displayed);
    }

    public void EnterUserName(string userName)
    {
        var input = _driver.FindElement(_userNameInput);
        input.Clear();
        input.SendKeys(userName);
    }

    public void EnterPassword(string password)
    {
        var input = _driver.FindElement(_passwordInput);
        input.Clear();
        input.SendKeys(password);
    }

    public void ClickLogin()
    {
        _driver.FindElement(_loginButton).Click();
    }

    public void Login(string userName, string password)
    {
        EnterUserName(userName);
        EnterPassword(password);
        ClickLogin();
    }

    public string GetErrorMessage()
    {
        _wait.Until(d =>
        {
            var el = d.FindElement(_messageLabel);
            return !string.IsNullOrEmpty(el.Text);
        });
        return _driver.FindElement(_messageLabel).Text;
    }

    public bool IsErrorMessageDisplayed()
    {
        try
        {
            var el = _driver.FindElement(_messageLabel);
            return !string.IsNullOrEmpty(el.Text);
        }
        catch (NoSuchElementException)
        {
            return false;
        }
    }

    public string GetCurrentUrl() => _driver.Url;

    public bool IsOnLoginPage() => _driver.Url.Contains("/Login");

    public bool IsUserNameFieldPresent()
    {
        try
        {
            return _driver.FindElement(_userNameInput).Displayed;
        }
        catch (NoSuchElementException)
        {
            return false;
        }
    }

    public bool IsPasswordFieldPresent()
    {
        try
        {
            return _driver.FindElement(_passwordInput).Displayed;
        }
        catch (NoSuchElementException)
        {
            return false;
        }
    }

    public bool IsLoginButtonPresent()
    {
        try
        {
            return _driver.FindElement(_loginButton).Displayed;
        }
        catch (NoSuchElementException)
        {
            return false;
        }
    }

    public void SubmitWithEnterKey()
    {
        _driver.FindElement(_passwordInput).SendKeys(Keys.Enter);
    }
}
