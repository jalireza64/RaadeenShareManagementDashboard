using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;
using EmployeeRequest.ViewModel;
using EmployeeRequest.Infrastracture.Helpers;
using EmployeeRequest.Infrastracture.Enums;
using App_Resources;

namespace EmployeeRequest.Repository
{
    public class ShrTransactionRepository
    {
        public static string GetLastReadDateOfBBS()
        {
            using (var context = new ShareEntities())
            {
                var result = context.SHR_TRANSACTION.Where(t=>t.TRNS_OK == "2").Max(t=>t.TBL_DATE);
                return result;
            }
        }

        public static List<ShareholderTransStateModel> GetTransactionOfShareholder(string shrhCode)
        {
            using (var context = new ShareEntities())
            {
                var buyList = context.SHR_TRANSACTION.Where(t => t.TRNS_OK == "2" && t.SHRH_CODE == shrhCode);
                var buyQuery = from buyItem in buyList
                            group buyItem by buyItem.TBL_DATE into g
                            select new ShareholderTransStateModel
                            {
                                TblDate = g.Key,
                                ShrQuntBuy = g.Sum(t => t.SHR_QUNT),
                                ShrQuntSell = 0
                            };
                var buyResult = buyQuery.ToList();

                var sellList = context.SHR_TRANSACTION.Where(t => t.TRNS_OK == "2" && t.SHA_SHRH_CODE == shrhCode);
                var sellQuery = from sellItem in sellList
                               group sellItem by sellItem.TBL_DATE into g
                               select new ShareholderTransStateModel
                               {
                                   TblDate = g.Key,
                                   ShrQuntBuy = 0,
                                   ShrQuntSell = -g.Sum(t => t.SHR_QUNT)
                               };
                var sellResult = sellQuery.ToList();

                var allResult = buyResult.Union(sellResult).OrderBy(t=>t.TblDate).ToList();
                var result = from allItem in allResult
                             group allItem by allItem.TblDate into g
                             select new ShareholderTransStateModel
                             {
                                 TblDate = g.Key,
                                 ShrQuntBuy = g.Sum(t => t.ShrQuntBuy),
                                 ShrQuntSell = g.Sum(t => t.ShrQuntSell)
                             };
                return result.ToList();
            };
        }

    }
}