using MySqlConnector;
using System.Data;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc;
using System.Formats.Asn1;
using System.ComponentModel;

namespace Dashboard.Models
{
    public class Common
    {
        private MySqlConnection sqlCon;
        private MySqlCommand cmd;
        private MySqlDataAdapter sda;

        public clsCMDelinquencyMain clsCMDelinquency11(string SelectedSegment, string SelectedLocation, string LSID, string datetime, string EmpID)
        {
            clsCMDelinquencyMain clsCMDelinquencyMain = new clsCMDelinquencyMain();
            if (datetime is null)
            {
                datetime = DateTime.Now.ToString("yyyy-MM-dd");
            }
            DataSet dt = new DataSet();
            DateTime dateTime1 = new DateTime();

            dateTime1 = Convert.ToDateTime(datetime);

            if (!string.IsNullOrEmpty(LSID))
            {
                LSID = LSID.Trim();
            }

            List<clsCMDelinquency> lstclsCMDelinquency = new List<clsCMDelinquency>();
            List<ActionItem> lstActionItem = new List<ActionItem>();
            List<clsMonth> lstclsMonth = new List<clsMonth>();
            List<clsCode> lstclsColorCode = new List<clsCode>();
            List<clsMonthTotal> lstclsMonthTotal = new List<clsMonthTotal>();
            List<clsMonthTotal> lstclsMonthExposure = new List<clsMonthTotal>();
            List<clsDPDExposure> lstclsDPDExposure = new List<clsDPDExposure>();
            List<clsDPDPeriod> lstclsDPDPeriods = new List<clsDPDPeriod>();


            //List<Summary> lstSummary = new List<Summary>();
            try
            {
                //sqlCon = new MySqlConnection(Startup.connectionstring);               
                cmd = new MySqlCommand("SP_OVI_CMDelinquency", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@IdentFlag", "CMDelinquency");
                //cmd.Parameters.AddWithValue("@CM_Emp_Code", HttpContext.Session.GetString("EmpId"));
                cmd.Parameters.AddWithValue("@CM_Emp_Code", EmpID);
                cmd.Parameters.AddWithValue("@SelectedDate", dateTime1);
                cmd.Parameters.AddWithValue("@SelectedSegment", SelectedSegment);
                cmd.Parameters.AddWithValue("@SelectedLocation", SelectedLocation);
                cmd.Parameters.AddWithValue("@SelectedLSID", LSID);

                if (sqlCon.State == ConnectionState.Closed)
                {
                    sqlCon.Open();
                }
                sda = new MySqlDataAdapter(cmd);
                sda.Fill(dt);
                sqlCon.Close();

                if (dt.Tables[0].Rows.Count > 0)
                {
                    foreach (DataRow row in dt.Tables[0].Rows)
                    {
                        clsMonth clsMonth = new clsMonth();

                        clsMonth.MonthName = row["MonthName"].ToString();

                        lstclsMonth.Add(clsMonth);
                    }
                }

                if (dt.Tables[1].Rows.Count > 0)
                {
                    foreach (DataRow row in dt.Tables[1].Rows)
                    {
                        clsCMDelinquency clsCMDelinquency = new clsCMDelinquency();

                        clsCMDelinquency.Segment = row["Segment"].ToString();
                        clsCMDelinquency.Month = row["Month"].ToString();
                        clsCMDelinquency.NOOFAcc = row["NOOFAccCount"].ToString();
                        clsCMDelinquency.Utilization = row["Utilization"].ToString();
                        clsCMDelinquency.Total = row["Total"].ToString();
                        lstclsCMDelinquency.Add(clsCMDelinquency);
                    }
                }

                if (dt.Tables[2].Rows.Count > 0)
                {
                    foreach (DataRow row in dt.Tables[2].Rows)
                    {
                        ActionItem ActionItem = new ActionItem();

                        ActionItem.LSID = row["LSID"].ToString();
                        ActionItem.CustomerName = row["CustomerName"].ToString();
                        ActionItem.Segment = row["Segment"].ToString();
                        ActionItem.PMG = row["PMG"].ToString();
                        ActionItem.SANEXP = row["SANEXP"].ToString();
                        ActionItem.OSEXP = row["OSEXP"].ToString();
                        ActionItem.Overdue = row["Overdue"].ToString();
                        ActionItem.DPD = row["DPD"].ToString();
                        ActionItem.RM = row["RM"].ToString();
                        ActionItem.TH = row["TH"].ToString();
                        lstActionItem.Add(ActionItem);
                    }
                }
                if (dt.Tables[3].Rows.Count > 0)
                {
                    foreach (DataRow row in dt.Tables[3].Rows)
                    {
                        //Summary Summary = new Summary();
                        //Summary.OverDueAccount = row["OverDueAccount"].ToString();
                        //Summary.OverDueAmount = row["OverDueAmount"].ToString();
                        //lstSummary.Add(Summary);

                        clsCMDelinquencyMain.OverDueAccount = row["OverDueAccount"].ToString();
                        clsCMDelinquencyMain.OverDueAmount = row["OverDueAmount"].ToString();
                    }
                }


                if (dt.Tables[4].Rows.Count > 0)
                {
                    foreach (DataRow row in dt.Tables[4].Rows)
                    {
                        clsMonthTotal clsMonthTotal = new clsMonthTotal();

                        clsMonthTotal.MonthName = row["MonthName"].ToString();
                        clsMonthTotal.NoOFAcc = row["NoOFAccount"].ToString();
                        clsMonthTotal.TotalAmount = row["UtilAmount"].ToString();

                        lstclsMonthTotal.Add(clsMonthTotal);
                    }
                }

                if (dt.Tables[5].Rows.Count > 0)
                {
                    foreach (DataRow row in dt.Tables[5].Rows)
                    {
                        clsCode clsColorCode = new clsCode();

                        clsColorCode.Segment = row["Segment"].ToString();
                        clsColorCode.Div = row["Div"].ToString();
                        clsColorCode.BackgroundColor = row["BackgroundColor"].ToString();
                        clsColorCode.HoverBackgroundColor = row["HoverBackgroundColor"].ToString();

                        lstclsColorCode.Add(clsColorCode);
                    }
                }



                clsCMDelinquencyMain.lstLocation = new List<SelectListItem>();

                if (dt.Tables[6].Rows.Count > 0)
                {
                    foreach (DataRow row in dt.Tables[6].Rows)
                    {
                        clsCMDelinquencyMain.lstLocation.Add(
                            new SelectListItem
                            { Text = row["ID"].ToString(), Value = row["Value"].ToString() }
                            );
                    }
                }

                clsCMDelinquencyMain.lstSegment = new List<SelectListItem>();
                if (dt.Tables[7].Rows.Count > 0)
                {
                    foreach (DataRow row in dt.Tables[7].Rows)
                    {
                        clsCMDelinquencyMain.lstSegment.Add(
                            new SelectListItem
                            { Text = row["ID"].ToString(), Value = row["Value"].ToString() }
                            );

                    }
                }


                if (dt.Tables[8].Rows.Count > 0)
                {
                    foreach (DataRow row in dt.Tables[8].Rows)
                    {
                        clsDPDExposure clsDPDExposure = new clsDPDExposure();

                        clsDPDExposure.OverdueAccount = row["NOOFAccCount"].ToString();
                        clsDPDExposure.OverdueAmount = row["Overdue_Amount"].ToString();
                        clsDPDExposure.OverdueExposure = row["Overdue_Exposure"].ToString();
                        clsDPDExposure.Segment = row["Segment"].ToString();
                        clsDPDExposure.DPDPeriod = row["dpd_name"].ToString();
                        lstclsDPDExposure.Add(clsDPDExposure);
                    }
                }

                if (dt.Tables[9].Rows.Count > 0)
                {
                    foreach (DataRow row in dt.Tables[9].Rows)
                    {
                        clsDPDPeriod clsDPDPeriod = new clsDPDPeriod();

                        clsDPDPeriod.DPDPeriodNM = row["DPD_NM"].ToString();

                        lstclsDPDPeriods.Add(clsDPDPeriod);
                    }
                }
                if (dt.Tables[10].Rows.Count > 0)
                {
                    foreach (DataRow row in dt.Tables[10].Rows)
                    {
                        clsMonthTotal clsMonthTotalDDP = new clsMonthTotal();
                        clsMonthTotalDDP.NoOFAcc = row["NOOFAccCount"].ToString();
                        clsMonthTotalDDP.TotalAmount = row["Overdue_Amount"].ToString();
                        clsMonthTotalDDP.TotalExpoAmount = row["Overdue_Exposure"].ToString();
                        clsMonthTotalDDP.Segment = row["Segment"].ToString();
                        lstclsMonthExposure.Add(clsMonthTotalDDP);
                    }
                }


                sqlCon.Close();
            }
            catch (Exception ex)
            {
                if (sqlCon != null)
                    sqlCon.Close();

                if (cmd != null)
                    cmd.Dispose();

                if (sda != null)
                    sda.Dispose();
            }
            finally
            {
                if (sqlCon != null)
                    sqlCon.Close();

                if (cmd != null)
                    cmd.Dispose();

                if (sda != null)
                    sda.Dispose();
            }

            clsCMDelinquencyMain.clsCMDelinquency = lstclsCMDelinquency;
            clsCMDelinquencyMain.ActionItem = lstActionItem;
            clsCMDelinquencyMain.clsMonth = lstclsMonth;
            clsCMDelinquencyMain.clsColorCode = lstclsColorCode;
            clsCMDelinquencyMain.clsMonthTotal = lstclsMonthTotal;
            clsCMDelinquencyMain.clsDPDExposure = lstclsDPDExposure;
            clsCMDelinquencyMain.clsDPDPeriod = lstclsDPDPeriods;
            clsCMDelinquencyMain.clsMonthExposure = lstclsMonthExposure;

            return clsCMDelinquencyMain;
        }

        public clsCMLCHUMain clsCMLCHUMain1(string SelectedSegment, string SelectedLocation, string LSID, string datetime, string EmpID)
        {
            clsCMLCHUMain clsCMLCHUMain = new clsCMLCHUMain();
            if (datetime is null)
            {
                datetime = DateTime.Now.ToString("yyyy-MM-dd");
            }
            DataSet dt = new DataSet();
            DateTime dateTime1 = new DateTime();

            dateTime1 = Convert.ToDateTime(datetime);

            if (!string.IsNullOrEmpty(LSID))
            {
                LSID = LSID.Trim();
            }

            List<clsCMLCHU> lstclsCMLCHU = new List<clsCMLCHU>();
            List<ActionItemLCHU> lstActionItemLCHU = new List<ActionItemLCHU>();
            List<clsMonthLCHU> lstclsMonthLCHU = new List<clsMonthLCHU>();
            List<clsCode> lstclsColorCode = new List<clsCode>();
            List<clsMonthTotalLCHU> lstclsMonthTotalLCHU = new List<clsMonthTotalLCHU>();
            List<clsMonthTotalLCHU> lstclsMonthTotalLCHUExposure = new List<clsMonthTotalLCHU>();
            List<clsDPDExposureLCHU> lstclsDPDExposureLCHU = new List<clsDPDExposureLCHU>();
            List<clsDPDPeriodLCHU> lstclsDPDPeriodLCHU = new List<clsDPDPeriodLCHU>();


            //List<Summary> lstSummary = new List<Summary>();
            try
            {
                //sqlCon = new MySqlConnection(Startup.connectionstring);               
                cmd = new MySqlCommand("SP_OVI_CMLCHU", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@IdentFlag", "CMLCHU");
                //cmd.Parameters.AddWithValue("@CM_Emp_Code", HttpContext.Session.GetString("EmpId"));
                cmd.Parameters.AddWithValue("@CM_Emp_Code", EmpID);
                cmd.Parameters.AddWithValue("@SelectedDate", dateTime1);
                cmd.Parameters.AddWithValue("@SelectedSegment", SelectedSegment);
                cmd.Parameters.AddWithValue("@SelectedLocation", SelectedLocation);
                cmd.Parameters.AddWithValue("@SelectedLSID", LSID);

                if (sqlCon.State == ConnectionState.Closed)
                {
                    sqlCon.Open();
                }
                sda = new MySqlDataAdapter(cmd);
                sda.Fill(dt);
                sqlCon.Close();

                if (dt.Tables[0].Rows.Count > 0)
                {
                    foreach (DataRow row in dt.Tables[0].Rows)
                    {
                        clsMonthLCHU clsMonthLCHU = new clsMonthLCHU();

                        clsMonthLCHU.MonthName = row["MonthName"].ToString();

                        lstclsMonthLCHU.Add(clsMonthLCHU);
                    }
                }

                if (dt.Tables[1].Rows.Count > 0)
                {
                    foreach (DataRow row in dt.Tables[1].Rows)
                    {
                        clsCMLCHU clsCMLCHU = new clsCMLCHU();

                        clsCMLCHU.Segment = row["Segment"].ToString();
                        clsCMLCHU.Month = row["Month"].ToString();
                        clsCMLCHU.NOOFAcc = row["NOOFAccCount"].ToString();
                        clsCMLCHU.Utilization = row["Utilization"].ToString();
                        clsCMLCHU.Total = row["Total"].ToString();
                        lstclsCMLCHU.Add(clsCMLCHU);
                    }
                }

                if (dt.Tables[2].Rows.Count > 0)
                {
                    foreach (DataRow row in dt.Tables[2].Rows)
                    {
                        ActionItemLCHU ActionItemLCHU = new ActionItemLCHU();

                        ActionItemLCHU.LSID = row["LSID"].ToString();
                        ActionItemLCHU.CustomerName = row["CustomerName"].ToString();
                        ActionItemLCHU.Segment = row["Segment"].ToString();
                        ActionItemLCHU.PMG = row["PMG"].ToString();
                        ActionItemLCHU.SANEXP = row["SANEXP"].ToString();
                        ActionItemLCHU.OSEXP = row["OSEXP"].ToString();
                        // ActionItemLCHU.Overdue = row["Overdue"].ToString();
                        ActionItemLCHU.No_of_times_in_LCHU = row["No_of_times_in_LCHU"].ToString();
                        ActionItemLCHU.RM = row["RM"].ToString();
                        ActionItemLCHU.TH = row["TH"].ToString();
                        lstActionItemLCHU.Add(ActionItemLCHU);
                    }
                }
                if (dt.Tables[3].Rows.Count > 0)
                {
                    foreach (DataRow row in dt.Tables[3].Rows)
                    {

                        clsCMLCHUMain.LCHUAccount = row["TotalLCHUAcc"].ToString();
                        clsCMLCHUMain.LCHUAmount = row["TotalLCHUAmount"].ToString();

                    }
                }


                if (dt.Tables[4].Rows.Count > 0)
                {
                    foreach (DataRow row in dt.Tables[4].Rows)
                    {
                        clsMonthTotalLCHU clsMonthTotalLCHU = new clsMonthTotalLCHU();

                        clsMonthTotalLCHU.MonthName = row["Months"].ToString();
                        clsMonthTotalLCHU.NoOFAcc = row["NoOFAccount"].ToString();
                        clsMonthTotalLCHU.TotalAmount = row["UtilAmount"].ToString();

                        lstclsMonthTotalLCHU.Add(clsMonthTotalLCHU);
                    }
                }

                if (dt.Tables[5].Rows.Count > 0)
                {
                    foreach (DataRow row in dt.Tables[5].Rows)
                    {
                        clsCode clsColorCode = new clsCode();

                        clsColorCode.Segment = row["Segment"].ToString();
                        clsColorCode.Div = row["Div"].ToString();
                        clsColorCode.BackgroundColor = row["BackgroundColor"].ToString();
                        clsColorCode.HoverBackgroundColor = row["HoverBackgroundColor"].ToString();

                        lstclsColorCode.Add(clsColorCode);
                    }
                }



                clsCMLCHUMain.lstLocation = new List<SelectListItem>();

                if (dt.Tables[6].Rows.Count > 0)
                {
                    foreach (DataRow row in dt.Tables[6].Rows)
                    {
                        clsCMLCHUMain.lstLocation.Add(
                            new SelectListItem
                            { Text = row["ID"].ToString(), Value = row["Value"].ToString() }
                            );
                    }
                }

                clsCMLCHUMain.lstSegment = new List<SelectListItem>();
                if (dt.Tables[7].Rows.Count > 0)
                {
                    foreach (DataRow row in dt.Tables[7].Rows)
                    {
                        clsCMLCHUMain.lstSegment.Add(
                            new SelectListItem
                            { Text = row["ID"].ToString(), Value = row["Value"].ToString() }
                            );

                    }
                }


                if (dt.Tables[8].Rows.Count > 0)
                {
                    foreach (DataRow row in dt.Tables[8].Rows)
                    {
                        clsDPDExposureLCHU clsDPDExposureLCHU = new clsDPDExposureLCHU();

                        clsDPDExposureLCHU.LCHUAccount = row["NOOFAccCount"].ToString();
                        clsDPDExposureLCHU.LCHUAmount = row["LCHU_Amount"].ToString();
                        clsDPDExposureLCHU.LCHUExposure = row["LCHU_Exposure"].ToString();
                        clsDPDExposureLCHU.Segment = row["Segment"].ToString();
                        clsDPDExposureLCHU.LCHUPeriod = row["LCHU_name"].ToString();
                        lstclsDPDExposureLCHU.Add(clsDPDExposureLCHU);
                    }
                }

                if (dt.Tables[9].Rows.Count > 0)
                {
                    foreach (DataRow row in dt.Tables[9].Rows)
                    {
                        clsDPDPeriodLCHU clsDPDPeriodLCHU = new clsDPDPeriodLCHU();

                        clsDPDPeriodLCHU.DPDPeriodNM = row["LCHU_NM"].ToString();

                        lstclsDPDPeriodLCHU.Add(clsDPDPeriodLCHU);
                    }
                }
                if (dt.Tables[10].Rows.Count > 0)
                {
                    foreach (DataRow row in dt.Tables[10].Rows)
                    {
                        clsMonthTotalLCHU clsMonthTotalLCHUExposure = new clsMonthTotalLCHU();
                        clsMonthTotalLCHUExposure.NoOFAcc = row["NOOFAccCount"].ToString();
                        clsMonthTotalLCHUExposure.TotalAmount = row["LCHU_Amount"].ToString();
                        clsMonthTotalLCHUExposure.TotalExpoAmount = row["LCHU_Exposure"].ToString();
                        clsMonthTotalLCHUExposure.Segment = row["Segment"].ToString();
                        lstclsMonthTotalLCHUExposure.Add(clsMonthTotalLCHUExposure);
                    }
                }


                sqlCon.Close();
            }
            catch (Exception ex)
            {
                if (sqlCon != null)
                    sqlCon.Close();

                if (cmd != null)
                    cmd.Dispose();

                if (sda != null)
                    sda.Dispose();
            }
            finally
            {
                if (sqlCon != null)
                    sqlCon.Close();

                if (cmd != null)
                    cmd.Dispose();

                if (sda != null)
                    sda.Dispose();
            }

            clsCMLCHUMain.clsCMLCHU = lstclsCMLCHU;
            clsCMLCHUMain.ActionItemLCHU = lstActionItemLCHU;
            clsCMLCHUMain.clsMonthLCHU = lstclsMonthLCHU;
            clsCMLCHUMain.clsColorCode = lstclsColorCode;
            clsCMLCHUMain.clsMonthTotalLCHU = lstclsMonthTotalLCHU;
            clsCMLCHUMain.clsDPDExposureLCHU = lstclsDPDExposureLCHU;
            clsCMLCHUMain.clsDPDPeriodLCHU = lstclsDPDPeriodLCHU;
            clsCMLCHUMain.clsMonthTotalLCHUExposure = lstclsMonthTotalLCHUExposure;

            return clsCMLCHUMain;

        }

        public clsCMAURMain clsCMAURMain1(string SelectedSegment, string SelectedLocation, string LSID, string datetime, string EmpID)
        {
            clsCMAURMain clsCMAURMain = new clsCMAURMain();
            if (datetime is null)
            {
                datetime = DateTime.Now.ToString("yyyy-MM-dd");
            }
            DataSet dt = new DataSet();
            DateTime dateTime1 = new DateTime();

            dateTime1 = Convert.ToDateTime(datetime);

            if (!string.IsNullOrEmpty(LSID))
            {
                LSID = LSID.Trim();
            }

            List<clsCMAUR> lstclsCMAUR = new List<clsCMAUR>();
            List<ActionItemAUR> lstActionItemAUR = new List<ActionItemAUR>();
            List<clsMonthAUR> lstclsMonthAUR = new List<clsMonthAUR>();
            List<clsCode> lstclsColorCode = new List<clsCode>();
            List<clsMonthTotalAUR> lstclsMonthTotalAUR = new List<clsMonthTotalAUR>();
            List<clsMonthTotalAUR> lstclsMonthTotalAURExposure = new List<clsMonthTotalAUR>();



            //List<Summary> lstSummary = new List<Summary>();
            try
            {
                //sqlCon = new MySqlConnection(Startup.connectionstring);               
                cmd = new MySqlCommand("SP_OVI_CMAUR", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@IdentFlag", "CMAUR");
                //cmd.Parameters.AddWithValue("@CM_Emp_Code", HttpContext.Session.GetString("EmpId"));
                cmd.Parameters.AddWithValue("@CM_Emp_Code", EmpID);
                cmd.Parameters.AddWithValue("@SelectedDate", dateTime1);
                cmd.Parameters.AddWithValue("@SelectedSegment", SelectedSegment);
                cmd.Parameters.AddWithValue("@SelectedLocation", SelectedLocation);
                cmd.Parameters.AddWithValue("@SelectedLSID", LSID);

                if (sqlCon.State == ConnectionState.Closed)
                {
                    sqlCon.Open();
                }
                sda = new MySqlDataAdapter(cmd);
                sda.Fill(dt);
                sqlCon.Close();

                if (dt.Tables[0].Rows.Count > 0)
                {
                    foreach (DataRow row in dt.Tables[0].Rows)
                    {
                        clsMonthAUR clsMonthAUR = new clsMonthAUR();

                        clsMonthAUR.MonthName = row["MonthName"].ToString();

                        lstclsMonthAUR.Add(clsMonthAUR);
                    }
                }

                if (dt.Tables[1].Rows.Count > 0)
                {
                    foreach (DataRow row in dt.Tables[1].Rows)
                    {
                        clsCMAUR clsCMAUR = new clsCMAUR();

                        clsCMAUR.Segment = row["Segment"].ToString();
                        clsCMAUR.Month = row["Month"].ToString();
                        clsCMAUR.NOOFAcc = row["NOOFAccCount"].ToString();
                        clsCMAUR.Utilization = row["Utilization"].ToString();
                        clsCMAUR.Total = row["Total"].ToString();
                        lstclsCMAUR.Add(clsCMAUR);
                    }
                }

                if (dt.Tables[2].Rows.Count > 0)
                {
                    foreach (DataRow row in dt.Tables[2].Rows)
                    {
                        ActionItemAUR ActionItemAUR = new ActionItemAUR();

                        ActionItemAUR.LSID = row["LSID"].ToString();
                        ActionItemAUR.CustomerName = row["CustomerName"].ToString();
                        ActionItemAUR.Segment = row["Segment"].ToString();
                        ActionItemAUR.PMG = row["PMG"].ToString();
                        ActionItemAUR.SANEXP = row["SANEXP"].ToString();
                        ActionItemAUR.OSEXP = row["OSEXP"].ToString();
                        ActionItemAUR.ReasonforExit = row["ReasonforExit"].ToString();
                        ActionItemAUR.TypeofPlan = row["TypeofPlan"].ToString();
                        ActionItemAUR.PlanStatus = row["PlanStatus"].ToString();
                        ActionItemAUR.PMG = row["PMG"].ToString();
                        ActionItemAUR.RM = row["RM"].ToString();
                        ActionItemAUR.TH = row["TH"].ToString();
                        lstActionItemAUR.Add(ActionItemAUR);
                    }
                }
                if (dt.Tables[3].Rows.Count > 0)
                {
                    foreach (DataRow row in dt.Tables[3].Rows)
                    {

                        clsCMAURMain.AURAccount = row["TotalAURAcc"].ToString();
                        clsCMAURMain.AURAmount = row["TotalAURAmount"].ToString();

                    }
                }


                if (dt.Tables[4].Rows.Count > 0)
                {
                    foreach (DataRow row in dt.Tables[4].Rows)
                    {
                        clsMonthTotalAUR clsMonthTotalAUR = new clsMonthTotalAUR();

                        clsMonthTotalAUR.MonthName = row["Months"].ToString();
                        clsMonthTotalAUR.NoOFAcc = row["NoOFAccount"].ToString();
                        clsMonthTotalAUR.TotalAmount = row["UtilAmount"].ToString();

                        lstclsMonthTotalAUR.Add(clsMonthTotalAUR);
                    }
                }

                if (dt.Tables[5].Rows.Count > 0)
                {
                    foreach (DataRow row in dt.Tables[5].Rows)
                    {
                        clsCode clsColorCode = new clsCode();

                        clsColorCode.Segment = row["Segment"].ToString();
                        clsColorCode.Div = row["Div"].ToString();
                        clsColorCode.BackgroundColor = row["BackgroundColor"].ToString();
                        clsColorCode.HoverBackgroundColor = row["HoverBackgroundColor"].ToString();

                        lstclsColorCode.Add(clsColorCode);
                    }
                }



                clsCMAURMain.lstLocation = new List<SelectListItem>();

                if (dt.Tables[6].Rows.Count > 0)
                {
                    foreach (DataRow row in dt.Tables[6].Rows)
                    {
                        clsCMAURMain.lstLocation.Add(
                            new SelectListItem
                            { Text = row["ID"].ToString(), Value = row["Value"].ToString() }
                            );
                    }
                }

                clsCMAURMain.lstSegment = new List<SelectListItem>();
                if (dt.Tables[7].Rows.Count > 0)
                {
                    foreach (DataRow row in dt.Tables[7].Rows)
                    {
                        clsCMAURMain.lstSegment.Add(
                            new SelectListItem
                            { Text = row["ID"].ToString(), Value = row["Value"].ToString() }
                            );

                    }
                }





                sqlCon.Close();
            }
            catch (Exception ex)
            {
                if (sqlCon != null)
                    sqlCon.Close();

                if (cmd != null)
                    cmd.Dispose();

                if (sda != null)
                    sda.Dispose();
            }
            finally
            {
                if (sqlCon != null)
                    sqlCon.Close();

                if (cmd != null)
                    cmd.Dispose();

                if (sda != null)
                    sda.Dispose();
            }

            clsCMAURMain.clsCMAUR = lstclsCMAUR;
            clsCMAURMain.ActionItemAUR = lstActionItemAUR;
            clsCMAURMain.clsMonthAUR = lstclsMonthAUR;
            clsCMAURMain.clsColorCode = lstclsColorCode;
            clsCMAURMain.clsMonthTotalAUR = lstclsMonthTotalAUR;
            clsCMAURMain.clsMonthTotalAURExposure = lstclsMonthTotalAURExposure;

            return clsCMAURMain;

        }

        public clsCMWatchListMain clsCMWatchListMain1(string SelectedSegment, string SelectedLocation, string LSID, string datetime, string EmpID)
        {
            clsCMWatchListMain clsCMWatchListMain = new clsCMWatchListMain();
            if (datetime is null)
            {
                datetime = DateTime.Now.ToString("yyyy-MM-dd");
            }
            DataSet dt = new DataSet();
            DateTime dateTime1 = new DateTime();

            dateTime1 = Convert.ToDateTime(datetime);

            if (!string.IsNullOrEmpty(LSID))
            {
                LSID = LSID.Trim();
            }

            List<clsCMWatchList> lstclsCMWatchList = new List<clsCMWatchList>();
            List<ActionItemWatchList> lstActionItemWatchList = new List<ActionItemWatchList>();
            List<clsMonthWatchList> lstclsMonthWatchList = new List<clsMonthWatchList>();
            List<clsCode> lstclsColorCode = new List<clsCode>();
            List<clsMonthTotalWatchList> lstclsMonthTotalWatchList = new List<clsMonthTotalWatchList>();
            List<clsMonthTotalWatchList> lstclsMonthTotalWatchListExposure = new List<clsMonthTotalWatchList>();



            //List<Summary> lstSummary = new List<Summary>();
            try
            {
                //sqlCon = new MySqlConnection(Startup.connectionstring);               
                cmd = new MySqlCommand("SP_OVI_CMWatchList", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@IdentFlag", "CMWatchList");
                //cmd.Parameters.AddWithValue("@CM_Emp_Code", HttpContext.Session.GetString("EmpId"));
                cmd.Parameters.AddWithValue("@CM_Emp_Code", EmpID);
                cmd.Parameters.AddWithValue("@SelectedDate", dateTime1);
                cmd.Parameters.AddWithValue("@SelectedSegment", SelectedSegment);
                cmd.Parameters.AddWithValue("@SelectedLocation", SelectedLocation);
                cmd.Parameters.AddWithValue("@SelectedLSID", LSID);

                if (sqlCon.State == ConnectionState.Closed)
                {
                    sqlCon.Open();
                }
                sda = new MySqlDataAdapter(cmd);
                sda.Fill(dt);
                sqlCon.Close();

                if (dt.Tables[0].Rows.Count > 0)
                {
                    foreach (DataRow row in dt.Tables[0].Rows)
                    {
                        clsMonthWatchList clsMonthWatchList = new clsMonthWatchList();

                        clsMonthWatchList.MonthName = row["MonthName"].ToString();

                        lstclsMonthWatchList.Add(clsMonthWatchList);
                    }
                }

                if (dt.Tables[1].Rows.Count > 0)
                {
                    foreach (DataRow row in dt.Tables[1].Rows)
                    {
                        clsCMWatchList clsCMWatchList = new clsCMWatchList();

                        clsCMWatchList.Segment = row["Segment"].ToString();
                        clsCMWatchList.Month = row["Month"].ToString();
                        clsCMWatchList.NOOFAcc = row["NOOFAccCount"].ToString();
                        clsCMWatchList.Utilization = row["Utilization"].ToString();
                        clsCMWatchList.Total = row["Total"].ToString();
                        lstclsCMWatchList.Add(clsCMWatchList);
                    }
                }

                if (dt.Tables[2].Rows.Count > 0)
                {
                    foreach (DataRow row in dt.Tables[2].Rows)
                    {
                        ActionItemWatchList ActionItemWatchList = new ActionItemWatchList();

                        ActionItemWatchList.LSID = row["LSID"].ToString();
                        ActionItemWatchList.CustomerName = row["CustomerName"].ToString();
                        ActionItemWatchList.Segment = row["Segment"].ToString();
                        ActionItemWatchList.PMG = row["PMG"].ToString();
                        ActionItemWatchList.SANEXP = row["SANEXP"].ToString();
                        ActionItemWatchList.OSEXP = row["OSEXP"].ToString();
                        ActionItemWatchList.PMG = row["PMG"].ToString();
                        ActionItemWatchList.RM = row["RM"].ToString();
                        ActionItemWatchList.TH = row["TH"].ToString();
                        lstActionItemWatchList.Add(ActionItemWatchList);
                    }
                }
                if (dt.Tables[3].Rows.Count > 0)
                {
                    foreach (DataRow row in dt.Tables[3].Rows)
                    {

                        clsCMWatchListMain.WatchListAccount = row["TotalWatchListAcc"].ToString();
                        clsCMWatchListMain.WatchListAmount = row["TotalWatchListAmount"].ToString();

                    }
                }


                if (dt.Tables[4].Rows.Count > 0)
                {
                    foreach (DataRow row in dt.Tables[4].Rows)
                    {
                        clsMonthTotalWatchList clsMonthTotalWatchList = new clsMonthTotalWatchList();

                        clsMonthTotalWatchList.MonthName = row["Months"].ToString();
                        clsMonthTotalWatchList.NoOFAcc = row["NoOFAccount"].ToString();
                        clsMonthTotalWatchList.TotalAmount = row["UtilAmount"].ToString();

                        lstclsMonthTotalWatchList.Add(clsMonthTotalWatchList);
                    }
                }

                if (dt.Tables[5].Rows.Count > 0)
                {
                    foreach (DataRow row in dt.Tables[5].Rows)
                    {
                        clsCode clsColorCode = new clsCode();

                        clsColorCode.Segment = row["Segment"].ToString();
                        clsColorCode.Div = row["Div"].ToString();
                        clsColorCode.BackgroundColor = row["BackgroundColor"].ToString();
                        clsColorCode.HoverBackgroundColor = row["HoverBackgroundColor"].ToString();

                        lstclsColorCode.Add(clsColorCode);
                    }
                }



                clsCMWatchListMain.lstLocation = new List<SelectListItem>();

                if (dt.Tables[6].Rows.Count > 0)
                {
                    foreach (DataRow row in dt.Tables[6].Rows)
                    {
                        clsCMWatchListMain.lstLocation.Add(
                            new SelectListItem
                            { Text = row["ID"].ToString(), Value = row["Value"].ToString() }
                            );
                    }
                }

                clsCMWatchListMain.lstSegment = new List<SelectListItem>();
                if (dt.Tables[7].Rows.Count > 0)
                {
                    foreach (DataRow row in dt.Tables[7].Rows)
                    {
                        clsCMWatchListMain.lstSegment.Add(
                            new SelectListItem
                            { Text = row["ID"].ToString(), Value = row["Value"].ToString() }
                            );

                    }
                }





                sqlCon.Close();
            }
            catch (Exception ex)
            {
                if (sqlCon != null)
                    sqlCon.Close();

                if (cmd != null)
                    cmd.Dispose();

                if (sda != null)
                    sda.Dispose();
            }
            finally
            {
                if (sqlCon != null)
                    sqlCon.Close();

                if (cmd != null)
                    cmd.Dispose();

                if (sda != null)
                    sda.Dispose();
            }

            clsCMWatchListMain.clsCMWatchList = lstclsCMWatchList;
            clsCMWatchListMain.ActionItemWatchList = lstActionItemWatchList;
            clsCMWatchListMain.clsMonthWatchList = lstclsMonthWatchList;
            clsCMWatchListMain.clsColorCode = lstclsColorCode;
            clsCMWatchListMain.clsMonthTotalWatchList = lstclsMonthTotalWatchList;
            clsCMWatchListMain.clsMonthTotalWatchListExposure = lstclsMonthTotalWatchListExposure;

            return clsCMWatchListMain;

        }

        public string Get_PMS_Link(string Type, string ServerName)
        {
            string Link = "";
            try
            {

                DataTable dt = new DataTable();
                cmd = new MySqlCommand("SP_OVI_Get_Links", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Type", Type);
                cmd.Parameters.AddWithValue("@ServerType", ServerName);
                if (sqlCon.State == ConnectionState.Closed)
                {
                    sqlCon.Open();
                }
                sda = new MySqlDataAdapter(cmd);
                sda.Fill(dt);
                sqlCon.Close();
                if (dt.Rows.Count > 0)
                {
                    Link = dt.Rows[0]["Link"].ToString();
                }
            }
            catch (Exception ex)
            {
                if (sqlCon != null)
                    sqlCon.Close();

                if (cmd != null)
                    cmd.Dispose();

                if (sda != null)
                    sda.Dispose();
            }
            finally
            {
                if (sqlCon != null)
                    sqlCon.Close();

                if (cmd != null)
                    cmd.Dispose();

                if (sda != null)
                    sda.Dispose();
            }
            return Link;
        }

    }
    class Global
    {
        public static string LoginUrl;
    }

    public class DelinquencyDaysCount
    {
        public string Days_15 { get; set; }
        public string Days_30 { get; set; }
        public string Days_60 { get; set; }
        public string Items { get; set; }
        public int No { get; set; }
        public double Percent { get; set; }
        public double Value { get; set; }
        public string UploadedDate { get; set; }
    }

    public class Compliance
    {
        public string ComplianceItem { get; set; }
        public int ItemCount { get; set; }
        public string ItemDate { get; set; }
    }

    public class feedback
    {
        public string UI { get; set; }
        public string Performance { get; set; }
        public string Userfreindly { get; set; }
        public string Experience { get; set; }
        public string Revelvance { get; set; }
        public string Remarks { get; set; }
        public string Modules { get; set; }
    }

    public class feedbackPageList
    {
        public long ModuleID { get; set; }
        public string ModuleName { get; set; }
    }

    public class clsCode
    {
        public string Segment { get; set; }
        public string Div { get; set; }
        public string BackgroundColor { get; set; }
        public string HoverBackgroundColor { get; set; }

        public string FileName { get; set; }
    }
    public class PortfolioSummary
    {
        public string LSID { get; set; }
        public string Name { get; set; }
        public string Segment { get; set; }
        public string City { get; set; }
        public string State { get; set; }

        [BindProperty(Name = "Exposure(In L)")]
        public string Exposure { get; set; }

        public string RM { get; set; }
        public string CAM { get; set; }

    }
    public class clsDashboardVariable
    {
        public string EmployeeCode { get; set; }
        public string Date { get; set; }
        public string FilterId { get; set; }
        public string Type { get; set; }
    }
    public class clsMonthList
    {
        public string monthName { get; set; }
    }

    public class clsLCHU
    {
        public List<clsMonthList> clsMonthList { get; set; }
        public List<clsPortfolio> clsPortfolio { get; set; }
        public List<clsCode> clsCode { get; set; }

        public List<clsPortfolio> clsPortfolioTotal { get; set; }

    }
    public class clsHouskeeping
    {
        public string Segment { get; set; }
        public string sCount { get; set; }
        public string FileName1 { get; set; }
        public string Div { get; set; }
        public string BackgroundColor { get; set; }
        public string HoverBackgroundColor { get; set; }

    }

    public class clsHouskeepingMain
    {
        public List<clsHouskeeping> clsHouskeeping { get; set; }
        public List<clsCode> clsCode { get; set; }
    }
    public class CommonClass
    {
        MySqlCommand cmd;
        public void SaveLog(LogClass logClass)
        {
            MySqlConnection sqlCon1 = new MySqlConnection(clsConnectionString.GetConnectionString());

            cmd = new MySqlCommand("SP_OVI_Log", sqlCon1);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.Add("@CustomerId", MySqlDbType.Int32).Value = logClass.CustomerId;
            cmd.Parameters.Add("@MasterId", MySqlDbType.VarChar).Value = logClass.MasterId;
            cmd.Parameters.Add("@Activity", MySqlDbType.VarChar).Value = logClass.Activity;
            cmd.Parameters.Add("@ActionBy", MySqlDbType.VarChar).Value = logClass.ActionBy;
            cmd.Parameters.Add("@ActionStatus", MySqlDbType.Int32).Value = logClass.ActionStatus;
            cmd.Parameters.Add("@Description", MySqlDbType.VarChar).Value = logClass.Description;
            cmd.Parameters.Add("@ErrorDescription", MySqlDbType.VarChar).Value = logClass.ErrorDescription;
            cmd.Parameters.Add("@Remark", MySqlDbType.VarChar).Value = logClass.Remark;

            if (cmd.Connection.State == ConnectionState.Closed)
                cmd.Connection.Open();
            cmd.ExecuteNonQuery();
            cmd.Connection.Close();
            sqlCon1.Close();
        }
    }
    public class LogClass
    {
        public int CustomerId { get; set; }
        public string MasterId { get; set; }
        public string Activity { get; set; }
        public string ActionBy { get; set; }
        public DateTime ActionDate { get; set; }
        public int ActionStatus { get; set; }
        public string Description { get; set; }
        public string ErrorDescription { get; set; }
        public string Remark { get; set; }
    }

    public class AssetPricing
    {
        public Int32 CustomerId { get; set; }
        public string CustomerName { get; set; }
        public Int32 IsPSL { get; set; }
        public string PSLType { get; set; }
        public Int32 IsWeakerSection { get; set; }
        public Int32 Is_Importer_Exporter { get; set; }
        public string Importer_Exporter_Type { get; set; }
        public Int32 Multiple_Banking { get; set; }
        public string IEC_No { get; set; }
        public string Avg_Import_Volume { get; set; }
        public string Overdue_IDPMS { get; set; }
        public string Overdue_EDPMS { get; set; }
        public string MTT_Transactions { get; set; }
        public string Justification { get; set; }
        public string RAROC { get; set; }
        public string APR_PFY { get; set; }
        public string APR_YTD { get; set; }
        public string Vintage { get; set; }
        public string CommercialType { get; set; }
        public string CustomerType { get; set; }
        public string FacilityType { get; set; }
        public string ExistingAmount { get; set; }
        public string ProposedAmount { get; set; }
        public string ExistingPrice { get; set; }
        public string ProposedPrice { get; set; }
        public string Fb_Nfb { get; set; }
        public string Instruction { get; set; }
        public string FileName { get; set; }
        public IFormFile file { get; set; }
        public string ChargesType { get; set; }
        public string SecurityType { get; set; }
        public string SecurityDescription { get; set; }
        public string SecurityOwner { get; set; }
        public float SecurityValue { get; set; }
        public string BankName { get; set; }
        public float Sanctioned_Amt { get; set; }
        public float Outstanding_Amt { get; set; }
        public string ROI { get; set; }
        public int IsPromoter { get; set; }
        public string Promoter_Name { get; set; }
        public string Promoter_Type { get; set; }
        public string RelationshipWith { get; set; }
        public string RelationshipName { get; set; }
        public int IsAcccount { get; set; }
        public string AccountNumber { get; set; }
        public string ApproverADID { get; set; }
        public int LevelNumber { get; set; }
        public string StrLevelNumber { get; set; }
        public int Status { get; set; }
        public string StrStatus { get; set; }
        public int RowId { get; set; }
        public int Asset_Pricing_CustomerId { get; set; }
        public string Action { get; set; }
        public string Remark { get; set; }
        public string CTI { get; set; }
        public string Limit { get; set; }
        public int ProposalNumber { get; set; }
        public int ClientId { get; set; }

        public string NatureofReversal { get; set; }
        public float AmountofReversal { get; set; }
        public float Limit_OS { get; set; }
        public float Actual_Int { get; set; }
        public float Penal_Int_Amount { get; set; }
        public int NoOfDays { get; set; }
        public DateTime From_Date { get; set; }
        public DateTime To_Date { get; set; }
        public string ExistingCustomerName { get; set; }
        public string ProductCode { get; set; }
        public string APRCode { get; set; }
        public string WaiverType { get; set; }
        public int WaiverValues { get; set; }
        public int TxnNumber { get; set; }
        public string AMBCommitment { get; set; }
        public int ApprovalNo { get; set; }
        public int IsFTB { get; set; }
        public int CreditProtectWaived { get; set; }
    }
    public class MessageModel
    {
        public string Msg { get; set; }
        public string isSuccess { get; set; }

        public int id { get; set; }

        public int Status { get; set; }

        public string fileName { get; set; }
    }
    public class MyAppException : Exception
    {
        public MyAppException()
        { }

        public MyAppException(string message)
            : base(message)
        { }

        public MyAppException(string message, Exception innerException)
            : base(message, innerException)
        { }
    }
    public class TradePricing
    {
        public string CustomerName { get; set; }
        public string PanNo { get; set; }
        public string CustomerType { get; set; }
        public string TradeType { get; set; }
        public int CustomerId { get; set; }
        public int Pricing_Item_Master_ID { get; set; }
        public string PricingCategory { get; set; }
        public string Charges_Commission { get; set; }
        public string StandardPricing { get; set; }
        public string ExistingPrice { get; set; }
        public string ProposedPrice { get; set; }
        public string Remark { get; set; }
        public string ApproverADID { get; set; }
        public string Action { get; set; }

        public string SubmitType { get; set; }
        public string APR_PFY { get; set; }
        public string APR_YTD { get; set; }
        public string Vintage { get; set; }

        public string ProposalNumber { get; set; }
        public string ClientId { get; set; }
        public string APRCode { get; set; }
    }
    public class Home
    {
        public Month drp_Month { get; set; }

        public string Psl { get; set; }


    }
    public class Student
    {
        public IList<Student> studentList { get; set; }
        public string StudentName { get; set; }
    }

    public enum Month
    {
        January, February, march
    }
    public class Clients
    {
        public List<Clients> clients { get; set; }
        public string CustomerName { get; set; }
        public int IPNumber { get; set; }
        public string InitiatedBy { get; set; }
        public string SentTo { get; set; }
        public string Remarks { get; set; }
        public string Status { get; set; }
        public string Date { get; set; }
    }
    public class FacilityDetails
    {
        public List<FacilityDetails> grd_FacilityDetails { get; set; }
        public string Amount { get; set; }
        public string Pricing { get; set; }

    }
    public enum Facility
    {

    }
    public class PortfolioCount
    {
        public List<PortfolioCount> PortfolioRecords { get; set; }
        public string FB_Limits { get; set; }
        public string NFB_Limits { get; set; }
        public string FB_Os { get; set; }
        public string NFB_Os { get; set; }
        public string Total_Limits { get; set; }
        public string Total_Os { get; set; }
        public string Clients_count { get; set; }
        public string APRs_count { get; set; }



    }
    public class Portfolio
    {
        public List<SelectListItem> FileType { get; set; }

        [DefaultValue(0)]
        public string FB_Limits { get; set; }
        public string NFB_Limits { get; set; }
        public string FB_Os { get; set; }
        public string NFB_Os { get; set; }
        public string Total_Limits { get; set; }
        public string Total_Os { get; set; }
        public string Clients_count { get; set; }
        public string APRs_count { get; set; }

        public string FB_Percentage { get; set; }

        public string NFB_percentage { get; set; }
        public string Total_percentage { get; set; }
        public string Fresh_Leads { get; set; }
        public string UploadedDate { get; set; }
    }
    public class UrgentBulletin
    {
        public string Subject { get; set; }

        public string Body { get; set; }
        public IFormFile txtUpload { get; set; }

        public DateTime ExpiryDate { get; set; }
        public DateTime FromDate { get; set; }

        public string Recipients { get; set; }
        public string Business { get; set; }

        public string FileName { get; set; }

        public IEnumerable<UrgentBulletin> Bulletin { get; set; }

        public int BulltinId { get; set; }
        public string From_date { get; set; }
        public string Create_date { get; set; }
        public string EmpRole { get; set; }
        public string EmpName { get; set; }
        public int Bulletine_Count { get; set; }

    }
    public class clsTopSearch
    {
        public string ClientID { get; set; }
        public string CustName { get; set; }
    }
    public class sessionClass
    {
        public bool sessionValue { get; set; }
    }
    public class DBClass
    {
        public string AppInId { get; set; }
        public string sDBVaultId { get; set; }
        public string userid { get; set; }
        public int ItgrcCode { get; set; }
        public string[] sValues { get; set; }
        public string LoginId { get; set; }
        public string APIMethod { get; set; }
    }
    public class QuickLink
    {
        public Int32 recordId { get; set; }
        public string urlName { get; set; }
        public string urlLink { get; set; }
        public string description { get; set; }
    }
}
