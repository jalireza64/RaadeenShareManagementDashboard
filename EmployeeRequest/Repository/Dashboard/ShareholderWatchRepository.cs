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
    public class ShareholderWatchRepository
    {
        public static bool AddShareholderWatch(ShareholderWatch shareholderWatch)
        {
            using (var db = new Entities())
            {
                var shareholderWatches = db.Set<ShareholderWatch>();
                shareholderWatches.Add(shareholderWatch);
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

        public static bool ModifyShareholderWatch(ShareholderWatch shareholderWatch)
        {
            // modify
            using (var db = new Entities())
            {
                db.ShareholderWatches.Attach(shareholderWatch);
                db.Entry(shareholderWatch).State = EntityState.Modified;
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

        public static bool RemoveShareholderWatch(ShareholderWatch shareholderWatch)
        {
            // remove
            using (var db = new Entities())
            {
                //var customers = db.Set<USER>();
                db.Configuration.ValidateOnSaveEnabled = false;
                db.ShareholderWatches.Attach(shareholderWatch);
                db.Entry(shareholderWatch).State = EntityState.Deleted;
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

        public static ShareholderWatch GetShareholderWatch(decimal id)
        {
            using (var context = new Entities())
            {
                var result = context.ShareholderWatches.Where(t => t.Id == id).FirstOrDefault();
                return result;
            }
        }

        public static List<ShareholderWatch> GetAllShareholderWatches()
        {
            using (var context = new Entities())
            {
                var result = context.ShareholderWatches.Include(t => t.USER).ToList();
                return result;
            }
        }
    }
}