using EmployeeRequest.Infrastracture.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace EmployeeRequest.ViewModel
{
    public class ShareholderTransStateModel
    {
        public string TblDate { get; set; }

        public long ShrQuntBuy { get; set; }

        public long ShrQuntSell { get; set; }
    }
}