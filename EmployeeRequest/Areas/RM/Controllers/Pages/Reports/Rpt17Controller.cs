using App_Resources;
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
    public class Rpt17Controller : Controller
    {
        [HttpPost]
        public virtual ActionResult GetSpShrRpt17(string finYearS, string finYearE, string shrOprCode, List<decimal> watchShareholderIds)
        {
            var shrhCodeList = ShareholderWatchHelper.GetShrhCodeListFromWatchList(watchShareholderIds);

            string shrhCodeStringList = shrhCodeList != null ? string.Join(",", shrhCodeList) : "";

            var result = ReportHelper.GetSpShrRpt17Dashboard(finYearS, finYearE, shrOprCode, shrhCodeStringList);

            if (result == null)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
            var output = new JsonResult();
            output.Data = result;
            output.MaxJsonLength = int.MaxValue;
            return output;
        }
    }
}