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
        
        return {
            'statusCode': 200,
            'body': "Email sent! Message ID: {}".format(response['MessageId'])
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
