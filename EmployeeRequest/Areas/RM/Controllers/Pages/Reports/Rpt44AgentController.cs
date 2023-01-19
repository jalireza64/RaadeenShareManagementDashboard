using App_Resources;
using EmployeeRequest.Infrastracture.Enums;
using EmployeeRequest.SpClasses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace EmployeeRequest.Areas.RM.Controllers.Pages.Reports
{
    public class Rpt44AgentController : Controller
    {
        [HttpPost]
        public virtual ActionResult GetSpShrRpt44Agent(string dateS, string dateE)
        {
            var result = ReportHelper.GetSpShrRpt44AgentDashboard(dateS.Replace("/", ""), dateE.Replace("/", ""));

            if (result == null)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
            var output = new JsonResult();
            output.Data = result;
            output.MaxJsonLength = int.MaxValue;
            return output;
        }
    }
}