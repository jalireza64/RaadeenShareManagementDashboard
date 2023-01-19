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
    public class RptAmntCapController : Controller
    {
        [HttpPost]
        public virtual ActionResult GetSpShrAmntCap(string dateS, string dateE)
        {
            var result = ReportHelper.GetSpShrAmntCapDashboard(dateS.Replace("/", ""), dateE.Replace("/", ""));

            if (result == null)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
            var output = new JsonResult();
            output.Data = result;
            output.MaxJsonLength = int.MaxValue;
            return output;
        }
    }
}