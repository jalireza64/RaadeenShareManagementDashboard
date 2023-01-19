using EmployeeRequest.Infrastracture.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EmployeeRequest.ViewModel
{
    public class ShareholderWatchModel
    {
        public string ShrhCode { get; set; }
        public ShareholderKind ShareholderKind { get; set; }
        public string Fullname { get; set; }
        public TransactionType TransactionType { get; set; }
        public string TransactionTypeDesc { get; set; }
        public string LastTrDate { get; set; }
        public long? Share { get; set; }
        public long? ShareRemaining { get; set; }
        public decimal? FinanceRemaining { get; set; }
        public decimal? Amount { get; set; }
        public long? PresentValueOfStockAssets { get; set; }
    }
}