'use strict';

import Marionette from 'backbone.marionette';
import BaseLayout from 'javascripts/base_layout';

import about from 'templates/about.jade';
import { ServerListView, ServerView } from 'javascripts/server';
import { ZoneListView } from 'javascripts/zones';

let IndexView = Marionette.LayoutView.extend({
    template: about
});

const views = {
    index: IndexView,
    about: IndexView,
    listServers: ServerListView,
    editServer: ServerView,
    listZones: ZoneListView
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
    listServers: function () {
        this.getOption('layout').triggerMethod('show');
        this.getOption('layout').triggerMethod('load:content', new (viewFor('listServers'))());
    },
    editServer: function (id) {
        this.getOption('layout').triggerMethod('show');
        this.getOption('layout').triggerMethod('load:content', new (viewFor('editServer'))({
            selectedServer: id
        }));
    },
    listZones: function (serverId) {
        this.getOption('layout').triggerMethod('show');
        this.getOption('layout').triggerMethod('load:content', new (viewFor('listZones'))({
            serverId: serverId
        }));
    }
});

let Router = Marionette.AppRouter.extend({
    appRoutes: {
        '': 'index',
        'about': 'about',
        'servers/': 'listServers',
        'servers/:id': 'editServer',
        'servers/:id/zones': 'listZones'
    },
    controller: new Controller()
});

export default Router;
