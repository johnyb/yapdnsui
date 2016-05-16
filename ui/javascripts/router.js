'use strict';

import Marionette from 'backbone.marionette';
import BaseLayout from 'javascripts/base_layout';

import about from 'templates/about.jade';
import { ServerListView } from 'javascripts/server_list';

let IndexView = Marionette.LayoutView.extend({
    template: about
});

const views = {
    index: IndexView,
    about: IndexView,
    'servers/': ServerListView
};

function viewFor(target) {
    return views[target];
}

let Controller = Marionette.Object.extend({
    initialize: function () {
        this.options.layout = new BaseLayout().render();
        this.listenTo(this.options.layout, 'navigate:to', (target) => {
            if (target === '') target = 'index';
            this.getOption('layout').triggerMethod('load:content', viewFor(target));
        });
    },
    index: function () {
        this.getOption('layout').triggerMethod('show');
        this.getOption('layout').triggerMethod('load:content', viewFor('index'));
    },
    about: function () {
        this.getOption('layout').triggerMethod('show');
        this.getOption('layout').triggerMethod('load:content', viewFor('about'));
    },
    listServers: function () {
        this.getOption('layout').triggerMethod('show');
        this.getOption('layout').triggerMethod('load:content', viewFor('servers/'));
    }
});

let Router = Marionette.AppRouter.extend({
    appRoutes: {
        '': 'index',
        'about': 'about',
        'server/': 'listServers'
    },
    controller: new Controller()
});

export default Router;
