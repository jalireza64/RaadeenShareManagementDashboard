using System;
using System.Web.Mvc;
using App_Resources;
using EmployeeRequest.Infrastracture.BaseClasses;
using EmployeeRequest.Infrastracture.Enums;
using EmployeeRequest.Infrastracture.Helpers;
using EmployeeRequest.SpClasses;
using System.Linq;
using System.Collections.Generic;

namespace EmployeeRequest.Controllers
{

    public partial class HomeController : BaseController
    {
        #region HttpGet Methods
        public virtual ActionResult Index()
        {
            return View();
        }

        #endregion

        [HttpPost]
        public virtual ActionResult GetCurrentDate()
        {
            var currentDate = DateTimeHelper.ToPersianDate(DateTime.Now);
            var last1WeekDate = DateTimeHelper.ToPersianDate(DateTime.Now.AddDays(-7));
            var last1MonthDate = DateTimeHelper.ToPersianDate(DateTime.Now.AddMonths(-1));
            var last1YearDate = DateTimeHelper.ToPersianDate(DateTime.Now.AddYears(-1));
            var beginOfMonthDate = DateTimeHelper.ToBeginOfMonth(DateTime.Now);
            var beginOfYearDate = DateTimeHelper.ToBeginOfYear(DateTime.Now);
            var result = new
            {
                currentDate,
                last1WeekDate,
                last1MonthDate,
                last1YearDate,
                beginOfMonthDate,
                beginOfYearDate
            };

            if (result == null)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
            return Json(result);
        }

        public virtual ActionResult HasAccess(int id)
        {
            return null;
        }


        [HttpPost]
        public virtual ActionResult GetLoginResult()
        {
            var loginResult = Session["LoginResult"];         
            return Json(loginResult);
        }

        [HttpPost]
        public virtual ActionResult GetSpShrRpt05(long shareS,int shareE,int percent,string effDate)
        {
            var datalist = ReportHelper.GetSpShrRpt05Dashboard(shareS, shareE, percent, effDate.Replace("/", ""));

            var actual = datalist.Where(t=>t.shrh_kind == "1");
            var legal = datalist.Where(t => t.shrh_kind == "2");
            var result = new
            {
                actual,
                legal
            };

            if (result == null)
                    return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
            var output = new JsonResult();
            output.Data = result;
            output.MaxJsonLength = int.MaxValue;
            return output;
        }

        [HttpPost]
        public virtual ActionResult GetSpShrTelorance(string dateS, string dateE)
        {
            var dataList = ReportHelper.GetSpShrTeloranceDashboard(dateS.Replace("/", ""), dateE.Replace("/", ""), null, null);
            var maxFinal = dataList.Max(t => t.final_fee);
            var minFinal = dataList.Min(t => t.final_fee);


            //var maxFee = dataList.Select(t=>t.max_fee);
            //var minFee = dataList.Select(t => t.min_fee).ToArray();
            var rangeFee = dataList.Select(t => new { t.max_fee, t.min_fee }).ToArray();
            //Array.Copy(maxFee, rangeFee, maxFee.Length);
            //Array.Copy(minFee, 0, rangeFee, maxFee.Length, minFee.Length);

            //T[] array2 = getAnotherArray();
            //T[] newArray = new T[array1.Length + array2.Length];
            //Array.Copy(array1, newArray, array1.Length);
            //Array.Copy(array2, 0, newArray, array1.Length, array2.Length);


            var result = new
            {
                dataList,
                maxFinal,
                minFinal,
                rangeFee
            };

            if (dataList == null)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
            var output = new JsonResult();
            output.Data = result;
            output.MaxJsonLength = int.MaxValue;
            return output;
        }

        [HttpPost]
        public virtual ActionResult GetSpShrRpt14(string effDate)
        {
            var result = ReportHelper.GetSpShrRpt14Dashboard(effDate.Replace("/", ""));

            if (result == null)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
            var output = new JsonResult();
            output.Data = result;
            output.MaxJsonLength = int.MaxValue;
            return output;
        }

        public class ShareholderCombination
        { 
            public string Name { get; set; }
            public List<DataOfShareholderCombination> DataOfShareholderCombination { get; set; }
        }

        public class DataOfShareholderCombination
        {
            public string category { get; set; }
            public decimal? value { get; set; }
        }

