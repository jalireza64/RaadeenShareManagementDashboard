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
    public class Rpt44ShrhKindController : Controller
    {
        [HttpPost]
        public virtual ActionResult GetSpShrRpt44ShrhKind(decimal? kindFlag,string dateS, string dateE, string shareQuntType)
        {
            var result = ReportHelper.GetSpShrRpt44ShrhKindDashboard(kindFlag, dateS.Replace("/", ""), dateE.Replace("/", ""), shareQuntType);

            if (result == null)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
            var output = new JsonResult();
            output.Data = result;
            output.MaxJsonLength = int.MaxValue;
            return output;
        }
    }
}