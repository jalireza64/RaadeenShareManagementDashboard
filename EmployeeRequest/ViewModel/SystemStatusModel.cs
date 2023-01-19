using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace EmployeeRequest.ViewModel
{
    public class SystemStatusModel
    {
        public string CurrentDate { get; set; }

        public string TblDate { get; set; }

        public long? SumOfShares { get; set; }

        public long? CountOfActiveShareholder { get; set; }

        public decimal? FinalFee { get; set; }
    }
}