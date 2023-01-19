using System.ComponentModel;

namespace EmployeeRequest.Infrastracture.Enums
{
    public enum DeviceType
    {
        [Description("تبلت")]
        Tablet = 1,

        [Description("موبایل")]
        Mobile = 2,

        [Description("دسکتاپ")]
        Desktop = 3,
    }
}