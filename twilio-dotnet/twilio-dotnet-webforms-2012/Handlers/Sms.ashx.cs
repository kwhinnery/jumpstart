﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Twilio;

namespace twilio_dotnet.Handlers
{
    /// <summary>
    /// Summary description for Sms
    /// </summary>
    public class Sms : IHttpHandler
    {
        TwilioRestClient client;

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "application/json";

            client = new TwilioRestClient(Settings.AccountSid, Settings.AuthToken);

            var result = client.SendSmsMessage(Settings.TwilioNumber, context.Request["to"], "Hello there! Your Twilio environment has been configured.");

            if (result.RestException != null)
            {
                context.Response.StatusCode = 500;
                context.Response.Write(result.RestException.Message);
            }
            else
            {
                context.Response.Write("{ \"error\":false }");
            }
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}