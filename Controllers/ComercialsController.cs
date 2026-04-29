using Dashboard.Models;
using Dashboard.Repositories;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using OVI.Domain.Interfaces;

namespace Dashboard.Controllers
{
    [CustomFilter]
    public class ComercialsController : Controller
    {
        private readonly IDashboardRepository _dashboardRepository;
        SqlConnection sqlCon = new SqlConnection(clsConnectionString.GetConnectionString());

        public ComercialsController(IDashboardRepository dashboardRepository)
        {
            _dashboardRepository = dashboardRepository;
        }


        [HttpPost]
        public async Task<JsonResult> Add_Account_Customization(AssetPricing data)
        {
            MessageModel message = new MessageModel();
            try
            {
                string updated_file_name = string.Empty;
                if (Request.Form.Files.Count > 0)
                {
                    //string filename = Path.GetFileName(HttpContext.Request.Form.Files[0].FileName);
                    var basePath = Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot\AccountCustomisationFiles");
                    bool basePathExists = System.IO.Directory.Exists(basePath);
                    if (!basePathExists) Directory.CreateDirectory(basePath);
                    updated_file_name = Guid.NewGuid().ToString().Substring(0, 6) + "_" + data.file.FileName;
                    var filePath = Path.Combine(basePath, updated_file_name);
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await data.file.CopyToAsync(stream);
                    }
                }

                int Customer_Details_ID;

                SqlCommand cmd = new SqlCommand("SP_OVI_Add_AccountCustomization", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Account_Customisation_Customer_Details_ID", data.CustomerId);
                cmd.Parameters.AddWithValue("@CustomerName", data.CustomerName);
                cmd.Parameters.AddWithValue("@AccountNumber", data.AccountNumber);
                cmd.Parameters.AddWithValue("@ProductCode", data.ProductCode);
                cmd.Parameters.AddWithValue("@DocumentName", updated_file_name);
                cmd.Parameters.AddWithValue("@APR_Code", data.APRCode);
                cmd.Parameters.AddWithValue("@APR_PFY", data.APR_PFY);
                cmd.Parameters.AddWithValue("@APR_YTD", data.APR_YTD);
                cmd.Parameters.AddWithValue("@LS_ClientID", "");
                cmd.Parameters.AddWithValue("@Status", data.Status);
                cmd.Parameters.AddWithValue("@Justification", data.Justification);
                cmd.Parameters.AddWithValue("@CreatedBy", HttpContext.Session.GetString("EmpId").ToString());
                if (sqlCon.State == System.Data.ConnectionState.Closed)
                {
                    sqlCon.Open();
                }
                Customer_Details_ID = (Int32)cmd.ExecuteScalar();

                message.isSuccess = "true";
                message.Msg = "Record Save Successfully";
                if (data.CustomerId == 0)
                {
                    _dashboardRepository.CaptureProductivityDetails(HttpContext.Session.GetString("EmpName").ToString().Trim(), "Commercial-Account Customisation", "OneViewIndicator-RM", 1, "Create", "RM Created Account Customisation Proposal");
                }
                else
                {
                    _dashboardRepository.CaptureProductivityDetails(HttpContext.Session.GetString("EmpName").ToString().Trim(), "Commercial-Account Customisation", "OneViewIndicator-RM", 1, "Update", "RM Updated Account Customisation Proposal");
                }


                //logClass.CustomerId = Customer_Details_ID;
                //logClass.MasterId = "Account Customization";
                //logClass.Activity = "Create";
                //logClass.ActionBy = HttpContext.Session.GetString("EmpId").ToString();
                //logClass.ActionStatus = data.Status;
                //logClass.Description = "New Customer Created";
                //logClass.Remark = "";
                //commonClass.SaveLog(logClass);

                message.id = Customer_Details_ID;
                return new JsonResult(message);
            }
            catch (Exception e)
            {
                throw new MyAppException(e.Message);
            }
            finally
            {
                sqlCon.Close();
            }
        }

