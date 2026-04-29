namespace OVI.Domain.DTOs;

/// <summary>
/// Structured audit event for SOX-relevant actions.
/// Immutable record capturing who did what, when, and to which entity.
/// </summary>
public sealed record AuditEventDto
{
    /// <summary>Action category: "Login", "DataExport", "WaiverApproval", "Upload", etc.</summary>
    public required string EventType { get; init; }

    /// <summary>Employee ID of the actor.</summary>
    public required string Actor { get; init; }

    /// <summary>Module: "RM", "CM", "Admin", "Commercials", etc.</summary>
    public required string Module { get; init; }

    /// <summary>Human-readable description of the action.</summary>
    public required string Description { get; init; }

    /// <summary>Optional identifier of the affected entity (e.g., LSID, proposal ID).</summary>
    public string? EntityId { get; init; }

    /// <summary>Optional type of the affected entity (e.g., "AccountCustomisation", "AssetPricing").</summary>
    public string? EntityType { get; init; }

    /// <summary>Optional key-value metadata for additional context.</summary>
    public IReadOnlyDictionary<string, string>? Metadata { get; init; }
}
