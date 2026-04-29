using Dashboard.SeleniumTests.Pages;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;

namespace Dashboard.SeleniumTests;

[TestFixture]
[Category("Login")]
public class LoginTests : TestBase
{
    private LoginPage _loginPage = null!;

    [SetUp]
    public void SetUp()
    {
        _loginPage = new LoginPage(Driver);
        _loginPage.NavigateTo(BaseUrl);
    }

    #region Page Load & UI Elements

    [Test]
    public void LoginPage_ShouldDisplayAllFormElements()
    {
        Assert.Multiple(() =>
        {
            Assert.That(_loginPage.IsUserNameFieldPresent(), Is.True, "UserName field should be visible");
            Assert.That(_loginPage.IsPasswordFieldPresent(), Is.True, "Password field should be visible");
            Assert.That(_loginPage.IsLoginButtonPresent(), Is.True, "Login button should be visible");
        });
    }

    [Test]
    public void LoginPage_TitleShouldBeLogin()
    {
        Assert.That(Driver.Title.ToLower(), Does.Contain("login"));
    }

    [Test]
    public void LoginPage_UserNameFieldShouldHaveAutoFocus()
    {
        var activeElement = Driver.SwitchTo().ActiveElement();
        var userNameField = Driver.FindElement(By.Id("UserName"));
        Assert.That(activeElement, Is.EqualTo(userNameField), "UserName field should have autofocus");
    }

    #endregion

    #region Empty / Missing Fields

    [Test]
    public void Login_WithEmptyCredentials_ShouldShowError()
    {
        _loginPage.Login("", "");
        WaitForAjax();

        // Empty credentials should produce an error or stay on login page
        Assert.That(_loginPage.IsOnLoginPage(), Is.True,
            "Should remain on login page with empty credentials");
    }

    [Test]
    public void Login_WithEmptyPassword_ShouldShowError()
    {
        _loginPage.Login("TESTUSER", "");
        WaitForAjax();

        Assert.That(_loginPage.IsOnLoginPage(), Is.True,
            "Should remain on login page with empty password");
    }

    [Test]
    public void Login_WithEmptyUserName_ShouldShowError()
    {
        _loginPage.Login("", "password123");
        WaitForAjax();

        Assert.That(_loginPage.IsOnLoginPage(), Is.True,
            "Should remain on login page with empty username");
    }

    #endregion

    #region Invalid Credentials

    [Test]
    public void Login_WithInvalidUser_ShouldShowNotMappedError()
    {
        _loginPage.Login("INVALIDUSER999", "wrongpassword");
        WaitForAjax();

        var errorMsg = _loginPage.GetErrorMessage();
        Assert.That(errorMsg, Is.Not.Empty, "Error message should be displayed for invalid user");
    }

    [Test]
    public void Login_WithInvalidCredentials_ShouldRemainOnLoginPage()
    {
        _loginPage.Login("INVALIDUSER999", "wrongpassword");
        WaitForAjax();

        Assert.That(_loginPage.IsOnLoginPage(), Is.True,
            "Should remain on login page after failed login");
    }

    #endregion

    #region Valid Login (UAT mode - bypasses LDAP)

    [Test]
    [Category("RequiresDB")]
    public void Login_WithValidRMUser_ShouldRedirectToSelectionPage()
    {
        // In UAT mode, LDAP is bypassed (Isvalid = true).
        // The user must exist in the database (SP_OVI_ValidateUser).
        // Set OVI_TEST_RM_USER env var to a valid RM user code.
        var rmUser = Environment.GetEnvironmentVariable("OVI_TEST_RM_USER");
        if (string.IsNullOrEmpty(rmUser))
            Assert.Ignore("Set OVI_TEST_RM_USER env var to run this test");

        var rmPassword = Environment.GetEnvironmentVariable("OVI_TEST_RM_PASSWORD") ?? "test";

        _loginPage.Login(rmUser, rmPassword);
        WaitForNavigation();

        Assert.That(Driver.Url, Does.Contain("/Login/SelectionPage").Or.Contain("/Home/Dashboard"),
            "Valid RM user should be redirected to SelectionPage or Dashboard");
    }

