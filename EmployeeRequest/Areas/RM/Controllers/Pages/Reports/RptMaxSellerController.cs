using App_Resources;
using EmployeeRequest.Infrastracture.Enums;
using EmployeeRequest.Infrastracture.Helpers;
using EmployeeRequest.SpClasses;
using System.Collections.Generic;
using System.Web.Mvc;

namespace EmployeeRequest.Areas.RM.Controllers.Pages.Reports
{
    public class RptMaxSellerController : Controller
    {
        [HttpPost]
        public virtual ActionResult GetSpShrRptMaxSeller(string dateS, string dateE, string shrhKind, int? share, List<decimal> watchShareholderIds, string fullname)
        {
            var shrhCodeList = ShareholderWatchHelper.GetShrhCodeListFromWatchList(watchShareholderIds);

            var result = ReportHelper.GetSpShrMaxSellerDashboard(dateS.Replace("/", ""), dateE.Replace("/", ""), shrhKind, share, shrhCodeList.Count != 0 ? shrhCodeList : null, StringHelper.ReplaceWithArabicChar(fullname), 0);

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