using System.Data;
using Dapper;
using Microsoft.Extensions.Logging;
using OVI.Domain.Interfaces;

namespace OVI.Infrastructure.Repositories;

/// <summary>
/// Dapper-based implementation of ILinkService.
/// Replaces legacy Common.Get_PMS_Link (SP_OVI_Get_Links).
/// </summary>
public sealed class DapperLinkRepository(
    IDbConnectionFactory connectionFactory,
    ILogger<DapperLinkRepository> logger) : ILinkService
{
    public string GetLink(string type, string serverName)
    {
        logger.LogDebug("GetLink type={Type} server={Server}", type, serverName);

        using var connection = connectionFactory.CreateConnection();
        connection.Open();

        var result = connection.QueryFirstOrDefault<string>(
            "SP_OVI_Get_Links",
            new { Type = type, ServerType = serverName },
            commandType: CommandType.StoredProcedure);

        return result ?? "";
    }
}
