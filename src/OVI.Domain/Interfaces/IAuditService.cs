using OVI.Domain.DTOs;

namespace OVI.Domain.Interfaces;

/// <summary>
/// Structured audit event recorder for SOX-relevant actions.
/// Implementations may write to WORM storage, database SPs, or both.
/// </summary>
public interface IAuditService
{
    void Record(AuditEventDto auditEvent);
}
