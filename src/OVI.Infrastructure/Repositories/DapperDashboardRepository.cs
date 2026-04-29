using System.Data;
using Dapper;
using Microsoft.Extensions.Logging;
using OVI.Domain.DTOs;
using OVI.Domain.Interfaces;

namespace OVI.Infrastructure.Repositories;

/// <summary>
/// Dapper-based implementation of IDashboardRepository.
/// Replaces legacy DashboardRepository's raw ADO.NET with parameterized Dapper queries.
/// Uses IDbConnectionFactory (MySQL) instead of hardcoded SqlConnection.
/// </summary>
public sealed class DapperDashboardRepository(
    IDbConnectionFactory connectionFactory,
    ILogger<DapperDashboardRepository> logger) : IDashboardRepository
{
    public List<DelinquencyDaysCountDto> GetDelinquencyDetails(string userId)
    {
        logger.LogDebug("DapperDashboardRepository.GetDelinquencyDetails for {UserId}", userId);

        using var connection = connectionFactory.CreateConnection();
        connection.Open();

        var results = connection.Query<DelinquencyDaysCountDto>(
            "SP_OVI_GetDelinquencyDashboardCount",
            new { UserID = userId },
            commandType: CommandType.StoredProcedure
        ).ToList();

        return results;
    }

    public List<ComplianceDto> GetComplianceItem(string userId)
    {
        logger.LogDebug("DapperDashboardRepository.GetComplianceItem for {UserId}", userId);

        using var connection = connectionFactory.CreateConnection();
        connection.Open();

        // MySQL stored proc column names: Compliance_Item, Cnt, ItemDate
        var results = connection.Query<ComplianceRawRow>(
            "SP_OVI_GetComplianceList",
            new { UserID = userId },
            commandType: CommandType.StoredProcedure
        ).Select(r => new ComplianceDto
        {
            ComplianceItem = r.Compliance_Item,
            ItemCount = r.Cnt,
            ItemDate = r.ItemDate
        }).ToList();

        return results;
    }

    public void CaptureProductivityDetails(string empCode, string formName, string moduleName, int totalCount, string activity, string activityDetails)
    {
        logger.LogDebug("DapperDashboardRepository.CaptureProductivityDetails for {EmpCode}", empCode);

        using var connection = connectionFactory.CreateConnection();
        connection.Open();

        connection.Execute(
            "USP_Insert_Data_In_Activity_Log_Tracker",
            new
            {
                Emp_Code = empCode,
                Form_Name = formName,
                Module_Name = moduleName,
                Total_Count = totalCount,
                Activity = activity,
                Activity_Details = activityDetails
            },
            commandType: CommandType.StoredProcedure
        );
    }

    // Internal row type matching the SP column names for mapping
    private record ComplianceRawRow
    {
        public string? Compliance_Item { get; init; }
        public int Cnt { get; init; }
        public string? ItemDate { get; init; }
    }
}
