using OVI.Domain.DTOs;

namespace OVI.Domain.Interfaces;

/// <summary>
/// Abstraction over the CM business-logic methods.
/// Legacy adapter: delegates to Common.cs, maps to DTOs.
/// New Dapper adapter: queries stored procs directly via QueryMultipleAsync.
/// </summary>
public interface ICmDataService
{
    CmDelinquencyResultDto GetCmDelinquency(string selectedSegment, string selectedLocation, string lsid, string datetime, string empId);
    CmLchuResultDto GetCmLchu(string selectedSegment, string selectedLocation, string lsid, string datetime, string empId);
    CmAurResultDto GetCmAur(string selectedSegment, string selectedLocation, string lsid, string datetime, string empId);
    CmWatchListResultDto GetCmWatchList(string selectedSegment, string selectedLocation, string lsid, string datetime, string empId);
}
