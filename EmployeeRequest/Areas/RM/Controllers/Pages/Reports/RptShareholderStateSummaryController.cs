using App_Resources;
using EmployeeRequest.Infrastracture.BaseClasses;
using EmployeeRequest.Infrastracture.Enums;
using EmployeeRequest.Infrastracture.Helpers;
using EmployeeRequest.Repository;
using EmployeeRequest.SpClasses;
using EmployeeRequest.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace EmployeeRequest.Areas.RM.Controllers.Pages.Reports
{
    public class RptShareholderStateSummaryController : BaseController
    {
        [HttpPost]
        public virtual ActionResult GetSpShrRptShareholderStateSummary(List<decimal> watchShareholderIds, string finYear, string meetDate)
        {
            if (finYear == "")
                return Json(ResponseType.Warning, MessagesLibrary.FinYearIsEmpty);

            if (meetDate == "")
                return Json(ResponseType.Warning, MessagesLibrary.MeetingDateIsEmpty);

            var shrhCodeList = ShareholderWatchHelper.GetShrhCodeListFromWatchList(watchShareholderIds);

            string shrhCodeStringList = shrhCodeList != null ? string.Join(",", shrhCodeList) : "";

            var finYearStartDate = FilterHelper.GetFinYear(finYear).START_DATE;
            var finYearEndDate = FilterHelper.GetFinYear(finYear).END_DATE;

            var firstFinYear = FilterHelper.GetAllFinYear().Min();
            var lastFinYear = FilterHelper.GetAllFinYear().Max();

            var currentDate = DateTimeHelper.ToPersianDate(DateTime.Now);

            var FinYearIndex = FilterHelper.GetAllFinYear().FindIndex(a => a == finYear);
            string lastFinYearMinus1 = "";
            if (FinYearIndex != 0)
            {
                lastFinYearMinus1 = FilterHelper.GetAllFinYear().ToList()[FinYearIndex - 1];
            }
            
            /***************************************DETAIL**********************************************/
            var quantityOfStartPeriodList = ReportHelper.GetSpFbShrTransDashboard(shrhCodeStringList, finYearStartDate.Replace("/", ""));
            var quantityOfEndPeriodList = ReportHelper.GetSpFbShrTransDashboard(shrhCodeStringList, finYearEndDate.Replace("/", ""));
            var quantityOfMeetDateList = ReportHelper.GetSpFbShrTransDashboard(shrhCodeStringList, meetDate.Replace("/", ""));

            var financeOfStartPeriodList = ReportHelper.GetSpFbShrRpt07Dashboard(shrhCodeStringList, "", firstFinYear, lastFinYear, finYearStartDate.Replace("/", ""),"");
            var financeOfEndPeriodList = ReportHelper.GetSpFbShrRpt07Dashboard(shrhCodeStringList, "", firstFinYear, lastFinYear, finYearEndDate.Replace("/", ""), "");
            var assignFinanceOfPrevFinYearList = ReportHelper.GetSpShrRpt16Dashboard(shrhCodeStringList, meetDate.Replace("/", ""), "", lastFinYearMinus1, 0, 0, 0, 0);
            var payFinanceOfEndPeriodList = ReportHelper.GetSpFbShrFinInfoDashboard(shrhCodeStringList, "", finYearStartDate.Replace("/", ""), finYearEndDate.Replace("/", ""), "", "");
            var capitalInfo04List = ShrFinInfoRepository.GetCapitalInfo04(shrhCodeList, finYear);
            var capitalInfo05List = ShrFinInfoRepository.GetCapitalInfo05(shrhCodeList, finYear);
            var capitalInfo07List = ShrFinInfoRepository.GetCapitalInfo07(shrhCodeList, finYear);



            var query = from quantityOfStart in quantityOfStartPeriodList
                        join quantityOfEnd in quantityOfEndPeriodList
                             on quantityOfStart.shrh_code equals quantityOfEnd.shrh_code
                        join quantityOfMeetDate in quantityOfMeetDateList
                             on quantityOfStart.shrh_code equals quantityOfMeetDate.shrh_code
                        join financeOfStart in financeOfStartPeriodList
                             on quantityOfStart.shrh_code equals financeOfStart.shrh_code
                        join financeOfEnd in financeOfEndPeriodList
                             on quantityOfStart.shrh_code equals financeOfEnd.shrh_code
                        join payFinanceOfPrevFinYear in assignFinanceOfPrevFinYearList
                            on quantityOfStart.shrh_code equals payFinanceOfPrevFinYear.shrh_code
                            into temp
                        from assignFinanceOfPrevFinYear in temp.DefaultIfEmpty()

                        join payFinanceOfEndPeriod in payFinanceOfEndPeriodList
                            on quantityOfStart.shrh_code equals payFinanceOfEndPeriod.shrh_code
                            into temp2
                        from payFinanceOfEndPeriod in temp2.DefaultIfEmpty()

                        join capitalInfo04 in capitalInfo04List
                            on quantityOfStart.shrh_code equals capitalInfo04.ShrhCode
                            into temp4
                        from capitalInfo04 in temp4.DefaultIfEmpty()

                        join capitalInfo05 in capitalInfo05List
                            on quantityOfStart.shrh_code equals capitalInfo05.ShrhCode
                            into temp5
                        from capitalInfo05 in temp5.DefaultIfEmpty()

                        join capitalInfo07 in capitalInfo07List
                            on quantityOfStart.shrh_code equals capitalInfo07.ShrhCode
                            into temp7
                        from capitalInfo07 in temp7.DefaultIfEmpty()
                        select new ShareholderStateSummaryModel
                        {
                            shrh_code = quantityOfStart.shrh_code,
                            cert_info = financeOfStart.cert_info,
                            shrh_kind = financeOfStart.shrh_kind,
                            shrh_kind_desc = financeOfStart.shrh_kind_desc.Replace("ي", "ی"),
                            cert_no = financeOfStart.cert_no,
                            shrh_exch_code = financeOfStart.shrh_exch_code,
                            quantityOfStart = quantityOfStart.share,
                            financeOfStart = financeOfStart.sum_amnt,
                            financeOfEnd = financeOfEnd.sum_amnt,
                            quantityOfMeetDate = quantityOfMeetDate.share,
                            quantityOfEnd = quantityOfEnd.share,
                            assignFinanceOfPrevFinYear = assignFinanceOfPrevFinYear == null ? 0 : assignFinanceOfPrevFinYear.amnt,
                            payFinanceOfEndPeriod = payFinanceOfEndPeriod == null ? 0 : payFinanceOfEndPeriod.amnt,
                            capitalInfo04 = capitalInfo04 == null ? 0 : capitalInfo04.Amnt,
                            capitalInfo05 = capitalInfo05 == null ? 0 : capitalInfo05.Amnt,
                            capitalInfo07 = capitalInfo07 == null ? 0 : capitalInfo07.Amnt
                        };

            var resultDetail = query.ToList();

            /***************************************DETAIL**********************************************/
            /***************************************SUMMARY OTHER**********************************************/
            if (shrhCodeList.Any())
            {
                var quantityOfStartPeriodListAllOther = ReportHelper.GetSpFbShrTransDashboard("", finYearStartDate.Replace("/", ""));
                var quantityOfEndPeriodListAllOther = ReportHelper.GetSpFbShrTransDashboard("", finYearEndDate.Replace("/", ""));
                var quantityOfMeetDateListAllOther = ReportHelper.GetSpFbShrTransDashboard("", meetDate.Replace("/", ""));

                var financeOfStartPeriodListAllOther = ReportHelper.GetSpFbShrRpt07Dashboard("", "", firstFinYear, lastFinYear, finYearStartDate.Replace("/", ""), "");
                var financeOfEndPeriodListAllOther = ReportHelper.GetSpFbShrRpt07Dashboard("", "", firstFinYear, lastFinYear, finYearEndDate.Replace("/", ""), "");
                var assignFinanceOfPrevFinYearListAllOther = ReportHelper.GetSpShrRpt16Dashboard("", meetDate.Replace("/", ""), "", lastFinYearMinus1, 0, 0, 0, 0);
                var payFinanceOfEndPeriodListAllOther = ReportHelper.GetSpFbShrFinInfoDashboard("", "", finYearStartDate.Replace("/", ""), finYearEndDate.Replace("/", ""), "", "");
                var capitalInfo04ListAllOther = ShrFinInfoRepository.GetCapitalInfo04(null, finYear);
                var capitalInfo05ListAllOther = ShrFinInfoRepository.GetCapitalInfo05(null, finYear);
                var capitalInfo07ListAllOther = ShrFinInfoRepository.GetCapitalInfo07(null, finYear);


                var queryAllOther = from quantityOfStart in quantityOfStartPeriodListAllOther
                                    join quantityOfEnd in quantityOfEndPeriodListAllOther
                                        on quantityOfStart.shrh_code equals quantityOfEnd.shrh_code
                                    join quantityOfMeetDate in quantityOfMeetDateListAllOther
                                         on quantityOfStart.shrh_code equals quantityOfMeetDate.shrh_code
                                    join financeOfStart in financeOfStartPeriodListAllOther
                                         on quantityOfStart.shrh_code equals financeOfStart.shrh_code
                                    join financeOfEnd in financeOfEndPeriodListAllOther
                                         on quantityOfStart.shrh_code equals financeOfEnd.shrh_code
                                    join payFinanceOfPrevFinYear in assignFinanceOfPrevFinYearListAllOther
                                         on quantityOfStart.shrh_code equals payFinanceOfPrevFinYear.shrh_code
                                         into temp
                                    from assignFinanceOfPrevFinYear in temp.DefaultIfEmpty()
                                    join payFinanceOfEndPeriod in payFinanceOfEndPeriodListAllOther
                                        on quantityOfStart.shrh_code equals payFinanceOfEndPeriod.shrh_code
                                        into temp2
                                    from payFinanceOfEndPeriod in temp2.DefaultIfEmpty()

                                    join capitalInfo04 in capitalInfo04ListAllOther
                                        on quantityOfStart.shrh_code equals capitalInfo04.ShrhCode
                                        into temp4
                                    from capitalInfo04 in temp4.DefaultIfEmpty()

                                    join capitalInfo05 in capitalInfo05ListAllOther
                                        on quantityOfStart.shrh_code equals capitalInfo05.ShrhCode
                                        into temp5
                                    from capitalInfo05 in temp5.DefaultIfEmpty()

                                    join capitalInfo07 in capitalInfo07ListAllOther
                                        on quantityOfStart.shrh_code equals capitalInfo07.ShrhCode
                                        into temp7
                                    from capitalInfo07 in temp7.DefaultIfEmpty()
                                    select new ShareholderStateSummaryModel
                                    {
                                        shrh_code = quantityOfStart.shrh_code,
                                        cert_info = financeOfStart.cert_info,
                                        shrh_kind = financeOfStart.shrh_kind,
                                        shrh_kind_desc = financeOfStart.shrh_kind_desc.Replace("ي", "ی"),
                                        cert_no = financeOfStart.cert_no,
                                        shrh_exch_code = financeOfStart.shrh_exch_code,
                                        quantityOfStart = quantityOfStart.share,
                                        financeOfStart = financeOfStart.sum_amnt,
                                        financeOfEnd = financeOfEnd.sum_amnt,
                                        quantityOfMeetDate = quantityOfMeetDate.share,
                                        quantityOfEnd = quantityOfEnd.share,
                                        assignFinanceOfPrevFinYear = assignFinanceOfPrevFinYear == null ? 0 : assignFinanceOfPrevFinYear.amnt,
                                        payFinanceOfEndPeriod = payFinanceOfEndPeriod == null ? 0 : payFinanceOfEndPeriod.amnt,
                                        capitalInfo04 = capitalInfo04 == null ? 0 : capitalInfo04.Amnt,
                                        capitalInfo05 = capitalInfo05 == null ? 0 : capitalInfo05.Amnt,
                                        capitalInfo07 = capitalInfo07 == null ? 0 : capitalInfo07.Amnt
                                    };
                var resultAllOther = queryAllOther.Where(p => shrhCodeList.All(p2 => p2 != p.shrh_code)).ToList();

                var otherLegal = from p in resultAllOther.Where(t => t.shrh_kind == "2")
                                 group p by 1 into g
                                 select new ShareholderStateSummaryModel
                                 {
                                     shrh_code = "",
                                     cert_info = CaptionsLibrary.Other + " " + CaptionsLibrary.Persons + " " + CaptionsLibrary.Legal,
                                     shrh_kind_desc = CaptionsLibrary.Legal,
                                     cert_no = "",
                                     shrh_exch_code = "",
                                     quantityOfStart = g.Sum(t => t.quantityOfStart),
                                     financeOfStart = g.Sum(t => t.financeOfStart),
                                     financeOfEnd = g.Sum(t => t.financeOfEnd),
                                     quantityOfMeetDate = g.Sum(t => t.quantityOfMeetDate),
                                     quantityOfEnd = g.Sum(t => t.quantityOfEnd),
                                     assignFinanceOfPrevFinYear = g.Sum(t => t.assignFinanceOfPrevFinYear),
                                     payFinanceOfEndPeriod = g.Sum(t => t.payFinanceOfEndPeriod),
                                     capitalInfo04 = g.Sum(t => t.capitalInfo04),
                                     capitalInfo05 = g.Sum(t => t.capitalInfo05),
                                     capitalInfo07 = g.Sum(t => t.capitalInfo07)
                                 };
                var resultOtherLegal = otherLegal.ToList();

                var otherActual = from p in resultAllOther.Where(t => t.shrh_kind == "1")
                                  group p by 1 into g
                                  select new ShareholderStateSummaryModel
                                  {
                                      shrh_code = "",
                                      cert_info = CaptionsLibrary.Other + " " + CaptionsLibrary.Persons + " " + CaptionsLibrary.Actual,
                                      shrh_kind_desc = CaptionsLibrary.Actual,
                                      cert_no = "",
                                      shrh_exch_code = "",
                                      quantityOfStart = g.Sum(t => t.quantityOfStart),
                                      financeOfStart = g.Sum(t => t.financeOfStart),
                                      financeOfEnd = g.Sum(t => t.financeOfEnd),
                                      quantityOfMeetDate = g.Sum(t => t.quantityOfMeetDate),
                                      quantityOfEnd = g.Sum(t => t.quantityOfEnd),
                                      assignFinanceOfPrevFinYear = g.Sum(t => t.assignFinanceOfPrevFinYear),
                                      payFinanceOfEndPeriod = g.Sum(t => t.payFinanceOfEndPeriod),
                                      capitalInfo04 = g.Sum(t => t.capitalInfo04),
                                      capitalInfo05 = g.Sum(t => t.capitalInfo05),
                                      capitalInfo07 = g.Sum(t => t.capitalInfo07)
                                  };
                var resultOtherReal = otherActual.ToList();
                /***************************************SUMMARY OTHER**********************************************/

                resultDetail.AddRange(resultOtherLegal);
                resultDetail.AddRange(resultOtherReal);

            }

            var result = resultDetail;

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
    }
}