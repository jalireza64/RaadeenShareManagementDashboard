using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace EmployeeRequest.ViewModel
{
    public class ShareholderCompletionRateModel
    {
        public string CompletionTitle { get; set; }

        public decimal CompletionCount { get; set; }

        public decimal CompletionPercent { get; set; }

        public decimal InCompletionPercent { get; set; }

    }
}