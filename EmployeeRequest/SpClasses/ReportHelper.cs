using App_Resources;
using EmployeeRequest.Infrastracture.Config;
using EmployeeRequest.Infrastracture.Enums;
using EmployeeRequest.Infrastracture.Helpers;
using EmployeeRequest.Repository;
using EmployeeRequest.ViewModel;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;

namespace EmployeeRequest.SpClasses
{
    public class ReportHelper
    {
        public static List<sp_shr_rpt_05_dashboard_Result> GetSpShrRpt05Dashboard(long share_s,int share_e,int percent,string eff_date)
        {
            using (var context = new ShareEntities())
            {
                context.Database.CommandTimeout = AppSetting.GetCommandTimeout();
                //var result = context.Database.SqlQuery<sp_shr_rpt_05>("sp_shr_rpt_05 @param1, @param2, @param3, @param4",
                //    new SqlParameter("param1", param1),
                //    new SqlParameter("param2", param2),
                //    new SqlParameter("param3", param3),
                //    new SqlParameter("param4", param4)).ToList();
                var result = context.sp_shr_rpt_05_dashboard(share_s, share_e, percent, eff_date).ToList();
                return result;
            }
        }

        public static List<sp_shr_rpt_43_dashboard_Result> GetSpShrRpt43Dashboard(decimal? fee_flag,string date_s,string date_e)
        {
            using (var context = new ShareEntities())
            {
                context.Database.CommandTimeout = AppSetting.GetCommandTimeout();
                var result = context.sp_shr_rpt_43_dashboard(fee_flag, date_s, date_e).ToList();
                return result;
            }
        }

        public static List<sp_shr_rpt_14_dashboard_Result> GetSpShrRpt14Dashboard(string eff_date)
        {
            using (var context = new ShareEntities())
            {
                context.Database.CommandTimeout = AppSetting.GetCommandTimeout();
                var result = context.sp_shr_rpt_14_dashboard(eff_date).ToList();
                return result;
            }
        }

        public static decimal? GetSpShrPayDashboard(string eff_date)
        {
            using (var context = new ShareEntities())
            {
                context.Database.CommandTimeout = AppSetting.GetCommandTimeout();
                var result = context.sp_shr_pay_dashboard(eff_date, eff_date).FirstOrDefault();
                return result;
            }
        }

        public static List<sp_shr_telorance_dashboard_Result> GetSpShrTeloranceDashboard(string date_s, string date_e, decimal? finalFeeDiffS, decimal? finalFeeDiffE)
        {
            using (var context = new ShareEntities())
            {
                List<sp_shr_telorance_dashboard_Result> result = new List<sp_shr_telorance_dashboard_Result>(); 
                context.Database.CommandTimeout = AppSetting.GetCommandTimeout();
                if(finalFeeDiffS != null && finalFeeDiffE != null)
                {
                    result = context.sp_shr_telorance_dashboard(date_s, date_e).Where(t => t.diff >= finalFeeDiffS && t.diff <= finalFeeDiffE).ToList();
                }
                else
                {
                    result = context.sp_shr_telorance_dashboard(date_s, date_e).ToList();
                }
                return result;
            }
        }

        public static List<sp_shr_rpt_07_02_dashboard_Result1> GetSpShrRpt0702Dashboard(string date_s, string date_e, string fin_year_s, string fin_year_e,string shr_opr_code,string shrh_kind)
        {
            using (var context = new ShareEntities())
            {
                context.Database.CommandTimeout = AppSetting.GetCommandTimeout();
                var result = context.sp_shr_rpt_07_02_dashboard("","","","", shrh_kind,"", fin_year_s, fin_year_e, date_s, date_e, shr_opr_code,"").ToList();
                return result;
            }
        }

        public static List<sp_shr_rpt_07_02_assign_dashboard_Result> GetSpShrRpt0702AssignDashboard(string fin_year_s, string fin_year_e, string shr_opr_code, string shrh_kind)
        {
            using (var context = new ShareEntities())
            {
                context.Database.CommandTimeout = AppSetting.GetCommandTimeout();
                var result = context.sp_shr_rpt_07_02_assign_dashboard("", "", "", "", shrh_kind, "", fin_year_s, fin_year_e, shr_opr_code, "").ToList();
                return result;
            }
        }

