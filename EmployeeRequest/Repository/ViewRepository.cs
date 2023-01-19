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
    public class ViewRepository
    {
        public static long? GetSumOfAllShares()
        {
            using (var context = new ShareEntities())
            {
                var result = context.v_fb_shr_shrh_sum.Sum(t => t.share);
                return result;
            }
        }

        public static Int64? GetCountOfActiveShareholder()
        {
            using (var context = new ShareEntities())
            {
                var result = context.v_fb_shr_shrh_sum.Count();
                return result;
            }
        }
    }
}