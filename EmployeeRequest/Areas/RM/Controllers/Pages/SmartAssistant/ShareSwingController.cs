using App_Resources;
using EmployeeRequest.Infrastracture.BaseClasses;
using EmployeeRequest.Infrastracture.Enums;
using EmployeeRequest.Infrastracture.Helpers;
using EmployeeRequest.SpClasses;
using EmployeeRequest.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace EmployeeRequest.Areas.RM.Controllers.Pages.SmartAssistant
{
    public class ShareSwingController : BaseController
    {
        [HttpPost]
        public virtual ActionResult GetShareSwingWithCountAndQuant(bool fromEntity, string dateS, string dateE, decimal? finalFeeDiffS, decimal? finalFeeDiffE)
        {
            var currentUser = (LoginResultModel)Session["LoginResult"];
            if (fromEntity)
            {
                var shareSwingDatalist = ReportHelper.GetShareSwingWithCountAndQuant(dateS.Replace("/", ""), dateE.Replace("/", ""), finalFeeDiffS, finalFeeDiffE);

                if (!shareSwingDatalist.Any())
                    return Json(ResponseType.Failed, MessagesLibrary.NothingDataToShow);

                var maxFinal = shareSwingDatalist.Max(t => t.FinalFee);
                var minFinal = shareSwingDatalist.Min(t => t.FinalFee);
                var sumQuantity = shareSwingDatalist.Sum(t => t.Quant);

                var rangeFee = shareSwingDatalist.Select(t => new { t.MaxFinalFee, t.MinFinalFee }).ToArray();


                //var result = ReportHelper.GetSpShrMaxBuyerDashboard(dateS.Replace("/", ""), dateE.Replace("/", ""), "",0,null,"",0);

                var positiveDay = shareSwingDatalist.Where(t => t.Diff > 0).ToList();
                var negativeDay = shareSwingDatalist.Where(t => t.Diff < 0).ToList();
                var zeroDay = shareSwingDatalist.Where(t => t.Diff == 0).ToList();

                List<ChartDataModel> dayTypeCountStatistic = new List<ChartDataModel>();

                var positiveDayData = new ChartDataModel
                {
                    Category = CaptionsLibrary.PositiveDays,
                    Value = positiveDay.Count()
                };
                dayTypeCountStatistic.Add(positiveDayData);

                var negativeDayData = new ChartDataModel
                {
                    Category = CaptionsLibrary.NegativeDays,
                    Value = negativeDay.Count()
                };
                dayTypeCountStatistic.Add(negativeDayData);

                var zeroDayData = new ChartDataModel
                {
                    Category = CaptionsLibrary.ZeroDays,
                    Value = zeroDay.Count()
                };
                dayTypeCountStatistic.Add(zeroDayData);

                List<PieChartModel> dayTypeCountStatisticChartData = new List<PieChartModel>();
                PieChartModel dayTypeCountStatisticChartObj = new PieChartModel();
                dayTypeCountStatisticChartObj.Data = dayTypeCountStatistic;
                dayTypeCountStatisticChartObj.Name = CaptionsLibrary.Count;
                dayTypeCountStatisticChartData.Add(dayTypeCountStatisticChartObj);

                var positiveDayMaxBuyerList = new List<sp_shr_max_buyer_dashboard_Result>();
                foreach (ShareSwingWithCountAndQuantModel item in positiveDay)
                {
                    var temp = ReportHelper.GetSpShrMaxBuyerDashboard(item.TblDate.Replace("/", ""), item.TblDate.Replace("/", ""), "", 0, null, "", 0);
                    positiveDayMaxBuyerList.AddRange(temp);
                    positiveDayMaxBuyerList = positiveDayMaxBuyerList.GroupBy(t => t.SHRH_CODE).Select(
                    g => new sp_shr_max_buyer_dashboard_Result
                    {
                        SHRH_CODE = g.Key,
                        amnt = g.Sum(s => s.amnt),
                        cnt = g.Sum(s => s.cnt),
                        sumshare = g.Sum(s => s.sumshare),
                        fullname = g.First().fullname
                    }).OrderByDescending(t => t.sumshare).ToList();
                }
                var positiveDayMaxSellerList = new List<sp_shr_max_seller_dashboard_Result>();
                foreach (ShareSwingWithCountAndQuantModel item in positiveDay)
                {
                    var temp = ReportHelper.GetSpShrMaxSellerDashboard(item.TblDate.Replace("/", ""), item.TblDate.Replace("/", ""), "", 0, null, "", 0);
                    positiveDayMaxSellerList.AddRange(temp);
                    positiveDayMaxSellerList = positiveDayMaxSellerList.GroupBy(t => t.SHA_SHRH_CODE).Select(
                    g => new sp_shr_max_seller_dashboard_Result
                    {
                        SHA_SHRH_CODE = g.Key,
                        amnt = g.Sum(s => s.amnt),
                        cnt = g.Sum(s => s.cnt),
                        sumshare = g.Sum(s => s.sumshare),
                        fullname = g.First().fullname
                    }).OrderByDescending(t => t.sumshare).ToList();
                }

                var negativeDayMaxBuyerList = new List<sp_shr_max_buyer_dashboard_Result>();
                foreach (ShareSwingWithCountAndQuantModel item in negativeDay)
                {
                    var temp = ReportHelper.GetSpShrMaxBuyerDashboard(item.TblDate.Replace("/", ""), item.TblDate.Replace("/", ""), "", 0, null, "", 0);
                    negativeDayMaxBuyerList.AddRange(temp);
                    negativeDayMaxBuyerList = negativeDayMaxBuyerList.GroupBy(t => t.SHRH_CODE).Select(
                    g => new sp_shr_max_buyer_dashboard_Result
                    {
                        SHRH_CODE = g.Key,
                        amnt = g.Sum(s => s.amnt),
                        cnt = g.Sum(s => s.cnt),
                        sumshare = g.Sum(s => s.sumshare),
                        fullname = g.First().fullname
                    }).OrderByDescending(t => t.sumshare).ToList();
                }
                var negativeDayMaxSellerList = new List<sp_shr_max_seller_dashboard_Result>();
                foreach (ShareSwingWithCountAndQuantModel item in negativeDay)
                {
                    var temp = ReportHelper.GetSpShrMaxSellerDashboard(item.TblDate.Replace("/", ""), item.TblDate.Replace("/", ""), "", 0, null, "", 0);
                    negativeDayMaxSellerList.AddRange(temp);
                    negativeDayMaxSellerList = negativeDayMaxSellerList.GroupBy(t => t.SHA_SHRH_CODE).Select(
                    g => new sp_shr_max_seller_dashboard_Result
                    {
                        SHA_SHRH_CODE = g.Key,
                        amnt = g.Sum(s => s.amnt),
                        cnt = g.Sum(s => s.cnt),
                        sumshare = g.Sum(s => s.sumshare),
                        fullname = g.First().fullname
                    }).OrderByDescending(t => t.sumshare).ToList();
                }

                var zeroDayMaxBuyerList = new List<sp_shr_max_buyer_dashboard_Result>();
                foreach (ShareSwingWithCountAndQuantModel item in zeroDay)
                {
                    var temp = ReportHelper.GetSpShrMaxBuyerDashboard(item.TblDate.Replace("/", ""), item.TblDate.Replace("/", ""), "", 0, null, "", 0);
                    zeroDayMaxBuyerList.AddRange(temp);
                    zeroDayMaxBuyerList = zeroDayMaxBuyerList.GroupBy(t => t.SHRH_CODE).Select(
                    g => new sp_shr_max_buyer_dashboard_Result
                    {
                        SHRH_CODE = g.Key,
                        amnt = g.Sum(s => s.amnt),
                        cnt = g.Sum(s => s.cnt),
                        sumshare = g.Sum(s => s.sumshare),
                        fullname = g.First().fullname
                    }).OrderByDescending(t => t.sumshare).ToList();
                }
                var zeroDayMaxSellerList = new List<sp_shr_max_seller_dashboard_Result>();
                foreach (ShareSwingWithCountAndQuantModel item in zeroDay)
                {
                    var temp = ReportHelper.GetSpShrMaxSellerDashboard(item.TblDate.Replace("/", ""), item.TblDate.Replace("/", ""), "", 0, null, "", 0);
                    zeroDayMaxSellerList.AddRange(temp);
                    zeroDayMaxSellerList = zeroDayMaxSellerList.GroupBy(t => t.SHA_SHRH_CODE).Select(
                    g => new sp_shr_max_seller_dashboard_Result
                    {
                        SHA_SHRH_CODE = g.Key,
                        amnt = g.Sum(s => s.amnt),
                        cnt = g.Sum(s => s.cnt),
                        sumshare = g.Sum(s => s.sumshare),
                        fullname = g.First().fullname
                    }).OrderByDescending(t => t.sumshare).ToList();
                }

                var positiveDayDetail = new
                {
                    positiveDayMaxBuyerList = positiveDayMaxBuyerList.Take(100),
                    positiveDayMaxSellerList = positiveDayMaxSellerList.Take(100)
                };

                var negativeDayDetail = new
                {
                    negativeDayMaxBuyerList = negativeDayMaxBuyerList.Take(100),
                    negativeDayMaxSellerList = negativeDayMaxSellerList.Take(100)
                };

                var zeroDayDetail = new
                {
                    zeroDayMaxBuyerList = zeroDayMaxBuyerList.Take(100),
                    zeroDayMaxSellerList = zeroDayMaxSellerList.Take(100)
                };

                var bestSwingerQuery = from seller in positiveDayMaxSellerList
                                       join buyer in negativeDayMaxBuyerList
                                       on seller.SHA_SHRH_CODE equals buyer.SHRH_CODE
                                       select new
                                       {
                                           SellerShrhCode = seller.SHA_SHRH_CODE,
                                           SellerFullName = seller.fullname,
                                           SellerSumShare = seller.sumshare,
                                           SellerCnt = seller.cnt,
                                           SellerAmnt = seller.amnt,
                                           BuyerShrhCode = buyer.SHRH_CODE,
                                           BuyerFullName = buyer.fullname,
                                           BuyerSumShare = buyer.sumshare,
                                           BuyerCnt = buyer.cnt,
                                           BuyerAmnt = buyer.amnt,
                                           SwingerRate = seller.sumshare + buyer.sumshare,
                                           QuantityPercent = ((Convert.ToDecimal(seller.sumshare) + Convert.ToDecimal(buyer.sumshare)) / Convert.ToDecimal(sumQuantity)) * 100

                                       };
                var avgBestSwingerQuery = bestSwingerQuery.Count() > 0 ? bestSwingerQuery.Sum(t => t.SwingerRate) / bestSwingerQuery.Count() : 0;
                var bestSwingerList = new
                {
                    bestSwingerList = bestSwingerQuery.Where(t => t.SwingerRate >= avgBestSwingerQuery).OrderByDescending(t => t.SwingerRate).ToList()
                    //bestSwingerQuantAvg = bestSwingerQuery.Where(t => t.SwingerRate >= avgBestSwingerQuery).Sum(t=>t.SwingerRate)/ bestSwingerQuery.Where(t => t.SwingerRate >= avgBestSwingerQuery).Count()
                };

                var worstSwingerQuery = from seller in negativeDayMaxSellerList
                                        join buyer in positiveDayMaxBuyerList
                                        on seller.SHA_SHRH_CODE equals buyer.SHRH_CODE
                                        select new
                                        {
                                            SellerShrhCode = seller.SHA_SHRH_CODE,
                                            SellerFullName = seller.fullname,
                                            SellerSumShare = seller.sumshare,
                                            SellerCnt = seller.cnt,
                                            SellerAmnt = seller.amnt,
                                            BuyerShrhCode = buyer.SHRH_CODE,
                                            BuyerFullName = buyer.fullname,
                                            BuyerSumShare = buyer.sumshare,
                                            BuyerCnt = buyer.cnt,
                                            BuyerAmnt = buyer.amnt,
                                            SwingerRate = seller.sumshare + buyer.sumshare,
                                            QuantityPercent = ((Convert.ToDecimal(seller?.sumshare) + Convert.ToDecimal(buyer?.sumshare)) / Convert.ToDecimal(sumQuantity)) * 100

                                        };
                var avgWorstSwingerQuery = worstSwingerQuery.Count() > 0 ? worstSwingerQuery.Sum(t => t.SwingerRate) / worstSwingerQuery.Count() : 0;
                var worstSwingerList = new
                {
                    worstSwingerList = worstSwingerQuery.Where(t => t.SwingerRate >= avgWorstSwingerQuery).OrderByDescending(t => t.SwingerRate).ToList()
                    //worstSwingerQuantAvg = worstSwingerQuery.Where(t => t.SwingerRate >= avgWorstSwingerQuery).Sum(t => t.SwingerRate) / worstSwingerQuery.Where(t => t.SwingerRate >= avgWorstSwingerQuery).Count()
                };

                var buyQuantActualSum = Convert.ToDecimal(shareSwingDatalist?.Sum(t => t.BuyQuantActual));
                var buyQuantLegalSum = Convert.ToDecimal(shareSwingDatalist?.Sum(t => t.BuyQuantLegal));
                var sellQuantActualSum = Convert.ToDecimal(shareSwingDatalist?.Sum(t => t.SellQuantActual));
                var sellQuantLegalSum = Convert.ToDecimal(shareSwingDatalist?.Sum(t => t.SellQuantLegal));

                List<ChartDataModel> buyQuantStatistic = new List<ChartDataModel>();
                var buyQuantActualData = new ChartDataModel
                {
                    Category = CaptionsLibrary.Actual,
                    Value = buyQuantActualSum / (buyQuantActualSum + buyQuantLegalSum) * 100
                };
                buyQuantStatistic.Add(buyQuantActualData);
                var buyQuantLegalData = new ChartDataModel
                {
                    Category = CaptionsLibrary.Legal,
                    Value = buyQuantLegalSum / (buyQuantActualSum + buyQuantLegalSum) * 100
                };
                buyQuantStatistic.Add(buyQuantLegalData);
                PieChartModel buyQuantChartChartObj = new PieChartModel();
                buyQuantChartChartObj.Data = buyQuantStatistic;
                buyQuantChartChartObj.Name = CaptionsLibrary.Buy;

                List<ChartDataModel> sellQuantStatistic = new List<ChartDataModel>();
                var sellQuantActualData = new ChartDataModel
                {
                    Category = CaptionsLibrary.Actual,
                    Value = sellQuantActualSum / (sellQuantActualSum + sellQuantLegalSum) * 100
                };
                sellQuantStatistic.Add(sellQuantActualData);
                var sellQuantLegalData = new ChartDataModel
                {
                    Category = CaptionsLibrary.Legal,
                    Value = sellQuantLegalSum / (sellQuantActualSum + sellQuantLegalSum) * 100
                };
                sellQuantStatistic.Add(sellQuantLegalData);
                PieChartModel sellQuantChartChartObj = new PieChartModel();
                sellQuantChartChartObj.Data = sellQuantStatistic;
                sellQuantChartChartObj.Name = CaptionsLibrary.Sell;

                List<PieChartModel> quantChartData = new List<PieChartModel>();
                quantChartData.Add(buyQuantChartChartObj);
                quantChartData.Add(sellQuantChartChartObj);

                if (shareSwingDatalist == null)
                    return Json(ResponseType.Failed, MessagesLibrary.OperationFailed);

                if (shareSwingDatalist.Count > 20000)
                    return Json(ResponseType.Failed, MessagesLibrary.NumberOfRecoveredRowIsMoreThanAllowed);

                var obj = new
                {
                    shareSwingDatalist,
                    maxFinal,
                    minFinal,
                    rangeFee,
                    positiveDayDetail,
                    negativeDayDetail,
                    zeroDayDetail,
                    bestSwingerList,
                    worstSwingerList,
                    dayTypeCountStatisticChartData,
                    quantChartData
                };

                var outFile = new
                {
                    ResponseType = ResponseType.Ok,
                    Message = MessagesLibrary.OperationSuccessed,
                    obj
                };

                var output = new JsonResult();
                output.Data = outFile;
                output.MaxJsonLength = int.MaxValue;

                var cacheKey = currentUser.Id + "_" + "ShareSwingWithCountAndQuant";
                CacheHelper.AddResultToCache(cacheKey, output);

                return output;
            }
            else
            {
                var cacheKey = currentUser.Id + "_" + "ShareSwingWithCountAndQuant";
                var cache = CacheHelper.GetResultFromCache(cacheKey);
                return (JsonResult)cache;
            }
        }
    }
}