        public static List<sp_shr_max_buyer_dashboard_Result> GetSpShrMaxBuyerDashboard(string date_s, string date_e, string shrh_kind,int? share, List<string> watchShareholder,string fullname, int? rowCount)
        {
            using (var context = new ShareEntities())
            {
                context.Database.CommandTimeout = AppSetting.GetCommandTimeout();
                var output = context.sp_shr_max_buyer_dashboard(date_s, date_e, shrh_kind, share, rowCount, fullname);
                var result = watchShareholder != null ? output.Where(x => watchShareholder.Any(z => x.SHRH_CODE == z)).ToList() : output.ToList();
                return result;
            }
        }

        public static List<sp_shr_max_seller_dashboard_Result> GetSpShrMaxSellerDashboard(string date_s, string date_e, string shrh_kind, int? share, List<string> watchShareholder, string fullname, int? rowCount)
        {
            using (var context = new ShareEntities())
            {
                context.Database.CommandTimeout = AppSetting.GetCommandTimeout();
                var output = context.sp_shr_max_seller_dashboard(date_s, date_e, shrh_kind, share, rowCount, fullname);
                var result = watchShareholder != null ? output.Where(x => watchShareholder.Any(z => x.SHA_SHRH_CODE == z)).ToList() : output.ToList();
                return result;
            }
        }

        public static List<sp_shr_seller_buyer_dashboard_Result> GetSpShrSellerBuyerDashboard(string shrhCodeList, string date_s, string date_e, string date_s_buy, string date_e_buy, string shrh_kind,string shareQuntType, string averageFeeType,string shareCountType, int? sellQnt, int? buyQnt)
        {
            using (var context = new ShareEntities())
            {
                context.Database.CommandTimeout = AppSetting.GetCommandTimeout();
                var output = context.sp_shr_seller_buyer_dashboard(shrhCodeList, date_s, date_e, date_s_buy, date_e_buy, shrh_kind, sellQnt, buyQnt);
                List<sp_shr_seller_buyer_dashboard_Result> result = output.ToList();
                switch (shareQuntType)
                {
                    case "S>B":
                        { result = result.Where(t => t.seller_sumshare > t.buyer_sumshare).ToList(); }
                        break;
                    case "B>S":
                        { result = result.Where(t => t.seller_sumshare < t.buyer_sumshare).ToList(); }
                        break;
                    case "S=B":
                        { result = result.Where(t => t.seller_sumshare == t.buyer_sumshare).ToList(); }
                        break;
                }

                switch (averageFeeType)
                {
                    case "S>B":
                        { result = result.Where(t => t.sell_fee_avg > t.buy_fee_avg).ToList(); }
                        break;
                    case "B>S":
                        { result = result.Where(t => t.sell_fee_avg < t.buy_fee_avg).ToList(); }
                        break;
                    case "S=B":
                        { result = result.Where(t => t.sell_fee_avg == t.buy_fee_avg).ToList(); }
                        break;
                }

                switch (shareCountType)
                {
                    case "S>B":
                        { result = result.Where(t => t.seller_cnt > t.buyer_cnt).ToList(); }
                        break;
                    case "B>S":
                        { result = result.Where(t => t.seller_cnt < t.buyer_cnt).ToList(); }
                        break;
                    case "S=B":
                        { result = result.Where(t => t.seller_cnt == t.buyer_cnt).ToList(); }
                        break;
                }

                return result.ToList();
            }
        }

        public static List<sp_shr_amnt_cap_dashboard_Result> GetSpShrAmntCapDashboard(string date_s, string date_e)
        {
            using (var context = new ShareEntities())
            {
                context.Database.CommandTimeout = AppSetting.GetCommandTimeout();
                var result = context.sp_shr_amnt_cap_dashboard(date_s, date_e).ToList();
                return result;
            }
        }

        public static List<sp_shr_user_task_dashboard_Result> GetSpShrUserTaskDashboard(string userId,string date_s, string date_e)
        {
            using (var context = new ShareEntities())
            {
                context.Database.CommandTimeout = AppSetting.GetCommandTimeout();
                var result = context.sp_shr_user_task_dashboard(userId, date_s, date_e).ToList();
                return result;
            }
        }

        public static List<sp_shr_rpt_44_dashboard_Result> GetSpShrRpt44Dashboard(string date_s, string date_e)
        {
            using (var context = new ShareEntities())
            {
                context.Database.CommandTimeout = AppSetting.GetCommandTimeout();
                var result = context.sp_shr_rpt_44_dashboard(0, date_s, date_e).ToList();
                return result;
            }
        }

