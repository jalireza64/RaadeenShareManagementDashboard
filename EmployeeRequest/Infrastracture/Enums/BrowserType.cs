using System.ComponentModel;

namespace EmployeeRequest.Infrastracture.Enums
{
    public enum BrowserType
    {
        [Description("اوپرا")]
        Opera = 1,

        [Description("کروم")]
        Chrome = 2,

        [Description("سافاری")]
        Safari = 3,

        [Description("فایرفاکس")]
        Firefox = 4,

        [Description("اینترنت اکسپلورر")]
        IE = 5,

        [Description("نا مشخص")]
        Unknown = 0
    }
}