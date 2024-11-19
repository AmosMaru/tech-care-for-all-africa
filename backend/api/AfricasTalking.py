# import africastalking

# # Initialize SDK    
# africastalking.initialize(
#     username='kilushmaru254',
#     api_key='atsk_c441844f9b086a1543d4cba00363e5e1f3c14d9c4a79879cd5b1cb95bcbc733310bbfcf9'
# )

# sms = africastalking.SMS

 
# # Use the service synchronously
# response = sms.send("Hello Message!", ["+254768500572"])
# print(response)


import requests
import json

from dotenv import load_dotenv
import os
load_dotenv()

# Set your values here
endpoint = os.getenv('SMS_URL')  # Set the generated SMS URL.
api_key = os.getenv('SMS_API_KEY')  # Set the generated API Key. 
from_ = os.getenv('SMS_FROM')  # Set the sender ID.


def send_sms(endpoint, api_key, to, from_, message):
    request = {
        'to': to,
        'from': from_,
        'message': message
    }
    request_body = json.dumps(request)

    print(f"request|msisdn: {to}|request: {request_body} | url: {endpoint}")

    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {api_key}'
    }

    try:
        response = requests.post(endpoint, data=request_body, headers=headers)
        response_body = response.text

        print(f"request|msisdn: {to}|response: {response_body} | url: {endpoint}")

        response.raise_for_status()

    except requests.exceptions.RequestException as e:
        print(f'Request failed: {e}')

