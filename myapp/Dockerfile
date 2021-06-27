FROM python:3.6

RUN mkdir /var/www
WORKDIR /var/www

COPY requirements.txt ./

RUN set HTTP_PROXY=
RUN set HTTPS_PROXY=

RUN pip install --no-cache-dir -r requirements.txt --proxy=

CMD ["uwsgi","--ini","/var/www/uwsgi.ini"]