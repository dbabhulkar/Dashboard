using Microsoft.FeatureManagement;
using OVI.Domain.DTOs;
using OVI.Domain.Interfaces;
using OVI.Infrastructure.Repositories;

namespace Dashboard.Adapters;

/// <summary>
/// Feature-flag gate: routes to Dapper (new) or legacy adapter based on flag.
/// When Module.CM.UseNewDataAccess is on, uses DapperCmDataRepository.
/// Otherwise falls back to LegacyCmDataAdapter.
/// </summary>
internal sealed class FeatureFlaggedCmDataService(
    LegacyCmDataAdapter legacy,
    DapperCmDataRepository dapper,
    IFeatureManager featureManager) : ICmDataService
{
    private bool UseNew => featureManager.IsEnabledAsync("Module.CM.UseNewDataAccess").GetAwaiter().GetResult();

    public CmDelinquencyResultDto GetCmDelinquency(string selectedSegment, string selectedLocation, string lsid, string datetime, string empId)
        => UseNew
            ? dapper.GetCmDelinquency(selectedSegment, selectedLocation, lsid, datetime, empId)
            : legacy.GetCmDelinquency(selectedSegment, selectedLocation, lsid, datetime, empId);

    public CmLchuResultDto GetCmLchu(string selectedSegment, string selectedLocation, string lsid, string datetime, string empId)
        => UseNew
            ? dapper.GetCmLchu(selectedSegment, selectedLocation, lsid, datetime, empId)
            : legacy.GetCmLchu(selectedSegment, selectedLocation, lsid, datetime, empId);

    public CmAurResultDto GetCmAur(string selectedSegment, string selectedLocation, string lsid, string datetime, string empId)
        => UseNew
            ? dapper.GetCmAur(selectedSegment, selectedLocation, lsid, datetime, empId)
            : legacy.GetCmAur(selectedSegment, selectedLocation, lsid, datetime, empId);

    public CmWatchListResultDto GetCmWatchList(string selectedSegment, string selectedLocation, string lsid, string datetime, string empId)
        => UseNew
            ? dapper.GetCmWatchList(selectedSegment, selectedLocation, lsid, datetime, empId)
            : legacy.GetCmWatchList(selectedSegment, selectedLocation, lsid, datetime, empId);
}
