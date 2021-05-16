using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Template.FrontEndGevorderd.Web.Models;

namespace Template.FrontEndGevorderd.Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PingController : ControllerBase
    {
        private readonly ILogger<PingController> _logger;

        public PingController(ILogger<PingController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public Pong Get()
        {
            return new Pong()
            {
                Message = $"Pong! Het is nu {DateTime.Now.ToShortTimeString()}."
            };
        }
    }
}
