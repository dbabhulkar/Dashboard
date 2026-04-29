using System.Data;
using Dapper;
using OVI.Domain.DTOs;
using OVI.Domain.Interfaces;
using Serilog;
using Serilog.Formatting.Compact;

namespace OVI.Infrastructure.Audit;

/// <summary>
/// Writes structured audit events to a dedicated WORM-path JSON log file
/// AND to the legacy USP_Insert_Data_In_Activity_Log_Tracker SP for backwards compatibility.
/// </summary>
public sealed class StructuredAuditService : IAuditService
{
    private readonly IDbConnectionFactory _connectionFactory;
    private readonly ILogger _auditLogger;

    public StructuredAuditService(IDbConnectionFactory connectionFactory, string wormPath)
    {
        _connectionFactory = connectionFactory;

        // Dedicated Serilog logger for audit events — separate from app logger
        _auditLogger = new LoggerConfiguration()
            .WriteTo.File(
                formatter: new CompactJsonFormatter(),
                path: wormPath,
                rollingInterval: RollingInterval.Day,
                retainedFileCountLimit: null) // WORM: retain all files
            .CreateLogger();
    }

    public void Record(AuditEventDto auditEvent)
    {
        // Write structured JSON to WORM file
        _auditLogger.Information(
            "AuditEvent {EventType} by {Actor} in {Module}: {Description} " +
            "[Entity={EntityType}:{EntityId}]",
            auditEvent.EventType,
            auditEvent.Actor,
            auditEvent.Module,
            auditEvent.Description,
            auditEvent.EntityType ?? "none",
            auditEvent.EntityId ?? "none");

        // Also write to legacy SP for backward compatibility
        WriteLegacySp(auditEvent);
    }

    private void WriteLegacySp(AuditEventDto auditEvent)
    {
        try
        {
            using var connection = _connectionFactory.CreateConnection();
            connection.Open();
            connection.Execute(
                "USP_Insert_Data_In_Activity_Log_Tracker",
                new
                {
                    Emp_Code = auditEvent.Actor,
                    Form_Name = auditEvent.EventType,
                    Module_Name = auditEvent.Module,
                    Total_Count = 1,
                    Activity = auditEvent.EventType,
                    Activity_Details = auditEvent.Description
                },
                commandType: CommandType.StoredProcedure);
        }
        catch
        {
            // Legacy SP failure should not block the structured audit write
        }
    }
}
