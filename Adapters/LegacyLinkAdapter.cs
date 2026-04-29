using Microsoft.Extensions.Logging;
using OVI.Domain.Interfaces;

namespace Dashboard.Adapters;

/// <summary>
/// ACL adapter: wraps legacy Common.Get_PMS_Link.
/// Phase 4: replaced by DapperLinkRepository.
/// </summary>
internal sealed class LegacyLinkAdapter(ILogger<LegacyLinkAdapter> logger) : ILinkService
{
    public string GetLink(string type, string serverName)
    {
        logger.LogDebug("Legacy GetLink type={Type}", type);
        var common = new Models.Common();
        return common.Get_PMS_Link(type, serverName);
    }
}
