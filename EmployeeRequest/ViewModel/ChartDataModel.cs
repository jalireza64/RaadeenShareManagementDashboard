using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace EmployeeRequest.ViewModel
{
    public class ChartDataModel
    {
        public string Category { get; set; }

        public decimal? Value { get; set; }

    }
}