        public static List<sp_shr_rpt_44_agent_dashboard_Result> GetSpShrRpt44AgentDashboard(string date_s, string date_e)
        {
            using (var context = new ShareEntities())
            {
                context.Database.CommandTimeout = AppSetting.GetCommandTimeout();
                var result = context.sp_shr_rpt_44_agent_dashboard(0, date_s, date_e).ToList();
                return result;
            }
        }

        public static List<sp_shr_rpt_season_dashboard_Result> GetSpShrRptSeasonDashboard(string fin_year)
        {
            using (var context = new ShareEntities())
            {
                context.Database.CommandTimeout = AppSetting.GetCommandTimeout();
                var result = context.sp_shr_rpt_season_dashboard(0, fin_year).ToList();
                return result;
            }
        }

        public static Array GetShrTransactionGroupByYear()
        {
            using (var context = new ShareEntities())
            {
                context.Database.CommandTimeout = AppSetting.GetCommandTimeout();
                var result = context.SHR_TRANSACTION.GroupBy(
                p => p.TBL_DATE.Substring(0, 4),
                p => p.SHR_QUNT,
                (key, g) => new { year = key, qnt = g.Sum(), cnt = g.Count(), qntperday = g.Sum() / 365, cntperday = g.Count() / 365 }).OrderByDescending(t => t.year).ToArray();
                return result;
            }
        }

        public static Array GetShareholderGeo()
        {
            using (var context = new ShareEntities())
            {
                context.Database.CommandTimeout = AppSetting.GetCommandTimeout();
                var result = context.SHAREHOLDERs.Join(
                      context.CITies,
                      shareholder => shareholder.CITYID,
                      city => city.CITYID, 
                      (shareholder, city) => new 
                      {
                          shrhCode = shareholder.SHRH_CODE,
                          cityName = city.DESC1,
                          cityId = city.CITYID,
                      }).GroupBy(
                p => new { p.cityId,p.cityName } ,
                p => p.shrhCode,
                (key, g) => new { cityName = key.cityName, cityId = key.cityId, cnt = g.Count()}).OrderByDescending(t => t.cnt).ToArray();;

                return result;



                //var result = context.SHAREHOLDERs.GroupBy(
                //p => p.TBL_DATE.Substring(0, 4),
                //p => p.SHR_QUNT,
                //(key, g) => new { year = key, qnt = g.Sum(), cnt = g.Count(), qntperday = g.Sum() / 365, cntperday = g.Count() / 365 }).OrderByDescending(t => t.year).ToArray();
                //return result;
            }
        }

        public static Array GetShrTransactionGroupByMonth()
        {
            using (var context = new ShareEntities())
            {
                context.Database.CommandTimeout = AppSetting.GetCommandTimeout();
                var output = context.SHR_TRANSACTION.GroupBy(
                p => new { year = p.TBL_DATE.Substring(0, 4), month = p.TBL_DATE.Substring(4, 2) },
                p => p.SHR_QUNT,
                (key, g) => new { key.year, key.month, qnt = g.Sum(), cnt = g.Count(), qntperday = g.Sum() / 30, cntperday = g.Count() / 30 }).OrderByDescending(t =>new { t.year, t.month }).Take(12).ToArray();
                var result = output.Select(t => new { t.year, t.month, monthDesc = EnumHelper.GetDescriptionFromId(Convert.ToInt32(t.month), new Month()), t.qnt, t.cnt, t.qntperday, t.cntperday }).ToArray();
                return result;
            }
        }

        public static List<sp_shr_max_buyer_by_agent_dashboard_Result> GetSpShrMaxBuyerByAgentDashboard(string date_s, string date_e, string shrh_kind)
        {
            using (var context = new ShareEntities())
            {
                context.Database.CommandTimeout = AppSetting.GetCommandTimeout();
                var output = context.sp_shr_max_buyer_by_agent_dashboard(date_s, date_e, shrh_kind);
                var result = output.ToList();
                return result;
            }
        }

        public static List<sp_shr_max_seller_by_agent_dashboard_Result> GetSpShrMaxSellerByAgentDashboard(string date_s, string date_e, string shrh_kind)
        {
            using (var context = new ShareEntities())
            {
                context.Database.CommandTimeout = AppSetting.GetCommandTimeout();
                var output = context.sp_shr_max_seller_by_agent_dashboard(date_s, date_e, shrh_kind);
                var result = output.ToList();
                return result;
            }
        }

