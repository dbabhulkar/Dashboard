using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Dashboard.Models
{
    public class clsCMDelinquency
    {
        public string Segment { get; set; }
        public string Month { get; set; }
        public string NOOFAcc { get; set; }
        public string Utilization { get; set; }
        public string Total { get; set; }
        //  public List<clsCMDelinquency> clsCMDelinquency { get; set; }
        // public List<ActionItem> ActionItem { get; set; }
    }

    public class clsCMDelinquencyMain
    {
        public string HiddenDatetime { get; set; }
        public string OverDueAccount { get; set; }
        public string OverDueAmount { get; set; }
        public List<clsCMDelinquency> clsCMDelinquency { get; set; }
        public List<ActionItem> ActionItem { get; set; }
        public List<clsMonth> clsMonth { get; set; }
        public List<clsMonthTotal> clsMonthTotal { get; set; }
        public List<clsMonthTotal> clsMonthExposure { get; set; }
        public List<clsDPDExposure> clsDPDExposure { get; set; }
        public List<clsDPDPeriod> clsDPDPeriod { get; set; }

        //  public List<Summary> Summary { get; set; }

        public List<SelectListItem> lstLocation { get; set; }
        public string[] SelectedSegment { get; set; }
        public string[] SelectedLocation { get; set; }
        public List<SelectListItem> lstSegment { get; set; }
        public List<clsCode> clsColorCode { get; set; }
        public string LSId { get; set; }

    }

    public class ActionItem
    {
        public string LSID { get; set; }
        public string CustomerName { get; set; }
        public string Segment { get; set; }
        public string PMG { get; set; }
        public string SANEXP { get; set; }

        //[BindProperty(Name = "Exposure(In L)")]
        public string OSEXP { get; set; }

        public string Overdue { get; set; }
        public string DPD { get; set; }
        public string RM { get; set; }
        public string TH { get; set; }

    }
    public class clsMonth
    {
        public string MonthName { get; set; }
    }
    public class clsMonthTotal
    {
        public string MonthName { get; set; }
        public string NoOFAcc { get; set; }
        public string TotalAmount { get; set; }
        public string TotalExpoAmount { get; set; }
        public string Segment { get; set; }
    }
    public class clsDPDExposure
    {
        public string Segment { get; set; }
        public string OverdueAccount { get; set; }
        public string OverdueAmount { get; set; }
        public string OverdueExposure { get; set; }
        public string DPDPeriod { get; set; }
    }

    public class clsDPDPeriod
    {
        public string DPDPeriodNM { get; set; }
    }
}
