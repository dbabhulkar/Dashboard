USE [master]
GO
/****** Object:  Database [Hunt]    Script Date: 21-09-2024 20:42:43 ******/
CREATE DATABASE [Hunt]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'Hunt', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.SQLEXPRESS\MSSQL\DATA\Hunt.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'Hunt_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.SQLEXPRESS\MSSQL\DATA\Hunt_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO
ALTER DATABASE [Hunt] SET COMPATIBILITY_LEVEL = 160
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [Hunt].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [Hunt] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [Hunt] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [Hunt] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [Hunt] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [Hunt] SET ARITHABORT OFF 
GO
ALTER DATABASE [Hunt] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [Hunt] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [Hunt] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [Hunt] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [Hunt] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [Hunt] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [Hunt] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [Hunt] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [Hunt] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [Hunt] SET  DISABLE_BROKER 
GO
ALTER DATABASE [Hunt] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [Hunt] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [Hunt] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [Hunt] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [Hunt] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [Hunt] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [Hunt] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [Hunt] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [Hunt] SET  MULTI_USER 
GO
ALTER DATABASE [Hunt] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [Hunt] SET DB_CHAINING OFF 
GO
ALTER DATABASE [Hunt] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [Hunt] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [Hunt] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [Hunt] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
ALTER DATABASE [Hunt] SET QUERY_STORE = ON
GO
ALTER DATABASE [Hunt] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [Hunt]
GO
/****** Object:  Table [dbo].[LoginAttempts]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LoginAttempts](
	[Id] [numeric](18, 0) NOT NULL,
	[Empcode] [varchar](50) NULL,
	[Empname] [varchar](150) NULL,
	[LoginTime] [datetime] NULL,
	[LogoutTime] [datetime] NULL,
	[Attempts] [int] NULL,
	[ProfileId] [int] NULL,
	[ProfileName] [varchar](150) NULL,
	[Brcode] [int] NULL,
	[Brname] [varchar](150) NULL,
	[IpAddress] [varchar](150) NULL,
	[AssetCode] [varchar](50) NULL,
	[Flag] [varchar](50) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ProfileMaster]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ProfileMaster](
	[ProfileId] [numeric](18, 0) NOT NULL,
	[ProfileShortCode] [varchar](50) NULL,
	[ProfileName] [varchar](150) NULL,
	[ProfileDescription] [varchar](500) NULL,
	[Maker] [varchar](50) NULL,
	[MakerDate] [datetime] NULL,
	[Authorised] [bit] NULL,
	[Authoriser] [varchar](50) NULL,
	[AuthoriseDate] [datetime] NULL,
	[Flag] [varchar](50) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tbl_API_Adda_Activity_Log_Tracker]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tbl_API_Adda_Activity_Log_Tracker](
	[Emp_Code] [varchar](50) NULL,
	[Form_Name] [varchar](50) NULL,
	[Module_Name] [varchar](50) NULL,
	[Total_Count] [int] NULL,
	[Activity] [varchar](50) NULL,
	[Activity_Details] [varchar](100) NULL,
	[Activity_Date] [datetime] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tbl_API_ADDA_Feedback]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tbl_API_ADDA_Feedback](
	[Feedback_Id] [int] NOT NULL,
	[Integration_Id] [int] NULL,
	[Feedback_Details] [varchar](max) NULL,
	[Status] [int] NULL,
	[Created_By] [varchar](30) NULL,
	[Created_Date] [datetime] NULL,
	[IsActive] [bit] NULL,
	[Updated_By] [varchar](30) NULL,
	[Updated_Date] [datetime] NULL,
	[AssignTo] [nvarchar](20) NULL,
	[AssignFrom] [nvarchar](20) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tbl_API_Adda_Misccd]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tbl_API_Adda_Misccd](
	[MisccdId] [int] NULL,
	[CDTP] [varchar](250) NULL,
	[CDValDesc] [varchar](500) NULL,
	[Seq] [int] NULL,
	[Status] [int] NULL,
	[LUSR] [varchar](20) NULL,
	[LUDT] [varchar](20) NULL,
	[LUTM] [varchar](20) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tbl_API_ADDA_USER]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tbl_API_ADDA_USER](
	[Id] [int] NOT NULL,
	[EmpCode] [varchar](25) NULL,
	[Role] [varchar](20) NULL,
	[EmailId] [varchar](150) NULL,
	[IsActive] [int] NULL,
	[LastSuccessLoginDate] [datetime] NULL,
	[CreatedBy] [varchar](25) NULL,
	[CreatedDate] [datetime] NULL,
	[UpdateBy] [varchar](25) NULL,
	[UpdatedDate] [datetime] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tbl_API_ApplicationsSPOC]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tbl_API_ApplicationsSPOC](
	[Id] [int] NOT NULL,
	[APPID] [int] NULL,
	[APPShortName] [varchar](100) NULL,
	[SPOCDepartment] [varchar](30) NULL,
	[SpocEMPCode] [varchar](20) NULL,
	[SPOCName] [varchar](150) NULL,
	[EmailAddress] [varchar](250) NULL,
	[SPOCLevel] [varchar](150) NULL,
	[status] [int] NULL,
	[CreatedBy] [varchar](25) NULL,
	[CreatedDate] [datetime] NULL,
	[UpdateBy] [varchar](25) NULL,
	[UpdatedDate] [datetime] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TBL_API_EXTERNALSERVICES]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TBL_API_EXTERNALSERVICES](
	[EXTERNALSERVICE_ID] [int] NOT NULL,
	[COD_SERVICE_ID] [varchar](max) NULL,
	[SERVICE_SIGNATURE] [varchar](max) NULL,
	[NAM_SERVICE_MIDDLEWARE] [varchar](50) NULL,
	[SERVICE_DESC] [varchar](max) NULL,
	[SERVICE_PROVIDER] [varchar](max) NULL,
	[SERVICE_INTERFACE_TYPE] [varchar](50) NULL,
	[SERVICE_CATEGORY] [varchar](max) NULL,
	[SERVICE_TYPE] [varchar](100) NULL,
	[ORCHESTRATED_SERVICE_DTLS] [varchar](max) NULL,
	[OBP_SERVICE_URL_UAT] [varchar](max) NULL,
	[OBP_SERVICE_URL_PSUPP] [varchar](max) NULL,
	[OBP_SERVICE_URL_PROD] [varchar](max) NULL,
	[OBP_WSDL_URL] [varchar](max) NULL,
	[PRODUCT_PROCESSOR_WSDL] [varchar](max) NULL,
	[SERVICE_VERSION] [varchar](max) NULL,
	[NAM_CONTAINER] [varchar](max) NULL,
	[NAM_DOMAIN] [varchar](max) NULL,
	[OBP_REQUEST] [varchar](max) NULL,
	[OBP_RESPONSE] [varchar](max) NULL,
	[PRODUCT_PROCESSOR_URL_UAT] [varchar](max) NULL,
	[PRODUCT_PROCESSOR_URL_PSUPP] [varchar](max) NULL,
	[PRODUCT_PROCESSOR_URL_PROD] [varchar](max) NULL,
	[TXT_ERROR_DESC] [varchar](max) NULL,
	[CONNECT_TIMEOUT_VALUE] [varchar](max) NULL,
	[SOCKET_TIMEOUT_VALUE] [varchar](max) NULL,
	[NAM_WORKMANAGER] [varchar](max) NULL,
	[WORKMANAGER_MAX_THREADS] [varchar](max) NULL,
	[WORKMANAGER_CAPACITY] [varchar](max) NULL,
	[TXT_SECURITY_FEATURE_DESC] [varchar](max) NULL,
	[SERVICE_DOC_PATH] [varchar](max) NULL,
	[NAM_INITIATOR] [varchar](max) NULL,
	[DAT_GO_LIVE] [varchar](max) NULL,
	[JIRA_ID] [varchar](max) NULL,
	[TXT_REMARKS] [varchar](max) NULL,
	[FILLER_01] [varchar](max) NULL,
	[FILLER_02] [varchar](max) NULL,
	[FILLER_03] [varchar](max) NULL,
	[FILLER_04] [varchar](max) NULL,
	[FILLER_05] [varchar](max) NULL,
	[FILLER_06] [varchar](max) NULL,
	[FILLER_07] [varchar](max) NULL,
	[FILLER_08] [varchar](max) NULL,
	[FILLER_09] [varchar](max) NULL,
	[FILLER_10] [varchar](max) NULL,
	[FLG_MNT_STATUS] [varchar](max) NULL,
	[COD_MNT_ACTION] [varchar](max) NULL,
	[COD_LAST_MNT_MAKERID] [varchar](max) NULL,
	[COD_LAST_MNT_CHKRID] [varchar](max) NULL,
	[DAT_LAST_MNT] [varchar](max) NULL,
	[CTR_UPDAT_SRLNO] [varchar](max) NULL,
	[API_CAT] [varchar](50) NULL,
	[VIRTUALIZED] [varchar](max) NULL,
	[AUTOMATED] [varchar](max) NULL,
	[DEPRICATED_API] [varchar](max) NULL,
	[REQUEST_SAMPLE] [varchar](max) NULL,
	[RESPONSE_SAMPLE] [varchar](max) NULL,
	[DOC_TYPE] [varchar](max) NULL,
	[DOMAIN_NAME] [varchar](50) NULL,
	[API_TYPE_] [varchar](100) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Tbl_API_FilePath]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Tbl_API_FilePath](
	[Tbl_API_FilePath_Id] [int] NOT NULL,
	[FileName] [varchar](8000) NULL,
	[TBL_API_Main_ID] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[UpdateDate] [datetime] NULL,
	[Active] [bit] NULL,
	[OBP_SERVICE_URL_UAT] [varchar](8000) NULL,
	[APIAddFiles] [varchar](8000) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TBL_API_Main]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TBL_API_Main](
	[TBL_API_Main_ID] [int] NOT NULL,
	[COD_SERVICE_ID] [varchar](max) NULL,
	[SERVICE_SIGNATURE] [varchar](max) NULL,
	[NAM_SERVICE_MIDDLEWARE] [varchar](100) NULL,
	[SERVICE_DESC] [varchar](max) NULL,
	[SERVICE_PROVIDER] [varchar](100) NULL,
	[SERVICE_INTERFACE_TYPE] [varchar](100) NULL,
	[SERVICE_CATEGORY] [varchar](100) NULL,
	[SERVICE_TYPE] [varchar](100) NULL,
	[ORCHESTRATED_SERVICE_DTLS] [varchar](max) NULL,
	[OBP_SERVICE_URL_UAT] [varchar](max) NULL,
	[OBP_SERVICE_URL_PSUPP] [varchar](max) NULL,
	[OBP_SERVICE_URL_PROD] [varchar](max) NULL,
	[OBP_WSDL_URL] [varchar](max) NULL,
	[PRODUCT_PROCESSOR_WSDL] [varchar](max) NULL,
	[SERVICE_VERSION] [int] NULL,
	[NAM_CONTAINER] [varchar](100) NULL,
	[NAM_DOMAIN] [varchar](100) NULL,
	[OBP_REQUEST] [varchar](max) NULL,
	[OBP_RESPONSE] [varchar](max) NULL,
	[PRODUCT_PROCESSOR_URL_UAT] [varchar](max) NULL,
	[PRODUCT_PROCESSOR_URL_PSUPP] [varchar](max) NULL,
	[PRODUCT_PROCESSOR_URL_PROD] [varchar](max) NULL,
	[TXT_ERROR_DESC] [varchar](max) NULL,
	[CONNECT_TIMEOUT_VALUE] [varchar](100) NULL,
	[SOCKET_TIMEOUT_VALUE] [varchar](100) NULL,
	[NAM_WORKMANAGER] [varchar](max) NULL,
	[WORKMANAGER_MAX_THREADS] [varchar](max) NULL,
	[WORKMANAGER_CAPACITY] [varchar](max) NULL,
	[TXT_SECURITY_FEATURE_DESC] [varchar](max) NULL,
	[SERVICE_DOC_PATH] [varchar](max) NULL,
	[NAM_INITIATOR] [varchar](max) NULL,
	[DAT_GO_LIVE] [datetime] NULL,
	[JIRA_ID] [varchar](max) NULL,
	[TXT_REMARKS] [varchar](max) NULL,
	[FILLER_01] [varchar](max) NULL,
	[FILLER_02] [varchar](max) NULL,
	[FILLER_03] [varchar](max) NULL,
	[FILLER_04] [varchar](max) NULL,
	[FILLER_05] [varchar](max) NULL,
	[FILLER_06] [varchar](max) NULL,
	[FILLER_07] [varchar](max) NULL,
	[FILLER_08] [varchar](max) NULL,
	[FILLER_09] [varchar](max) NULL,
	[FILLER_10] [varchar](max) NULL,
	[FLG_MNT_STATUS] [varchar](max) NULL,
	[COD_MNT_ACTION] [varchar](max) NULL,
	[COD_LAST_MNT_MAKERID] [varchar](max) NULL,
	[COD_LAST_MNT_CHKRID] [varchar](max) NULL,
	[DAT_LAST_MNT] [datetime] NULL,
	[CTR_UPDAT_SRLNO] [bit] NULL,
	[API_CAT] [varchar](max) NULL,
	[VIRTUALIZED] [varchar](max) NULL,
	[AUTOMATED] [varchar](max) NULL,
	[DEPRICATED_API] [varchar](max) NULL,
	[REQUEST_SAMPLE] [varchar](max) NULL,
	[RESPONSE_SAMPLE] [varchar](max) NULL,
	[DOC_TYPE] [varchar](max) NULL,
	[DOMAIN_NAME] [varchar](100) NULL,
	[API_TYPE] [varchar](max) NULL,
	[FileName] [varchar](max) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Tbl_API_Main_Schedule_ActivityLog]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Tbl_API_Main_Schedule_ActivityLog](
	[Id] [bigint] NOT NULL,
	[Errormsg] [varchar](max) NULL,
	[Status] [varchar](100) NULL,
	[ModuleName] [varchar](50) NULL,
	[InsertedOn] [datetime] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TBL_API_Main_Scheduler_Data]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TBL_API_Main_Scheduler_Data](
	[COD_SERVICE_ID] [varchar](max) NULL,
	[SERVICE_SIGNATURE] [varchar](max) NULL,
	[NAM_SERVICE_MIDDLEWARE] [varchar](100) NULL,
	[SERVICE_DESC] [varchar](max) NULL,
	[SERVICE_PROVIDER] [varchar](100) NULL,
	[SERVICE_INTERFACE_TYPE] [varchar](100) NULL,
	[SERVICE_CATEGORY] [varchar](100) NULL,
	[SERVICE_TYPE] [varchar](100) NULL,
	[ORCHESTRATED_SERVICE_DTLS] [varchar](max) NULL,
	[OBP_SERVICE_URL_UAT] [varchar](max) NULL,
	[OBP_SERVICE_URL_PSUPP] [varchar](max) NULL,
	[OBP_SERVICE_URL_PROD] [varchar](max) NULL,
	[OBP_WSDL_URL] [varchar](max) NULL,
	[PRODUCT_PROCESSOR_WSDL] [varchar](max) NULL,
	[SERVICE_VERSION] [int] NULL,
	[NAM_CONTAINER] [varchar](100) NULL,
	[NAM_DOMAIN] [varchar](100) NULL,
	[OBP_REQUEST] [varchar](max) NULL,
	[OBP_RESPONSE] [varchar](max) NULL,
	[PRODUCT_PROCESSOR_URL_UAT] [varchar](max) NULL,
	[PRODUCT_PROCESSOR_URL_PSUPP] [varchar](max) NULL,
	[PRODUCT_PROCESSOR_URL_PROD] [varchar](max) NULL,
	[TXT_ERROR_DESC] [varchar](max) NULL,
	[CONNECT_TIMEOUT_VALUE] [varchar](100) NULL,
	[SOCKET_TIMEOUT_VALUE] [varchar](100) NULL,
	[NAM_WORKMANAGER] [varchar](max) NULL,
	[WORKMANAGER_MAX_THREADS] [varchar](max) NULL,
	[WORKMANAGER_CAPACITY] [varchar](max) NULL,
	[TXT_SECURITY_FEATURE_DESC] [varchar](max) NULL,
	[SERVICE_DOC_PATH] [varchar](max) NULL,
	[NAM_INITIATOR] [varchar](max) NULL,
	[DAT_GO_LIVE] [datetime] NULL,
	[JIRA_ID] [varchar](max) NULL,
	[TXT_REMARKS] [varchar](max) NULL,
	[FILLER_01] [varchar](max) NULL,
	[FILLER_02] [varchar](max) NULL,
	[FILLER_03] [varchar](max) NULL,
	[FILLER_04] [varchar](max) NULL,
	[FILLER_05] [varchar](max) NULL,
	[FILLER_06] [varchar](max) NULL,
	[FILLER_07] [varchar](max) NULL,
	[FILLER_08] [varchar](max) NULL,
	[FILLER_09] [varchar](max) NULL,
	[FILLER_10] [varchar](max) NULL,
	[FLG_MNT_STATUS] [varchar](max) NULL,
	[COD_MNT_ACTION] [varchar](max) NULL,
	[COD_LAST_MNT_MAKERID] [varchar](max) NULL,
	[COD_LAST_MNT_CHKRID] [varchar](max) NULL,
	[DAT_LAST_MNT] [datetime] NULL,
	[CTR_UPDAT_SRLNO] [bit] NULL,
	[API_CAT] [varchar](max) NULL,
	[VIRTUALIZED] [varchar](max) NULL,
	[AUTOMATED] [varchar](max) NULL,
	[DEPRICATED_API] [varchar](max) NULL,
	[REQUEST_SAMPLE] [varchar](max) NULL,
	[RESPONSE_SAMPLE] [varchar](max) NULL,
	[DOC_TYPE] [varchar](max) NULL,
	[DOMAIN_NAME] [varchar](100) NULL,
	[API_TYPE] [varchar](max) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TBL_API_Main_Temp]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TBL_API_Main_Temp](
	[TBL_API_Main_ID] [int] NOT NULL,
	[COD_SERVICE_ID] [varchar](max) NULL,
	[SERVICE_SIGNATURE] [varchar](max) NULL,
	[NAM_SERVICE_MIDDLEWARE] [varchar](max) NULL,
	[SERVICE_DESC] [varchar](max) NULL,
	[SERVICE_PROVIDER] [varchar](max) NULL,
	[SERVICE_INTERFACE_TYPE] [varchar](max) NULL,
	[SERVICE_CATEGORY] [varchar](max) NULL,
	[SERVICE_TYPE] [varchar](max) NULL,
	[ORCHESTRATED_SERVICE_DTLS] [varchar](max) NULL,
	[OBP_SERVICE_URL_UAT] [varchar](max) NULL,
	[OBP_SERVICE_URL_PSUPP] [varchar](max) NULL,
	[OBP_SERVICE_URL_PROD] [varchar](max) NULL,
	[OBP_WSDL_URL] [varchar](max) NULL,
	[PRODUCT_PROCESSOR_WSDL] [varchar](max) NULL,
	[SERVICE_VERSION] [int] NULL,
	[NAM_CONTAINER] [varchar](max) NULL,
	[NAM_DOMAIN] [varchar](max) NULL,
	[OBP_REQUEST] [varchar](max) NULL,
	[OBP_RESPONSE] [varchar](max) NULL,
	[PRODUCT_PROCESSOR_URL_UAT] [varchar](max) NULL,
	[PRODUCT_PROCESSOR_URL_PSUPP] [varchar](max) NULL,
	[PRODUCT_PROCESSOR_URL_PROD] [varchar](max) NULL,
	[TXT_ERROR_DESC] [varchar](max) NULL,
	[CONNECT_TIMEOUT_VALUE] [int] NULL,
	[SOCKET_TIMEOUT_VALUE] [int] NULL,
	[NAM_WORKMANAGER] [varchar](max) NULL,
	[WORKMANAGER_MAX_THREADS] [varchar](max) NULL,
	[WORKMANAGER_CAPACITY] [varchar](max) NULL,
	[TXT_SECURITY_FEATURE_DESC] [varchar](max) NULL,
	[SERVICE_DOC_PATH] [varchar](max) NULL,
	[NAM_INITIATOR] [varchar](max) NULL,
	[DAT_GO_LIVE] [datetime] NULL,
	[JIRA_ID] [varchar](max) NULL,
	[TXT_REMARKS] [varchar](max) NULL,
	[FILLER_01] [varchar](max) NULL,
	[FILLER_02] [varchar](max) NULL,
	[FILLER_03] [varchar](max) NULL,
	[FILLER_04] [varchar](max) NULL,
	[FILLER_05] [varchar](max) NULL,
	[FILLER_06] [varchar](max) NULL,
	[FILLER_07] [varchar](max) NULL,
	[FILLER_08] [varchar](max) NULL,
	[FILLER_09] [varchar](max) NULL,
	[FILLER_10] [varchar](max) NULL,
	[FLG_MNT_STATUS] [varchar](max) NULL,
	[COD_MNT_ACTION] [varchar](max) NULL,
	[COD_LAST_MNT_MAKERID] [varchar](max) NULL,
	[COD_LAST_MNT_CHKRID] [varchar](max) NULL,
	[DAT_LAST_MNT] [datetime] NULL,
	[CTR_UPDAT_SRLNO] [bit] NULL,
	[API_CAT] [varchar](max) NULL,
	[VIRTUALIZED] [varchar](max) NULL,
	[AUTOMATED] [varchar](max) NULL,
	[DEPRICATED_API] [varchar](max) NULL,
	[REQUEST_SAMPLE] [varchar](max) NULL,
	[RESPONSE_SAMPLE] [varchar](max) NULL,
	[DOC_TYPE] [varchar](max) NULL,
	[DOMAIN_NAME] [varchar](max) NULL,
	[API_TYPE] [varchar](max) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TBL_API_Master]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TBL_API_Master](
	[API_Master_ID] [int] NOT NULL,
	[Value] [varchar](500) NULL,
	[Description] [varchar](max) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TBL_API_Master_Values]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TBL_API_Master_Values](
	[Id] [int] NOT NULL,
	[API_Master_ID] [int] NULL,
	[Value] [varchar](max) NULL,
	[Description] [varchar](max) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tbl_API_MstApplications]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tbl_API_MstApplications](
	[Id] [int] NOT NULL,
	[APPShortName] [varchar](500) NULL,
	[FullName] [varchar](500) NULL,
	[Purpose] [varchar](1000) NULL,
	[ITGRCName] [varchar](500) NULL,
	[ITGRCCode] [varchar](500) NULL,
	[HostingDC] [varchar](500) NULL,
	[status] [int] NULL,
	[CreatedBy] [varchar](500) NULL,
	[CreatedDate] [datetime] NULL,
	[UpdateBy] [varchar](25) NULL,
	[UpdatedDate] [datetime] NULL,
	[HostingDC_DB] [varchar](500) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TBL_API_statusMaster]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TBL_API_statusMaster](
	[statusCode] [int] NOT NULL,
	[statusDescription] [varchar](150) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TBL_API_URLMaster]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TBL_API_URLMaster](
	[ID] [int] NOT NULL,
	[URLName] [varchar](100) NULL,
	[URL] [varchar](500) NULL,
	[Status] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TBL_APIA_APIDetails]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TBL_APIA_APIDetails](
	[API_ID] [int] NOT NULL,
	[ProjectManagerBTG] [varchar](100) NULL,
	[ProjectManagerIT] [varchar](100) NULL,
	[ProjectName] [varchar](100) NULL,
	[ProjectId] [int] NULL,
	[GoLiveDate] [datetime] NULL,
	[BusinessJustification] [varchar](max) NULL,
	[BusinessSponsor] [varchar](100) NULL,
	[ExecutiveSponsor] [varchar](100) NULL,
	[CostCenterCode] [varchar](100) NULL,
	[CollectionFileName] [varchar](100) NULL,
	[APIName] [varchar](500) NULL,
	[APIUrl] [varchar](200) NULL,
	[Host] [varchar](200) NULL,
	[Port] [int] NULL,
	[Endpoint] [varchar](100) NULL,
	[MethodName] [varchar](100) NULL,
	[APIHeader] [varchar](max) NULL,
	[RequestBody] [varchar](max) NULL,
	[ConsumerApplication] [varchar](100) NULL,
	[ProducerApplication] [varchar](100) NULL,
	[Middleware] [varchar](100) NULL,
	[API_Type] [varchar](100) NULL,
	[ServiceInterfaceType] [varchar](100) NULL,
	[ServiceCategory] [varchar](100) NULL,
	[ServiceDESC] [varchar](max) NULL,
	[ProductProcessor_WSDL] [varchar](100) NULL,
	[ProductProcessor_URL_UAT] [varchar](100) NULL,
	[ProductProcessor_URL_PSUPP] [varchar](100) NULL,
	[ProductProcessor_URL_PROD] [varchar](100) NULL,
	[IsDepricated] [bit] NULL,
	[IsOrchestrated] [bit] NULL,
	[IsStubAvailable] [bit] NULL,
	[IsHostedOnAPIGW] [bit] NULL,
	[CreatedBy] [varchar](100) NULL,
	[CreatedAt] [datetime] NULL,
	[UpdatedBy] [varchar](100) NULL,
	[UpdatedAt] [datetime] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tbl_APIA_Approval_trace_trial]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tbl_APIA_Approval_trace_trial](
	[Id] [int] NOT NULL,
	[caseID] [varchar](50) NULL,
	[ApprovalTrialID] [varchar](50) NULL,
	[Department] [varchar](100) NULL,
	[ApprovalLevel] [varchar](20) NULL,
	[ApprovalUserID] [varchar](50) NULL,
	[Sequence] [int] NULL,
	[Status] [varchar](50) NULL,
	[Feedback] [varchar](250) NULL,
	[AssignTo] [varchar](50) NULL,
	[AssignToLevel] [varchar](50) NULL,
	[AssignToDept] [varchar](50) NULL,
	[createdBy] [varchar](50) NULL,
	[createdDate] [datetime] NULL,
	[UpdatedBy] [varchar](50) NULL,
	[updatedDate] [datetime] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tbl_APIA_Audit_log]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tbl_APIA_Audit_log](
	[id] [int] NOT NULL,
	[CaseID] [int] NULL,
	[ApprovalID] [int] NULL,
	[status] [varchar](20) NULL,
	[createdBy] [varchar](20) NULL,
	[createdDate] [datetime] NULL,
	[Feedback] [varchar](250) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tbl_APIA_ExceptionLevel]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tbl_APIA_ExceptionLevel](
	[apiid] [int] NOT NULL,
	[ImpactOnbank] [varchar](50) NULL,
	[Level] [varchar](20) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tbl_APIA_ExceptionManagement]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tbl_APIA_ExceptionManagement](
	[ID] [int] NOT NULL,
	[CaseId] [varchar](100) NULL,
	[OriginalOnboardingGASID] [varchar](100) NULL,
	[ExceptionRequestor] [varchar](100) NULL,
	[APIProjectName] [varchar](100) NULL,
	[APIProjectDescription] [varchar](100) NULL,
	[PartnersToBeIntegrated] [varchar](100) NULL,
	[ProductAPIToBeConsumed] [varchar](100) NULL,
	[RequestedException] [varchar](100) NULL,
	[ReasonForException] [varchar](100) NULL,
	[StartDate] [date] NULL,
	[EndDate] [date] NULL,
	[HowExceptionToBeImplemented] [varchar](100) NULL,
	[ImpactOnBank] [varchar](100) NULL,
	[ExceptionLevel] [varchar](100) NULL,
	[createdBy] [varchar](100) NULL,
	[createdDate] [datetime] NULL,
	[updateBy] [varchar](100) NULL,
	[updatedDate] [datetime] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TBL_APIA_Integration]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TBL_APIA_Integration](
	[IntegrationId] [int] NOT NULL,
	[ProjectManagerBTG] [varchar](100) NULL,
	[ProjectManagerIT] [varchar](100) NULL,
	[ProjectName] [varchar](100) NULL,
	[ProjectId] [varchar](100) NULL,
	[PlannedGoLiveDate] [datetime] NULL,
	[BusinessJustification] [varchar](max) NULL,
	[BusinessSponsor] [varchar](100) NULL,
	[ExecutiveSponsor] [varchar](100) NULL,
	[CostCenterCode] [varchar](100) NULL,
	[UserJourneyDocumentPath] [varchar](100) NULL,
	[Feedback] [varchar](500) NULL,
	[Status] [int] NULL,
	[CreatedBy] [varchar](100) NULL,
	[CreatedAt] [datetime] NULL,
	[UpdatedBy] [varchar](100) NULL,
	[UpdatedAt] [datetime] NULL,
	[Assign] [varchar](50) NULL,
	[AssignFrom] [varchar](50) NULL,
	[IntegrationDocumentPath] [varchar](100) NULL,
	[ConsumerApplication] [varchar](100) NULL,
	[BTG_USER] [varchar](50) NULL,
	[IT_USER] [varchar](50) NULL,
	[IT_ARCHITECTURE] [varchar](50) NULL,
	[ChannelID] [varchar](50) NULL,
	[ContainerName] [nchar](10) NULL,
	[RDConceptNote] [varchar](100) NULL,
	[SequenceDiagram] [varchar](100) NULL,
	[ExpectedServiceSpecificationDocument] [varchar](100) NULL,
	[In_Platform] [varchar](50) NULL,
	[Parent_IntegrationId] [int] NULL,
	[ConsumerApplicationId] [int] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tbl_APIA_MstExceptionApprovalMetrix]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tbl_APIA_MstExceptionApprovalMetrix](
	[ExceptionLevel] [varchar](100) NULL,
	[ApproverType] [varchar](100) NULL,
	[ApproverLevel] [varchar](100) NULL,
	[ApproverUserID] [varchar](100) NULL,
	[ApproverName] [varchar](100) NULL,
	[ApproverEmail] [varchar](100) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tbl_apia_MstExepMetrix]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tbl_apia_MstExepMetrix](
	[ExceptionImpact] [varchar](50) NULL,
	[ExceptionLevel] [varchar](50) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tbl_APIA_MstPartnerCaseApprovalMetrix]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tbl_APIA_MstPartnerCaseApprovalMetrix](
	[PartnerRiskClassification] [varchar](100) NULL,
	[APIRiskClassification] [varchar](100) NULL,
	[ApproverType] [varchar](100) NULL,
	[ApproverLevel] [varchar](100) NULL,
	[ApproverUserID] [varchar](100) NULL,
	[ApproverName] [varchar](100) NULL,
	[ApproverEmail] [varchar](100) NULL,
	[ApproverSequence] [varchar](100) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tbl_APIA_MSTPartnerType]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tbl_APIA_MSTPartnerType](
	[PartnerType] [varchar](100) NULL,
	[PartnerEntityType] [varchar](100) NULL,
	[TPRMAapplicable] [varchar](100) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TBL_APIA_NewExceptionManagement]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TBL_APIA_NewExceptionManagement](
	[OriginalOnboardingGASID] [int] NOT NULL,
	[ExceptionRequestor] [varchar](100) NULL,
	[APIProjectName] [varchar](100) NULL,
	[APIProjectDescription] [varchar](100) NULL,
	[PartenerstobeIntegrated] [varchar](100) NULL,
	[ProductAPItobeConsumed] [varchar](100) NULL,
	[RequestedException] [varchar](100) NULL,
	[ReasonforException] [varchar](100) NULL,
	[DurationofApproval] [varchar](100) NULL,
	[HowExceptiontobeImplemented] [varchar](100) NULL,
	[ToDate] [varchar](1) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tbl_APIA_Partner_Onboarding]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tbl_APIA_Partner_Onboarding](
	[PartnetOnboading_ID] [int] NOT NULL,
	[Partner_Name] [varchar](50) NULL,
	[Project_Description] [varchar](100) NULL,
	[TentativeGoLive_Date] [date] NULL,
	[PartnerType] [varchar](100) NULL,
	[PartnerEntityType] [varchar](100) NULL,
	[PartnerTPRM_Application] [varchar](100) NULL,
	[Partnerrisk_score] [varchar](100) NULL,
	[Partnerrisk] [varchar](100) NULL,
	[API_name] [varchar](100) NULL,
	[API_risk] [varchar](100) NULL,
	[APIrisk_score] [varchar](100) NULL,
	[statusCode] [int] NULL,
	[created_By] [varchar](50) NULL,
	[created_date] [datetime] NULL,
	[Updated_By] [varchar](20) NULL,
	[Updated_date] [datetime] NULL,
	[AttachedJourneyDocuments] [varchar](150) NULL,
	[APIRiskAssessment] [varchar](150) NULL,
	[OtherDocument] [varchar](150) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tbl_APIA_PartnerCaseServiceList]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tbl_APIA_PartnerCaseServiceList](
	[CaseID] [int] NOT NULL,
	[APIName] [varchar](100) NULL,
	[APIRiskClassification] [int] NULL,
	[APIRiskScore] [varchar](100) NULL,
	[APIStatus] [varchar](100) NULL,
	[CreatedBy] [varchar](100) NULL,
	[DateCreated] [datetime] NULL,
	[DateUpdated] [date] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tbl_APIA_PartnerOffboardning_getdetails]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tbl_APIA_PartnerOffboardning_getdetails](
	[Exit_Scenario] [varchar](100) NULL,
	[Partner_Name] [varchar](100) NULL,
	[API_Name] [varchar](100) NULL,
	[Remark] [varchar](100) NULL,
	[partner_checkilist] [varchar](100) NULL,
	[fileUpload] [varchar](100) NULL,
	[ID] [int] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tbl_APIA_PartnerOnboarding]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tbl_APIA_PartnerOnboarding](
	[PartnetOnboadingID] [int] NOT NULL,
	[Partner_Name] [varchar](50) NULL,
	[Project_Description] [varchar](100) NULL,
	[Tentative Go Live Date] [datetime] NULL,
	[Partner Type] [varchar](50) NULL,
	[Partner Entity Type] [varchar](50) NULL,
	[Partner TPRM Assessment Applicability] [varchar](50) NULL,
	[Partner Risk Score] [varchar](50) NULL,
	[Partner Risk] [varchar](50) NULL,
	[API Name] [varchar](50) NULL,
	[API Risk] [varchar](50) NULL,
	[API Risk Score] [varchar](50) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tbl_APIA_PO_ApiDeatil]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tbl_APIA_PO_ApiDeatil](
	[Id] [int] NOT NULL,
	[CaseId] [varchar](50) NULL,
	[APIName] [varchar](100) NULL,
	[APIRisk] [varchar](100) NULL,
	[APIRiskScore] [varchar](10) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tbl_APIA_PO_ApprovalTrailTable]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tbl_APIA_PO_ApprovalTrailTable](
	[Id] [int] NOT NULL,
	[CaseId] [varchar](50) NULL,
	[Department] [varchar](100) NULL,
	[ApproverLevel] [varchar](100) NULL,
	[ApproverUserID] [varchar](100) NULL,
	[Sequence] [varchar](10) NULL,
	[Status] [varchar](50) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tbl_APIA_PO_ApprovalTrailTable_New]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tbl_APIA_PO_ApprovalTrailTable_New](
	[Id] [int] NOT NULL,
	[CaseId] [varchar](50) NULL,
	[Department] [varchar](100) NULL,
	[ApproverLevel] [varchar](100) NULL,
	[ApproverUserID] [varchar](100) NULL,
	[Sequence] [varchar](10) NULL,
	[Status] [varchar](50) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tbl_APIA_POCaseApproverMetrix]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tbl_APIA_POCaseApproverMetrix](
	[ID] [int] NOT NULL,
	[caseID] [int] NULL,
	[department] [varchar](50) NULL,
	[Approver_level] [varchar](20) NULL,
	[status] [varchar](20) NULL,
	[emailid] [varchar](50) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tbl_APIA_POFeedbackReply_history]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tbl_APIA_POFeedbackReply_history](
	[Id] [int] NOT NULL,
	[CaseID] [int] NULL,
	[ApprovalId] [int] NULL,
	[Department] [varchar](20) NULL,
	[approvalLevel] [varchar](50) NULL,
	[feedbackBy] [varchar](50) NULL,
	[Role] [varchar](50) NULL,
	[Status] [varchar](20) NULL,
	[CreatedBy] [varchar](50) NULL,
	[CreatedDate] [datetime] NULL,
	[Feedback_Reply] [varchar](100) NULL,
	[feedbackReplyBy] [varchar](50) NULL,
	[Feedback] [varchar](250) NULL,
	[FeedbackID] [varchar](20) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TBL_APIA_Producer]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TBL_APIA_Producer](
	[ProducerId] [int] NOT NULL,
	[ApplicationName] [varchar](100) NULL,
	[CreatedBy] [varchar](50) NULL,
	[CreatedAt] [datetime] NULL,
	[UpdatedBy] [varchar](50) NULL,
	[UpdatedAt] [datetime] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TBL_APIA_QuestionData]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TBL_APIA_QuestionData](
	[ID] [int] NOT NULL,
	[QID] [int] NULL,
	[Options] [varchar](1000) NULL,
	[Weightage] [float] NULL,
	[Status] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tbl_APIA_QusServiceDetails]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tbl_APIA_QusServiceDetails](
	[QusSerID] [int] NOT NULL,
	[ServiceID] [int] NULL,
	[QID] [int] NULL,
	[OptionsID] [int] NULL,
	[IsActive] [bit] NULL,
	[CreatedBy] [varchar](50) NULL,
	[CreatedAt] [datetime] NULL,
	[UpdatedBy] [varchar](50) NULL,
	[UpdatedAt] [datetime] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TBL_APIA_ServiceDetails]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TBL_APIA_ServiceDetails](
	[ServiceID] [int] NOT NULL,
	[IntegrationId] [int] NULL,
	[ServiceName] [varchar](5000) NULL,
	[Purpose] [varchar](100) NULL,
	[Existing_New] [varchar](100) NULL,
	[ConsumerApplication] [varchar](100) NULL,
	[ProducerApplication] [varchar](100) NULL,
	[Is_APIGW_Request] [bit] NULL,
	[Rest_Soap] [varchar](100) NULL,
	[Transformation] [varchar](100) NULL,
	[Volume] [varchar](100) NULL,
	[CreatedBy] [varchar](100) NULL,
	[CreatedAt] [datetime] NULL,
	[UpdatedBy] [varchar](100) NULL,
	[UpdatedAt] [datetime] NULL,
	[Existing_New_Id] [int] NULL,
	[Rest_SOAP_Id] [int] NULL,
	[ServiceType_Id] [int] NULL,
	[APIType_Id] [int] NULL,
	[APICategory_Id] [int] NULL,
	[APIRiskScore_Id] [int] NULL,
	[PartnerRiskScore_Id] [int] NULL,
	[DomainName_Id] [int] NULL,
	[ConsumerDC_Id] [int] NULL,
	[ProducerDC_Id] [int] NULL,
	[Platform] [varchar](50) NULL,
	[QValue1] [int] NULL,
	[QWeightage1] [real] NULL,
	[QValue2] [int] NULL,
	[QWeightage2] [real] NULL,
	[QValue3] [int] NULL,
	[QWeightage3] [real] NULL,
	[QValue4] [int] NULL,
	[QWeightage4] [real] NULL,
	[QValue5] [int] NULL,
	[QWeightage5] [real] NULL,
	[RiskScore] [real] NULL,
	[Classification] [varchar](10) NULL,
	[InternalServiceName] [varchar](max) NULL,
	[ExternalServiceName] [varchar](max) NULL,
	[ConsumerDC] [varchar](100) NULL,
	[ProducerDC] [varchar](100) NULL,
	[ExpectedServiceSpecificationDocument] [varchar](200) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TBL_APIA_ServiceQuestion]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TBL_APIA_ServiceQuestion](
	[QID] [int] NOT NULL,
	[Question] [varchar](150) NULL,
	[QuestionType] [varchar](20) NULL,
	[APICategory] [varchar](20) NULL,
	[Status] [int] NULL,
	[APICategoryId] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[UserMaster]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserMaster](
	[Id] [numeric](18, 0) IDENTITY(1,1) NOT NULL,
	[EmpCode] [varchar](50) NULL,
	[EmpName] [varchar](150) NULL,
	[BranchCode] [numeric](18, 0) NULL,
	[BranchName] [varchar](150) NULL,
	[ProfileDescription] [varchar](50) NULL,
	[ProfileId] [numeric](18, 0) NULL,
	[Department] [varchar](150) NULL,
	[SuperVisorCode] [varchar](50) NULL,
	[LastLoginDate] [datetime] NULL,
	[LastLogoutDate] [datetime] NULL,
	[CreationDate] [datetime] NULL,
	[UnsuccessfulAttempts] [bigint] NULL,
	[Active] [bit] NULL,
	[LoggedIn] [bit] NULL,
	[Locked] [bit] NULL,
	[LockedDate] [datetime] NULL,
	[Dormant] [bit] NULL,
	[DormantDate] [datetime] NULL,
	[Enabled] [bit] NULL,
	[AssetCode] [varchar](50) NULL,
	[IpAddress] [varchar](50) NULL,
	[UserCategory] [varchar](50) NULL,
	[ExpiryDate] [datetime] NULL,
	[Maker] [varchar](50) NULL,
	[MakerDate] [datetime] NULL,
	[Checker] [varchar](50) NULL,
	[CheckerDate] [datetime] NULL,
	[Reason] [varchar](max) NULL,
	[DeactivationDate] [datetime] NULL,
	[Flag] [varchar](50) NULL,
	[Password] [varchar](50) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[UserMaster] ADD  CONSTRAINT [DF_UserMaster_Password]  DEFAULT ('hdfcbank') FOR [Password]
GO
/****** Object:  StoredProcedure [dbo].[api_adda_consumerapplication_name]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[api_adda_consumerapplication_name]        
AS        
Begin        
select fullname from tbl_API_MstApplications     
End 
GO
/****** Object:  StoredProcedure [dbo].[api_adda_SearchUser]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[api_adda_SearchUser] @role nvarchar(30)      
AS      
Begin      
SELECT A.EmpCode,B.EmpName,IIF(role =@role ,'','disbled') as disbledCSS       
FROM tbl_API_ADDA_USER A inner join UserMaster B on A.EmpCode=B.EmpCode        
WHERE Role =@role   
SELECT A.EmpCode,B.EmpName  ,IIF(role !=@role  ,'disbled','') as disbledCSS     
FROM tbl_API_ADDA_USER A inner join UserMaster B on A.EmpCode=B.EmpCode        
WHERE Role != @role and role not in ('ADMIN','ITARCHITECH')      
End  
GO
/****** Object:  StoredProcedure [dbo].[api_adda_user]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[api_adda_user] @role nvarchar(30)
AS
SELECT * 
FROM tbl_API_ADDA_USER 
WHERE Role = @role
GO
/****** Object:  StoredProcedure [dbo].[SP_API_Search]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE Procedure [dbo].[SP_API_Search](
 @searchText varchar(1000)=null
 ,@action varchar(50)=null
 ,@id int =null
)
AS
BEGIN
	if(@action ='getAll')
	BEGIN
	
	select A.TBL_API_Main_ID,A.PRODUCT_PROCESSOR_URL_UAT  as ServiceURL,A.SERVICE_DESC,SERVICE_MIDDLEWARE.Value as SERVICE_TYPE 
	,A.COD_SERVICE_ID,A.SERVICE_SIGNATURE,
	SERVICE_PROVIDER.Value as SERVICE_PROVIDER
	,A.PRODUCT_PROCESSOR_WSDL , DOMAIN_NAME.Value as DOMAIN_NAME
	from TBL_API_Main A
	left join TBL_API_Master_Values SERVICE_MIDDLEWARE
	on A.NAM_SERVICE_MIDDLEWARE = SERVICE_MIDDLEWARE.Id And SERVICE_MIDDLEWARE.API_Master_ID=1
	left join TBL_API_Master_Values SERVICE_INTERFACE_TYPE 
	on a.SERVICE_INTERFACE_TYPE = SERVICE_INTERFACE_TYPE.Id and SERVICE_INTERFACE_TYPE.API_Master_ID=2
	left join TBL_API_Master_Values SERVICE_CATEGORY 
	on a.SERVICE_CATEGORY = SERVICE_CATEGORY.Id and SERVICE_CATEGORY.API_Master_ID=3
	left join TBL_API_Master_Values SERVICE_PROVIDER 
	on a.SERVICE_PROVIDER = SERVICE_PROVIDER.Id and SERVICE_PROVIDER.API_Master_ID=4

	left join TBL_API_Master_Values SERVICE_TYPE 
	on a.SERVICE_TYPE = SERVICE_TYPE.Id and SERVICE_TYPE.API_Master_ID=5

	left join TBL_API_Master_Values NAM_CONTAINER 
	on a.NAM_CONTAINER = NAM_CONTAINER.Id and NAM_CONTAINER.API_Master_ID=6

	left join TBL_API_Master_Values NAM_DOMAIN 
	on a.NAM_DOMAIN = NAM_DOMAIN.Id and NAM_DOMAIN.API_Master_ID=7

	left join TBL_API_Master_Values DOMAIN_NAME 
	on a.DOMAIN_NAME = DOMAIN_NAME.Id and DOMAIN_NAME.API_Master_ID=8

	Where (A.COD_SERVICE_ID like '%'+ @searchText +'%' OR  A.SERVICE_SIGNATURE like '%'+ @searchText +'%'
		OR  SERVICE_MIDDLEWARE.Value like '%'+ @searchText +'%'  OR  SERVICE_PROVIDER.Value like '%'+ @searchText +'%'
		OR  A.PRODUCT_PROCESSOR_WSDL like '%'+ @searchText +'%' OR  DOMAIN_NAME.Value like '%'+ @searchText +'%')
	END
	ELSE IF(@action='getOne')
	BEGIN
		select A.TBL_API_Main_ID,A.PRODUCT_PROCESSOR_URL_UAT  as ServiceURL,A.SERVICE_DESC,SERVICE_MIDDLEWARE.Value as SERVICE_TYPE 
	,A.COD_SERVICE_ID,A.SERVICE_SIGNATURE,
	SERVICE_PROVIDER.Value as SERVICE_PROVIDER
	,A.PRODUCT_PROCESSOR_WSDL , DOMAIN_NAME.Value as DOMAIN_NAME
	from TBL_API_Main A
	left join TBL_API_Master_Values SERVICE_MIDDLEWARE
	on A.NAM_SERVICE_MIDDLEWARE = SERVICE_MIDDLEWARE.Id And SERVICE_MIDDLEWARE.API_Master_ID=1
	left join TBL_API_Master_Values SERVICE_INTERFACE_TYPE 
	on a.SERVICE_INTERFACE_TYPE = SERVICE_INTERFACE_TYPE.Id and SERVICE_INTERFACE_TYPE.API_Master_ID=2
	left join TBL_API_Master_Values SERVICE_CATEGORY 
	on a.SERVICE_CATEGORY = SERVICE_CATEGORY.Id and SERVICE_CATEGORY.API_Master_ID=3
	left join TBL_API_Master_Values SERVICE_PROVIDER 
	on a.SERVICE_PROVIDER = SERVICE_PROVIDER.Id and SERVICE_PROVIDER.API_Master_ID=4

	left join TBL_API_Master_Values SERVICE_TYPE 
	on a.SERVICE_TYPE = SERVICE_TYPE.Id and SERVICE_TYPE.API_Master_ID=5

	left join TBL_API_Master_Values NAM_CONTAINER 
	on a.NAM_CONTAINER = NAM_CONTAINER.Id and NAM_CONTAINER.API_Master_ID=6

	left join TBL_API_Master_Values NAM_DOMAIN 
	on a.NAM_DOMAIN = NAM_DOMAIN.Id and NAM_DOMAIN.API_Master_ID=7

	left join TBL_API_Master_Values DOMAIN_NAME 
	on a.DOMAIN_NAME = DOMAIN_NAME.Id and DOMAIN_NAME.API_Master_ID=8
	where A.TBL_API_Main_ID =@id
	END
END
GO
/****** Object:  StoredProcedure [dbo].[SP_API_Search_Temp]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE Procedure [dbo].[SP_API_Search_Temp](
 @searchText varchar(1000)=null
 ,@action varchar(50)=null
 ,@id int =null
 , @whereClause varchar(max)= null  
)
AS
BEGIN
	if(@action ='getAll')
	BEGIN
	select A.TBL_API_Main_ID,A.PRODUCT_PROCESSOR_URL_UAT  as ServiceURL,A.SERVICE_DESC,SERVICE_MIDDLEWARE.Value as SERVICE_TYPE
	,A.COD_SERVICE_ID,A.SERVICE_SIGNATURE,
	SERVICE_PROVIDER.Value as SERVICE_PROVIDER
	,A.PRODUCT_PROCESSOR_WSDL , DOMAIN_NAME.Value as DOMAIN_NAME,A.fileName
	from TBL_API_Main A
	left join TBL_API_Master_Values SERVICE_MIDDLEWARE
	on A.NAM_SERVICE_MIDDLEWARE = SERVICE_MIDDLEWARE.Id And SERVICE_MIDDLEWARE.API_Master_ID=1
	left join TBL_API_Master_Values SERVICE_INTERFACE_TYPE 
	on a.SERVICE_INTERFACE_TYPE = SERVICE_INTERFACE_TYPE.Id and SERVICE_INTERFACE_TYPE.API_Master_ID=2
	left join TBL_API_Master_Values SERVICE_CATEGORY 
	on a.SERVICE_CATEGORY = SERVICE_CATEGORY.Id and SERVICE_CATEGORY.API_Master_ID=3
	left join TBL_API_Master_Values SERVICE_PROVIDER 
	on a.SERVICE_PROVIDER = SERVICE_PROVIDER.Id and SERVICE_PROVIDER.API_Master_ID=4

	left join TBL_API_Master_Values SERVICE_TYPE 
	on a.SERVICE_TYPE = SERVICE_TYPE.Id and SERVICE_TYPE.API_Master_ID=5

	left join TBL_API_Master_Values NAM_CONTAINER 
	on a.NAM_CONTAINER = NAM_CONTAINER.Id and NAM_CONTAINER.API_Master_ID=6

	left join TBL_API_Master_Values NAM_DOMAIN 
	on a.NAM_DOMAIN = NAM_DOMAIN.Id and NAM_DOMAIN.API_Master_ID=7

	left join TBL_API_Master_Values DOMAIN_NAME 
	on a.DOMAIN_NAME = DOMAIN_NAME.Id and DOMAIN_NAME.API_Master_ID=8

	Where (A.COD_SERVICE_ID like '%'+ @searchText +'%' OR  A.SERVICE_SIGNATURE like '%'+ @searchText +'%'
		OR  SERVICE_MIDDLEWARE.Value like '%'+ @searchText +'%'  OR  SERVICE_PROVIDER.Value like '%'+ @searchText +'%'
		OR  A.PRODUCT_PROCESSOR_WSDL like '%'+ @searchText +'%' OR  DOMAIN_NAME.Value like '%'+ @searchText +'%'OR  A.fileName like '%'+ @searchText +'%')
		
	END
	ELSE IF(@action='Filter')
	BEGIN
	Declare @query varchar(max) = N'';

	  SET @query =' select A.TBL_API_Main_ID,A.PRODUCT_PROCESSOR_URL_UAT  as ServiceURL,A.SERVICE_DESC,SERVICE_MIDDLEWARE.Value as SERVICE_TYPE,A.SERVICE_INTERFACE_TYPE,A.SERVICE_CATEGORY
	,A.COD_SERVICE_ID,A.SERVICE_SIGNATURE,
	SERVICE_PROVIDER.Value as SERVICE_PROVIDER
	,A.PRODUCT_PROCESSOR_WSDL , DOMAIN_NAME.Value as DOMAIN_NAME,A.fileName
	   INTO #tmp_DynamicTable  from TBL_API_Main A
	left join TBL_API_Master_Values SERVICE_MIDDLEWARE
	on A.NAM_SERVICE_MIDDLEWARE = SERVICE_MIDDLEWARE.Id And SERVICE_MIDDLEWARE.API_Master_ID=1
	left join TBL_API_Master_Values SERVICE_INTERFACE_TYPE 
	on a.SERVICE_INTERFACE_TYPE = SERVICE_INTERFACE_TYPE.Id and SERVICE_INTERFACE_TYPE.API_Master_ID=2
	left join TBL_API_Master_Values SERVICE_CATEGORY 
	on a.SERVICE_CATEGORY = SERVICE_CATEGORY.Id and SERVICE_CATEGORY.API_Master_ID=3
	left join TBL_API_Master_Values SERVICE_PROVIDER 
	on a.SERVICE_PROVIDER = SERVICE_PROVIDER.Id and SERVICE_PROVIDER.API_Master_ID=4

	left join TBL_API_Master_Values SERVICE_TYPE 
	on a.SERVICE_TYPE = SERVICE_TYPE.Id and SERVICE_TYPE.API_Master_ID=5

	left join TBL_API_Master_Values NAM_CONTAINER 
	on a.NAM_CONTAINER = NAM_CONTAINER.Id and NAM_CONTAINER.API_Master_ID=6

	left join TBL_API_Master_Values NAM_DOMAIN 
	on a.NAM_DOMAIN = NAM_DOMAIN.Id and NAM_DOMAIN.API_Master_ID=7

	left join TBL_API_Master_Values DOMAIN_NAME 
	on a.DOMAIN_NAME = DOMAIN_NAME.Id and DOMAIN_NAME.API_Master_ID=8
	     
	 select * into #tmp_finalTable from  #tmp_DynamicTable '
	  SET @query += ' Select * From #tmp_finalTable where  ' + @whereClause + '      
	     Drop table #tmp_DynamicTable ; Drop table #tmp_finalTable ;'  
	print @query
	EXEC(@query); 
	END

	ELSE IF(@action='getOne')
	BEGIN
		select A.TBL_API_Main_ID,A.PRODUCT_PROCESSOR_URL_UAT  as ServiceURL,A.SERVICE_DESC,SERVICE_MIDDLEWARE.Value as SERVICE_TYPE 
	,A.COD_SERVICE_ID,A.SERVICE_SIGNATURE,
	SERVICE_PROVIDER.Value as SERVICE_PROVIDER
	,A.PRODUCT_PROCESSOR_WSDL , DOMAIN_NAME.Value as DOMAIN_NAME,A.fileName
	from TBL_API_Main A
	left join TBL_API_Master_Values SERVICE_MIDDLEWARE
	on A.NAM_SERVICE_MIDDLEWARE = SERVICE_MIDDLEWARE.Id And SERVICE_MIDDLEWARE.API_Master_ID=1
	left join TBL_API_Master_Values SERVICE_INTERFACE_TYPE 
	on a.SERVICE_INTERFACE_TYPE = SERVICE_INTERFACE_TYPE.Id and SERVICE_INTERFACE_TYPE.API_Master_ID=2
	left join TBL_API_Master_Values SERVICE_CATEGORY 
	on a.SERVICE_CATEGORY = SERVICE_CATEGORY.Id and SERVICE_CATEGORY.API_Master_ID=3
	left join TBL_API_Master_Values SERVICE_PROVIDER 
	on a.SERVICE_PROVIDER = SERVICE_PROVIDER.Id and SERVICE_PROVIDER.API_Master_ID=4

	left join TBL_API_Master_Values SERVICE_TYPE 
	on a.SERVICE_TYPE = SERVICE_TYPE.Id and SERVICE_TYPE.API_Master_ID=5

	left join TBL_API_Master_Values NAM_CONTAINER 
	on a.NAM_CONTAINER = NAM_CONTAINER.Id and NAM_CONTAINER.API_Master_ID=6

	left join TBL_API_Master_Values NAM_DOMAIN 
	on a.NAM_DOMAIN = NAM_DOMAIN.Id and NAM_DOMAIN.API_Master_ID=7

	left join TBL_API_Master_Values DOMAIN_NAME 
	on a.DOMAIN_NAME = DOMAIN_NAME.Id and DOMAIN_NAME.API_Master_ID=8
	where A.TBL_API_Main_ID =@id
	
	END
END
GO
/****** Object:  StoredProcedure [dbo].[SP_APIA_AdminMaster]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE Proc [dbo].[SP_APIA_AdminMaster]
(
@IdentFlag varchar(50),
@Id int=null,
@AppName varchar(50)=null,
@EmpCode varchar(25)=null,
@UserRole varchar(50)=null,
@EmailId varchar(70)=null,
@AppShortName varchar(100)=Null,
@FullName varchar(150)=Null,
@Purpose varchar(500)=null,
@ITGRCCode varchar(100)=null,
@ITGRCName varchar(250)=null,
@HostingDC varchar(250)=null,
@CreatedBy varchar(25) = null,
@SPOCDepartment varchar(100)=null,
@SpocEMPCode varchar(25)=null,
@SpocName varchar(150)=null,
@SPOCLevel varchar(50)=null,
@Status int = null
)
as begin
	if(@IdentFlag='SelectAll')
	begin
			SELECT A.EmpCode UserID,B.EmpName UserName,Case when A.IsActive=1 then 'A'
			when A.IsActive=0 then 'I' end Status,convert(varchar(10),A.CreatedDate,105) DateCreated,A.Role UserRole
			from tbl_API_ADDA_USER A inner join UserMaster B on A.EmpCode=b.EmpCode 

			SELECT Id,APPShortName,FullName,Purpose,cast(ITGRCCode as varchar) ITGRCCode,ITGRCName,HostingDC,status 
			from tbl_API_MstApplications

			SELECT Id,APPID,APPShortName,SPOCDepartment,SpocEMPCode,SPOCName,EmailAddress,SPOCLevel,status from 
			tbl_API_ApplicationsSPOC 
			
			SELECT '-- Select --' as ID, '-- Select --' as val
			Union
			SELECT CDValDesc AS ID, CDValDesc AS VAL FROM tbl_API_Adda_Misccd WHERE CDTP = 'Hosting DC fields'

			--select '-- Select --' as ID, '-- Select --' as val
			--Union
			--select 'Bank DC' as ID, 'Bank DC' as val
			--Union
			--select 'Bank Landing Zone' as ID, 'Bank Landing Zone' as val
			--Union
			--select 'External' as ID, 'External' as val

			SELECT '-- Select --' as ID, '-- Select --' as val
			Union
			SELECT 'USER' as ID, 'USER' as val
			Union
			SELECT Distinct Role as ID,Role as  val from tbl_API_ADDA_USER
			
			--SELECT DISTINCT SUBSTRING(Role,1,Len(Role)-4) AS ID,  SUBSTRING(Role,1,Len(Role)-4) AS Role from tbl_API_ADDA_USER WHERE Role IN ('BTGUSER', 'ITUSER')

			SELECT '-- Select --' as ID, '-- Select --' as val
			Union
			--select 'ADMIN' as ID, 'ADMIN' as val
			--Union
			SELECT 'IT' as ID, 'IT' as val
			Union
			SELECT 'BTG' as ID, 'BTG' as val order by ID
			--Union
			--select 'ITARCHITECH' as ID, 'ITARCHITECH'
			--Union
			--select 'USER' as ID, 'USER' as val order by ID
			
			SELECT '-- Select --' as ID, '-- Select --' as val
			Union
			SELECT CDValDesc AS ID, CDValDesc AS VAL FROM tbl_API_Adda_Misccd WHERE CDTP = 'Status'

			--select '-- Select --' as ID, '-- Select --' as val
			--Union
			--select 'Active' as ID, 'Active' as val
			--Union
			--select 'Inactive' as ID, 'Inactive' as val order by ID
			SELECT '-- Select --' as ID, '-- Select --' as val
			Union
			SELECT CDValDesc AS ID, CDValDesc AS VAL FROM tbl_API_Adda_Misccd WHERE CDTP = 'Spoc Level'

			--select '-- Select --' as ID, '-- Select --' as val
			--Union
			--select 'Unit Head' as ID, 'Unit Head' as val
			--Union
			--select 'Function Head' as ID, 'Function Head' as val 
			--Union
			--select 'Vertical Head' as ID, 'Vertical Head' as val 
			--Union
			--select 'Manager' as ID, 'Manager' as val order by ID
	end
	if(@IdentFlag='AddUsers')
	begin
			IF NOT EXISTS(select EmpCode from tbl_API_ADDA_USER where EmpCode=@EmpCode)
			begin
				insert into tbl_API_ADDA_USER(EmpCode,Role,EmailId,CreatedBy,CreatedDate,IsActive)
									values(@EmpCode,@UserRole,@EmailId,@CreatedBy,getdate(),@Status)
					select 'User Id ' + @EmpCode + ' has been added successfully.' as Msg
			end
			else
			begin
					select 'User Id ' + @EmpCode + ' already exist.' as Msg
			end
	end
	if(@IdentFlag='AddApp')
	begin
				IF EXISTS(select APPShortName from tbl_API_MstApplications where APPShortName=@AppShortName)
				begin			
					select 'Application ' + @AppShortName + ' already exists.' as Msg,@id as Id
				end
				else IF EXISTS(select FullName from tbl_API_MstApplications where FullName=@FullName) 
				begin			
					select 'Application fullname ' + @FullName + ' already exists.' as Msg,@id as Id
				end
				else IF EXISTS(select ITGRCName from tbl_API_MstApplications where ITGRCName=@ITGRCName) 
				begin			
					select 'ITGRC name ' + @ITGRCName + ' already exists.' as Msg,@id as Id
				end
				else IF EXISTS(select ITGRCCode from tbl_API_MstApplications where ITGRCCode=@ITGRCCode) 
				begin			
					select 'ITGRC number ' + @ITGRCCode + ' already exists.' as Msg,@id as Id
				end
				else
				begin
					insert into tbl_API_MstApplications(APPShortName,FullName,Purpose,ITGRCName,ITGRCCode,HostingDC,
					status,CreatedBy,CreatedDate) values(@AppShortName,@FullName,@Purpose,@ITGRCName,@ITGRCCode,@HostingDC,
					@Status,@CreatedBy,getdate())
				    set @id =  SCOPE_IDENTITY()
					select 'Application ' + @AppShortName + ' has been added successfully.' as Msg,@id as Id
				end

			--IF NOT EXISTS(select APPShortName from tbl_API_MstApplications where APPShortName=@AppShortName)
			--begin
			--		insert into tbl_API_MstApplications(APPShortName,FullName,Purpose,ITGRCName,ITGRCCode,HostingDC,
			--		status,CreatedBy,CreatedDate)
			--								values(@AppShortName,@FullName,@Purpose,@ITGRCName,@ITGRCCode,@HostingDC,
			--		@Status,@CreatedBy,getdate())
			--	    set @id =  SCOPE_IDENTITY()
			--				select 'Application ' + @AppShortName + ' has been added successfully.' as Msg,@id as Id
			--end
			--else
			--begin			
			--		select 'Application ' + @AppShortName + ' already exists.' as Msg,@id as Id
			--end
	end
	if(@IdentFlag='UpdateApps')
	begin
			update tbl_API_MstApplications set  APPShortName=@AppShortName,FullName=@FullName,Purpose=@Purpose,ITGRCCode=@ITGRCCode,
			ITGRCName=@ITGRCName,HostingDC=@HostingDC,status=@Status,UpdateBy=@CreatedBy,UpdatedDate=getdate()
			where Id=@Id
					select 'Application ' + @AppShortName + ' has been updated successfully.' as Msg
	end
	if(@IdentFlag='UpdateUsers')
	begin
			update tbl_API_ADDA_USER set Role=@UserRole,EmailId=@EmailId,UpdateBy=@CreatedBy,
			UpdatedDate=GETDATE(),IsActive=@Status where EmpCode=@EmpCode
			select 'User Id ' + @EmpCode + ' has been updated successfully.' as Msg
	
	end
	if(@IdentFlag='EditUser')
	begin
			select A.EmpCode,B.EmpName,Role,EmailId,isActive Status, convert(varchar(10),CreatedDate,105)CreatedDate,
			 convert(varchar(10),UpdatedDate,105)UpdatedDate,convert(varchar(10),LastSuccessLoginDate,105)LastLoginDate
			 from tbl_API_ADDA_USER A inner join UserMaster B on A.EmpCode=B.EmpCode where A.EmpCode=@EmpCode
	end
	if(@IdentFlag='EditApp' )
	begin
	       set @AppName=(select case when @AppName Like '%#%' then SUBSTRING(@AppName, 1,CHARINDEX('#', @AppName)-1) else @AppName end)
		   if(@AppName !='' AND @Id is  null)
		   BEGIN
		    select Id,APPShortName,FullName,Purpose,ITGRCCode,ITGRCName,HostingDC,status from tbl_API_MstApplications where (FullName= @AppName OR APPShortName=@AppName)
			select APPID,APPShortName,SPOCDepartment,SpocEMPCode,SPOCName,EmailAddress,SPOCLevel,status from tbl_API_ApplicationsSPOC where APPID=( select Id from tbl_API_MstApplications where( FullName= @AppName OR APPShortName=@AppName))
		   END
		   ELSE
		   BEGIN
			select Id,APPShortName,FullName,Purpose,ITGRCCode,ITGRCName,HostingDC,status from tbl_API_MstApplications where Id= @Id
			select APPID,APPShortName,SPOCDepartment,SpocEMPCode,SPOCName,EmailAddress,SPOCLevel,status from tbl_API_ApplicationsSPOC where APPID=@Id
			END
	end
	if(@IdentFlag='GetName')
	begin
			--select EmpName UserName, 'Emailid' as Email from UserMaster where EmpCode=@EmpCode
			--SELECT DISTINCT C.EmpName AS UserName, B.EmailId as Email from tbl_API_ApplicationsSPOC A
			--INNER JOIN tbl_API_ADDA_USER B ON A.SpocEMPCode = B.EmpCode 
			--INNER JOIN UserMaster C ON C.EmpCode = A.SpocEMPCode where C.EmpCode=@EmpCode
		SELECT DISTINCT A.EmpName AS UserName, B.EmailId as Email 
			FROM UserMaster A 
			Left JOIN tbl_API_ADDA_USER B ON A.EmpCode = B.EmpCode  where A.EmpCode=@EmpCode
	end
	if(@IdentFlag='AddSpocs')
	begin
			insert into tbl_API_ApplicationsSPOC (APPID,APPShortName,SPOCDepartment,SpocEMPCode,SPOCName,EmailAddress,
			SPOCLevel,status,CreatedBy,CreatedDate) values(@Id,@AppShortName,@SPOCDepartment,@SpocEMPCode,@SpocName,
			@EmailId,@SPOCLevel,1,@CreatedBy,GETDATE())
	
	end
	if(@IdentFlag='DeleteSpoc')
	begin
			delete tbl_API_ApplicationsSPOC where APPID=@Id
	
	end

	if(@IdentFlag='SearchApplicatonList')
	begin
	
	select APPShortName,FullName from tbl_API_MstApplications where FullName like '%' + @FullName + '%' and status=1
	
	end
end
GO
/****** Object:  StoredProcedure [dbo].[sp_APIA_APIFilterSearch]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [dbo].[sp_APIA_APIFilterSearch](      
 @whereClause varchar(max)= null    
)       
AS          
BEGIN     
 Declare @query varchar(max) = N'' , @query1 varchar(max) = N'';  
    
  
   SET @query =' select A.TBL_API_Main_ID,A.PRODUCT_PROCESSOR_URL_UAT  as ServiceURL,A.SERVICE_DESC,SERVICE_MIDDLEWARE.Value as SERVICE_TYPE,A.SERVICE_INTERFACE_TYPE,A.SERVICE_CATEGORY  
 ,A.COD_SERVICE_ID,A.SERVICE_SIGNATURE,  
 SERVICE_PROVIDER.Value as SERVICE_PROVIDER  
 ,A.PRODUCT_PROCESSOR_WSDL , DOMAIN_NAME.Value as DOMAIN_NAME,A.fileName,A.NAM_SERVICE_MIDDLEWARE  
    INTO #tmp_DynamicTable  from TBL_API_Main A  
 left join TBL_API_Master_Values SERVICE_MIDDLEWARE  
 on A.NAM_SERVICE_MIDDLEWARE = SERVICE_MIDDLEWARE.Id And SERVICE_MIDDLEWARE.API_Master_ID=1  
 left join TBL_API_Master_Values SERVICE_INTERFACE_TYPE   
 on a.SERVICE_INTERFACE_TYPE = SERVICE_INTERFACE_TYPE.Id and SERVICE_INTERFACE_TYPE.API_Master_ID=2  
 left join TBL_API_Master_Values SERVICE_CATEGORY   
 on a.SERVICE_CATEGORY = SERVICE_CATEGORY.Id and SERVICE_CATEGORY.API_Master_ID=3  
 left join TBL_API_Master_Values SERVICE_PROVIDER   
 on a.SERVICE_PROVIDER = SERVICE_PROVIDER.Id and SERVICE_PROVIDER.API_Master_ID=4  
  
 left join TBL_API_Master_Values SERVICE_TYPE   
 on a.SERVICE_TYPE = SERVICE_TYPE.Id and SERVICE_TYPE.API_Master_ID=5  
  
 left join TBL_API_Master_Values NAM_CONTAINER   
 on a.NAM_CONTAINER = NAM_CONTAINER.Id and NAM_CONTAINER.API_Master_ID=6  
  
 left join TBL_API_Master_Values NAM_DOMAIN   
 on a.NAM_DOMAIN = NAM_DOMAIN.Id and NAM_DOMAIN.API_Master_ID=7  
  
 left join TBL_API_Master_Values DOMAIN_NAME   
 on a.DOMAIN_NAME = DOMAIN_NAME.Id and DOMAIN_NAME.API_Master_ID=8  
      
  select * into #tmp_finalTable from  #tmp_DynamicTable '  
   SET @query += ' Select * From #tmp_finalTable where NAM_SERVICE_MIDDLEWARE in (''' + @whereClause + ''')        
      Drop table #tmp_DynamicTable ; Drop table #tmp_finalTable ;'    
 print @query  
 EXEC(@query);   
   
END

GO
/****** Object:  StoredProcedure [dbo].[sp_APIA_APIFilterSearchF]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [dbo].[sp_APIA_APIFilterSearchF](      
 @whereClause varchar(max)= null    
)       
AS          
BEGIN 

CREATE TABLE #PAR
(id varchar(10))
INSERT INTO #PAR SELECT Item FROM  dbo.SplitString(@whereClause, ','); --VALUES (@whereClause)


    

    
 Declare @query varchar(max) = N'' , @query1 varchar(max) = N'';  
  SET @query='select 
 distinct
 A.TBL_API_Main_ID,
 A.PRODUCT_PROCESSOR_URL_UAT  as ServiceURL,
 A.SERVICE_DESC,
 SERVICE_MIDDLEWARE.Value as SERVICE_TYPE,
 A.SERVICE_INTERFACE_TYPE,
 A.SERVICE_CATEGORY  
,A.COD_SERVICE_ID,
 A.SERVICE_SIGNATURE,  
 A.SERVICE_PROVIDER as SERVICE_PROVIDER,  
 A.PRODUCT_PROCESSOR_WSDL , 
 A.DOMAIN_NAME as DOMAIN_NAME,
 A.fileName,
 A.NAM_SERVICE_MIDDLEWARE  
 from TBL_API_Main A Left Join  TBL_API_Master_Values SERVICE_MIDDLEWARE   on A.NAM_SERVICE_MIDDLEWARE = SERVICE_MIDDLEWARE.Value --And SERVICE_MIDDLEWARE.API_Master_ID=1 

 where SERVICE_MIDDLEWARE.Value in ( select id from #PAR  ) '
 print @query  
 EXEC(@query);   
 END
GO
/****** Object:  StoredProcedure [dbo].[SP_APIA_ApplicationMaster]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE Proc [dbo].[SP_APIA_ApplicationMaster]
(
@IdentFlag varchar(50),
@EmpCode varchar(25)=null,
@UserRole varchar(50)=null,
@EmailId varchar(70)=null,
@Status bit =null
)
as begin
	if(@IdentFlag='SelectAll')
	begin
			select A.EmpCode UserID,B.EmpName UserName,Case when A.IsActive=1 then 'A'
			when A.IsActive=0 then 'I' end Status,convert(varchar(10),A.CreatedDate,105) DateCreated,A.Role UserRole
			from tbl_API_ADDA_USER A inner join UserMaster B on A.EmpCode=b.EmpCode 
	end
	if(@IdentFlag='AddUsers')
	begin
			insert into tbl_API_ADDA_USER(EmpCode,Role,EmailId,IsActive)values(@EmpCode,@UserRole,@EmailId,@Status)
	end
	if(@IdentFlag='UpdateUsers')
	begin
			update tbl_API_ADDA_USER set Role=@UserRole,EmailId=@EmailId,IsActive=@Status where EmpCode=@EmpCode
	end
	if(@IdentFlag='DeleteUsers')
	begin
			update tbl_API_ADDA_USER set  Isactive=@Status where EmpCode=@EmpCode
	end
end
GO
/****** Object:  StoredProcedure [dbo].[SP_APIA_BulkInsert_Scheduler_Data]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE proc [dbo].[SP_APIA_BulkInsert_Scheduler_Data]    
as    
begin    
 truncate table TBL_API_Main_Bak;    
--select * into TBL_API_Main_Bak from TBL_API_Main;    
INSERT INTO  TBL_API_Main_Bak  select * from  TBL_API_Main;

truncate table TBL_API_Main;    
 Insert Into TBL_API_Main (    
 COD_SERVICE_ID    
,SERVICE_SIGNATURE    
,NAM_SERVICE_MIDDLEWARE    
,SERVICE_DESC    
,SERVICE_PROVIDER    
,SERVICE_INTERFACE_TYPE    
,SERVICE_CATEGORY    
,SERVICE_TYPE    
,ORCHESTRATED_SERVICE_DTLS    
,OBP_SERVICE_URL_UAT    
,OBP_SERVICE_URL_PSUPP    
,OBP_SERVICE_URL_PROD    
,OBP_WSDL_URL    
,PRODUCT_PROCESSOR_WSDL    
,SERVICE_VERSION    
,NAM_CONTAINER    
,NAM_DOMAIN    
,OBP_REQUEST    
,OBP_RESPONSE    
,PRODUCT_PROCESSOR_URL_UAT    
,PRODUCT_PROCESSOR_URL_PSUPP    
,PRODUCT_PROCESSOR_URL_PROD    
,TXT_ERROR_DESC    
,CONNECT_TIMEOUT_VALUE    
,SOCKET_TIMEOUT_VALUE    
,NAM_WORKMANAGER    
,WORKMANAGER_MAX_THREADS    
,WORKMANAGER_CAPACITY    
,TXT_SECURITY_FEATURE_DESC    
,SERVICE_DOC_PATH    
,NAM_INITIATOR    
,DAT_GO_LIVE    
,JIRA_ID    
,TXT_REMARKS    
,FILLER_01    
,FILLER_02    
,FILLER_03    
,FILLER_04    
,FILLER_05    
,FILLER_06    
,FILLER_07    
,FILLER_08    
,FILLER_09    
,FILLER_10    
,FLG_MNT_STATUS    
,COD_MNT_ACTION    
,COD_LAST_MNT_MAKERID    
,COD_LAST_MNT_CHKRID    
,DAT_LAST_MNT    
,CTR_UPDAT_SRLNO    
,API_CAT    
,VIRTUALIZED    
,AUTOMATED    
,DEPRICATED_API    
,REQUEST_SAMPLE    
,RESPONSE_SAMPLE    
,DOC_TYPE    
,DOMAIN_NAME    
,API_TYPE) select COD_SERVICE_ID    
,SERVICE_SIGNATURE    
,NAM_SERVICE_MIDDLEWARE    
,SERVICE_DESC    
,SERVICE_PROVIDER    
,SERVICE_INTERFACE_TYPE    
,SERVICE_CATEGORY    
,SERVICE_TYPE    
,ORCHESTRATED_SERVICE_DTLS    
,OBP_SERVICE_URL_UAT    
,OBP_SERVICE_URL_PSUPP    
,OBP_SERVICE_URL_PROD    
,OBP_WSDL_URL    
,PRODUCT_PROCESSOR_WSDL    
,SERVICE_VERSION    
,NAM_CONTAINER    
,NAM_DOMAIN    
,OBP_REQUEST    
,OBP_RESPONSE    
,PRODUCT_PROCESSOR_URL_UAT    
,PRODUCT_PROCESSOR_URL_PSUPP    
,PRODUCT_PROCESSOR_URL_PROD    
,TXT_ERROR_DESC    
,CONNECT_TIMEOUT_VALUE    
,SOCKET_TIMEOUT_VALUE    
,NAM_WORKMANAGER    
,WORKMANAGER_MAX_THREADS    
,WORKMANAGER_CAPACITY    
,TXT_SECURITY_FEATURE_DESC    
,SERVICE_DOC_PATH    
,NAM_INITIATOR    
,DAT_GO_LIVE    
,JIRA_ID    
,TXT_REMARKS    
,FILLER_01    
,FILLER_02    
,FILLER_03    
,FILLER_04    
,FILLER_05    
,FILLER_06    
,FILLER_07    
,FILLER_08    
,FILLER_09    
,FILLER_10    
,FLG_MNT_STATUS    
,COD_MNT_ACTION    
,COD_LAST_MNT_MAKERID    
,COD_LAST_MNT_CHKRID    
,DAT_LAST_MNT    
,CTR_UPDAT_SRLNO    
,API_CAT    
,VIRTUALIZED    
,AUTOMATED    
,DEPRICATED_API    
,REQUEST_SAMPLE    
,RESPONSE_SAMPLE    
,DOC_TYPE    
,DOMAIN_NAME    
,API_TYPE from TBL_API_Main_Scheduler_Data;    
truncate table TBL_API_Main_Scheduler_Data;    
select 1 as Msg;    
end
GO
/****** Object:  StoredProcedure [dbo].[SP_APIA_GetUserRole]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [dbo].[SP_APIA_GetUserRole]
@UserId as varchar(50)=null
AS
BEGIN
select Role from tbl_API_ADDA_USER where EmpCode=@UserId and IsActive=1
END
GO
/****** Object:  StoredProcedure [dbo].[sp_APIA_NewAPIIntegration]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE procedure [dbo].[sp_APIA_NewAPIIntegration]            
 @IntegrationId int=null            
,@ProjectManagerBTG varchar(100)=null            
,@ProjectManagerIT varchar(100)=null            
,@ProjectName varchar(100)=null            
,@ProjectId varchar(100)=null            
,@PlannedGoLiveDate datetime=null            
,@BusinessJustification varchar(max)  =null          
,@BusinessSponsor varchar(100)=null            
,@ExecutiveSponsor varchar(100)=null            
,@CostCenterCode varchar(100)=null            
,@UserJourneyDocumentFileName varchar(100)=null            
,@Feedback varchar(500)=null            
,@Status int=0            
,@CreatedBy varchar(100)=null           
,@UpdatedBy varchar(100)=null            
,@IdentFlag varchar(50)            
,@ServiceName varchar(100)=null          
,@Purpose varchar(100)=null          
,@Existing_New varchar(100)=null          
,@ConsumerApplication varchar(100)=null          
,@ProducerApplication varchar(100)=null          
,@Is_APIGW_Request bit =null          
,@Rest_Soap varchar(100)=null          
,@Transformation varchar(100)=null          
,@Volume varchar(100)=null          
,@UpdateFlag varchar(100)=null          
,@ServiceID varchar(100)=null          
,@Assign Varchar(50)=null        
,@AssignFrom Varchar(50)='USER'       
,@Existing_New_Id int=0        
,@Rest_SOAP_Id int=0        
,@ServiceType_Id int=0        
,@APIType_Id int=0        
,@APICategory_Id int=0        
,@APIRiskScore_Id int=0        
,@PartnerRiskScore_Id int=0        
,@DomainName_Id int=0      
,@IsActive bit=1     
,@FeedbackId int=0    
,@servicenameId int=0,    
@ConsumerDC_Id int=null,    
@ProducerDC_Id int=null,    
@Platform varchar(200)=null,    
@QValue1 int=0,    
@QValue2 int=0,    
@QValue3 int=0,    
@QValue4 int=0,    
@QValue5 int=0,    
@RiskScore FLOAT(4)=0,    
@Classification varchar(10)=null,
@BTGUSER VARCHAR(50)=null,
@ITUSER VARCHAR(50)=null,
@ITARCHITECTURE VARCHAR(50)=null,
@ChannelID VARCHAR(50)=null,
@ContainerName VARCHAR(50)=null,
@InternalServiceName VARCHAR(50)=null,
@ExternalServiceName VARCHAR(50)=null,
@ExternalServiceText VARCHAR(Max)=null,
@HostAppID int=null,
@ConsumerDC VARCHAR(50)=null,
@ProducerDC VARCHAR(50)=null,
@HostApptext VARCHAR(50)=null,
@QID int=null,
@OptionsID int=null,
@RDConceptNoteFileName varchar(100)=null,
@ExpectedAPISpecificationFileName varchar(100)=null,
@SequenceDiagramFileName varchar(100)=null,
@ConsumerId INT = 0,
@flagPl varchar(10)=null,
@ConsumerApplicationId INT = 0
          
AS BEGIN            
  IF(@IdentFlag='AddNewIntegration')            
  BEGIN    
  SET IDENTITY_INSERT TBL_APIA_Integration ON

  DECLARE @NewID INT=0
  SET @NewID=(SELECT MAX(IntegrationId)+1 FROM TBL_APIA_Integration)

  INSERT INTO TBL_APIA_Integration(ProjectManagerBTG,ProjectManagerIT,ProjectName,ProjectId,PlannedGoLiveDate,            
  BusinessJustification,BusinessSponsor,ExecutiveSponsor,CostCenterCode,UserJourneyDocumentPath,Status,CreatedAt,CreatedBy,Assign,AssignFrom, ConsumerApplication,RDConceptNote,ConsumerApplicationId,IntegrationId)            
  VALUES(@ProjectManagerBTG,@ProjectManagerIT,@ProjectName,@ProjectId,@PlannedGoLiveDate,@BusinessJustification,            
  @BusinessSponsor,@ExecutiveSponsor,@CostCenterCode,@UserJourneyDocumentFileName,@Status,GETDATE(),@CreatedBy,@Assign,@AssignFrom, @ConsumerApplication,@RDConceptNoteFileName,@ConsumerApplicationId,@NewID)  
 SET IDENTITY_INSERT TBL_APIA_Integration OFF

  SET @IntegrationId=  (SELECT SCOPE_IDENTITY() AS IntegrationId)    
  SET @Feedback = 'New Integration  Created  By User'    
  IF(@IntegrationId <> 0  or @IntegrationId <> null) 
  BEGIN
        INSERT INTO tbl_API_ADDA_Feedback (Integration_Id,Feedback_Details,Status,Created_By,Created_Date,IsActive,AssignTo,AssignFrom)     
      VALUES(@IntegrationId,@Feedback,@Status,@CreatedBy,GETDATE(),@IsActive,@Assign,@AssignFrom)  
  END
 
   
      
    SELECT @IntegrationId AS IntegrationId;    
    
 --SELECT SCOPE_IDENTITY() AS IntegrationId;    
 -- SELECT MAX(IntegrationId) AS IntegrationId FROM TBL_APIA_Integration          
          
  END   
  ELSE IF @IdentFlag='BTGProjectMgr' 
	BEGIN
		SELECT ISNULL(EmpName,'') AS ProjectManagerBTG,ISNULL(EmpCode,'') AS IntegrationId  FROM [dbo].[UserMaster] WITH(NOLOCK)
	END
  ELSE IF(@IdentFlag='GetNewIntegrationDetails') 
  BEGIN          
        
  IF(@AssignFrom='USER')        
   BEGIN         
  Select   
  IntegrationId,    
   'API' +replace (convert(varchar, CreatedAt, 106) ,' ','')+ Cast(IntegrationId AS varchar)  as 'APIADDAID',    
  ProjectName,    
  ProjectId,    
  ProjectManagerBTG,    
  ProjectManagerIT,     
  statusDescription as Status,    
  Assign,    
  AssignFrom,    
  Status as workflowstatus ,    
  IsNull(In_Platform,'') as 'Platform'

 --(    
 --  case      
 --       when Platform ='External,Internal' Then  'External & Internal'    
 --       when Platform like'%Internal &amp; External%' Then  'External & Internal'    
 -- else Platform end    
    
 --  ) as 'Platform'    
  --CASE         
  --WHEN Status=0 THEN 'Created'        
  --WHEN Status=1 THEN 'Feedback'        
  --WHEN Status=2 THEN 'Updated By User'        
  --WHEN Status=3 THEN 'Review To ITUSER'        
  --WHEN Status=4 THEN 'Review To ITARCHITECH'        
  --WHEN Status=5 THEN 'Rejected'        
  --WHEN Status=6 THEN 'Approved'        
  --END AS Status          
  from TBL_APIA_Integration    
   Inner Join TBL_API_statusMaster As SM on SM.statusCode=Status    
   --Inner Join (    
   --          select cu.IntegrationId as InId,    
   --        stuff( (select ',' + co.Platform    
   --            from (select DISTINCT  IntegrationId,Platform from   TBL_APIA_ServiceDetails) co    
   --            where cu.IntegrationId = co.IntegrationId    
   --            order by co.IntegrationId    
   --            for xml path ('')    
   --           ), 1, 1, ''    
   --         ) as Platform    
   --     from (select DISTINCT  IntegrationId,Platform from   TBL_APIA_ServiceDetails)As cu group by cu.IntegrationId    
   --) As SdPlatfrom on SdPlatfrom.InId=IntegrationId    
    
  where CreatedBy=@CreatedBy          
  ORDER BY IntegrationId DESC          
  END        
  ELSE IF(@AssignFrom<>'USER')        
   BEGIN         
  Select     
  IntegrationId,    
    'API' +replace (convert(varchar, CreatedAt, 106) ,' ','')+ Cast(IntegrationId AS varchar)  as 'APIADDAID',    
  ProjectName,    
  ProjectId,    
  ProjectManagerBTG,    
  ProjectManagerIT,      
  statusDescription as Status,    
  Assign,    
  AssignFrom, 
  Status as workflowstatus,    
   IsNull(In_Platform,'') as 'Platform'
 --(    
 --  case      
 --       when Platform ='External,Internal' Then  'External & Internal'    
 --       when Platform like'%Internal &amp; External%' Then  'External & Internal'    
 -- else Platform end    
    
 --  ) as 'Platform'    
  --CASE         
  --WHEN Status=0 THEN 'Created'        
  --WHEN Status=1 THEN 'Feedback'        
  --WHEN Status=2 THEN 'Updated By User'        
  --WHEN Status=3 THEN 'Review To ITUSER'        
  --WHEN Status=4 THEN 'Review To ITARCHITECH'        
  --WHEN Status=5 THEN 'Rejected'        
  --WHEN Status=6 THEN 'Approved'        
  --END AS Status          
  from TBL_APIA_Integration     
   Inner Join TBL_API_statusMaster As SM on SM.statusCode=Status    
   --Inner Join (    
   --          select cu.IntegrationId as InId,    
   --        stuff( (select ',' + co.Platform    
   --            from (select DISTINCT  IntegrationId,Platform from   TBL_APIA_ServiceDetails) co    
   --            where cu.IntegrationId = co.IntegrationId    
   --            order by co.IntegrationId    
   --            for xml path ('')    
   --           ), 1, 1, ''    
   --         ) as Platform    
   --     from (select DISTINCT  IntegrationId,Platform from   TBL_APIA_ServiceDetails)As cu group by cu.IntegrationId    
   --) As SdPlatfrom on SdPlatfrom.InId=IntegrationId    
 -- where Assign=@AssignFrom     
  order by IntegrationId desc      
    
    
  END        
        
 END           
        
  ELSE IF(@IdentFlag='AddServiceDetails')          
  BEGIN  
  


	  --If( @Platform  !='External')
	  --BEGIN
   
		
If(@flagPl='All')
		   BEGIN
              UPDATE TBL_APIA_Integration set In_Platform= 'Internal' WHERE IntegrationId=@IntegrationId
			END 
  ELSE IF(@flagPl='single' and @Platform='Internal & External')
  BEGIN 
      UPDATE TBL_APIA_Integration set In_Platform= 'Internal' WHERE IntegrationId=@IntegrationId
	  SET @flagPl='All'
  END 
 ELSE 
  BEGIN
	UPDATE TBL_APIA_Integration set In_Platform= @Platform WHERE IntegrationId=@IntegrationId
END
      --IF(@Purpose!=null and @Purpose!='')
		--Begin
			INSERT INTO TBL_APIA_ServiceDetails(IntegrationId,ServiceName,Purpose,Existing_New,ConsumerApplication,ProducerApplication,Is_APIGW_Request,Rest_Soap,Transformation,Volume,CreatedBy,CreatedAt      
			 ,Existing_New_Id      
			,Rest_SOAP_Id      
			,ServiceType_Id      
			,APIType_Id      
			,APICategory_Id      
			,APIRiskScore_Id      
			,PartnerRiskScore_Id      
			,DomainName_Id,     
			ConsumerDC_Id,    
			ProducerDC_Id,    
			Platform,    
			QValue1,    
			QValue2,    
			QValue3,    
			QValue4,    
			QValue5,    
			RiskScore,
			InternalServiceName,
			ExternalServiceName ,
			ConsumerDC,
			ProducerDC,
			ExpectedServiceSpecificationDocument,
			Classification
			  )          
      
      
			values(      
			@IntegrationId,@ServiceName,@Purpose,@Existing_New,@ConsumerApplication,@ProducerApplication,@Is_APIGW_Request,@Rest_Soap,@Transformation,      
			@Volume,      
			@CreatedBy      
			,getdate()      
			,@Existing_New_Id      
			,@Rest_SOAP_Id      
			,@ServiceType_Id      
			,@APIType_Id      
			,@APICategory_Id      
			,@APIRiskScore_Id      
			,@PartnerRiskScore_Id     
			,@DomainName_Id,    
			@ConsumerDC_Id,    
			@ProducerDC_Id,    
			@Platform,    
			@QValue1,    
			@QValue2,    
			@QValue3,    
			@QValue4,    
			@QValue5,    
			@RiskScore,
			@InternalServiceName,
			@ExternalServiceName ,
			@ConsumerDC,
			@ProducerDC,
			@ExpectedAPISpecificationFileName,
			@Classification
			)  
		--End
	--  END

 --DECLARE @InternalCountS int
 --DECLARE @ExternalCountS int
 --DECLARE @InternalExternalCountS int

 --SET @InternalCountS = (select count(Platform) from TBL_APIA_ServiceDetails where Platform='Internal' and IntegrationId=@IntegrationId)
 --SET @ExternalCountS = (select count(Platform) from TBL_APIA_ServiceDetails where Platform='External' and IntegrationId=@IntegrationId)
 --SET @InternalExternalCountS = (select count(Platform) from TBL_APIA_ServiceDetails where Platform='Internal & External' and IntegrationId=@IntegrationId)


 If(@flagPl='All')--((@InternalCountS>0 AND @ExternalCountS>0) OR (@InternalCountS>0 AND @InternalExternalCountS>0) OR (@ExternalCountS>0 AND @InternalExternalCountS>0) )
 BEGIN
  If(@Platform ='Internal & External' Or @Platform ='External' Or  @Platform ='Internal')
	  BEGIN
	  Declare @IntegrationIdIE int
 
	  -------------------------------------------------------------------Add New Integration----Based On Internal & External--------------------------------------------------------------------------
 
	 IF((select Count(Parent_IntegrationId) from TBL_APIA_Integration where Parent_IntegrationId=@IntegrationId)=0)
	 BEGIN
		 INSERT INTO TBL_APIA_Integration(ProjectManagerBTG,ProjectManagerIT,ProjectName,ProjectId,PlannedGoLiveDate,            
		 BusinessJustification,BusinessSponsor,ExecutiveSponsor,CostCenterCode,UserJourneyDocumentPath,Status,CreatedAt,CreatedBy,Assign,AssignFrom, ConsumerApplication,Parent_IntegrationId,In_Platform,RDConceptNote)            
		  select ProjectManagerBTG,ProjectManagerIT,ProjectName,ProjectId,PlannedGoLiveDate,BusinessJustification,            
		  BusinessSponsor,ExecutiveSponsor,CostCenterCode,UserJourneyDocumentPath,Status,GETDATE(),CreatedBy,Assign,AssignFrom, ConsumerApplication,@IntegrationId,'External',RDConceptNote  From TBL_APIA_Integration  where   IntegrationId=@IntegrationId

	  SET @IntegrationIdIE=  (SELECT SCOPE_IDENTITY() AS IntegrationId) 


	  IF(@IntegrationIdIE <> 0  or @IntegrationIdIE <> null) 
     BEGIN
	    SET @Feedback = 'New Integration  Created  By User'  

        INSERT INTO tbl_API_ADDA_Feedback (Integration_Id,Feedback_Details,Status,Created_By,Created_Date,IsActive,AssignTo,AssignFrom)     
      VALUES(@IntegrationIdIE,@Feedback,1,@CreatedBy,GETDATE(),@IsActive,'BTGUSER','USER')  
    END

	  END
  ELSE
  BEGIN
    SET @IntegrationIdIE= (SELECT IntegrationId from TBL_APIA_Integration where Parent_IntegrationId=@IntegrationId and Parent_IntegrationId is not null)
  END 
    
  



  ---------------------------------------------Add Service-------Based On Internal & External---------------------------------------------------
--IF(@Purpose!=null and @Purpose!='')
--		Begin
		 INSERT INTO TBL_APIA_ServiceDetails(IntegrationId,ServiceName,Purpose,Existing_New,ConsumerApplication,ProducerApplication,Is_APIGW_Request,Rest_Soap,Transformation,Volume,CreatedBy,CreatedAt      
		,Existing_New_Id      
		,Rest_SOAP_Id      
		,ServiceType_Id      
		,APIType_Id      
		,APICategory_Id      
		,APIRiskScore_Id      
		,PartnerRiskScore_Id      
		,DomainName_Id,     
		ConsumerDC_Id,    
		ProducerDC_Id,    
		Platform,    
		QValue1,    
		QValue2,    
		QValue3,    
		QValue4,    
		QValue5,    
		RiskScore,
		InternalServiceName,
		ExternalServiceName ,
		ConsumerDC,
		ProducerDC,
		ExpectedServiceSpecificationDocument,
		Classification
		  )          
      
		values(      
		@IntegrationIdIE,@ServiceName,@Purpose,@Existing_New,@ConsumerApplication,@ProducerApplication,@Is_APIGW_Request,@Rest_Soap,@Transformation,      
		@Volume,      
		@CreatedBy      
		,getdate()      
		,@Existing_New_Id      
		,@Rest_SOAP_Id      
		,@ServiceType_Id      
		,@APIType_Id      
		,@APICategory_Id      
		,@APIRiskScore_Id      
		,@PartnerRiskScore_Id     
		,@DomainName_Id,    
		@ConsumerDC_Id,    
		@ProducerDC_Id,    
		@Platform,    
		@QValue1,    
		@QValue2,    
		@QValue3,    
		@QValue4,    
		@QValue5,    
		@RiskScore,
		@InternalServiceName,
		@ExternalServiceName ,
		@ConsumerDC,
		@ProducerDC,
		@ExpectedAPISpecificationFileName,
		@Classification
		) 
	--End

  END
END
  
END          
  ELSE IF(@IdentFlag='GetNewIntegrationDetailsById')          
  BEGIN          
    Select IntegrationId,ProjectName,ProjectId,ProjectManagerBTG,ProjectManagerIT,Status as workflowstatus, statusDescription as Status,Assign, AssignFrom,ConsumerApplication,BTG_USER,IT_USER,IT_ARCHITECTURE,ChannelID,ContainerName        
    ,In_Platform AS IN_Platform,ConsumerApplicationId,Isnull(Parent_IntegrationId,0) as ParentIntegrationId,CreatedAt
           
  --CASE         
  --WHEN Status=0 THEN 'Created'        
  --WHEN Status=1 THEN 'Feedback'        
  --WHEN Status=2 THEN 'Updated By User'        
  --WHEN Status=3 THEN 'Review To ITUSER'        
  --WHEN Status=4 THEN 'Review To ITARCHITECH'        
  --WHEN Status=5 THEN 'Rejected'        
  --WHEN Status=6 THEN 'Approved'        
  --END AS Status          
  from TBL_APIA_Integration     
    Inner Join TBL_API_statusMaster As SM on SM.statusCode=Status    
  where IntegrationId=@IntegrationId          
  order by IntegrationId desc          
        
        
        
  select IntegrationId,ProjectManagerBTG,ProjectManagerIT,ProjectName,ProjectId,FORMAT(PlannedGoLiveDate,'dd-MM-yyyy') as PlannedGoLiveDate ,BusinessJustification,BusinessSponsor,ExecutiveSponsor,CostCenterCode,UserJourneyDocumentPath,RDConceptNote,SequenceDiagram,Status,Assign,AssignFrom,
  ConsumerApplication,BTG_USER,IT_USER,IT_ARCHITECTURE,ChannelID,ContainerName,CreatedAt,Parent_IntegrationId,In_Platform AS IN_Platform,ISnull(Parent_IntegrationId,0) as ParentIntegrationId
  From TBL_APIA_Integration           
  where IntegrationId =@IntegrationId          
          
 select ServiceID,IntegrationId,ServiceName,Purpose,Existing_New,ConsumerApplication,ProducerApplication,Is_APIGW_Request,Rest_Soap,Transformation,Volume      
 ,Existing_New_Id,Rest_SOAP_Id,ServiceType_Id,APIType_Id,APICategory_Id,APIRiskScore_Id,PartnerRiskScore_Id,DomainName_Id,ConsumerDC_Id                     
 ,ProducerDC_Id,Platform,QValue1,QValue2,QValue3,QValue4,QValue5 ,RiskScore,Classification,InternalServiceName ,ExternalServiceName,ConsumerDC,
ProducerDC,ExpectedServiceSpecificationDocument                    
  from TBL_APIA_ServiceDetails          
  where IntegrationId =@IntegrationId          
          
  END          
  ELSE IF(@IdentFlag='UpdateIntegrationDetails')          
  BEGIN   
--SET @Assign=(select Top 1 AssignFrom from tbl_API_ADDA_Feedback where Integration_Id=@IntegrationId  order by Feedback_Id desc)        
    
  UPDATE TBL_APIA_Integration SET ProjectManagerBTG=@ProjectManagerBTG,          
  ProjectManagerIT=@ProjectManagerIT,          
  ProjectName=@ProjectName,          
  ProjectId=@ProjectId,          
  PlannedGoLiveDate=@PlannedGoLiveDate,          
  BusinessJustification=@BusinessJustification,          
  BusinessSponsor = @BusinessSponsor,          
  ExecutiveSponsor=@ExecutiveSponsor,          
  CostCenterCode=@CostCenterCode,          
  UserJourneyDocumentPath=@UserJourneyDocumentFileName, 
  RDConceptNote=@RDConceptNoteFileName,
  Status=@Status,          
  UpdatedBy=@UpdatedBy,          
  UpdatedAt=getdate(),        
  Assign=@Assign,    
  AssignFrom=@AssignFrom ,  
  ConsumerApplication =@ConsumerApplication,
  BTG_USER = @BTGUSER,
  IT_USER = @ITUSER,
  IT_ARCHITECTURE = @ITARCHITECTURE,  
  ChannelID =@ChannelID ,
  ContainerName=@ContainerName,
  SequenceDiagram = @SequenceDiagramFileName
  where IntegrationId=@IntegrationId         
   -----------Feedback table------------------------------------------------------------------------       
  IF(@Feedback Is not null And @IntegrationId<>0 )        
     INSERT INTO tbl_API_ADDA_Feedback (Integration_Id,Feedback_Details,Status,Created_By,Created_Date,IsActive,AssignTo,AssignFrom)         
     VALUES(@IntegrationId,@Feedback,@Status,@UpdatedBy,GETDATE(),1,@Assign,@AssignFrom)        
        
  --Set @FeedbackId =(SELECT SCOPE_IDENTITY() AS FeedbackId)    
    
  END          
  ELSE IF(@IdentFlag='UpdateServiceDetails')          
  BEGIN       
	  DECLARE @StatusNew VARCHAR(100)=NULL,@APICategory_IdOld VARCHAR(100)=NULL
	  SET @StatusNew=(SELECT Status FROM TBL_APIA_Integration WHERE IntegrationId=@IntegrationId AND Status IN ('9','10','11'))

	  /* IF user change API category we need new questions and delete the Old One */
      IF @StatusNew IS NOT NULL
	  BEGIN
			SET @APICategory_IdOld=(SELECT APICategory_Id FROM TBL_APIA_ServiceDetails WHERE IntegrationId=@IntegrationId AND ServiceID=@ServiceID)
			IF @APICategory_Id<>@APICategory_IdOld
			BEGIN
				DELETE FROM [tbl_APIA_QusServiceDetails] WHERE ServiceID=@ServiceID
			END
	  END
          
                  
  if(@UpdateFlag='Update')          
  BEGIN          
  UPDATE TBL_APIA_ServiceDetails SET IntegrationId=@IntegrationId,          
  ServiceName=@ServiceName, 
  ExpectedServiceSpecificationDocument = @ExpectedAPISpecificationFileName,
  Purpose=@Purpose,          
  Existing_New=@Existing_New,          
  ConsumerApplication=@ConsumerApplication,          
  ProducerApplication=@ProducerApplication,          
  Is_APIGW_Request=@Is_APIGW_Request,          
  Rest_Soap=@Rest_Soap,          
  Transformation=@Transformation,          
  Volume=@Volume,          
  UpdatedBy=@UpdatedBy,          
  UpdatedAt=GETDATE()  ,        
  Existing_New_Id = @Existing_New_Id,      
  Rest_SOAP_Id = @Rest_SOAP_Id,      
  ServiceType_Id = @ServiceType_Id,      
  APIType_Id = @APIType_Id,      
  APICategory_Id = @APICategory_Id,      
  APIRiskScore_Id = @APIRiskScore_Id,        PartnerRiskScore_Id = @PartnerRiskScore_Id,      
  DomainName_Id = @DomainName_Id ,    
  ConsumerDC_Id= @ConsumerDC_Id,    
  ProducerDC_Id=@ProducerDC_Id,    
  Platform=@Platform,    
  QValue1=@QValue1,    
  QWeightage1=case when @QValue1=1 then 10     
                   when @QValue1=2 then 10    
       when @QValue1=3 then 10    
       when @QValue1=4 then 2 end,    
  QValue2=@QValue2,    
  QWeightage2=case when @QValue2=1 then 12.5     
                   when @QValue2=2 then 5    
       when @QValue2=3 then 0 end,    
  QValue3=@QValue3,    
  QWeightage3=case when @QValue3=1 then 12.5     
                   when @QValue3=2 then 5    
       when @QValue3=3 then 0 end,    
  QValue4=@QValue4,    
  QWeightage4=case when @QValue4=1 then 5     
      when @QValue4=2 then 2 end,    
  QValue5=@QValue5,    
  QWeightage5=case when @QValue5=1 then 10     
                   when @QValue5=2 then 2    
       when @QValue5=3 then 0 end,    
  RiskScore=@RiskScore,    
  Classification=@Classification,
  InternalServiceName = @InternalServiceName,
  ExternalServiceName = @ExternalServiceName,
  ConsumerDC=@ConsumerDC,
  ProducerDC=@ProducerDC
  where ServiceID=@ServiceID       
      
  --select  @FeedbackId as FeedbackId    
  SELECT MAX(Feedback_Id) AS FeedbackId FROM tbl_API_ADDA_Feedback          
    
  END          
  else if(@UpdateFlag='Insert')          
  BEGIN   
  
  --IF(@Purpose!=null and @Purpose!='')
		--Begin
		  INSERT INTO TBL_APIA_ServiceDetails(IntegrationId,ServiceName,Purpose,Existing_New,ConsumerApplication,ProducerApplication,Is_APIGW_Request,Rest_Soap,Transformation,Volume,CreatedBy,CreatedAt      
		 ,Existing_New_Id      
		,Rest_SOAP_Id      
		,ServiceType_Id      
		,APIType_Id      
		,APICategory_Id      
		,APIRiskScore_Id      
		,PartnerRiskScore_Id      
		,DomainName_Id    
		,ConsumerDC_Id    
		,ProducerDC_Id    
		,Platform    
		 ,QValue1    
		 ,QValue2    
		 ,QValue3    
		 ,QValue4    
		 ,QValue5    
		 ,RiskScore    
		 ,Classification 
		 ,InternalServiceName 
		 ,ExternalServiceName
		  ,ConsumerDC
		  ,ProducerDC
		  ,ExpectedServiceSpecificationDocument
		  )          
		  values(@IntegrationId,@ServiceName,@Purpose,@Existing_New,@ConsumerApplication,@ProducerApplication,@Is_APIGW_Request,@Rest_Soap,@Transformation,@Volume,@CreatedBy,getdate()      
		,@Existing_New_Id      
		,@Rest_SOAP_Id      
		,@ServiceType_Id      
		,@APIType_Id      
		,@APICategory_Id      
		,@APIRiskScore_Id      
		,@PartnerRiskScore_Id      
		,@DomainName_Id    
		,@ConsumerDC_Id    
		,@ProducerDC_Id    
		,@Platform    
		,@QValue1    
		,@QValue2    
		,@QValue3    
		,@QValue4    
		,@QValue5    
		,@RiskScore    
		,@Classification 
		,@InternalServiceName
		,@ExternalServiceName
		,@ConsumerDC
		,@ProducerDC,
		@ExpectedAPISpecificationFileName
		  )    
	--End
            
  select ServiceID,IntegrationId,ServiceName,Purpose,Existing_New,ConsumerApplication,ProducerApplication,Is_APIGW_Request,Rest_Soap,Transformation,Volume ,Existing_New_Id      
,Rest_SOAP_Id      
,ServiceType_Id      
,APIType_Id      
,APICategory_Id      
,APIRiskScore_Id      
,PartnerRiskScore_Id      
,DomainName_Id     
,ConsumerDC_Id    
 ,ProducerDC_Id    
 ,Platform    
 ,QValue1    
 ,QValue2    
 ,QValue3    
 ,QValue4    
 ,QValue5    
 ,RiskScore    
 ,Classification    
,@FeedbackId as FeedbackId  
,InternalServiceName
,ExternalServiceName
,ConsumerDC
,ProducerDC,
ExpectedServiceSpecificationDocument
from TBL_APIA_ServiceDetails          
  where IntegrationId =@IntegrationId          
    
 --set @FeedbackId as FeedbackId    
            
  END          
        
        
  END          
        
  else if(@IdentFlag='CheckProjectExist')        
  BEGIN        
  select Count(*) count1 from TBL_APIA_Integration where ProjectId=@ProjectId        
  END     
      
  else if(@IdentFlag='FillExectingServiceName')        
  BEGIN        
 -- select TBL_API_Main_ID as 'ExServiceId' ,COD_SERVICE_ID as 'ExServiceName'  from TBL_API_Main    
    select TBL_API_Main_ID as 'ExServiceId' ,OBP_SERVICE_URL_UAT as 'ExServiceName', COD_SERVICE_ID as 'ExCodServiceId'  from TBL_API_Main    
  END     
    
   else if(@IdentFlag='FillExectingSerNameOnId')        
  BEGIN  


  Declare  @InternalServiceId varchar(max)
   Set @InternalServiceId=(Select Top 1 RIGHT(OBP_SERVICE_URL_UAT, CHARINDEX('/',REVERSE(OBP_SERVICE_URL_UAT))-1) from [dbo].TBL_API_Main where   TBL_API_Main_ID=@servicenameId )

  Declare @ExternalServiceId varchar(max)
  Set @ExternalServiceId=(Select  Top 1 COD_SERVICE_ID from [dbo].[TBL_API_EXTERNALSERVICES] where OBP_SERVICE_URL_UAT Like '%'+ @InternalServiceId + '%')

  select     
     Top 1
  SERVICE_PROVIDER,    
  Isnull(APIType. MisccdId,0) as APITypeId,    
  Isnull(APICate. MisccdId,0) as APICatId,    
  Isnull(DOMAINNAME. MisccdId,0) as DomainId,    
  Isnull(RestSoap. MisccdId,0) as RestSoapId,    
  --Isnull(ProducerDC. MisccdId,0) as ProducerDC,  
  Isnull(SERVICE_PROVIDER,0) as ProducerDC, 
  Isnull(ServiceType. MisccdId,0) as ServiceType,    
  Isnull(APIRiskClassify. MisccdId,0) as APIRiskClassify ,
  ISNULL( @ExternalServiceId,'') As ExternalCoDServiceID,
  ISNULL( FILLER_09,0) As APIRiskSocre,
  ISNULL( FILLER_10,'') As APIRiskClassification
    
  from TBL_API_Main     
  Left join [dbo].[tbl_API_Adda_Misccd] As APIType on APIType.CDValDesc=TBL_API_Main.API_TYPE    
  Left join [dbo].[tbl_API_Adda_Misccd] As APICate on APICate.CDValDesc=TBL_API_Main.API_CAT    
  Left join [dbo].[tbl_API_Adda_Misccd] As DOMAINNAME on DOMAINNAME.CDValDesc=TBL_API_Main.DOMAIN_NAME    
  Left join [dbo].[tbl_API_Adda_Misccd] As RestSoap on RestSoap.CDValDesc=TBL_API_Main.SERVICE_INTERFACE_TYPE    
  --Left join [dbo].[tbl_API_Adda_Misccd] As ProducerDC on ProducerDC.CDValDesc=TBL_API_Main.FILLER_10     
  --and ProducerDC.CDTP='Producer DC'    
  Left join [dbo].[tbl_API_Adda_Misccd] As ServiceType on ServiceType.CDValDesc=TBL_API_Main.Service_Type    
  Left join [dbo].[tbl_API_Adda_Misccd] As APIRiskClassify on APIRiskClassify.CDValDesc=TBL_API_Main.filler_02    
  where TBL_API_Main_ID=@servicenameId    
  END     

  else if(@IdentFlag='FillExternalServiceName')        
  BEGIN        
    
	 --select EXTERNALSERVICE_ID as 'ExServiceId' ,OBP_SERVICE_URL_UAT as 'ExServiceName'  from [TBL_API_EXTERNALSERVICES] 
   select COD_SERVICE_ID as 'ExServiceId' ,OBP_SERVICE_URL_UAT as 'ExServiceName', COD_SERVICE_ID as 'ExCodServiceId'  from [TBL_API_EXTERNALSERVICES]    
  END 
  else if(@IdentFlag='FillExternalService ')        
  BEGIN 
  
  Declare @ExternalCodServiceId varchar(max)
  Set @ExternalCodServiceId=(Select Top 1 RIGHT(OBP_SERVICE_URL_UAT, CHARINDEX('/',REVERSE(OBP_SERVICE_URL_UAT))-1) from [dbo].[TBL_API_EXTERNALSERVICES] where (OBP_SERVICE_URL_UAT Like '%'+@ExternalServiceText+'%' OR COD_SERVICE_ID Like '%'+@ExternalServiceText+'%'))

  Declare @CheckExternalService int

  set @CheckExternalService=(Select   Count(COD_SERVICE_ID)  from TBL_API_Main  where OBP_SERVICE_URL_UAT like '%'+@ExternalCodServiceId +'%')    
  
  If(@CheckExternalService>0)
  BEGIN
  Select
  Top 1
 OBP_SERVICE_URL_UAT as 'OBP_SERVICE_URL_UAT',
  SERVICE_PROVIDER,    
  Isnull(APIType. MisccdId,0) as APITypeId,    
  Isnull(APICate. MisccdId,0) as APICatId,    
  Isnull(DOMAINNAME. MisccdId,0) as DomainId,    
  Isnull(RestSoap. MisccdId,0) as RestSoapId,    
  --Isnull(ProducerDC. MisccdId,0) as ProducerDC,  
  Isnull(SERVICE_PROVIDER,0) as ProducerDC, 
  Isnull(ServiceType. MisccdId,0) as ServiceType,   
  Isnull(APIRiskClassify. MisccdId,0) as APIRiskClassify,
  ISNULL( FILLER_09,'0') As APIRiskSocre,
  ISNULL( FILLER_10,'') As APIRiskClassification
    
  --from TBL_API_EXTERNALSERVICES Main 
  from TBL_API_Main  Main 
  Left join [dbo].[tbl_API_Adda_Misccd] As APIType on APIType.CDValDesc=Main.API_TYPE    
  Left join [dbo].[tbl_API_Adda_Misccd] As APICate on APICate.CDValDesc=Main.API_CAT    
  Left join [dbo].[tbl_API_Adda_Misccd] As DOMAINNAME on DOMAINNAME.CDValDesc=Main.DOMAIN_NAME    
  Left join [dbo].[tbl_API_Adda_Misccd] As RestSoap on RestSoap.CDValDesc=Main.SERVICE_INTERFACE_TYPE    
  --Left join [dbo].[tbl_API_Adda_Misccd] As ProducerDC on ProducerDC.CDValDesc=Main.FILLER_10     
  --and ProducerDC.CDTP='Producer DC'    
  Left join [dbo].[tbl_API_Adda_Misccd] As ServiceType on ServiceType.CDValDesc=Main.Service_Type   
  Left join [dbo].[tbl_API_Adda_Misccd] As APIRiskClassify on APIRiskClassify.CDValDesc=Main.filler_02    
  where OBP_SERVICE_URL_UAT like '%'+@ExternalCodServiceId +'%'  
  END
  ELSE
  BEGIN
  Select
  Top 1
 --COD_SERVICE_ID as 'OBP_SERVICE_URL_UAT',
 '' as 'OBP_SERVICE_URL_UAT',
  SERVICE_PROVIDER,    
  Isnull(APIType. MisccdId,0) as APITypeId,    
  Isnull(APICate. MisccdId,0) as APICatId,    
  Isnull(DOMAINNAME. MisccdId,0) as DomainId,    
  Isnull(RestSoap. MisccdId,0) as RestSoapId,    
 -- Isnull(ProducerDC. MisccdId,0) as ProducerDC,    
  Isnull(SERVICE_PROVIDER,0) as ProducerDC,  
  Isnull(ServiceType. MisccdId,0) as ServiceType,   
  Isnull(APIRiskClassify. MisccdId,0) as APIRiskClassify,
  ISNULL( FILLER_03,'0') As APIRiskSocre,
  ISNULL( FILLER_02,'') As APIRiskClassification
    
  from  TBL_API_EXTERNALSERVICES   TBL_API_Main   
  Left join [dbo].[tbl_API_Adda_Misccd] As APIType on APIType.CDValDesc=TBL_API_Main.API_TYPE_    
  Left join [dbo].[tbl_API_Adda_Misccd] As APICate on APICate.CDValDesc=TBL_API_Main.API_CAT    
  Left join [dbo].[tbl_API_Adda_Misccd] As DOMAINNAME on DOMAINNAME.CDValDesc=TBL_API_Main.DOMAIN_NAME    
  Left join [dbo].[tbl_API_Adda_Misccd] As RestSoap on RestSoap.CDValDesc=TBL_API_Main.SERVICE_INTERFACE_TYPE    
  --Left join [dbo].[tbl_API_Adda_Misccd] As ProducerDC on ProducerDC.CDValDesc=TBL_API_Main.FILLER_10     
  --and ProducerDC.CDTP='Producer DC'    
  Left join [dbo].[tbl_API_Adda_Misccd] As ServiceType on ServiceType.CDValDesc=TBL_API_Main.Service_Type    
  Left join [dbo].[tbl_API_Adda_Misccd] As APIRiskClassify on APIRiskClassify.CDValDesc=TBL_API_Main.filler_02    
  where OBP_SERVICE_URL_UAT like '%'+@ExternalCodServiceId +'%'  
  END
  



  END       
  else if(@IdentFlag='FillTestApiAuto')        
  BEGIN        
  --select TBL_API_Main_ID as Id,OBP_SERVICE_URL_UAT as ServiceURL,FileName as 'path' from TBL_API_Main where  (PRODUCT_PROCESSOR_URL_UAT is not null and PRODUCT_PROCESSOR_URL_UAT<>'NA')    
    select distinct tblapimain.TBL_API_Main_ID as Id,tblapimain.OBP_SERVICE_URL_UAT as ServiceURL,tblapifilepath.FileName as 'path',SERVICE_INTERFACE_TYPE as apiCategory from TBL_API_Main tblapimain    
  Left Join Tbl_API_FilePath tblapifilepath on tblapimain.OBP_SERVICE_URL_UAT=tblapifilepath.OBP_SERVICE_URL_UAT     
  where  (tblapimain.OBP_SERVICE_URL_UAT is not null and tblapimain.OBP_SERVICE_URL_UAT<>'NA')      
  END 
  
  else if(@IdentFlag='FillHostApplication')        
  BEGIN        
   
   select Id As 'HostId',(IsNull(APPShortName,'')+'-'+Isnull(FullName,'') ) as 'HostAppName', ITGRCCode,ITGRCName from tbl_API_MstApplications
  END 
  else if(@IdentFlag='FillHostingDC')        
  BEGIN        
   
   select Id As 'HostId',FullName  as 'HostAppName', HostingDC from tbl_API_MstApplications where Id=@HostAppID
  END 

  else if(@IdentFlag='FillHostingDCtext')        
  BEGIN        
   
    
	set @HostApptext=(select case when @HostApptext Like '%#%' then SUBSTRING(@HostApptext, 1,CHARINDEX('#', @HostApptext)-1) else @HostApptext end)


   select Id As 'HostId',FullName  as 'HostAppName', HostingDC from tbl_API_MstApplications where (FullName=@HostApptext OR APPShortName=@HostApptext)

   select Id As 'HostId',FullName  as 'HostAppName', ITGRCCode,ITGRCName from tbl_API_MstApplications where (FullName=@HostApptext OR APPShortName=@HostApptext)

  END

  else if(@IdentFlag='FillConsumerDCNamebyText')        
  BEGIN   
          select  Id As 'HostId',FullName  as 'HostAppName', HostingDC from tbl_API_MstApplications where FullName=SUBSTRING(@ConsumerApplication, CHARINDEX('-', @ConsumerApplication) + 1, LEN(@ConsumerApplication))       
  END



  else if(@IdentFlag='CheckConsumerAppName')        
  BEGIN   
  --select Count(*) count1 from tbl_API_MstApplications where FullName=@ConsumerApplication       
  select Count(*) count1 from tbl_API_MstApplications where FullName=SUBSTRING(@ConsumerApplication, CHARINDEX('-', @ConsumerApplication) + 1, LEN(@ConsumerApplication))       
  END 

   else if(@IdentFlag='CheckProducerAppName')        
  BEGIN        
  --select Count(*) count1 from tbl_API_MstApplications where FullName=@ProducerApplication  
  select Count(*) count1 from tbl_API_MstApplications where FullName=SUBSTRING(@ProducerApplication, CHARINDEX('-', @ProducerApplication) + 1, LEN(@ProducerApplication))
  END
          
	ELSE if(@IdentFlag='GetId')        
  BEGIN        
  SELECT TOP 1 IntegrationId FROM TBL_APIA_Integration ORDER BY IntegrationId DESC           
  END
      
ELSE if(@IdentFlag='GetDate')        
  BEGIN        
  SELECT CreatedAt FROM TBL_APIA_Integration WHERE IntegrationId = @IntegrationId           
  END
  ELSE if(@IdentFlag='GetSpocEmailIDs')        
  BEGIN        
  SELECT EmailAddress from tbl_API_ApplicationsSPOC where APPID =  @ConsumerId  
  END

  ELSE if(@IdentFlag='QuestionInsert')        
  BEGIN        
 DECLARE @QueServiceID int 

  SET @QueServiceID= (select [ServiceID] From [tbl_APIA_QusServiceDetails] where [ServiceID]=@ServiceID AND QID=@QID)

 If ISNULL(@QueServiceID,'')<>''
 BEGIN
	--DELETE  from tbl_APIA_QusServiceDetails where ServiceID=@QueServiceID

	UPDATE tbl_APIA_QusServiceDetails
	SET 
	[OptionsID]=@OptionsID,
	Updatedby= @CreatedBy,
	UpdatedAt= getDate()
	WHERE [ServiceID]=@ServiceID AND QID=@QID
 END 
 ELSE
 BEGIN
  INSERT INTO [dbo].[tbl_APIA_QusServiceDetails]
	(
	       [ServiceID]
           ,[QID]
           ,[OptionsID]
           ,[IsActive]
           ,[CreatedBy]
           ,[CreatedAt]
           )
     VALUES
           (
		   @ServiceID,
           @QID,
           @OptionsID,
           @IsActive,
           @CreatedBy,
           getDate()
		   )     
   END     
  END

  ELSE if(@IdentFlag='GetQes')        
  BEGIN
     select ServiceID,APQ.QID,OptionsID,Weightage,options as val
	 from [tbl_APIA_QusServiceDetails] APQ
	 Inner Join  [TBL_APIA_QuestionData] as AQ on AQ.ID=OptionsID
	 WHERE ServiceID=@ServiceID
	 
  END

  ---------------------------------------------------------------------Darfting Integration---start-----------------------------------------------------------------------------------------------
   ELSE IF @IdentFlag='DeleteDraft'
	BEGIN
		/*DECLARE @IntegrationId VARCHAR(100)='1485';
		DECLARE @SVCId VARCHAR(100)='1615,0,1617,';
		SELECT * FROM TBL_APIA_ServiceDetails WHERE IntegrationId=@IntegrationId AND ISNULL(@SVCId,'')<>'' 
		AND ISNULL(@SVCId,',')<>',' AND ServiceID NOT IN(



SELECT CAST(Item AS INT) FROM dbo.SplitString(@SVCId, ','))
		SELECT * FROM TBL_APIA_ServiceDetails WHERE IntegrationId=@IntegrationId
		SELECT CAST(Item AS INT) FROM dbo.SplitString(@SVCId, ',')    */ 

		DELETE FROM TBL_APIA_ServiceDetails WHERE IntegrationId=@IntegrationId AND ISNULL(@ServiceID,'')<>'' 
		AND ISNULL(@ServiceID,',')<>',' AND ServiceID NOT IN(SELECT CAST(Item AS INT) FROM dbo.SplitString(@ServiceID, ','))                                                                                    

      
	END
  ELSE IF(@IdentFlag='DraftAddNewIntegration')            
  BEGIN            
  INSERT INTO TBL_APIA_Integration(ProjectManagerBTG,ProjectManagerIT,ProjectName,ProjectId,PlannedGoLiveDate,            
  BusinessJustification,BusinessSponsor,ExecutiveSponsor,CostCenterCode,UserJourneyDocumentPath,Status,CreatedAt,CreatedBy,Assign,AssignFrom, ConsumerApplication,RDConceptNote,In_Platform)            
  VALUES(@ProjectManagerBTG,@ProjectManagerIT,@ProjectName,@ProjectId,@PlannedGoLiveDate,@BusinessJustification,            
  @BusinessSponsor,@ExecutiveSponsor,@CostCenterCode,@UserJourneyDocumentFileName,@Status,GETDATE(),@CreatedBy,@Assign,@AssignFrom, @ConsumerApplication,@RDConceptNoteFileName, 'NoPlatfrom')      
    
  SET @IntegrationId=  (SELECT SCOPE_IDENTITY() AS IntegrationId)    
  SET @Feedback = 'New Integration  Draft  By User'    
  IF(@IntegrationId <> 0  or @IntegrationId <> null)    
        INSERT INTO tbl_API_ADDA_Feedback (Integration_Id,Feedback_Details,Status,Created_By,Created_Date,IsActive,AssignTo,AssignFrom)     
      VALUES(@IntegrationId,@Feedback,@Status,@CreatedBy,GETDATE(),@IsActive,@Assign,@AssignFrom)    
      
      SELECT @IntegrationId AS IntegrationId;    
           
          
  END 
  ELSE IF(@IdentFlag='DraftAddServiceDetails')          
  BEGIN  

		--IF(@Purpose!=null and @Purpose!='')
		--Begin
			INSERT INTO TBL_APIA_ServiceDetails(IntegrationId,ServiceName,Purpose,Existing_New,ConsumerApplication,ProducerApplication,Is_APIGW_Request,Rest_Soap,Transformation,Volume,CreatedBy,CreatedAt      
			,Existing_New_Id      
			,Rest_SOAP_Id      
			,ServiceType_Id      
			,APIType_Id      
			,APICategory_Id      
			,APIRiskScore_Id      
			,PartnerRiskScore_Id      
			,DomainName_Id,     
			ConsumerDC_Id,    
			ProducerDC_Id,    
			Platform,    
			QValue1,    
			QValue2,    
			QValue3,    
			QValue4,    
			QValue5,    
			RiskScore,
			InternalServiceName,
			ExternalServiceName ,
			ConsumerDC,
			ProducerDC,
			ExpectedServiceSpecificationDocument,
			Classification
			)          
			values(      
			@IntegrationId,@ServiceName,@Purpose,@Existing_New,@ConsumerApplication,@ProducerApplication,@Is_APIGW_Request,@Rest_Soap,@Transformation,      
			@Volume,      
			@CreatedBy      
			,getdate()      
			,@Existing_New_Id      
			,@Rest_SOAP_Id      
			,@ServiceType_Id      
			,@APIType_Id      
			,@APICategory_Id      
			,@APIRiskScore_Id      
			,@PartnerRiskScore_Id     
			,@DomainName_Id,    
			@ConsumerDC_Id,    
			@ProducerDC_Id,    
			@Platform,    
			@QValue1,    
			@QValue2,    
			@QValue3,    
			@QValue4,    
			@QValue5,    
			@RiskScore,
			@InternalServiceName,
			@ExternalServiceName ,
			@ConsumerDC,
			@ProducerDC,
			@ExpectedAPISpecificationFileName,
			@Classification
			)  
		--End
  END 
 
ELSE IF(@IdentFlag='DarftUpdateServiceDetails')          
  BEGIN          
 IF(@UpdateFlag='Update')          
  BEGIN 

 --IF(@Platform ='Internal & External' Or @Platform ='External')
 -- BEGIN
  
 
  -------------------------------------------------------------------Add New Integration----Based On Internal & External--------------------------------------------------------------------------
 --DECLARE @InternalCount int
 --DECLARE @ExternalCount int
 --DECLARE @InternalExternalCount int

 --SET @InternalCount= (select count(Platform) from TBL_APIA_ServiceDetails where Platform='Internal' and IntegrationId=@IntegrationId)
 --SET @ExternalCount= (select count(Platform) from TBL_APIA_ServiceDetails where Platform='External' and IntegrationId=@IntegrationId)
 --SET @InternalExternalCount= (select count(Platform) from TBL_APIA_ServiceDetails where Platform='Internal & External' and IntegrationId=@IntegrationId)

 --IF (@ExternalCount>0 AND @ExternalCount=0 AND @InternalExternalCount=0)
 --BEGIN
        If(@flagPl='All')
		   BEGIN
              UPDATE TBL_APIA_Integration set In_Platform= 'Internal' WHERE IntegrationId=@IntegrationId
			END 
			 ELSE IF(@flagPl='single' and @Platform='Internal & External' )
             BEGIN 
               UPDATE TBL_APIA_Integration set In_Platform= 'Internal' WHERE IntegrationId=@IntegrationId
	           SET @flagPl='All'
             END 
			 ELSE
			 BEGIN
			     UPDATE TBL_APIA_Integration set In_Platform= @Platform WHERE IntegrationId=@IntegrationId
			END
		  UPDATE 
			  TBL_APIA_ServiceDetails SET 
			  IntegrationId=@IntegrationId,          
			  ServiceName=@ServiceName,          
			  Purpose=@Purpose,          
			  Existing_New=@Existing_New,          
			  ConsumerApplication=@ConsumerApplication,          
			  ProducerApplication=@ProducerApplication,          
			  Is_APIGW_Request=@Is_APIGW_Request,          
			  Rest_Soap=@Rest_Soap,          
			  Transformation=@Transformation,          
			  Volume=@Volume,          
			  UpdatedBy=@UpdatedBy,          
			  UpdatedAt=GETDATE()  ,        
			  Existing_New_Id = @Existing_New_Id,      
			  Rest_SOAP_Id = @Rest_SOAP_Id,      
			  ServiceType_Id = @ServiceType_Id,      
			  APIType_Id = @APIType_Id,      
			  APICategory_Id = @APICategory_Id,      
			  APIRiskScore_Id = @APIRiskScore_Id,        
			  PartnerRiskScore_Id = @PartnerRiskScore_Id,      
			  DomainName_Id = @DomainName_Id ,    
			  ConsumerDC_Id= @ConsumerDC_Id,    
			  ProducerDC_Id=@ProducerDC_Id,    
			  Platform=@Platform,    
			  QValue1=@QValue1,    
			  QWeightage1=case when @QValue1=1 then 10     
							   when @QValue1=2 then 10    
				   when @QValue1=3 then 10    
				   when @QValue1=4 then 2 end,    
			  QValue2=@QValue2,    
			  QWeightage2=case when @QValue2=1 then 12.5     
							   when @QValue2=2 then 5    
				   when @QValue2=3 then 0 end,    
			  QValue3=@QValue3,    
			  QWeightage3=case when @QValue3=1 then 12.5     
							   when @QValue3=2 then 5    
				   when @QValue3=3 then 0 end,    
			  QValue4=@QValue4,    
			  QWeightage4=case when @QValue4=1 then 5     
				  when @QValue4=2 then 2 end,    
			  QValue5=@QValue5,    
			  QWeightage5=case when @QValue5=1 then 10     
							   when @QValue5=2 then 2    
				   when @QValue5=3 then 0 end,    
			  RiskScore=@RiskScore,    
			  Classification=@Classification,
			  InternalServiceName = @InternalServiceName,
			  ExternalServiceName = @ExternalServiceName,
			  ConsumerDC=@ConsumerDC,
			  ProducerDC=@ProducerDC
			  where ServiceID=@ServiceID       

-- END
 If(@flagPl='All') ---((@InternalCount>0 AND @ExternalCount>0) OR (@InternalCount>0 AND @InternalExternalCount>0) OR (@ExternalCount>0 AND @InternalExternalCount>0) )
 BEGIN
 
 Declare @IntegrationIdIED int
 IF((select Count(Parent_IntegrationId) from TBL_APIA_Integration where Parent_IntegrationId=@IntegrationId)=0)
 BEGIN
     INSERT INTO TBL_APIA_Integration(ProjectManagerBTG,ProjectManagerIT,ProjectName,ProjectId,PlannedGoLiveDate,            
     BusinessJustification,BusinessSponsor,ExecutiveSponsor,CostCenterCode,UserJourneyDocumentPath,Status,CreatedAt,CreatedBy,Assign,AssignFrom, ConsumerApplication,Parent_IntegrationId,In_Platform,RDConceptNote)            
      select ProjectManagerBTG,ProjectManagerIT,ProjectName,ProjectId,PlannedGoLiveDate,BusinessJustification,            
      BusinessSponsor,ExecutiveSponsor,CostCenterCode,UserJourneyDocumentPath,Status,GETDATE(),CreatedBy,Assign,AssignFrom, ConsumerApplication,@IntegrationId,'External',RDConceptNote  From TBL_APIA_Integration  where   IntegrationId=@IntegrationId

  SET @IntegrationIdIED=  (SELECT SCOPE_IDENTITY() AS IntegrationId) 

  SET @Feedback = 'New Integration  Draft  By User'   
  Set @CreatedBy = (select CreatedBy from TBL_APIA_Integration where IntegrationId=@IntegrationId)
  IF(@IntegrationIdIED <> 0  or @IntegrationIdIED <> null) 
    BEGIN
        INSERT INTO tbl_API_ADDA_Feedback (Integration_Id,Feedback_Details,Status,Created_By,Created_Date,IsActive,AssignTo,AssignFrom)     
        VALUES(@IntegrationIdIED,@Feedback,12,@CreatedBy,GETDATE(),@IsActive,'BTGUSER','USER')  
		
		 SET @Feedback = 'New Integration  Created  By User' 
		INSERT INTO tbl_API_ADDA_Feedback (Integration_Id,Feedback_Details,Status,Created_By,Created_Date,IsActive,AssignTo,AssignFrom)     
        VALUES(@IntegrationIdIED,@Feedback,1,@CreatedBy,GETDATE(),@IsActive,'BTGUSER','USER')  

		INSERT INTO tbl_API_ADDA_Feedback (Integration_Id,Feedback_Details,Status,Created_By,Created_Date,IsActive,AssignTo,AssignFrom)     
        VALUES(@IntegrationId,@Feedback,1,@CreatedBy,GETDATE(),@IsActive,'BTGUSER','USER')  
	   
    END 
  END
  ELSE
  BEGIN
    SET @IntegrationIdIED= (SELECT IntegrationId from TBL_APIA_Integration where Parent_IntegrationId=@IntegrationId and Parent_IntegrationId is not null)
  END 

   UPDATE TBL_APIA_Integration set In_Platform= 'External' WHERE Parent_IntegrationId=@IntegrationIdIED
  ---------------------------------------------Add Service-------Based On Internal & External---------------------------------------------------

  INSERT INTO TBL_APIA_ServiceDetails(IntegrationId,ServiceName,Purpose,Existing_New,ConsumerApplication,ProducerApplication,Is_APIGW_Request,Rest_Soap,Transformation,Volume,CreatedBy,CreatedAt      
  ,Existing_New_Id      
,Rest_SOAP_Id   
,ServiceType_Id      
,APIType_Id      
,APICategory_Id      
,APIRiskScore_Id      
,PartnerRiskScore_Id      
,DomainName_Id,     
ConsumerDC_Id,    
ProducerDC_Id,    
Platform,    
QValue1,    
QValue2,    
QValue3,    
QValue4,    
QValue5,    
RiskScore,
InternalServiceName,
ExternalServiceName ,
ConsumerDC,
ProducerDC,
ExpectedServiceSpecificationDocument,
Classification
  )          
  Select  
  @IntegrationIdIED,ServiceName,Purpose,Existing_New,ConsumerApplication,ProducerApplication,Is_APIGW_Request,Rest_Soap,Transformation,Volume,CreatedBy,CreatedAt      
  ,Existing_New_Id      
,Rest_SOAP_Id      
,ServiceType_Id      
,APIType_Id      
,APICategory_Id      
,APIRiskScore_Id      
,PartnerRiskScore_Id      
,DomainName_Id,     
ConsumerDC_Id,    
ProducerDC_Id,    
Platform,    
QValue1,    
QValue2,    
QValue3,    
QValue4,    
QValue5,    
RiskScore,
InternalServiceName,
ExternalServiceName ,
ConsumerDC,
ProducerDC,
ExpectedServiceSpecificationDocument,
Classification
From TBL_APIA_ServiceDetails where ServiceID=@ServiceID   

     --DELETE FROM TBL_APIA_ServiceDetails where ServiceID=@ServiceID   
END

END
 
  SELECT MAX(Feedback_Id) AS FeedbackId FROM tbl_API_ADDA_Feedback 
 IF(@UpdateFlag='Insert') 
  BEGIN      
 
    If(@flagPl='All')
		   BEGIN
              UPDATE TBL_APIA_Integration set In_Platform= 'Internal' WHERE IntegrationId=@IntegrationId
			END 
			ELSE IF(@flagPl='single' and @Platform='Internal & External' )
             BEGIN 
               UPDATE TBL_APIA_Integration set In_Platform= 'Internal' WHERE IntegrationId=@IntegrationId
	           SET @flagPl='All'
             END 
			 ELSE
			 BEGIN
			     UPDATE TBL_APIA_Integration set In_Platform= @Platform WHERE IntegrationId=@IntegrationId
			END
	--IF(@Purpose!=null and @Purpose!='')
	--	Begin
		INSERT INTO TBL_APIA_ServiceDetails(IntegrationId,ServiceName,Purpose,Existing_New,ConsumerApplication,ProducerApplication,Is_APIGW_Request,Rest_Soap,Transformation,Volume,CreatedBy,CreatedAt      
		 ,Existing_New_Id      
		,Rest_SOAP_Id      
		,ServiceType_Id      
		,APIType_Id      
		,APICategory_Id      
		,APIRiskScore_Id      
		,PartnerRiskScore_Id      
		,DomainName_Id    
		,ConsumerDC_Id    
		,ProducerDC_Id    
		,Platform    
		 ,QValue1    
		 ,QValue2    
		 ,QValue3    
		 ,QValue4    
		 ,QValue5    
		 ,RiskScore    
		 ,Classification 
		 ,InternalServiceName 
		 ,ExternalServiceName
		  ,ConsumerDC
		  ,ProducerDC
		  ,ExpectedServiceSpecificationDocument
  
		  )          
		  values(@IntegrationId,@ServiceName,@Purpose,@Existing_New,@ConsumerApplication,@ProducerApplication,@Is_APIGW_Request,@Rest_Soap,@Transformation,@Volume,@CreatedBy,getdate()      
		,@Existing_New_Id      
		,@Rest_SOAP_Id      
		,@ServiceType_Id      
		,@APIType_Id      
		,@APICategory_Id      
		,@APIRiskScore_Id      
		,@PartnerRiskScore_Id      
		,@DomainName_Id    
		,@ConsumerDC_Id    
		,@ProducerDC_Id    
		,@Platform    
		,@QValue1    
		,@QValue2    
		,@QValue3    
		,@QValue4    
		,@QValue5    
		,@RiskScore    
		,@Classification 
		,@InternalServiceName
		,@ExternalServiceName
		,@ConsumerDC
		,@ProducerDC
		,@ExpectedAPISpecificationFileName

		  ) 
		  --End
   
 --DECLARE @InternalCountID int
 --DECLARE @ExternalCountID int
 --DECLARE @InternalExternalCountID int

 --SET @InternalCountID= (select count(Platform) from TBL_APIA_ServiceDetails where Platform='Internal' and IntegrationId=@IntegrationId)
 --SET @ExternalCountID= (select count(Platform) from TBL_APIA_ServiceDetails where Platform='External' and IntegrationId=@IntegrationId)
 --SET @InternalExternalCountID= (select count(Platform) from TBL_APIA_ServiceDetails where Platform='Internal & External' and IntegrationId=@IntegrationId)


If(@flagPl='All')   --((@InternalCountID>0 AND @ExternalCountID>0) OR (@InternalCountID>0 AND @InternalExternalCountID>0) OR (@ExternalCountID>0 AND @InternalExternalCountID>0) )
  BEGIN
  Declare @IntegrationIdIEDE int
  -------------------------------------------------------------------Add New Integration----Based On Internal & External--------------------------------------------------------------------------
 IF((select Count(Parent_IntegrationId) from TBL_APIA_Integration where Parent_IntegrationId=@IntegrationId)=0)
 BEGIN
     INSERT INTO TBL_APIA_Integration(ProjectManagerBTG,ProjectManagerIT,ProjectName,ProjectId,PlannedGoLiveDate,            
     BusinessJustification,BusinessSponsor,ExecutiveSponsor,CostCenterCode,UserJourneyDocumentPath,Status,CreatedAt,CreatedBy,Assign,AssignFrom, ConsumerApplication,Parent_IntegrationId,In_Platform,RDConceptNote)            
      select ProjectManagerBTG,ProjectManagerIT,ProjectName,ProjectId,PlannedGoLiveDate,BusinessJustification,            
      BusinessSponsor,ExecutiveSponsor,CostCenterCode,UserJourneyDocumentPath,Status,GETDATE(),CreatedBy,Assign,AssignFrom, ConsumerApplication,@IntegrationId,'External',RDConceptNote  From TBL_APIA_Integration  where   IntegrationId=@IntegrationId

  SET @IntegrationIdIEDE=  (SELECT SCOPE_IDENTITY() AS IntegrationId) 

  END
  ELSE
  BEGIN
    SET @IntegrationIdIEDE= (SELECT IntegrationId from TBL_APIA_Integration where Parent_IntegrationId=@IntegrationId and Parent_IntegrationId is not null)
  END 
  ---------------------------------------------Add Service-------Based On Internal & External---------------------------------------------------
   UPDATE TBL_APIA_Integration set In_Platform= 'External'WHERE IntegrationId=@IntegrationId
  -- 	IF(@Purpose!=null and @Purpose!='')
		--Begin
		   INSERT INTO TBL_APIA_ServiceDetails(IntegrationId,ServiceName,Purpose,Existing_New,ConsumerApplication,ProducerApplication,Is_APIGW_Request,Rest_Soap,Transformation,Volume,CreatedBy,CreatedAt      
		 ,Existing_New_Id      
		,Rest_SOAP_Id      
		,ServiceType_Id      
		,APIType_Id      
		,APICategory_Id      
		,APIRiskScore_Id      
		,PartnerRiskScore_Id      
		,DomainName_Id    
		,ConsumerDC_Id    
		,ProducerDC_Id    
		,Platform    
		 ,QValue1    
		 ,QValue2    
		 ,QValue3    
		 ,QValue4    
		 ,QValue5    
		 ,RiskScore   
		 ,Classification 
		 ,InternalServiceName 
		 ,ExternalServiceName
		  ,ConsumerDC
		  ,ProducerDC
		  ,ExpectedServiceSpecificationDocument
		  )          
		  values(@IntegrationIdIEDE,@ServiceName,@Purpose,@Existing_New,@ConsumerApplication,@ProducerApplication,@Is_APIGW_Request,@Rest_Soap,@Transformation,@Volume,@CreatedBy,getdate()      
		,@Existing_New_Id      
		,@Rest_SOAP_Id      
		,@ServiceType_Id      
		,@APIType_Id      
		,@APICategory_Id      
		,@APIRiskScore_Id      
		,@PartnerRiskScore_Id      
		,@DomainName_Id    
		,@ConsumerDC_Id    
		,@ProducerDC_Id    
		,@Platform    
		,@QValue1    
		,@QValue2    
		,@QValue3    
		,@QValue4    
		,@QValue5    
		,@RiskScore    
		,@Classification 
		,@InternalServiceName
		,@ExternalServiceName
		,@ConsumerDC
		,@ProducerDC
		,@ExpectedAPISpecificationFileName
		  ) 
		--End

--DELETE FROM TBL_APIA_ServiceDetails where ServiceID=@ServiceID   

END
 select ServiceID,IntegrationId,ServiceName,Purpose,Existing_New,ConsumerApplication,ProducerApplication,Is_APIGW_Request,Rest_Soap,Transformation,Volume ,Existing_New_Id      
,Rest_SOAP_Id      
,ServiceType_Id      
,APIType_Id      
,APICategory_Id      
,APIRiskScore_Id      
,PartnerRiskScore_Id      
,DomainName_Id     
,ConsumerDC_Id 
 ,ProducerDC_Id    
 ,Platform    
 ,QValue1    
 ,QValue2    
 ,QValue3    
 ,QValue4    
 ,QValue5    
 ,RiskScore    
,Classification    
,@FeedbackId as FeedbackId  
,InternalServiceName
,ExternalServiceName
,ConsumerDC
,ProducerDC
,ExpectedServiceSpecificationDocument
from TBL_APIA_ServiceDetails          
where IntegrationId =@IntegrationId          
    
 --set @FeedbackId as FeedbackId    
            
  END          
          
        
  END  


END          
      
	



--select * from TBL_APIA_ServiceDetails where IntegrationId='20'        
        
--  select ServiceID,IntegrationId,ServiceName,Purpose,Existing_New,ConsumerApplication,ProducerApplication,Is_APIGW_Request,Rest_Soap,Transformation,Volume          
--  from TBL_APIA_ServiceDetails          
--  where IntegrationId =20 

GO
/****** Object:  StoredProcedure [dbo].[sp_APIA_NewAPIIntegration_Test]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [dbo].[sp_APIA_NewAPIIntegration_Test]            
 @IntegrationId int=null            
,@ProjectManagerBTG varchar(100)=null            
,@ProjectManagerIT varchar(100)=null            
,@ProjectName varchar(100)=null            
,@ProjectId varchar(100)=null            
,@PlannedGoLiveDate datetime=null            
,@BusinessJustification varchar(max)  =null          
,@BusinessSponsor varchar(100)=null            
,@ExecutiveSponsor varchar(100)=null            
,@CostCenterCode varchar(100)=null            
,@UserJourneyDocumentFileName varchar(100)=null            
,@Feedback varchar(500)=null            
,@Status int=0            
,@CreatedBy varchar(100)=null           
,@UpdatedBy varchar(100)=null            
,@IdentFlag varchar(50)            
,@ServiceName varchar(100)=null          
,@Purpose varchar(100)=null          
,@Existing_New varchar(100)=null          
,@ConsumerApplication varchar(100)=null          
,@ProducerApplication varchar(100)=null          
,@Is_APIGW_Request bit =null          
,@Rest_Soap varchar(100)=null          
,@Transformation varchar(100)=null          
,@Volume varchar(100)=null          
,@UpdateFlag varchar(100)=null          
,@ServiceID varchar(100)=null          
,@Assign Varchar(50)=null        
,@AssignFrom Varchar(50)='USER'       
,@Existing_New_Id int=0        
,@Rest_SOAP_Id int=0        
,@ServiceType_Id int=0        
,@APIType_Id int=0        
,@APICategory_Id int=0        
,@APIRiskScore_Id int=0        
,@PartnerRiskScore_Id int=0        
,@DomainName_Id int=0      
,@IsActive bit=1     
,@FeedbackId int=0    
,@servicenameId int=0,    
@ConsumerDC_Id int=null,    
@ProducerDC_Id int=null,    
@Platform varchar(200)=null,    
@QValue1 int=0,    
@QValue2 int=0,    
@QValue3 int=0,    
@QValue4 int=0,    
@QValue5 int=0,    
@RiskScore FLOAT(4)=0,    
@Classification varchar(10)=null,
@BTGUSER VARCHAR(50)=null,
@ITUSER VARCHAR(50)=null,
@ITARCHITECTURE VARCHAR(50)=null,
@ChannelID VARCHAR(50)=null,
@ContainerName VARCHAR(50)=null,
@InternalServiceName VARCHAR(50)=null,
@ExternalServiceName VARCHAR(50)=null,
@ExternalServiceText VARCHAR(Max)=null,
@HostAppID int=null,
@ConsumerDC VARCHAR(50)=null,
@ProducerDC VARCHAR(50)=null,
@HostApptext VARCHAR(50)=null,
@RDConceptNoteFileName varchar(100)=null,
@SequenceDiagramFileName varchar(100)=null,
@ExpectedServiceSpecificationDocumentFileName varchar(100)=null
   
  
          
AS BEGIN            
  IF(@IdentFlag='AddNewIntegration')            
  BEGIN            
  INSERT INTO TBL_APIA_Integration(ProjectManagerBTG,ProjectManagerIT,ProjectName,ProjectId,PlannedGoLiveDate,            
  BusinessJustification,BusinessSponsor,ExecutiveSponsor,CostCenterCode,UserJourneyDocumentPath,Status,CreatedAt,CreatedBy,Assign,AssignFrom, ConsumerApplication,RDConceptNote)            
  VALUES(@ProjectManagerBTG,@ProjectManagerIT,@ProjectName,@ProjectId,@PlannedGoLiveDate,@BusinessJustification,            
  @BusinessSponsor,@ExecutiveSponsor,@CostCenterCode,@UserJourneyDocumentFileName,@Status,GETDATE(),@CreatedBy,@Assign,@AssignFrom, @ConsumerApplication,@RDConceptNoteFileName)      
    
  SET @IntegrationId=  (SELECT SCOPE_IDENTITY() AS IntegrationId)    
  SET @Feedback = 'New Integration  Created  By User'    
  IF(@IntegrationId <> 0  or @IntegrationId <> null)    
        INSERT INTO tbl_API_ADDA_Feedback (Integration_Id,Feedback_Details,Status,Created_By,Created_Date,IsActive,AssignTo,AssignFrom)     
      VALUES(@IntegrationId,@Feedback,@Status,@CreatedBy,GETDATE(),@IsActive,@Assign,@AssignFrom)    
      
    SELECT @IntegrationId AS IntegrationId;    
    
 --SELECT SCOPE_IDENTITY() AS IntegrationId;    
 -- SELECT MAX(IntegrationId) AS IntegrationId FROM TBL_APIA_Integration          
          
  END           
  ELSE IF(@IdentFlag='GetNewIntegrationDetails')          
  BEGIN          
        
  IF(@AssignFrom='USER')        
   BEGIN         
  Select     
  I.IntegrationId,    
   'API' +replace (convert(varchar, I.CreatedAt, 106) ,' ','')+ Cast(I.IntegrationId AS varchar)  as 'APIADDAID',    
  ProjectName,    
  ProjectId,    
  ProjectManagerBTG,    
  ProjectManagerIT,     
  statusDescription as Status,    
  Assign,    
  AssignFrom,    
  Status as workflowstatus ,  Platform       
  from TBL_APIA_Integration I   
   Inner Join TBL_API_statusMaster As SM on SM.statusCode=Status    
   Inner Join TBL_APIA_ServiceDetails  SD on I.IntegrationId = SD.IntegrationId
     where I.CreatedBy=@CreatedBy      
  ORDER BY IntegrationId DESC 
  END        
  ELSE IF(@AssignFrom<>'USER')        
   BEGIN         
  Select     
  I.IntegrationId,    
   'API' +replace (convert(varchar, I.CreatedAt, 106) ,' ','')+ Cast(I.IntegrationId AS varchar)  as 'APIADDAID',    
  ProjectName,    
  ProjectId,    
  ProjectManagerBTG,    
  ProjectManagerIT,     
  statusDescription as Status,    
  Assign,    
  AssignFrom,    
  Status as workflowstatus ,  Platform       
  from TBL_APIA_Integration I   
   Inner Join TBL_API_statusMaster As SM on SM.statusCode=Status    
   Inner Join TBL_APIA_ServiceDetails  SD on I.IntegrationId = SD.IntegrationId
     where I.CreatedBy=@CreatedBy      
  ORDER BY IntegrationId DESC    
    
    
  END        
        
 END           
        
  ELSE IF(@IdentFlag='AddServiceDetails')          
  BEGIN          
  INSERT INTO TBL_APIA_ServiceDetails(IntegrationId,ServiceName,Purpose,Existing_New,ConsumerApplication,ProducerApplication,Is_APIGW_Request,Rest_Soap,Transformation,Volume,CreatedBy,CreatedAt      
  ,Existing_New_Id      
,Rest_SOAP_Id      
,ServiceType_Id      
,APIType_Id      
,APICategory_Id      
,APIRiskScore_Id      
,PartnerRiskScore_Id      
,DomainName_Id,     
ConsumerDC_Id,    
ProducerDC_Id,    
Platform,    
QValue1,    
QValue2,    
QValue3,    
QValue4,    
QValue5,    
RiskScore,
InternalServiceName,
ExternalServiceName ,
ConsumerDC,
ProducerDC,
ExpectedServiceSpecificationDocument
  )          
      
      
  values(      
  @IntegrationId,@ServiceName,@Purpose,@Existing_New,@ConsumerApplication,@ProducerApplication,@Is_APIGW_Request,@Rest_Soap,@Transformation,      
  @Volume,      
  @CreatedBy      
 ,getdate()      
,@Existing_New_Id      
,@Rest_SOAP_Id      
,@ServiceType_Id      
,@APIType_Id      
,@APICategory_Id      
,@APIRiskScore_Id      
,@PartnerRiskScore_Id     
,@DomainName_Id,    
@ConsumerDC_Id,    
@ProducerDC_Id,    
@Platform,    
@QValue1,    
@QValue2,    
@QValue3,    
@QValue4,    
@QValue5,    
@RiskScore,
@InternalServiceName,
@ExternalServiceName ,
@ConsumerDC,
@ProducerDC,@ExpectedServiceSpecificationDocumentFileName
  )  
  
  If(@Platform ='Internal & External')
  BEGIN
  Declare @IntegrationIdIE int
  -------------------------------------------------------------------Add New Integration----Based On Internal & External--------------------------------------------------------------------------
   INSERT INTO TBL_APIA_Integration(ProjectManagerBTG,ProjectManagerIT,ProjectName,ProjectId,PlannedGoLiveDate,            
  BusinessJustification,BusinessSponsor,ExecutiveSponsor,CostCenterCode,UserJourneyDocumentPath,Status,CreatedAt,CreatedBy,Assign,AssignFrom, ConsumerApplication)            
  select ProjectManagerBTG,ProjectManagerIT,ProjectName,ProjectId,PlannedGoLiveDate,BusinessJustification,            
  BusinessSponsor,ExecutiveSponsor,CostCenterCode,UserJourneyDocumentPath,Status,GETDATE(),CreatedBy,Assign,AssignFrom, ConsumerApplication From TBL_APIA_Integration  where   IntegrationId=@IntegrationId
    
  SET @IntegrationIdIE=  (SELECT SCOPE_IDENTITY() AS IntegrationId) 



  ---------------------------------------------Add Service-------Based On Internal & External---------------------------------------------------

  INSERT INTO TBL_APIA_ServiceDetails(IntegrationId,ServiceName,Purpose,Existing_New,ConsumerApplication,ProducerApplication,Is_APIGW_Request,Rest_Soap,Transformation,Volume,CreatedBy,CreatedAt      
  ,Existing_New_Id      
,Rest_SOAP_Id      
,ServiceType_Id      
,APIType_Id      
,APICategory_Id      
,APIRiskScore_Id      
,PartnerRiskScore_Id      
,DomainName_Id,     
ConsumerDC_Id,    
ProducerDC_Id,    
Platform,    
QValue1,    
QValue2,    
QValue3,    
QValue4,    
QValue5,    
RiskScore,
InternalServiceName,
ExternalServiceName ,
ConsumerDC,
ProducerDC
  )          
      
  values(      
  @IntegrationIdIE,@ServiceName,@Purpose,@Existing_New,@ConsumerApplication,@ProducerApplication,@Is_APIGW_Request,@Rest_Soap,@Transformation,      
  @Volume,      
  @CreatedBy      
 ,getdate()      
,@Existing_New_Id      
,@Rest_SOAP_Id      
,@ServiceType_Id      
,@APIType_Id      
,@APICategory_Id      
,@APIRiskScore_Id      
,@PartnerRiskScore_Id     
,@DomainName_Id,    
@ConsumerDC_Id,    
@ProducerDC_Id,    
@Platform,    
@QValue1,    
@QValue2,    
@QValue3,    
@QValue4,    
@QValue5,    
@RiskScore,
@InternalServiceName,
@ExternalServiceName ,
@ConsumerDC,
@ProducerDC
  )  

  END

  
END          
  ELSE IF(@IdentFlag='GetNewIntegrationDetailsById')          
  BEGIN          
    Select IntegrationId,ProjectName,ProjectId,ProjectManagerBTG,ProjectManagerIT,Status as workflowstatus, statusDescription as Status,Assign, AssignFrom,ConsumerApplication,BTG_USER,IT_USER,IT_ARCHITECTURE,ChannelID,ContainerName        
  
  --CASE         
  --WHEN Status=0 THEN 'Created'        
  --WHEN Status=1 THEN 'Feedback'        
  --WHEN Status=2 THEN 'Updated By User'        
  --WHEN Status=3 THEN 'Review To ITUSER'        
  --WHEN Status=4 THEN 'Review To ITARCHITECH'        
  --WHEN Status=5 THEN 'Rejected'        
  --WHEN Status=6 THEN 'Approved'        
  --END AS Status          
  from TBL_APIA_Integration     
    Inner Join TBL_API_statusMaster As SM on SM.statusCode=Status    
  where IntegrationId=@IntegrationId          
  order by IntegrationId desc          
        
        
        
  select IntegrationId,ProjectManagerBTG,ProjectManagerIT,ProjectName,ProjectId,FORMAT(PlannedGoLiveDate,'dd-MM-yyyy') as PlannedGoLiveDate ,BusinessJustification,BusinessSponsor,ExecutiveSponsor,CostCenterCode,UserJourneyDocumentPath,RDConceptNote,SequenceDiagram,ExpectedServiceSpecificationDocument,Status,Assign,AssignFrom,
  ConsumerApplication,BTG_USER,IT_USER,IT_ARCHITECTURE,ChannelID,ContainerName,CreatedAt  
  From TBL_APIA_Integration           
  where IntegrationId =@IntegrationId          
          
 select ServiceID,IntegrationId,ServiceName,Purpose,Existing_New,ConsumerApplication,ProducerApplication,Is_APIGW_Request,Rest_Soap,Transformation,Volume      
 ,Existing_New_Id,Rest_SOAP_Id,ServiceType_Id,APIType_Id,APICategory_Id,APIRiskScore_Id,PartnerRiskScore_Id,DomainName_Id,ConsumerDC_Id                     
 ,ProducerDC_Id,Platform,QValue1,QValue2,QValue3,QValue4,QValue5 ,RiskScore,Classification,InternalServiceName ,ExternalServiceName,ConsumerDC,
ProducerDC                    
  from TBL_APIA_ServiceDetails          
  where IntegrationId =@IntegrationId          
          
  END          
  ELSE IF(@IdentFlag='UpdateIntegrationDetails')          
  BEGIN          
        
          
        
--SET @Assign=(select Top 1 AssignFrom from tbl_API_ADDA_Feedback where Integration_Id=@IntegrationId  order by Feedback_Id desc)        
        
  UPDATE TBL_APIA_Integration SET ProjectManagerBTG=@ProjectManagerBTG,          
  ProjectManagerIT=@ProjectManagerIT,          
  ProjectName=@ProjectName,          
  ProjectId=@ProjectId,          
  PlannedGoLiveDate=@PlannedGoLiveDate,          
  BusinessJustification=@BusinessJustification,          
  BusinessSponsor = @BusinessSponsor,          
  ExecutiveSponsor=@ExecutiveSponsor,          
  CostCenterCode=@CostCenterCode,          
  UserJourneyDocumentPath=@UserJourneyDocumentFileName,          
  Status=@Status,          
  UpdatedBy=@UpdatedBy,          
  UpdatedAt=getdate(),        
  Assign=@Assign,    
  AssignFrom=@AssignFrom ,  
  ConsumerApplication =@ConsumerApplication,
  BTG_USER = @BTGUSER,
  IT_USER = @ITUSER,
  IT_ARCHITECTURE = @ITARCHITECTURE,  
  ChannelID =@ChannelID ,
  ContainerName=@ContainerName
  where IntegrationId=@IntegrationId         
   -----------Feedback table------------------------------------------------------------------------       
  IF(@Feedback Is not null And @IntegrationId<>0 )        
     INSERT INTO tbl_API_ADDA_Feedback (Integration_Id,Feedback_Details,Status,Created_By,Created_Date,IsActive,AssignTo,AssignFrom)         
     VALUES(@IntegrationId,@Feedback,@Status,@UpdatedBy,GETDATE(),1,@Assign,@AssignFrom)        
        
  --Set @FeedbackId =(SELECT SCOPE_IDENTITY() AS FeedbackId)    
    
  END          
  ELSE IF(@IdentFlag='UpdateServiceDetails')          
  BEGIN          
  if(@UpdateFlag='Update')          
  BEGIN          
  UPDATE TBL_APIA_ServiceDetails SET IntegrationId=@IntegrationId,          
  ServiceName=@ServiceName,          
  Purpose=@Purpose,          
  Existing_New=@Existing_New,          
  ConsumerApplication=@ConsumerApplication,          
  ProducerApplication=@ProducerApplication,          
  Is_APIGW_Request=@Is_APIGW_Request,          
  Rest_Soap=@Rest_Soap,          
  Transformation=@Transformation,          
  Volume=@Volume,          
  UpdatedBy=@UpdatedBy,          
  UpdatedAt=GETDATE()  ,        
  Existing_New_Id = @Existing_New_Id,      
  Rest_SOAP_Id = @Rest_SOAP_Id,      
  ServiceType_Id = @ServiceType_Id,      
  APIType_Id = @APIType_Id,      
  APICategory_Id = @APICategory_Id,      
  APIRiskScore_Id = @APIRiskScore_Id,        PartnerRiskScore_Id = @PartnerRiskScore_Id,      
  DomainName_Id = @DomainName_Id ,    
  ConsumerDC_Id= @ConsumerDC_Id,    
  ProducerDC_Id=@ProducerDC_Id,    
  Platform=@Platform,    
  QValue1=@QValue1,    
  QWeightage1=case when @QValue1=1 then 10     
                   when @QValue1=2 then 10    
       when @QValue1=3 then 10    
       when @QValue1=4 then 2 end,    
  QValue2=@QValue2,    
  QWeightage2=case when @QValue2=1 then 12.5     
                   when @QValue2=2 then 5    
       when @QValue2=3 then 0 end,    
  QValue3=@QValue3,    
  QWeightage3=case when @QValue3=1 then 12.5     
                   when @QValue3=2 then 5    
       when @QValue3=3 then 0 end,    
  QValue4=@QValue4,    
  QWeightage4=case when @QValue4=1 then 5     
      when @QValue4=2 then 2 end,    
  QValue5=@QValue5,    
  QWeightage5=case when @QValue5=1 then 10     
                   when @QValue5=2 then 2    
       when @QValue5=3 then 0 end,    
  RiskScore=@RiskScore,    
  Classification=@Classification,
  InternalServiceName = @InternalServiceName,
  ExternalServiceName = @ExternalServiceName,
  ConsumerDC=@ConsumerDC,
  ProducerDC=@ProducerDC
  where ServiceID=@ServiceID       
      
  --select  @FeedbackId as FeedbackId    
  SELECT MAX(Feedback_Id) AS FeedbackId FROM tbl_API_ADDA_Feedback          
    
  END          
  else if(@UpdateFlag='Insert')          
  BEGIN          
  INSERT INTO TBL_APIA_ServiceDetails(IntegrationId,ServiceName,Purpose,Existing_New,ConsumerApplication,ProducerApplication,Is_APIGW_Request,Rest_Soap,Transformation,Volume,CreatedBy,CreatedAt      
 ,Existing_New_Id      
,Rest_SOAP_Id      
,ServiceType_Id      
,APIType_Id      
,APICategory_Id      
,APIRiskScore_Id      
,PartnerRiskScore_Id      
,DomainName_Id    
,ConsumerDC_Id    
,ProducerDC_Id    
,Platform    
 ,QValue1    
 ,QValue2    
 ,QValue3    
 ,QValue4    
 ,QValue5    
 ,RiskScore    
 ,Classification 
 ,InternalServiceName 
 ,ExternalServiceName
  ,ConsumerDC
  ,ProducerDC
  )          
  values(@IntegrationId,@ServiceName,@Purpose,@Existing_New,@ConsumerApplication,@ProducerApplication,@Is_APIGW_Request,@Rest_Soap,@Transformation,@Volume,@CreatedBy,getdate()      
,@Existing_New_Id      
,@Rest_SOAP_Id      
,@ServiceType_Id      
,@APIType_Id      
,@APICategory_Id      
,@APIRiskScore_Id      
,@PartnerRiskScore_Id      
,@DomainName_Id    
,@ConsumerDC_Id    
,@ProducerDC_Id    
,@Platform    
,@QValue1    
,@QValue2    
,@QValue3    
,@QValue4    
,@QValue5    
,@RiskScore    
,@Classification 
,@InternalServiceName
,@ExternalServiceName
,@ConsumerDC
,@ProducerDC
  )          
            
  select ServiceID,IntegrationId,ServiceName,Purpose,Existing_New,ConsumerApplication,ProducerApplication,Is_APIGW_Request,Rest_Soap,Transformation,Volume ,Existing_New_Id      
,Rest_SOAP_Id      
,ServiceType_Id      
,APIType_Id      
,APICategory_Id      
,APIRiskScore_Id      
,PartnerRiskScore_Id      
,DomainName_Id     
,ConsumerDC_Id    
 ,ProducerDC_Id    
 ,Platform    
 ,QValue1    
 ,QValue2    
 ,QValue3    
 ,QValue4    
 ,QValue5    
 ,RiskScore    
 ,Classification    
,@FeedbackId as FeedbackId  
,InternalServiceName
,ExternalServiceName
,ConsumerDC
,ProducerDC
from TBL_APIA_ServiceDetails          
  where IntegrationId =@IntegrationId          
    
 --set @FeedbackId as FeedbackId    
            
  END          
          
        
  END          
        
  else if(@IdentFlag='CheckProjectExist')        
  BEGIN        
  select Count(*) count1 from TBL_APIA_Integration where ProjectId=@ProjectId        
  END     
      
  else if(@IdentFlag='FillExectingServiceName')        
  BEGIN        
 -- select TBL_API_Main_ID as 'ExServiceId' ,COD_SERVICE_ID as 'ExServiceName'  from TBL_API_Main    
    select TBL_API_Main_ID as 'ExServiceId' ,OBP_SERVICE_URL_UAT as 'ExServiceName', COD_SERVICE_ID as 'ExCodServiceId'  from TBL_API_Main    
  END     
    
   else if(@IdentFlag='FillExectingSerNameOnId')        
  BEGIN  


  Declare  @InternalServiceId varchar(max)
   Set @InternalServiceId=(Select RIGHT(OBP_SERVICE_URL_UAT, CHARINDEX('/',REVERSE(OBP_SERVICE_URL_UAT))-1) from [dbo].TBL_API_Main where   TBL_API_Main_ID=@servicenameId )

  Declare @ExternalServiceId varchar(max)
  Set @ExternalServiceId=(Select COD_SERVICE_ID from [dbo].[TBL_API_EXTERNALSERVICES] where OBP_SERVICE_URL_UAT Like '%'+ @InternalServiceId + '%')

  select     
     
  SERVICE_PROVIDER,    
  Isnull(APIType. MisccdId,0) as APITypeId,    
  Isnull(APICate. MisccdId,0) as APICatId,    
  Isnull(DOMAINNAME. MisccdId,0) as DomainId,    
  Isnull(RestSoap. MisccdId,0) as RestSoapId,    
  Isnull(ProducerDC. MisccdId,0) as ProducerDC,    
  Isnull(ServiceType. MisccdId,0) as ServiceType,    
  Isnull(APIRiskClassify. MisccdId,0) as APIRiskClassify ,
  ISNULL( @ExternalServiceId,'') As ExternalCoDServiceID
    
  from TBL_API_Main     
  Left join [dbo].[tbl_API_Adda_Misccd] As APIType on APIType.CDValDesc=TBL_API_Main.API_TYPE    
  Left join [dbo].[tbl_API_Adda_Misccd] As APICate on APICate.CDValDesc=TBL_API_Main.API_CAT    
  Left join [dbo].[tbl_API_Adda_Misccd] As DOMAINNAME on DOMAINNAME.CDValDesc=TBL_API_Main.DOMAIN_NAME    
  Left join [dbo].[tbl_API_Adda_Misccd] As RestSoap on RestSoap.CDValDesc=TBL_API_Main.SERVICE_INTERFACE_TYPE    
  Left join [dbo].[tbl_API_Adda_Misccd] As ProducerDC on ProducerDC.CDValDesc=TBL_API_Main.FILLER_10     
  and ProducerDC.CDTP='Producer DC'    
  Left join [dbo].[tbl_API_Adda_Misccd] As ServiceType on ServiceType.CDValDesc=TBL_API_Main.Service_Type    
  Left join [dbo].[tbl_API_Adda_Misccd] As APIRiskClassify on APIRiskClassify.CDValDesc=TBL_API_Main.filler_02    
  where TBL_API_Main_ID=@servicenameId    
  END     

  else if(@IdentFlag='FillExternalServiceName')        
  BEGIN        
    
	 --select EXTERNALSERVICE_ID as 'ExServiceId' ,OBP_SERVICE_URL_UAT as 'ExServiceName'  from [TBL_API_EXTERNALSERVICES] 
   select COD_SERVICE_ID as 'ExServiceId' ,OBP_SERVICE_URL_UAT as 'ExServiceName', COD_SERVICE_ID as 'ExCodServiceId'  from [TBL_API_EXTERNALSERVICES]    
  END 


  else if(@IdentFlag='FillExternalService ')        
  BEGIN 
  
  Declare @ExternalCodServiceId varchar(max)
  Set @ExternalCodServiceId=(Select  RIGHT(OBP_SERVICE_URL_UAT, CHARINDEX('/',REVERSE(OBP_SERVICE_URL_UAT))-1) from [dbo].[TBL_API_EXTERNALSERVICES] where (OBP_SERVICE_URL_UAT Like '%'+@ExternalServiceText+'%' OR COD_SERVICE_ID Like '%'+@ExternalServiceText+'%'))


  Select
  Top 1
 COD_SERVICE_ID as 'OBP_SERVICE_URL_UAT',
  SERVICE_PROVIDER,    
  Isnull(APIType. MisccdId,0) as APITypeId,    
  Isnull(APICate. MisccdId,0) as APICatId,    
  Isnull(DOMAINNAME. MisccdId,0) as DomainId,    
  Isnull(RestSoap. MisccdId,0) as RestSoapId,    
  Isnull(ProducerDC. MisccdId,0) as ProducerDC,    
  Isnull(ServiceType. MisccdId,0) as ServiceType,    
  Isnull(APIRiskClassify. MisccdId,0) as APIRiskClassify    
    
  from TBL_API_Main     
  Left join [dbo].[tbl_API_Adda_Misccd] As APIType on APIType.CDValDesc=TBL_API_Main.API_TYPE    
  Left join [dbo].[tbl_API_Adda_Misccd] As APICate on APICate.CDValDesc=TBL_API_Main.API_CAT    
  Left join [dbo].[tbl_API_Adda_Misccd] As DOMAINNAME on DOMAINNAME.CDValDesc=TBL_API_Main.DOMAIN_NAME    
  Left join [dbo].[tbl_API_Adda_Misccd] As RestSoap on RestSoap.CDValDesc=TBL_API_Main.SERVICE_INTERFACE_TYPE    
  Left join [dbo].[tbl_API_Adda_Misccd] As ProducerDC on ProducerDC.CDValDesc=TBL_API_Main.FILLER_10     
  and ProducerDC.CDTP='Producer DC'    
  Left join [dbo].[tbl_API_Adda_Misccd] As ServiceType on ServiceType.CDValDesc=TBL_API_Main.Service_Type    
  Left join [dbo].[tbl_API_Adda_Misccd] As APIRiskClassify on APIRiskClassify.CDValDesc=TBL_API_Main.filler_02    
  where OBP_SERVICE_URL_UAT like '%'+@ExternalCodServiceId +'%'     
  END    



    
  else if(@IdentFlag='FillTestApiAuto')        
  BEGIN        
  --select TBL_API_Main_ID as Id,OBP_SERVICE_URL_UAT as ServiceURL,FileName as 'path' from TBL_API_Main where  (PRODUCT_PROCESSOR_URL_UAT is not null and PRODUCT_PROCESSOR_URL_UAT<>'NA')    
    select distinct tblapimain.TBL_API_Main_ID as Id,tblapimain.OBP_SERVICE_URL_UAT as ServiceURL,tblapifilepath.FileName as 'path',SERVICE_INTERFACE_TYPE as apiCategory from TBL_API_Main tblapimain    
  Left Join Tbl_API_FilePath tblapifilepath on tblapimain.OBP_SERVICE_URL_UAT=tblapifilepath.OBP_SERVICE_URL_UAT     
  where  (tblapimain.OBP_SERVICE_URL_UAT is not null and tblapimain.OBP_SERVICE_URL_UAT<>'NA')      
  END 
  
  else if(@IdentFlag='FillHostApplication')        
  BEGIN        
   
   select Id As 'HostId',FullName  as 'HostAppName', ITGRCCode,ITGRCName from tbl_API_MstApplications
  END 
  else if(@IdentFlag='FillHostingDC')        
  BEGIN        
   
   select Id As 'HostId',FullName  as 'HostAppName', HostingDC from tbl_API_MstApplications where Id=@HostAppID
  END 

  else if(@IdentFlag='FillHostingDCtext')        
  BEGIN        
   
   select Id As 'HostId',FullName  as 'HostAppName', HostingDC from tbl_API_MstApplications where FullName=@HostApptext
  END


  else if(@IdentFlag='CheckConsumerAppName')        
  BEGIN        
  select Count(*) count1 from tbl_API_MstApplications where FullName=@ConsumerApplication       
  END 

   else if(@IdentFlag='CheckProducerAppName')        
  BEGIN        
  select Count(*) count1 from tbl_API_MstApplications where FullName=@ProducerApplication           
  END
          
	ELSE if(@IdentFlag='GetId')        
  BEGIN        
  SELECT TOP 1 IntegrationId FROM TBL_APIA_Integration ORDER BY IntegrationId DESC           
  END
      
	 ELSE if(@IdentFlag='GetDate')        
  BEGIN        
  SELECT CreatedAt FROM TBL_APIA_Integration WHERE IntegrationId = @IntegrationId           
  END
END          
      
	



--select * from TBL_APIA_ServiceDetails where IntegrationId='20'        
        
--  select ServiceID,IntegrationId,ServiceName,Purpose,Existing_New,ConsumerApplication,ProducerApplication,Is_APIGW_Request,Rest_Soap,Transformation,Volume          
--  from TBL_APIA_ServiceDetails          
--  where IntegrationId =20 
GO
/****** Object:  StoredProcedure [dbo].[sp_APIA_NewExceptionManagement]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_APIA_NewExceptionManagement]                    
    (      
  @CaseId int =NULL,      
  @OriginalOnboardingGASID VARCHAR(100) = NULL,      
  @ExceptionRequestor VARCHAR(100) = NULL,      
  @APIProjectName VARCHAR(200) = NULL,      
  @APIProjectDescription VARCHAR(500) = NULL,      
  @PartnersToBeIntegrated VARCHAR(500) = NULL,      
  @ProductAPIToBeConsumed VARCHAR(500) = NULL,      
  @RequestedException VARCHAR(500) = NULL,      
  @ReasonForException VARCHAR(500) = NULL,      
  @StartDate VARCHAR(100) = NULL,      
  @EndDate VARCHAR(100) = NULL,      
  @HowExceptionToBeImplemented VARCHAR(500) = NULL,      
  @IdentFlag VARCHAR(100),      
  @ImpactOnBank VARCHAR(100) = NULL,      
  @ExceptionLevel VARCHAR(100) = NULL,
  @currentUser varchar(100) = NULL,
  @ExceptionCaseID VARCHAR(100) = NULL,		     
  @ApproverUserID VARCHAR(100) = NULL,   
  @ApproverType VARCHAR(100) = NULL,      
  @ApproverLevel VARCHAR(100) = NULL,
  @BusinessVerticalHead varchar(100) = null,
  @BusinessGroupHead varchar(100) = NULL,
  @CIOGroup VARCHAR(100) = NULL,
  @ITDRMVerticalHead VARCHAR(100) = NULL,
  @ITDRMGroupHead VARCHAR(100) = NULL,
  @CISOGroup VARCHAR(100) = NULL,
  @ITVerticalHead VARCHAR(100) = NULL,
  @BSGVerticalHead VARCHAR(100) = NULL,
  @ComplianceVerticalHead VARCHAR(100) = NULL,
  @ISGVerticalHead VARCHAR(100) = NULL,
  @APEXSteeringCommittee VARCHAR(100) = NULL
    )      
AS       
BEGIN                    
    IF (@IdentFlag = 'ExceptionManagement')                    
    BEGIN         
		 DECLARE @CaseUniqueno int    
		 DECLARE @UniqueString varchar(100)    
                 
				INSERT INTO tbl_APIA_ExceptionManagement      
				(      
		   OriginalOnboardingGASID,      
		   ExceptionRequestor,      
		   APIProjectName,      
		   APIProjectDescription,    
		   PartnersToBeIntegrated,      
		   ProductAPIToBeConsumed,      
		   RequestedException,      
		   ReasonForException,      
		   StartDate,      
		   EndDate,      
		   HowExceptionToBeImplemented,      
		   ImpactOnBank,      
		   ExceptionLevel,
		   createdBy,
		   createdDate      
				)      
				VALUES      
				(      
		   @OriginalOnboardingGASID,      
		   @ExceptionRequestor,      
		   @APIProjectName,      
		   @APIProjectDescription,      
		   @PartnersToBeIntegrated,      
		   @ProductAPIToBeConsumed,      
		   @RequestedException,      
		   @ReasonForException,      
		   @StartDate,      
		   @EndDate,      
		   @HowExceptionToBeImplemented,      
		   @ImpactOnBank,      
		   @ExceptionLevel,
		   @currentUser,
		   GETDATE()      
				)  
		   
  
		 --set @CaseUniqueno=scope_identity()   
		 set @CaseUniqueno=(SELECT MAX(ID) FROM tbl_APIA_ExceptionManagement) 
    
		 SET @UniqueString='APIGW'+convert(varchar(100),@CaseUniqueno) 

		 INSERT INTO tbl_APIA_Exception_Audit_Log 
			 (
				CaseID ,
				ApprovalID ,
				[Status] ,
				createdBy ,
				[createdDate] 
			 )	

			 VALUES
			 (
				@CaseUniqueno,
				 NULL ,
				'created',
				@currentUser,
				GETDATE()      
			  )   
    
		 update tbl_APIA_ExceptionManagement    
		 SET OriginalOnboardingGASID='APIGW'+REPLACE(CONVERT(VARCHAR,ISNULL(createdDate,GETDATE()),3),'/','')+(CASE WHEN LEN(ID)=1 THEN '0000' 
									WHEN LEN(ID)=2 THEN '000' WHEN LEN(ID)=3 THEN '00' WHEN LEN(ID)=4 THEN '0' END)+
									CAST(ID AS VARCHAR)--@UniqueString    
		 where ID= @CaseUniqueno    
    
		 select @UniqueString  AS OriginalOnboardingGASID  
			END      
	ELSE IF @IdentFlag = 'GetExceptionLevel'       
	BEGIN      
		SELECT       
			ISNULL(apiid, '') AS APIId,      
			ISNULL(ImpactOnbank, '') AS ImpactOnBank,      
			ISNULL(Level, '') AS Level      
		FROM       
			tbl_APIA_ExceptionLevel      
		WHERE       
			ImpactOnBank LIKE '%'+@ImpactOnBank+'%'      
    END     
	 ELSE IF (@IdentFlag = 'LevelNumber1')    
	 begin  
 
		select * from tbl_APIA_MstExceptionApprovalMetrix where ExceptionLevel=1 and ApproverType='Business' and ApproverLevel='VH'  
		select * from tbl_APIA_MstExceptionApprovalMetrix where ExceptionLevel=1 and ApproverType='Business' and ApproverLevel='GH'  
		select * from tbl_APIA_MstExceptionApprovalMetrix where ExceptionLevel=1 and ApproverType='CIO' and ApproverLevel='GH' 
	   END   
		ELSE IF (@IdentFlag = 'LevelNumber2')    
	 begin  
 
		select * from tbl_APIA_MstExceptionApprovalMetrix where ExceptionLevel=2 and ApproverType='Business' and ApproverLevel='VH'  
		select * from tbl_APIA_MstExceptionApprovalMetrix where ExceptionLevel=2 and ApproverType='ITDRM' and ApproverLevel='VH'  
		select * from tbl_APIA_MstExceptionApprovalMetrix where ExceptionLevel=2 and ApproverType='Business' and ApproverLevel='GH' 
		select * from tbl_APIA_MstExceptionApprovalMetrix where ExceptionLevel=2 and ApproverType='CIO' and ApproverLevel='GH'  
		select * from tbl_APIA_MstExceptionApprovalMetrix where ExceptionLevel=2 and ApproverType='ITDRM' and ApproverLevel='GH'  
		select * from tbl_APIA_MstExceptionApprovalMetrix where ExceptionLevel=2 and ApproverType='CISO' and ApproverLevel='GH' 
	   END
	   ELSE IF (@IdentFlag = 'LevelNumber3')
	   begin  
 
		select * from tbl_APIA_MstExceptionApprovalMetrix where ExceptionLevel=3 and ApproverType='APEX IT Steering Committee' --and ApproverLevel='VH'
		select * from tbl_APIA_MstExceptionApprovalMetrix where ExceptionLevel=3 and ApproverType='APEX IT Steering Committee' and ApproverLevel='VH' 
		select * from tbl_APIA_MstExceptionApprovalMetrix where ExceptionLevel=3 and ApproverType='APEX IT Steering Committee' and ApproverLevel='VH'
		select * from tbl_APIA_MstExceptionApprovalMetrix where ExceptionLevel=3 and ApproverType='APEX IT Steering Committee' and ApproverLevel='VH'
		select * from tbl_APIA_MstExceptionApprovalMetrix where ExceptionLevel=3 and ApproverType='APEX IT Steering Committee' and ApproverLevel='VH'
		select * from tbl_APIA_MstExceptionApprovalMetrix where ExceptionLevel=3 and ApproverType='APEX IT Steering Committee' and ApproverLevel='VH'
		select * from tbl_APIA_MstExceptionApprovalMetrix where ExceptionLevel=3 and ApproverType='APEX IT Steering Committee' and ApproverLevel='VH'
  	   END 
	ELSE IF @IdentFlag='GetNewCaseId'
	BEGIN
		SELECT top 1 OriginalOnboardingGASID AS CaseID FROM tbl_APIA_ExceptionManagement ORDER BY createdDate desc 
	END 
	ELSE IF @IdentFlag='ExceptionList'
	BEGIN
		SELECT /*'APIGW'+REPLACE(CONVERT(VARCHAR,ISNULL(PO.createdDate,GETDATE()),3),'/','')+(CASE WHEN LEN(PO.ID)=1 THEN '0000' 
		WHEN LEN(PO.ID)=2 THEN '000' WHEN LEN(PO.ID)=3 THEN '00' WHEN LEN(PO.ID)=4 THEN '0' END)+
		CAST(PO.ID AS VARCHAR)*/PO.OriginalOnboardingGASID AS CASEID,APIProjectName AS PartnerName,ISNULL(AU.Status,'') AS Status,
		ISNULL(CONVERT(VARCHAR,PO.createdDate,105),'') AS DateCreated,ISNULL(CONVERT(VARCHAR,PO.updatedDate,105),'') AS DateUpdated
		FROM tbl_APIA_ExceptionManagement PO WITH(NOLOCK)
		LEFT JOIN tbl_APIA_Exception_Audit_Log AU WITH(NOLOCK) ON AU.CASEID=AU.ID 
		ORDER BY PO.createdDate desc
	END 
	--ELSE IF @IdentFlag='GetExceptionCaseApprovalMetrix' 
	--BEGIN
	--	SELECT ApproverUserID,ApproverName,ApproverType,ApproverLevel
	--	FROM tbl_APIA_MstExceptionApprovalMetrix 
	--	--WHERE PartnerRiskClassification=@PartnerRiskClassification AND APIRiskClassification=@APIRiskClassification AND ApproverType=@ApproverType AND ApproverLevel=@ApproverLevel;
	--END
	ELSE IF @IdentFlag='ExceptionLevels'
	BEGIN
			INSERT INTO tbl_APIA_PartnerExceptionApprovalList      
				(      
	       ExceptionCaseID,      
		   ApproverUserID,    
		   [Status],    
		   ApproverType,      
		   ApproverLevel,      
		   CreatedBy,
		    DateCreated
	            )  
			SELECT @ExceptionCaseID,@BusinessVerticalHead,'Created','Business','VH',@currentUser,GETDATE() UNION
			SELECT @ExceptionCaseID,@BusinessGroupHead,'Created','Business','GH',@currentUser,GETDATE() UNION
			SELECT @ExceptionCaseID,@CIOGroup,'Created','Business','FH',@currentUser,GETDATE() UNION
			SELECT @ExceptionCaseID,@ITDRMVerticalHead,'Created','ITDRM','VH',@currentUser,GETDATE() UNION
			SELECT @ExceptionCaseID,@ITDRMGroupHead,'Created','ITDRM','GH',@currentUser,GETDATE() UNION
			SELECT @ExceptionCaseID,@CISOGroup,'Created','CISO','FH',@currentUser,GETDATE() UNION
			SELECT @ExceptionCaseID,@ITVerticalHead,'Created','IT','VH',@currentUser,GETDATE() UNION
			SELECT @ExceptionCaseID,@BSGVerticalHead,'Created','BSG','VH',@currentUser,GETDATE() UNION
			SELECT @ExceptionCaseID,@ComplianceVerticalHead,'Created','Compliance','VH',@currentUser,GETDATE() UNION
			SELECT @ExceptionCaseID,@ISGVerticalHead,'Created','ISG','VH',@currentUser,GETDATE() UNION
			SELECT @ExceptionCaseID,@APEXSteeringCommittee,'Created','APEX','VH',@currentUser,GETDATE() 

				--VALUES      
				--(  
		  -- @ExceptionCaseID,    
		  -- @ApproverUserID,
		  --  'Created',      
		  -- @ApproverType,      
		  -- @ApproverLevel,
		  -- @currentUser,
    --       GETDATE()      
				--)  
	END 
END 
GO
/****** Object:  StoredProcedure [dbo].[sp_APIA_Search_API]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
    --Exec  sp_APIA_Search_API '','GetFilterData','','','','ACCOSA,APS'
CREATE procedure [dbo].[sp_APIA_Search_API]      
(        
 @searchText varchar(1000)=null        
 ,@action varchar(50)=null        
 ,@id int =null        
 , @whereClause varchar(max)= null
 ,@strMiddleware varchar(max)=null
 ,@strServiceProvider varchar(max)=null
 ,@prefix varchar(max) =null
)     
AS       
BEGIN      
   IF(@action ='getAll')        
   BEGIN        
   select A.TBL_API_Main_ID,A.OBP_SERVICE_URL_UAT  as ServiceURL,A.SERVICE_DESC,A.NAM_SERVICE_MIDDLEWARE as SERVICE_TYPE        
   ,A.COD_SERVICE_ID,A.SERVICE_SIGNATURE,        
   A.SERVICE_PROVIDER        
   ,A.PRODUCT_PROCESSOR_WSDL , A.DOMAIN_NAME,A.SERVICE_DOC_PATH as 'fileName'        
  into #TempGetAll from TBL_API_Main A  
   
   --left join TBL_API_Master_Values SERVICE_MIDDLEWARE        
   --on A.NAM_SERVICE_MIDDLEWARE = SERVICE_MIDDLEWARE.Id And SERVICE_MIDDLEWARE.API_Master_ID=1        
   --left join TBL_API_Master_Values SERVICE_INTERFACE_TYPE         
   --on a.SERVICE_INTERFACE_TYPE = SERVICE_INTERFACE_TYPE.Id and SERVICE_INTERFACE_TYPE.API_Master_ID=2        
   --left join TBL_API_Master_Values SERVICE_CATEGORY         
   --on a.SERVICE_CATEGORY = SERVICE_CATEGORY.Id and SERVICE_CATEGORY.API_Master_ID=3    
          
   --left join TBL_API_Master_Values SERVICE_TYPE         
   --on a.SERVICE_TYPE = SERVICE_TYPE.Id and SERVICE_TYPE.API_Master_ID=5        
          
   --left join TBL_API_Master_Values NAM_CONTAINER         
   --on a.NAM_CONTAINER = NAM_CONTAINER.Id and NAM_CONTAINER.API_Master_ID=6        
          
   --left join TBL_API_Master_Values NAM_DOMAIN         
   --on a.NAM_DOMAIN = NAM_DOMAIN.Id and NAM_DOMAIN.API_Master_ID=7        
          
   --left join TBL_API_Master_Values DOMAIN_NAME         
   --on a.DOMAIN_NAME = DOMAIN_NAME.Id and DOMAIN_NAME.API_Master_ID=8        
          
   Where (A.COD_SERVICE_ID like '%'+ @searchText +'%' OR  A.SERVICE_SIGNATURE like '%'+ @searchText +'%'        
   OR  A.NAM_SERVICE_MIDDLEWARE like '%'+ @searchText +'%'  OR  SERVICE_PROVIDER like '%'+ @searchText +'%'        
   OR  A.PRODUCT_PROCESSOR_WSDL like '%'+ @searchText +'%' OR  A.DOMAIN_NAME like '%'+ @searchText +'%'OR  A.fileName like '%'+ @searchText +'%'OR  A.OBP_SERVICE_URL_UAT like '%'+ @searchText +'%')    
   
   Select * From #TempGetAll
   Select SERVICE_TYPE as Middleware,count(*) as RecordCount from   #TempGetAll where  SERVICE_TYPE is not null Group by SERVICE_TYPE
   Select SERVICE_Provider as Provider,count(*) as RecordCount from   #TempGetAll  where  SERVICE_Provider is not null Group by SERVICE_Provider
   
            
   END       
   ELSE IF(@action='GetDetailsById')      
   BEGIN      
      
   select A.TBL_API_Main_ID,A.OBP_SERVICE_URL_UAT  as ServiceURL,A.SERVICE_DESC,A.NAM_SERVICE_MIDDLEWARE as SERVICE_TYPE         
   ,A.COD_SERVICE_ID,A.SERVICE_SIGNATURE,A.REQUEST_SAMPLE,A.RESPONSE_SAMPLE,        
   A.SERVICE_PROVIDER as SERVICE_PROVIDER        
   ,A.PRODUCT_PROCESSOR_WSDL 
   , A.DOMAIN_NAME as DOMAIN_NAME
   ,tblapifilepath.FileName as 'fileName'
   ,tblapifilepath.APIAddFiles as 'APIAddFiles'
   ,SERVICE_INTERFACE_TYPE as apiCategory
   ,A.SERVICE_DOC_PATH as 'ServiceDocumrntfile'  
   --A.fileName        
   from TBL_API_Main A   
   Left Join Tbl_API_FilePath tblapifilepath on A.OBP_SERVICE_URL_UAT=tblapifilepath.OBP_SERVICE_URL_UAT 
   left join TBL_API_Master_Values SERVICE_MIDDLEWARE        
   on A.NAM_SERVICE_MIDDLEWARE = SERVICE_MIDDLEWARE.Id And SERVICE_MIDDLEWARE.API_Master_ID=1        
   left join TBL_API_Master_Values SERVICE_INTERFACE_TYPE         
   on a.SERVICE_INTERFACE_TYPE = SERVICE_INTERFACE_TYPE.Id and SERVICE_INTERFACE_TYPE.API_Master_ID=2        
   left join TBL_API_Master_Values SERVICE_CATEGORY         
   on a.SERVICE_CATEGORY = SERVICE_CATEGORY.Id and SERVICE_CATEGORY.API_Master_ID=3        
   left join TBL_API_Master_Values SERVICE_PROVIDER         
   on a.SERVICE_PROVIDER = SERVICE_PROVIDER.Id and SERVICE_PROVIDER.API_Master_ID=4        
          
   left join TBL_API_Master_Values SERVICE_TYPE         
   on a.SERVICE_TYPE = SERVICE_TYPE.Id and SERVICE_TYPE.API_Master_ID=5        
          
   left join TBL_API_Master_Values NAM_CONTAINER         
   on a.NAM_CONTAINER = NAM_CONTAINER.Id and NAM_CONTAINER.API_Master_ID=6        
          
   left join TBL_API_Master_Values NAM_DOMAIN         
   on a.NAM_DOMAIN = NAM_DOMAIN.Id and NAM_DOMAIN.API_Master_ID=7        
          
   left join TBL_API_Master_Values DOMAIN_NAME         
   on a.DOMAIN_NAME = DOMAIN_NAME.Id and DOMAIN_NAME.API_Master_ID=8        
   where A.TBL_API_Main_ID =@id       
      
   END      
  
  ELSE IF(@action='GetFilterList')
  BEGIN



if(@searchText !='')
  BEGIN
  --Select Distinct NAM_SERVICE_MIDDLEWARE as Middleware from TBL_API_Main
    select NAM_SERVICE_MIDDLEWARE as Middleware,count(*) as RecordCount 
	from TBL_API_Main A
	where (A.COD_SERVICE_ID like '%'+ @searchText +'%' OR  A.SERVICE_SIGNATURE like '%'+ @searchText +'%'        
   OR  A.NAM_SERVICE_MIDDLEWARE like '%'+ @searchText +'%'  OR  SERVICE_PROVIDER like '%'+ @searchText +'%'        
   OR  A.PRODUCT_PROCESSOR_WSDL like '%'+ @searchText +'%' OR  A.DOMAIN_NAME like '%'+ @searchText +'%'OR  A.fileName like '%'+ @searchText +'%'OR  A.OBP_SERVICE_URL_UAT like '%'+ @searchText +'%')
	Group by NAM_SERVICE_MIDDLEWARE

  --Select Distinct SERVICE_PROVIDER as Provider from TBL_API_Main
  IF(@strMiddleware !='' or @strMiddleware !=null)------------------------service provider filter on Middleware.
  BEGIN
    select  
       Provider,count(*) as RecordCount 
    from(
          select   SERVICE_PROVIDER as Provider, A.NAM_SERVICE_MIDDLEWARE  from 
           TBL_API_Main A
           where (A.COD_SERVICE_ID like '%'+ @searchText +'%' OR  A.SERVICE_SIGNATURE like '%'+ @searchText +'%'        
            OR  A.NAM_SERVICE_MIDDLEWARE like '%'+ @searchText +'%'  OR  SERVICE_PROVIDER like '%'+ @searchText +'%'        
             OR  A.PRODUCT_PROCESSOR_WSDL like '%'+ @searchText +'%' OR  A.DOMAIN_NAME like '%'+ @searchText +'%'OR  A.fileName like '%'+ @searchText +'%' OR  A.OBP_SERVICE_URL_UAT like '%'+ @searchText +'%')
	    ) as Provider
      where  Provider.NAM_SERVICE_MIDDLEWARE IN (SELECT item from [dbo].SplitString(@strMiddleware, ',')) 
        group by Provider
  END
   ELSE
	  BEGIN
       select SERVICE_PROVIDER as Provider,count(*) as RecordCount 
	    from TBL_API_Main A
	     where (A.COD_SERVICE_ID like '%'+ @searchText +'%' OR  A.SERVICE_SIGNATURE like '%'+ @searchText +'%'        
        OR  A.NAM_SERVICE_MIDDLEWARE like '%'+ @searchText +'%'  OR  SERVICE_PROVIDER like '%'+ @searchText +'%'        
         OR  A.PRODUCT_PROCESSOR_WSDL like '%'+ @searchText +'%' OR  A.DOMAIN_NAME like '%'+ @searchText +'%'OR  A.fileName like '%'+ @searchText +'%'OR  A.OBP_SERVICE_URL_UAT like '%'+ @searchText +'%'  And  A.NAM_SERVICE_MIDDLEWARE in(@strMiddleware) )
	    Group by SERVICE_PROVIDER
	 END
END--search text 
	ELSE
	BEGIN
	  --Select * from TBL_API_Main
    select NAM_SERVICE_MIDDLEWARE as Middleware,count(*) as RecordCount from TBL_API_Main Group by NAM_SERVICE_MIDDLEWARE order by count(1) desc
	--Select Distinct SERVICE_PROVIDER as Provider from TBL_API_Main
   IF(@strMiddleware !='' or @strMiddleware !=null)------------------------service provider filter on Middleware.
  BEGIN
     SELECT SERVICE_PROVIDER as Provider,count(*) as RecordCount from TBL_API_Main 
	 WHERE NAM_SERVICE_MIDDLEWARE IN (SELECT item from [dbo].SplitString(@strMiddleware, ','))
	 Group by SERVICE_PROVIDER   
  END
  ELSE BEGIN

    select SERVICE_PROVIDER as Provider,count(*) as RecordCount from TBL_API_Main Group by SERVICE_PROVIDER
	END 
	
	END

	select 'POtion'
	select  service_provider as ProductProcessor,count(1) as Internal from TBL_API_Main where nam_service_middleware in ('SOA','OBP') group by service_provider order by count(1) desc;
	
	select  service_provider as ProductProcessor,count(1) as [External] from TBL_API_Main where nam_service_middleware in ('APIGW') group by service_provider order by count(1) desc;
	
	select ConsumerApplication ConsumerName,COUNT(0) as Internal from TBL_APIA_ServiceDetails where Platform='Internal' 
     group by ConsumerApplication,Platform order by Internal desc

	 select ConsumerApplication ConsumerName,COUNT(0) as [External] from TBL_APIA_ServiceDetails where Platform in('Internal & External'
	 ,'External') group by ConsumerApplication,Platform order by [External] desc

	 select ProducerApplication ProducerName,COUNT(0) as RecordCount from TBL_APIA_ServiceDetails
	 group by ProducerApplication order by RecordCount desc

	 select ConsumerApplication ConsumerName,COUNT(0) as RecordCount from TBL_APIA_ServiceDetails
	 group by ConsumerApplication order by RecordCount desc
	--Select  OBP_SERVICE_URL_UAT as 'ServiceUrl',SERVICE_DESC as 'ServiceDesc',SERVICE_TYPE as 'ServiceType' from TBL_API_Main
  END

  ELSE IF(@action='GetFilterData')
  BEGIN
  if(@searchText is null)
  BEGIN

  if(@strMiddleware is not null and @strServiceProvider  is null)
  BEGIN
  select A.TBL_API_Main_ID,A.OBP_SERVICE_URL_UAT  as ServiceURL,A.SERVICE_DESC,A.NAM_SERVICE_MIDDLEWARE as SERVICE_TYPE        
   ,A.COD_SERVICE_ID,A.SERVICE_SIGNATURE,        
   A.SERVICE_PROVIDER        
   ,A.PRODUCT_PROCESSOR_WSDL , A.DOMAIN_NAME,A.fileName        
 into #TempresultS1  from TBL_API_Main A        
   where A.NAM_SERVICE_MIDDLEWARE IN (SELECT item from [dbo].SplitString(@strMiddleware, ','))  


   Select * From #TempresultS1
   Select SERVICE_TYPE as Middleware,count(*) as RecordCount from   #TempresultS1 where  SERVICE_TYPE is not null  Group by SERVICE_TYPE
   Select SERVICE_Provider as Provider,count(*) as RecordCount from   #TempresultS1  where  (SERVICE_Provider is not null  )Group by SERVICE_Provider
   
END
ELSE IF (@strServiceProvider is not null and @strMiddleware is null)
BEGIN
  select A.TBL_API_Main_ID,A.OBP_SERVICE_URL_UAT  as ServiceURL,A.SERVICE_DESC,A.NAM_SERVICE_MIDDLEWARE as SERVICE_TYPE        
   ,A.COD_SERVICE_ID,A.SERVICE_SIGNATURE,        
   A.SERVICE_PROVIDER        
   ,A.PRODUCT_PROCESSOR_WSDL , A.DOMAIN_NAME,A.fileName        
  into #TempresultS2  from TBL_API_Main A        
  where A.SERVICE_PROVIDER IN (SELECT item from [dbo].SplitString(@strServiceProvider, ','))

   Select * From #TempresultS2
   Select SERVICE_TYPE as Middleware,count(*) as RecordCount from   #TempresultS2   where  SERVICE_TYPE is not null Group by SERVICE_TYPE
   Select SERVICE_Provider as Provider,count(*) as RecordCount from   #TempresultS2  where  SERVICE_Provider is not null   Group by SERVICE_Provider
END
ELSE IF(@strServiceProvider is not null and @strMiddleware is not null)
  BEGIN
        select A.TBL_API_Main_ID,A.OBP_SERVICE_URL_UAT  as ServiceURL,A.SERVICE_DESC,A.NAM_SERVICE_MIDDLEWARE as SERVICE_TYPE        
   ,A.COD_SERVICE_ID,A.SERVICE_SIGNATURE,        
   A.SERVICE_PROVIDER        
   ,A.PRODUCT_PROCESSOR_WSDL , A.DOMAIN_NAME,A.fileName        
into #TempresultS3   from TBL_API_Main A        
   where A.NAM_SERVICE_MIDDLEWARE IN (SELECT item from [dbo].SplitString(@strMiddleware, ',')) and A.SERVICE_PROVIDER IN (SELECT item from [dbo].SplitString(@strServiceProvider, ','))

   Select * From #TempresultS3
   Select SERVICE_TYPE as Middleware,count(*) as RecordCount from   #TempresultS3 where  SERVICE_TYPE is not null  Group by SERVICE_TYPE
   Select SERVICE_Provider as Provider,count(*) as RecordCount from   #TempresultS3 where  SERVICE_Provider is not null Group by SERVICE_Provider
END
 END

ELSE
BEGIN

  if(@strMiddleware is not null and @strServiceProvider  is null)
  BEGIN
  select A.TBL_API_Main_ID,A.OBP_SERVICE_URL_UAT  as ServiceURL,A.SERVICE_DESC,A.NAM_SERVICE_MIDDLEWARE as SERVICE_TYPE        
   ,A.COD_SERVICE_ID,A.SERVICE_SIGNATURE,        
   A.SERVICE_PROVIDER        
   ,A.PRODUCT_PROCESSOR_WSDL , A.DOMAIN_NAME,A.fileName        
  into #Tempresult1 from TBL_API_Main A        
   where A.NAM_SERVICE_MIDDLEWARE IN (SELECT item from [dbo].SplitString(@strMiddleware, ',')) and (A.COD_SERVICE_ID like '%'+ @searchText +'%' OR  A.SERVICE_SIGNATURE like '%'+ @searchText +'%'        
   OR  A.NAM_SERVICE_MIDDLEWARE like '%'+ @searchText +'%'  OR  SERVICE_PROVIDER like '%'+ @searchText +'%'        
   OR  A.PRODUCT_PROCESSOR_WSDL like '%'+ @searchText +'%' OR  A.DOMAIN_NAME like '%'+ @searchText +'%'OR  A.fileName like '%'+ @searchText +'%'OR  A.OBP_SERVICE_URL_UAT like '%'+ @searchText +'%')  
   
   Select * From #Tempresult1
   Select SERVICE_TYPE as Middleware,count(*) as RecordCount from   #Tempresult1  where  SERVICE_TYPE is not null Group by SERVICE_TYPE
   Select SERVICE_Provider as Provider,count(*) as RecordCount from   #Tempresult1 where  SERVICE_Provider is not null Group by SERVICE_Provider
END
ELSE IF (@strServiceProvider is not null and @strMiddleware is null)
BEGIN
  select A.TBL_API_Main_ID,A.OBP_SERVICE_URL_UAT  as ServiceURL,A.SERVICE_DESC,A.NAM_SERVICE_MIDDLEWARE as SERVICE_TYPE        
   ,A.COD_SERVICE_ID,A.SERVICE_SIGNATURE,        
   A.SERVICE_PROVIDER        
   ,A.PRODUCT_PROCESSOR_WSDL , A.DOMAIN_NAME,A.fileName        
 into #Tempresult2  from TBL_API_Main A        
   where A.SERVICE_PROVIDER IN (SELECT item from [dbo].SplitString(@strServiceProvider, ',')) and (A.COD_SERVICE_ID like '%'+ @searchText +'%' OR  A.SERVICE_SIGNATURE like '%'+ @searchText +'%'        
   OR  A.NAM_SERVICE_MIDDLEWARE like '%'+ @searchText +'%'  OR  SERVICE_PROVIDER like '%'+ @searchText +'%'        
   OR  A.PRODUCT_PROCESSOR_WSDL like '%'+ @searchText +'%' OR  A.DOMAIN_NAME like '%'+ @searchText +'%'OR  A.fileName like '%'+ @searchText +'%'OR  A.OBP_SERVICE_URL_UAT like '%'+ @searchText +'%')  

    Select * From #Tempresult2
   Select SERVICE_TYPE as Middleware,count(*) as RecordCount from   #Tempresult2 where  SERVICE_TYPE is not null Group by SERVICE_TYPE
   Select SERVICE_Provider as Provider,count(*) as RecordCount from   #Tempresult2 where  SERVICE_Provider is not null Group by SERVICE_Provider
END
ELSE IF(@strServiceProvider is not null and @strMiddleware is not null)
  BEGIN
        select A.TBL_API_Main_ID,A.OBP_SERVICE_URL_UAT  as ServiceURL,A.SERVICE_DESC,A.NAM_SERVICE_MIDDLEWARE as SERVICE_TYPE        
   ,A.COD_SERVICE_ID,A.SERVICE_SIGNATURE,        
   A.SERVICE_PROVIDER        
   ,A.PRODUCT_PROCESSOR_WSDL , A.DOMAIN_NAME,A.fileName        
  Into #Tempresult from TBL_API_Main A        
   where A.NAM_SERVICE_MIDDLEWARE IN (SELECT item from [dbo].SplitString(@strMiddleware, ',')) and A.SERVICE_PROVIDER IN (SELECT item from [dbo].SplitString(@strServiceProvider, ','))
   and (A.COD_SERVICE_ID like '%'+ @searchText +'%' OR  A.SERVICE_SIGNATURE like '%'+ @searchText +'%'        
   OR  A.NAM_SERVICE_MIDDLEWARE like '%'+ @searchText +'%'  OR  SERVICE_PROVIDER like '%'+ @searchText +'%'        
   OR  A.PRODUCT_PROCESSOR_WSDL like '%'+ @searchText +'%' OR  A.DOMAIN_NAME like '%'+ @searchText +'%'OR  A.fileName like '%'+ @searchText +'%'OR  A.OBP_SERVICE_URL_UAT like '%'+ @searchText +'%')  

   Select * From #Tempresult
   Select SERVICE_TYPE as Middleware,count(*) as RecordCount from   #Tempresult where  SERVICE_TYPE is not null Group by SERVICE_TYPE
   Select SERVICE_Provider as Provider,count(*) as RecordCount from   #Tempresult where  SERVICE_Provider is not null Group by SERVICE_Provider

END
ELSE
BEGIN
select A.TBL_API_Main_ID,A.OBP_SERVICE_URL_UAT  as ServiceURL,A.SERVICE_DESC,A.NAM_SERVICE_MIDDLEWARE as SERVICE_TYPE        
   ,A.COD_SERVICE_ID,A.SERVICE_SIGNATURE,        
   A.SERVICE_PROVIDER        
   ,A.PRODUCT_PROCESSOR_WSDL , A.DOMAIN_NAME,A.fileName        
 into #Tempresult3  from TBL_API_Main A        
   where 
 --  A.SERVICE_PROVIDER IN (SELECT item from [dbo].SplitString(@strServiceProvider, ','))   and
  (A.COD_SERVICE_ID like '%'+ @searchText +'%' OR  A.SERVICE_SIGNATURE like '%'+ @searchText +'%'        
   OR  A.NAM_SERVICE_MIDDLEWARE like '%'+ @searchText +'%'  OR  SERVICE_PROVIDER like '%'+ @searchText +'%'        
   OR  A.PRODUCT_PROCESSOR_WSDL like '%'+ @searchText +'%' OR  A.DOMAIN_NAME like '%'+ @searchText +'%'OR  A.fileName like '%'+ @searchText +'%'OR  A.OBP_SERVICE_URL_UAT like '%'+ @searchText +'%')  

   Select * From #Tempresult3
   Select SERVICE_TYPE as Middleware,count(*) as RecordCount from   #Tempresult3 where  SERVICE_TYPE is not null Group by SERVICE_TYPE
   Select SERVICE_Provider as Provider,count(*) as RecordCount from   #Tempresult3 where  SERVICE_Provider is not null Group by SERVICE_Provider
END
 
END

END

ELSE IF(@action='GetTestAPIUrl')
BEGIN
select TBL_API_Main_ID as ID, OBP_SERVICE_URL_UAT as ServiceURL from TBL_API_Main where OBP_SERVICE_URL_UAT like '%'+ @prefix +'%' 
END

ELSE IF(@action='GetAllTestAPIUrl')
BEGIN
select TBL_API_Main_ID as ID, OBP_SERVICE_URL_UAT as ServiceURL from TBL_API_Main where (OBP_SERVICE_URL_UAT is not null and OBP_SERVICE_URL_UAT <>'NA')
END

END


GO
/****** Object:  StoredProcedure [dbo].[SP_APIA_URLMaster]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [dbo].[SP_APIA_URLMaster]
@ID int = 0,
@URLName varchar(100)=null

as begin
select * from TBL_API_URLMaster where (ID=@ID or URLName=@URLName) and Status=1
end
GO
/****** Object:  StoredProcedure [dbo].[SP_APIA_WorkFlowApprovalProcess]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [dbo].[SP_APIA_WorkFlowApprovalProcess]   
@IdentFlag varchar(50),  
@IntegrationId int,
@AssignTo varchar(20)=null ,
@AssignFrom varchar(20)=null ,
@Feedback varchar(Max)=null ,
@WorkflowStatus int=null,
@UserId varchar(50)=null ,
@IsActive bit=1
AS 
BEGIN   

 -- IF(@IdentFlag='AddFeedback')    
 -- BEGIN 
   
 --   INSERT INTO tbl_API_ADDA_Feedback (Integration_Id,Feedback_Details,Status,Created_By,Created_Date,IsActive,AssignTo,AssignFrom) 
	--VALUES(@IntegrationId,@Feedback,@WorkflowStatus,@UserId,GETDATE(),@IsActive,@AssignTo,@AssignFrom)


	----UPDATE TBL_APIA_Integration SET Assign= @AssignTo, Status = @WorkflowStatus,UpdatedBy=@UserId,UpdatedAt=GETDATE() WHERE IntegrationId=@IntegrationId

	--SELECT max(Feedback_Id) AS FeedbackId from tbl_API_ADDA_Feedback
		
 -- END
IF(@IdentFlag='FeedbackCount')    
    BEGIN
	 Select  Count(Integration_Id)As FeedbackCount,
	 AssignFrom From tbl_API_ADDA_Feedback 
	 Where (Integration_Id=@IntegrationId and Created_By=@UserId AND Status=@WorkflowStatus) 
	 group by AssignFrom

    END

 ELSE IF(@IdentFlag='FeedbackHistory')    
    BEGIN
	 SELECT EmpName,
	 Feedback_Details ,
	 statusDescription as Status,
	 AssignFrom As Role,
	 CONVERT(varchar,Created_Date,3) AS Created_Date
	 --CASE 
  --    WHEN Status=0 THEN 'Created'
  --    WHEN Status=1 THEN 'Feedback'
  --    WHEN Status=2 THEN 'Updated By User'
  --    WHEN Status=3 THEN 'Review To ITUSER'
  --    WHEN Status=4 THEN 'Review To ITARCHITECH'
  --    WHEN Status=5 THEN 'Rejected'
  --    WHEN Status=6 THEN 'Approved'
  --  END AS Status  ,
	
	
	 FROM tbl_API_ADDA_Feedback   FB
	 LEFT JOIN UserMaster AS UM On UM.EmpCode=FB.Created_By
	 Inner Join TBL_API_statusMaster As SM on SM.statusCode=Status
	 where Integration_Id=@IntegrationId

	 order by Feedback_Id Asc

    END


END

GO
/****** Object:  StoredProcedure [dbo].[sp_Insert]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--USE [OneViewIndicator_Dev]
--GO

--/****** Object:  StoredProcedure [dbo].[sp_Insert]    Script Date: 24-11-2023 15:37:42 ******/
--SET ANSI_NULLS ON
--GO

--SET QUOTED_IDENTIFIER ON
--GO

CREATE procedure [dbo].[sp_Insert]          
          
@Empcode varchar(50)=Null,         
@Empname varchar(100)=Null,      
@Brcode int=Null,        
@Brname varchar(100) = null,          
@Profileid int=Null,    
@Profilename varchar(100) =null,          
@RequestType varchar(10)=Null,      
@Maker varchar(50)=null,          
@Authoriser varchar(50)=null,          
@Deptname varchar(150)=null      
          
as          
          
begin   
  
    
         
If(@RequestType = 'A')          
 begin          
           
  insert into UserMaster          
    (Empcode,          
     EmpName,          
     BranchCode,          
     BranchName,          
     Department,          
     ProfileId,          
     ProfileDescription,          
     Active,          
     CreationDate,          
     Maker,          
     MakerDate,          
     Checker,          
     CheckerDate)          
  values(@Empcode,          
    @Empname,          
    @Brcode,          
    @Brname,          
    @Deptname,          
    @Profileid,          
    @Profilename,          
    'True',          
    getdate(),          
    @Maker,          
    GETDATE(),          
    @Authoriser,          
    GETDATE())          
              
        
           
end          
If(@RequestType = 'B')          
 begin          

Update UserMaster        
  set BranchCode = @Brcode, BranchName=@Brname,Maker=@Maker,MakerDate=GETDATE(),Checker=@Authoriser,CheckerDate=GETDATE()          
  where EmpCode= @Empcode    and isnull(Flag,'') <> 'Resigned'            
           
end          
          
If(@RequestType = 'P')          
 begin     
  
  Update UserMaster        
  set ProfileId = @Profileid,ProfileDescription=@Profilename,Maker=@Maker,MakerDate=GETDATE(),Checker=@Authoriser,CheckerDate=GETDATE()               
where EmpCode =@Empcode and  isnull(Flag,'') <> 'Resigned'       
         
           
end          
          
If(@RequestType = 'E')          
 begin          
  
  
   Update UserMaster                                            
  set [Enabled]='True',Maker=@Maker,MakerDate=GETDATE(),Checker=@Authoriser,CheckerDate=GETDATE(),Active='True',Dormant='False',                                        
  DormantDate=null                                           
  where EmpCode= @Empcode and isnull(Flag,'') <> 'Resigned'               
           
end          
          
If(@RequestType = 'D')          
 begin          
   
  
  Update UserMaster                                            
  set [Enabled] = 'False'                                    
  ,Active='False',                                        
  Maker=@Maker,MakerDate=GETDATE(),Checker=@Authoriser,CheckerDate=GETDATE()                                              
  where EmpCode= @Empcode   and isnull(Flag,'') <> 'Resigned'                   
           
end          
          
If(@RequestType = 'T')          
 begin          
           

 
 Update UserMaster                                            
  set Active='False',Flag='Resigned',DeactivationDate=GETDATE(),Reason='Resigned',Maker=@Maker,MakerDate=GETDATE(),Checker=@Authoriser,CheckerDate=GETDATE()                                              
  where EmpCode= @Empcode  and isnull(Flag,'') <> 'Resigned'                  
           
end    

  
If(@RequestType = 'R')                                            
 BEGIN   
  Update UserMaster                                            
  SET Active='true',Flag=null,reason=null ,Maker=@Maker,MakerDate=GETDATE(),Checker=@Authoriser,CheckerDate=GETDATE(),DeactivationDate=null                                                                              
  WHERE EmpCode= @Empcode and isnull(Flag,'') = 'Resigned'  
 
 END        
   
 If(@RequestType = 'U')                                            
 BEGIN   
  Update UserMaster                                            
  SET Locked='False',Active='True',Maker=@Maker,MakerDate=GETDATE(),UnsuccessfulAttempts=0,Checker=@Authoriser,CheckerDate=GETDATE(),                                       
  LockedDate=NULL                                             
  WHERE EmpCode= @Empcode and isnull(Flag,'') <> 'Resigned'  
 END  
          
end   
  
GO
/****** Object:  StoredProcedure [dbo].[SP_Insert_Data_API_Main_Schedule_ActivityLog]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE Procedure [dbo].[SP_Insert_Data_API_Main_Schedule_ActivityLog]     
@Errormsg Varchar(max),   
@Status Varchar(100),  
@ModuleName varchar(50)  
AS    
BEGIN    
INSERT INTO Tbl_API_Main_Schedule_ActivityLog    
           (Errormsg    
           ,[Status]  
     ,ModuleName  
           ,InsertedOn    
           )    
     VALUES    
        (@Errormsg    
     ,@Status  
  ,@ModuleName  
     ,getdate())    
       
END 
GO
/****** Object:  StoredProcedure [dbo].[sp_Login]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
CREATE procedure [dbo].[sp_Login]                    
                    
@Type int,                    
@Empcode varchar(50)=null,                    
@UnqId numeric(18,0) = null,                    
@AssetCode varchar(100)=null,                    
@IpAddress varchar(100)=null                    
as                    
                    
declare @Brcode int                    
declare @Brname varchar(100)                    
declare @ProfileId int                    
declare @ProfileName varchar(150)                    
declare @Empname varchar(100)                    
                    
                    
begin                    
 If(@Type = 1)                    
  begin                    
   --Unsuccessful Login                    
   Update UserMaster                    
   set UnsuccessfulAttempts =(select isnull(UnsuccessfulAttempts,0) + 1 from UserMaster where EmpCode=@Empcode)                    
   where EmpCode = @Empcode                    
                       
   select top 1 UnsuccessfulAttempts from UserMaster where EmpCode = @Empcode                    
                       
                       
   insert into LoginAttempts                    
    (Empcode,Empname,LoginTime,Attempts,ProfileId,ProfileName,Brcode,Brname,Flag,AssetCode,IpAddress)                    
    select @Empcode,Empname,GETDATE(),1,ProfileId,ProfileDescription,BranchCode,BranchName,'Unsuccessful',@AssetCode,@IpAddress                   
    from UserMaster where EmpCode = @Empcode         and isnull(Flag,'') <> 'Resigned'                  
                 
                       
  end                    
                      
  --Successful Login                    
  If(@Type = 2)                    
  begin                    
   Update UserMaster                    
   set UnsuccessfulAttempts=0,LastLoginDate=GETDATE(),LoggedIn='True',Locked='False',LockedDate=null,AssetCode=@AssetCode,IpAddress=@IpAddress                    
   where EmpCode = @Empcode                      
                       
   insert into LoginAttempts                    
    (Empcode,Empname,LoginTime,Attempts,ProfileId,ProfileName,Brcode,Brname,Flag,AssetCode,IpAddress)                    
   select @Empcode, Empname,GETDATE(),1,ProfileId,ProfileDescription,BranchCode,BranchName,'Successful',@AssetCode,@IpAddress                   
   from UserMaster where EmpCode = @Empcode      and isnull(Flag,'') <> 'Resigned'                 
                       
   declare @Id numeric(18,0)                    
   set @Id = (select Top 1 Id from LoginAttempts where Empcode = @Empcode and LoginTime <> '' order by LoginTime desc)                    
   select @Id                    
                       
  end                    
                    
  --Lock User                    
 If(@Type = 3)                    
  begin                    
   Update UserMaster                    
   set Locked='True',Active='False',LockedDate = GETDATE() --, [Enabled]='False'                  
   where EmpCode = @Empcode    and isnull(Flag,'') <> 'Resigned'                   
                       
                       
                       
  end                    
  --Successful Logout                    
 If(@Type = 4)                    
  begin                    
   Update UserMaster                    
   set LastLogoutDate = GETDATE(),LoggedIn='False'                    
   where EmpCode = @Empcode   and isnull(Flag,'') <> 'Resigned'                    
                       
   Update LoginAttempts                    
   set LogoutTime = GETDATE() where Id = @UnqId and Empcode = @Empcode    and isnull(Flag,'') <> 'Resigned'                   
                       
  end                    
                      
                     
  If(@Type = 5)                    
   begin                    
   -- select a.EmpCode,a.ProfileDescription,a.ProfileId,a.BranchCode,a.Id,a.Active             
   --,case when a.Locked='True' then 'Locked'            
   --when a.Dormant='True' then 'Dormant'            
   --when a.[Enabled]='False' then 'Disabled'            
   --when a.Active='True' then 'Active'            
   -- end as 'Status',a.LastLoginDate,            
   -- a.LastLogoutDate             --from UserMaster a where LTRIM(RTRIM(a.Empcode)) = @Empcode             
   --and ISNULL(flag,'') <> 'Resigned'           
             
      select a.EmpName, a.EmpCode,a.ProfileDescription,a.ProfileId,a.BranchCode,a.Id,a.Active             
   ,case when a.Locked='True' then 'Locked'            
   when a.Dormant='True' then 'Dormant'            
   when a.[Enabled]='False' then 'Disabled'            
   when a.Active='True' then 'Active'            
    end as 'Status',a.LastLoginDate,            
    a.LastLogoutDate            
 ,b.[Role] as User_Role          
   from UserMaster a (nolock)           
   Left join RFATrigger_UserMapping b(nolock)          
   on a.EmpCode = b.EmpId          
   where LTRIM(RTRIM(a.Empcode)) = @Empcode        
   and ISNULL(flag,'') <> 'Resigned'            
                     
                       
  end                    
end 

GO
/****** Object:  StoredProcedure [dbo].[sp_Login_New]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [dbo].[sp_Login_New]                    
                    
@Type int,                    
@Empcode varchar(50)=null,                    
@UnqId numeric(18,0) = null,                    
@AssetCode varchar(100)=null,                    
@IpAddress varchar(100)=null                    
as                    
                    
declare @Brcode int                    
declare @Brname varchar(100)                    
declare @ProfileId int                    
declare @ProfileName varchar(150)                    
declare @Empname varchar(100)                    
                    
                    
begin                    
 If(@Type = 1)                    
  begin                    
   --Unsuccessful Login                    
   Update UserMaster                    
   set UnsuccessfulAttempts =(select isnull(UnsuccessfulAttempts,0) + 1 from UserMaster where EmpCode=@Empcode)                    
   where EmpCode = @Empcode                    
                       
   select top 1 UnsuccessfulAttempts from UserMaster where EmpCode = @Empcode                    
                       
                       
   insert into LoginAttempts                    
    (Empcode,Empname,LoginTime,Attempts,ProfileId,ProfileName,Brcode,Brname,Flag,AssetCode,IpAddress)                    
    select @Empcode,Empname,GETDATE(),1,ProfileId,ProfileDescription,BranchCode,BranchName,'Unsuccessful',@AssetCode,@IpAddress                   
    from UserMaster where EmpCode = @Empcode         and isnull(Flag,'') <> 'Resigned'                  
                 
                       
  end                    
                      
  --Successful Login                    
  If(@Type = 2)                    
  begin                    
   Update UserMaster                    
   set UnsuccessfulAttempts=0,LastLoginDate=GETDATE(),LoggedIn='True',Locked='False',LockedDate=null,AssetCode=@AssetCode,IpAddress=@IpAddress                    
   where EmpCode = @Empcode                      
                       
   insert into LoginAttempts                    
    (Empcode,Empname,LoginTime,Attempts,ProfileId,ProfileName,Brcode,Brname,Flag,AssetCode,IpAddress)                    
   select @Empcode, Empname,GETDATE(),1,ProfileId,ProfileDescription,BranchCode,BranchName,'Successful',@AssetCode,@IpAddress                   
   from UserMaster where EmpCode = @Empcode      and isnull(Flag,'') <> 'Resigned'                 
                       
   declare @Id numeric(18,0)                    
   set @Id = (select Top 1 Id from LoginAttempts where Empcode = @Empcode and LoginTime <> '' order by LoginTime desc)                    
   select @Id                    
                       
  end                    
                    
  --Lock User                    
 If(@Type = 3)                    
  begin                    
   Update UserMaster                    
   set Locked='True',Active='False',LockedDate = GETDATE() --, [Enabled]='False'                  
   where EmpCode = @Empcode    and isnull(Flag,'') <> 'Resigned'                   
                       
                       
                       
  end                    
  --Successful Logout                    
 If(@Type = 4)                    
  begin                    
   Update UserMaster                    
   set LastLogoutDate = GETDATE(),LoggedIn='False'                    
   where EmpCode = @Empcode   and isnull(Flag,'') <> 'Resigned'                    
                       
   Update LoginAttempts                    
   set LogoutTime = GETDATE() where Id = @UnqId and Empcode = @Empcode    and isnull(Flag,'') <> 'Resigned'                   
                       
  end                    
                      
                     
  If(@Type = 5)                    
   begin                    
   -- select a.EmpCode,a.ProfileDescription,a.ProfileId,a.BranchCode,a.Id,a.Active             
   --,case when a.Locked='True' then 'Locked'            
   --when a.Dormant='True' then 'Dormant'            
   --when a.[Enabled]='False' then 'Disabled'            
   --when a.Active='True' then 'Active'            
   -- end as 'Status',a.LastLoginDate,            
   -- a.LastLogoutDate             --from UserMaster a where LTRIM(RTRIM(a.Empcode)) = @Empcode             
   --and ISNULL(flag,'') <> 'Resigned'           
             
      select a.EmpName, a.EmpCode,a.ProfileDescription,a.ProfileId,a.BranchCode,a.Id,a.Active             
   ,case when a.Locked='True' then 'Locked'            
   when a.Dormant='True' then 'Dormant'            
   when a.[Enabled]='False' then 'Disabled'            
   when a.Active='True' then 'Active'            
    end as 'Status',a.LastLoginDate,            
    a.LastLogoutDate            
 ,b.EmpRole as User_Role          
   from UserMaster a (nolock)           
   Left join TBL_OVI_RM_Hierarchy_Mapping b(nolock)          
   on a.EmpCode = b.EmpCode          
   where LTRIM(RTRIM(a.Empcode)) = @Empcode        
   and ISNULL(flag,'') <> 'Resigned'            
                     
                       
  end                    
end


GO
/****** Object:  StoredProcedure [dbo].[SP_PMS_GetAPI_Link]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- exec SP_PMS_GetAPI_Link 'LIVE'
CREATE PROCEDURE [dbo].[SP_PMS_GetAPI_Link]        
@API_Type varchar(20)    =null    
AS        
BEGIN     
if @API_Type !=''    or @API_Type !=null
Begin    
select APILink as APILink from tbl_PMS_APIDetails where APIType =@API_Type and Module='Dealer'
  select APILink as Manpower_APILink from tbl_PMS_APIDetails where APIType =@API_Type and Module='Manpower 2.0'
   select APILink as CampVisit_APILink from tbl_PMS_APIDetails where APIType =@API_Type and Module='Campaign Visit - Flutter'
      
End   
else  
Begin    
 select APILink as APILink from tbl_PMS_APIDetails where APIType ='LocalHost'       and Module='Dealer'
  select APILink as Manpower_APILink from tbl_PMS_APIDetails where APIType ='UAT' and Module='Manpower 2.0'
   select APILink as CampVisit_APILink from tbl_PMS_APIDetails where APIType ='UAT' and Module='Campaign Visit - Flutter'

      --select APILink as CampUpload_APILink from tbl_PMS_APIDetails where APIType ='UAT' and Module='Campaign Upload'
End 
    
END   

--       select APILink as CampVisit_APILink from tbl_PMS_APIDetails where APIType ='UAT' and Module='Campaign Visit - API'
--insert into tbl_PMS_APIDetails (APIType,APILink,CreatedBy,CreatedOn,module) values('UAT', 'http://10.226.215.14:8023?','AAMOCI12903',getdate(),'Manpower 2.0')
--insert into tbl_PMS_APIDetails (APIType,APILink,CreatedBy,CreatedOn,module) values('UAT', 'http://10.226.215.14:8023?','AAMOCI12903',getdate(),'Campaign Visit')
-- insert into tbl_PMS_APIDetails (APIType,APILink,CreatedBy,CreatedOn,module) values('UAT', 'http://10.226.215.14:8023?','AAMOCI12903',getdate(),'Campaign Upload')
GO
/****** Object:  StoredProcedure [dbo].[sp_PublishData_API]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

--  exec sp_PublishData_API  'A28584'             
            
CREATE Procedure [dbo].[sp_PublishData_API]    (                                    
	@UserId varchar(30)=null                                    
)                                    
AS                                        
BEGIN                                      
                        
Declare @UserType varchar(100)=null , @fetchFor varchar(100)=null;                    
                    
SELECT @UserType = [Role] from RFATrigger_UserMapping where EmpId=@UserId;             
    
	CREATE TABLE #tmp_final(Id int identity(1,1), LSID int ,CustomerName varchar(250),TriggerName varchar(250),RaisedOn varchar(50),IsRectified varchar(25)
	,RFATriggerId int ,[Month] varchar(50),[Year] int ,RFATriggerPublishId int, feedbackStatus varchar(30),RFA_Recommended varchar(20))

	IF(@UserType  IS NULL)
	BEGIN
		IF EXISTS(select TOP(1) EmployeeCode from EmployeeMaster where SupervisorEmployeeCode = @UserId AND UserType ='RM')
		BEGIN
			SET @UserType ='Relationship Manager';
		END
		ELSE IF EXISTS(select TOP(1) EmployeeCode from EmployeeMaster where SupervisorEmployeeCode = @UserId AND UserType ='CM')
		BEGIN
			SET @UserType ='Cluster Head';
			SET @fetchFor = 'CH_Supervisor'
		END
	END

 IF(@UserType='Relationship Manager')                     
 BEGIN                    
    INSERT INTO #tmp_final(LSID, CustomerName,  TriggerName, RaisedOn,  IsRectified,RFATriggerId, [Month], [Year] ,RFATriggerPublishId,feedbackStatus)
   select  Distinct                                      
   --Distinct                                          
    LSID                                        
   ,CustomerName                                        
   ,TriggerName                                               
   ,RaisedOn = SUBSTRING([Month],0,4)+'-' + CONVERT(varchar(10), [Year])                            
   ,IsRectified = case when  IsRectified=0 then 'No' else 'Yes' end                                
   ,RFATriggerId                          
   ,[Month]                        
   ,[Year]                        
   ,a.RFATriggerPublishId   
   ,feedbackStatus ='Pending'
   from RFATriggerPublish a(nolock)                                                    
   where 
  ( a.RM_Id = @UserId  OR a.SupervisorEmployeeCode = @UserId)
   Order By LSID asc , RaisedOn asc     
   
   update A
   set A.feedbackStatus = 'In-Workflow'
   from #tmp_final A (nolock)
   inner join Feedback B(nolock)
   on A.LSID = B.LsId and A.[Month] = B.feedbackMonth AND A.[Year] = b.feedbackYear
   where B.IsRejected = 0

	update A
   set A.feedbackStatus = 'Approved'
   from #tmp_final A (nolock)
   inner join RCHFeedback B(nolock)
   on A.LSID = B.LsId and A.[Month] = B.feedbackMonth AND A.[Year] = b.feedbackYear
   where B.IsRejected = 0

   update A
   set A.RFA_Recommended = case when B.RFARecommendationId IN (24,26) then 'Yes' else 'No' end
   from #tmp_final A (nolock)
   inner join Feedback B(nolock)
   on A.LSID = B.LsId and A.[Month] = B.feedbackMonth AND A.[Year] = b.feedbackYear
   where B.IsRejected = 0;

   select Id,LSID,CustomerName,TriggerName,RaisedOn,IsRectified,RFATriggerId,Month,Year,RFATriggerPublishId,feedbackStatus
   ,ISNULL(RFA_Recommended,'No') as RFA_Recommended
   from #tmp_final order by RaisedOn 

    drop table #tmp_final  
 END                    
 ELSE IF(@UserType='Cluster Head')                    
 BEGIN                    

		CREATE TABLE #tmpCHTable (EmpId varchar(50),EmpName varchar(250), [Role] varchar(100))
		IF(@fetchFor ='CH_Supervisor')
		BEGIN
			  INSERT INTO #tmpCHTable
			  select EmpId,EmpName,[Role]                                        
			   from RFATrigger_UserMapping                     
			   where RefEmpId  in (
					select EmployeeCode from EmployeeMaster 
					where SupervisorEmployeeCode = @UserId and UserType ='CM'
			   ); 
		END
		ELSE
		BEGIN
			/* #tmpCHTable Temporary table used to get all RM Id's Coming under CH  */                    
			INSERT INTO #tmpCHTable
			select EmpId,EmpName,[Role]                                       
			from RFATrigger_UserMapping                     
			where RefEmpId=@UserId;                    
        END   

   INSERT INTO #tmp_final(LSID, CustomerName,  TriggerName, RaisedOn,  IsRectified,RFATriggerId, [Month], [Year] ,RFATriggerPublishId,feedbackStatus)                 
  select                     
  a.LSID                     
  ,CustomerName                     
  ,a.TriggerName                     
  ,RaisedOn = SUBSTRING(a.[Month],0,4)+'-' + CONVERT(varchar(10), a.[Year])                            
  ,IsRectified = case when  a.IsRectified=0 then 'No' else 'Yes' end                         
   ,a.RFATriggerId                          
   ,a.[Month]                        
   ,a.[Year]                        
   ,a.RFATriggerPublishId 
   ,feedbackStatus ='Pending'
  from Feedback  b(nolock)                    
  Inner join RFATriggerPublish a(nolock)                    
  on b.LsId=a.LSID 
  and b.feedbackMonth = a.[Month] 
  and b.feedbackyear = a.[Year]                  
  where RM_Id in (                    
   select EmpId from #tmpCHTable                    
  )
  and b.IsRejected =0 ;  
  
   update A
   set A.feedbackStatus = 'In - Workflow' 
   , A.RFA_Recommended = case when B.RFARecommendationId IN (24,26) then 'Yes' else 'No' end
   from #tmp_final A (nolock)
   inner join Feedback B(nolock)
   on A.LSID = B.LsId and A.[Month] = B.feedbackMonth AND A.[Year] = b.feedbackYear
   where B.IsRejected = 0;

   update A
   set A.feedbackStatus = 'Pending'
   from #tmp_final A (nolock)
   where A.LSID NOT IN (
	select Distinct LSID from CMFeedback
   )

   update A
   set A.feedbackStatus = 'Approved'
   from #tmp_final A (nolock)
   inner join RCHFeedback B(nolock)
   on A.LSID = B.LsId and A.[Month] = B.feedbackMonth AND A.[Year] = b.feedbackYear
   where B.IsRejected = 0

      select Id,LSID,CustomerName,TriggerName,RaisedOn,IsRectified,RFATriggerId,Month,Year,RFATriggerPublishId,feedbackStatus
   ,ISNULL(RFA_Recommended,'No') as RFA_Recommended
   from #tmp_final order by RaisedOn 
              

   drop table #tmpCHTable;  
   drop table #tmp_final  
 END                    
 ELSE IF(@UserType='Circle Head')                    
 BEGIN                    
                
  /* #tmpClusterHeadTable Temporary table used to get all Cluster Head Id's   */                    
  select EmpId,EmpName,[Role] ,RefEmpId                    
  Into #tmpClusterHeadTable                    
  from RFATrigger_UserMapping                    
  where RefEmpId=@UserId;                    
                     
                     
  /* #tmpRMTable Temporary table used to get all RM Id's   */                    
  select EmpId,EmpName,[Role],RefEmpId                    
  INTO #tmpRMTable                    
  from RFATrigger_UserMapping                
  where RefEmpId in (                    
   select Empid from #tmpClusterHeadTable                    
  ) 
  
  INSERT INTO #tmp_final(LSID, CustomerName,  TriggerName, RaisedOn,  IsRectified,RFATriggerId, [Month], [Year] ,RFATriggerPublishId,feedbackStatus)                      
  select                     
   a.LSID                     
   ,CustomerName                     
   ,a.TriggerName                     
   ,RaisedOn = SUBSTRING(a.[Month],0,4)+'-' + CONVERT(varchar(10), a.[Year])                            
   ,IsRectified = case when  a.IsRectified=0 then 'No' else 'Yes' end                         
    ,a.RFATriggerId                          
    ,a.[Month]                        
    ,a.[Year]                     
 ,a.RFATriggerPublishId    
    ,feedbackStatus ='Pending'
   from RFATriggerPublish a(nolock)                    
   Inner join CMFeedback b(nolock)                    
   on a.LSID=b.LsId  and b.feedbackMonth = a.[Month] and b.feedbackyear = a.[Year]                            
   where RM_Id in (                    
   select EmpId from #tmpRMTable                    
   ) and b.IsRejected =0 ;               
    
	
   update A
   set A.feedbackStatus = 'In - Workflow'
   from #tmp_final A (nolock)
   inner join Feedback B(nolock)
   on A.LSID = B.LsId and A.[Month] = B.feedbackMonth AND A.[Year] = b.feedbackYear
      where B.IsRejected = 0;
	
   update A
   set A.feedbackStatus = 'Pending'
   from #tmp_final A (nolock)
   where A.LSID NOT IN (
	select Distinct LSID from ACHFeedback where IsRejected=0
   )

	   update A
   set A.feedbackStatus = 'Approved'
   from #tmp_final A (nolock)
   inner join RCHFeedback B(nolock)
   on A.LSID = B.LsId and A.[Month] = B.feedbackMonth AND A.[Year] = b.feedbackYear
   where B.IsRejected = 0

	 
   update A
   set A.RFA_Recommended = case when B.RFARecommendationId IN (24,26) then 'Yes' else 'No' end
   from #tmp_final A (nolock)
   inner join ACHFeedback B(nolock)
   on A.LSID = B.LsId and A.[Month] = B.feedbackMonth AND A.[Year] = b.feedbackYear
   where B.IsRejected = 0;


      select Id,LSID,CustomerName,TriggerName,RaisedOn,IsRectified,RFATriggerId,Month,Year,RFATriggerPublishId,feedbackStatus
   ,ISNULL(RFA_Recommended,'No') as RFA_Recommended
   from #tmp_final order by RaisedOn 

                     
  drop table #tmpClusterHeadTable;                    
  drop table #tmpRMTable;    
   drop table #tmp_final  
 END                    
                     
 ELSE IF(@UserType='Unit Head')                    
 BEGIN                    
                   
  CREATE TABLE #tmpClusterHeadTable1 (EmpId Varchar(25), [Name] VARCHAR(100),[Role] varchar(50),RefEmpId varchar(25))                      
                     
  /*   below query is used to get all Circle Head/ Cluster Head into temp table    */                    
  select EmpId,EmpName,[Role],RefEmpId                    
  INTO #tmpCHTable1                    
  from RFATrigger_UserMapping                     
  where RefEmpId=@UserId                    
                      
  --select * from #tmpCHTable                    
                     
  /*  query is used to get all Cluster head Id's    */                    
  INSERT INTO #tmpClusterHeadTable1                     
  select EmpId,EmpName,[Role],RefEmpId                     
  from RFATrigger_UserMapping             
  where RefEmpId in (                    
   select EmpId from #tmpCHTable1 where [Role]like'%Circle Head%'                     
  )                    
                     
  /*   query is used to get all Cluster head Id's from  #tmpCHTable1 table.   */                  
  IF EXISTS(select EmpId from #tmpCHTable1 where [Role] like'%Cluster Head%')                    
  BEGIN                    
   INSERT INTO #tmpClusterHeadTable1                     
   Select EmpId , [Name] ,[Role],[RefEmpId] from                     
   #tmpCHTable1 where [Role]like'%Cluster Head%'                    
  END                    
                     
  /*   below query is used to get all RM Id's from  #tmpClusterHeadTable1 cluster head table.   */                    
  SELECT EmpId , EmpName,[Role], RefEmpId                    
  INTO #tmpRMTable1                    
  FROM RFATrigger_UserMapping          
  where RefEmpId in (select EmpId from #tmpClusterHeadTable1)                    
                     
 -- select * from #tmpClusterHeadTable                    
   
   INSERT INTO #tmp_final(LSID, CustomerName,  TriggerName, RaisedOn,  IsRectified,RFATriggerId, [Month], [Year] ,RFATriggerPublishId,feedbackStatus)  
   select                     
    a.LSID                     
   ,CustomerName                     
   ,a.TriggerName                     
   ,RaisedOn = SUBSTRING(a.[Month],0,4)+'-' + CONVERT(varchar(10), a.[Year])                            
   ,IsRectified = case when  a.IsRectified=0 then 'No' else 'Yes' end                         
    ,a.RFATriggerId                          
    ,a.[Month]                        
    ,a.[Year]                       
 ,a.RFATriggerPublishId      
 ,feedbackStatus ='Pending'
   from RFATriggerPublish a(nolock)                    
   inner join ACHFeedback b(nolock)                   
   on a.LSID=b.LsId  and a.[Month] = b.[feedbackMonth] and a.[Year] = b.[feedbackyear]                           
   Inner join CMFeedback c(nolock)                    
   on b.LsId = c.LsId   and b.feedbackMonth = c.[feedbackMonth] and b.feedbackyear = c.[feedbackyear]                                   
   where RM_Id in (                    
   select EmpId from #tmpRMTable1                    
   )            
  -- and c.IsSendForReview = 1      
  -- and c.RFARecommendationId in(24,26)  
   and b.IsRejected = 0          
     
  update A
   set A.feedbackStatus = 'In - Workflow'
   from #tmp_final A (nolock)
   inner join Feedback B(nolock)
   on A.LSID = B.LsId and A.[Month] = B.feedbackMonth AND A.[Year] = b.feedbackYear
      where B.IsRejected = 0;
	
	update A
   set A.feedbackStatus = 'Pending'
   from #tmp_final A (nolock)
   where A.LSID NOT IN (
	select Distinct LSID from RCHFeedback  where IsRejected=0
   )

	update A
   set A.feedbackStatus = 'Approved'
   from #tmp_final A (nolock)
   inner join RCHFeedback B(nolock)
   on A.LSID = B.LsId and A.[Month] = B.feedbackMonth AND A.[Year] = b.feedbackYear
   where B.IsRejected = 0
	  
   update A
   set A.RFA_Recommended = case when B.RFARecommendationId IN (24,26) then 'Yes' else 'No' end
   from #tmp_final A (nolock)
   inner join RCHFeedback B(nolock)
   on A.LSID = B.LsId and A.[Month] = B.feedbackMonth AND A.[Year] = b.feedbackYear
   where B.IsRejected = 0;


      select Id,LSID,CustomerName,TriggerName,RaisedOn,IsRectified,RFATriggerId,Month,Year,RFATriggerPublishId,feedbackStatus
   ,ISNULL(RFA_Recommended,'No') as RFA_Recommended
   from #tmp_final order by RaisedOn 

  drop table #tmpClusterHeadTable1                    
  drop table #tmpCHTable1                    
  drop table #tmpRMTable1                    
    drop table #tmp_final                    
 END                    
                     
 IF(@UserType='Business Head')                    
 BEGIN                    
                 
     CREATE TABLE #tmpClusterHeadTable2 (EmpId Varchar(25), [Name] VARCHAR(100),[Role] varchar(50),RefEmpId varchar(25))                      
                     
     Select * INTO #tmpUnitHeadTable                     
  from RFATrigger_UserMapping where RefEmpId = @UserId and [Role]='Unit Head'                    
                      
  --select * from #tmpUnitHeadTable                    
                    
                    
                    
  /*   below query is used to get all Circle Head/ Cluster Head into temp table    */                    
  select EmpId,EmpName,[Role],RefEmpId                    
  INTO #tmpCHTable2                    
  from RFATrigger_UserMapping                 
  where RefEmpId In(                    
   select EmpId from #tmpUnitHeadTable                    
  )                    
                      
                     
  /*   below query is used to get all Cluster head Id's    */                    
  INSERT INTO #tmpClusterHeadTable2                     
  select EmpId,EmpName,[Role],RefEmpId                     
  from RFATrigger_UserMapping                
  where RefEmpId in (                    
   select EmpId from #tmpCHTable2 where [Role]like'%Circle Head%'                     
  )                    
                     
  /*   below query is used to get all Cluster head Id's from  #tmpCHTable2 table.   */                    
  IF EXISTS(select EmpId from #tmpCHTable2 where [Role] like'%Cluster Head%')                    
  BEGIN                    
   INSERT INTO #tmpClusterHeadTable2                     
   Select EmpId , EmpName ,[Role],[RefEmpId] from                     
   #tmpCHTable2 where [Role]like'%Cluster Head%'                    
  END                    
                     
  /*   below query is used to get all RM Id's from  #tmpClusterHeadTable2 cluster head table.   */                    
  SELECT EmpId , EmpName,[Role], RefEmpId                    
  INTO #tmpRMTable2                    
  FROM RFATrigger_UserMapping                    
  where RefEmpId in (select EmpId from #tmpClusterHeadTable2)                    
                     
 --select EmpId from #tmpRMTable2                    
   INSERT INTO #tmp_final(LSID, CustomerName,  TriggerName, RaisedOn,  IsRectified,RFATriggerId, [Month], [Year] ,RFATriggerPublishId,feedbackStatus)                   
    select                     
    a.LSID                     
   ,CustomerName                     
   ,a.TriggerName                     
   ,RaisedOn = SUBSTRING(a.[Month],0,4)+'-' + CONVERT(varchar(10), a.[Year])                            
   ,IsRectified = case when  a.IsRectified=0 then 'No' else 'Yes' end                         
    ,a.RFATriggerId                          
    ,a.[Month]                        
    ,a.[Year]                     
 ,a.RFATriggerPublishId
  ,feedbackStatus ='Pending'
   from RFATriggerPublish a(nolock)               
   Inner join Feedback b(nolock)            
   on a.LSID = b.LsId  and a.[Month] = b.[feedbackMonth] and a.[Year] = b.[feedbackyear]                        
   Inner join CMFeedback c(nolock)            
   on b.LsId = c.LsId      and b.feedbackMonth = c.[feedbackMonth] and b.feedbackyear = c.[feedbackyear]            
   Inner join ACHFeedback d(nolock)            
   on c.LsId = d.LsId    and c.feedbackMonth = d.[feedbackMonth] and c.feedbackyear = d.[feedbackyear]                      
   --inner join RCHFeedback b(nolock)                    
   --on a.LSID=b.LsId                    
   --Inner join CMFeedback c(nolock)                    
   --on b.LsId = c.LsId                          
   where RM_Id in (                    
   select EmpId from #tmpRMTable2                    
   )     
  -- and c.RFARecommendationId in(24,26)  
  -- and c.IsSendForReview = 1 
   and d.IsRejected =0;                      
                     
     
  update A
   set A.feedbackStatus = 'In - Workflow'
   from #tmp_final A (nolock)
   inner join Feedback B(nolock)
   on A.LSID = B.LsId and A.[Month] = B.feedbackMonth AND A.[Year] = b.feedbackYear
      where B.IsRejected = 0;

	  	update A
   set A.feedbackStatus = 'Pending'
   from #tmp_final A (nolock)
   where A.LSID NOT IN (
	select Distinct LSID from RCHFeedback
   )

 update A
   set A.feedbackStatus = 'Approved'
   from #tmp_final A (nolock)
   inner join RCHFeedback B(nolock)
   on A.LSID = B.LsId and A.[Month] = B.feedbackMonth AND A.[Year] = b.feedbackYear
   where B.IsRejected = 0
  
  update A
   set A.RFA_Recommended = case when B.RFARecommendationId IN (24,26) then 'Yes' else 'No' end
   from #tmp_final A (nolock)
   inner join RCHFeedback B(nolock)
   on A.LSID = B.LsId and A.[Month] = B.feedbackMonth AND A.[Year] = b.feedbackYear
   where B.IsRejected = 0;


      select Id,LSID,CustomerName,TriggerName,RaisedOn,IsRectified,RFATriggerId,Month,Year,RFATriggerPublishId,feedbackStatus
   ,ISNULL(RFA_Recommended,'No') as RFA_Recommended
   from #tmp_final order by RaisedOn 

   
  drop table #tmpClusterHeadTable2                    
  drop table #tmpCHTable2                    
  drop table #tmpRMTable2                    
  drop table #tmpUnitHeadTable                    
   drop table #tmp_final          
 END                    
                    
END
GO
/****** Object:  StoredProcedure [dbo].[SP_Select_Mofee_Url]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[SP_Select_Mofee_Url]
	-- Add the parameters for the stored procedure here
	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	select Id,Url from tbl_Mofee_Url
END
GO
/****** Object:  StoredProcedure [dbo].[SP_Select_NewIntegrationdpdata]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[SP_Select_NewIntegrationdpdata]	
AS
BEGIN
	
	SET NOCOUNT ON;

    SELECT 0 As [Id], '-- Select --' As [Val]   
    UNION ALL   
    select MisccdId As ID ,CDValDesc AS 'Val' from tbl_API_Adda_Misccd   WHERE CDTP = 'Existing_New' AND [Status] = 1  ----0


   SELECT 0 As [Id], '-- Select --' As [Val]   
    UNION ALL   
    select MisccdId As ID ,CDValDesc AS 'Val' from tbl_API_Adda_Misccd   WHERE CDTP = 'Rest_Soap' AND [Status] = 1  ---1


	SELECT 0 As [Id], '-- Select --' As [Val]   
    UNION ALL   
    select MisccdId As ID ,CDValDesc AS 'Val' from tbl_API_Adda_Misccd   WHERE CDTP = 'Service Type' AND [Status] = 1  ---2


	SELECT 0 As [Id], '-- Select --' As [Val]   
    UNION ALL   
    select MisccdId As ID ,CDValDesc AS 'Val' from tbl_API_Adda_Misccd   WHERE CDTP = 'API Risk Score' AND [Status] = 1  ---3


	SELECT 0 As [Id], '-- Select --' As [Val]   
    UNION ALL   
    select MisccdId As ID ,CDValDesc AS 'Val' from tbl_API_Adda_Misccd   WHERE CDTP = 'Partner Risk Score' AND [Status] = 1  ---4



   SELECT 0 As [Id], '-- Select --' As [Val]   
    UNION ALL   
    select MisccdId As ID ,CDValDesc AS 'Val' from tbl_API_Adda_Misccd   WHERE CDTP = 'API Category' AND [Status] = 1 ---5
  
  
   SELECT 0 As [Id], '-- Select --' As [Val]   
    UNION ALL   
    select MisccdId As ID ,CDValDesc AS 'Val' from tbl_API_Adda_Misccd   WHERE CDTP = 'Domain Name' AND [Status] = 1 ---6
  
  
    SELECT 0 As [Id], '-- Select --' As [Val]   
    UNION ALL   
    select MisccdId As ID ,CDValDesc AS 'Val' from tbl_API_Adda_Misccd   WHERE CDTP = 'API Type' AND [Status] = 1 ---7


	SELECT 0 As [Id], '-- Select --' As [Val]   
    UNION ALL   
    select MisccdId As ID ,CDValDesc AS 'Val' from tbl_API_Adda_Misccd   WHERE CDTP = 'Consumer DC' AND [Status] = 1 --8


	SELECT 0 As [Id], '-- Select --' As [Val]   
    UNION ALL   
    select MisccdId As ID ,CDValDesc AS 'Val' from tbl_API_Adda_Misccd   WHERE CDTP = 'Producer DC' AND [Status] = 1 --9

 --SELECT MisccdId As [Id], CDValDesc As [Val] FROM EMA_Misccd WHERE CDTP = 'IsActive' AND [Status] = 1  

    select QID As ID ,Question, QuestionType QType,IsNull(APICategory,'Internal') as APICategory ,Isnull(APICategoryId,0)As APICategoryId from TBL_APIA_ServiceQuestion where Status=1 order by ID asc 

    select   0 As [Id], '-- Select --' As [Val] ,  0 as 'Weightage',0 as 'QID'
    UNION ALL
	select ID ,Options AS 'Val',Weightage,QID from TBL_APIA_QuestionData where Status=1 order by ID asc    

END
GO
/****** Object:  StoredProcedure [dbo].[Spx_EmailAPI]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE procedure [dbo].[Spx_EmailAPI]               
@From varchar(50)=Null,                                                 
@To varchar(50)=Null, 
@Subject varchar(50)=Null, 
@Body varchar(50)=Null   
as                                                                                  
BEGIN  
	INSERT INTO [dbo].[TBL_Email_Extender]
		([From], [To], [Subject], Body,AddedOn)  
		VALUES  
		(@From, @To, @Subject,@Body,GETDATE())  
END
GO
/****** Object:  StoredProcedure [dbo].[Spx_EmailAPI_Details]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
Create procedure [dbo].[Spx_EmailAPI_Details]        
                     
as                                                                                  
BEGIN  

	select * from TBL_Email_Extender

END
GO
/****** Object:  StoredProcedure [dbo].[Usp_api_adda_FillUser]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[Usp_api_adda_FillUser]
@role nvarchar(30)=null
AS
Begin
SELECT '0' As [EmpCode],
'-- Select --' As [EmpName]   
UNION ALL
SELECT 
AAU.EmpCode,
EmpName
--AAU.Role
FROM tbl_API_ADDA_USER AAU
INNER JOIN UserMaster as UM On UM.EmpCode=AAU.EmpCode
 --order by EmpCode Asc
WHERE Role = @role order by EmpCode Asc
End
GO
/****** Object:  StoredProcedure [dbo].[Usp_API_HUNT_APISearch]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- exec[dbo].[Usp_API_HUNT_APISearch] 'SERVICE_TYPE=119,SERVICE_PROVIDER=343,ServiceURL=''Https://10.226.162.150:8082/Service/Employee'''
 -- exec[dbo].[Usp_API_HUNT_APISearch] '(SERVICE_TYPE = ''OBP''  ) or  SERVICE_PROVIDER = ''FC'' and (SERVICE_INTERFACE_TYPE= 3 or SERVICE_INTERFACE_TYPE= 4) and ( SERVICE_CATEGORY=7) '
  -- exec[dbo].[Usp_API_HUNT_APISearch] 'SERVICE_TYPE = ''OBP'''
CREATE PROCEDURE [dbo].[Usp_API_HUNT_APISearch](    
 @whereClause varchar(max)= null  
)        
AS        
BEGIN   
 Declare @query varchar(max) = N'' , @query1 varchar(max) = N'';
	 

	  SET @query =' select A.TBL_API_Main_ID,A.PRODUCT_PROCESSOR_URL_UAT  as ServiceURL,A.SERVICE_DESC,SERVICE_MIDDLEWARE.Value as SERVICE_TYPE,A.SERVICE_INTERFACE_TYPE,A.SERVICE_CATEGORY
	,A.COD_SERVICE_ID,A.SERVICE_SIGNATURE,
	SERVICE_PROVIDER.Value as SERVICE_PROVIDER
	,A.PRODUCT_PROCESSOR_WSDL , DOMAIN_NAME.Value as DOMAIN_NAME,A.fileName
	   INTO #tmp_DynamicTable  from TBL_API_Main A
	left join TBL_API_Master_Values SERVICE_MIDDLEWARE
	on A.NAM_SERVICE_MIDDLEWARE = SERVICE_MIDDLEWARE.Id And SERVICE_MIDDLEWARE.API_Master_ID=1
	left join TBL_API_Master_Values SERVICE_INTERFACE_TYPE 
	on a.SERVICE_INTERFACE_TYPE = SERVICE_INTERFACE_TYPE.Id and SERVICE_INTERFACE_TYPE.API_Master_ID=2
	left join TBL_API_Master_Values SERVICE_CATEGORY 
	on a.SERVICE_CATEGORY = SERVICE_CATEGORY.Id and SERVICE_CATEGORY.API_Master_ID=3
	left join TBL_API_Master_Values SERVICE_PROVIDER 
	on a.SERVICE_PROVIDER = SERVICE_PROVIDER.Id and SERVICE_PROVIDER.API_Master_ID=4

	left join TBL_API_Master_Values SERVICE_TYPE 
	on a.SERVICE_TYPE = SERVICE_TYPE.Id and SERVICE_TYPE.API_Master_ID=5

	left join TBL_API_Master_Values NAM_CONTAINER 
	on a.NAM_CONTAINER = NAM_CONTAINER.Id and NAM_CONTAINER.API_Master_ID=6

	left join TBL_API_Master_Values NAM_DOMAIN 
	on a.NAM_DOMAIN = NAM_DOMAIN.Id and NAM_DOMAIN.API_Master_ID=7

	left join TBL_API_Master_Values DOMAIN_NAME 
	on a.DOMAIN_NAME = DOMAIN_NAME.Id and DOMAIN_NAME.API_Master_ID=8
	   
	 select * into #tmp_finalTable from  #tmp_DynamicTable '
	  SET @query += ' Select * From #tmp_finalTable where  ' + @whereClause + '      
	     Drop table #tmp_DynamicTable ; Drop table #tmp_finalTable ;'  
	print @query
	EXEC(@query); 
	
END 

GO
/****** Object:  StoredProcedure [dbo].[Usp_APIA_ExceptionManagement]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [dbo].[Usp_APIA_ExceptionManagement]
(
	@IdentFlag varchar(50),
	@CaseID	int=NULL,
	@OriginalOnboardingGASID VARCHAR(50)=NULL,
	@ExceptionRequestor VARCHAR(100)=NULL, 
	@APIProjectName varchar,
	@APIProjectDescription VARCHAR(100)=NULL,
	@PartnersToBeIntegrated VARCHAR(100)=NULL,
	@ProductAPIToBeConsumed VARCHAR(100)=NULL,
	@RequestedException VARCHAR(100)=NULL,
	@ReasonForException VARCHAR(100)=NULL,
	@StartDate date,
	@EndDate date,
	@HowExceptionToBeImplemented VARCHAR(100)=NULL,
	@ImpactOnBank varchar(50),
	@ExceptionLevel VARCHAR(100)=NULL
)
AS
BEGIN
IF @IdentFlag='ExceptionManagement'
	
	BEGIN
		INSERT INTO [tbl_APIA_ExceptionManagement](CaseID,OriginalOnboardingGASID,ExceptionRequestor,APIProjectName,APIProjectDescription,PartnersToBeIntegrated,ProductAPIToBeConsumed,RequestedException
		,ReasonForException,StartDate,EndDate,HowExceptionToBeImplemented,ImpactOnBank,ExceptionLevel)
		values(
		@CaseID,@OriginalOnboardingGASID,@ExceptionRequestor,@APIProjectName,@APIProjectDescription,@PartnersToBeIntegrated,@ProductAPIToBeConsumed,@RequestedException
		,@ReasonForException,@StartDate,@EndDate,@HowExceptionToBeImplemented,@ImpactOnBank,@ExceptionLevel)
		
	END
End
GO
/****** Object:  StoredProcedure [dbo].[Usp_APIA_ExceptionManagementDetails]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE procedure [dbo].[Usp_APIA_ExceptionManagementDetails]

(

	@IdentFlag varchar(50)= NULL,

	@CaseID	int=NULL,

	@OriginalOnboardingGASID VARCHAR(50)=NULL,

	@ExceptionRequestor VARCHAR(100)=NULL, 

	@APIProjectName varchar =NULL,

	@APIProjectDescription VARCHAR(100)=NULL,

	@PartnersToBeIntegrated VARCHAR(100)=NULL,

	@ProductAPIToBeConsumed VARCHAR(100)=NULL,

	@RequestedException VARCHAR(100)=NULL,

	@ReasonForException VARCHAR(100)=NULL,

	@StartDate date=NULL,

	@EndDate date=NULL,

	@HowExceptionToBeImplemented VARCHAR(100)=NULL,

	@ImpactOnBank varchar(50)=NULL,

	@ExceptionLevel VARCHAR(100)=NULL

)

AS

BEGIN

IF @IdentFlag='ExceptionManagement'


	BEGIN

		INSERT INTO [tbl_APIA_ExceptionManagement](OriginalOnboardingGASID,ExceptionRequestor,APIProjectName,APIProjectDescription,PartnersToBeIntegrated,ProductAPIToBeConsumed,RequestedException

		,ReasonForException,StartDate,EndDate,HowExceptionToBeImplemented,ImpactOnBank,ExceptionLevel)

		values(

		@OriginalOnboardingGASID,@ExceptionRequestor,@APIProjectName,@APIProjectDescription,@PartnersToBeIntegrated,@ProductAPIToBeConsumed,@RequestedException

		,@ReasonForException,@StartDate,@EndDate,@HowExceptionToBeImplemented,@ImpactOnBank,@ExceptionLevel)


	END

End
GO
/****** Object:  StoredProcedure [dbo].[Usp_APIA_IUSQuestionServiceDetails]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,H6678>
-- Create date: <20/9/2034>
-- Description:	<Add Questions>
-- =============================================
CREATE PROCEDURE [dbo].[Usp_APIA_IUSQuestionServiceDetails]
	        @ServiceID int=null,
           @QID int=null,
           @OptionsID int=null,
           @IsActive bit=1,
           @CreatedBy varchar(50)=null,
           @CreatedAt datetime=null,
           @UpdatedBy varchar(50)=null,
           @UpdatedAt datetime=null
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	INSERT INTO [dbo].[tbl_APIA_QusServiceDetails]
	(
	       [ServiceID]
           ,[QID]
           ,[OptionsID]
           ,[IsActive]
           ,[CreatedBy]
           ,[CreatedAt]
           ,[UpdatedBy]
           ,[UpdatedAt])
     VALUES
           (
		   @ServiceID,
           @QID,
           @OptionsID,
           @IsActive,
           @CreatedBy,
           @CreatedAt,
           @UpdatedBy,
           @UpdatedAt
		   )
END
GO
/****** Object:  StoredProcedure [dbo].[Usp_APIA_PartnerOffboarding]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[Usp_APIA_PartnerOffboarding]
(
    @Exit_scenario VARCHAR(50)=null,
    @IdentFlag VARCHAR(50),
    @Partner_Name VARCHAR(100) = NULL,
    @API_Name VARCHAR(100) = NULL,
    @Remark VARCHAR(100) = NULL,
    @partner_checkilist VARCHAR(100) = NULL,
    @fileUpload VARCHAR(100) = NULL
)
AS
BEGIN
    IF @IdentFlag = 'SavePartnerOffboardingDetails'
    BEGIN
        INSERT INTO tbl_APIA_PartnerOffboardning_getdetails 
            (Exit_scenario, Partner_Name, API_Name, Remark, partner_checkilist, fileUpload) 
        VALUES 
            (@Exit_scenario, @Partner_Name, @API_Name, @Remark, @partner_checkilist, @fileUpload);
    END
END;



GO
/****** Object:  StoredProcedure [dbo].[Usp_APIA_PartnerOnBoarding]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [dbo].[Usp_APIA_PartnerOnBoarding]
(
	@PartnetOnboading_ID VARCHAR(50)=NULL,
	@Partner_Name VARCHAR(50)=NULL,
	@Project_Description VARCHAR(100)=NULL, 
	@TentativeGoLive_Date DATE=NULL,
	@PartnerType VARCHAR(100)=NULL,
	@PartnerEntityType VARCHAR(100)=NULL,
	@PartnerTPRM_Application VARCHAR(100)=NULL,
	@Partnerrisk_score VARCHAR(100)=NULL,
	@Partnerrisk VARCHAR(100)=NULL,
	@API_name VARCHAR(100)=NULL,
	@API_risk VARCHAR(100)=NULL,
	@APIrisk_score VARCHAR(100)=NULL,
	@IdentFlag varchar(50),
	@PartnerRiskClassification VARCHAR(100)=NULL,
	@APIRiskClassification VARCHAR(100)=NULL,
	@ApproverType VARCHAR(100)=NULL,
	@ApproverLevel VARCHAR(100)=NULL,
	@APIName VARCHAR(100)=NULL,
	@HOPP_FH varchar(100) =NULL,
	@HOPP_VH varchar(100)=NULL,
	@HOPP_GH varchar(100)=NULL,
	@HOB_FH varchar(100)=NULL,
	@HOB_VH varchar(100)=NULL,
	@HOB_GH varchar(100)=NULL,
	@HODB_FH varchar(100)=NULL,
	@HODB_VH varchar(100)=NULL,
	@HODB_GH varchar(100)=NULL,
	@HOISG_FH varchar(100)=NULL,
	@HOISG_VH varchar(100)=NULL,
	@HOISG_GH varchar(100)=NULL,
	@HOITDRM_FH varchar(100)=NULL,
	@HOITDRM_VH varchar(100)=NULL,
	@HOITDRM_GH varchar(100)=NULL,
	@PartnerXMl xml=NULL,
	@ApproverUserID varchar(100)=NULL,
	@ApproverID VARCHAR(100)=NULL
)
AS
BEGIN
	--SET @PartnetOnboading_ID=REPLACE(@PartnetOnboading_ID,'APIGW0000000000','')
	--SET @PartnetOnboading_ID=REPLACE(@PartnetOnboading_ID,'APIGW','')

	/*SET @PartnetOnboading_ID=(CASE WHEN @PartnetOnboading_ID LIKE '%APIGW%' AND LEN(@PartnetOnboading_ID) <= 5 THEN 'APIGW0000000000' + RIGHT('00000' + CAST(@PartnetOnboading_ID AS VARCHAR), 5)
                                   ELSE CAST(@PartnetOnboading_ID AS VARCHAR) END)*/

	--SET @PartnetOnboading_ID=(CASE WHEN @PartnetOnboading_ID LIKE '%APIGW%' THEN RIGHT(@PartnetOnboading_ID, LEN(@PartnetOnboading_ID) - 13) ELSE @PartnetOnboading_ID END)
	DECLARE @TCOUNT INT=0

	SELECT @TCOUNT=CAST(RIGHT(@PartnetOnboading_ID,4) AS INT) 

	SET @PartnetOnboading_ID=(CASE WHEN @PartnetOnboading_ID LIKE '%APIGW%' AND @TCOUNT>999 THEN RIGHT(@PartnetOnboading_ID, LEN(@PartnetOnboading_ID) - 12)
			 WHEN @PartnetOnboading_ID LIKE '%APIGW%' AND @TCOUNT>99 THEN RIGHT(@PartnetOnboading_ID, LEN(@PartnetOnboading_ID) - 13)
			 WHEN @PartnetOnboading_ID LIKE '%APIGW%' AND @TCOUNT>9 THEN RIGHT(@PartnetOnboading_ID, LEN(@PartnetOnboading_ID) - 14)
			 WHEN @PartnetOnboading_ID LIKE '%APIGW%' AND @TCOUNT<9 THEN RIGHT(@PartnetOnboading_ID, LEN(@PartnetOnboading_ID) - 15) ELSE @PartnetOnboading_ID END )

	DECLARE @createdBy VARCHAR(100)=NULL,@ApprovalID VARCHAR(100)=NULL,@FeedbackID VARCHAR(100)=NULL,@ActionTaken VARCHAR(100)=NULL

	SET @ApproverLevel=(SELECT TOP 1 ApproverLevel FROM tbl_APIA_MstPartnerCaseApprovalMetrix WHERE ApproverUserID=@ApproverUserID)
	--SET @ApproverLevel=(SELECT TOP 1 Role FROM tbl_API_ADDA_USER WHERE EmpCode=@ApproverUserID)

	IF EXISTS (SELECT * FROM [tbl_APIA_Partner_Onboarding] WHERE PartnetOnboading_ID = @PartnetOnboading_ID) AND @IdentFlag='UpdatePartnerboarding'
	BEGIN
		UPDATE [tbl_APIA_Partner_Onboarding]
		SET Partner_Name=@Partner_Name,
			Project_Description=@Project_Description,
			TentativeGoLive_Date=@TentativeGoLive_Date,
			PartnerType=@PartnerType,
			PartnerEntityType=@PartnerEntityType,
			PartnerTPRM_Application=@PartnerTPRM_Application,
			Partnerrisk_score=@Partnerrisk_score,
			Partnerrisk=@Partnerrisk,
			API_name=@API_name,
			API_risk=@API_risk,
			APIrisk_score=@APIrisk_score
		WHERE PartnetOnboading_ID = @PartnetOnboading_ID
	END
	ELSE IF @IdentFlag='AddPartnerboarding'
	BEGIN
		INSERT INTO [tbl_APIA_Partner_Onboarding](Partner_Name,Project_Description,TentativeGoLive_Date,PartnerType,PartnerEntityType,PartnerTPRM_Application,Partnerrisk_score,Partnerrisk,API_name,API_risk,APIrisk_score,statusCode)
		SELECT @Partner_Name,@Project_Description,@TentativeGoLive_Date,@PartnerType,@PartnerEntityType,@PartnerTPRM_Application,@Partnerrisk_score,@Partnerrisk,@API_name,@API_risk,@APIrisk_score,1

		SET @PartnetOnboading_ID=(SELECT MAX(PartnetOnboading_ID) FROM tbl_APIA_Partner_Onboarding)

		INSERT INTO [tbl_APIA_caseapprovalMatrix] (caseId,HOPP_FH,HOPP_VH,HOPP_GH,HOB_FH,HOB_VH,HOB_GH,HODB_FH,HODB_VH,HODB_GH,HOISG_FH,HOISG_VH,HOISG_GH,HOITDRM_FH,HOITDRM_VH,HOITDRM_GH)
		SELECT @PartnetOnboading_ID,@HOPP_FH,@HOPP_VH,@HOPP_GH,@HOB_FH,@HOB_VH,@HOB_GH,@HODB_FH,@HODB_VH,@HODB_GH,@HOISG_FH,@HOISG_VH,@HOISG_GH,@HOITDRM_FH,@HOITDRM_VH,@HOITDRM_GH
	END
	ELSE IF @IdentFlag='GetNewCaseId'
	BEGIN
		SELECT MAX(PartnetOnboading_ID)+1 AS CaseID FROM tbl_APIA_Partner_Onboarding 
	END
	ELSE IF @IdentFlag='AddPartner'
	BEGIN
		DECLARE @NewID INT=0
		SET @NewID=(SELECT MAX(PartnetOnboading_ID)+1 FROM tbl_APIA_Partner_Onboarding)

		SET IDENTITY_INSERT [tbl_APIA_Partner_Onboarding] ON
		INSERT INTO [tbl_APIA_Partner_Onboarding](PartnetOnboading_ID,Partner_Name,Project_Description,TentativeGoLive_Date,PartnerType,PartnerEntityType,PartnerTPRM_Application,Partnerrisk_score,Partnerrisk,statusCode,created_By,created_date,API_risk,
												 AttachedJourneyDocuments,APIRiskAssessment,OtherDocument)
		SELECT @NewID,TBL.COL.value('PartnerName[1]','VARCHAR(100)') AS PartnerName,
		TBL.COL.value('projectDescription[1]','VARCHAR(100)') AS projectDescription,
		CASE 
			WHEN TBL.COL.value('TentativeGoLiveDate[1]','VARCHAR(100)')='0001-01-01T00:00:00' THEN NULL 
			ELSE TBL.COL.value('TentativeGoLiveDate[1]','DATE') 
		END AS TentativeGoLiveDate,
		TBL.COL.value('PartnerType[1]','VARCHAR(100)') AS PartnerType,
		TBL.COL.value('PartnerEntityType[1]','VARCHAR(100)') AS PartnerEntityType,
		TBL.COL.value('PartnerTPRMAssesmetApplicability[1]','VARCHAR(100)') AS PartnerTPRMAssesmetApplicability,
		TBL.COL.value('PartnerRiskScore[1]','VARCHAR(100)') AS PartnerRiskScore,
		TBL.COL.value('PartnerRisk[1]','VARCHAR(100)') AS PartnerRisk,12,
		TBL.COL.value('createdBy[1]','VARCHAR(100)') AS createdBy,
		GETDATE(),
		TBL.COL.value('APIRisk[1]','VARCHAR(100)') AS APIRisk,
		TBL.COL.value('AttachedJourneyDocuments[1]','VARCHAR(150)') AS AttachedJourneyDocuments,
		TBL.COL.value('APIRiskAssessmentSheet[1]','VARCHAR(150)') AS APIRiskAssessmentSheet,
		TBL.COL.value('OtherDocument[1]','VARCHAR(150)') AS OtherDocument
		from @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)

		SET @PartnetOnboading_ID=(SELECT MAX(PartnetOnboading_ID) FROM tbl_APIA_Partner_Onboarding)
		SET @PartnetOnboading_ID=@NewID

		INSERT INTO tbl_APIA_PO_ApiDeatil(CaseId,APIName,APIRisk,APIRiskScore)
		SELECT @PartnetOnboading_ID,TBL.COL.value('APIName[1]','varchar(100)') AS APIName,
		TBL.COL.value('APIRisk[1]','Varchar(100)') AS APIRisk ,
		TBL.COL.value('APIRiskScore[1]','Varchar(100)') AS APIRiskScore
		from @PartnerXMl.nodes('/PartnerOnboarding/lstApiDeatil/ApiDeatil') AS TBL(COL)

		INSERT INTO tbl_APIA_PO_ApprovalTrailTable(CaseId,Department,ApproverLevel,ApproverUserID,Sequence)
		SELECT @PartnetOnboading_ID,
		TBL.COL.value('Department[1]','VARCHAR(100)') AS Department,
		TBL.COL.value('ApproverLevel[1]','VARCHAR(100)') AS ApproverLevel,
		TBL.COL.value('ApproverUserID[1]','VARCHAR(100)') AS ApproverUserID,
		TBL.COL.value('Sequence[1]','VARCHAR(100)') AS Sequence
		from @PartnerXMl.nodes('/PartnerOnboarding/PartnerApproval/AddPartnerCaseApprovalMetrixList') AS TBL(COL)

		INSERT INTO tbl_APIA_Audit_log(CaseID,ApprovalID,status,createdBy,createdDate)
		SELECT @PartnetOnboading_ID,NULL,
		TBL.COL.value('Action[1]','VARCHAR(100)') AS Action,
		TBL.COL.value('createdBy[1]','VARCHAR(100)') AS createdBy,
		GETDATE()
		from @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)

		SELECT @PartnetOnboading_ID AS CaseID
	END
	ELSE IF @IdentFlag='GetPartnerType' 
	BEGIN
		select DISTINCT PartnerType from tbl_APIA_MSTPartnerType;
	END
	ELSE IF @IdentFlag='GetPartnerCaseApprovalMetrix' 
	BEGIN
		SELECT PartnerRiskClassification,APIRiskClassification,ApproverType,ApproverLevel,ApproverUserID,ApproverName 
		FROM tbl_APIA_MstPartnerCaseApprovalMetrix 
		--WHERE PartnerRiskClassification=@PartnerRiskClassification AND APIRiskClassification=@APIRiskClassification AND ApproverType=@ApproverType AND ApproverLevel=@ApproverLevel;
	END
	ELSE IF @IdentFlag='GetPartnerCaseApprovalMetrix' 
	BEGIN
		SELECT PartnerRiskClassification,APIRiskClassification,ApproverType,ApproverLevel,ApproverUserID,ApproverName 
		FROM tbl_APIA_MstPartnerCaseApprovalMetrix 
		--WHERE PartnerRiskClassification=@PartnerRiskClassification AND APIRiskClassification=@APIRiskClassification AND ApproverType=@ApproverType AND ApproverLevel=@ApproverLevel;
	END
	ELSE IF @IdentFlag='GetPartnerList' 
	BEGIN
		
			SELECT /*(CASE WHEN LEN(PO.PartnetOnboading_ID) <= 5 THEN 'APIGW0000000000' + RIGHT('00000' + CAST(PO.PartnetOnboading_ID AS VARCHAR), 5)
                    ELSE CAST(PO.PartnetOnboading_ID AS VARCHAR) END) AS PartnetOnboading_ID,*/
					--'APIGW'+REPLACE(CONVERT(VARCHAR,PO.created_date,3),'/','')+'00'+CAST(PO.PartnetOnboading_ID AS VARCHAR) AS PartnetOnboading_ID,
					'APIGW'+REPLACE(CONVERT(VARCHAR,PO.created_date,3),'/','')+(CASE WHEN LEN(PO.PartnetOnboading_ID)=1 THEN '0000' 
					WHEN LEN(PO.PartnetOnboading_ID)=2 THEN '000' WHEN LEN(PO.PartnetOnboading_ID)=3 THEN '00' WHEN LEN(PO.PartnetOnboading_ID)=4 THEN '0' END)+
					CAST(PO.PartnetOnboading_ID AS VARCHAR) AS PartnetOnboading_ID,PO.PartnetOnboading_ID AS CaseID,
					PO.Partner_Name,
			--ST.STATUS,
			CASE 
				WHEN FEEDCOUNT.FeedbackCount > 0 AND FEEDCOUNT.FeedbackReplyCount > 0 AND FEEDCOUNT.FeedbackCount != FEEDCOUNT.FeedbackReplyCount THEN 'Awaiting For Reply'
				--WHEN TCOUNT.ApprovalCount = 9 AND TCOUNT.ApprovedCount = 9 THEN 'In Progress'
				WHEN TCOUNT.ApprovalCount=TCOUNT.ApprovedCount THEN 'Approved'
				WHEN TCOUNT.RejectCount > 0 THEN 'Reject'
				WHEN TCOUNT.FeedbackCount > 0 AND TCOUNT.FeedbackReplyCount > 0 AND TCOUNT.FeedbackCount = TCOUNT.FeedbackReplyCount THEN 'Feedback'
				WHEN TCOUNT.FeedbackReplyCount < TCOUNT.FeedbackCount THEN 'Feedback Pending'
				WHEN ST.STATUS = 'Drafted' OR ST.STATUS = 'Awaiting For Reply' THEN ST.STATUS -- modify this line
				WHEN TCOUNT.ApprovalCount = 0 THEN 'Created'
				ELSE 'In Progress' 
			END AS StatusDescription,
			ISNULL(PO.created_By, '') AS createdBy,
			ISNULL(CONVERT(VARCHAR, PO.created_date, 103)+' '+CONVERT(VARCHAR, PO.created_date, 108), '') AS createdDate,
			ISNULL(CONVERT(VARCHAR, PO.Updated_date, 103)+' '+CONVERT(VARCHAR, PO.Updated_date, 108), '') AS UpdatedDate,
			ISNULL(DATEDIFF(DAY, PO.created_date, PO.Updated_date), 0) AS Ageing
		FROM [tbl_APIA_Partner_Onboarding] PO WITH (NOLOCK)
		OUTER APPLY(
			SELECT TOP 1 
				(CASE 
					WHEN T.status='Request For Approval' OR T.status='Edited' THEN 'Created'
					WHEN T.status='Approved' THEN 'Approved'
					WHEN T.status='Draft' THEN 'Drafted'
					WHEN T.status='Reject' THEN 'Rejected'
					WHEN T.status='Feedback' THEN 'Awaiting For Reply'
					WHEN T.status='Feedback Reply' THEN 'Feedback Replyed' 
					ELSE T.status END) AS STATUS
			FROM tbl_APIA_Audit_log T WITH(NOLOCK)
			WHERE T.CaseID=PO.PartnetOnboading_ID AND T.status IS NOT NULL 
			ORDER BY T.createdDate DESC
		) ST
		OUTER APPLY (
			SELECT 
				COUNT(*) AS ApprovalCount,
				SUM(CASE WHEN TCOUNT.Status = 'Approved' THEN 1 ELSE 0 END) AS ApprovedCount,
				SUM(CASE WHEN TCOUNT.Status = 'Reject' THEN 1 ELSE 0 END) AS RejectCount,
				SUM(CASE WHEN TCOUNT.Status = 'Feedback' THEN 1 ELSE 0 END) AS FeedbackCount,
				SUM(CASE WHEN TCOUNT.Status = 'Feedback Reply' THEN 1 ELSE 0 END) AS FeedbackReplyCount
			FROM tbl_APIA_PO_ApprovalTrailTable TCOUNT WITH (NOLOCK)
			WHERE TCOUNT.CaseId = PO.PartnetOnboading_ID
		) TCOUNT
		OUTER APPLY (
			SELECT 
				SUM(CASE WHEN TCOUNT.Status = 'Feedback' THEN 1 ELSE 0 END) AS FeedbackCount,
				SUM(CASE WHEN TCOUNT.Status = 'Feedback Reply' THEN 1 ELSE 0 END) AS FeedbackReplyCount
			FROM tbl_APIA_Audit_log TCOUNT WITH (NOLOCK)
			WHERE TCOUNT.CaseId = PO.PartnetOnboading_ID
		) FEEDCOUNT
		LEFT JOIN TBL_API_statusMaster SM WITH (NOLOCK) ON SM.statusCode = ISNULL(PO.statusCode, '1')
		WHERE ST.STATUS IS NOT NULL
		ORDER BY/* StatusDescription,*/ PO.PartnetOnboading_ID DESC;
	END
	ELSE IF @IdentFlag='GetPartnerList1' 
	BEGIN
			SELECT (CASE WHEN LEN(PO.PartnetOnboading_ID) <= 5 THEN 'APIGW0000000000' + RIGHT('00000' + CAST(PO.PartnetOnboading_ID AS VARCHAR), 5)
                    ELSE CAST(PO.PartnetOnboading_ID AS VARCHAR) END) AS PartnetOnboading_ID,PO.Partner_Name,
			--ST.STATUS,
			CASE 
				WHEN FEEDCOUNT.FeedbackCount > 0 AND FEEDCOUNT.FeedbackReplyCount > 0 AND FEEDCOUNT.FeedbackCount != FEEDCOUNT.FeedbackReplyCount THEN 'Awaiting For Reply'
				--WHEN TCOUNT.ApprovalCount = 9 AND TCOUNT.ApprovedCount = 9 THEN 'In Progress'
				WHEN TCOUNT.ApprovalCount=TCOUNT.ApprovedCount THEN 'Approved'
				WHEN TCOUNT.RejectCount > 0 THEN 'Reject'
				WHEN TCOUNT.FeedbackCount > 0 AND TCOUNT.FeedbackReplyCount > 0 AND TCOUNT.FeedbackCount = TCOUNT.FeedbackReplyCount THEN 'Feedback'
				WHEN TCOUNT.FeedbackReplyCount < TCOUNT.FeedbackCount THEN 'Feedback Pending'
				WHEN ST.STATUS = 'Drafted' OR ST.STATUS = 'Awaiting For Reply' THEN ST.STATUS -- modify this line
				WHEN TCOUNT.ApprovalCount = 0 THEN 'Created'
				ELSE 'In Progress' 
			END AS StatusDescription,
			ISNULL(PO.created_By, '') AS createdBy,
			ISNULL(CONVERT(VARCHAR, PO.created_date, 103), '') AS createdDate,
			ISNULL(CONVERT(VARCHAR, PO.Updated_date, 103), '') AS UpdatedDate,
			ISNULL(DATEDIFF(DAY, PO.created_date, PO.Updated_date), 0) AS Ageing
		FROM [tbl_APIA_Partner_Onboarding] PO WITH (NOLOCK)
		OUTER APPLY(
			SELECT TOP 1 
				(CASE 
					WHEN T.status='Request For Approval' OR T.status='Edited' THEN 'Created'
					WHEN T.status='Approved' THEN 'Approved'
					WHEN T.status='Draft' THEN 'Drafted'
					WHEN T.status='Reject' THEN 'Rejected'
					WHEN T.status='Feedback' THEN 'Awaiting For Reply'
					WHEN T.status='Feedback Reply' THEN 'Feedback Replyed' 
					ELSE T.status END) AS STATUS
			FROM tbl_APIA_Audit_log T WITH(NOLOCK)
			WHERE T.CaseID=PO.PartnetOnboading_ID AND T.status IS NOT NULL 
			ORDER BY T.createdDate DESC
		) ST
		OUTER APPLY (
			SELECT 
				COUNT(*) AS ApprovalCount,
				SUM(CASE WHEN TCOUNT.Status = 'Approved' THEN 1 ELSE 0 END) AS ApprovedCount,
				SUM(CASE WHEN TCOUNT.Status = 'Reject' THEN 1 ELSE 0 END) AS RejectCount,
				SUM(CASE WHEN TCOUNT.Status = 'Feedback' THEN 1 ELSE 0 END) AS FeedbackCount,
				SUM(CASE WHEN TCOUNT.Status = 'Feedback Reply' THEN 1 ELSE 0 END) AS FeedbackReplyCount
			FROM tbl_APIA_PO_ApprovalTrailTable TCOUNT WITH (NOLOCK)
			WHERE TCOUNT.CaseId = PO.PartnetOnboading_ID
		) TCOUNT
		OUTER APPLY (
			SELECT 
				SUM(CASE WHEN TCOUNT.Status = 'Feedback' THEN 1 ELSE 0 END) AS FeedbackCount,
				SUM(CASE WHEN TCOUNT.Status = 'Feedback Reply' THEN 1 ELSE 0 END) AS FeedbackReplyCount
			FROM tbl_APIA_Audit_log TCOUNT WITH (NOLOCK)
			WHERE TCOUNT.CaseId = PO.PartnetOnboading_ID
		) FEEDCOUNT
		LEFT JOIN TBL_API_statusMaster SM WITH (NOLOCK) ON SM.statusCode = ISNULL(PO.statusCode, '1')
		WHERE ST.STATUS IS NOT NULL
		ORDER BY StatusDescription, PO.PartnetOnboading_ID DESC;
	END
	ELSE IF @IdentFlag='GetApiDeatil' 
	BEGIN
		--SELECT ISNULL(ServiceID,'') AS APIId,ISNULL(ServiceName,'') AS APIName,ISNULL(Classification,'') AS APIRisk,ISNULL(RiskScore,'') AS APIRiskScore
		--FROM TBL_APIA_ServiceDetails
		--WHERE ServiceName like '%'+@APIName+'%'

		SELECT ISNULL(EXTERNALSERVICE_ID,'') AS APIId,ISNULL(COD_SERVICE_ID,'') AS APIName,ISNULL(FILLER_02,'') AS APIRisk,ISNULL(FILLER_03,'') AS APIRiskScore
		FROM TBL_API_EXTERNALSERVICES
		WHERE COD_SERVICE_ID like '%'+@APIName+'%'
	END
	ELSE IF @IdentFlag='GetlstApiDeatil' 
	BEGIN
		--SELECT ISNULL(ServiceID,'') AS APIId,ISNULL(ServiceName,'') AS APIName,ISNULL(Classification,'') AS APIRisk,ISNULL(RiskScore,'') AS APIRiskScore
		--FROM TBL_APIA_ServiceDetails
		----WHERE ServiceName like '%'+@APIName+'%'

		SELECT ISNULL(EXTERNALSERVICE_ID,'') AS APIId,ISNULL(COD_SERVICE_ID,'') AS APIName,ISNULL(FILLER_02,'') AS APIRisk,ISNULL(FILLER_03,'') AS APIRiskScore
		FROM TBL_API_EXTERNALSERVICES
	END
	ELSE IF @IdentFlag='GetPartnerApprovalDeatil' 
	BEGIN
		SELECT Partner_Name AS PartnerName,Project_Description AS projectDescription,TentativeGoLive_Date AS TentativeGoLiveDate,PartnerType AS PartnerType,
			   PartnerEntityType AS PartnerEntityType,PartnerTPRM_Application AS PartnerTPRMAssesmetApplicability,Partnerrisk_score AS PartnerRiskScore,
			   Partnerrisk AS PartnerRisk,created_By AS createdBy,API_risk AS APIRisk,AttachedJourneyDocuments AS AttachedJourneyDocuments,
			   APIRiskAssessment AS APIRiskAssessment,OtherDocument AS OtherDocument
		FROM [tbl_APIA_Partner_Onboarding] WHERE PartnetOnboading_ID=@PartnetOnboading_ID
	END
	ELSE IF @IdentFlag='GetPartnerApprovalAPIDeatil' 
	BEGIN
		SELECT Id AS APIId,APIName,APIRisk,APIRiskScore FROM tbl_APIA_PO_ApiDeatil WHERE CaseId=@PartnetOnboading_ID
	END
	ELSE IF @IdentFlag='GetApprovalTrailDeatil' 
	BEGIN
		SELECT DISTINCT T.ApproverUserID, T.Sequence, T.Department, T.ApproverLevel,T.Id AS ApprovalTrialID,T1.ApproverUserID +' - '+T1.ApproverName AS ApproverName
		FROM tbl_APIA_PO_ApprovalTrailTable T WITH(NOLOCK)
		INNER JOIN tbl_APIA_MstPartnerCaseApprovalMetrix T1 WITH(NOLOCK) ON T1.ApproverUserID=T.ApproverUserID AND T1.ApproverLevel=T.ApproverLevel 
																		 AND T1.ApproverType=(CASE WHEN T.Department='HOB' THEN 'Business'
																								   WHEN T.Department='HODB' THEN 'Digital Banking'
																								   WHEN T.Department='HOISG' THEN 'ISG'
																								   WHEN T.Department='HOITDRM' THEN 'ITDRM'
																								   WHEN T.Department='HOPP' THEN 'Product processor' END)
		INNER JOIN (
			SELECT Department, CaseId FROM tbl_APIA_PO_ApprovalTrailTable WHERE CaseId=@PartnetOnboading_ID AND ApproverUserID = @ApproverUserID--'M3330'
		) AS Subquery
		ON T.Department = Subquery.Department AND T.CaseId = Subquery.CaseId
		WHERE T.CaseId = @PartnetOnboading_ID --AND T.ApproverUserID = 'M3330'
	END
	ELSE IF @IdentFlag='GetApprovalTrailList' 
	BEGIN
		--SELECT O.PartnetOnboading_ID,O.Partner_Name,O.Project_Description
		--FROM tbl_APIA_PO_ApprovalTrailTable T WITH(NOLOCK)
		--INNER JOIN tbl_APIA_Partner_Onboarding O WITH(NOLOCK) ON T.CaseId=O.PartnetOnboading_ID
		--WHERE T.ApproverUserID=@ApproverUserID AND T.Status IS NULL

		/*
		SELECT O.PartnetOnboading_ID, O.Partner_Name, O.Project_Description,O.API_risk,O.Partnerrisk
		FROM tbl_APIA_PO_ApprovalTrailTable T WITH(NOLOCK)
		INNER JOIN tbl_APIA_Partner_Onboarding O WITH(NOLOCK) ON T.CaseId = O.PartnetOnboading_ID
		LEFT JOIN tbl_APIA_Audit_log A WITH(NOLOCK) ON A.CaseID=T.CaseId AND A.ApprovalID=T.Id AND A.status='Feedback'
		LEFT JOIN tbl_APIA_POFeedbackReply_history FH WITH(NOLOCK) ON FH.CaseID=T.CaseId AND FH.ApprovalId=T.Id AND FH.FeedbackID=A.id
		WHERE T.ApproverUserID = @ApproverUserID AND T.Status IS NULL AND T.ApproverLevel=@ApproverLevel 
		AND (
		(ApproverLevel = 'FH' AND (T.Status IS NULL OR T.Status='Feedback'))
		OR
		(ApproverLevel = 'VH' AND (ApproverLevel = 'FH' AND T.Status IS NOT NULL))
		OR
		(ApproverLevel = 'GH' AND (ApproverLevel = 'VH' AND T.Status IS NOT NULL))
		)
		AND (CASE WHEN A.id IS NOT NULL AND FH.FeedbackID IS NOT NULL THEN '1'
				  WHEN A.id IS NULL AND FH.FeedbackID IS NULL THEN '1'
				  ELSE '0' END)='1'
		*/

		SELECT DISTINCT /*(CASE WHEN LEN(O.PartnetOnboading_ID) <= 5 THEN 'APIGW0000000000' + RIGHT('00000' + CAST(O.PartnetOnboading_ID AS VARCHAR), 5)
                    ELSE CAST(O.PartnetOnboading_ID AS VARCHAR) END) AS PartnetOnboading_ID,*/
					--'APIGW'+REPLACE(CONVERT(VARCHAR,O.created_date,3),'/','')+'00'+CAST(O.PartnetOnboading_ID AS VARCHAR) AS PartnetOnboading_ID,
					'APIGW'+REPLACE(CONVERT(VARCHAR,O.created_date,3),'/','')+(CASE WHEN LEN(O.PartnetOnboading_ID)=1 THEN '0000' 
					WHEN LEN(O.PartnetOnboading_ID)=2 THEN '000' WHEN LEN(O.PartnetOnboading_ID)=3 THEN '00' WHEN LEN(O.PartnetOnboading_ID)=4 THEN '0' END)+
					CAST(O.PartnetOnboading_ID AS VARCHAR) AS PartnetOnboading_ID,
					O.Partner_Name,O.Project_Description,O.API_risk,O.Partnerrisk,ApproverLevel,T.Status,
			CASE 
				WHEN FEEDCOUNT.FeedbackCount > 0 AND FEEDCOUNT.FeedbackReplyCount > 0 AND FEEDCOUNT.FeedbackCount != FEEDCOUNT.FeedbackReplyCount THEN 'Awaiting For Reply'
				WHEN TCOUNT.ApprovalCount = 9 AND TCOUNT.ApprovedCount = 9 THEN 'In Progress'
				WHEN TCOUNT.ApprovalCount=TCOUNT.ApprovedCount THEN 'Approved'
				WHEN TCOUNT.RejectCount > 0 THEN 'Reject'
				WHEN TCOUNT.FeedbackCount > 0 AND TCOUNT.FeedbackReplyCount > 0 AND TCOUNT.FeedbackCount = TCOUNT.FeedbackReplyCount THEN 'Feedback'
				WHEN TCOUNT.FeedbackReplyCount < TCOUNT.FeedbackCount THEN 'Feedback Pending'
				WHEN ST.STATUS = 'Drafted' OR ST.STATUS = 'Awaiting For Reply' THEN ST.STATUS -- modify this line
				WHEN TCOUNT.ApprovalCount = 0 THEN 'Created'
				ELSE 'In Progress' 
			END AS StatusDescription
		FROM 
			tbl_APIA_PO_ApprovalTrailTable T WITH(NOLOCK)
			INNER JOIN tbl_APIA_Partner_Onboarding O WITH(NOLOCK) ON T.CaseId = O.PartnetOnboading_ID
			LEFT JOIN tbl_APIA_Audit_log A WITH(NOLOCK) ON A.CaseID = T.CaseId AND A.ApprovalID = T.Id AND A.status = 'Feedback'
			LEFT JOIN tbl_APIA_POFeedbackReply_history FH WITH(NOLOCK) ON FH.CaseID = T.CaseId AND FH.ApprovalId = T.Id AND FH.FeedbackID = A.id
		OUTER APPLY(
			SELECT TOP 1 
				(CASE 
					WHEN T.status='Request For Approval' OR T.status='Edited' THEN 'Created'
					WHEN T.status='Approved' THEN 'Approved'
					WHEN T.status='Draft' THEN 'Drafted'
					WHEN T.status='Reject' THEN 'Rejected'
					WHEN T.status='Feedback' THEN 'Awaiting For Reply'
					WHEN T.status='Feedback Reply' THEN 'Feedback Replyed' 
					ELSE T.status END) AS STATUS
			FROM tbl_APIA_Audit_log T WITH(NOLOCK)
			WHERE T.CaseID=O.PartnetOnboading_ID AND T.status IS NOT NULL 
			ORDER BY T.createdDate DESC
		) ST
		OUTER APPLY (
			SELECT 
				COUNT(*) AS ApprovalCount,
				SUM(CASE WHEN TCOUNT.Status = 'Approved' THEN 1 ELSE 0 END) AS ApprovedCount,
				SUM(CASE WHEN TCOUNT.Status = 'Reject' THEN 1 ELSE 0 END) AS RejectCount,
				SUM(CASE WHEN TCOUNT.Status = 'Feedback' THEN 1 ELSE 0 END) AS FeedbackCount,
				SUM(CASE WHEN TCOUNT.Status = 'Feedback Reply' THEN 1 ELSE 0 END) AS FeedbackReplyCount
			FROM tbl_APIA_PO_ApprovalTrailTable TCOUNT WITH (NOLOCK)
			WHERE TCOUNT.CaseId = O.PartnetOnboading_ID
		) TCOUNT
		OUTER APPLY (
			SELECT 
				SUM(CASE WHEN TCOUNT.Status = 'Feedback' THEN 1 ELSE 0 END) AS FeedbackCount,
				SUM(CASE WHEN TCOUNT.Status = 'Feedback Reply' THEN 1 ELSE 0 END) AS FeedbackReplyCount
			FROM tbl_APIA_Audit_log TCOUNT WITH (NOLOCK)
			WHERE TCOUNT.CaseId = O.PartnetOnboading_ID
		) FEEDCOUNT
		WHERE 
			T.ApproverUserID = @ApproverUserID 
			AND T.Status IS NULL 
			AND T.ApproverLevel = @ApproverLevel 
			AND (
				(ApproverLevel = 'FH' AND (T.Status IS NULL OR T.Status = 'Feedback'))
				OR
				( ApproverLevel = 'VH' AND 
					EXISTS ( SELECT 1 FROM tbl_APIA_PO_ApprovalTrailTable T2 
										WHERE T2.CaseID = T.CaseID AND T2.Department = T.Department AND T2.ApproverLevel = 'FH' AND T2.Status IS NOT NULL )
				)
				OR
				(
					ApproverLevel = 'GH' AND 
					EXISTS ( SELECT 1 FROM tbl_APIA_PO_ApprovalTrailTable T3 
										WHERE T3.CaseID = T.CaseID AND T3.Department = T.Department AND T3.ApproverLevel = 'VH' AND T3.Status IS NOT NULL )
				) )
			AND ( (CASE WHEN A.id IS NOT NULL AND FH.FeedbackID IS NOT NULL THEN '1'
					   WHEN A.id IS NULL AND FH.FeedbackID IS NULL THEN '1'
					   ELSE '0' END) = '1' );
	END
	ELSE IF @IdentFlag='GetDepartmentWiseStatus' 
	BEGIN
		WITH Departments AS (
			SELECT 'HOPP' AS Department UNION ALL
			SELECT 'HOB' UNION ALL
			SELECT 'HODB' UNION ALL
			SELECT 'HOISG' UNION ALL
			SELECT 'HOITDRM'
		)
		SELECT d.Department AS Department,COALESCE(s.OverallStatus, 'Pending') AS ApprovalStatus
		FROM Departments d
		LEFT JOIN (
			SELECT Department,
				CASE WHEN COUNT(CASE WHEN status IS NULL THEN 1 END) = COUNT(*) THEN 'Pending'
					 WHEN COUNT(CASE WHEN status = 'Approved' OR status = 'Rejected' THEN 1 END) = COUNT(*) THEN 'Approved'
					 ELSE 'Pending'
				END AS OverallStatus
			FROM tbl_APIA_PO_ApprovalTrailTable
			WHERE CaseId = @PartnetOnboading_ID
			GROUP BY Department
		) AS s
		ON d.Department = s.Department;
	END
	ELSE IF @IdentFlag='SaveAddPartnerApproval' 
	BEGIN
		DECLARE @ApproverUserIDCNT INT=0

		SELECT @PartnetOnboading_ID=TBL.COL.value('CaseID[1]','VARCHAR(100)'),
			   @createdBy=TBL.COL.value('CurrentApproverUserID[1]','VARCHAR(100)')
		from @PartnerXMl.nodes('/PartnerApprovalModel') AS TBL(COL)

		SELECT @ApproverUserIDCNT=COUNT(*) FROM tbl_APIA_PO_ApprovalTrailTable WHERE CaseId=@PartnetOnboading_ID AND ApproverUserID=@createdBy 

		IF @ApproverUserIDCNT>1
		BEGIN
			INSERT INTO tbl_APIA_Audit_log(CaseID,ApprovalID,status,createdBy,createdDate,Feedback)
			SELECT T.CaseId,T.Id AS ApprovalTrialID,
					TBL.COL.value('status[1]','VARCHAR(100)') AS status,
					@createdBy,GETDATE(),
					TBL.COL.value('Feedback[1]','VARCHAR(250)') AS Feedback
					from @PartnerXMl.nodes('/PartnerApprovalModel') AS TBL(COL)
					INNER JOIN tbl_APIA_PO_ApprovalTrailTable T WITH(NOLOCK) ON T.CaseId=@PartnetOnboading_ID AND T.ApproverUserID=@createdBy
			
			INSERT INTO tbl_APIA_Approval_trace_trial(CaseID,ApprovalTrialID,Department,ApprovalLevel,ApprovalUserID,Sequence,Status,Feedback,AssignTo,AssignToLevel,AssignToDept,createdBy,createdDate,UpdatedBy,updatedDate)
			SELECT  T.CaseId,T.Id AS ApprovalTrialID,T.Department AS Department,
					TBL.COL.value('CurrentApproverLevel[1]','VARCHAR(50)') AS ApprovalLevel,
					TBL.COL.value('CurrentApproverUserID[1]','VARCHAR(100)') AS ApprovalUserID,
					TBL.COL.value('CurrentSequence[1]','VARCHAR(100)') AS Sequence,
					TBL.COL.value('status[1]','VARCHAR(100)') AS status,
					TBL.COL.value('Feedback[1]','VARCHAR(250)') AS Feedback,
					--TBL.COL.value('AssignTo[1]','VARCHAR(100)') AS AssignTo,
					AST.ApproverUserID AS AssignTo,
					TBL.COL.value('AssignToLevel[1]','VARCHAR(100)') AS AssignToLevel,
					T.Department AS AssignToDept,
					TBL.COL.value('createdBy[1]','VARCHAR(100)') AS createdBy,
					GETDATE(),
					TBL.COL.value('createdBy[1]','VARCHAR(100)') AS createdBy,
					GETDATE()
					from @PartnerXMl.nodes('/PartnerApprovalModel') AS TBL(COL)
					INNER JOIN tbl_APIA_PO_ApprovalTrailTable T WITH(NOLOCK) ON T.CaseId=@PartnetOnboading_ID AND T.ApproverUserID=@createdBy
					OUTER APPLY(
						SELECT AST.ApproverUserID
						FROM tbl_APIA_PO_ApprovalTrailTable AST WITH(NOLOCK)
						WHERE AST.CaseId=@PartnetOnboading_ID AND AST.Department=T.Department
						AND AST.ApproverLevel=(CASE WHEN TBL.COL.value('CurrentApproverLevel[1]','VARCHAR(50)')='FH' THEN 'VH'
													WHEN TBL.COL.value('CurrentApproverLevel[1]','VARCHAR(50)')='VH' THEN 'GH' END)
					)AST
			
			--SELECT A.Status,x.Status,A.Id,X.createdBy,(CASE WHEN x.Status='Approved' THEN x.Status WHEN x.Status='Reject' THEN x.Status ELSE NULL END)
			UPDATE A
			SET A.Status=(CASE WHEN x.Status='Approved' THEN x.Status WHEN x.Status='Reject' THEN x.Status ELSE NULL END)
			FROM tbl_APIA_PO_ApprovalTrailTable A
			INNER JOIN (
				SELECT TBL.COL.value('CurrentApprovalTrialID[1]','VARCHAR(100)') AS ApprovalTrialID,
					   TBL.COL.value('status[1]','VARCHAR(100)') AS status,
						TBL.COL.value('CaseID[1]','VARCHAR(100)') AS CaseID,
						TBL.COL.value('createdBy[1]','VARCHAR(100)') AS createdBy
				FROM @PartnerXMl.nodes('/PartnerApprovalModel') AS TBL(COL)
			) X
			ON A.CaseId=x.CaseID AND A.ApproverUserID=X.createdBy
		END
		ELSE
		BEGIN
			INSERT INTO tbl_APIA_Audit_log(CaseID,ApprovalID,status,createdBy,createdDate,Feedback)
			SELECT TBL.COL.value('CaseID[1]','VARCHAR(100)') AS CaseID,
					TBL.COL.value('CurrentApprovalTrialID[1]','VARCHAR(100)') AS ApprovalTrialID,
					TBL.COL.value('status[1]','VARCHAR(100)') AS status,
					TBL.COL.value('createdBy[1]','VARCHAR(100)') AS createdBy,
					GETDATE(),
					TBL.COL.value('Feedback[1]','VARCHAR(250)') AS Feedback
					from @PartnerXMl.nodes('/PartnerApprovalModel') AS TBL(COL)

			INSERT INTO tbl_APIA_Approval_trace_trial(CaseID,ApprovalTrialID,Department,ApprovalLevel,ApprovalUserID,Sequence,Status,Feedback,AssignTo,AssignToLevel,AssignToDept,createdBy,createdDate,UpdatedBy,updatedDate)
			SELECT TBL.COL.value('CaseID[1]','VARCHAR(100)') AS CaseID,
					TBL.COL.value('CurrentApprovalTrialID[1]','VARCHAR(100)') AS ApprovalTrialID,
					TBL.COL.value('CurrentDepartment[1]','VARCHAR(100)') AS Department,
					TBL.COL.value('CurrentApproverLevel[1]','VARCHAR(50)') AS ApprovalLevel,
					TBL.COL.value('CurrentApproverUserID[1]','VARCHAR(100)') AS ApprovalUserID,
					TBL.COL.value('CurrentSequence[1]','VARCHAR(100)') AS Sequence,
					TBL.COL.value('status[1]','VARCHAR(100)') AS status,
					TBL.COL.value('Feedback[1]','VARCHAR(250)') AS Feedback,
					TBL.COL.value('AssignTo[1]','VARCHAR(100)') AS AssignTo,
					TBL.COL.value('AssignToLevel[1]','VARCHAR(100)') AS AssignToLevel,
					TBL.COL.value('AssignToDept[1]','VARCHAR(100)') AS AssignToDept,
					TBL.COL.value('createdBy[1]','VARCHAR(100)') AS createdBy,
					GETDATE(),
					TBL.COL.value('createdBy[1]','VARCHAR(100)') AS createdBy,
					GETDATE()
					from @PartnerXMl.nodes('/PartnerApprovalModel') AS TBL(COL)

			UPDATE A
			SET A.Status=(CASE WHEN x.Status='Approved' THEN x.Status WHEN x.Status='Reject' THEN x.Status ELSE NULL END)
			FROM tbl_APIA_PO_ApprovalTrailTable A
			INNER JOIN (
				SELECT TBL.COL.value('CurrentApprovalTrialID[1]','VARCHAR(100)') AS ApprovalTrialID,
					   TBL.COL.value('status[1]','VARCHAR(100)') AS status,
						TBL.COL.value('CaseID[1]','VARCHAR(100)') AS CaseID
				FROM @PartnerXMl.nodes('/PartnerApprovalModel') AS TBL(COL)
			) X
			ON A.Id = X.ApprovalTrialID AND A.CaseId=x.CaseID
		END
	END
	ELSE IF @IdentFlag='FeedbackHistory' 
	BEGIN
		SELECT DISTINCT U.EmpName AS EmpName,(CASE WHEN U1.Role='FH' THEN 'Functional Head'
										  WHEN U1.Role='VH' THEN 'Vertical Head'
										   WHEN U1.Role='GH' THEN 'Group Head'
										  ELSE U1.Role END) AS Role,
		ISNULL(T.Feedback,(CASE WHEN T.Feedback IS NULL AND T.Status='Approved' THEN 'Approved By '+U.EmpName
								WHEN T.Feedback IS NULL AND T.Status='Reject' THEN 'Rejected By '+U.EmpName 
								ELSE T.Feedback END)) AS Feedback_Details,T.Status AS Status,CONVERT(VARCHAR,T.createdDate,103)+' '+CONVERT(VARCHAR,T.createdDate,108) AS Created_Date,T.createdDate
		FROM tbl_APIA_Audit_log T WITH(NOLOCK)
		LEFT JOIN UserMaster U WITH(NOLOCK) ON U.EmpCode=T.createdBy
		LEFT JOIN tbl_API_ADDA_USER U1 WITH(NOLOCK) ON U1.EmpCode=T.createdBy
		WHERE T.CaseID=@PartnetOnboading_ID AND T.createdBy IS NOT NULL
		ORDER BY T.createdDate
	END
	ELSE IF @IdentFlag='GetEditTrailDeatil' 
	BEGIN
		SELECT DISTINCT T.ApproverUserID, T.Sequence, T.Department, T.ApproverLevel,T.Id AS ApprovalTrialID,T1.ApproverUserID +' - '+T1.ApproverName AS ApproverName,T.Status
		FROM tbl_APIA_PO_ApprovalTrailTable T WITH(NOLOCK)
		INNER JOIN tbl_APIA_MstPartnerCaseApprovalMetrix T1 WITH(NOLOCK) ON T1.ApproverUserID=T.ApproverUserID AND T1.ApproverLevel=T.ApproverLevel 
																		 AND T1.ApproverType=(CASE WHEN T.Department='HOB' THEN 'Business'
																								   WHEN T.Department='HODB' THEN 'Digital Banking'
																								   WHEN T.Department='HOISG' THEN 'ISG'
																								   WHEN T.Department='HOITDRM' THEN 'ITDRM'
																								   WHEN T.Department='HOPP' THEN 'Product processor' END)
		INNER JOIN (
			SELECT Department, CaseId FROM tbl_APIA_PO_ApprovalTrailTable WHERE CaseId=@PartnetOnboading_ID --AND ApproverUserID = @ApproverUserID--'M3330'
		) AS Subquery
		ON T.Department = Subquery.Department AND T.CaseId = Subquery.CaseId
		WHERE T.CaseId = @PartnetOnboading_ID --AND T.ApproverUserID = 'M3330'
	END
	ELSE IF @IdentFlag='GetFeedbackDeatil' 
	BEGIN
		SELECT DISTINCT A.ApprovalID,A.Feedback,T.Department,T.ApproverLevel,T.CaseId,A.createdDate,CONVERT(VARCHAR,A.createdDate,103) AS Created_Date,
						U.EmpName AS EmpName,(CASE WHEN U1.Role='FH' THEN 'Functional Head'
												   WHEN U1.Role='VH' THEN 'Vertical Head'
												   WHEN U1.Role='GH' THEN 'Group Head'
												   ELSE U1.Role END) AS Role,
						ISNULL(A.Feedback,(CASE WHEN A.Feedback IS NULL AND A.Status='Approved' THEN 'Approved By '+U.EmpName
												WHEN A.Feedback IS NULL AND A.Status='Reject' THEN 'Rejected By '+U.EmpName 
												ELSE A.Feedback END)) AS Feedback_Details,A.status AS Status,A.createdBy AS FeedbackBy,A1.Feedback_Reply AS FeedbackReply,
												A.id AS FeedbackID
		FROM tbl_APIA_PO_ApprovalTrailTable T WITH(NOLOCK)
		INNER JOIN tbl_APIA_Audit_log A WITH(NOLOCK) ON A.CaseID=T.CaseId AND A.ApprovalID=T.Id AND A.Feedback IS NOT NULL
		LEFT JOIN tbl_APIA_POFeedbackReply_history A1 WITH(NOLOCK) ON A1.CaseID=T.CaseId AND A1.ApprovalID=T.Id AND A1.FeedbackID=A.id
		LEFT JOIN UserMaster U WITH(NOLOCK) ON U.EmpCode=A.createdBy
		LEFT JOIN tbl_API_ADDA_USER U1 WITH(NOLOCK) ON U1.EmpCode=A.createdBy
		WHERE T.CaseId=@PartnetOnboading_ID AND A.status='Feedback'
		ORDER BY A.createdDate
	END
	ELSE IF @IdentFlag='EditPartner' 
	BEGIN
		DECLARE @TrailCount INT=NULL

		SELECT @PartnetOnboading_ID=TBL.COL.value('CaseId[1]','varchar(100)'),
			   @createdBy=TBL.COL.value('(../../createdBy)[1]', 'varchar(100)'),
			   @ApprovalID=TBL.COL.value('ApprovalID[1]','varchar(100)'),
			   @FeedbackID=TBL.COL.value('FeedbackID[1]','Varchar(250)')
		FROM @PartnerXMl.nodes('/PartnerOnboarding/lstPOFeedbackHistory/POFeedbackHistory') AS TBL(COL)
		--WHERE TBL.COL.value('FeedbackAction[1]', 'varchar(100)') = 'New'

		IF @PartnetOnboading_ID IS NULL
		BEGIN
			SELECT @PartnetOnboading_ID=TBL.COL.value('CaseID[1]','varchar(100)'),@createdBy=TBL.COL.value('createdBy[1]','varchar(100)')
			FROM @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)
		END

		SET @TrailCount=(SELECT COUNT(*) AS TrailCount FROM tbl_APIA_PO_ApprovalTrailTable WHERE CaseID = @PartnetOnboading_ID)
		--SET @ActionTaken=(CASE WHEN @TrailCount>1 THEN 'Edited' ELSE 'Created' END )
		SET @ActionTaken='Created'

		IF NOT EXISTS ( SELECT 1 FROM tbl_APIA_POFeedbackReply_history WHERE CaseID = @PartnetOnboading_ID AND ApprovalID = @ApprovalID AND FeedbackID = @FeedbackID )
		BEGIN
			INSERT INTO tbl_APIA_POFeedbackReply_history(CaseID,ApprovalId,Department,approvalLevel,feedbackBy,Role,Status,CreatedBy,CreatedDate,Feedback_Reply,feedbackReplyBy,Feedback,FeedbackID)
			SELECT  TBL.COL.value('CaseId[1]','varchar(100)') AS CaseId,
					TBL.COL.value('ApprovalID[1]','varchar(100)') AS ApprovalID,
					TBL.COL.value('Department[1]','Varchar(100)') AS Department,
					TBL.COL.value('ApproverLevel[1]','Varchar(100)') AS ApproverLevel,
					TBL.COL.value('FeedbackBy[1]', 'varchar(100)') AS feedbackBy,
					TBL.COL.value('Role[1]', 'varchar(100)') AS Role,
					TBL.COL.value('Status[1]', 'varchar(100)') AS Status,
					TBL.COL.value('(../../createdBy)[1]', 'varchar(100)') AS createdBy,
					GETDATE(),
					TBL.COL.value('FeedbackReply[1]', 'varchar(100)') AS FeedbackReply,
					TBL.COL.value('(../../createdBy)[1]', 'varchar(100)') AS feedbackReplyBy,
					TBL.COL.value('Feedback[1]','Varchar(250)') AS Feedback,
					TBL.COL.value('FeedbackID[1]','Varchar(250)') AS FeedbackID
					FROM @PartnerXMl.nodes('/PartnerOnboarding/lstPOFeedbackHistory/POFeedbackHistory') AS TBL(COL)
					--WHERE TBL.COL.value('FeedbackAction[1]', 'varchar(100)') = 'New'

			INSERT INTO tbl_APIA_Audit_log(CaseID,ApprovalID,status,createdBy,createdDate,Feedback)
			SELECT  TBL.COL.value('CaseId[1]','varchar(100)') AS CaseId,
					TBL.COL.value('ApprovalID[1]','varchar(100)') AS ApprovalID,
					'Feedback Reply',
					TBL.COL.value('(../../createdBy)[1]', 'varchar(100)') AS createdBy,
					GETDATE(),
					TBL.COL.value('FeedbackReply[1]', 'varchar(100)') AS Feedback
					FROM @PartnerXMl.nodes('/PartnerOnboarding/lstPOFeedbackHistory/POFeedbackHistory') AS TBL(COL)
					--WHERE TBL.COL.value('FeedbackAction[1]', 'varchar(100)') = 'New'

			UPDATE [tbl_APIA_Partner_Onboarding]
			SET Updated_By=@createdBy,
				Updated_date=GETDATE()
			WHERE PartnetOnboading_ID=@PartnetOnboading_ID
		END

		IF @createdBy IS NOT NULL AND ISNULL(@FeedbackID,'')=''
		BEGIN
			INSERT INTO tbl_APIA_Audit_log(CaseID,ApprovalID,status,createdBy,createdDate)
			SELECT @PartnetOnboading_ID,NULL,@ActionTaken,@createdBy,GETDATE()

			UPDATE [tbl_APIA_Partner_Onboarding]
			SET Updated_By=@createdBy,
				Updated_date=GETDATE()
			WHERE PartnetOnboading_ID=@PartnetOnboading_ID
		END

		/* START EDIT FOR APPROVAL TRAIL TABLE */
		IF NOT EXISTS ( SELECT 1 FROM tbl_APIA_PO_ApprovalTrailTable WHERE CaseID = @PartnetOnboading_ID AND Department ='HOPP' AND ApproverLevel='FH')
		BEGIN
			INSERT INTO tbl_APIA_PO_ApprovalTrailTable(CaseId,Department,ApproverLevel,ApproverUserID,Sequence)
			SELECT @PartnetOnboading_ID,'HOPP','FH',TBL.COL.value('HOPP_FH[1]','varchar(100)') AS HOPP_FH,'1'
			FROM @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)
			WHERE TBL.COL.value('HOPP_FH[1]','varchar(100)') IS NOT NULL
		END
		ELSE
		BEGIN
			UPDATE T
			SET ApproverUserID=TBL.COL.value('HOPP_FH[1]','varchar(100)')
			FROM @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)
			INNER JOIN tbl_APIA_PO_ApprovalTrailTable T WITH(NOLOCK) ON T.CaseId = @PartnetOnboading_ID
			WHERE T.Department ='HOPP' AND T.ApproverLevel='FH' AND T.Status IS NULL AND TBL.COL.value('HOPP_FH[1]','varchar(100)') IS NOT NULL
		END

		IF NOT EXISTS ( SELECT 1 FROM tbl_APIA_PO_ApprovalTrailTable WHERE CaseID = @PartnetOnboading_ID AND Department ='HOPP' AND ApproverLevel='VH')
		BEGIN
			INSERT INTO tbl_APIA_PO_ApprovalTrailTable(CaseId,Department,ApproverLevel,ApproverUserID,Sequence)
			SELECT @PartnetOnboading_ID,'HOPP','VH',TBL.COL.value('HOPP_VH[1]','varchar(100)') AS HOPP_VH,'2'
			FROM @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)
			WHERE TBL.COL.value('HOPP_VH[1]','varchar(100)') IS NOT NULL
		END
		ELSE
		BEGIN
			UPDATE T
			SET ApproverUserID=TBL.COL.value('HOPP_VH[1]','varchar(100)')
			FROM @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)
			INNER JOIN tbl_APIA_PO_ApprovalTrailTable T WITH(NOLOCK) ON T.CaseId = @PartnetOnboading_ID
			WHERE T.Department ='HOPP' AND T.ApproverLevel='VH' AND T.Status IS NULL AND TBL.COL.value('HOPP_VH[1]','varchar(100)') IS NOT NULL
		END

		IF NOT EXISTS ( SELECT 1 FROM tbl_APIA_PO_ApprovalTrailTable WHERE CaseID = @PartnetOnboading_ID AND Department ='HOPP' AND ApproverLevel='GH')
		BEGIN
			INSERT INTO tbl_APIA_PO_ApprovalTrailTable(CaseId,Department,ApproverLevel,ApproverUserID,Sequence)
			SELECT @PartnetOnboading_ID,'HOPP','GH',TBL.COL.value('HOPP_GH[1]','varchar(100)') AS HOPP_GH,'3'
			FROM @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)
			WHERE TBL.COL.value('HOPP_GH[1]','varchar(100)') IS NOT NULL
		END
		ELSE
		BEGIN
			UPDATE T
			SET ApproverUserID=TBL.COL.value('HOPP_GH[1]','varchar(100)')
			FROM @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)
			INNER JOIN tbl_APIA_PO_ApprovalTrailTable T WITH(NOLOCK) ON T.CaseId = @PartnetOnboading_ID
			WHERE T.Department ='HOPP' AND T.ApproverLevel='GH' AND T.Status IS NULL AND TBL.COL.value('HOPP_GH[1]','varchar(100)') IS NOT NULL
		END

		IF NOT EXISTS ( SELECT 1 FROM tbl_APIA_PO_ApprovalTrailTable WHERE CaseID = @PartnetOnboading_ID AND Department ='HOB' AND ApproverLevel='FH')
		BEGIN
			INSERT INTO tbl_APIA_PO_ApprovalTrailTable(CaseId,Department,ApproverLevel,ApproverUserID,Sequence)
			SELECT @PartnetOnboading_ID,'HOB','FH',TBL.COL.value('HOB_FH[1]','varchar(100)') AS HOB_FH,'1'
			FROM @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)
			WHERE TBL.COL.value('HOB_FH[1]','varchar(100)') IS NOT NULL
		END
		ELSE
		BEGIN
			UPDATE T
			SET ApproverUserID=TBL.COL.value('HOB_FH[1]','varchar(100)')
			FROM @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)
			INNER JOIN tbl_APIA_PO_ApprovalTrailTable T WITH(NOLOCK) ON T.CaseId = @PartnetOnboading_ID
			WHERE T.Department ='HOB' AND T.ApproverLevel='FH' AND T.Status IS NULL
		END

		IF NOT EXISTS ( SELECT 1 FROM tbl_APIA_PO_ApprovalTrailTable WHERE CaseID = @PartnetOnboading_ID AND Department ='HOB' AND ApproverLevel='VH')
		BEGIN
			INSERT INTO tbl_APIA_PO_ApprovalTrailTable(CaseId,Department,ApproverLevel,ApproverUserID,Sequence)
			SELECT @PartnetOnboading_ID,'HOB','VH',TBL.COL.value('HOB_VH[1]','varchar(100)') AS HOB_VH,'2'
			FROM @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)
			WHERE TBL.COL.value('HOB_VH[1]','varchar(100)') IS NOT NULL
		END
		ELSE
		BEGIN
			UPDATE T
			SET ApproverUserID=TBL.COL.value('HOB_VH[1]','varchar(100)')
			FROM @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)
			INNER JOIN tbl_APIA_PO_ApprovalTrailTable T WITH(NOLOCK) ON T.CaseId = @PartnetOnboading_ID
			WHERE T.Department ='HOB' AND T.ApproverLevel='VH' AND T.Status IS NULL
		END

		IF NOT EXISTS ( SELECT 1 FROM tbl_APIA_PO_ApprovalTrailTable WHERE CaseID = @PartnetOnboading_ID AND Department ='HOB' AND ApproverLevel='GH')
		BEGIN
			INSERT INTO tbl_APIA_PO_ApprovalTrailTable(CaseId,Department,ApproverLevel,ApproverUserID,Sequence)
			SELECT @PartnetOnboading_ID,'HOB','GH',TBL.COL.value('HOB_GH[1]','varchar(100)') AS HOB_GH,'3'
			FROM @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)
			WHERE TBL.COL.value('HOB_GH[1]','varchar(100)') IS NOT NULL
		END
		ELSE
		BEGIN
			UPDATE T
			SET ApproverUserID=TBL.COL.value('HOB_GH[1]','varchar(100)')
			FROM @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)
			INNER JOIN tbl_APIA_PO_ApprovalTrailTable T WITH(NOLOCK) ON T.CaseId = @PartnetOnboading_ID
			WHERE T.Department ='HOB' AND T.ApproverLevel='GH' AND T.Status IS NULL
		END

		IF NOT EXISTS ( SELECT 1 FROM tbl_APIA_PO_ApprovalTrailTable WHERE CaseID = @PartnetOnboading_ID AND Department ='HODB' AND ApproverLevel='FH')
		BEGIN
			INSERT INTO tbl_APIA_PO_ApprovalTrailTable(CaseId,Department,ApproverLevel,ApproverUserID,Sequence)
			SELECT @PartnetOnboading_ID,'HODB','FH',TBL.COL.value('HODB_FH[1]','varchar(100)') AS HODB_FH,'1'
			FROM @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)
			WHERE TBL.COL.value('HODB_FH[1]','varchar(100)') IS NOT NULL
		END
		ELSE
		BEGIN
			UPDATE T
			SET ApproverUserID=TBL.COL.value('HODB_FH[1]','varchar(100)')
			FROM @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)
			INNER JOIN tbl_APIA_PO_ApprovalTrailTable T WITH(NOLOCK) ON T.CaseId = @PartnetOnboading_ID
			WHERE T.Department ='HODB' AND T.ApproverLevel='FH' AND T.Status IS NULL
		END

		IF NOT EXISTS ( SELECT 1 FROM tbl_APIA_PO_ApprovalTrailTable WHERE CaseID = @PartnetOnboading_ID AND Department ='HODB' AND ApproverLevel='VH')
		BEGIN
			INSERT INTO tbl_APIA_PO_ApprovalTrailTable(CaseId,Department,ApproverLevel,ApproverUserID,Sequence)
			SELECT @PartnetOnboading_ID,'HODB','VH',TBL.COL.value('HODB_VH[1]','varchar(100)') AS HODB_VH,'2'
			FROM @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)
			WHERE TBL.COL.value('HODB_VH[1]','varchar(100)') IS NOT NULL
		END
		ELSE
		BEGIN
			UPDATE T
			SET ApproverUserID=TBL.COL.value('HODB_VH[1]','varchar(100)')
			FROM @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)
			INNER JOIN tbl_APIA_PO_ApprovalTrailTable T WITH(NOLOCK) ON T.CaseId = @PartnetOnboading_ID
			WHERE T.Department ='HODB' AND T.ApproverLevel='VH' AND T.Status IS NULL
		END

		IF NOT EXISTS ( SELECT 1 FROM tbl_APIA_PO_ApprovalTrailTable WHERE CaseID = @PartnetOnboading_ID AND Department ='HODB' AND ApproverLevel='GH')
		BEGIN
			INSERT INTO tbl_APIA_PO_ApprovalTrailTable(CaseId,Department,ApproverLevel,ApproverUserID,Sequence)
			SELECT @PartnetOnboading_ID,'HODB','GH',TBL.COL.value('HODB_GH[1]','varchar(100)') AS HODB_GH,'3'
			FROM @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)
			WHERE TBL.COL.value('HODB_GH[1]','varchar(100)') IS NOT NULL
		END
		ELSE
		BEGIN
			UPDATE T
			SET ApproverUserID=TBL.COL.value('HODB_GH[1]','varchar(100)')
			FROM @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)
			INNER JOIN tbl_APIA_PO_ApprovalTrailTable T WITH(NOLOCK) ON T.CaseId = @PartnetOnboading_ID
			WHERE T.Department ='HODB' AND T.ApproverLevel='GH' AND T.Status IS NULL
		END

		IF NOT EXISTS ( SELECT 1 FROM tbl_APIA_PO_ApprovalTrailTable WHERE CaseID = @PartnetOnboading_ID AND Department ='HOISG' AND ApproverLevel='FH')
		BEGIN
			INSERT INTO tbl_APIA_PO_ApprovalTrailTable(CaseId,Department,ApproverLevel,ApproverUserID,Sequence)
			SELECT @PartnetOnboading_ID,'HOISG','FH',TBL.COL.value('HOISG_FH[1]','varchar(100)') AS HOISG_FH,'1'
			FROM @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)
			WHERE TBL.COL.value('HOISG_FH[1]','varchar(100)') IS NOT NULL
		END
		ELSE
		BEGIN
			UPDATE T
			SET ApproverUserID=TBL.COL.value('HOISG_FH[1]','varchar(100)')
			FROM @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)
			INNER JOIN tbl_APIA_PO_ApprovalTrailTable T WITH(NOLOCK) ON T.CaseId = @PartnetOnboading_ID
			WHERE T.Department ='HOISG' AND T.ApproverLevel='FH' AND T.Status IS NULL
		END

		IF NOT EXISTS ( SELECT 1 FROM tbl_APIA_PO_ApprovalTrailTable WHERE CaseID = @PartnetOnboading_ID AND Department ='HOISG' AND ApproverLevel='VH')
		BEGIN
			INSERT INTO tbl_APIA_PO_ApprovalTrailTable(CaseId,Department,ApproverLevel,ApproverUserID,Sequence)
			SELECT @PartnetOnboading_ID,'HOISG','VH',TBL.COL.value('HOISG_VH[1]','varchar(100)') AS HOISG_VH,'2'
			FROM @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)
			WHERE TBL.COL.value('HOISG_VH[1]','varchar(100)') IS NOT NULL
		END
		ELSE
		BEGIN
			UPDATE T
			SET ApproverUserID=TBL.COL.value('HOISG_VH[1]','varchar(100)')
			FROM @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)
			INNER JOIN tbl_APIA_PO_ApprovalTrailTable T WITH(NOLOCK) ON T.CaseId = @PartnetOnboading_ID
			WHERE T.Department ='HOISG' AND T.ApproverLevel='VH' AND T.Status IS NULL
		END

		IF NOT EXISTS ( SELECT 1 FROM tbl_APIA_PO_ApprovalTrailTable WHERE CaseID = @PartnetOnboading_ID AND Department ='HOISG' AND ApproverLevel='GH')
		BEGIN
			INSERT INTO tbl_APIA_PO_ApprovalTrailTable(CaseId,Department,ApproverLevel,ApproverUserID,Sequence)
			SELECT @PartnetOnboading_ID,'HOISG','GH',TBL.COL.value('HOISG_GH[1]','varchar(100)') AS HOISG_GH,'3'
			FROM @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)
			WHERE TBL.COL.value('HOISG_GH[1]','varchar(100)') IS NOT NULL
		END
		ELSE
		BEGIN
			UPDATE T
			SET ApproverUserID=TBL.COL.value('HOISG_GH[1]','varchar(100)')
			FROM @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)
			INNER JOIN tbl_APIA_PO_ApprovalTrailTable T WITH(NOLOCK) ON T.CaseId = @PartnetOnboading_ID
			WHERE T.Department ='HOISG' AND T.ApproverLevel='GH' AND T.Status IS NULL
		END

		IF NOT EXISTS ( SELECT 1 FROM tbl_APIA_PO_ApprovalTrailTable WHERE CaseID = @PartnetOnboading_ID AND Department ='HOITDRM' AND ApproverLevel='FH')
		BEGIN
			INSERT INTO tbl_APIA_PO_ApprovalTrailTable(CaseId,Department,ApproverLevel,ApproverUserID,Sequence)
			SELECT @PartnetOnboading_ID,'HOITDRM','FH',TBL.COL.value('HOITDRM_FH[1]','varchar(100)') AS HOITDRM_FH,'1'
			FROM @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)
			WHERE TBL.COL.value('HOITDRM_FH[1]','varchar(100)') IS NOT NULL
		END
		ELSE
		BEGIN
			UPDATE T
			SET ApproverUserID=TBL.COL.value('HOITDRM_FH[1]','varchar(100)')
			FROM @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)
			INNER JOIN tbl_APIA_PO_ApprovalTrailTable T WITH(NOLOCK) ON T.CaseId = @PartnetOnboading_ID
			WHERE T.Department ='HOITDRM' AND T.ApproverLevel='FH' AND T.Status IS NULL
		END

		IF NOT EXISTS ( SELECT 1 FROM tbl_APIA_PO_ApprovalTrailTable WHERE CaseID = @PartnetOnboading_ID AND Department ='HOITDRM' AND ApproverLevel='VH')
		BEGIN
			INSERT INTO tbl_APIA_PO_ApprovalTrailTable(CaseId,Department,ApproverLevel,ApproverUserID,Sequence)
			SELECT @PartnetOnboading_ID,'HOITDRM','VH',TBL.COL.value('HOITDRM_VH[1]','varchar(100)') AS HOITDRM_VH,'2'
			FROM @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)
			WHERE TBL.COL.value('HOITDRM_VH[1]','varchar(100)') IS NOT NULL
		END
		ELSE
		BEGIN
			UPDATE T
			SET ApproverUserID=TBL.COL.value('HOITDRM_VH[1]','varchar(100)')
			FROM @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)
			INNER JOIN tbl_APIA_PO_ApprovalTrailTable T WITH(NOLOCK) ON T.CaseId = @PartnetOnboading_ID
			WHERE T.Department ='HOITDRM' AND T.ApproverLevel='VH' AND T.Status IS NULL
		END

		IF NOT EXISTS ( SELECT 1 FROM tbl_APIA_PO_ApprovalTrailTable WHERE CaseID = @PartnetOnboading_ID AND Department ='HOITDRM' AND ApproverLevel='GH')
		BEGIN
			INSERT INTO tbl_APIA_PO_ApprovalTrailTable(CaseId,Department,ApproverLevel,ApproverUserID,Sequence)
			SELECT @PartnetOnboading_ID,'HOITDRM','GH',TBL.COL.value('HOITDRM_GH[1]','varchar(100)') AS HOITDRM_GH,'3'
			FROM @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)
			WHERE TBL.COL.value('HOITDRM_GH[1]','varchar(100)') IS NOT NULL
		END
		ELSE
		BEGIN
			UPDATE T
			SET ApproverUserID=TBL.COL.value('HOITDRM_GH[1]','varchar(100)')
			FROM @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)
			INNER JOIN tbl_APIA_PO_ApprovalTrailTable T WITH(NOLOCK) ON T.CaseId = @PartnetOnboading_ID
			WHERE T.Department ='HOITDRM' AND T.ApproverLevel='GH' AND T.Status IS NULL
		END
		/* END EDIT FOR APPROVAL TRAIL TABLE */
	END
	ELSE IF @IdentFlag='GetFeedbackReply' 
	BEGIN
		SELECT Feedback_Reply AS FeedbackReply FROM tbl_APIA_POFeedbackReply_history WHERE CaseID=@PartnetOnboading_ID AND ApprovalId=@ApproverID
	END
	ELSE IF @IdentFlag='GetMstPartnerType' 
	BEGIN
		SELECT PartnerType,PartnerEntityType,TPRMAapplicable
		FROM TBL_APIA_MstPartnerType
		WHERE PartnerType=@PartnerType
	
	END
	ELSE IF @IdentFlag='SaveFeedbackReply' 
	BEGIN
		SELECT @PartnetOnboading_ID=TBL.COL.value('CaseId[1]','varchar(100)'),
			   @createdBy=TBL.COL.value('createdBy[1]', 'varchar(100)'),
			   @ApprovalID=TBL.COL.value('ApprovalID[1]','varchar(100)'),
			   @FeedbackID=TBL.COL.value('FeedbackID[1]','Varchar(250)')
		FROM @PartnerXMl.nodes('/POFeedbackHistory') AS TBL(COL)

		SET @TrailCount=(SELECT COUNT(*) AS TrailCount FROM tbl_APIA_PO_ApprovalTrailTable WHERE CaseID = @PartnetOnboading_ID)

		IF NOT EXISTS ( SELECT 1 FROM tbl_APIA_POFeedbackReply_history WHERE CaseID = @PartnetOnboading_ID AND ApprovalID = @ApprovalID AND FeedbackID = @FeedbackID )
		BEGIN
			INSERT INTO tbl_APIA_POFeedbackReply_history(CaseID,ApprovalId,Department,approvalLevel,feedbackBy,Role,Status,CreatedBy,CreatedDate,Feedback_Reply,feedbackReplyBy,Feedback,FeedbackID)
			SELECT  TBL.COL.value('CaseId[1]','varchar(100)') AS CaseId,
					TBL.COL.value('ApprovalID[1]','varchar(100)') AS ApprovalID,
					TBL.COL.value('Department[1]','Varchar(100)') AS Department,
					TBL.COL.value('ApproverLevel[1]','Varchar(100)') AS ApproverLevel,
					TBL.COL.value('FeedbackBy[1]', 'varchar(100)') AS feedbackBy,
					TBL.COL.value('Role[1]', 'varchar(100)') AS Role,
					TBL.COL.value('Status[1]', 'varchar(100)') AS Status,
					TBL.COL.value('createdBy[1]', 'varchar(100)') AS createdBy,
					GETDATE(),
					TBL.COL.value('FeedbackReply[1]', 'varchar(100)') AS FeedbackReply,
					TBL.COL.value('createdBy[1]', 'varchar(100)') AS feedbackReplyBy,
					TBL.COL.value('Feedback[1]','Varchar(250)') AS Feedback,
					TBL.COL.value('FeedbackID[1]','Varchar(250)') AS FeedbackID
					FROM @PartnerXMl.nodes('/POFeedbackHistory') AS TBL(COL)
			
			INSERT INTO tbl_APIA_Audit_log(CaseID,ApprovalID,status,createdBy,createdDate,Feedback)
			SELECT  TBL.COL.value('CaseId[1]','varchar(100)') AS CaseId,
					TBL.COL.value('ApprovalID[1]','varchar(100)') AS ApprovalID,
					'Feedback Reply',
					TBL.COL.value('createdBy[1]', 'varchar(100)') AS createdBy,
					GETDATE(),
					TBL.COL.value('FeedbackReply[1]', 'varchar(100)') AS Feedback
					FROM @PartnerXMl.nodes('/POFeedbackHistory') AS TBL(COL)

			UPDATE [tbl_APIA_Partner_Onboarding]
			SET Updated_By=@createdBy,
				Updated_date=GETDATE()
			WHERE PartnetOnboading_ID=@PartnetOnboading_ID
		END
	END
	ELSE IF @IdentFlag='PartnerOffboardingDetails' 
	BEGIN
		SELECT ISNULL(PARTNER_NAME,'') AS PARTNER_NAME,ISNULL(PARTNETONBOADING_ID,'') AS PARTNETONBOADING_ID  FROM [TBL_APIA_PARTNER_ONBOARDING] WITH(NOLOCK)
	END
	ELSE IF @IdentFlag='getPOFapiname' 
	BEGIN
		SELECT ISNULL(APIName,'') AS API_NAME,ISNULL(Id,'') AS APIId,ISNULL(CaseId,'') AS PARTNETONBOADING_ID FROM tbl_APIA_PO_ApiDeatil WITH(NOLOCK)
	END
	ELSE IF @IdentFlag='GetNewIdPOFB'
	BEGIN
		SELECT MAX(ID) AS CaseID FROM tbl_APIA_PartnerOffboardning_getdetails 
	END
	ELSE IF @IdentFlag='DeletePartner'
	BEGIN
		DELETE FROM tbl_APIA_Partner_Onboarding WHERE PartnetOnboading_ID=@PartnetOnboading_ID
		DELETE FROM tbl_APIA_PO_ApiDeatil WHERE CaseId=@PartnetOnboading_ID
		DELETE FROM tbl_APIA_PO_ApprovalTrailTable WHERE CaseId=@PartnetOnboading_ID
		DELETE FROM tbl_APIA_Audit_log WHERE CaseId=@PartnetOnboading_ID
		DELETE FROM tbl_APIA_Approval_trace_trial WHERE CaseId=@PartnetOnboading_ID
		DELETE FROM tbl_APIA_POFeedbackReply_history WHERE CaseId=@PartnetOnboading_ID 
	END
	ELSE IF @IdentFlag='EditPartnerDraft'
	BEGIN
			SELECT @PartnetOnboading_ID=TBL.COL.value('CaseID[1]','varchar(100)'),@createdBy=TBL.COL.value('createdBy[1]','varchar(100)')
			FROM @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)

			SET @ActionTaken='Created'

			INSERT INTO tbl_APIA_Audit_log(CaseID,ApprovalID,status,createdBy,createdDate)
			--SELECT @PartnetOnboading_ID,NULL,@ActionTaken,@createdBy,GETDATE()
			SELECT @PartnetOnboading_ID,NULL,
			TBL.COL.value('Action[1]','VARCHAR(100)') AS Action,@createdBy,GETDATE()
			from @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)

			UPDATE T
			SET T.Partner_Name=ISNULL(TBL.COL.value('PartnerName[1]','varchar(200)'),T.Partner_Name),
				T.Project_Description=ISNULL(TBL.COL.value('projectDescription[1]','varchar(200)'),T.Project_Description),
				T.TentativeGoLive_Date=(CASE WHEN TBL.COL.value('TentativeGoLiveDate[1]','VARCHAR(100)')='0001-01-01T00:00:00' THEN T.TentativeGoLive_Date 
										ELSE TBL.COL.value('TentativeGoLiveDate[1]','DATE') END),
				T.PartnerType=ISNULL(TBL.COL.value('PartnerType[1]','VARCHAR(100)'),T.PartnerType),
				T.PartnerEntityType=ISNULL(TBL.COL.value('PartnerEntityType[1]','VARCHAR(100)'),T.PartnerEntityType),
				T.PartnerTPRM_Application=ISNULL(TBL.COL.value('PartnerTPRMAssesmetApplicability[1]','VARCHAR(100)'),T.PartnerTPRM_Application),
				T.Partnerrisk_score=ISNULL(TBL.COL.value('PartnerRiskScore[1]','VARCHAR(100)'),T.Partnerrisk_score),
				T.Partnerrisk=ISNULL(TBL.COL.value('PartnerRisk[1]','VARCHAR(100)'),T.Partnerrisk),
				T.Updated_By=@createdBy,
				T.Updated_date=GETDATE(),
				T.API_risk=ISNULL(TBL.COL.value('APIRisk[1]','VARCHAR(100)'),T.API_risk),
				T.AttachedJourneyDocuments=ISNULL(TBL.COL.value('AttachedJourneyDocuments[1]','VARCHAR(150)'),T.AttachedJourneyDocuments),
				T.APIRiskAssessment=ISNULL(TBL.COL.value('APIRiskAssessmentSheet[1]','VARCHAR(150)'),T.APIRiskAssessment),
				T.OtherDocument=ISNULL(TBL.COL.value('OtherDocument[1]','VARCHAR(150)'),T.OtherDocument)
			FROM @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)
			INNER JOIN [tbl_APIA_Partner_Onboarding] T ON T.PartnetOnboading_ID=@PartnetOnboading_ID
			WHERE T.PartnetOnboading_ID=@PartnetOnboading_ID

			/* START EDIT FOR APPROVAL TRAIL TABLE */
			IF NOT EXISTS ( SELECT 1 FROM tbl_APIA_PO_ApprovalTrailTable WHERE CaseID = @PartnetOnboading_ID AND Department ='HOPP' AND ApproverLevel='FH')
			BEGIN
				INSERT INTO tbl_APIA_PO_ApprovalTrailTable(CaseId,Department,ApproverLevel,ApproverUserID,Sequence)
				SELECT @PartnetOnboading_ID,'HOPP','FH',TBL.COL.value('HOPP_FH[1]','varchar(100)') AS HOPP_FH,'1'
				FROM @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)
				WHERE ISNULL(TBL.COL.value('HOPP_FH[1]','varchar(100)'),'')<>''
			END
			ELSE
			BEGIN
				UPDATE T
				SET ApproverUserID=TBL.COL.value('HOPP_FH[1]','varchar(100)')
				FROM @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)
				INNER JOIN tbl_APIA_PO_ApprovalTrailTable T WITH(NOLOCK) ON T.CaseId = @PartnetOnboading_ID
				WHERE T.Department ='HOPP' AND T.ApproverLevel='FH' AND T.Status IS NULL AND ISNULL(TBL.COL.value('HOPP_FH[1]','varchar(100)'),'')<>''
			END

			IF NOT EXISTS ( SELECT 1 FROM tbl_APIA_PO_ApprovalTrailTable WHERE CaseID = @PartnetOnboading_ID AND Department ='HOPP' AND ApproverLevel='VH')
			BEGIN
				INSERT INTO tbl_APIA_PO_ApprovalTrailTable(CaseId,Department,ApproverLevel,ApproverUserID,Sequence)
				SELECT @PartnetOnboading_ID,'HOPP','VH',TBL.COL.value('HOPP_VH[1]','varchar(100)') AS HOPP_VH,'2'
				FROM @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)
				WHERE ISNULL(TBL.COL.value('HOPP_VH[1]','varchar(100)'),'')<>''
			END
			ELSE
			BEGIN
				UPDATE T
				SET ApproverUserID=TBL.COL.value('HOPP_VH[1]','varchar(100)')
				FROM @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)
				INNER JOIN tbl_APIA_PO_ApprovalTrailTable T WITH(NOLOCK) ON T.CaseId = @PartnetOnboading_ID
				WHERE T.Department ='HOPP' AND T.ApproverLevel='VH' AND T.Status IS NULL AND ISNULL(TBL.COL.value('HOPP_VH[1]','varchar(100)'),'')<>''
			END

			IF NOT EXISTS ( SELECT 1 FROM tbl_APIA_PO_ApprovalTrailTable WHERE CaseID = @PartnetOnboading_ID AND Department ='HOPP' AND ApproverLevel='GH')
			BEGIN
				INSERT INTO tbl_APIA_PO_ApprovalTrailTable(CaseId,Department,ApproverLevel,ApproverUserID,Sequence)
				SELECT @PartnetOnboading_ID,'HOPP','GH',TBL.COL.value('HOPP_GH[1]','varchar(100)') AS HOPP_GH,'3'
				FROM @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)
				WHERE ISNULL(TBL.COL.value('HOPP_GH[1]','varchar(100)'),'')<>''
			END
			ELSE
			BEGIN
				UPDATE T
				SET ApproverUserID=TBL.COL.value('HOPP_GH[1]','varchar(100)')
				FROM @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)
				INNER JOIN tbl_APIA_PO_ApprovalTrailTable T WITH(NOLOCK) ON T.CaseId = @PartnetOnboading_ID
				WHERE T.Department ='HOPP' AND T.ApproverLevel='GH' AND T.Status IS NULL AND ISNULL(TBL.COL.value('HOPP_GH[1]','varchar(100)'),'')<>''
			END

			IF NOT EXISTS ( SELECT 1 FROM tbl_APIA_PO_ApprovalTrailTable WHERE CaseID = @PartnetOnboading_ID AND Department ='HOB' AND ApproverLevel='FH')
			BEGIN
				INSERT INTO tbl_APIA_PO_ApprovalTrailTable(CaseId,Department,ApproverLevel,ApproverUserID,Sequence)
				SELECT @PartnetOnboading_ID,'HOB','FH',TBL.COL.value('HOB_FH[1]','varchar(100)') AS HOB_FH,'1'
				FROM @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)
				WHERE ISNULL(TBL.COL.value('HOB_FH[1]','varchar(100)'),'')<>''
			END
			ELSE
			BEGIN
				UPDATE T
				SET ApproverUserID=TBL.COL.value('HOB_FH[1]','varchar(100)')
				FROM @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)
				INNER JOIN tbl_APIA_PO_ApprovalTrailTable T WITH(NOLOCK) ON T.CaseId = @PartnetOnboading_ID
				WHERE T.Department ='HOB' AND T.ApproverLevel='FH' AND T.Status IS NULL AND ISNULL(TBL.COL.value('HOB_FH[1]','varchar(100)'),'')<>''
			END

			IF NOT EXISTS ( SELECT 1 FROM tbl_APIA_PO_ApprovalTrailTable WHERE CaseID = @PartnetOnboading_ID AND Department ='HOB' AND ApproverLevel='VH')
			BEGIN
				INSERT INTO tbl_APIA_PO_ApprovalTrailTable(CaseId,Department,ApproverLevel,ApproverUserID,Sequence)
				SELECT @PartnetOnboading_ID,'HOB','VH',TBL.COL.value('HOB_VH[1]','varchar(100)') AS HOB_VH,'2'
				FROM @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)
				WHERE ISNULL(TBL.COL.value('HOB_VH[1]','varchar(100)'),'')<>''
			END
			ELSE
			BEGIN
				UPDATE T
				SET ApproverUserID=TBL.COL.value('HOB_VH[1]','varchar(100)')
				FROM @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)
				INNER JOIN tbl_APIA_PO_ApprovalTrailTable T WITH(NOLOCK) ON T.CaseId = @PartnetOnboading_ID
				WHERE T.Department ='HOB' AND T.ApproverLevel='VH' AND T.Status IS NULL AND ISNULL(TBL.COL.value('HOB_VH[1]','varchar(100)'),'')<>''
			END

			IF NOT EXISTS ( SELECT 1 FROM tbl_APIA_PO_ApprovalTrailTable WHERE CaseID = @PartnetOnboading_ID AND Department ='HOB' AND ApproverLevel='GH')
			BEGIN
				INSERT INTO tbl_APIA_PO_ApprovalTrailTable(CaseId,Department,ApproverLevel,ApproverUserID,Sequence)
				SELECT @PartnetOnboading_ID,'HOB','GH',TBL.COL.value('HOB_GH[1]','varchar(100)') AS HOB_GH,'3'
				FROM @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)
				WHERE ISNULL(TBL.COL.value('HOB_GH[1]','varchar(100)'),'')<>''
			END
			ELSE
			BEGIN
				UPDATE T
				SET ApproverUserID=TBL.COL.value('HOB_GH[1]','varchar(100)')
				FROM @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)
				INNER JOIN tbl_APIA_PO_ApprovalTrailTable T WITH(NOLOCK) ON T.CaseId = @PartnetOnboading_ID
				WHERE T.Department ='HOB' AND T.ApproverLevel='GH' AND T.Status IS NULL AND ISNULL(TBL.COL.value('HOB_GH[1]','varchar(100)'),'')<>''
			END

			IF NOT EXISTS ( SELECT 1 FROM tbl_APIA_PO_ApprovalTrailTable WHERE CaseID = @PartnetOnboading_ID AND Department ='HODB' AND ApproverLevel='FH')
			BEGIN
				INSERT INTO tbl_APIA_PO_ApprovalTrailTable(CaseId,Department,ApproverLevel,ApproverUserID,Sequence)
				SELECT @PartnetOnboading_ID,'HODB','FH',TBL.COL.value('HODB_FH[1]','varchar(100)') AS HODB_FH,'1'
				FROM @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)
				WHERE ISNULL(TBL.COL.value('HODB_FH[1]','varchar(100)'),'')<>''
			END
			ELSE
			BEGIN
				UPDATE T
				SET ApproverUserID=TBL.COL.value('HODB_FH[1]','varchar(100)')
				FROM @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)
				INNER JOIN tbl_APIA_PO_ApprovalTrailTable T WITH(NOLOCK) ON T.CaseId = @PartnetOnboading_ID
				WHERE T.Department ='HODB' AND T.ApproverLevel='FH' AND T.Status IS NULL AND ISNULL(TBL.COL.value('HODB_FH[1]','varchar(100)'),'')<>''
			END

			IF NOT EXISTS ( SELECT 1 FROM tbl_APIA_PO_ApprovalTrailTable WHERE CaseID = @PartnetOnboading_ID AND Department ='HODB' AND ApproverLevel='VH')
			BEGIN
				INSERT INTO tbl_APIA_PO_ApprovalTrailTable(CaseId,Department,ApproverLevel,ApproverUserID,Sequence)
				SELECT @PartnetOnboading_ID,'HODB','VH',TBL.COL.value('HODB_VH[1]','varchar(100)') AS HODB_VH,'2'
				FROM @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)
				WHERE ISNULL(TBL.COL.value('HODB_VH[1]','varchar(100)'),'')<>''
			END
			ELSE
			BEGIN
				UPDATE T
				SET ApproverUserID=TBL.COL.value('HODB_VH[1]','varchar(100)')
				FROM @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)
				INNER JOIN tbl_APIA_PO_ApprovalTrailTable T WITH(NOLOCK) ON T.CaseId = @PartnetOnboading_ID
				WHERE T.Department ='HODB' AND T.ApproverLevel='VH' AND T.Status IS NULL AND ISNULL(TBL.COL.value('HODB_VH[1]','varchar(100)'),'')<>''
			END

			IF NOT EXISTS ( SELECT 1 FROM tbl_APIA_PO_ApprovalTrailTable WHERE CaseID = @PartnetOnboading_ID AND Department ='HODB' AND ApproverLevel='GH')
			BEGIN
				INSERT INTO tbl_APIA_PO_ApprovalTrailTable(CaseId,Department,ApproverLevel,ApproverUserID,Sequence)
				SELECT @PartnetOnboading_ID,'HODB','GH',TBL.COL.value('HODB_GH[1]','varchar(100)') AS HODB_GH,'3'
				FROM @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)
				WHERE ISNULL(TBL.COL.value('HODB_GH[1]','varchar(100)'),'')<>''
			END
			ELSE
			BEGIN
				UPDATE T
				SET ApproverUserID=TBL.COL.value('HODB_GH[1]','varchar(100)')
				FROM @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)
				INNER JOIN tbl_APIA_PO_ApprovalTrailTable T WITH(NOLOCK) ON T.CaseId = @PartnetOnboading_ID
				WHERE T.Department ='HODB' AND T.ApproverLevel='GH' AND T.Status IS NULL AND ISNULL(TBL.COL.value('HODB_GH[1]','varchar(100)'),'')<>''
			END

			IF NOT EXISTS ( SELECT 1 FROM tbl_APIA_PO_ApprovalTrailTable WHERE CaseID = @PartnetOnboading_ID AND Department ='HOISG' AND ApproverLevel='FH')
			BEGIN
				INSERT INTO tbl_APIA_PO_ApprovalTrailTable(CaseId,Department,ApproverLevel,ApproverUserID,Sequence)
				SELECT @PartnetOnboading_ID,'HOISG','FH',TBL.COL.value('HOISG_FH[1]','varchar(100)') AS HOISG_FH,'1'
				FROM @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)
				WHERE ISNULL(TBL.COL.value('HOISG_FH[1]','varchar(100)'),'')<>''
			END
			ELSE
			BEGIN
				UPDATE T
				SET ApproverUserID=TBL.COL.value('HOISG_FH[1]','varchar(100)')
				FROM @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)
				INNER JOIN tbl_APIA_PO_ApprovalTrailTable T WITH(NOLOCK) ON T.CaseId = @PartnetOnboading_ID
				WHERE T.Department ='HOISG' AND T.ApproverLevel='FH' AND T.Status IS NULL AND ISNULL(TBL.COL.value('HOISG_FH[1]','varchar(100)'),'')<>''
			END

			IF NOT EXISTS ( SELECT 1 FROM tbl_APIA_PO_ApprovalTrailTable WHERE CaseID = @PartnetOnboading_ID AND Department ='HOISG' AND ApproverLevel='VH')
			BEGIN
				INSERT INTO tbl_APIA_PO_ApprovalTrailTable(CaseId,Department,ApproverLevel,ApproverUserID,Sequence)
				SELECT @PartnetOnboading_ID,'HOISG','VH',TBL.COL.value('HOISG_VH[1]','varchar(100)') AS HOISG_VH,'2'
				FROM @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)
				WHERE ISNULL(TBL.COL.value('HOISG_VH[1]','varchar(100)'),'')<>''
			END
			ELSE
			BEGIN
				UPDATE T
				SET ApproverUserID=TBL.COL.value('HOISG_VH[1]','varchar(100)')
				FROM @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)
				INNER JOIN tbl_APIA_PO_ApprovalTrailTable T WITH(NOLOCK) ON T.CaseId = @PartnetOnboading_ID
				WHERE T.Department ='HOISG' AND T.ApproverLevel='VH' AND T.Status IS NULL AND ISNULL(TBL.COL.value('HOISG_VH[1]','varchar(100)'),'')<>''
			END

			IF NOT EXISTS ( SELECT 1 FROM tbl_APIA_PO_ApprovalTrailTable WHERE CaseID = @PartnetOnboading_ID AND Department ='HOISG' AND ApproverLevel='GH')
			BEGIN
				INSERT INTO tbl_APIA_PO_ApprovalTrailTable(CaseId,Department,ApproverLevel,ApproverUserID,Sequence)
				SELECT @PartnetOnboading_ID,'HOISG','GH',TBL.COL.value('HOISG_GH[1]','varchar(100)') AS HOISG_GH,'3'
				FROM @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)
				WHERE ISNULL(TBL.COL.value('HOISG_GH[1]','varchar(100)'),'')<>''
			END
			ELSE
			BEGIN
				UPDATE T
				SET ApproverUserID=TBL.COL.value('HOISG_GH[1]','varchar(100)')
				FROM @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)
				INNER JOIN tbl_APIA_PO_ApprovalTrailTable T WITH(NOLOCK) ON T.CaseId = @PartnetOnboading_ID
				WHERE T.Department ='HOISG' AND T.ApproverLevel='GH' AND T.Status IS NULL AND ISNULL(TBL.COL.value('HOISG_GH[1]','varchar(100)'),'')<>''
			END

			IF NOT EXISTS ( SELECT 1 FROM tbl_APIA_PO_ApprovalTrailTable WHERE CaseID = @PartnetOnboading_ID AND Department ='HOITDRM' AND ApproverLevel='FH')
			BEGIN
				INSERT INTO tbl_APIA_PO_ApprovalTrailTable(CaseId,Department,ApproverLevel,ApproverUserID,Sequence)
				SELECT @PartnetOnboading_ID,'HOITDRM','FH',TBL.COL.value('HOITDRM_FH[1]','varchar(100)') AS HOITDRM_FH,'1'
				FROM @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)
				WHERE ISNULL(TBL.COL.value('HOITDRM_FH[1]','varchar(100)'),'')<>''
			END
			ELSE
			BEGIN
				UPDATE T
				SET ApproverUserID=TBL.COL.value('HOITDRM_FH[1]','varchar(100)')
				FROM @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)
				INNER JOIN tbl_APIA_PO_ApprovalTrailTable T WITH(NOLOCK) ON T.CaseId = @PartnetOnboading_ID
				WHERE T.Department ='HOITDRM' AND T.ApproverLevel='FH' AND T.Status IS NULL AND ISNULL(TBL.COL.value('HOITDRM_FH[1]','varchar(100)'),'')<>''
			END

			IF NOT EXISTS ( SELECT 1 FROM tbl_APIA_PO_ApprovalTrailTable WHERE CaseID = @PartnetOnboading_ID AND Department ='HOITDRM' AND ApproverLevel='VH')
			BEGIN
				INSERT INTO tbl_APIA_PO_ApprovalTrailTable(CaseId,Department,ApproverLevel,ApproverUserID,Sequence)
				SELECT @PartnetOnboading_ID,'HOITDRM','VH',TBL.COL.value('HOITDRM_VH[1]','varchar(100)') AS HOITDRM_VH,'2'
				FROM @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)
				WHERE ISNULL(TBL.COL.value('HOITDRM_VH[1]','varchar(100)'),'')<>''
			END
			ELSE
			BEGIN
				UPDATE T
				SET ApproverUserID=TBL.COL.value('HOITDRM_VH[1]','varchar(100)')
				FROM @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)
				INNER JOIN tbl_APIA_PO_ApprovalTrailTable T WITH(NOLOCK) ON T.CaseId = @PartnetOnboading_ID
				WHERE T.Department ='HOITDRM' AND T.ApproverLevel='VH' AND T.Status IS NULL AND ISNULL(TBL.COL.value('HOITDRM_VH[1]','varchar(100)'),'')<>''
			END

			IF NOT EXISTS ( SELECT 1 FROM tbl_APIA_PO_ApprovalTrailTable WHERE CaseID = @PartnetOnboading_ID AND Department ='HOITDRM' AND ApproverLevel='GH')
			BEGIN
				INSERT INTO tbl_APIA_PO_ApprovalTrailTable(CaseId,Department,ApproverLevel,ApproverUserID,Sequence)
				SELECT @PartnetOnboading_ID,'HOITDRM','GH',TBL.COL.value('HOITDRM_GH[1]','varchar(100)') AS HOITDRM_GH,'3'
				FROM @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)
				WHERE ISNULL(TBL.COL.value('HOITDRM_GH[1]','varchar(100)'),'')<>''
			END
			ELSE
			BEGIN
				UPDATE T
				SET ApproverUserID=TBL.COL.value('HOITDRM_GH[1]','varchar(100)')
				FROM @PartnerXMl.nodes('/PartnerOnboarding') AS TBL(COL)
				INNER JOIN tbl_APIA_PO_ApprovalTrailTable T WITH(NOLOCK) ON T.CaseId = @PartnetOnboading_ID
				WHERE T.Department ='HOITDRM' AND T.ApproverLevel='GH' AND T.Status IS NULL AND ISNULL(TBL.COL.value('HOITDRM_GH[1]','varchar(100)'),'')<>''
			END
			/* END EDIT FOR APPROVAL TRAIL TABLE */

			DELETE FROM tbl_APIA_PO_ApiDeatil WHERE CaseId=@PartnetOnboading_ID

			INSERT INTO tbl_APIA_PO_ApiDeatil(CaseId,APIName,APIRisk,APIRiskScore)
			SELECT @PartnetOnboading_ID,TBL.COL.value('APIName[1]','varchar(100)') AS APIName,
			TBL.COL.value('APIRisk[1]','Varchar(100)') AS APIRisk ,
			TBL.COL.value('APIRiskScore[1]','Varchar(100)') AS APIRiskScore
			from @PartnerXMl.nodes('/PartnerOnboarding/lstApiDeatil/ApiDeatil') AS TBL(COL)
	END
	ELSE IF @IdentFlag='GetPartnerSendMailDeatil'
	BEGIN
		IF ISNULL(@PartnetOnboading_ID,'')=''
		BEGIN
			SET @PartnetOnboading_ID=(SELECT MAX(PartnetOnboading_ID) AS PartnetOnboading_ID FROM [tbl_APIA_Partner_Onboarding])
		END
		SELECT DISTINCT TOP 0 'APIGW'+REPLACE(CONVERT(VARCHAR,PO.created_date,3),'/','')+(CASE WHEN LEN(PO.PartnetOnboading_ID)=1 THEN '0000' 
					WHEN LEN(PO.PartnetOnboading_ID)=2 THEN '000' WHEN LEN(PO.PartnetOnboading_ID)=3 THEN '00' WHEN LEN(PO.PartnetOnboading_ID)=4 THEN '0' END)+
					CAST(PO.PartnetOnboading_ID AS VARCHAR) AS PartnetOnboading_ID,PO.PartnetOnboading_ID AS CaseID,
					PO.Partner_Name,
			--ST.STATUS,
			CASE 
				WHEN FEEDCOUNT.FeedbackCount > 0 AND FEEDCOUNT.FeedbackReplyCount > 0 AND FEEDCOUNT.FeedbackCount != FEEDCOUNT.FeedbackReplyCount THEN 'Awaiting For Reply'
				--WHEN TCOUNT.ApprovalCount = 9 AND TCOUNT.ApprovedCount = 9 THEN 'In Progress'
				WHEN TCOUNT.ApprovalCount=TCOUNT.ApprovedCount THEN 'Approved'
				WHEN TCOUNT.RejectCount > 0 THEN 'Reject'
				WHEN TCOUNT.FeedbackCount > 0 AND TCOUNT.FeedbackReplyCount > 0 AND TCOUNT.FeedbackCount = TCOUNT.FeedbackReplyCount THEN 'Feedback'
				WHEN TCOUNT.FeedbackReplyCount < TCOUNT.FeedbackCount THEN 'Feedback Pending'
				WHEN ST.STATUS = 'Drafted' OR ST.STATUS = 'Awaiting For Reply' THEN ST.STATUS -- modify this line
				WHEN TCOUNT.ApprovalCount = 0 THEN 'Created'
				ELSE 'In Progress' 
			END AS StatusDescription,
			ISNULL(PO.created_By, '') AS createdBy,AU.EmailId,
			ISNULL(CONVERT(VARCHAR, PO.created_date, 103), '')+' '+ISNULL(CONVERT(VARCHAR, PO.created_date, 108), '') AS createdDate,TT.ApproverUserID,U.EmpName
		FROM [tbl_APIA_Partner_Onboarding] PO WITH (NOLOCK)
		INNER JOIN tbl_APIA_PO_ApprovalTrailTable TT WITH(NOLOCK) ON TT.CaseId=PO.PartnetOnboading_ID AND TT.Status IS NULL
		INNER JOIN tbl_API_ADDA_USER AU WITH(NOLOCK) ON AU.EmpCode=TT.ApproverUserID
		INNER JOIN UserMaster U WITH(NOLOCK) ON U.EmpCode=TT.ApproverUserID
		OUTER APPLY(
			SELECT TOP 1 
				(CASE 
					WHEN T.status='Request For Approval' OR T.status='Edited' THEN 'Created'
					WHEN T.status='Approved' THEN 'Approved'
					WHEN T.status='Draft' THEN 'Drafted'
					WHEN T.status='Reject' THEN 'Rejected'
					WHEN T.status='Feedback' THEN 'Awaiting For Reply'
					WHEN T.status='Feedback Reply' THEN 'Feedback Replyed' 
					ELSE T.status END) AS STATUS
			FROM tbl_APIA_Audit_log T WITH(NOLOCK)
			WHERE T.CaseID=PO.PartnetOnboading_ID AND T.status IS NOT NULL 
			ORDER BY T.createdDate DESC
		) ST
		OUTER APPLY (
			SELECT 
				COUNT(*) AS ApprovalCount,
				SUM(CASE WHEN TCOUNT.Status = 'Approved' THEN 1 ELSE 0 END) AS ApprovedCount,
				SUM(CASE WHEN TCOUNT.Status = 'Reject' THEN 1 ELSE 0 END) AS RejectCount,
				SUM(CASE WHEN TCOUNT.Status = 'Feedback' THEN 1 ELSE 0 END) AS FeedbackCount,
				SUM(CASE WHEN TCOUNT.Status = 'Feedback Reply' THEN 1 ELSE 0 END) AS FeedbackReplyCount
			FROM tbl_APIA_PO_ApprovalTrailTable TCOUNT WITH (NOLOCK)
			WHERE TCOUNT.CaseId = PO.PartnetOnboading_ID
		) TCOUNT
		OUTER APPLY (
			SELECT 
				SUM(CASE WHEN TCOUNT.Status = 'Feedback' THEN 1 ELSE 0 END) AS FeedbackCount,
				SUM(CASE WHEN TCOUNT.Status = 'Feedback Reply' THEN 1 ELSE 0 END) AS FeedbackReplyCount
			FROM tbl_APIA_Audit_log TCOUNT WITH (NOLOCK)
			WHERE TCOUNT.CaseId = PO.PartnetOnboading_ID
		) FEEDCOUNT
		LEFT JOIN TBL_API_statusMaster SM WITH (NOLOCK) ON SM.statusCode = ISNULL(PO.statusCode, '1')
		WHERE ST.STATUS IS NOT NULL AND PO.PartnetOnboading_ID=@PartnetOnboading_ID
	END
	ELSE IF @IdentFlag='GetPartnerSendMailDeatilForScheduler'
	BEGIN
		SELECT DISTINCT TOP 0 /*DATEDIFF(HOUR,PO.created_date,GETDATE()),*/'APIGW'+REPLACE(CONVERT(VARCHAR,PO.created_date,3),'/','')+(CASE WHEN LEN(PO.PartnetOnboading_ID)=1 THEN '0000' 
					WHEN LEN(PO.PartnetOnboading_ID)=2 THEN '000' WHEN LEN(PO.PartnetOnboading_ID)=3 THEN '00' WHEN LEN(PO.PartnetOnboading_ID)=4 THEN '0' END)+
					CAST(PO.PartnetOnboading_ID AS VARCHAR) AS PartnetOnboading_ID,PO.PartnetOnboading_ID AS CaseID,
					PO.Partner_Name,
			--ST.STATUS,
			CASE 
				WHEN FEEDCOUNT.FeedbackCount > 0 AND FEEDCOUNT.FeedbackReplyCount > 0 AND FEEDCOUNT.FeedbackCount != FEEDCOUNT.FeedbackReplyCount THEN 'Awaiting For Reply'
				--WHEN TCOUNT.ApprovalCount = 9 AND TCOUNT.ApprovedCount = 9 THEN 'In Progress'
				WHEN TCOUNT.ApprovalCount=TCOUNT.ApprovedCount THEN 'Approved'
				WHEN TCOUNT.RejectCount > 0 THEN 'Reject'
				WHEN TCOUNT.FeedbackCount > 0 AND TCOUNT.FeedbackReplyCount > 0 AND TCOUNT.FeedbackCount = TCOUNT.FeedbackReplyCount THEN 'Feedback'
				WHEN TCOUNT.FeedbackReplyCount < TCOUNT.FeedbackCount THEN 'Feedback Pending'
				WHEN ST.STATUS = 'Drafted' OR ST.STATUS = 'Awaiting For Reply' THEN ST.STATUS -- modify this line
				WHEN TCOUNT.ApprovalCount = 0 THEN 'Created'
				ELSE 'In Progress' 
			END AS StatusDescription,
			ISNULL(PO.created_By, '') AS createdBy,AU.EmailId,
			ISNULL(CONVERT(VARCHAR, PO.created_date, 103), '')+' '+ISNULL(CONVERT(VARCHAR, PO.created_date, 108), '') AS createdDate,TT.ApproverUserID,U.EmpName
		FROM [tbl_APIA_Partner_Onboarding] PO WITH (NOLOCK)
		INNER JOIN tbl_APIA_PO_ApprovalTrailTable TT WITH(NOLOCK) ON TT.CaseId=PO.PartnetOnboading_ID AND TT.Status IS NULL
		INNER JOIN tbl_API_ADDA_USER AU WITH(NOLOCK) ON AU.EmpCode=TT.ApproverUserID
		INNER JOIN UserMaster U WITH(NOLOCK) ON U.EmpCode=TT.ApproverUserID
		OUTER APPLY(
			SELECT TOP 1 
				(CASE 
					WHEN T.status='Request For Approval' OR T.status='Edited' THEN 'Created'
					WHEN T.status='Approved' THEN 'Approved'
					WHEN T.status='Draft' THEN 'Drafted'
					WHEN T.status='Reject' THEN 'Rejected'
					WHEN T.status='Feedback' THEN 'Awaiting For Reply'
					WHEN T.status='Feedback Reply' THEN 'Feedback Replyed' 
					ELSE T.status END) AS STATUS
			FROM tbl_APIA_Audit_log T WITH(NOLOCK)
			WHERE T.CaseID=PO.PartnetOnboading_ID AND T.status IS NOT NULL 
			ORDER BY T.createdDate DESC
		) ST
		OUTER APPLY (
			SELECT 
				COUNT(*) AS ApprovalCount,
				SUM(CASE WHEN TCOUNT.Status = 'Approved' THEN 1 ELSE 0 END) AS ApprovedCount,
				SUM(CASE WHEN TCOUNT.Status = 'Reject' THEN 1 ELSE 0 END) AS RejectCount,
				SUM(CASE WHEN TCOUNT.Status = 'Feedback' THEN 1 ELSE 0 END) AS FeedbackCount,
				SUM(CASE WHEN TCOUNT.Status = 'Feedback Reply' THEN 1 ELSE 0 END) AS FeedbackReplyCount
			FROM tbl_APIA_PO_ApprovalTrailTable TCOUNT WITH (NOLOCK)
			WHERE TCOUNT.CaseId = PO.PartnetOnboading_ID
		) TCOUNT
		OUTER APPLY (
			SELECT 
				SUM(CASE WHEN TCOUNT.Status = 'Feedback' THEN 1 ELSE 0 END) AS FeedbackCount,
				SUM(CASE WHEN TCOUNT.Status = 'Feedback Reply' THEN 1 ELSE 0 END) AS FeedbackReplyCount
			FROM tbl_APIA_Audit_log TCOUNT WITH (NOLOCK)
			WHERE TCOUNT.CaseId = PO.PartnetOnboading_ID
		) FEEDCOUNT
		LEFT JOIN TBL_API_statusMaster SM WITH (NOLOCK) ON SM.statusCode = ISNULL(PO.statusCode, '1')
		WHERE PO.created_date>'2023-11-08 00:00:00.000' AND
		DATEDIFF(HOUR,PO.created_date,GETDATE())>24 AND ST.STATUS IS NOT NULL --AND PO.PartnetOnboading_ID=101
		AND (CASE WHEN TCOUNT.RejectCount > 0 THEN 'N' 
				  WHEN TCOUNT.ApprovalCount=TCOUNT.ApprovedCount THEN 'N'
				  ELSE 'Y' END)='Y'
		ORDER BY/* StatusDescription,*/ PO.PartnetOnboading_ID DESC
	END
END
GO
/****** Object:  StoredProcedure [dbo].[USP_Insert_Data_In_Activity_Log_Tracker_API_Adda]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE Procedure [dbo].[USP_Insert_Data_In_Activity_Log_Tracker_API_Adda] 
@Emp_Code Varchar(50)=null,
@Form_Name Varchar(50),
@Module_Name Varchar(50),
@Total_Count INT,
@Activity varchar(50),
@Activity_Details varchar(100)
AS
BEGIN
INSERT INTO [dbo].[tbl_API_Adda_Activity_Log_Tracker]
           ([Emp_Code]
           ,[Form_Name]
           ,[Module_Name]
           ,[Total_Count]
           ,[Activity]
           ,[Activity_Details]
		   ,Activity_Date
           )
     VALUES
	       (@Emp_Code
		   ,@Form_Name
		   ,@Module_Name
		   ,@Total_Count
		   ,@Activity
		   ,@Activity_Details
		   ,getdate()
		   )
	  
END
GO
/****** Object:  StoredProcedure [dbo].[usp_TPMS_Dealer_API]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
  
-- exec usp_TPMS_Dealer_API 'DealerMenu'   
-- exec usp_TPMS_Dealer_API 'TotalVisits','','','','33076'  
-- exec usp_TPMS_Dealer_API 'LUserInfo' ,'A5324','ASM'  
-- exec usp_TPMS_Dealer_API 'DealerInfo' ,'','','','9'  
-- exec usp_TPMS_Dealer_API 'TotalDealers' ,'B8963','RM','TRACTOR',''  

CREATE PROCEDURE [dbo].[usp_TPMS_Dealer_API]  
@flag as nvarchar(50),  
@LUserID varchar(20)=NULL,                    
@LUserRole varchar(50)=NULL,           
@BusinessCode varchar(20)=NULL,  
@DealerID varchar(20)=null   
  
AS  
BEGIN  
declare @strSQL as nvarchar(max)=null, @strSQL1 as nvarchar(200)=null, @strSQL2 as nvarchar(300)=null,@strSQL4 as nvarchar(500) =null;          
declare @BusinessID int=0   
  
set @BusinessID =(select  BusinessID from tbl_PMS_BusinessMaster where BuinessCode=@BusinessCode)    
  
if @flag='DealerMenu'  
Begin  
 Select DealersMenu= JSON_QUERY((Select MenuID,MenuName from tbl_PMS_Dealer_MenuMaster where IsActive=1 order by MenuName for json path ))   
  for json path , without_array_wrapper  
End  
Else if @flag='TotalDealers'  
Begin  
 IF @LUserRole='RM'           
 BEGIN          
  Set @strSQL1=' '          
  Set @strSQL2='   inner join tbl_PMS_Dealer_DropdownMaster DDM on DDM.ID=B.DealerStatus  where A.RMcode='''+ @LUserID +''''          
        
 END          
 ELSE          
 BEGIN          
  Set @strSQL1=' inner join '+ (Select top(1) HierarchyTableName from tbl_PMS_Business_Hierarchy where BusinessCode=@BusinessCode and Isactive=1) +'  HR on HR.RM=A.RMcode '          
  Set @strSQL2='    inner join tbl_PMS_Dealer_DropdownMaster DDM on DDM.ID=B.DealerStatus   where HR.'+ @LUserRole +'='''+ @LUserID +''''          
    
 END    
  
    
Set @strSQL =' Select DealersCount= JSON_QUERY((select Count(distinct B.DealerID) as [DealerCount] from tbl_PMS_Dealer_RM_Mapping A    
  inner join  tbl_PMS_DealerMaster B on A.DealerID=B.DealerID and B.BusinessID='+cast(@BusinessID as varchar)+'       
  '+ @strSQL1 + @strSQL2 +' and A.isActive=1 for json path )) for json path , without_array_wrapper'    
  exec (@strSQL)
  -- print (@strSQL)
End  
Else if @flag='VisitTrail'  
Begin  
 Select TotalVisit= JSON_QUERY((Select Count(distinct DealerVisitID) as [TotalVisit]  
 from tbl_PMS_Dealer_VisitDetails VD   
 inner join tbl_PMS_Dealer_DropdownMaster VisitType on VD.VisitType=VisitType.ID   
 left join tbl_PMS_Dealer_DropdownMaster TravelledBy on VD.TravelledBy=TravelledBy.ID   
 where VD.DealerID =@DealerID for json path ))  for json path , without_array_wrapper  
End  
Else if @flag='TotalVisits'  
Begin  
 Select TotalVisit= JSON_QUERY((Select Count(distinct DealerVisitID) as [TotalVisit]  
 from tbl_PMS_Dealer_VisitDetails VD   
 inner join tbl_PMS_Dealer_DropdownMaster VisitType on VD.VisitType=VisitType.ID   
 left join tbl_PMS_Dealer_DropdownMaster TravelledBy on VD.TravelledBy=TravelledBy.ID   
 where VD.DealerID =@DealerID for json path )) ,  
 DealerInfo= JSON_QUERY((Select distinct DealerID,DM.DealerCode, DM.DealerName as [DealerName],(DM.DealerCode + ' - ' + DealerName) as [DealerCodeName],DM.Location as [Location], DM.MobileNo   
 from tbl_PMS_DealerMaster DM where DealerID=@DealerID for json path )),  
 VisitHistory= JSON_QUERY(( select top(5) VD.DealerVisitID,VisitType.DropdownValue as VisitType ,isnull(TravelledBy.DropdownValue,'') as TravelledBy,vd.DistanceKm as Distance
 , VD.Remarks as Discussion,VD.ActualVisitDate, VD.NextVisitDate ,VD.CreatedBy,  
 isnull(stuff ((Select ', ' +  SUBSTRING(EmpName,CHARINDEX('(',EmpName)+1,(LEN(EmpName)-CHARINDEX('(',EmpName))-1) from tbl_PMS_Dealer_EmpDetails 
 where DealerVisitID=70 order by EmpName FOR XML PATH ('')), 1, 2, ''),'') as [VisitMembers]   
 from tbl_PMS_Dealer_VisitDetails VD   
 inner join tbl_PMS_Dealer_DropdownMaster VisitType on VD.VisitType=VisitType.ID   
 left join tbl_PMS_Dealer_DropdownMaster TravelledBy on VD.TravelledBy=TravelledBy.ID   
 where VD.DealerID =@DealerID order by CreatedOn desc 
 for json path )) for json path , without_array_wrapper  
  
End  
Else if @flag='LUserInfo'  
Begin  
Select UserInfo= JSON_QUERY((Select EmpName, EmpDesignation,SupervisorEmpCode,[Supervisor Role] as [SupervisorRole]   
from tbl_PMS_Hierarchy_Master where EmpCode=@LUserID and EmpDesignation =@LUserRole for json path ))  for json path , without_array_wrapper  
End  
  
END  
  

 
GO
/****** Object:  StoredProcedure [dbo].[Usp_TPMS_GetAPI_Link]    Script Date: 21-09-2024 20:42:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- exec Usp_TPMS_GetAPI_Link 'UAT'
CREATE proc [dbo].[Usp_TPMS_GetAPI_Link]
@API_Type varchar(50) =null
as 
Begin

select apilink = JSON_QUERY(( select APILink as APILink from tbl_PMS_APIDetails where APIType =@API_Type and Module='Campaign Visit - API' for json path )),
	apilinkTest = JSON_QUERY(( select APILink as apilinkTest from tbl_PMS_APIDetails where APIType =@API_Type and Module='Campaign Visit - API Test' for json path )),
		PMS = Json_query(( select APILink as APILink from tbl_PMS_APIDetails where APIType =@API_Type and Module='PMS' for json path )) for json path,without_array_wrapper;
End
GO
USE [master]
GO
ALTER DATABASE [Hunt] SET  READ_WRITE 
GO
