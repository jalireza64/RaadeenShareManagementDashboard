using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace EmployeeRequest.ViewModel
{
    public class PieChartModel
    {
        public string Name { get; set; }

        public List<ChartDataModel> Data { get; set; }

    }
}