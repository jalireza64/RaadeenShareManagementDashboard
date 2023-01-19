using App_Resources;
using EmployeeRequest.Infrastracture.BaseClasses;
using EmployeeRequest.Infrastracture.Enums;
using EmployeeRequest.SpClasses;
using Kendo.Mvc.UI;
using Kendo.Mvc.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using EmployeeRequest.Infrastracture.Helpers;

namespace EmployeeRequest.Areas.RM.Controllers.Pages.Reports
{
    public class Rpt02Controller : BaseController
    {
        [HttpPost]
        public virtual ActionResult GetSpShrRpt02(List<decimal> watchShareholderIds, string shrhKind, decimal? shrQuntS, decimal? shrQuntE, decimal? shareS, decimal? shareE, string dateS, string dateE, string trnsKind, string relTypeFlag)
        {
            var shrhCodeList = ShareholderWatchHelper.GetShrhCodeListFromWatchList(watchShareholderIds);

            string shrhCodeStringList = shrhCodeList != null ? string.Join(",", shrhCodeList) : "";

            var result = ReportHelper.GetSpShrRpt02Dashboard(shrhCodeStringList, shrhKind, shrQuntS, shrQuntE, shareS, shareE, dateS.Replace("/", ""), dateE.Replace("/", ""), trnsKind, relTypeFlag).ToList();

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

        //[HttpGet]
        //[HttpPost]
        //public virtual ActionResult GetSpShrRpt02([DataSourceRequest] DataSourceRequest request, List<string> watchShareholder, string shrhKind, decimal? shrQuntS, decimal? shrQuntE, decimal? shareS, decimal? shareE, string dateS, string dateE, string trnsKind, string relTypeFlag)
        //{
        //    string shrhCodeList = watchShareholder != null ? string.Join(",", watchShareholder) : "";
        //    var result = ReportHelper.GetSpShrRpt02Dashboard(shrhCodeList, shrhKind, shrQuntS, shrQuntE, shareS, shareE, dateS.Replace("/", ""), dateE.Replace("/", ""), trnsKind, relTypeFlag).ToList();

        //    if (result == null)
        //        return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);

        //    if (result.Count > 20000)
        //        return Json(ResponseType.Failed, MessagesLibrary.NumberOfRecoveredRowIsMoreThanAllowed);

        //    var outFile = new
        //    {
        //        ResponseType = ResponseType.Ok,
        //        Message = MessagesLibrary.OperationSuccessed,
        //        result = result.ToDataSourceResult(request)
        //    };

        //    var output = new JsonResult();
        //    output.Data = outFile;
        //    output.MaxJsonLength = int.MaxValue;
        //    return output;
        //}
    }
}