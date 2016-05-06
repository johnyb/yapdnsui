'use strict';

import Backbone from 'backbone';
import Marionette from 'backbone.marionette';

let app = new Marionette.Application();

app.on('start', () => Backbone.history.start());

app.start();
