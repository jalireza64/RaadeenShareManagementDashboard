using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EmployeeRequest.ViewModel
{
    public class LoginResultModel
    {
        public decimal Id { get; set; }
        public string Username { get; set; }
        public string Name { get; set; }
        public string Family { get; set; }
        public List<decimal> AccessIds { get; set; }
    }
}