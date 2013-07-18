from werkzeug import SharedDataMiddleware
import os
from flask import Flask
app = Flask(__name__, static_url_path='', static_folder='public')

@app.route('/')
def root():
	return app.send_static_file('index.html')

# handle ajax POST and send SMS
@app.route('/sms', methods=['POST'])
def sms():
    return "sms"

# handle ajax POST and make call
@app.route('/call', methods=['POST'])
def call():
    return "call"

# generate a capability token for outbound calling
@app.route('/capability', methods=['POST'])
def capability():
    return "capability"

# generate TwiML that repeats a message
@app.route('/hello')
def hello():
    return "hello"

# configure static file serving
if app.config['DEBUG']:    
    app.wsgi_app = SharedDataMiddleware(app.wsgi_app, {
      '/': os.path.join(os.path.dirname(__file__), 'public')
    })

if __name__ == '__main__':
    app.run()