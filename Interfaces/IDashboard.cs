using MySqlConnector;
using System.Data;
using Dashboard.Models;

namespace Dashboard.Interfaces
{
    public interface IDashboard
    {
        List<DelinquencyDaysCount> GetDelinquencyDetails(string UserId);
        //DelinquencyDaysCount GetDelinquencyDaysCount(string UserId);
        List<Compliance> GetComplianceItem(string UserId);
        void CaptureProductivityDetails(MySqlConnection Con, string Empcode, string Form_Name, string Module_Name, int Total_Count, string Activity, string Activity_Details);
        string ValidExcelRows(DataRow row, string tableName);
        // void ExportExcel(DataTable ds, string filename);
        DataTable GetUploadErrorList(string UserId, string procName);
    }
}
