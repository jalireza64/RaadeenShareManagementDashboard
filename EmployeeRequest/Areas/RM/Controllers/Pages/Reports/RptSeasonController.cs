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
    public class RptSeasonController : Controller
    {
        [HttpPost]
        public virtual ActionResult GetSpShrRptSeasonDashboard(string finYear)
        {
            var dataList = ReportHelper.GetSpShrRptSeasonDashboard(finYear);

            var max = dataList.Max(t => t.qnt);
            var min = dataList.Min(t => t.qnt);
            var result = new
            {
                dataList,
                max,
                min
            };

            if (dataList == null)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
            var output = new JsonResult();
            output.Data = result;
            output.MaxJsonLength = int.MaxValue;
            return output;
        }

        [HttpPost]
        public virtual ActionResult GetSpShrRptSeasonDashboardWithPastFinYear(string finYear)
        {
            var finYearList = FilterHelper.GetCurrentFinYearAndPastFinYear(finYear);
            var pastFinYear = finYearList.Last();
            var dataList = ReportHelper.GetSpShrRptSeasonDashboard(finYear);
            var pastDataList = ReportHelper.GetSpShrRptSeasonDashboard(pastFinYear);

            var max = dataList.Max(t => t.qnt);
            var min = dataList.Min(t => t.qnt);
            var result = new
            {
                dataList,
                pastDataList,
                max,
                min
            };

            if (dataList == null)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
            var output = new JsonResult();
            output.Data = result;
            output.MaxJsonLength = int.MaxValue;
            return output;
        }

        [HttpPost]
        public virtual ActionResult GetSpShrRptSeasonGroupDashboard(string finYear)
        {
            var dataList = ReportHelper.GetSpShrRptSeasonDashboard(finYear).GroupBy(
            p => p.season,
            p => p.qnt,
            (key, g) => new { season = key, qnt = g.Sum()});

            var max = dataList.Max(t => t.qnt);
            var min = dataList.Min(t => t.qnt);
            var result = new
            {
                dataList,
                max,
                min
            };

            if (dataList == null)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
            var output = new JsonResult();
            output.Data = result;
            output.MaxJsonLength = int.MaxValue;
            return output;
        }
    }
}