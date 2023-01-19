using EmployeeRequest.Repository.Dashboard;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EmployeeRequest.Infrastracture.Helpers
{
    public class ShareholderWatchHelper
    {
        public static List<string> GetShrhCodeListFromWatchList(List<decimal> watchShareholderIds)
        {
            List<string> shrhCodeList = new List<string>();

            if(watchShareholderIds != null)
            {
                foreach (decimal id in watchShareholderIds)
                {
                    var item = ShareholderWatchRepository.GetShareholderWatch(id).WatchList.Split(',').ToList();
                    shrhCodeList.AddRange(item);
                }
            }
            
            return shrhCodeList.Distinct().ToList();
        }
    }
}