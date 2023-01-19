using App_Resources;
using EmployeeRequest.Infrastracture.BaseClasses;
using EmployeeRequest.Infrastracture.Config;
using EmployeeRequest.Infrastracture.Enums;
using EmployeeRequest.Infrastracture.Helpers;
using EmployeeRequest.Repository;
using EmployeeRequest.Repository.Dashboard;
using EmployeeRequest.SpClasses;
using EmployeeRequest.ViewModel;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace EmployeeRequest.Areas.RM.Controllers.Shared
{
    public class SharedController : BaseController
    {
        //[HttpPost]
        //public virtual ActionResult GetCompanyName()
        //{
        //    var result = "شرکت رادین انفورماتیک";
        //    return Json(result);
        //}

        [HttpPost]
        public virtual ActionResult GetAppSettingKeyForLogin()
        {
            bool showPasswordInLoginState = AppSetting.GetShowPasswordInLoginState();
            bool showRememberMeInLoginState = AppSetting.GetShowRememberMeInLoginState();
            var result = new
            {
                showPasswordInLoginState,
                showRememberMeInLoginState
            };
            return Json(result);
        }

        [HttpPost]
        public virtual ActionResult GetIsAutomaticLoadChartData()
        {
            bool isAutomaticLoadChartData = AppSetting.GetIsAutomaticLoadChartData();
            var result = new
            {
                isAutomaticLoadChartData
            };
            return Json(result);
        }

        [HttpPost]
        public virtual ActionResult GetVersion()
        {
            System.Reflection.Assembly assembly = System.Reflection.Assembly.GetExecutingAssembly();
            FileVersionInfo fvi = FileVersionInfo.GetVersionInfo(assembly.Location);
            string result = fvi.FileVersion;
            return Json(result);
        }

        [HttpPost]
        public virtual ActionResult CheckShrhCodeValidity(string shrhCode)
        {
            var result = ShareholerRepository.CheckShrhCodeValidity(shrhCode);

            var output = new JsonResult();
            output.Data = result ? shrhCode : "";
            output.MaxJsonLength = int.MaxValue;
            return output;
        }

        [HttpPost]
        public virtual ActionResult GetShareholderWatchInformation()
        {
            var currentUser = (LoginResultModel)Session["LoginResult"];
            var lastReadDateOfBBS = ShrTransactionRepository.GetLastReadDateOfBBS();
            var shrhCodeListItem = ShareholderWatchRepository.GetAllShareholderWatches().Where(t => t.UserId == currentUser.Id && t.IsDefault == true).FirstOrDefault();
            var shrhCodeList = shrhCodeListItem != null ? shrhCodeListItem.WatchList.Split(',').ToList() : null;

            var result = ShareholerRepository.GetShareholderWatchInformation(shrhCodeList, lastReadDateOfBBS);

            var output = new JsonResult();
            output.Data = result;
            output.MaxJsonLength = int.MaxValue;
            return output;
        }

        //[HttpPost]
        //public virtual ActionResult GetShareholder()
        //{
        //    var shareholderItem = ShareholerRepository.GetShareholder("100004");
        //    var report = new Stimulsoft.Report.StiReport();
        //    report.LoadFromUrl("~/reports/test2.mrt");
        //    report.RegData("Demo", shareholderItem);
        //}

        [HttpPost]
        public virtual ActionResult GetAllFinYearWithDetail()
        {
            var result = FilterHelper.GetAllFinYearWithDetail().Select(t => new { t.FIN_YEAR_CODE, START_DATE = DateTimeHelper.ToPersianFormat(t.START_DATE), END_DATE = DateTimeHelper.ToPersianFormat(t.END_DATE) }).ToList();

            if (result == null)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
            var output = new JsonResult();
            output.Data = result;
            output.MaxJsonLength = int.MaxValue;
            return output;
        }

        [HttpPost]
        public virtual ActionResult GetSystemStatusData()
        {
            var systemStatusModel = (SystemStatusModel)Session["SystemStatusModel"];
            SystemStatusModel result;
            if (systemStatusModel == null || systemStatusModel.CurrentDate != DateTimeHelper.ToPersianDate(DateTime.Now))
            {
                var tblDate = ShrTransactionRepository.GetLastReadDateOfBBS();
                var sumOfShares = ViewRepository.GetSumOfAllShares();
                var countOfActiveShareholder = ViewRepository.GetCountOfActiveShareholder();
                var formatedTblDate = DateTimeHelper.ToPersianFormat(tblDate);
                var currentDate = DateTimeHelper.ToPersianDate(DateTime.Now);
                var finalFee = ReportHelper.GetSpShrTeloranceDashboard(tblDate, tblDate, null, null).FirstOrDefault().final_fee;


                result = new SystemStatusModel
                {
                    CurrentDate = currentDate,
                    TblDate = formatedTblDate,
                    SumOfShares = sumOfShares,
                    CountOfActiveShareholder = countOfActiveShareholder,
                    FinalFee = finalFee
                };

                Session.Add("SystemStatusModel", result);
            }
            else
            {
                result = (SystemStatusModel)Session["SystemStatusModel"];
            }          

            if (result == null)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
            var output = new JsonResult();
            output.Data = result;
            output.MaxJsonLength = int.MaxValue;
            return output;
        }

        [HttpPost]
        public virtual ActionResult GetMineAndPublicShareholderWatches()
        {
            var currentUser = (LoginResultModel)Session["LoginResult"];
            var result = ShareholderWatchRepository.GetAllShareholderWatches().Where(t => t.IsPublic == true || t.UserId == currentUser.Id).ToList();

            if (result == null)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);

            if (result.Count > 20000)
                return Json(ResponseType.Failed, MessagesLibrary.NumberOfRecoveredRowIsMoreThanAllowed);

            var outFile = new
            {
                ResponseType = ResponseType.Ok,
                Message = MessagesLibrary.OperationSuccessed,
                result = result.Select(t => new { t.Id, t.UserId, Fullname = t.USER.Name + " " + t.USER.Family, t.Desc1, t.Title, Group = t.UserId == currentUser.Id ? CaptionsLibrary.Mine : CaptionsLibrary.Others })
            };

            var output = new JsonResult();
            output.Data = outFile;
            output.MaxJsonLength = int.MaxValue;
            return output;
        }

        [HttpPost]
        public virtual ActionResult GetShareholderWatchesInformation(List<decimal> watchShareholderIds)
        {
            var lastReadDateOfBBS = ShrTransactionRepository.GetLastReadDateOfBBS();
            var shrhCodeList = ShareholderWatchHelper.GetShrhCodeListFromWatchList(watchShareholderIds);
            var result = ShareholerRepository.GetShareholderWatchInformation(shrhCodeList, lastReadDateOfBBS);

            var output = new JsonResult();
            output.Data = result;
            output.MaxJsonLength = int.MaxValue;
            return output;
        }

        [HttpPost]
        public virtual ActionResult AddShareholderToSelectedWatches(List<decimal> watchShareholderIds, string shrhCode)
        {
            foreach (decimal item in watchShareholderIds)
            {
                var currentUser = (LoginResultModel)Session["LoginResult"];
                var shareholderWatch = ShareholderWatchRepository.GetShareholderWatch(item);

                if(shareholderWatch.UserId != currentUser.Id)
                {
                    return Json(ResponseType.Warning, MessagesLibrary.YouDontHavePermissionToModifyOthersWatch);
                }

                var watchList = shareholderWatch.WatchList.Split(',').ToList();
                if (!watchList.Contains(shrhCode))
                {
                    watchList.Add(shrhCode);
                    shareholderWatch.WatchList = String.Join(",", watchList);
                    shareholderWatch.PersistOnDate = DateTime.Now;
                    ShareholderWatchRepository.ModifyShareholderWatch(shareholderWatch);
                }
            };

            return Json(ResponseType.Ok, MessagesLibrary.OperationSuccessed);
        }
    }
}