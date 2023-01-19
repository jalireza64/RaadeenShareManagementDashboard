using App_Resources;
using EmployeeRequest.Infrastracture.BaseClasses;
using EmployeeRequest.Infrastracture.Enums;
using EmployeeRequest.Infrastracture.Helpers;
using EmployeeRequest.SpClasses;
using System.Collections.Generic;
using System.Web.Mvc;

namespace EmployeeRequest.Areas.RM.Controllers.Pages.Reports
{
    public class RptTransactionOfShareholderController : BaseController
    {
        [HttpPost]
        public virtual ActionResult GetTransactionOfShareholder(string shrhCode, string dateS, string dateE)
        {
            var result = ReportHelper.GetTransactionOfShareholder(shrhCode, dateS.Replace("/", ""), dateE.Replace("/", ""));

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