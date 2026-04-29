namespace OVI.Domain.Interfaces;

/// <summary>
/// Abstraction over SP_OVI_Get_Links (replaces Common.Get_PMS_Link).
/// </summary>
public interface ILinkService
{
    string GetLink(string type, string serverName);
}
