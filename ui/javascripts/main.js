'use strict';

import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Router from 'javascripts/router';

let app = new Marionette.Application();

app.router = new Router();

app.on('start', () => Backbone.history.start({ pushState: true }));

app.router.controller.listenTo(app.router.controller.options.layout, 'navigate:to', function (target) {
    app.router.navigate(target, { trigger: true });
});

app.start();
