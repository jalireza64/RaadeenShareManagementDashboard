using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;

namespace EmployeeRequest.SpClasses
{
    public class FilterHelper
    {
        public static List<string> GetAllFinYear()
        {
            using (var context = new ShareEntities())
            {
                var result = context.FIN_YEAR.OrderBy(x=>x.FIN_YEAR_CODE).Select(t => t.FIN_YEAR_CODE);
                return result.ToList();
            }
        }

        public static List<FIN_YEAR> GetAllFinYearWithDetail()
        {
            using (var context = new ShareEntities())
            {
                var result = context.FIN_YEAR.OrderBy(x => x.FIN_YEAR_CODE);
                return result.ToList();
            }
        }

        public static FIN_YEAR GetFinYear(string finYear)
        {
            using (var context = new ShareEntities())
            {
                var result = context.FIN_YEAR.Where(t => t.FIN_YEAR_CODE == finYear).FirstOrDefault();
                return result;
            }
        }

        public static List<string> GetCurrentFinYearAndPastFinYear(string finYear)
        {
            using (var context = new ShareEntities())
            {
                var allFinYear = context.FIN_YEAR.OrderBy(x => x.FIN_YEAR_CODE).Select(t => t.FIN_YEAR_CODE).ToList();
                var selectedFinYear = context.FIN_YEAR.Where(t => t.FIN_YEAR_CODE == finYear).Select(t=>t.FIN_YEAR_CODE).FirstOrDefault();
                var reversed = context.FIN_YEAR.OrderByDescending(p => p.FIN_YEAR_CODE).ToList();
                var pastFinYear = reversed.SkipWhile(p => p.FIN_YEAR_CODE != finYear).Skip(1).FirstOrDefault()?.FIN_YEAR_CODE;

                var result = new List<string>(2) { selectedFinYear, pastFinYear };

                return result.ToList();
            }
        }
    }
}