import boto3
import json
import base64
import os

blocked_ips_env = os.environ.get('BLOCKED_IPS', '')
blocked_ips = blocked_ips_env.split(',')

def is_ip_blocked(ip_address):
    return ip_address in blocked_ips

def send_template_mail(event, context):
    try:
        ip_address = event['headers']['x-forwarded-for']
        if is_ip_blocked(ip_address):
            message = {
                'message': 'Unauthorized error (403): Your IP address is blocked.'
            }
            return {
                'statusCode': 403,
                'body': json.dumps(message),
                'isBase64Encoded': False
            }

        payloadDecoded = base64.b64decode(event['body'])
        body = json.loads(payloadDecoded)
        sender_name = body['sender_name']
        source_email = body['source_email']
        template_subject = body['template_subject']
        template_body = body['template_body']
        personalSource = "Felipe Sales <noreply@felipecastrosales.awsapps.com>"
        personalEmailTemplateData = {
            "subject": template_subject,
            "body": template_body,
            "username": sender_name,
            "userEmail": source_email
        }
        userEmailTemplateData = {
            "username": sender_name,
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
            'isBase64Encoded': False
        }
    except Exception as e:
        message = {
            'message': 'Error sending email: ' + str(e)
        }
        print(message)
        return {
            'statusCode': 500,
            'body': json.dumps(message),
            'isBase64Encoded': False
        }

# How to test: 
# aws lambda invoke \
# --function-name serverless-dev-send_template_mail \
# --region us-east-1 \
# --payload "" \
# Output.txt

# -> Generate `base64` payload with the following content:
# {
#     "sender_name": "John Doe",
#     "source_email": "johndoe@johndoe.com",
#     "template_subject": "Hello from Lambda",
#     "template_body": "This is a test email from Lambda function."
# }