    [Test]
    [Category("RequiresDB")]
    public void Login_WithValidCMUser_ShouldRedirectToSelectionPage()
    {
        var cmUser = Environment.GetEnvironmentVariable("OVI_TEST_CM_USER");
        if (string.IsNullOrEmpty(cmUser))
            Assert.Ignore("Set OVI_TEST_CM_USER env var to run this test");

        var cmPassword = Environment.GetEnvironmentVariable("OVI_TEST_CM_PASSWORD") ?? "test";

        _loginPage.Login(cmUser, cmPassword);
        WaitForNavigation();

        Assert.That(Driver.Url, Does.Contain("/Login/SelectionPage").Or.Contain("/CM/CMDashboard"),
            "Valid CM user should be redirected to SelectionPage or CMDashboard");
    }

    #endregion

    #region Query String Login (SSO flow)

    [Test]
    [Category("RequiresDB")]
    public void Login_ViaQueryString_WithValidUser_ShouldRedirect()
    {
        var rmUser = Environment.GetEnvironmentVariable("OVI_TEST_RM_USER");
        if (string.IsNullOrEmpty(rmUser))
            Assert.Ignore("Set OVI_TEST_RM_USER env var to run this test");

        // This tests the GET /Login/Index?USERID=xxx&IP=127.0.0.1 flow
        Driver.Navigate().GoToUrl($"{BaseUrl}/Login/Index?USERID={rmUser}&IP=127.0.0.1");
        WaitForNavigation();

        Assert.That(Driver.Url, Does.Contain("/Home/Dashboard").Or.Contain("/CM/CMDashboard"),
            "Query string login should redirect to appropriate dashboard");
    }

    [Test]
    public void Login_ViaQueryString_WithEmptyUserId_ShouldShowLoginForm()
    {
        Driver.Navigate().GoToUrl($"{BaseUrl}/Login/Index?USERID=&IP=127.0.0.1");

        Assert.That(_loginPage.IsUserNameFieldPresent(), Is.True,
            "Empty USERID should show the login form");
    }

    #endregion

    #region Enter Key Submission

    [Test]
    public void Login_PressingEnterKey_ShouldSubmitForm()
    {
        _loginPage.EnterUserName("INVALIDUSER999");
        _loginPage.EnterPassword("wrongpassword");
        _loginPage.SubmitWithEnterKey();
        WaitForAjax();

        // Should behave the same as clicking login button
        Assert.That(_loginPage.IsOnLoginPage(), Is.True,
            "Enter key should submit the form and stay on login page for invalid user");
    }

    #endregion

    #region Session Expiry

    [Test]
    public void AccessProtectedPage_WithoutLogin_ShouldRedirectToSessionExpiry()
    {
        Driver.Navigate().GoToUrl($"{BaseUrl}/Home/Dashboard");
        WaitForNavigation();

        var url = Driver.Url;
        Assert.That(url, Does.Contain("SessionExpiry").Or.Contain("Login"),
            "Accessing protected page without login should redirect to session expiry or login");
    }

    #endregion

    #region Helpers

    private void WaitForAjax()
    {
        var wait = new WebDriverWait(Driver, TimeSpan.FromSeconds(10));
        wait.Until(d => ((IJavaScriptExecutor)d)
            .ExecuteScript("return jQuery.active == 0") as bool? ?? true);
        // Small buffer for DOM updates
        Thread.Sleep(500);
    }

    private void WaitForNavigation()
    {
        var wait = new WebDriverWait(Driver, TimeSpan.FromSeconds(10));
        wait.Until(d => !d.Url.Contains("/Login/Index?") || d.Url != _loginPage.GetCurrentUrl());
        Thread.Sleep(500);
    }

    #endregion
}
