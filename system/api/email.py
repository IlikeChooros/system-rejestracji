from django.core.mail import send_mail
from django.template.loader import render_to_string

MAIL_FOOTER = 'Ta wiadomość została automatycznie wygenerowana, prosimy nie odpowiadać na otrzymaną wiadomość.'
MAIL_PREFIX = 'Potwierdzenie udziału w peregrynacji ikony po parafii Miłosierdzia Bożego'

def send_confirmation(request, email, pk):
    try:
        link = request.build_absolute_uri('/manage/{}'.format(pk))
        plain_message = \
            """
            %s
            
            Możesz zawsze zmienić lub wycofać zgłoszenie, klikając w poniższy link:
            %s

            %s
            """ % (MAIL_PREFIX, link, MAIL_FOOTER)
        
        send_mail(
            MAIL_PREFIX,
            plain_message, None, [email],
            html_message=render_to_string(
                'email.html', 
                    {
                        'link': link,
                        'footer': MAIL_FOOTER,
                        'prefix': MAIL_PREFIX
                    }
            )
        )

        return True
    except:
        return False