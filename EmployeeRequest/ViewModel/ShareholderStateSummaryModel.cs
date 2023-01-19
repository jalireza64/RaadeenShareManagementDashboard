using EmployeeRequest.Infrastracture.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EmployeeRequest.ViewModel
{
    public class ShareholderStateSummaryModel
    {
        public string shrh_code { get; set; }
        public string cert_info { get; set; }
        public string shrh_kind { get; set; }
        public string shrh_kind_desc { get; set; }
        public string cert_no { get; set; }
        public string shrh_exch_code { get; set; }
        public long? quantityOfStart { get; set; }
        public long? financeOfStart { get; set; }
        public long? financeOfEnd { get; set; }
        public long? quantityOfMeetDate { get; set; }
        public long? quantityOfEnd { get; set; }
        public long? assignFinanceOfPrevFinYear { get; set; }
        public decimal? payFinanceOfEndPeriod { get; set; }
        public decimal? capitalInfo04 { get; set; }//بدهی بابت افزایش سرمایه
        public decimal? capitalInfo05 { get; set; }//واریز بابت افزایش سرمایه از محل مطالبات
        public decimal? capitalInfo07 { get; set; }//واریز بانکی بابت افزایش سرمایه
    }
}