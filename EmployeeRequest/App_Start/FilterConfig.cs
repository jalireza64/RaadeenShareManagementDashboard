using System.Web.Mvc;
using EmployeeRequest.Infrastracture.Attributes.ActionFilters;
using EmployeeRequest.Infrastracture.Attributes.Shared;

namespace EmployeeRequest
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new ErrorHandler.AiHandleErrorAttribute());
            filters.Add(new ElmahMvcErrorLoggerFilter());
        }
    }
}