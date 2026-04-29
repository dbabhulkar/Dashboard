using Dashboard.Models;
using MySqlConnector;
using System.Data;

namespace Dashboard.Repositories
{
    public class MailRepository
    {
        MySqlCommand cmd;
        private MySqlConnection sqlconn;
        public static string[] sValues = new[] { "App_Web", "ThinkTank" };
        public static int ITGRCCode = 997003;
        public static string loginID;
        public static string NewDbVaultId = "U5EokPqGwwv+FXX3sb0WnA==";
        public string SendMail(DataSet ds)
        {
            sendMail MailParameters = new sendMail();
            string result = string.Empty;
            string[] sValues = new[] { "App_Exe", "OneviewIndicator" };

            try
            {

                MailParameters.dataClass = new DataClass();
                MailParameters.From = "InterimSolutionGroup@hdfcbank.com";
                MailParameters.To = ds.Tables[0].Rows[0]["ReceipientEmail"].ToString();
                DataColumnCollection columns = ds.Tables[0].Columns;
                if (columns.Contains("CCEmailId"))
                {
                    MailParameters.CCMail = ds.Tables[0].Rows[0]["RM_Email"].ToString() + "," + ds.Tables[0].Rows[0]["CCEmailId"].ToString();
                }
                else
                {
                    MailParameters.CCMail = ds.Tables[0].Rows[0]["RM_Email"].ToString();
                }

                MailParameters.Body = ds.Tables[1].Rows[0]["Body"].ToString();
                MailParameters.Subject = ds.Tables[1].Rows[0]["Subject"].ToString();
                MailParameters.applicationname = ds.Tables[1].Rows[0]["ApplicationName"].ToString();
                MailParameters.StandardDisplay = ds.Tables[1].Rows[0]["StandardDisplay"].ToString();
                MailParameters.From = ds.Tables[1].Rows[0]["From"].ToString();

                string conStringSMTP_Attachment = ConnectionDB.getConString("1408481", string.Empty, "zMWOpB3jCjLJzCpaF2nWKg==") /*VaultAPI_Live.DBConnection.GetDBVault("zMWOpB3jCjLJzCpaF2nWKg==", 1408481, "", sValues)*/;
                MySqlConnection sqlconn = new MySqlConnection(conStringSMTP_Attachment);

                cmd = new MySqlCommand("SP_MAIL_SAVE", sqlconn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@p_RecEmailAddress", MySqlDbType.VarChar).Value = MailParameters.To;
                cmd.Parameters.Add("@p_From", MySqlDbType.VarChar).Value = MailParameters.From;
                cmd.Parameters.Add("@p_Subject", MySqlDbType.VarChar).Value = MailParameters.Subject;
                cmd.Parameters.Add("@p_Body", MySqlDbType.VarChar).Value = MailParameters.Body;
                cmd.Parameters.Add("@p_strDisplay", MySqlDbType.VarChar).Value = MailParameters.StandardDisplay;
                cmd.Parameters.Add("@p_cc", MySqlDbType.VarChar).Value = MailParameters.CCMail;
                cmd.Parameters.Add("@p_bcc", MySqlDbType.VarChar).Value = "";
                cmd.Parameters.Add("@p_ApplicationName", MySqlDbType.VarChar).Value = MailParameters.applicationname;
                if (cmd.Connection.State == ConnectionState.Closed)
                    cmd.Connection.Open();
                cmd.ExecuteNonQuery();
                cmd.Connection.Close();
                sqlconn.Close();


                MySqlConnection sqlCon1 = new MySqlConnection(clsConnectionString.GetConnectionString());

                cmd = new MySqlCommand("SP_OVI_EmailLog", sqlCon1);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@Subject", MySqlDbType.VarChar).Value = MailParameters.Subject;
                cmd.Parameters.Add("@Body", MySqlDbType.VarChar).Value = MailParameters.Body;
                cmd.Parameters.Add("@From", MySqlDbType.VarChar).Value = MailParameters.From;
                cmd.Parameters.Add("@To", MySqlDbType.VarChar).Value = MailParameters.To;
                cmd.Parameters.Add("@CC", MySqlDbType.VarChar).Value = MailParameters.CCMail;
                cmd.Parameters.Add("@BCC", MySqlDbType.VarChar).Value = "";
                cmd.Parameters.Add("@Status", MySqlDbType.VarChar).Value = "Success";
                cmd.Parameters.Add("@Description", MySqlDbType.VarChar).Value = "Successfully Send";

                if (cmd.Connection.State == ConnectionState.Closed)
                    cmd.Connection.Open();
                cmd.ExecuteNonQuery();
                cmd.Connection.Close();
                sqlCon1.Close();

                result = "Success";

            }
            catch (Exception ex)
            {
                MySqlConnection sqlCon1 = new MySqlConnection(clsConnectionString.GetConnectionString());
                cmd = new MySqlCommand("SP_OVI_EmailLog", sqlCon1);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@Subject", MySqlDbType.VarChar).Value = MailParameters.Subject;
                cmd.Parameters.Add("@Body", MySqlDbType.VarChar).Value = MailParameters.Body;
                cmd.Parameters.Add("@From", MySqlDbType.VarChar).Value = MailParameters.From;
                cmd.Parameters.Add("@To", MySqlDbType.VarChar).Value = MailParameters.To;
                cmd.Parameters.Add("@CC", MySqlDbType.VarChar).Value = MailParameters.CCMail;
                cmd.Parameters.Add("@BCC", MySqlDbType.VarChar).Value = "";
                cmd.Parameters.Add("@Status", MySqlDbType.VarChar).Value = "Failed";
                cmd.Parameters.Add("@Description", MySqlDbType.VarChar).Value = ex.Message;

                if (cmd.Connection.State == ConnectionState.Closed)
                    cmd.Connection.Open();
                cmd.ExecuteNonQuery();
                cmd.Connection.Close();
                sqlCon1.Close();

                result = ex.Message;
            }

            return result;
        }
    }
}
