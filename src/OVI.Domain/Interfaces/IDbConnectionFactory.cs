using System.Data;

namespace OVI.Domain.Interfaces;

/// <summary>
/// Factory abstraction for creating database connections.
/// Allows Infrastructure to swap between SQL Server, MySQL, etc.
/// </summary>
public interface IDbConnectionFactory
{
    IDbConnection CreateConnection();
}
