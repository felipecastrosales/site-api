import boto3
import os

ses = boto3.client('ses')

def send_mail(
    sender_name: str,
    sender_email: str,
    subject: str,
    body: str
):
    sender = f"{sender_name} <{sender_email}>"

    message = {
        'Template': 'simple-email',
        'Source': sender,
        'Destination': {
            'ToAddresses': [
                os.environ.get('AWS_SES_EMAIL_RECEIVER', '')
            ]
        },
        # https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/ses/client/send_templated_email.html
        'TemplateData': {
            'subject': subject,
            'body': body
        }
    }

    try:
        response = ses.send_templated_email(
            Source=message['Source'],
            Destination=message['Destination'],
            Template=message['Template'],
            TemplateData=message['TemplateData']
        )
        print('Email sent successfully:', response)
    except Exception as e:
        print('Error sending email:', e)

send_mail(
    sender_name="Felipe",
    sender_email="lfelipedecs@gmail.com",
    subject="More one email",
    body="This is a simple email"
)

print("All done!")