        [HttpPost]
        public virtual ActionResult GetSpShrRpt14WithPastYear(string effDate, string kind)
        {
            var pastPastYear = (Convert.ToInt64(effDate.Substring(0, 4)) - 2).ToString() + "1230";
            var pastYear = (Convert.ToInt64(effDate.Substring(0, 4)) - 1).ToString() + "1230";

            var pastPastMonth = DateTimeHelper.ToEndOfMonth(DateTimeHelper.ToMiladiDate(effDate).AddMonths(-2));
            var pastMonth = DateTimeHelper.ToEndOfMonth(DateTimeHelper.ToMiladiDate(effDate).AddMonths(-1));

            List<ShareholderCombination> result;

            if (kind == "1")
            {
                var currentYearList = ReportHelper.GetSpShrRpt14Dashboard(effDate.Replace("/", "")).Select(t => new DataOfShareholderCombination { category = t.shrh_kind_desc, value = t.share_percent }).ToList();
                var pastYearList = ReportHelper.GetSpShrRpt14Dashboard(pastYear.Replace("/", "")).Select(t => new DataOfShareholderCombination { category = t.shrh_kind_desc, value = t.share_percent }).ToList();
                var pastPastYearList = ReportHelper.GetSpShrRpt14Dashboard(pastPastYear.Replace("/", "")).Select(t => new DataOfShareholderCombination { category = t.shrh_kind_desc, value = t.share_percent }).ToList();

                var x1 = new ShareholderCombination
                {
                    Name = effDate.Substring(0, 4),
                    DataOfShareholderCombination = currentYearList
                };

                var x2 = new ShareholderCombination
                {
                    Name = (Convert.ToInt64(effDate.Substring(0, 4)) - 1).ToString(),
                    DataOfShareholderCombination = pastYearList
                };

                var x3 = new ShareholderCombination
                {
                    Name = (Convert.ToInt64(effDate.Substring(0, 4)) - 2).ToString(),
                    DataOfShareholderCombination = pastPastYearList
                };

                result = new List<ShareholderCombination>(3) { x3, x2, x1 };
            }
            else
            {
                var currentMonthList = ReportHelper.GetSpShrRpt14Dashboard(effDate.Replace("/", "")).Select(t => new DataOfShareholderCombination { category = t.shrh_kind_desc, value = t.share_percent }).ToList();
                var pastMonthList = ReportHelper.GetSpShrRpt14Dashboard(pastMonth.Replace("/", "")).Select(t => new DataOfShareholderCombination { category = t.shrh_kind_desc, value = t.share_percent }).ToList();
                var pastPastMonthList = ReportHelper.GetSpShrRpt14Dashboard(pastPastMonth.Replace("/", "")).Select(t => new DataOfShareholderCombination { category = t.shrh_kind_desc, value = t.share_percent }).ToList();

                var x1 = new ShareholderCombination
                {
                    Name = EnumHelper.GetDescriptionFromId(Convert.ToInt32(effDate.Substring(5, 2)), new Month()),
                    DataOfShareholderCombination = currentMonthList
                };

                var x2 = new ShareholderCombination
                {
                    Name = EnumHelper.GetDescriptionFromId(Convert.ToInt32(pastMonth.Substring(5, 2)), new Month()),
                    DataOfShareholderCombination = pastMonthList
                };

                var x3 = new ShareholderCombination
                {
                    Name = EnumHelper.GetDescriptionFromId(Convert.ToInt32(pastPastMonth.Substring(5, 2)), new Month()),
                    DataOfShareholderCombination = pastPastMonthList
                };

                result = new List<ShareholderCombination>(3) { x3, x2, x1 };
            }

            if (result == null)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
            var output = new JsonResult();
            output.Data = result;
            output.MaxJsonLength = int.MaxValue;
            return output;
        }

        //[HttpPost]
        //public virtual ActionResult GetSpShrRpt0702(string dateS, string dateE, string finYearS, string finYearE, string shrhKind)
        //{
        //    //پرداخت سود
        //    var object1 = ReportHelper.GetSpShrRpt0702Dashboard(dateS.Replace("/", ""), dateE.Replace("/", ""), finYearS, finYearE, "1", shrhKind);

        //    //پرداخت اضافه واریزی افزایش سرمایه
        //    var object2 = ReportHelper.GetSpShrRpt0702Dashboard(dateS.Replace("/", ""), dateE.Replace("/", ""), finYearS, finYearE, "2", shrhKind);

        //    //پرداخت فروش حق
        //    var object3 = ReportHelper.GetSpShrRpt0702Dashboard(dateS.Replace("/", ""), dateE.Replace("/", ""), finYearS, finYearE, "3", shrhKind);

        //    //پرداخت قهری
        //    var object4 = ReportHelper.GetSpShrRpt0702Dashboard(dateS.Replace("/", ""), dateE.Replace("/", ""), finYearS, finYearE, "4", shrhKind);

        //    var result = new
        //    {
        //        object1,
        //        object2,
        //        object3,
        //        object4
        //    };

        //    if (result == null)
        //        return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
        //    return Json(result);
        //}

