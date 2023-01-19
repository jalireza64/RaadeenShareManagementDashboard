using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace EmployeeRequest.ViewModel
{
    public class AmountModel
    {
        public string ShrhCode { get; set; }

        public decimal? Amnt { get; set; }

    }
}