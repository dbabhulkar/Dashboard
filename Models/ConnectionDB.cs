using Dashboard.Controllers;
using Nancy.Json;
using Newtonsoft.Json;
using System.Net;
using System.Net.Security;
using System.Security.Cryptography;
using System.Text;

namespace Dashboard.Models
{
    public class ConnectionDB
    {
        #region Prameters Value
        public static string key = "COE-IHA";
        static string[] sValues = new[] { "App_Exe", "One View Indicator" };
        static int ItgrcCode = 1498634;
        static string AppInId = "ISG0000434";
        static string sDBVaultId = "gTGE/RRRz2ocdWgCJYJjsg==";

        #endregion

        #region DBConnection

        public static string getConString(string StrItgrc, string StrEmpCode, string StrDBId)
        {
            DBParmaeter p = new DBParmaeter();
            p.Itgrc = StrItgrc;
            p.EmpCode = StrEmpCode;
            p.DBId = StrDBId;
            p.sValues = sValues;

            string result = string.Empty;
            try
            {
                string sAPIUrl1 = "https://btgrvaultdb1.hbctxdom.com:8003/DBVault_API/api/";

                // DBParmaeter dBParmaeter = new DBParmaeter { DBId = "EHsPGddf+dCX/6an/nPNYQ==", Itgrc = "12345687", Connection = null, EmpCode = "T2533", sValues = sValues };
                ServicePointManager.ServerCertificateValidationCallback = new RemoteCertificateValidationCallback(delegate { return true; });
                if (System.Net.ServicePointManager.SecurityProtocol == (SecurityProtocolType.Ssl3 | SecurityProtocolType.Tls))
                    System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12;
                var data = (new JavaScriptSerializer()).Serialize(p);
                var dataString = JsonConvert.SerializeObject(data);
                using (var client1 = new WebClient())
                {
                    client1.Headers.Add("Authorization", "okdeAowoeyHj9eHF4Mf8gA==");
                    //client1.Headers.Add("Authorization", Authorization);
                    client1.Headers.Add(System.Net.HttpRequestHeader.ContentType, "application/json");
                    var svalue = client1.UploadString(new Uri(sAPIUrl1 + "DBVault/GetConnectionQuery"), "POST", data).ToString();
                    var data1 = JsonConvert.DeserializeObject<object>(svalue);
                    p = JsonConvert.DeserializeObject<DBParmaeter>(svalue);
                    result = Decrypt(p.Connection); 
                }
            }
            catch (Exception ex)
            {
                string sAPIUrl1 = "https://btgrvaultapp.hbctxdom.com:8001/DBVault_API/api/";
                var data = (new JavaScriptSerializer()).Serialize(p);
                var dataString = JsonConvert.SerializeObject(data);
                using (var client1 = new WebClient())
                {
                    client1.Headers.Add("Authorization", "okdeAowoeyHj9eHF4Mf8gA==");
                    //client1.Headers.Add("Authorization", Authorization);
                    client1.Headers.Add(System.Net.HttpRequestHeader.ContentType, "application/json");
                    var svalue = client1.UploadString(new Uri(sAPIUrl1 + "DBVault/GetConnectionQuery"), "POST", data).ToString();
                    var data1 = JsonConvert.DeserializeObject<object>(svalue);
                    p = JsonConvert.DeserializeObject<DBParmaeter>(svalue);
                    result = Decrypt(p.Connection);
                }
            }
            return result;
        }

        public class DBParmaeter
        {
            public string DBId { get; set; }
            public string Itgrc { get; set; }
            public string Connection { get; set; }
            public string EmpCode { get; set; }
            public string[] sValues { get; set; }
        }

        #endregion
        #region Update Login Details

        public static string LoginUpdate(DBClass dBClass)
        {
            dBClass.AppInId = AppInId;
            dBClass.ItgrcCode = ItgrcCode;
            dBClass.sValues = sValues;
            dBClass.sDBVaultId = sDBVaultId;

            string result = string.Empty;
            try
            {
                string url = string.Format("{0}", "https://10.226.84.14:9005/VaultAPIDotnetCore/api/API/" + dBClass.APIMethod + "");
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
                request.Method = "POST";
                request.ContentType = "application/Json";
                string output = JsonConvert.SerializeObject(dBClass); ;
                ASCIIEncoding encoding = new ASCIIEncoding();
                byte[] byte1 = encoding.GetBytes(output);
                request.ContentLength = byte1.Length;
                Stream requestStream = request.GetRequestStream();
                requestStream.Write(byte1, 0, byte1.Length);
                requestStream.Close();
                HttpWebResponse webresponse = (HttpWebResponse)request.GetResponse();
                Encoding enc = System.Text.Encoding.GetEncoding("utf-8");
                StreamReader responseStream = new StreamReader(webresponse.GetResponseStream(), enc);
                result = responseStream.ReadToEnd();
                result = JsonConvert.DeserializeObject(result).ToString();
                webresponse.Close();

            }
            catch (Exception ex)
            {
                result = ex.Message;
            }

            return result;
        }

        #endregion
        #region Crypto

        public static string Decrypt(string data)
        {
            string decData = null;
            byte[][] keys = GetHashKeys(key);

            try
            {
                decData = DecryptStringFromBytes_Aes(data, keys[0], keys[1]);
            }
            catch (CryptographicException) { }
            catch (ArgumentNullException) { }

            return decData;
        }

        private static byte[][] GetHashKeys(string key)
        {
            byte[][] result = new byte[2][];
            Encoding enc = Encoding.UTF8;

            SHA256 sha2 = new SHA256CryptoServiceProvider();

            byte[] rawKey = enc.GetBytes(key);
            byte[] rawIV = enc.GetBytes(key);

            byte[] hashKey = sha2.ComputeHash(rawKey);
            byte[] hashIV = sha2.ComputeHash(rawIV);

            Array.Resize(ref hashIV, 16);

            result[0] = hashKey;
            result[1] = hashIV;

            return result;
        }
        private static string DecryptStringFromBytes_Aes(string cipherTextString, byte[] Key, byte[] IV)
        {
            byte[] cipherText = Convert.FromBase64String(cipherTextString);

            if (cipherText == null || cipherText.Length <= 0)
                throw new ArgumentNullException("cipherText");
            if (Key == null || Key.Length <= 0)
                throw new ArgumentNullException("Key");
            if (IV == null || IV.Length <= 0)
                throw new ArgumentNullException("IV");

            string plaintext = null;

            using (Aes aesAlg = Aes.Create())
            {
                aesAlg.Key = Key;
                aesAlg.IV = IV;

                ICryptoTransform decryptor = aesAlg.CreateDecryptor(aesAlg.Key, aesAlg.IV);

                using (MemoryStream msDecrypt = new MemoryStream(cipherText))
                {
                    using (CryptoStream csDecrypt =
                            new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                    {
                        using (StreamReader srDecrypt = new StreamReader(csDecrypt))
                        {
                            plaintext = srDecrypt.ReadToEnd();
                        }
                    }
                }
            }
            return plaintext;
        }


        #endregion
    }
}