        //[HttpPost]
        //public virtual ActionResult GetSpShrRpt0702Assign(string finYearS, string finYearE, string shrhKind)
        //{
        //    //واریز سود
        //    var object1 = ReportHelper.GetSpShrRpt0702AssignDashboard(finYearS, finYearE, "1", shrhKind);

        //    //واریز فروش حق
        //    var object3 = ReportHelper.GetSpShrRpt0702AssignDashboard(finYearS, finYearE, "3", shrhKind);

        //    //واریز قهری
        //    var object4 = ReportHelper.GetSpShrRpt0702AssignDashboard(finYearS, finYearE, "4", shrhKind);

        //    var result = new
        //    {
        //        object1,
        //        object3,
        //        object4
        //    };

        //    if (result == null)
        //        return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
        //    return Json(result);
        //}

        [HttpPost]
        public virtual ActionResult GetSpShrMaxBuyer(string dateS, string dateE,string shrhKind)
        {
            var result = ReportHelper.GetSpShrMaxBuyerDashboard(dateS.Replace("/", ""), dateE.Replace("/", ""), shrhKind, null, null,"", 10);

            if (result == null)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
            var output = new JsonResult();
            output.Data = result;
            output.MaxJsonLength = int.MaxValue;
            return output;
        }

        [HttpPost]
        public virtual ActionResult GetSpShrMaxSeller(string dateS, string dateE, string shrhKind)
        {
            var result = ReportHelper.GetSpShrMaxSellerDashboard(dateS.Replace("/", ""), dateE.Replace("/", ""), shrhKind, null, null,"", 10);

            if (result == null)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
            var output = new JsonResult();
            output.Data = result;
            output.MaxJsonLength = int.MaxValue;
            return output;
        }

        [HttpPost]
        public virtual ActionResult GetSpShrRpt43(decimal? feeFlag, string dateS, string dateE)
        {
            var result = ReportHelper.GetSpShrRpt43Dashboard(feeFlag, dateS.Replace("/", ""), dateE.Replace("/", ""));

            if (result == null)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
            var output = new JsonResult();
            output.Data = result;
            output.MaxJsonLength = int.MaxValue;
            return output;
        }

        [HttpPost]
        public virtual ActionResult GetCurrentDateState(string effDate)
        {
            var currentDatePay = ReportHelper.GetSpShrPayDashboard(effDate.Replace("/", ""));
            var currentDateTransaction = ReportHelper.GetSpShrRpt44Dashboard(effDate.Replace("/", ""), effDate.Replace("/", "")).FirstOrDefault();
            var MaxBuyer = ReportHelper.GetSpShrMaxBuyerDashboard(effDate.Replace("/", ""), effDate.Replace("/", ""), "", null, null,"", 0).FirstOrDefault();
            var MaxSeller = ReportHelper.GetSpShrMaxSellerDashboard(effDate.Replace("/", ""), effDate.Replace("/", ""), "", null, null,"", 0).FirstOrDefault();
            var result = new
            {
                currentDatePay,
                currentDateTransactionCnt = currentDateTransaction != null ? currentDateTransaction.cnt.Value.ToString("N0") : null,
                currentDateTransactionQnt = currentDateTransaction != null ? currentDateTransaction.qnt.Value.ToString("N0") : null,
                nameOfMaxBuyer = MaxBuyer?.fullname,
                shareOfMaxBuyer = MaxBuyer != null ? MaxBuyer.sumshare.Value.ToString("N0") : null,
                percentOfMaxBuyer = MaxBuyer?.SharePercent,
                nameOfMaxSeller = MaxSeller?.fullname,
                shareOfMaxSeller = MaxSeller != null ? MaxSeller.sumshare.Value.ToString("N0") : null,
                percentOfMaxSeller = MaxSeller?.SharePercent
            };
            if (result == null)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
            var output = new JsonResult();
            output.Data = result;
            output.MaxJsonLength = int.MaxValue;
            return output;
        }

        [HttpPost]
        public virtual ActionResult GetAllFinYear()
        {
            var result = FilterHelper.GetAllFinYear();

            if (result == null)
                return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);
            var output = new JsonResult();
            output.Data = result;
            output.MaxJsonLength = int.MaxValue;
            return output;
        }

        [HttpPost]
        public virtual ActionResult GetShrTransactionGroupByYear()
        {
            var dataList = ReportHelper.GetShrTransactionGroupByYear();

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

        [HttpPost]
        public virtual ActionResult GetShrTransactionGroupByMonth()
        {
            var dataList = ReportHelper.GetShrTransactionGroupByMonth();

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

        [HttpPost]
        public virtual ActionResult GetShareholderCompletionRateInformation()
        {
            var dataList = ReportHelper.GetShareholderCompletionRateInformation();

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

