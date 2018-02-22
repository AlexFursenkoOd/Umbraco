using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Umbraco.Core.Models;
using Umbraco.Web.Models;
using Umbraco_Implementation2.Models;

namespace Umbraco_Implementation2.Controllers
{
    public class HomeController : Umbraco.Web.Mvc.RenderMvcController
    {
        public override ActionResult Index(RenderModel model)
        {
            var cookieName = "market";
            var market = this.HttpContext.Request.Cookies.Get(cookieName)?.Value;
            if (String.IsNullOrEmpty(market))
                HttpContext.Response.Cookies.Set(new HttpCookie(cookieName, "US"));
            var viewModel = GetViewModel(model);
            var contentItems = GetContentItems();
            return View("Index", viewModel);
        }

        private HomeViewModel GetViewModel(RenderModel model)
        {
            var viewModel = new HomeViewModel(model.Content);
            viewModel.Image = model.Content.GetProperty("image").Value;
            viewModel.Description = (string)model.Content.GetProperty("description").Value;
            return viewModel;
        }

        private IEnumerable<IContent> GetContentItems()
        {
            var contentType = this.Services.ContentTypeService.GetContentType("contentItem");
            var contentItems = this.Services.ContentService.GetContentOfContentType(contentType.Id);

            foreach(var contentItem in contentItems)
            {
                var availableMarkets = GetAvailableMarketsIDs(contentItem);
                GetAvailableMarketsIDsByUmbraco(contentItem);
            }
            
            return contentItems;
        }

        private IEnumerable<int> GetAvailableMarketsIDs(IContent content)
        {
            var availableMarketsString = (string)content.GetValue("markets");
            var availableMarketsCodesString = availableMarketsString.Split(',');
            var availableMarketsCodes = availableMarketsCodesString.Select(code => Convert.ToInt32(code));

            return availableMarketsCodes;
        }

        private void GetAvailableMarketsIDsByUmbraco(IContent content)
        {
            var item = Umbraco.Content("contentItem");
            var m = item.markets;
        }
    }
}
