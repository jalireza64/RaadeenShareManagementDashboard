using System.ComponentModel;

namespace EmployeeRequest.Infrastracture.Enums
{
    public enum OsType
    {
        [Description("ویندوز")]
        Windows = 1,

        [Description("مکینتاش")]
        Macintosh = 2,

        [Description("لینوکس")]
        Linux = 3,

        [Description("اندروید")]
        Android = 4,

        [Description("آی او اس")]
        IOS = 5,

        [Description("نا مشخص")]
        Unknown = 0
    }
}