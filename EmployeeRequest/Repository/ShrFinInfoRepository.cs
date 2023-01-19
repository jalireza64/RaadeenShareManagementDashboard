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
    public class ShrFinInfoRepository
    {
        public static List<AmountModel> GetCapitalInfo04(List<string> shrhCodeList, string finYear)
        {
            using (var context = new ShareEntities())
            {
                var output = context.SHR_FIN_INFO.Where(t => t.FIN_YEAR_CODE == finYear && t.SHR_OPR_CODE == "04" && t.CAP_DATE != null).ToList();
                var All = shrhCodeList != null ? output.Where(x => shrhCodeList.Any(z => x.SHRH_CODE == z)).ToList() : output.ToList();

                var resultQuery = from p in All
                                 group p by p.SHRH_CODE into g
                                 select new AmountModel
                                 {
                                     ShrhCode = g.Key,
                                     Amnt = g.Sum(t => t.AMNT)
                                 };
                var result = resultQuery.ToList();

                return result;
            }
        }

        public static List<AmountModel> GetCapitalInfo05(List<string> shrhCodeList, string finYear)
        {
            using (var context = new ShareEntities())
            {
                var output = context.SHR_FIN_INFO.Where(t => t.FIN_YEAR_CODE == finYear && t.SHR_OPR_CODE == "05" && t.CAP_DATE != null).ToList();
                var All = shrhCodeList != null ? output.Where(x => shrhCodeList.Any(z => x.SHRH_CODE == z)).ToList() : output.ToList();

                var resultQuery = from p in All
                                  group p by p.SHRH_CODE into g
                                  select new AmountModel
                                  {
                                      ShrhCode = g.Key,
                                      Amnt = g.Sum(t => t.AMNT)
                                  };
                var result = resultQuery.ToList();

                return result;
            }
        }

        public static List<AmountModel> GetCapitalInfo07(List<string> shrhCodeList, string finYear)
        {
            using (var context = new ShareEntities())
            {
                var output = context.SHR_FIN_INFO.Where(t => t.FIN_YEAR_CODE == finYear && t.SHR_OPR_CODE == "07" && t.CAP_DATE != null).ToList();
                var All = shrhCodeList != null ? output.Where(x => shrhCodeList.Any(z => x.SHRH_CODE == z)).ToList() : output.ToList();

                var resultQuery = from p in All
                                  group p by p.SHRH_CODE into g
                                  select new AmountModel
                                  {
                                      ShrhCode = g.Key,
                                      Amnt = g.Sum(t => t.AMNT)
                                  };
                var result = resultQuery.ToList();

                return result;
            }
        }
    }
}