        public static List<sp_shr_buyer_agent_detail_dashboard_Result> GetSpShrBuyerAgentDetailDashboard(string date_s, string date_e, string shrh_kind,string agent_code)
        {
            using (var context = new ShareEntities())
            {
                context.Database.CommandTimeout = AppSetting.GetCommandTimeout();
                var output = context.sp_shr_buyer_agent_detail_dashboard(date_s, date_e, shrh_kind, agent_code);
                var result = output.ToList();
                return result;
            }
        }

        public static List<sp_shr_seller_agent_detail_dashboard_Result> GetSpShrSellerAgentDetailDashboard(string date_s, string date_e, string shrh_kind, string agent_code)
        {
            using (var context = new ShareEntities())
            {
                context.Database.CommandTimeout = AppSetting.GetCommandTimeout();
                var output = context.sp_shr_seller_agent_detail_dashboard(date_s, date_e, shrh_kind, agent_code);
                var result = output.ToList();
                return result;
            }
        }

        public static List<sp_shr_rpt_44_shrh_kind_dashboard_Result> GetSpShrRpt44ShrhKindDashboard(decimal? kind_flag,string date_s, string date_e, string shareQuntType)
        {
            using (var context = new ShareEntities())
            {
                context.Database.CommandTimeout = AppSetting.GetCommandTimeout();
                var output = context.sp_shr_rpt_44_shrh_kind_dashboard(kind_flag, date_s, date_e);
                List<sp_shr_rpt_44_shrh_kind_dashboard_Result> result = output.ToList();
                switch (shareQuntType)
                {
                    case "A>L":
                        { result = result.Where(t => t.SHR_QUNT_ACTUAL > t.SHR_QUNT_LEGAL).ToList(); }
                        break;
                    case "L>A":
                        { result = result.Where(t => t.SHR_QUNT_ACTUAL < t.SHR_QUNT_LEGAL).ToList(); }
                        break;
                }
                return result.ToList();
            }
        }

        public static List<sp_shr_rpt_17_dashboard_Result> GetSpShrRpt17Dashboard(string finYearS, string finYearE, string shrOprCode,string shrhCodeList)
        {
            using (var context = new ShareEntities())
            {
                context.Database.CommandTimeout = AppSetting.GetCommandTimeout();
                var output = context.sp_shr_rpt_17_dashboard(finYearS, finYearE, shrOprCode, shrhCodeList);
                var result = output.ToList();
                return result;
            }
        }

        public static List<sp_shr_rpt_02_dashboard_Result> GetSpShrRpt02Dashboard(string shrhCodeList, string shrhKind,decimal? shrQuntS,decimal? shrQuntE, decimal? shareS, decimal? shareE,string dateS,string dateE,string trnsKind,string relTypeFlag)
        {
            using (var context = new ShareEntities())
            {
                context.Database.CommandTimeout = AppSetting.GetCommandTimeout();
                var output = context.sp_shr_rpt_02_dashboard(shrhCodeList, shrhKind, "", shrQuntS, shrQuntE, shareS, shareE, "", "", "", dateS, dateE, 0, 0, 0, 0, trnsKind, "", "", "", relTypeFlag, "", 0, 0);
                var result = output.ToList();
                return result;
            }
        }

        public static List<sp_fb_shr_trans_dashboard_Result> GetSpFbShrTransDashboard(string shrhCodeList, string date)
        {
            using (var context = new ShareEntities())
            {
                context.Database.CommandTimeout = AppSetting.GetCommandTimeout();
                var output = context.sp_fb_shr_trans_dashboard(shrhCodeList, date);
                var result = output.ToList();
                return result;
            }
        }

        public static List<sp_shr_rpt_07_dashboard_Result> GetSpFbShrRpt07Dashboard(string shrhCodeList,string shrhKind,string finYearS, string finYearE, string date,string shrOprCode)
        {
            using (var context = new ShareEntities())
            {
                context.Database.CommandTimeout = AppSetting.GetCommandTimeout();
                var output = context.sp_shr_rpt_07_dashboard(shrhCodeList, shrhKind, "0", finYearS, finYearE, date, shrOprCode, "0");
                var result = output.ToList();
                return result;
            }
        }

