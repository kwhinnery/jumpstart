package com.twilio.jumpstart;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.twilio.sdk.TwilioRestClient;
import com.twilio.sdk.TwilioRestException;
import com.twilio.sdk.resource.factory.SmsFactory;
import com.twilio.sdk.resource.instance.Sms;

@SuppressWarnings("serial")
public class SmsServlet extends HttpServlet {
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		
		Properties properties = new Properties();
		properties.load(getServletContext().getResourceAsStream("/WEB-INF/config.properties"));
	
		TwilioRestClient client = new TwilioRestClient(properties.getProperty("accountSid"), properties.getProperty("authToken"));
 
        Map<String, String> smsParams = new HashMap<String, String>();
        smsParams.put("To", req.getParameter("to")); 
        smsParams.put("From", properties.getProperty("twilioNumber"));
        // number in your account
        smsParams.put("Body", "Your Java environment is configured.");
        SmsFactory messageFactory = client.getAccount().getSmsFactory();
        try {
			Sms sms = messageFactory.create(smsParams);
		} catch (TwilioRestException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}
}
