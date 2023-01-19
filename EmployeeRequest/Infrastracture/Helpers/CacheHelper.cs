using EmployeeRequest.Infrastracture.Config;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Caching;
using System.Web;
using System.Web.Http.Results;
using System.Web.Mvc;

namespace EmployeeRequest.Infrastracture.Helpers
{
    public class CacheHelper
    {
        public static bool AddResultToCache(string cacheKey, object item)
        {
            var cacheValidityMinutes = AppSetting.GetCacheValidityMinutes();
            ObjectCache cache = MemoryCache.Default;
            CacheItemPolicy cacheItemPolicy = new CacheItemPolicy();
            cacheItemPolicy.AbsoluteExpiration = DateTime.Now.AddMinutes(cacheValidityMinutes);
            var result = cache.Add(cacheKey, item, cacheItemPolicy);
            return result;
        }

        public static object GetResultFromCache(string cacheKey)
        {
            ObjectCache cache = MemoryCache.Default;
            if (cache.Contains(cacheKey))
            {
                object result = (JsonResult)cache.Get(cacheKey);
                //cache.Remove(cacheKey);
                return result;
            }
            else
            {
                return null;
            }
        }
    }
}