'use strict';

import Marionette from 'backbone.marionette';
import BaseLayout from 'javascripts/base_layout';

import about from 'templates/about.jade';
import { ServerListView, ServerView, ServerConfigView } from 'javascripts/server';
import { ZoneListView } from 'javascripts/zones';
import { RecordListView } from 'javascripts/records';

let IndexView = Marionette.LayoutView.extend({
    template: about
});

const views = {
    index: IndexView,
    about: IndexView,
    listServers: ServerListView,
    editServer: ServerView,
    serverConfig: ServerConfigView,
    listZones: ZoneListView,
    listRecords: RecordListView
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
    serverConfig: function (serverId) {
        this.getOption('layout').triggerMethod('show');
        this.getOption('layout').triggerMethod('load:content', new (viewFor('serverConfig'))({
            serverId: serverId
        }));
    },
    listZones: function (serverId) {
        this.getOption('layout').triggerMethod('show');
        this.getOption('layout').triggerMethod('load:content', new (viewFor('listZones'))({
            serverId: serverId
        }));
    },
    listRecords: function (serverId, zoneId) {
        this.getOption('layout').triggerMethod('show');
        this.getOption('layout').triggerMethod('load:content', new (viewFor('listRecords'))({
            serverId: serverId,
            zoneId: zoneId
        }));
    }
});

let Router = Marionette.AppRouter.extend({
    appRoutes: {
        '': 'index',
        'about': 'about',

        'servers/': 'listServers',
        'servers/:id': 'editServer',

        'servers/:id/configuration': 'serverConfig',

        'servers/:id/zones': 'listZones',
        'servers/:id/zones/:zone/records': 'listRecords'
    },
    controller: new Controller()
});

export default Router;
