using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Dashboard.Models
{
    public class clsCMLCHU
    {
        public string Segment { get; set; }
        public string Month { get; set; }
        public string NOOFAcc { get; set; }
        public string Utilization { get; set; }
        public string Total { get; set; }
        //  public List<clsCMDelinquency> clsCMDelinquency { get; set; }
        // public List<ActionItem> ActionItem { get; set; }
    }

    public class clsCMLCHUMain
    {
        public string HiddenDatetime { get; set; }
        public string LCHUAccount { get; set; }
        public string LCHUAmount { get; set; }
        public List<clsCMLCHU> clsCMLCHU { get; set; }
        public List<ActionItemLCHU> ActionItemLCHU { get; set; }
        public List<clsMonthLCHU> clsMonthLCHU { get; set; }
        public List<clsMonthTotalLCHU> clsMonthTotalLCHU { get; set; }
        public List<clsMonthTotalLCHU> clsMonthTotalLCHUExposure { get; set; }
        public List<clsDPDExposureLCHU> clsDPDExposureLCHU { get; set; }
        public List<clsDPDPeriodLCHU> clsDPDPeriodLCHU { get; set; }

        //  public List<Summary> Summary { get; set; }

        public List<SelectListItem> lstLocation { get; set; }
        public string[] SelectedSegment { get; set; }
        public string[] SelectedLocation { get; set; }
        public List<SelectListItem> lstSegment { get; set; }
        public List<clsCode> clsColorCode { get; set; }
        public string LSId { get; set; }

    }

    public class ActionItemLCHU
    {
        public string LSID { get; set; }
        public string CustomerName { get; set; }
        public string Segment { get; set; }
        public string PMG { get; set; }
        public string SANEXP { get; set; }

        //[BindProperty(Name = "Exposure(In L)")]
        public string OSEXP { get; set; }

        //public string Overdue { get; set; }
        public string No_of_times_in_LCHU { get; set; }
        public string RM { get; set; }
        public string TH { get; set; }

    }
    public class clsMonthLCHU
    {
        public string MonthName { get; set; }
    }
    public class clsMonthTotalLCHU
    {
        public string MonthName { get; set; }
        public string NoOFAcc { get; set; }
        public string TotalAmount { get; set; }
        public string TotalExpoAmount { get; set; }
        public string Segment { get; set; }
    }
    public class clsDPDExposureLCHU
    {
        public string Segment { get; set; }
        public string LCHUAccount { get; set; }
        public string LCHUAmount { get; set; }
        public string LCHUExposure { get; set; }
        public string LCHUPeriod { get; set; }
    }

    public class clsDPDPeriodLCHU
    {
        public string DPDPeriodNM { get; set; }
    }
}
