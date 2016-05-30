# yapdnsui

*Yet Another PowerDNS web interface*

## Test using Docker

* Install Docker Engine
[Install documentation of Docker Engine](https://docs.docker.com/engine/installation/)

* Install docker-compose
[Install documentation of Docker Compose](https://docs.docker.com/compose/install/)

### Run development setup

There is an example setup including a pre-configured PowerDNS that can be launched by running

```bash
docker-compose run --rm pdnsui npm i
docker-compose up
```

### Review logs

```bash
$ docker-compose logs pdnsui
```

* Point your browser to: [http://localhost:8080/](http://localhost:8080/)
* Enjoy!

Secure yapdnsui
---------------

For security reasons, you may want to run a webserver (like Apache or nginx) in front of your PowerDNS webserver as a reverse proxy using SSL.
As a best pratice, it is recommended to apply use SSL for the traffic between the end-user and the application.

You can read this [HOWTO](http://blog.nachtarbeiter.net/2010/02/16/monitoring-powerdns-via-the-internal-web-server/) to see how.

For security reasons, you probably want to use the same webserver for authentication purpose.

You can read this [mod_auth_ldap - Apache HTTP Server](httpd.apache.org/docs/2.0/mod/mod_auth_ldap.html)

E.g. you might want use a SSL connection and authenticate your co-workers using the internal LDAP or database server of your company intranet.

