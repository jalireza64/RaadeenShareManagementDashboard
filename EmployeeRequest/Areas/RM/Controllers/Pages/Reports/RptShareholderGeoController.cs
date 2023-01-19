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
    public class RptShareholderGeoController : BaseController
    {
        [HttpPost]
        public virtual ActionResult GetShareholderGeo()
        {
            var dataList = ReportHelper.GetShareholderGeo();

            var result = new
            {
                dataList
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