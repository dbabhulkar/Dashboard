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
            return AppConfiguration.GetConnectionString();
        }
    }
}
