using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Dashboard.Models
{
    public class clsCMWatchList
    {
  
          
            public string Segment { get; set; }
            public string Month { get; set; }
            public string NOOFAcc { get; set; }
            public string Utilization { get; set; }
            public string Total { get; set; }
            //  public List<clsCMDelinquency> clsCMDelinquency { get; set; }
            // public List<ActionItem> ActionItem { get; set; }
        }

        public class clsCMWatchListMain
        {
            public string HiddenDatetime { get; set; }
            public string WatchListAccount { get; set; }
            public string WatchListAmount { get; set; }
            public List<clsCMWatchList> clsCMWatchList { get; set; }
            public List<ActionItemWatchList> ActionItemWatchList { get; set; }
            public List<clsMonthWatchList> clsMonthWatchList { get; set; }
            public List<clsMonthTotalWatchList> clsMonthTotalWatchList { get; set; }
            public List<clsMonthTotalWatchList> clsMonthTotalWatchListExposure { get; set; }


            //  public List<Summary> Summary { get; set; }

            public List<SelectListItem> lstLocation { get; set; }
            public string[] SelectedSegment { get; set; }
            public string[] SelectedLocation { get; set; }
            public List<SelectListItem> lstSegment { get; set; }
            public List<clsCode> clsColorCode { get; set; }
            public string LSId { get; set; }

        }

        public class ActionItemWatchList
        {
            public string LSID { get; set; }
            public string CustomerName { get; set; }
            public string Segment { get; set; }
            public string PMG { get; set; }
            public string SANEXP { get; set; }

            //[BindProperty(Name = "Exposure(In L)")]
            public string OSEXP { get; set; }

            public string RM { get; set; }
            public string TH { get; set; }

        }
        public class clsMonthWatchList
        {
            public string MonthName { get; set; }
        }
        public class clsMonthTotalWatchList
        {
            public string MonthName { get; set; }
            public string NoOFAcc { get; set; }
            public string TotalAmount { get; set; }
            public string TotalExpoAmount { get; set; }
            public string Segment { get; set; }
        }


    }