        public static List<sp_shr_rpt_16_dashboard_Result> GetSpShrRpt16Dashboard(string shrhCodeList, string shrMeetDate, string shrhKind,string finYearCode,decimal? shrQuntS, decimal? shrQuntE, decimal? shareS, decimal? shareE)
        {
            using (var context = new ShareEntities())
            {
                context.Database.CommandTimeout = AppSetting.GetCommandTimeout();
                var output = context.sp_shr_rpt_16_dashboard(shrhCodeList, shrMeetDate, shrhKind, finYearCode, shrQuntS, shrQuntE, shareS, shareE);
                var result = output.ToList();
                return result;
            }
        }

        public static List<sp_fb_shr_fin_info_dashboard_Result> GetSpFbShrFinInfoDashboard(string shrhCodeList, string shrhKind, string dateS, string dateE, string finYearCode, string shrOprCode)
        {
            using (var context = new ShareEntities())
            {
                context.Database.CommandTimeout = AppSetting.GetCommandTimeout();
                var output = context.sp_fb_shr_fin_info_dashboard(shrhCodeList, shrhKind, dateS, dateE, finYearCode, shrOprCode,"0","");
                var result = output.ToList();
                return result;
            }
        }

        public static List<ShareholderTransStateModel> GetTransactionOfShareholder(string shrhCode, string dateS, string dateE)
        {

            var numericDateS = dateS == "" ? 0 : Convert.ToDecimal(dateS);
            var numericDateE = dateE == "" ? 0 : Convert.ToDecimal(dateE);
            var output = ShrTransactionRepository.GetTransactionOfShareholder(shrhCode);
            var result = output.Where(t => (Convert.ToDecimal(t.TblDate) >= numericDateS || numericDateS == 0) && (Convert.ToDecimal(t.TblDate) <= numericDateE || numericDateE == 0)).Select(t => new ShareholderTransStateModel {TblDate = DateTimeHelper.ToPersianFormat(t.TblDate), ShrQuntBuy = t.ShrQuntBuy, ShrQuntSell = t.ShrQuntSell }).ToList();
            return result;
        }

        public static ShareholderCompletionRateListModel GetShareholderCompletionRateInformation()
        {

            var shareholderCount = ShareholerRepository.GetShareholderCount();

            var cellPhoneModel = new ShareholderCompletionRateModel();
            cellPhoneModel.CompletionTitle = CaptionsLibrary.MobileNumber;
            cellPhoneModel.CompletionCount = ShareholerRepository.GetCellPhoneCompletionCount();
            cellPhoneModel.CompletionPercent = Math.Round((cellPhoneModel.CompletionCount / shareholderCount) * 100, 2);
            cellPhoneModel.InCompletionPercent = cellPhoneModel.CompletionPercent - 100;

            var addressModel = new ShareholderCompletionRateModel();
            addressModel.CompletionTitle = CaptionsLibrary.Address;
            addressModel.CompletionCount = ShareholerRepository.GetAddressCompletionCount();
            addressModel.CompletionPercent = Math.Round((addressModel.CompletionCount / shareholderCount) * 100, 2);
            addressModel.InCompletionPercent = addressModel.CompletionPercent - 100;

            var natCodeModel = new ShareholderCompletionRateModel();
            natCodeModel.CompletionTitle = CaptionsLibrary.NationalCode;
            natCodeModel.CompletionCount = ShareholerRepository.GetNatCodeCompletionCount();
            natCodeModel.CompletionPercent = Math.Round((natCodeModel.CompletionCount / shareholderCount) * 100, 2);
            natCodeModel.InCompletionPercent = natCodeModel.CompletionPercent - 100;

            var birthDateModel = new ShareholderCompletionRateModel();
            birthDateModel.CompletionTitle = CaptionsLibrary.BirthDate;
            birthDateModel.CompletionCount = ShareholerRepository.GetBirthDateCompletionCount();
            birthDateModel.CompletionPercent = Math.Round((birthDateModel.CompletionCount / shareholderCount) * 100, 2);
            birthDateModel.InCompletionPercent = birthDateModel.CompletionPercent - 100;

            var shrhAccModel = new ShareholderCompletionRateModel();
            shrhAccModel.CompletionTitle = CaptionsLibrary.AccountNumber;
            shrhAccModel.CompletionCount = ShareholerRepository.GetShrhAccCompletionCount();
            shrhAccModel.CompletionPercent = Math.Round((shrhAccModel.CompletionCount / shareholderCount) * 100, 2);
            shrhAccModel.InCompletionPercent = shrhAccModel.CompletionPercent - 100;

            var spBankCodeModel = new ShareholderCompletionRateModel();
            spBankCodeModel.CompletionTitle = CaptionsLibrary.PublicAccountNumber;
            spBankCodeModel.CompletionCount = ShareholerRepository.GetSpBankCodeCompletionCount();
            spBankCodeModel.CompletionPercent = Math.Round((spBankCodeModel.CompletionCount / shareholderCount) * 100, 2);
            spBankCodeModel.InCompletionPercent = spBankCodeModel.CompletionPercent - 100;

            var emailModel = new ShareholderCompletionRateModel();
            emailModel.CompletionTitle = CaptionsLibrary.Email;
            emailModel.CompletionCount = ShareholerRepository.GetEmailCompletionCount();
            emailModel.CompletionPercent = Math.Round((emailModel.CompletionCount / shareholderCount) * 100, 2);
            emailModel.InCompletionPercent = emailModel.CompletionPercent - 100;

            var zipCodeModel = new ShareholderCompletionRateModel();
            zipCodeModel.CompletionTitle = CaptionsLibrary.PostalCode;
            zipCodeModel.CompletionCount = ShareholerRepository.GetZipCodeCompletionCount();
            zipCodeModel.CompletionPercent = Math.Round((zipCodeModel.CompletionCount / shareholderCount) * 100, 2);
            zipCodeModel.InCompletionPercent = zipCodeModel.CompletionPercent - 100;

            var telNoModel = new ShareholderCompletionRateModel();
            telNoModel.CompletionTitle = CaptionsLibrary.Telephone;
            telNoModel.CompletionCount = ShareholerRepository.GetTelNoCompletionCount();
            telNoModel.CompletionPercent = Math.Round((telNoModel.CompletionCount / shareholderCount) * 100, 2);
            telNoModel.InCompletionPercent = telNoModel.CompletionPercent - 100;

            var completionRateModel = new ShareholderCompletionRateListModel();
            completionRateModel.CellphoneModel = cellPhoneModel;
            completionRateModel.AddressModel = addressModel;
            completionRateModel.NatCodeModel = natCodeModel;
            completionRateModel.BirthDateModel = birthDateModel;
            completionRateModel.ShrhAccModel = shrhAccModel;
            completionRateModel.SpBankCodeModel = spBankCodeModel;
            completionRateModel.EmailModel = emailModel;
            completionRateModel.ZipCodeModel = zipCodeModel;
            completionRateModel.TelNoModel = telNoModel;

            return completionRateModel;
        }

