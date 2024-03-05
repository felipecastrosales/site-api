import boto3

def send_template_mail(event, context):
    try:
        sender_name = event['sender_name']
        source_email = event['source_email']
        template_subject = event['template_subject']
        template_body = event['template_body']

        source = f"{sender_name} <{source_email}>"
        
        ses_client = boto3.client('ses', region_name='us-east-1')

        response = ses_client.send_templated_email(
            Source = source,
            Destination = {
                'ToAddresses': [
                    'soufeliposales@gmail.com'
                ]
            },
            Template='simple-email',
            TemplateData='{"subject": "' + template_subject + '", "body": "' + template_body + '"}'
        )
        
        message = {
            'message': 'Email sent! Message ID: ' + response['MessageId']
        }

        return {
            'statusCode': 200,
            'body': message,
            'isBase64Encoded': False
            'headers': {
                "Access-Control-Allow-Origin": "*"
                "Access-Control-Allow-Credentials": True
                "Access-Control-Allow-Methods": "POST",
                "Content-Type": "application/json"
            }
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': 'Error: {}'.format(e)
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
