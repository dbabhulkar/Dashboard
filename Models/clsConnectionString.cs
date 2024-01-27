namespace Dashboard.Models
{
    public class clsConnectionString
    {
        public static int ITGRCCode = 1498634;
        public static string[] sValues = new[] { "App_Web", "OneViewIndicator" };
        public static string NewDbVaultIdMail = "iAqVthouwQjXoc3FRUUEhQ==";
        public static string NewDbVaultId = "gTGE/RRRz2ocdWgCJYJjsg==";


        public static string GetConnectionString()
        {
            string result = string.Empty;

            //UAT ConString
            result = "Data Source = DESKTOP-D2NU5KD\\SQLEXPRESS; Database = DashBoard; Integrated Security=SSPI;";

            //Live ConString
            //result = ConnectionDB.getConString("1408481", string.Empty, "gTGE/RRRz2ocdWgCJYJjsg==");

            //result=result+ "Column Encryption Setting = enabled";
            return result;
        }
    }
}
