using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Umbraco.Web.Models;

namespace Umbraco_Implementation2.Controllers
{
    public class HomeController : Umbraco.Web.Mvc.RenderMvcController
    {
        public override ActionResult Index(RenderModel model)
        {
            //Do some stuff here, then return the base method
            
            var property = model.Content.GetProperty("testField");
            int axis;
            var success = Int32.TryParse(property.Value.ToString(), out axis);
            ViewBag.Axis = success ? axis : 100;
            return View("Index", model);
        }

    }
}
