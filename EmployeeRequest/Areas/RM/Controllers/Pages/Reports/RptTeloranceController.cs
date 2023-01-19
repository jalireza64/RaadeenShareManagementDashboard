using App_Resources;
using EmployeeRequest.Infrastracture.BaseClasses;
using EmployeeRequest.Infrastracture.Enums;
using EmployeeRequest.SpClasses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace EmployeeRequest.Areas.RM.Controllers.Pages.Reports
{
    public class RptTeloranceController : BaseController
    {
        [HttpPost]
        public virtual ActionResult GetSpShrTelorance(string dateS, string dateE, decimal? finalFeeDiffS, decimal? finalFeeDiffE)
        {
            var result = ReportHelper.GetSpShrTeloranceDashboard(dateS.Replace("/", ""), dateE.Replace("/", ""), finalFeeDiffS, finalFeeDiffE);
            var maxFinal = result.Max(t => t.final_fee);
            var minFinal = result.Min(t => t.final_fee);

            var rangeFee = result.Select(t => new { t.max_fee, t.min_fee }).ToArray();

            if (result == null)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);

            if (result.Count > 20000)
                return Json(ResponseType.Failed, MessagesLibrary.NumberOfRecoveredRowIsMoreThanAllowed);

            var obj = new
            {
                result,
                maxFinal,
                minFinal,
                rangeFee
            };

            var outFile = new
            {
                ResponseType = ResponseType.Ok,
                Message = MessagesLibrary.OperationSuccessed,
                obj
            };

            var output = new JsonResult();
            output.Data = outFile;
            output.MaxJsonLength = int.MaxValue;
            return output;
        }
    }
}