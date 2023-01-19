using EmployeeRequest.Infrastracture.Enums;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;

namespace EmployeeRequest.SpClasses
{
    public class UsersHelper
    {
        public static List<USER> GetAllUsers()
        {
            using (var context = new Entities())
            {
                var result = context.USERS.Include(t => t.AccessLevel).ToList();
                return result;
            }
        }

        public static Dictionary<int,string> GetAllAccessLevelDetails()
        {
            var dict = new Dictionary<int, string>();
            foreach (var name in Enum.GetNames(typeof(AccessLevelDetails)))
            {
                dict.Add((int)Enum.Parse(typeof(AccessLevelDetails), name), ((AccessLevelDetails)(int)Enum.Parse(typeof(AccessLevelDetails), name)).GetDescription());
            }
            return dict;
        }

        public static USER GetUser(decimal id)
        {
            using (var context = new Entities())
            {
                var result = context.USERS.Where(t=>t.Id == id).FirstOrDefault();
                return result;
            }
        }

        public static List<AccessLevel> GetAllAccessLevels()
        {
            using (var context = new Entities())
            {
                var result = context.AccessLevels.Include(t=>t.Accesses).ToList();
                return result;
            }
        }

        public static bool AddAccessLevels(AccessLevel accessLevel, List<decimal> accessList)
        {
            using (var db = new Entities())
            {
                var accessLevels = db.Set<AccessLevel>();
                accessLevels.Add(accessLevel);
                var accessLevelResult = db.SaveChanges();

                var accesses = db.Set<Access>();
                foreach (decimal access in accessList)
                {
                    var accessObject = new Access
                    {
                        AccessLevelId = accessLevel.Id,
                        AccessId = access
                    };
                    accesses.Add(accessObject);
                }       
                var accessesResult = db.SaveChanges();

                if (accessLevelResult > 0 && accessesResult > 0)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }

        public static bool ModifyAccessLevel(AccessLevel accessLevel, List<decimal> accessList)
        {
            using (var db = new Entities())
            {
                db.Configuration.ValidateOnSaveEnabled = false;

                //delete
                var deletedAccess = db.Accesses.Where(t => t.AccessLevelId == accessLevel.Id).ToList();
                foreach (Access access in deletedAccess)
                {
                    db.Accesses.Attach(access);
                    db.Entry(access).State = EntityState.Deleted;
                }
                var deletedAccessResult = db.SaveChanges();
                db.Dispose();
            }
            using (var db = new Entities())
            {
                //add
                foreach (decimal access in accessList)
                {
                    var accessObject = new Access
                    {
                        AccessLevelId = accessLevel.Id,
                        AccessId = access
                    };
                    
                    db.Accesses.Attach(accessObject);
                    db.Entry(accessObject).State = EntityState.Added;
                }
                //var accessesResult = db.SaveChanges();

                db.AccessLevels.Attach(accessLevel);
                db.Entry(accessLevel).State = EntityState.Modified;
                var accessLevelResult = db.SaveChanges();
                db.Dispose();
                if (accessLevelResult > 0)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }

        public static bool RemoveAccessLevel(AccessLevel accessLevel)
        {
            // remove
            using (var db = new Entities())
            {
                db.Configuration.ValidateOnSaveEnabled = false;
                //delete
                var deletedAccess = db.Accesses.Where(t => t.AccessLevelId == accessLevel.Id).ToList();
                foreach (Access access in deletedAccess)
                {
                    db.Accesses.Attach(access);
                    db.Entry(access).State = EntityState.Deleted;
                }
                //var accessesResult = db.SaveChanges();

                db.AccessLevels.Attach(accessLevel);
                db.Entry(accessLevel).State = EntityState.Deleted;
                var accessLevelResult = db.SaveChanges();

                if (accessLevelResult > 0)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }

        public static bool AddUser(USER user)
        {
            // insert
            using (var db = new Entities())
            {
                var customers = db.Set<USER>();
                customers.Add(user);
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

        public static bool ModifyUser(USER user)
        {
            // modify
            using (var db = new Entities())
            {
                db.USERS.Attach(user);
                db.Entry(user).State = EntityState.Modified;
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

        public static bool RemoveUser(USER user)
        {
            // remove
            using (var db = new Entities())
            {
                //var customers = db.Set<USER>();
                db.Configuration.ValidateOnSaveEnabled = false;
                db.USERS.Attach(user);
                db.Entry(user).State = EntityState.Deleted;
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