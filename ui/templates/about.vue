<template>
<div id="about">
    <div class="container">
        <div class="jumbotron">
            <h1>Yet Another PDNS UI</h1>
            <p>Yet Another PowerDNS web interface</p>
            <p><a class="btn btn-primary btn-large" href="https://github.com/johnyb/yapdnsui">Documentation on GitHub</a></p>
        </div>
    </div>
    <div class="container">
        <div class="jumbotron">
            <h2>License</h2>
            <p>
                Copyright &copy; 2014-2015 Francois Lacroix, 2016-2017 Julian Bäume. All Rights Reserved.<br />
                This program is free software; you can redistribute it and/or modify it under the terms of the
                <a href="http://www.gnu.org/licenses/gpl.html">GNU General Public License</a>
                as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
            </p>
        </div>
    </div>
    <div class="container">
        <div class="jumbotron">
            <h2>Notes</h2>
            <p>
                Yet Another PDNS UI is in alpha stage as well as the PowerDNS API and might break your server, your zones, this application, whatever.
            <p>
                Middleware is built using <a href="http://nodejs.org">NodeJS</a> and <a href="http://expressjs.com">Express</a>.
            <p>
                yaPDNSui powered by <a href="http://vuejs.org">Vue.js</a> - Layout and CSS from <a href="https://v4-alpha.getbootstrap.com">Twitter Bootstrap 4</a>.
            </p>
        </div>
    </div>
</div>
</template>

<script>
export default {
  name: 'about'
}
</script>

<style src="../stylesheets/main.scss" />