        public static List<ShareSwingWithCountAndQuantModel> GetShareSwingWithCountAndQuant(string dateS, string dateE, decimal? finalFeeDiffS, decimal? finalFeeDiffE)
        {
            var teloranceDataList = GetSpShrTeloranceDashboard(dateS, dateE, finalFeeDiffS, finalFeeDiffE);

            var quantDataList = GetSpShrRpt44Dashboard(dateS, dateE);

            var buyQuantdataList = ReportHelper.GetSpShrRpt44ShrhKindDashboard(1, dateS, dateE, "all");

            var sellQuantdataList = ReportHelper.GetSpShrRpt44ShrhKindDashboard(2, dateS, dateE, "all");

            var queryDataList = from teloranceItem in teloranceDataList
                                join quantItem in quantDataList
                                     on teloranceItem.tbl_date equals quantItem.tbl_date
                                join buyQuantItem in buyQuantdataList
                                     on teloranceItem.tbl_date equals buyQuantItem.TBL_DATE
                                join sellQuantItem in sellQuantdataList
                                on teloranceItem.tbl_date equals sellQuantItem.TBL_DATE
                                select new ShareSwingWithCountAndQuantModel
                                {
                                    TblDate = teloranceItem.tbl_date,
                                    FinalFee = teloranceItem.final_fee,
                                    YesterdayFinalFee = teloranceItem.yesterday_final_fee,
                                    Diff = teloranceItem.diff,
                                    MaxFinalFee = teloranceItem.max_fee,
                                    MinFinalFee = teloranceItem.min_fee,
                                    Quant = quantItem.qnt,
                                    Count = quantItem.cnt,
                                    BuyQuantActual = buyQuantItem.SHR_QUNT_ACTUAL,
                                    BuyQuantLegal = buyQuantItem.SHR_QUNT_LEGAL,
                                    SellQuantActual = sellQuantItem.SHR_QUNT_ACTUAL,
                                    SellQuantLegal = sellQuantItem.SHR_QUNT_LEGAL
                                };
            var result = queryDataList.ToList();
            return result;
        }
    }
}