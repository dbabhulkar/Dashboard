using OVI.Domain.DTOs;

namespace OVI.Domain.Interfaces;

/// <summary>
/// Abstraction over the RM dashboard data access (legacy DashboardRepository).
/// Phase 2: typed DTO returns replace DataTable/object.
/// </summary>
public interface IDashboardRepository
{
    List<DelinquencyDaysCountDto> GetDelinquencyDetails(string userId);
    List<ComplianceDto> GetComplianceItem(string userId);
    void CaptureProductivityDetails(string empCode, string formName, string moduleName, int totalCount, string activity, string activityDetails);
}
