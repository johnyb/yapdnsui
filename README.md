yapdnsui
========

*Yet Another PowerDNS web interface*

The ultimate goal is to produce a slick web interface to [PowerDNS](http://www.powerdns.com/) that
will let you fully operate your PowerDNS instance via the official [PowerDNS API](https://github.com/PowerDNS/pdnsapi).

The application should let you do add/delete/update domains and records as well as graph
statistics and list/update configuration items **LIVE** from one or multiple PowerDNS instance via the PowerDNS API.

In addition, the application should let you manage DNSSEC zones and zone metadata.

This project started out as a fork of [xbgmsharp's yapdnsui](https://github.com/xbgmsharp/yapdnsui) in order to help
development there, but soon ended up as a complete rewrite.
For the moment, I'll stick to the name, but it might change before a 1.0 release.
I'll keep the complete history and still have the orignial master branch for reference.

You are welcome to contribute.

yapdnsui Prereqs
----------------

The middleware is tested with latest [NodeJS](http://nodejs.org), so until a first real release, no older versions
are supported.
Of course, it might still work, but I strongly suggest using a current version.

Installing
----------

* Clone the repository

```bash
git clone https://github.com/johnyb/yapdnsui
cd yapdnsui
```

* Install dependencies

```bash
$ yarn
```

* Start the application

```bash
$ yarn start
```

Or manually, you can define an IP and the PORT by using environment variables.
```bash
$ HOST=127.0.0.1 PORT=8080 DEBUG=yapdnsui NODE_ENV=production node ./bin/www
```

* Point your browser to: [http://localhost:8080/](http://localhost:8080/)
* Enjoy!

_Note_ : yaPDNSui use a sqlite database to store PowerDNS instances details.
You can access the PowerDNS server manage interface using the menu on the right.

Test using Docker
-----------------

For more details regarding docker, please refer to [Docker.md](Docker.md)

Development
-----------

Start the docker environment as described above:

```
docker-compose up
```

This will start a development setup.
It has PDNS instances running in different configurations.

Contributing to yapdnsui
------------------------

Please beware, at the moment, this code base is in heavy flux.
This repository is organised using [git flow](http://nvie.com/posts/a-successful-git-branching-model/).
Please create merge requests against the develop branch.
Please also open merge requests against unfinished branches, once the purpose/goal of your feature/fix/enhancement is clear.

License
-------

This program is free software; you can redistribute it and/or modify it under the terms of the [GNU General Public License](http://www.gnu.org/licenses/gpl.html) as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program comes without any warranty.

Credits
-------

* yaPDNSui is built with the awesome [NodeJS](http://nodejs.org) and [Express](http://expressjs.com).

* PowerDNS [http://www.powerdns.com/](http://www.powerdns.com/)

* Layout & CSS: [Bootstrap 4](https://v4-alpha.getbootstrap.com/)

* [Vue.js](http://vuejs.org/)

* Thanks to [yaPDNSui](https://github.com/xbgmsharp/yapdnsui/)
