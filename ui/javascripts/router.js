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
    },
    index: function () {
        this.getOption('layout').triggerMethod('show');
        this.getOption('layout').triggerMethod('load:content', new (viewFor('index'))());
    },
    about: function () {
        this.getOption('layout').triggerMethod('show');
        this.getOption('layout').triggerMethod('load:content', new (viewFor('about'))());
    },
    listServers: function (id) {
        this.getOption('layout').triggerMethod('show');
        this.getOption('layout').triggerMethod('load:content', new (viewFor('servers/'))({
            selected: id
        }));
    }
});

let Router = Marionette.AppRouter.extend({
    appRoutes: {
        '': 'index',
        'about': 'about',
        'servers/:id': 'listServers'
    },
    controller: new Controller()
});

export default Router;