        [HttpPost]
        public JsonResult Add_Reversal_Approval(AssetPricing data)
        {
            MessageModel message = new MessageModel();

            try
            {
                int Reversal_Approval_Customer_Details_ID;

                SqlCommand cmd = new SqlCommand("SP_OVI_Add_ReversalApproval", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Reversal_Approval_Customer_Details_ID", data.CustomerId);
                cmd.Parameters.AddWithValue("@LS_ClientID", Convert.ToInt32(data.ClientId));
                cmd.Parameters.AddWithValue("@CustomerName", data.CustomerName);
                cmd.Parameters.AddWithValue("@ProposalNumber", Convert.ToInt32(data.ProposalNumber));
                cmd.Parameters.AddWithValue("@Vintage", data.Vintage);
                cmd.Parameters.AddWithValue("@RAROC", data.RAROC);
                cmd.Parameters.AddWithValue("@APR_PFY", data.APR_PFY);
                cmd.Parameters.AddWithValue("@APR_YTD", data.APR_YTD);
                cmd.Parameters.AddWithValue("@CTI", data.CTI);
                cmd.Parameters.AddWithValue("@Limit", data.Limit);
                cmd.Parameters.AddWithValue("@Remarks", data.Remark);
                cmd.Parameters.AddWithValue("@Status", data.Status);
                cmd.Parameters.AddWithValue("@CreatedBy", HttpContext.Session.GetString("EmpId").ToString());
                if (sqlCon.State == System.Data.ConnectionState.Closed)
                {
                    sqlCon.Open();
                }
                Reversal_Approval_Customer_Details_ID = (Int32)cmd.ExecuteScalar();

                if (Reversal_Approval_Customer_Details_ID == -1)
                {
                    message.isSuccess = "false";
                    message.Msg = "Proposal number is In Process";
                }
                else
                {
                    if (data.CustomerId == 0)
                    {
                        _dashboardRepository.CaptureProductivityDetails(HttpContext.Session.GetString("EmpName").ToString().Trim(), "Commercial-Reversal Approval", "OneViewIndicator-RM", 1, "Create", "Created Reversal Approval Proposal");
                    }
                    else
                    {
                        _dashboardRepository.CaptureProductivityDetails(HttpContext.Session.GetString("EmpName").ToString().Trim(), "Commercial-Reversal Approval", "OneViewIndicator-RM", 1, "Update", "Updated Reversal Approval Proposal");
                    }

                    message.isSuccess = "true";
                    message.Msg = "Record Save Successfully";
                }
                message.id = Reversal_Approval_Customer_Details_ID;
                return new JsonResult(message);
            }
            catch (Exception e)
            {
                throw new MyAppException(e.Message);
            }
            finally
            {
                sqlCon.Close();
            }
        }

        [HttpPost]
        public JsonResult Add_AssetPricing(AssetPricing data)
        {
            MessageModel message = new MessageModel();
            try
            {

                int CustomerID;
                SqlCommand cmd = new SqlCommand("SP_OVI_AssetPricing", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@CustomerId", data.CustomerId);
                cmd.Parameters.AddWithValue("@IsPSL", Convert.ToInt32(data.IsPSL));
                if (Convert.ToInt32(data.IsPSL) == 1)
                {
                    cmd.Parameters.AddWithValue("@PSLType", data.PSLType);
                    cmd.Parameters.AddWithValue("@IsWeakerSection", Convert.ToInt32(data.IsWeakerSection));
                }
                if (Convert.ToInt32(data.IsPSL) == 0)
                {
                    cmd.Parameters.AddWithValue("@PSLType", "");
                    cmd.Parameters.AddWithValue("@IsWeakerSection", 0);
                }

                //cmd.Parameters.AddWithValue("@Is_Importer_Exporter", data.Is_Importer_Exporter);
                //cmd.Parameters.AddWithValue("@Importer_Exporter_Type", data.Importer_Exporter_Type);
                cmd.Parameters.AddWithValue("@Multiple_Banking", Convert.ToInt32(data.Multiple_Banking));
                //cmd.Parameters.AddWithValue("@IEC_No","");
                //cmd.Parameters.AddWithValue("@Avg_Import_Volume","");
                //cmd.Parameters.AddWithValue("@Overdue_IDPMS", data.Overdue_IDPMS);
                //cmd.Parameters.AddWithValue("@Overdue_EDPMS", data.Overdue_EDPMS);
                //cmd.Parameters.AddWithValue("@MTT_Transactions", data.MTT_Transactions);

                cmd.Parameters.AddWithValue("@Justification", data.Justification);
                cmd.Parameters.AddWithValue("@CreditProtectWaived", data.CreditProtectWaived);
                if (data.CustomerType == "Existing")
                {
                    cmd.Parameters.AddWithValue("@RAROC", data.RAROC);
                    cmd.Parameters.AddWithValue("@APR_PFY", data.APR_PFY);
                    cmd.Parameters.AddWithValue("@APR_YTD", data.APR_YTD);
                    cmd.Parameters.AddWithValue("@CTI", data.CTI);
                    cmd.Parameters.AddWithValue("@Vintage", data.Vintage);
                    cmd.Parameters.AddWithValue("@CustomerName", data.ExistingCustomerName);
                    cmd.Parameters.AddWithValue("@ProposalNumber", data.ProposalNumber);
                    cmd.Parameters.AddWithValue("@ClientId", data.ClientId);
                    cmd.Parameters.AddWithValue("@IsFTB", 0);
                }
                else
                {
                    if (data.CustomerType == "NTB")
                    {
                        cmd.Parameters.AddWithValue("@ApprovalNo", data.ApprovalNo);
                        cmd.Parameters.AddWithValue("@ProposalNumber", data.ProposalNumber);
                    }
                    else
                    {
                        cmd.Parameters.AddWithValue("@ProposalNumber", "");
                    }
                    cmd.Parameters.AddWithValue("@RAROC", "");
                    cmd.Parameters.AddWithValue("@APR_PFY", "");
                    cmd.Parameters.AddWithValue("@APR_YTD", "");
                    cmd.Parameters.AddWithValue("@CTI", "");
                    cmd.Parameters.AddWithValue("@Vintage", "");
                    cmd.Parameters.AddWithValue("@CustomerName", data.CustomerName);
                    cmd.Parameters.AddWithValue("@IsFTB", data.IsFTB);

                }
                cmd.Parameters.AddWithValue("@CommercialType", data.CommercialType);
                cmd.Parameters.AddWithValue("@CustomerType", data.CustomerType);
                cmd.Parameters.AddWithValue("@CreatedBy", HttpContext.Session.GetString("EmpId").ToString());
                if (sqlCon.State == System.Data.ConnectionState.Closed)
                {
                    sqlCon.Open();
                }
                CustomerID = (Int32)cmd.ExecuteScalar();


                if (CustomerID == -1)
                {

                    message.isSuccess = "false";
                    message.Msg = "Proposal number is In Process";
                    message.id = CustomerID;
                }
                else
                {
                    if (data.CustomerId == 0)
                    {
                        _dashboardRepository.CaptureProductivityDetails(HttpContext.Session.GetString("EmpName").ToString().Trim(), "Commercial-Asset Pricing", "OneViewIndicator-RM", 1, "Create", "Created Asset Pricing Proposal");
                    }
                    else
                    {
                        _dashboardRepository.CaptureProductivityDetails(HttpContext.Session.GetString("EmpName").ToString().Trim(), "Commercial-Asset Pricing", "OneViewIndicator-RM", 1, "Update", "Updated Asset Pricing Proposal");
                    }
                    message.isSuccess = "true";
                    message.Msg = "Record Save Successfully";
                    message.id = CustomerID;
                }

            }
            catch (Exception e)
            {
                throw new MyAppException(e.Message);
            }
            finally
            {
                sqlCon.Close();
            }
            return new JsonResult(message);

        }


        [HttpGet]
        public DataSet Get_All_Recepients()
        {
            try
            {

                DataSet ds = new DataSet();
                SqlCommand cmd = new SqlCommand("SP_OVI_Fetch_Master_Data", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@IdenFlag", "Get_All_Recepients");
                cmd.Parameters.AddWithValue("@UserId", HttpContext.Session.GetString("EmpId").ToString());
                //cmd.Parameters.AddWithValue("@IdenFlag", "GetOtherRecepients");
                if (sqlCon.State == System.Data.ConnectionState.Closed)
                {
                    sqlCon.Open();
                }
                SqlDataAdapter sda = new SqlDataAdapter(cmd);
                sda.Fill(ds);
                ds.Tables[0].TableName = "CH_TBL";
                ds.Tables[1].TableName = "UH_TBL";
                ds.Tables[2].TableName = "RH_TBL";
                ds.Tables[3].TableName = "ZH_TBL";
                ds.Tables[4].TableName = "BH_TBL";
                ds.Tables[5].TableName = "GH_TBL";
                ds.Tables[6].TableName = "SH_TBL";
                ds.Tables[7].TableName = "NH_TBL";

                return ds;
            }
            catch (Exception e)
            {
                throw new MyAppException(e.Message);
            }
            finally
            {
                sqlCon.Close();
            }
        }
        [HttpGet]
        public DataTable Get_AllSupervisors()
        {
            try
            {

                SqlCommand cmd = new SqlCommand("SP_OVI_GetSupervisors", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Empcode", HttpContext.Session.GetString("EmpId").ToString());
                if (sqlCon.State == System.Data.ConnectionState.Closed)
                {
                    sqlCon.Open();
                }
                SqlDataAdapter sda = new SqlDataAdapter(cmd);
                DataTable dt = new DataTable();
                sda.Fill(dt);

                return dt;
            }
            catch (Exception e)
            {
                throw new MyAppException(e.Message);
            }
            finally
            {
                sqlCon.Close();
            }

        }
        [HttpPost]
        public JsonResult Add_Other_Charges(AssetPricing data)
        {
            MessageModel message = new MessageModel();
            try
            {

                SqlCommand cmd = new SqlCommand("SP_OVI_Insert_Other_AssetPricing", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Idenflag", "InsertOtherCharges");
                cmd.Parameters.AddWithValue("@AP_Customer_Info_ID", data.CustomerId);
                cmd.Parameters.AddWithValue("@ChargeType", data.ChargesType);
                cmd.Parameters.AddWithValue("@ExistingPrice", data.ExistingPrice);
                cmd.Parameters.AddWithValue("@ProposedPrice", data.ProposedPrice);
                cmd.Parameters.AddWithValue("@RowId", data.RowId);
                cmd.Parameters.AddWithValue("@CreatedBy", HttpContext.Session.GetString("EmpId").ToString());

                if (sqlCon.State == System.Data.ConnectionState.Closed)
                {
                    sqlCon.Open();
                }
                int a = (Int32)cmd.ExecuteScalar();

                if (a > 0)
                {
                    message.isSuccess = "true";
                }
                else
                {
                    message.isSuccess = "false";
                }
                return new JsonResult(message);
            }
            catch (Exception e)
            {
                throw new MyAppException(e.Message);
            }
            finally
            {
                sqlCon.Close();
            }


        }

        [HttpGet]
        public DataTable Get_Master_Dropdown_Data(string drp_type)
        {
            try
            {

                SqlCommand cmd = new SqlCommand("SP_OVI_Fetch_Master_Data", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@IdenFlag", drp_type);
                if (sqlCon.State == System.Data.ConnectionState.Closed)
                {
                    sqlCon.Open();
                }
                SqlDataAdapter sda = new SqlDataAdapter(cmd);
                DataTable dt = new DataTable();
                sda.Fill(dt);

                return dt;
            }
            catch (Exception e)
            {
                throw new MyAppException(e.Message);
            }
            finally
            {
                sqlCon.Close();
            }

        }


        [HttpPost]
        public JsonResult Add_Promoters_Details(AssetPricing data)
        {
            MessageModel message = new MessageModel();
            try
            {

                SqlCommand cmd = new SqlCommand("SP_OVI_Insert_Other_AssetPricing", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Idenflag", "InsertPromoters");
                cmd.Parameters.AddWithValue("@AP_Customer_Info_ID", data.CustomerId);
                cmd.Parameters.AddWithValue("@IsPromoter", data.IsPromoter);
                cmd.Parameters.AddWithValue("@Promoter_Name", data.Promoter_Name);
                cmd.Parameters.AddWithValue("@Promoter_Type", data.Promoter_Type);
                cmd.Parameters.AddWithValue("@RelationshipWith", data.RelationshipWith);
                cmd.Parameters.AddWithValue("@RelationshipName", data.RelationshipName);
                cmd.Parameters.AddWithValue("@IsAcccount", data.IsAcccount);
                cmd.Parameters.AddWithValue("@AccountNumber", data.AccountNumber);
                cmd.Parameters.AddWithValue("@RowId ", data.RowId);
                cmd.Parameters.AddWithValue("@CreatedBy", HttpContext.Session.GetString("EmpId").ToString());
                if (sqlCon.State == System.Data.ConnectionState.Closed)
                {
                    sqlCon.Open();
                }
                int a = (Int32)cmd.ExecuteScalar();

                if (a > 0)
                {
                    message.isSuccess = "true";
                }
                else
                {
                    message.isSuccess = "false";
                }
                return new JsonResult(message);
            }
            catch (Exception e)
            {
                throw new MyAppException(e.Message);
            }
            finally
            {
                sqlCon.Close();
            }

        }

        [HttpPost]
        public JsonResult Add_MultipleBanking_Details(AssetPricing data)
        {
            MessageModel message = new MessageModel();
            try
            {
                SqlCommand cmd = new SqlCommand("SP_OVI_Insert_Other_AssetPricing", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Idenflag", "InsertMultipleBanking");
                cmd.Parameters.AddWithValue("@AP_Customer_Info_ID", data.CustomerId);
                cmd.Parameters.AddWithValue("@FacilityType", data.FacilityType);
                cmd.Parameters.AddWithValue("@BankName", data.BankName);
                cmd.Parameters.AddWithValue("@Sanctioned", data.Sanctioned_Amt);
                cmd.Parameters.AddWithValue("@Outstanding", data.Outstanding_Amt);
                cmd.Parameters.AddWithValue("@ROI", data.ROI);
                cmd.Parameters.AddWithValue("@RowId", data.RowId);
                cmd.Parameters.AddWithValue("@CreatedBy", HttpContext.Session.GetString("EmpId").ToString());
                if (sqlCon.State == System.Data.ConnectionState.Closed)
                {
                    sqlCon.Open();
                }
                int a = (Int32)cmd.ExecuteScalar();

                if (a > 0)
                {
                    message.isSuccess = "true";
                }
                else
                {
                    message.isSuccess = "false";
                }
                return new JsonResult(message);
            }
            catch (Exception e)
            {
                throw new MyAppException(e.Message);
            }
            finally
            {
                sqlCon.Close();
            }

        }

        [HttpPost]
        public JsonResult Add_Collateral_Details(AssetPricing data)
        {
            MessageModel message = new MessageModel();
            try
            {

                SqlCommand cmd = new SqlCommand("SP_OVI_Insert_Other_AssetPricing", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Idenflag", "InsertCollateralDetails");
                cmd.Parameters.AddWithValue("@AP_Customer_Info_ID", data.CustomerId);
                cmd.Parameters.AddWithValue("@SecurityType", data.SecurityType);
                cmd.Parameters.AddWithValue("@SecurityDescription", data.SecurityDescription);
                cmd.Parameters.AddWithValue("@SecurityOwner", data.SecurityOwner);
                cmd.Parameters.AddWithValue("@SecurityValue", data.SecurityValue);
                cmd.Parameters.AddWithValue("@RowId", data.RowId);
                cmd.Parameters.AddWithValue("@CreatedBy", HttpContext.Session.GetString("EmpId").ToString());
                if (sqlCon.State == System.Data.ConnectionState.Closed)
                {
                    sqlCon.Open();
                }
                int a = (Int32)cmd.ExecuteScalar();

                if (a > 0)
                {
                    message.isSuccess = "true";
                }
                else
                {
                    message.isSuccess = "false";
                }
                return new JsonResult(message);
            }
            catch (Exception e)
            {
                throw new MyAppException(e.Message);
            }
            finally
            {
                sqlCon.Close();
            }
        }


        [HttpPost]
        public async Task<JsonResult> Add_Facility_Details(AssetPricing data)
        {
            MessageModel message = new MessageModel();
            try
            {
                string updated_file_name = string.Empty;
                if (data.file != null)
                {
                    if (Request.Form.Files.Count > 0)
                    {
                        //string filename = Path.GetFileName(HttpContext.Request.Form.Files[0].FileName);
                        var basePath = Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot\FacilityFiles");
                        bool basePathExists = System.IO.Directory.Exists(basePath);
                        if (!basePathExists) Directory.CreateDirectory(basePath);
                        updated_file_name = Guid.NewGuid().ToString().Substring(0, 6) + "_" + data.file.FileName;
                        var filePath = Path.Combine(basePath, updated_file_name);
                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await data.file.CopyToAsync(stream);
                        }
                    }
                }
                else
                {
                    updated_file_name = data.FileName;
                }


                SqlCommand cmd = new SqlCommand("SP_OVI_Insert_Other_AssetPricing", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Idenflag", "InsertFacilityDetails");
                cmd.Parameters.AddWithValue("@AP_Customer_Info_ID", data.CustomerId);
                cmd.Parameters.AddWithValue("@FacilityType", data.FacilityType);
                cmd.Parameters.AddWithValue("@ExistingAmount", data.ExistingAmount);
                cmd.Parameters.AddWithValue("@ProposedAmount", data.ProposedAmount);
                cmd.Parameters.AddWithValue("@ExistingPrice", data.ExistingPrice);
                cmd.Parameters.AddWithValue("@ProposedPrice", data.ProposedPrice);
                cmd.Parameters.AddWithValue("@Fb_Nfb", data.Fb_Nfb);
                cmd.Parameters.AddWithValue("@Instruction", data.Instruction);
                cmd.Parameters.AddWithValue("@FileName", updated_file_name);
                cmd.Parameters.AddWithValue("@RowId", data.RowId);
                cmd.Parameters.AddWithValue("@CreatedBy", HttpContext.Session.GetString("EmpId").ToString());
                if (sqlCon.State == System.Data.ConnectionState.Closed)
                {
                    sqlCon.Open();
                }
                int a = (Int32)cmd.ExecuteScalar();

                if (a > 0)
                {
                    message.isSuccess = "true";
                }
                else
                {
                    message.isSuccess = "false";
                }
                return new JsonResult(message);
            }
            catch (Exception e)
            {
                throw new MyAppException(e.Message);
            }
            finally
            {
                sqlCon.Close();
            }
        }
        //public async Task<JsonResult> Upload_Facility_File()
        //{
        //    MessageModel message = new MessageModel();
        //    string updated_file_name = string.Empty;
        //    if (Request.Form.Files.Count > 0)
        //    {
        //        //string filename = Path.GetFileName(HttpContext.Request.Form.Files[0].FileName);
        //        var basePath = Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot\FacilityFiles");
        //        bool basePathExists = System.IO.Directory.Exists(basePath);
        //        if (!basePathExists) Directory.CreateDirectory(basePath);
        //        string filename = Request.Form.Files[0].FileName;
        //        updated_file_name =  filename;
        //        var filePath = Path.Combine(basePath, updated_file_name);
        //        using (var stream = new FileStream(filePath, FileMode.Create))
        //        {
        //            await Request.Form.Files[0].CopyToAsync(stream);
        //        }
        //    }
        //    message.isSuccess = "true";
        //   // message.Msg = updated_file_name;
        //    return new JsonResult(message);
        //}


        [HttpGet]
        public DataTable Get_TradePricingData(string TradeType, int CustomerId)
        {
            try
            {
                //string sp_name = "";
                //if (CustomerId == 0)
                //{
                //    sp_name = "SP_OVI_Get_TradePricing_Empty_Tables";
                //}
                //else
                //{
                //    sp_name = "SP_OVI_Get_TraderPricingDetails";
                //}


                SqlCommand cmd = new SqlCommand("SP_OVI_Get_TraderPricingDetails", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@TradeType", TradeType);
                cmd.Parameters.AddWithValue("@CustomerId", CustomerId);
                cmd.Parameters.AddWithValue("@UserId", HttpContext.Session.GetString("EmpId").ToString());

                if (sqlCon.State == System.Data.ConnectionState.Closed)
                {
                    sqlCon.Open();
                }
                SqlDataAdapter sda = new SqlDataAdapter(cmd);
                DataTable dt = new DataTable();
                sda.Fill(dt);

                return dt;
            }
            catch (Exception e)
            {
                throw new MyAppException(e.Message);
            }
            finally
            {
                sqlCon.Close();
            }
        }

        [HttpPost]
        public JsonResult Add_Approver_Details(AssetPricing data)
        {
            MessageModel message = new MessageModel();
            try
            {

                SqlCommand cmd = new SqlCommand("SP_OVI_Insert_Other_AssetPricing", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Idenflag", "InsertApproverDetails");
                cmd.Parameters.AddWithValue("@CommercialType", data.CommercialType);
                cmd.Parameters.AddWithValue("@AP_Customer_Info_ID", data.CustomerId);
                cmd.Parameters.AddWithValue("@ApproverADID", data.ApproverADID);
                cmd.Parameters.AddWithValue("@LevelNumber", data.LevelNumber);
                cmd.Parameters.AddWithValue("@Status", data.Status);
                cmd.Parameters.AddWithValue("@CreatedBy", HttpContext.Session.GetString("EmpId").ToString());
                cmd.Parameters.AddWithValue("@CommercialTypeMain", "Asset Pricing");
                if (sqlCon.State == System.Data.ConnectionState.Closed)
                {
                    sqlCon.Open();
                }

                SqlDataAdapter sda = new SqlDataAdapter(cmd);
                DataSet dt = new DataSet();
                sda.Fill(dt);

                if (dt.Tables.Count > 0)
                {
                    if (data.LevelNumber == 1)
                    {
                        MailRepository mailRepository = new MailRepository();
                        string result = mailRepository.SendMail(dt);
                    }
                    message.isSuccess = "true";
                }
                else
                {
                    message.isSuccess = "false";
                }
                return new JsonResult(message);
            }
            catch (Exception e)
            {
                throw new MyAppException(e.Message);
            }
            finally
            {
                sqlCon.Close();
            }
        }


        [HttpPost]
        public JsonResult Save_LetterOfCreditData(TradePricing data)
        {
            try
            {
                MessageModel message = new MessageModel();

                SqlCommand cmd = new SqlCommand("SP_OVI_Add_TraderPricingDetails", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@TradeType", data.TradeType);
                cmd.Parameters.AddWithValue("@CustomerId", data.CustomerId);
                cmd.Parameters.AddWithValue("@Pricing_Item_Master_ID", data.Pricing_Item_Master_ID);
                cmd.Parameters.AddWithValue("@PricingCategory", data.PricingCategory);
                cmd.Parameters.AddWithValue("@Charges_Commission", data.Charges_Commission);
                cmd.Parameters.AddWithValue("@StandardPricing", data.StandardPricing);
                cmd.Parameters.AddWithValue("@ExistingPrice", data.ExistingPrice);
                cmd.Parameters.AddWithValue("@ProposedPrice", data.ProposedPrice);
                if (sqlCon.State == System.Data.ConnectionState.Closed)
                {
                    sqlCon.Open();
                }
                cmd.ExecuteNonQuery();

                message.isSuccess = "true";
                message.Msg = "Record Save Successfully";

                message.id = data.CustomerId;
                return new JsonResult(message);
            }
            catch (Exception e)
            {
                throw new MyAppException(e.Message);
            }
            finally
            {
                sqlCon.Close();
            }

        }

        [HttpPost]
        public JsonResult Save_TradePricingCustomerInfo(TradePricing data)
        {
            MessageModel message = new MessageModel();
            try
            {

                SqlCommand cmd = new SqlCommand("SP_OVI_Add_TraderPricingDetails", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@TradeType", data.TradeType);
                cmd.Parameters.AddWithValue("@CustomerId", data.CustomerId);
                cmd.Parameters.AddWithValue("@CustomerName", data.CustomerName);
                cmd.Parameters.AddWithValue("@PanNo", data.PanNo);
                cmd.Parameters.AddWithValue("@ApproverADID", data.ApproverADID);
                cmd.Parameters.AddWithValue("@Remark", data.Remark);
                cmd.Parameters.AddWithValue("@CustomerType", data.CustomerType);
                cmd.Parameters.AddWithValue("@CreatedBy", HttpContext.Session.GetString("EmpId").ToString().ToUpper());
                cmd.Parameters.AddWithValue("@CommercialTypeMain", "Trade Pricing");
                cmd.Parameters.AddWithValue("@APR_Code", data.APRCode);
                cmd.Parameters.AddWithValue("@APR_PFY", data.APR_PFY);
                cmd.Parameters.AddWithValue("@APR_YTD", data.APR_YTD);
                cmd.Parameters.AddWithValue("@Vintage", data.Vintage);
                cmd.Parameters.AddWithValue("@ProposalNumber", data.ProposalNumber);
                cmd.Parameters.AddWithValue("@ClientId", data.ClientId);
                //if (data.CustomerType == "0")
                //{
                //    cmd.Parameters.AddWithValue("@APR_Code","");
                //    cmd.Parameters.AddWithValue("@APR_PFY", "");
                //    cmd.Parameters.AddWithValue("@APR_YTD", "");
                //    cmd.Parameters.AddWithValue("@Vintage", "");
                //    cmd.Parameters.AddWithValue("@ProposalNumber", "");
                //    cmd.Parameters.AddWithValue("@ClientId", "");
                //}
                //else
                //{

                //}

                if (sqlCon.State == System.Data.ConnectionState.Closed)
                {
                    sqlCon.Open();
                }
                SqlDataAdapter sda = new SqlDataAdapter(cmd);
                DataSet dt = new DataSet();
                sda.Fill(dt);


                if (dt.Tables.Count > 0)
                {
                    message.isSuccess = "true";
                    if (data.CustomerId == 0)
                    {
                        _dashboardRepository.CaptureProductivityDetails(HttpContext.Session.GetString("EmpName").ToString().Trim(), "Commercial-Trade Pricing", "OneViewIndicator-RM", 1, "Create", "Created Trade Pricing Proposal");
                    }
                    else
                    {
                        _dashboardRepository.CaptureProductivityDetails(HttpContext.Session.GetString("EmpName").ToString().Trim(), "Commercial-Trade Pricing", "OneViewIndicator-RM", 1, "Update", "Updated Trade Pricing Proposal");
                    }
                    if (dt.Tables.Count == 2)
                    {
                        message.id = Convert.ToInt32(dt.Tables[0].Rows[0]["TP_Customer_Info_ID"]);
                        MailRepository mailRepository = new MailRepository();
                        string result = mailRepository.SendMail(dt);
                    }
                    else
                    {
                        message.id = Convert.ToInt32(dt.Tables[0].Rows[0]["CustomerId"]);
                    }
                }

                else
                {
                    message.isSuccess = "false";
                }

                return new JsonResult(message);
            }
            catch (Exception e)
            {
                throw new MyAppException(e.Message);
            }
            finally
            {
                sqlCon.Close();
            }

        }

        [HttpGet]
        public DataTable GetTradePricingGridData()
        {
            try
            {
                SqlCommand cmd = new SqlCommand("SP_OVI_Get_TraderPricingDetails", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@TradeType", "GetAll");
                cmd.Parameters.AddWithValue("@UserId", HttpContext.Session.GetString("EmpId").ToString());
                if (sqlCon.State == System.Data.ConnectionState.Closed)
                {
                    sqlCon.Open();
                }
                SqlDataAdapter sda = new SqlDataAdapter(cmd);
                DataTable dt = new DataTable();
                sda.Fill(dt);

                return dt;
            }
            catch (Exception e)
            {
                throw new MyAppException(e.Message);
            }
            finally
            {
                sqlCon.Close();
            }

        }
        public DataTable GetTradePricingTableStatus(int CustomerId)
        {
            try
            {

                SqlCommand cmd = new SqlCommand("SP_OVI_Get_TraderPricingDetails", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@TradeType", "GetTradePricingTableStatus");
                cmd.Parameters.AddWithValue("@CustomerId", CustomerId);
                if (sqlCon.State == System.Data.ConnectionState.Closed)
                {
                    sqlCon.Open();
                }
                SqlDataAdapter sda = new SqlDataAdapter(cmd);
                DataTable dt = new DataTable();
                sda.Fill(dt);

                return dt;
            }
            catch (Exception e)
            {
                throw new MyAppException(e.Message);
            }
            finally
            {
                sqlCon.Close();
            }
        }

        [HttpGet]
        public DataSet GetAssetPricingGridData(string CustomerType, int Month, int Year, string ClientId)
        {
            DataSet ds = new DataSet();
            try
            {

                SqlCommand cmd = new SqlCommand("SP_OVI_Get_AssetPricingDetails", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@CustomerType", CustomerType);
                cmd.Parameters.AddWithValue("@Month", Month);
                cmd.Parameters.AddWithValue("@Year", Year);
                cmd.Parameters.AddWithValue("@ClientId", ClientId);
                cmd.Parameters.AddWithValue("@UserId", HttpContext.Session.GetString("EmpId").ToString());
                if (sqlCon.State == System.Data.ConnectionState.Closed)
                {
                    sqlCon.Open();
                }
                SqlDataAdapter sda = new SqlDataAdapter(cmd);

                sda.Fill(ds);


                //string customername = dt.Rows[0]["CustomerName"];
                ds.Tables[0].TableName = "TBL_AssetPricingGridData";
                ds.Tables[1].TableName = "TBL_AssetPricingCount";

                return ds;
            }
            catch (Exception ex)
            {
                throw new MyAppException(ex.Message);
            }
            finally
            {
                sqlCon.Close();
            }

        }

        [HttpGet]
        public DataSet Get_AssetPricingCustomerDetail(int CustomerId, string CustomerType)
        {
            try
            {

                SqlCommand cmd = new SqlCommand("SP_OVI_Get_AssetPricingCustomerDetail", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@CustomerType", CustomerType);
                cmd.Parameters.AddWithValue("@CustomerId", CustomerId);
                cmd.Parameters.AddWithValue("@UserId", HttpContext.Session.GetString("EmpId").ToString());
                if (sqlCon.State == System.Data.ConnectionState.Closed)
                {
                    sqlCon.Open();
                }
                SqlDataAdapter sda = new SqlDataAdapter(cmd);
                DataSet ds = new DataSet();
                sda.Fill(ds);


                ds.Tables[0].TableName = "TBL_Asset_Pricing_Customer_Info";
                ds.Tables[1].TableName = "TBL_Facility_Details";
                ds.Tables[2].TableName = "TBL_Collateral_Details";
                ds.Tables[3].TableName = "TBL_Other_Charges";
                ds.Tables[4].TableName = "TBL_Promoter";
                ds.Tables[5].TableName = "TBL_Aprrover";
                ds.Tables[6].TableName = "TBL_MultipleBanks";
                ds.Tables[7].TableName = "TBL_ResponseHistory";
                ds.Tables[8].TableName = "tbl_facilityimage";
                ds.Tables[9].TableName = "tbl_auditlog";
                //HttpContext.Session.SetString("AssetProposalStatus", ds.Tables[0].Rows[0]["Status1"].ToString());

                return ds;
            }
            catch (Exception e)
            {
                throw new MyAppException(e.Message);
            }
            finally
            {
                sqlCon.Close();
            }

        }
        [HttpGet]
        public DataTable Get_APRSCount(int LsId, string Type)
        {
            try
            {

                SqlCommand cmd = new SqlCommand("SP_OVI_AssetPricing_GetAPRs", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@LsId", LsId);
                cmd.Parameters.AddWithValue("@Type", Type);
                cmd.Parameters.AddWithValue("@ProposalNo", LsId);
                cmd.Parameters.AddWithValue("@APRCode", LsId);
                if (sqlCon.State == System.Data.ConnectionState.Closed)
                {
                    sqlCon.Open();
                }
                SqlDataAdapter sda = new SqlDataAdapter(cmd);
                DataTable dt = new DataTable();
                sda.Fill(dt);

                return dt;
            }
            catch (Exception e)
            {
                throw new MyAppException(e.Message);
            }
            finally
            {
                sqlCon.Close();
            }

        }
        [HttpGet]
        public DataTable Get_FacilityDetails(int LsId, string Type)
        {
            try
            {

                SqlCommand cmd = new SqlCommand("SP_OVI_Get_FacilityDetails", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@LsId", LsId);
                cmd.Parameters.AddWithValue("@Type", Type);
                cmd.Parameters.AddWithValue("@ProposalNo", LsId);
                if (sqlCon.State == System.Data.ConnectionState.Closed)
                {
                    sqlCon.Open();
                }
                SqlDataAdapter sda = new SqlDataAdapter(cmd);
                DataTable dt = new DataTable();
                sda.Fill(dt);

                return dt;
            }
            catch (Exception e)
            {
                throw new MyAppException(e.Message);
            }
            finally
            {
                sqlCon.Close();
            }
        }


        [HttpPost]
        public JsonResult Update_AssetPricing_ApprovalStatus(AssetPricing data)
        {
            try
            {
                string userRole = HttpContext.Session.GetString("UserRole").ToString();
                DataSet dt = new DataSet();

                MessageModel message = new MessageModel();

                SqlCommand cmd = new SqlCommand("SP_OVI_UpdateApproveStatus", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@CustomerId", Convert.ToInt32(data.Asset_Pricing_CustomerId));
                cmd.Parameters.AddWithValue("@Action", data.Action);
                cmd.Parameters.AddWithValue("@Remark", data.Remark);
                cmd.Parameters.AddWithValue("@ApproverADId", HttpContext.Session.GetString("EmpId").ToString());
                //cmd.Parameters.AddWithValue("@Role", HttpContext.Session.GetString("UserRole").ToString());

                cmd.Parameters.AddWithValue("@CommercialTypeMain", "Asset Pricing");
                if (sqlCon.State == System.Data.ConnectionState.Closed)
                {
                    sqlCon.Open();
                }

                SqlDataAdapter sda = new SqlDataAdapter(cmd);
                sda.Fill(dt);
                if (dt.Tables[0].Rows.Count > 0)
                {
                    message.isSuccess = "true";
                    MailRepository mailRepository = new MailRepository();
                    string result = mailRepository.SendMail(dt);
                    if (data.Action == "Approve")
                    {
                        _dashboardRepository.CaptureProductivityDetails(HttpContext.Session.GetString("EmpName").ToString().Trim(), "Commercial-Asset Pricing", "OneViewIndicator-RM", 1, "Approve", "Supervisor Approved Asset pricing proposal");
                        message.Msg = "Record approved successfully";

                    }
                    else if (data.Action == "Reject")
                    {
                        _dashboardRepository.CaptureProductivityDetails(HttpContext.Session.GetString("EmpName").ToString().Trim(), "Commercial-Asset Pricing", "OneViewIndicator-RM", 1, "Reject", "Supervisor Rejected Asset pricing proposal");
                        message.Msg = "Record rejected successfully";
                    }
                    else
                    {
                        _dashboardRepository.CaptureProductivityDetails(HttpContext.Session.GetString("EmpName").ToString().Trim(), "Commercial-Asset Pricing", "OneViewIndicator-RM", 1, "send back", "Supervisor sent back Asset pricing proposal");
                        message.Msg = "Record send back successfully";
                    }
                }
                else
                {
                    message.isSuccess = "false";
                    message.Msg = "Something went wrong..Please try again later";
                }

                return new JsonResult(message);
            }
            catch (Exception e)
            {
                throw new MyAppException(e.Message);
            }
            finally
            {
                sqlCon.Close();
            }

        }

        [HttpPost]
        public JsonResult Update_TradePricing_ApprovalStatus(AssetPricing data)
        {
            MessageModel message = new MessageModel();
            try
            {

                SqlCommand cmd = new SqlCommand("SP_OVI_UpdateTradePricingApprovalStatus", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@CustomerId", Convert.ToInt32(data.CustomerId));
                cmd.Parameters.AddWithValue("@Action", data.Action);
                cmd.Parameters.AddWithValue("@Remark", data.Remark);
                cmd.Parameters.AddWithValue("@ApproverADId", HttpContext.Session.GetString("EmpId").ToString());
                cmd.Parameters.AddWithValue("@CommercialTypeMain", "Trade Pricing");
                if (sqlCon.State == System.Data.ConnectionState.Closed)
                {
                    sqlCon.Open();
                }
                SqlDataAdapter sda = new SqlDataAdapter(cmd);
                DataSet dt = new DataSet();
                sda.Fill(dt);
                if (dt.Tables.Count > 0)
                {
                    message.isSuccess = "true";
                    MailRepository mailRepository = new MailRepository();
                    string result = mailRepository.SendMail(dt);
                    if (data.Action == "Approve")
                    {
                        _dashboardRepository.CaptureProductivityDetails(HttpContext.Session.GetString("EmpName").ToString().Trim(), "Commercial-Trade Pricing", "OneViewIndicator-RM", 1, "Approve", "Supervisor Approved Trade pricing proposal");
                        message.Msg = "Record Approved Successfully";
                    }
                    else if (data.Action == "Reject")
                    {
                        _dashboardRepository.CaptureProductivityDetails(HttpContext.Session.GetString("EmpName").ToString().Trim(), "Commercial-Trade Pricing", "OneViewIndicator-RM", 1, "Reject", "Supervisor Rejected Trade pricing proposal");
                        message.Msg = "Record Rejected Successfully";
                    }

                }
                else
                {
                    message.isSuccess = "false";
                    message.Msg = "Something went wrong..Please try again later";
                }

                return new JsonResult(message);
            }
            catch (Exception e)
            {
                throw new MyAppException(e.Message);
            }
            finally
            {
                sqlCon.Close();
            }
        }
        public JsonResult Get_Approvers_ApprovalStatus(int CustomerInfo_Id, string actionName)
        {
            MessageModel message = new MessageModel();
            try
            {

                SqlCommand cmd = new SqlCommand("SP_OVI_GetApprovalStatus", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@IdentFlag", actionName);
                cmd.Parameters.AddWithValue("@CustomerId", CustomerInfo_Id);
                cmd.Parameters.AddWithValue("@ApproverADId", HttpContext.Session.GetString("EmpId").ToString());
                if (sqlCon.State == System.Data.ConnectionState.Closed)
                {
                    sqlCon.Open();
                }
                SqlDataAdapter sda = new SqlDataAdapter(cmd);
                DataTable dt = new DataTable();
                sda.Fill(dt);

                message.Status = 0;
                if (dt.Rows.Count > 0)
                {
                    message.Status = Convert.ToInt32(dt.Rows[0]["Status"].ToString());
                }
                return new JsonResult(message);
            }
            catch (Exception e)
            {
                throw new MyAppException(e.Message);
            }
            finally
            {
                sqlCon.Close();
            }
        }
        public PartialViewResult GetAssetPricingPartialView()
        {
            return PartialView("../Commercials/_AssetPricing");
        }
        public PartialViewResult GetReversalApprovalPartialView()
        {
            return PartialView("../Commercials/_ReversalApproval");
        }

        [HttpPost]
        public JsonResult Add_Reversal_Details(AssetPricing data)
        {
            MessageModel message = new MessageModel();
            try
            {

                SqlCommand cmd = new SqlCommand("SP_OVI_Insert_Other_Reversal_Approval", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Idenflag", "InsertReversalDetails");
                cmd.Parameters.AddWithValue("@Reversal_Approval_Customer_Details_ID", data.CustomerId);
                cmd.Parameters.AddWithValue("@NatureofReversal", data.NatureofReversal);
                cmd.Parameters.AddWithValue("@AmountofReversal", data.AmountofReversal);
                cmd.Parameters.AddWithValue("@CreatedBy", HttpContext.Session.GetString("EmpId").ToString().ToUpper());
                cmd.Parameters.AddWithValue("@RowId", data.RowId);

                if (sqlCon.State == System.Data.ConnectionState.Closed)
                {
                    sqlCon.Open();
                }
                int a = (Int32)cmd.ExecuteScalar();

                if (a > 0)
                {
                    message.isSuccess = "true";
                }
                else
                {
                    message.isSuccess = "false";
                }
                return new JsonResult(message);
            }
            catch (Exception e)
            {
                throw new MyAppException(e.Message);
            }
            finally
            {
                sqlCon.Close();
            }

        }

        [HttpPost]
        public JsonResult Add_Reversal_Amount_Breakdown(AssetPricing data)
        {
            MessageModel message = new MessageModel();
            try
            {

                SqlCommand cmd = new SqlCommand("SP_OVI_Insert_Other_Reversal_Approval", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Idenflag", "InsertReversalAmountBreakdown");
                cmd.Parameters.AddWithValue("@Reversal_Approval_Customer_Details_ID", data.CustomerId);
                cmd.Parameters.AddWithValue("@Limit_OS", data.Limit_OS);
                cmd.Parameters.AddWithValue("@From_Date", data.From_Date);
                cmd.Parameters.AddWithValue("@To_Date", data.To_Date);
                cmd.Parameters.AddWithValue("@NoOfDays", data.NoOfDays);
                cmd.Parameters.AddWithValue("@Actual_Int", data.Actual_Int);
                cmd.Parameters.AddWithValue("@Penal_Int_Amount", data.Penal_Int_Amount);
                cmd.Parameters.AddWithValue("@RowId", data.RowId);
                cmd.Parameters.AddWithValue("@CreatedBy", HttpContext.Session.GetString("EmpId").ToString().ToUpper());

                if (sqlCon.State == System.Data.ConnectionState.Closed)
                {
                    sqlCon.Open();
                }
                int a = (Int32)cmd.ExecuteScalar();

                if (a > 0)
                {
                    message.isSuccess = "true";
                }
                else
                {
                    message.isSuccess = "false";
                }
                return new JsonResult(message);
            }
            catch (Exception e)
            {
                throw new MyAppException(e.Message);
            }
            finally
            {
                sqlCon.Close();
            }

        }


        [HttpPost]
        public JsonResult Add_Reversal_Facility_Details(AssetPricing data)
        {
            MessageModel message = new MessageModel();
            try
            {

                SqlCommand cmd = new SqlCommand("SP_OVI_Insert_Other_Reversal_Approval", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Idenflag", "InsertReversal_FacilityDetails");
                cmd.Parameters.AddWithValue("@Reversal_Approval_Customer_Details_ID", data.CustomerId);
                cmd.Parameters.AddWithValue("@FacilityDetails", data.FacilityType);
                cmd.Parameters.AddWithValue("@Amount", data.ExistingAmount);
                cmd.Parameters.AddWithValue("@RowId", data.RowId);
                cmd.Parameters.AddWithValue("@CreatedBy", HttpContext.Session.GetString("EmpId").ToString().ToUpper());

                if (sqlCon.State == System.Data.ConnectionState.Closed)
                {
                    sqlCon.Open();
                }
                int a = (Int32)cmd.ExecuteScalar();

                if (a > 0)
                {
                    message.isSuccess = "true";
                }
                else
                {
                    message.isSuccess = "false";
                }
                return new JsonResult(message);
            }
            catch (Exception e)
            {
                throw new MyAppException(e.Message);
            }
            finally
            {
                sqlCon.Close();
            }
        }

        [HttpPost]
        public JsonResult Add_Reversal_Approver_Details(AssetPricing data)
        {
            try
            {
                MessageModel message = new MessageModel();

                SqlCommand cmd = new SqlCommand("SP_OVI_Insert_Other_Reversal_Approval", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Idenflag", "Insert_Reversal_ApproverDetails");
                cmd.Parameters.AddWithValue("@Reversal_Approval_Customer_Details_ID", data.CustomerId);
                cmd.Parameters.AddWithValue("@ApproverADID", data.ApproverADID);
                cmd.Parameters.AddWithValue("@LevelNumber", data.LevelNumber);
                cmd.Parameters.AddWithValue("@Status", data.Status);
                cmd.Parameters.AddWithValue("@CommercialTypeMain", "Reversal Approval");
                cmd.Parameters.AddWithValue("@CreatedBy", HttpContext.Session.GetString("EmpId").ToString());
                if (sqlCon.State == System.Data.ConnectionState.Closed)
                {
                    sqlCon.Open();
                }
                SqlDataAdapter sda = new SqlDataAdapter(cmd);
                DataSet dt = new DataSet();
                sda.Fill(dt);


                if (dt.Tables.Count > 0)
                {
                    message.isSuccess = "true";
                    if (data.LevelNumber == 1)
                    {
                        MailRepository mailRepository = new MailRepository();
                        string result = mailRepository.SendMail(dt);
                    }
                }
                else
                {
                    message.isSuccess = "false";
                }
                return new JsonResult(message);
            }
            catch (Exception e)
            {
                throw new MyAppException(e.Message);
            }
            finally
            {
                sqlCon.Close();
            }
        }


        [HttpGet]
        public DataTable Get_ReversalApprovalGridData(int ProposalNumber, int LS_ClientId)
        {
            try
            {

                SqlCommand cmd = new SqlCommand("SP_OVI_Get_ReversalApproval_Details", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserId", HttpContext.Session.GetString("EmpId").ToString());
                cmd.Parameters.AddWithValue("@ProposalNumber", ProposalNumber);
                //cmd.Parameters.AddWithValue("@ClientId", LS_ClientId);
                if (sqlCon.State == System.Data.ConnectionState.Closed)
                {
                    sqlCon.Open();
                }
                SqlDataAdapter sda = new SqlDataAdapter(cmd);
                DataTable dt = new DataTable();
                sda.Fill(dt);

                return dt;
            }
            catch (Exception e)
            {
                throw new MyAppException(e.Message);
            }
            finally
            {
                sqlCon.Close();
            }

        }
        [HttpGet]
        public DataSet Get_ReversalApprovalCustomerDetails(int CustomerId)
        {
            try
            {

                SqlCommand cmd = new SqlCommand("SP_OVI_Get_ReversalApprovalCustomerDetails", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@CustomerId", CustomerId);
                cmd.Parameters.AddWithValue("@UserId", HttpContext.Session.GetString("EmpId").ToString());
                if (sqlCon.State == System.Data.ConnectionState.Closed)
                {
                    sqlCon.Open();
                }
                SqlDataAdapter sda = new SqlDataAdapter(cmd);
                DataSet ds = new DataSet();
                sda.Fill(ds);
                ds.Tables[0].TableName = "TBL_Reversal_Approval_Customer_Info";
                ds.Tables[1].TableName = "TBL_RA_Facility_Details";
                ds.Tables[2].TableName = "TBL_RA_Reversal_Details";
                ds.Tables[3].TableName = "TBL_RA_ReversalBreakdown_Details";
                ds.Tables[4].TableName = "TBL_RA_Aprrover";

                return ds;
            }
            catch (Exception e)
            {
                throw new MyAppException(e.Message);
            }
            finally
            {
                sqlCon.Close();
            }
        }

        [HttpPost]
        public JsonResult Update_Reversal_ApprovalStatus(AssetPricing data)
        {
            MessageModel message = new MessageModel();
            try
            {

                SqlCommand cmd = new SqlCommand("SP_OVI_Update_Reversal_ApproveStatus", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@CustomerId", Convert.ToInt32(data.CustomerId));
                cmd.Parameters.AddWithValue("@Action", data.Action);
                cmd.Parameters.AddWithValue("@Remark", data.Remark);
                cmd.Parameters.AddWithValue("@ApproverADId", HttpContext.Session.GetString("EmpId").ToString());
                cmd.Parameters.AddWithValue("@CommercialTypeMain", "Reversal Approval");
                if (sqlCon.State == System.Data.ConnectionState.Closed)
                {
                    sqlCon.Open();
                }
                SqlDataAdapter sda = new SqlDataAdapter(cmd);
                DataSet dt = new DataSet();
                sda.Fill(dt);

                if (dt.Tables.Count > 0)
                {
                    message.isSuccess = "true";

                    MailRepository mailRepository = new MailRepository();
                    string result = mailRepository.SendMail(dt);

                    if (data.Action == "Approve")
                    {
                        _dashboardRepository.CaptureProductivityDetails(HttpContext.Session.GetString("EmpName").ToString().Trim(), "Commercial-Reversal Approval", "OneViewIndicator-RM", 1, "Approve", "Supervisor Approved Reversal approval proposal");
                        message.Msg = "Record Approved Successfully";
                    }
                    else if (data.Action == "Reject")
                    {
                        _dashboardRepository.CaptureProductivityDetails(HttpContext.Session.GetString("EmpName").ToString().Trim(), "Commercial-Reversal Approval", "OneViewIndicator-RM", 1, "Reject", "Supervisor Rejected Reversal approval proposal");
                        message.Msg = "Record Rejected Successfully";
                    }
                    else
                    {
                        _dashboardRepository.CaptureProductivityDetails(HttpContext.Session.GetString("EmpName").ToString().Trim(), "Commercial-Reversal Approval", "OneViewIndicator-RM", 1, "Send Back", "Supervisor sent Back Reversal approval proposal");
                        message.Msg = "Record send Back Successfully";
                    }
                }
                else
                {
                    message.isSuccess = "false";
                    message.Msg = "Something went wrong..Please try again later";
                }

                return new JsonResult(message);
            }
            catch (Exception e)
            {
                throw new MyAppException(e.Message);
            }
            finally
            {
                sqlCon.Close();
            }
        }

        public JsonResult Add_AccountCustomization_Approver_Details(AssetPricing data)
        {
            MessageModel message = new MessageModel();
            try
            {

                SqlCommand cmd = new SqlCommand("SP_OVI_Insert_Other_AccountCustomisation", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Idenflag", "InsertApproverDetails");
                cmd.Parameters.AddWithValue("@Account_Customisation_Customer_Details_ID", data.CustomerId);
                cmd.Parameters.AddWithValue("@ApproverADID", data.ApproverADID);
                cmd.Parameters.AddWithValue("@LevelNumber", data.LevelNumber);
                cmd.Parameters.AddWithValue("@Status", data.Status);
                cmd.Parameters.AddWithValue("@CreatedBy", HttpContext.Session.GetString("EmpId").ToString());
                cmd.Parameters.AddWithValue("@CommercialTypeMain", "Account Customisation");
                if (sqlCon.State == System.Data.ConnectionState.Closed)
                {
                    sqlCon.Open();
                }

                SqlDataAdapter sda = new SqlDataAdapter(cmd);
                DataSet dt = new DataSet();
                sda.Fill(dt);

                if (dt.Tables.Count > 0)
                {
                    if (data.LevelNumber == 1)
                    {
                        MailRepository mailRepository = new MailRepository();
                        string result = mailRepository.SendMail(dt);
                    }
                    message.isSuccess = "true";
                }
                else
                {
                    message.isSuccess = "false";
                }
                return new JsonResult(message);
            }
            catch (Exception e)
            {
                throw new MyAppException(e.Message);
            }
            finally
            {
                sqlCon.Close();
            }
        }

        [HttpPost]
        public JsonResult Add_Waiver_Details(AssetPricing data)
        {
            MessageModel message = new MessageModel();
            try
            {

                SqlCommand cmd = new SqlCommand("SP_OVI_Insert_Other_AccountCustomisation", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Idenflag", "InsertWaiverDetails");
                cmd.Parameters.AddWithValue("@ClientId", data.ClientId);
                cmd.Parameters.AddWithValue("@AccountNumber", data.AccountNumber);
                cmd.Parameters.AddWithValue("@ProductCode", data.ProductCode);
                cmd.Parameters.AddWithValue("@CustomerName", data.CustomerName);
                cmd.Parameters.AddWithValue("@ChargesType", data.ChargesType);
                cmd.Parameters.AddWithValue("@TypeOfWaiver", data.WaiverType);
                cmd.Parameters.AddWithValue("@Value", data.WaiverValues);
                cmd.Parameters.AddWithValue("@NumberofTransactions", data.TxnNumber);
                cmd.Parameters.AddWithValue("@AMBCommitment", data.AMBCommitment);
                cmd.Parameters.AddWithValue("@RowId", data.RowId);
                cmd.Parameters.AddWithValue("@CreatedBy", HttpContext.Session.GetString("EmpId").ToString());
                cmd.Parameters.AddWithValue("@CustomerId", data.CustomerId);
                if (sqlCon.State == System.Data.ConnectionState.Closed)
                {
                    sqlCon.Open();
                }

                int a = (Int32)cmd.ExecuteScalar();

                if (a > 0)
                {
                    message.isSuccess = "true";
                }
                else
                {
                    message.isSuccess = "false";
                }
                return new JsonResult(message);
            }
            catch (Exception e)
            {
                throw new MyAppException(e.Message);
            }
            finally
            {
                sqlCon.Close();
            }
        }
        [HttpGet]
        public DataTable GetWaiverAccordingToAccountNumber(string AccNo, string createdBy, int customerId)
        {
            try
            {
                if (createdBy == "" || createdBy == null)
                {
                    createdBy = HttpContext.Session.GetString("EmpId").ToString();
                }


                SqlCommand cmd = new SqlCommand("SP_OVI_Insert_Other_AccountCustomisation", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Idenflag", "GetWaiverAccordingToAccountNumber");
                cmd.Parameters.AddWithValue("@CreatedBy", createdBy);
                cmd.Parameters.AddWithValue("@AccountNumber", AccNo);
                cmd.Parameters.AddWithValue("@CustomerId", customerId);
                if (sqlCon.State == System.Data.ConnectionState.Closed)
                {
                    sqlCon.Open();
                }
                SqlDataAdapter sda = new SqlDataAdapter(cmd);
                DataTable dt = new DataTable();
                sda.Fill(dt);

                return dt;
            }
            catch (Exception e)
            {
                throw new MyAppException(e.Message);
            }
            finally
            {
                sqlCon.Close();
            }
        }

        [HttpGet]
        public DataTable GetWaiversForEdit(string AccNo, string Identflag, string createdBy)
        {
            try
            {

                SqlCommand cmd = new SqlCommand("SP_OVI_Insert_Other_AccountCustomisation", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Idenflag", Identflag);
                cmd.Parameters.AddWithValue("@CreatedBy", createdBy);
                cmd.Parameters.AddWithValue("@AccountNumber", AccNo);

                if (sqlCon.State == System.Data.ConnectionState.Closed)
                {
                    sqlCon.Open();
                }
                SqlDataAdapter sda = new SqlDataAdapter(cmd);
                DataTable dt = new DataTable();
                sda.Fill(dt);

                return dt;
            }
            catch (Exception e)
            {
                throw new MyAppException(e.Message);
            }
            finally
            {
                sqlCon.Close();
            }
        }
        [HttpGet]
        public JsonResult ClearWaiverTempRecords()
        {
            try
            {
                MessageModel message = new MessageModel();

                SqlCommand cmd = new SqlCommand("SP_OVI_Insert_Other_AccountCustomisation", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Idenflag", "DeleteTempRecords");
                cmd.Parameters.AddWithValue("@CreatedBy", HttpContext.Session.GetString("EmpId").ToString());

                if (sqlCon.State == System.Data.ConnectionState.Closed)
                {
                    sqlCon.Open();
                }
                int a = cmd.ExecuteNonQuery();
                if (a > 0)
                {
                    message.isSuccess = "true";
                }
                else
                {
                    message.isSuccess = "false";
                }
                return new JsonResult(message);
            }
            catch (Exception e)
            {
                throw new MyAppException(e.Message);
            }
            finally
            {
                sqlCon.Close();
            }
        }
        [HttpGet]
        public JsonResult DeleteWaiverById(int WaiverId)
        {
            MessageModel message = new MessageModel();
            try
            {

                SqlCommand cmd = new SqlCommand("SP_OVI_Insert_Other_AccountCustomisation", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Idenflag", "DeleteWaiverById");
                cmd.Parameters.AddWithValue("@WaiverId", WaiverId);

                if (sqlCon.State == System.Data.ConnectionState.Closed)
                {
                    sqlCon.Open();
                }
                int a = cmd.ExecuteNonQuery();
                if (a > 0)
                {
                    message.isSuccess = "true";
                }
                else
                {
                    message.isSuccess = "false";
                }
                return new JsonResult(message);
            }
            catch (Exception e)
            {
                throw new MyAppException(e.Message);
            }
            finally
            {
                sqlCon.Close();
            }

        }

        [HttpGet]
        public DataTable GetAccountCustomisationGridData(string ProposalNumber, string ClientId)
        {
            try
            {

                SqlCommand cmd = new SqlCommand("SP_OVI_Get_AccountCustomisationGridData", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserId", HttpContext.Session.GetString("EmpId").ToString());
                cmd.Parameters.AddWithValue("@ProposalNumber", ProposalNumber);
                cmd.Parameters.AddWithValue("@LS_ClientID", ClientId);
                if (sqlCon.State == System.Data.ConnectionState.Closed)
                {
                    sqlCon.Open();
                }
                SqlDataAdapter sda = new SqlDataAdapter(cmd);
                DataTable dt = new DataTable();
                sda.Fill(dt);

                return dt;
            }
            catch (Exception e)
            {
                throw new MyAppException(e.Message);
            }
            finally
            {
                sqlCon.Close();
            }
        }

        [HttpGet]
        public DataSet Get_AccountCustomisationCustomerDetails(int CustomerId)
        {
            try
            {

                SqlCommand cmd = new SqlCommand("SP_OVI_Get_AccountCustomisationCustomerDetails", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserId", HttpContext.Session.GetString("EmpId").ToString());
                cmd.Parameters.AddWithValue("@CustomerId", CustomerId);
                if (sqlCon.State == System.Data.ConnectionState.Closed)
                {
                    sqlCon.Open();
                }
                SqlDataAdapter sda = new SqlDataAdapter(cmd);
                DataSet ds = new DataSet();
                sda.Fill(ds);
                ds.Tables[0].TableName = "TBL_OVI_AC_Customer_Details";
                ds.Tables[1].TableName = "TBL_OVI_AC_Approver";
                ds.Tables[2].TableName = "TBL_OVI_AC_Waiver_Details";

                return ds;
            }
            catch (Exception e)
            {
                throw new MyAppException(e.Message);
            }
            finally
            {
                sqlCon.Close();
            }
        }

        [HttpPost]
        public JsonResult Update_AccountCustomisation_ApprovalStatus(AssetPricing data)
        {
            try
            {
                MessageModel message = new MessageModel();

                SqlCommand cmd = new SqlCommand("SP_OVI_Update_AccountCustomisation_ApproveStatus", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@CustomerId", Convert.ToInt32(data.CustomerId));
                cmd.Parameters.AddWithValue("@Action", data.Action);
                cmd.Parameters.AddWithValue("@Remark", data.Remark);
                cmd.Parameters.AddWithValue("@ApproverADId", HttpContext.Session.GetString("EmpId").ToString());
                cmd.Parameters.AddWithValue("@CommercialTypeMain", "Account Customisation");
                if (sqlCon.State == System.Data.ConnectionState.Closed)
                {
                    sqlCon.Open();
                }
                DataSet dt = new DataSet();
                SqlDataAdapter sda = new SqlDataAdapter(cmd);
                sda.Fill(dt);
                if (dt.Tables[0].Rows.Count > 0)
                {
                    message.isSuccess = "true";
                    MailRepository mailRepository = new MailRepository();
                    string result = mailRepository.SendMail(dt);
                    if (data.Action == "Approve")
                    {
                        _dashboardRepository.CaptureProductivityDetails(HttpContext.Session.GetString("EmpName").ToString().Trim(), "Commercial-Account Customisation", "OneViewIndicator-RM", 1, "Approve", "Supervisor Approved Account Customisation proposal");
                        message.Msg = "Record Approved Successfully";
                    }
                    else if (data.Action == "Reject")
                    {
                        _dashboardRepository.CaptureProductivityDetails(HttpContext.Session.GetString("EmpName").ToString().Trim(), "Commercial-Account Customisation", "OneViewIndicator-RM", 1, "Reject", "Supervisor Rejected Account Customisation proposal");
                        message.Msg = "Record Rejected Successfully";
                    }
                    else
                    {
                        _dashboardRepository.CaptureProductivityDetails(HttpContext.Session.GetString("EmpName").ToString().Trim(), "Commercial-Account Customisation", "OneViewIndicator-RM", 1, "send Back", "Supervisor Sent Back Account Customisation proposal");
                        message.Msg = "Record send Back Successfully";
                    }
                }
                else
                {
                    message.isSuccess = "false";
                    message.Msg = "Something went wrong..Please try again later";
                }

                return new JsonResult(message);
            }
            catch (Exception e)
            {
                throw new MyAppException(e.Message);
            }
            finally
            {
                sqlCon.Close();
            }
        }

        [HttpPost]
        public JsonResult Update_TableSaveStatus(TradePricing data)
        {
            try
            {
                MessageModel message = new MessageModel();

                SqlCommand cmd = new SqlCommand("SP_OVI_Update_TableSaveStatus", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@CustomerId", Convert.ToInt32(data.CustomerId));
                cmd.Parameters.AddWithValue("@Action", data.Action);
                if (sqlCon.State == System.Data.ConnectionState.Closed)
                {
                    sqlCon.Open();
                }
                int a = cmd.ExecuteNonQuery();
                if (a > 0)
                {
                    message.isSuccess = "true";
                }
                else
                {
                    message.isSuccess = "false";
                }

                return new JsonResult(message);
            }
            catch (Exception e)
            {
                throw new MyAppException(e.Message);
            }
            finally
            {
                sqlCon.Close();
            }

        }


        [HttpPost]
        public ActionResult DeleteAllTableRows(string Customer_Info_ID, string Identflag, string SP_Name, string status)
        {
            try
            {
                MessageModel message = new MessageModel();

                SqlCommand cmd = new SqlCommand(SP_Name, sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Customer_Info_ID", Convert.ToInt32(Customer_Info_ID));
                cmd.Parameters.AddWithValue("@Identflag", Identflag);
                cmd.Parameters.AddWithValue("@status", status);
                if (sqlCon.State == System.Data.ConnectionState.Closed)
                {
                    sqlCon.Open();
                }
                int a = cmd.ExecuteNonQuery();
                if (a > 0)
                {
                    message.isSuccess = "true";
                }
                else
                {
                    message.isSuccess = "false";
                }

                return new JsonResult(message);
            }
            catch (Exception e)
            {
                throw new MyAppException(e.Message);
            }
            finally
            {
                sqlCon.Close();
            }

        }

        [HttpGet]
        public DataTable GetProposalApprovedDaysDiffence(int CustomerId)
        {
            try
            {
                SqlCommand cmd = new SqlCommand("SP_OVI_GetProposalApprovalDateDetails", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@AP_Customer_Info_ID", CustomerId);
                if (sqlCon.State == System.Data.ConnectionState.Closed)
                {
                    sqlCon.Open();
                }
                SqlDataAdapter sda = new SqlDataAdapter(cmd);
                DataTable dt = new DataTable();
                sda.Fill(dt);

                return dt;
            }
            catch (Exception e)
            {
                throw new MyAppException(e.Message);
            }
            finally
            {
                sqlCon.Close();
            }
        }

        [HttpGet]
        public DataTable CheckClientIdInProgress(int clientId)
        {
            try
            {
                SqlCommand cmd = new SqlCommand("SP_OVI_ClientId_InProgress", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@ClientId", clientId);
                if (sqlCon.State == System.Data.ConnectionState.Closed)
                {
                    sqlCon.Open();
                }
                SqlDataAdapter sda = new SqlDataAdapter(cmd);
                DataTable dt = new DataTable();
                sda.Fill(dt);

                return dt;
            }
            catch (Exception e)
            {
                throw new MyAppException(e.Message);
            }
            finally
            {
                sqlCon.Close();
            }
        }

    }

}