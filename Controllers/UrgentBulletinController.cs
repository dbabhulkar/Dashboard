using Dashboard.DataHelper;
using Dashboard.Models;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;

namespace Dashboard.Controllers
{
    public class UrgentBulletinController : Controller
    {
        readonly ILogger _logger;
        public UrgentBulletinController(ILogger<ErrorController> logger) => _logger = logger;
        SqlConnection sqlCon = new SqlConnection(clsConnectionString.GetConnectionString());

        //SqlConnection sqlCon = SqlHelper.openCon();
        [HttpGet, CustomFilter]
        public IActionResult CreateBulletin()
        {
            return View();
        }

        public async Task<JsonResult> Create(UrgentBulletin formResponse)
        {
            MessageModel message = new MessageModel();
            string subject = formResponse.Subject;
            string body = formResponse.Body;
            string business = formResponse.Business;
            //DateTime From_date = Convert.ToDateTime(formResponse.FromDate);
            DateTime expiry_date = Convert.ToDateTime(formResponse.ExpiryDate);
            string Recipients = formResponse.Recipients;
            string IdentFlag = "UploadBulletin";
            //string filename = Filename;
            int bulletin_id = UploadBulletin(subject, expiry_date, Recipients, IdentFlag, body, business);
            if (Request.Form.Files.Count > 0)
            {
                //string filename = Path.GetFileName(HttpContext.Request.Form.Files[0].FileName);
                var basePath = Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot\UrgentBulletin");
                bool basePathExists = System.IO.Directory.Exists(basePath);
                if (!basePathExists) Directory.CreateDirectory(basePath);
                string filename = Request.Form.Files[0].FileName;
                string updated_file_name = bulletin_id + "_" + filename;
                var filePath = Path.Combine(basePath, updated_file_name);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await Request.Form.Files[0].CopyToAsync(stream);
                }

                //using (FileStream fs = System.IO.File.Create(filePath))
                //{

                //    Request.Form.Files[0].FileUpload.CopyTo(fs);

                //}
                bool update_file = update_file_details(updated_file_name, filePath, bulletin_id);
            }

            if (bulletin_id != 0)
            {
                message.isSuccess = "true";
                message.Msg = "Bulletine Save Successfully";
                return new JsonResult(message);

                //ViewBag.Message = "Record Save Successfully";
            }
            else
            {
                message.isSuccess = "false";
                message.Msg = "Something went wrong while creating bulletin";
                return new JsonResult(message);
            }


        }


        [HttpGet, CustomFilter]
        public ActionResult Delete(int id)
        {
            bool result = DeleteBulletin(id);
            if (result)
            {
                ViewBag.Message = "Record Deleted Successfully";
            }

            return RedirectToAction("Bulletinelist");
        }
        public int UploadBulletin(string subject, DateTime expiry_date, string Recipients, string Identflag, string body, string business)
        {
            int bulletine_id = 0;
            try
            {
                SqlCommand cmd = new SqlCommand("SP_OVI_Urgent_Bulletin", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Identflag", Identflag);
                cmd.Parameters.AddWithValue("@subject", subject);
                //cmd.Parameters.AddWithValue("@from_date", From_date);
                cmd.Parameters.AddWithValue("@expiry_date", expiry_date);
                cmd.Parameters.AddWithValue("@Recipients", Recipients);
                cmd.Parameters.AddWithValue("@body", body);
                cmd.Parameters.AddWithValue("@Business", business);
                cmd.Parameters.AddWithValue("@CreatedBy", HttpContext.Session.GetString("EmpId"));
                sqlCon.Open();
                SqlDataAdapter sda = new SqlDataAdapter(cmd);
                DataTable dt = new DataTable();
                sda.Fill(dt);
                if (dt.Rows.Count > 0)
                {
                    bulletine_id = Convert.ToInt32(dt.Rows[0]["bulletin_id"]);
                }

                SqlHelper.closeCon();

            }
            catch (Exception e)
            {

            }
            return bulletine_id;

        }
        public bool update_file_details(string filename, string filePath, int bulletin_id)
        {
            bool result = false;
            try
            {
                SqlCommand cmd = new SqlCommand("SP_OVI_Urgent_Bulletin", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Identflag", "Update_File_Details");
                cmd.Parameters.AddWithValue("@Filename", filename);
                cmd.Parameters.AddWithValue("@FilePath", filePath);
                cmd.Parameters.AddWithValue("@id", bulletin_id);
                sqlCon.Open();
                int a = (int)cmd.ExecuteScalar();
                if (a > 0)
                {
                    result = true;
                }
                sqlCon.Close();
            }
            catch (Exception e)
            {

            }
            return result;

        }


        public bool DeleteBulletin(int bulletin_id)
        {
            bool result = false;
            SqlCommand cmd = new SqlCommand("SP_OVI_Urgent_Bulletin", sqlCon);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Identflag", "Delete_Bulletin");
            cmd.Parameters.AddWithValue("@id", bulletin_id);
            SqlHelper.openCon();
            int a = (int)cmd.ExecuteScalar();
            sqlCon.Close();
            if (a > 0)
            {
                result = true;
            }
            return result;
        }


    }
}
