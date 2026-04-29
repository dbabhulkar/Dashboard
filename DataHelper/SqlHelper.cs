using Dashboard.Models;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using System.Data;

namespace Dashboard.DataHelper
{
    public class SqlHelper : ControllerBase
    {
        public static MySqlConnection con;

        /*   --------   Common Sql Object Implementaion --------------------------  */
        //-- code to get a open connection object
        public static MySqlConnection openCon()
        {
            string str = clsConnectionString.GetConnectionString();
            con = new MySqlConnection(str);
            if (con.State == System.Data.ConnectionState.Closed)
            {
                con.Open();
            }
            return con;
        }

        //-- code to make sure to close connection and dispose the object
        public static void closeCon()
        {
            if (con.State == System.Data.ConnectionState.Open)
                con.Close();
            con.Dispose();
        }

        //-- code to get a connection object
        public static MySqlConnection GetConnection()
        {
            string str = clsConnectionString.GetConnectionString();
            con = new MySqlConnection(str);
            con.Open();
            return con;
        }

        //-- prepares MySqlCommand object
        public static MySqlCommand PrepareCommand(string sp, Dictionary<string, string> Parameters)
        {
            MySqlCommand cmd = new MySqlCommand(sp, con);
            cmd.CommandType = CommandType.StoredProcedure;
            if (null != Parameters)
            {
                foreach (var item in Parameters)
                    cmd.Parameters.Add(new MySqlParameter(item.Key, item.Value));
            }
            return cmd;
        }


        /*   --------   Common Sql Object Implementaion End--------------------------  */


        /*   --------   Common Methods --------------------------  */
        public DataTable TestExecuteCommand()
        {

            DataTable dt = new DataTable();


            return dt;
        }

        public DataTable ExecuteCommand(string sp, Dictionary<string, string> Parameters)
        {
            MySqlCommand cmd = new MySqlCommand(sp, con);
            DataTable dt = new DataTable();
            cmd.CommandType = CommandType.StoredProcedure;
            if (null != Parameters)
            {
                foreach (var item in Parameters)
                    cmd.Parameters.Add(new MySqlParameter(item.Key, item.Value));
            }
            MySqlDataAdapter sdp = new MySqlDataAdapter(cmd);
            sdp.Fill(dt);

            return dt;
        }

        public static DataTable ExecuteCommandwithoutParam(MySqlCommand cmd)
        {
            openCon();
            DataTable dt = new DataTable();
            MySqlDataAdapter sdp = new MySqlDataAdapter(cmd);
            try
            {
                cmd.CommandType = CommandType.StoredProcedure;
                sdp.Fill(dt);
            }
            catch (Exception ex)
            {

            }
            finally
            {
                closeCon();
                dt.Dispose();
                sdp.Dispose();
                cmd.Dispose();
            }
            return dt;
        }



        public static DataTable getMenuList(string spName)
        {
            openCon();
            DataTable dt = new DataTable();
            MySqlCommand cmd = new MySqlCommand(spName, con);
            MySqlDataAdapter sdp = new MySqlDataAdapter(cmd);
            try
            {
                cmd.CommandType = CommandType.StoredProcedure;
                sdp.Fill(dt);
            }
            catch (Exception ex)
            {

            }
            finally
            {
                closeCon();
                dt.Dispose();
                sdp.Dispose();
                cmd.Dispose();
            }
            return dt;
        }

        public string Upload_Excel(string filePath, string tableName)
        {
            string errorMsg = string.Empty;
            DataTable dt1 = new DataTable();
            try
            {
                DataTable dt = new DataTable();
                //MySqlConnection sqlCon = sqlconn;

                string[] columns = null;

                var lines = System.IO.File.ReadAllLines(filePath);
                if (lines.Count() > 0)
                {
                    columns = lines[0].Split(new char[] { '|' }); foreach (var column in columns)
                        dt.Columns.Add(column);
                }
                for (int i = 1; i < lines.Count(); i++)
                {
                    DataRow dr = dt.NewRow();
                    string[] values = lines[i].Split(new char[] { '|' }); for (int j = 0; j < values.Count() && j < columns.Count(); j++)
                        dr[j] = values[j].Replace("'", "");
                    dt.Rows.Add(dr);
                }


                DataColumn dc = new DataColumn("CreatedOn");
                dc.DataType = typeof(DateTime);
                dc.DefaultValue = DateTime.Now;
                dt.Columns.Add(dc);
                openCon();
                var bulkCopy = new MySqlBulkCopy(con);
                bulkCopy.DestinationTableName = tableName;
                int a = dt.Rows.Count;
                bulkCopy.WriteToServer(dt);
                closeCon();
                if (dt.Rows.Count > 0)
                {
                    return "File Uploaded Successfully";
                }
                return "File Uploaded Successfully";

            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("The given value of type String from the data source cannot be converted to type int of the specified target column"))
                {
                    return "There seems to be a column missing from the file. Please check and upload again.";
                }
                else if (ex.Message.Contains("The given ColumnMapping does not match up with any column in the source or destination."))
                {
                    return "The sequence of the column seems to be out of order. Please check the sample file and upload again.";
                }
                else if (ex.Message.Contains("The given value of type String from the data source cannot be converted to type date of the specified target column."))
                {
                    return "Please upload a valid Pipe'|' seperated file.";
                }
                else
                {
                    return ex.Message.ToString();
                }
            }
        }
    }
}