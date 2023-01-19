using App_Resources;
using EmployeeRequest.Infrastracture.BaseClasses;
using EmployeeRequest.Infrastracture.Enums;
using EmployeeRequest.Repository.Dashboard;
using EmployeeRequest.SpClasses;
using EmployeeRequest.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace EmployeeRequest.Controllers
{
    public class ShareholderWatchController : BaseController
    {
        [HttpPost]
        public virtual ActionResult GetMineAllShareholderWatches()
        {
            var currentUser = (LoginResultModel)Session["LoginResult"];
            var result = ShareholderWatchRepository.GetAllShareholderWatches().Where(t=>t.UserId == currentUser.Id).ToList();

            if (result == null)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);

            if (result.Count > 20000)
                return Json(ResponseType.Failed, MessagesLibrary.NumberOfRecoveredRowIsMoreThanAllowed);

            var outFile = new
            {
                ResponseType = ResponseType.Ok,
                Message = MessagesLibrary.OperationSuccessed,
                result = result.Select(t => new { t.Id, t.UserId, Fullname = t.USER.Name + " " + t.USER.Family, t.WatchList, t.IsDefault,IsDefaultDesc = t.IsDefault == true ? CaptionsLibrary.Yes : CaptionsLibrary.No, t.IsPublic, IsPublicDesc = t.IsPublic == true ? CaptionsLibrary.Yes : CaptionsLibrary.No, t.Desc1, t.Title })
            };

            var output = new JsonResult();
            output.Data = outFile;
            output.MaxJsonLength = int.MaxValue;
            return output;
        }

        [HttpPost]
        public virtual ActionResult AddShareholderWatch(string title, string desc, bool isDefault, bool isPublic, List<string> shareholderCodeList)
        {
            var currentUser = (LoginResultModel)Session["LoginResult"];

            if (title == null || shareholderCodeList == null)
                return Json(ResponseType.Warning, MessagesLibrary.PleaseCompeletTheField);

            if (isDefault == true)
            {
                var myWatchList = ShareholderWatchRepository.GetAllShareholderWatches().Where(t => t.UserId == currentUser.Id).ToList();
                foreach (ShareholderWatch item in myWatchList)
                {
                    item.IsDefault = false;
                    ShareholderWatchRepository.ModifyShareholderWatch(item);
                }
            }

            var shareholderWatch = new ShareholderWatch
            {
                Id = 0,
                UserId = currentUser.Id,
                Title = title,
                Desc1 = desc,
                IsDefault = isDefault,
                IsPublic = isPublic,
                WatchList = String.Join(",", shareholderCodeList),
                PersistOnDate = DateTime.Now
            };

            var result = ShareholderWatchRepository.AddShareholderWatch(shareholderWatch);
            if (!result)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
            return Json(ResponseType.Ok, MessagesLibrary.OperationSuccessed);
        }

        [HttpPost]
        public virtual ActionResult removeShareholderWatch(decimal id)
        {
            var shareholderWatch = new ShareholderWatch
            {
                Id = id
            };
            var result = ShareholderWatchRepository.RemoveShareholderWatch(shareholderWatch);
            if (!result)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
            return Json(ResponseType.Ok, MessagesLibrary.OperationSuccessed);
        }

        [HttpPost]
        public virtual ActionResult modifyShareholderWatch(decimal id,string title, string desc, bool isDefault, bool isPublic, List<string> shareholderCodeList)
        {
            var currentUser = (LoginResultModel)Session["LoginResult"];

            if (title == null || shareholderCodeList == null)
                return Json(ResponseType.Warning, MessagesLibrary.PleaseCompeletTheField);

            if (isDefault == true)
            {
                var myWatchList = ShareholderWatchRepository.GetAllShareholderWatches().Where(t => t.UserId == currentUser.Id).ToList();
                foreach (ShareholderWatch item in myWatchList)
                {
                    item.IsDefault = false;
                    ShareholderWatchRepository.ModifyShareholderWatch(item);
                }
            }

            var shareholderWatch = new ShareholderWatch
            {
                Id = id,
                UserId = currentUser.Id,
                Title = title,
                Desc1 = desc,
                IsDefault = isDefault,
                IsPublic = isPublic,
                WatchList = String.Join(",", shareholderCodeList),
                PersistOnDate = DateTime.Now
            };
            var result = ShareholderWatchRepository.ModifyShareholderWatch(shareholderWatch);
            if (!result)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
            return Json(ResponseType.Ok, MessagesLibrary.OperationSuccessed);
        }
    }
}