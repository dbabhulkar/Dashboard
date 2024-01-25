using System.Data;

namespace Dashboard.Models
{
    public class clsPortfolio
    {
         
            public string Segment { get; set; }
            public string NO { get; set; }
            public string ApprLmt { get; set; }
            public string Disbursed { get; set; }
            public string MonthName { get; set; }
            public string AgriType { get; set; }
            public string CityName { get; set; }


        }

        public class PortfolioMain
        {
            public List<clsPortfolio> clsPortfolio { get; set; }
            public List<PortfolioSummary> PortfolioSummary { get; set; }
            public List<Trend> Trend { get; set; }
            public List<ABCCategores> ABCCategores { get; set; }
            public List<RiskCategories> RiskCategories { get; set; }
            public List<IndustryWise> IndustryWise { get; set; }

            public List<clsCode> clsCode { get; set; }

            public List<clsCode> clsCodeIndustryColor { get; set; }

            public DataTable dataTable { get; set; }
        }

        public class Trend
        {
            public string MonthName { get; set; }
            public string Exposure { get; set; }
            public string sCount { get; set; }
        }

        public class ABCCategores
        {
            public string Categories { get; set; }
            public string No { get; set; }
            public string Exposure { get; set; }
            public string Utilization { get; set; }
        }

        public class RiskCategories
        {
            public string RiskType { get; set; }
            public string No { get; set; }
            public string Exposure { get; set; }
            public string Utilization { get; set; }
        }

        public class IndustryWise
        {
            public string Industy { get; set; }
            public string Count { get; set; }
            public string Value { get; set; }
        }
}