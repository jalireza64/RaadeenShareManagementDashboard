using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;
using EmployeeRequest.ViewModel;
using EmployeeRequest.Infrastracture.Helpers;
using EmployeeRequest.Infrastracture.Enums;
using App_Resources;

namespace EmployeeRequest.Repository.Dashboard
{
    public class EntryAndExitLogRepository
    {
        public static bool AddEntryAndExitLog(EntryAndExitLog entryAndExitLog)
        {
            using (var db = new Entities())
            {
                var entryAndExitLogs = db.Set<EntryAndExitLog>();
                entryAndExitLogs.Add(entryAndExitLog);
                var result = db.SaveChanges();
                if (result > 0)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }

    }
}