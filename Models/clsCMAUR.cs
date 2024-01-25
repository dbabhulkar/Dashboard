using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Dashboard.Models
{
    public class clsCMAUR
    {
        public string Segment { get; set; }
        public string Month { get; set; }
        public string NOOFAcc { get; set; }
        public string Utilization { get; set; }
        public string Total { get; set; }
        //  public List<clsCMDelinquency> clsCMDelinquency { get; set; }
        // public List<ActionItem> ActionItem { get; set; }
    }
    public class clsCMAURMain
    {
        public string HiddenDatetime { get; set; }
        public string AURAccount { get; set; }
        public string AURAmount { get; set; }
        public List<clsCMAUR> clsCMAUR { get; set; }
        public List<ActionItemAUR> ActionItemAUR { get; set; }
        public List<clsMonthAUR> clsMonthAUR { get; set; }
        public List<clsMonthTotalAUR> clsMonthTotalAUR { get; set; }
        public List<clsMonthTotalAUR> clsMonthTotalAURExposure { get; set; }


        //  public List<Summary> Summary { get; set; }

        public List<SelectListItem> lstLocation { get; set; }
        public string[] SelectedSegment { get; set; }
        public string[] SelectedLocation { get; set; }
        public List<SelectListItem> lstSegment { get; set; }
        public List<clsCode> clsColorCode { get; set; }
        public string LSId { get; set; }

    }

    public class ActionItemAUR
    {
        public string LSID { get; set; }
        public string CustomerName { get; set; }
        public string Segment { get; set; }
        public string PMG { get; set; }
        public string SANEXP { get; set; }

        //[BindProperty(Name = "Exposure(In L)")]
        public string OSEXP { get; set; }

        public string ReasonforExit { get; set; }
        public string TypeofPlan { get; set; }
        public string PlanStatus { get; set; }

        public string RM { get; set; }
        public string TH { get; set; }

    }
    public class clsMonthAUR
    {
        public string MonthName { get; set; }
    }
    public class clsMonthTotalAUR
    {
        public string MonthName { get; set; }
        public string NoOFAcc { get; set; }
        public string TotalAmount { get; set; }
        public string TotalExpoAmount { get; set; }
        public string Segment { get; set; }
    }


}
