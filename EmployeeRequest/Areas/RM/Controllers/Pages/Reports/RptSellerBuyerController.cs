using App_Resources;
using EmployeeRequest.Infrastracture.BaseClasses;
using EmployeeRequest.Infrastracture.Enums;
using EmployeeRequest.Infrastracture.Helpers;
using EmployeeRequest.SpClasses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace EmployeeRequest.Areas.RM.Controllers.Pages.Reports
{
    public class RptSellerBuyerController : BaseController
    {
        [HttpPost]
        public virtual ActionResult GetSpShrRptSellerBuyer(List<decimal> watchShareholderIds,string dateS, string dateE, string dateSBuy, string dateEBuy, string shrhKind, string shareQuntType, string averageFeeType, string shareCountType, int? sellQnt, int? buyQnt)
        {
            var shrhCodeList = ShareholderWatchHelper.GetShrhCodeListFromWatchList(watchShareholderIds);

            string shrhCodeStringList = shrhCodeList != null ? string.Join(",", shrhCodeList) : "";

            var result = ReportHelper.GetSpShrSellerBuyerDashboard(shrhCodeStringList, dateS.Replace("/", ""), dateE.Replace("/", ""), dateSBuy.Replace("/", ""), dateEBuy.Replace("/", ""), shrhKind, shareQuntType, averageFeeType, shareCountType, sellQnt, buyQnt);

            if (result == null)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);

            if (result.Count > 20000)
                return Json(ResponseType.Failed, MessagesLibrary.NumberOfRecoveredRowIsMoreThanAllowed);

            var outFile = new
            {
                ResponseType = ResponseType.Ok,
                Message = MessagesLibrary.OperationSuccessed,
                result
            };


            var output = new JsonResult();
            output.Data = outFile;
            output.MaxJsonLength = int.MaxValue;
            return output;
        }
    }
}