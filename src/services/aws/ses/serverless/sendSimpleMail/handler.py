# import boto3
# import os

# ses = boto3.client('ses')

# def send_template_mail(
#     sender_name: str,
#     sender_email: str,
#     # subject: str,
#     # body: str
# ):
    # sender = f"{sender_name} <{sender_email}>"
#     emailExample = f"soufeliposales@gmail.com"

#     message = {
#         'Template': 'simple-email',
#         'Source': sender,
#         'Destination': {
#             'ToAddresses': [
#                 # os.environ.get('AWS_SES_EMAIL_RECEIVER', '')
#                 emailExample
#             ]
#         },
#         # https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/ses/client/send_template_mail.html
#         'TemplateData': {
#             # 'subject': subject,
#             # 'body': body
#             'subject': 'More one email',
#             'body': 'This is a simple email'
#         }
#     }

#     try:
#         print('Sending email...')
#         response = ses.send_template_mail(
#             Template=message['Template'],
#             Source=message['Source'],
#             Destination=message['Destination'],
#             TemplateData=templateDataJsonStringify,
#         )
#         print('Email sent successfully:', response)
#     except Exception as e:
#         print('Error sending email:', e)

# send_template_mail(
#     sender_name="Felipe",
#     sender_email="soufeliposales@gmail.com"
#     # subject="More one email",
#     # body="This is a simple email"
# )

# print("All done!")

# to run: 
# 1. python3 handler.py
# 2.sls invoke local -f sendSimpleMail

# ---

import boto3

def send_template_mail(event, context):
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
