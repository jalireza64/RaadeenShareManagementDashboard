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
    public class Rpt0702AssignController : Controller
    {
        [HttpPost]
        public virtual ActionResult GetSpShrRpt0702Assign(string finYearS, string finYearE, string shrhKind,string shrOprCode)
        {
            var result = ReportHelper.GetSpShrRpt0702AssignDashboard(finYearS, finYearE, shrOprCode, shrhKind);

            if (result == null)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
            var output = new JsonResult();
            output.Data = result;
            output.MaxJsonLength = int.MaxValue;
            return output;
        }
    }
}