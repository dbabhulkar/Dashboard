using System.Data;
using MySqlConnector;
using OVI.Domain.Interfaces;

namespace OVI.Infrastructure.Persistence;

/// <summary>
/// Creates MySQL connections from the configured connection string.
/// Implements IDbConnectionFactory so repositories are DB-agnostic.
/// </summary>
internal sealed class MySqlDbConnectionFactory(string connectionString) : IDbConnectionFactory
{
    public IDbConnection CreateConnection()
    {
        return new MySqlConnection(connectionString);
    }
}
