package com.twilio.jumpstart;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.twilio.sdk.verbs.Say;
import com.twilio.sdk.verbs.TwiMLException;
import com.twilio.sdk.verbs.TwiMLResponse;

@SuppressWarnings("serial")
public class HelloServlet extends HttpServlet {
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
	
		TwiMLResponse twiml = new TwiMLResponse();
		Say say2 = new Say("Good luck during the workshop!");
        say2.setVoice("woman");
        
        try {
			twiml.append(new Say("Hello there! Your Twilio environment has been configured."));
			twiml.append(say2);
		} catch (TwiMLException e) {
			e.printStackTrace();
		}
 
        resp.setContentType("application/xml");
        resp.getWriter().print(twiml.toXML());
	}
}
