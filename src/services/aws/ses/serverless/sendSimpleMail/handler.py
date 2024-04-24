import boto3
import json
import base64
import os
import time

blocked_ips_env = os.environ.get('BLOCKED_IPS', '')
blocked_ips = blocked_ips_env.split(',')

REQUESTS_PER_DAY = int(os.environ.get('REQUESTS_PER_DAY', '32'))
requests_per_day = {}

headers = {
    'Access-Control-Allow-Origin': 'https://felipecastrosales.com',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Credentials': True,
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
    'Content-Type': 'application/json'
}

def is_ip_blocked(ip_address):
    print(f'[Log] User IP: {ip_address}')
    print(f'[Log] Blocked IPs: {blocked_ips}')
    return ip_address in blocked_ips

def is_rate_limited():
    today = time.strftime("%Y-%m-%d")
    requests_today = requests_per_day.get(today, 0)
    print(f'[Log] Requests today: {requests_today} | Requests per day: {REQUESTS_PER_DAY}')

    if requests_today >= REQUESTS_PER_DAY:
        return True

    requests_per_day[today] = requests_today + 1
    return False

def dispatch(event, context):
    try:
        print(f'[Log] Event: {event}')

        if 'requestContext' in event:
            if event['requestContext']['http']['method'] == 'OPTIONS':
                message = {
                    'message': 'CORS preflight request successful.'
                }
                return {
                    'statusCode': 200,
                    'body': json.dumps(message),
                    'isBase64Encoded': False,
                    'headers': headers
                }

        if is_rate_limited():
            message = {
                'message': 'Too Many Requests error (429): Rate limit exceeded.'
            }
            return {
                'statusCode': 429,
                'body': json.dumps(message),
                'isBase64Encoded': False,
                'headers': headers
            }

        ip_address = event['requestContext']['http']['sourceIp']
        if is_ip_blocked(ip_address):
            message = {
                'message': 'Unauthorized error (403): Your IP address is blocked.'
            }
            return {
                'statusCode': 403,
                'body': json.dumps(message),
                'isBase64Encoded': False,
                'headers': headers
            }

        return send_template_mail(event, context)

    except Exception as e:
        message = {
            'message': 'Error dispatching request: ' + str(e)
        }
        return {
            'statusCode': 500,
            'body': json.dumps(message),
            'isBase64Encoded': False,
            'headers': headers
        }

def send_template_mail(event, context):
    try:
        body = json.loads(event['body'])
        sender_name = body['sender_name']
        source_email = body['source_email']
        template_subject = body['template_subject']
        template_body = body['template_body']
        date = event['requestContext']['time']
        personalSource = "Felipe Sales <noreply@felipecastrosales.awsapps.com>"
        personalEmailTemplateData = {
            "subject": template_subject,
            "body": template_body,
            "username": sender_name,
            "userEmail": source_email,
            "date": date
        }
        userEmailTemplateData = {
            "username": sender_name,
            "date": date
        }

        ses_client = boto3.client('ses', region_name='us-east-1')

        personalResponse = ses_client.send_templated_email(
            Source = personalSource,
            Destination = {
                'ToAddresses': [
                    'soufeliposales@gmail.com'
                ]
            },
            Template='site-simple-mail',
            TemplateData=json.dumps(personalEmailTemplateData)
        )

        userResponse = ses_client.send_templated_email(
            Source = personalSource,
            Destination = {
                'ToAddresses': [
                    source_email
                ]
            },
            Template='request-site-simple-mail',
            TemplateData=json.dumps(userEmailTemplateData)
        )

        message = {
            'message': 'Emails sent! Message IDs | personal: ' + personalResponse['MessageId'] + ' | user: ' + userResponse['MessageId']
        }

        return {
            'statusCode': 200,
            'body': json.dumps(message),
            'isBase64Encoded': False,
            'headers': headers
        }
    except Exception as e:
        message = {
            'message': 'Error sending email: ' + str(e)
        }
        print(message)
        return {
            'statusCode': 500,
            'body': json.dumps(message),
            'isBase64Encoded': False,
            'headers': headers
        }

# How to test: 
# aws lambda invoke \
# --function-name serverless-dev-send_template_mail \
# --region us-east-1 \
# --payload "" \
# Output.txt

# -> Generate payload with the following content:
# {
#     "sender_name": "John Doe",
#     "source_email": "johndoe@johndoe.com",
#     "template_subject": "Hello from Lambda",
#     "template_body": "This is a test email from Lambda function."
# }
