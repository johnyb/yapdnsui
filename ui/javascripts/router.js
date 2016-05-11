'use strict';

import Marionette from 'backbone.marionette';
import BaseLayout from 'javascripts/base_layout';

let Controller = Marionette.Object.extend({
    initialize: function () {
        this.options.layout = new BaseLayout().render();
    },
    index: function () {
        this.getOption('layout').triggerMethod('show');
        this.getOption('layout').triggerMethod('load:content', 'index');
    },
    about: function () {
        this.getOption('layout').triggerMethod('show');
        this.getOption('layout').triggerMethod('load:content', 'about');
    }
});

let Router = Marionette.AppRouter.extend({
    appRoutes: {
        '': 'index',
        'about': 'about'
    },
    controller: new Controller()
});

export default Router;
