using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;
using EmployeeRequest.ViewModel;
using EmployeeRequest.Infrastracture.Helpers;
using EmployeeRequest.Infrastracture.Enums;
using App_Resources;
using EmployeeRequest.SpClasses;

namespace EmployeeRequest.Repository
{
    public class ShareholerRepository
    {
        public static SHAREHOLDER GetShareholder(string shrhCode)
        {
            using (var context = new ShareEntities())
            {
                var shareholderPerson = context.SHAREHOLDERs.Where(t => t.SHRH_CODE == shrhCode).FirstOrDefault();
                return shareholderPerson;
            }
        }

        public static bool CheckShrhCodeValidity(string shrhCode)
        {
            using (var context = new ShareEntities())
            {
                var shareholderPerson = context.SHAREHOLDERs.Where(t=>t.SHRH_CODE == shrhCode).Select(t => t.SHRH_CODE).ToList();
                if(shareholderPerson.Count == 1)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }

        public static List<ShareholderWatchModel> GetShareholderWatchInformation(List<string> shrhCodeList, string lastReadDateOfBBS)
        {
            var finalFee = Convert.ToInt64(ReportHelper.GetSpShrTeloranceDashboard(lastReadDateOfBBS, lastReadDateOfBBS, null, null).FirstOrDefault().final_fee);
            List<ShareholderWatchModel> shareholderWatchList = new List<ShareholderWatchModel>();
            using (var context = new ShareEntities())
            {
                if (shrhCodeList != null)
                {
                    foreach (string shrhCode in shrhCodeList)
                    {
                        var maxTblDate = context.SHR_TRANSACTION.Where(t => (t.SHRH_CODE == shrhCode || t.SHA_SHRH_CODE == shrhCode) && t.TRNS_OK == "2").Max(t => t.TBL_DATE);

                        var watchInformationBuy = (from tr in context.SHR_TRANSACTION
                                                join sh in context.SHAREHOLDERs on tr.SHRH_CODE equals sh.SHRH_CODE
                                                join vtr in context.v_fb_shr_shrh_info on sh.SHRH_CODE equals vtr.shrh_code
                                                where (tr.SHRH_CODE == shrhCode)
                                                && (tr.TBL_DATE == maxTblDate)
                                                select new ShareholderWatchModel
                                                {
                                                    ShrhCode = tr.SHRH_CODE,
                                                    ShareholderKind = sh.SHRH_KIND == "1" ? ShareholderKind.Actual : ShareholderKind.Legal,
                                                    TransactionType = tr.SHRH_CODE == shrhCode ? TransactionType.Buy : TransactionType.Sell,
                                                    TransactionTypeDesc = tr.SHRH_CODE == shrhCode ? CaptionsLibrary.Buy : CaptionsLibrary.Sell,
                                                    Fullname = sh.SHRH_KIND == "1" ? sh.NAME1 + " " + sh.SURNAME1 : sh.INSTITUTE,
                                                    LastTrDate = tr.TBL_DATE.Substring(0, 4) + "/" + tr.TBL_DATE.Substring(4, 2) + "/" + tr.TBL_DATE.Substring(6, 2),
                                                    Share = tr.SHR_QUNT,
                                                    ShareRemaining = vtr.share,
                                                    FinanceRemaining = vtr.sum_mone,
                                                    Amount = tr.AMNT,
                                                    PresentValueOfStockAssets = vtr.share * finalFee
                                                }).FirstOrDefault();

                        var watchInformationSell = (from tr in context.SHR_TRANSACTION
                                                join sh in context.SHAREHOLDERs on tr.SHA_SHRH_CODE equals sh.SHRH_CODE
                                                join vtr in context.v_fb_shr_shrh_info on sh.SHRH_CODE equals vtr.shrh_code
                                                where (tr.SHA_SHRH_CODE == shrhCode)
                                                && (tr.TBL_DATE == maxTblDate)
                                                select new ShareholderWatchModel
                                                {
                                                    ShrhCode = shrhCode,
                                                    ShareholderKind = sh.SHRH_KIND == "1" ? ShareholderKind.Actual : ShareholderKind.Legal,
                                                    TransactionType = tr.SHRH_CODE == shrhCode ? TransactionType.Buy : TransactionType.Sell,
                                                    TransactionTypeDesc = tr.SHRH_CODE == shrhCode ? CaptionsLibrary.Buy : CaptionsLibrary.Sell,
                                                    Fullname = sh.SHRH_KIND == "1" ? sh.NAME1 + " " + sh.SURNAME1 : sh.INSTITUTE,
                                                    LastTrDate = tr.TBL_DATE.Substring(0, 4) + "/" + tr.TBL_DATE.Substring(4, 2) + "/" + tr.TBL_DATE.Substring(6, 2),
                                                    Share = tr.SHR_QUNT,
                                                    ShareRemaining = vtr.share,
                                                    FinanceRemaining = vtr.sum_mone,
                                                    Amount = tr.AMNT,
                                                    PresentValueOfStockAssets = vtr.share * finalFee
                                                }).FirstOrDefault();

                        if (watchInformationBuy != null)
                        {
                            shareholderWatchList.Add(watchInformationBuy);
                        }
                        if (watchInformationSell != null)
                        {
                            shareholderWatchList.Add(watchInformationSell);
                        }
                    }
                }
                return shareholderWatchList;
            }
        }

        public static int GetShareholderCount()
        {
            using (var context = new ShareEntities())
            {
                var count = context.SHAREHOLDERs.Count();
                return count;
            }
        }

        public static int GetCellPhoneCompletionCount()
        {
            using (var context = new ShareEntities())
            {
                var count = context.SHAREHOLDERs.Where(t => t.CELL_PHONE != null).Count();
                return count;
            }
        }

        public static int GetAddressCompletionCount()
        {
            using (var context = new ShareEntities())
            {
                var count = context.SHAREHOLDERs.Where(t => t.ADDRESS != null).Count();
                return count;
            }
        }

        public static int GetNatCodeCompletionCount()
        {
            using (var context = new ShareEntities())
            {
                var count = context.SHAREHOLDERs.Where(t => t.NAT_CODE != null).Count();
                return count;
            }
        }

        public static int GetBirthDateCompletionCount()
        {
            using (var context = new ShareEntities())
            {
                var count = context.SHAREHOLDERs.Where(t => t.D1_BIRTH != null).Count();
                return count;
            }
        }

        public static int GetShrhAccCompletionCount()
        {
            using (var context = new ShareEntities())
            {
                var count = context.SHAREHOLDERs.Where(t => t.SHRH_ACC != null).Count();
                return count;
            }
        }

        public static int GetSpBankCodeCompletionCount()
        {
            using (var context = new ShareEntities())
            {
                var count = context.SHAREHOLDERs.Where(t => t.SP_BANK_CODE != null).Count();
                return count;
            }
        }

        public static int GetEmailCompletionCount()
        {
            using (var context = new ShareEntities())
            {
                var count = context.SHAREHOLDERs.Where(t => t.E_MAIL != null).Count();
                return count;
            }
        }

        public static int GetZipCodeCompletionCount()
        {
            using (var context = new ShareEntities())
            {
                var count = context.SHAREHOLDERs.Where(t => t.ZIP_CODE != null).Count();
                return count;
            }
        }

        public static int GetTelNoCompletionCount()
        {
            using (var context = new ShareEntities())
            {
                var count = context.SHAREHOLDERs.Where(t => t.TEL_NO_1 != null || t.TEL_NO_2 != null).Count();
                return count;
            }
        }
    }
}