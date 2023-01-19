using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace EmployeeRequest.ViewModel
{
    public class ShareSwingWithCountAndQuantModel
    {
        public string TblDate { get; set; }

        public Nullable<decimal> FinalFee { get; set; }

        public Nullable<decimal> YesterdayFinalFee { get; set; }

        public Nullable<decimal> Diff { get; set; }

        public Nullable<decimal> MaxFinalFee { get; set; }

        public Nullable<decimal> MinFinalFee { get; set; }

        public Nullable<int> Count { get; set; }

        public Nullable<long> Quant { get; set; }

        public Nullable<long> BuyQuantActual { get; set; }

        public Nullable<long> BuyQuantLegal { get; set; }

        public Nullable<long> SellQuantActual { get; set; }

        public Nullable<long> SellQuantLegal { get; set; }
    }
}