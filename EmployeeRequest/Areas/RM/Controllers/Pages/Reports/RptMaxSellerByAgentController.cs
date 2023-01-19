using App_Resources;
using EmployeeRequest.Infrastracture.BaseClasses;
using EmployeeRequest.Infrastracture.Enums;
using EmployeeRequest.SpClasses;
using System.Collections.Generic;
using System.Web.Mvc;

namespace EmployeeRequest.Areas.RM.Controllers.Pages.Reports
{
    public class RptMaxSellerByAgentController : BaseController
    {
        [HttpPost]
        public virtual ActionResult GetSpShrRptMaxSellerByAgent(string dateS, string dateE, string shrhKind)
        {
            var result = ReportHelper.GetSpShrMaxSellerByAgentDashboard(dateS.Replace("/", ""), dateE.Replace("/", ""), shrhKind);

            if (result == null)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);

            if (result.Count > int.MaxValue)
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

        public virtual ActionResult GetSpShrSellerAgentDetailDashboard(string dateS, string dateE, string shrhKind, string agentCode)
        {
            var result = ReportHelper.GetSpShrSellerAgentDetailDashboard(dateS.Replace("/", ""), dateE.Replace("/", ""), shrhKind, agentCode);

            if (result == null)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);

            if (result.Count > int.MaxValue)
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