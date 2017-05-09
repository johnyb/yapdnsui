'use strict';

import Marionette from 'backbone.marionette';
import BaseLayout from 'javascripts/base_layout';

import { ServerListView, ServerConfigView, ServerStatsView } from 'javascripts/server';
import { ZoneListView } from 'javascripts/zones';
import { RecordListView } from 'javascripts/records';

const views = {
    listServers: ServerListView,
    serverConfig: ServerConfigView,
    serverStats: ServerStatsView,
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
    },
    about: function () {
        this.getOption('layout').triggerMethod('show');
    },
    listServers: function () {
        this.getOption('layout').triggerMethod('show');
        this.getOption('layout').triggerMethod('load:content', new (viewFor('listServers'))());
    },
    serverConfig: function (serverId) {
        this.getOption('layout').triggerMethod('show');
        this.getOption('layout').triggerMethod('load:content', new (viewFor('serverConfig'))({
            serverId: serverId
        }));
    },
    serverStats: function (serverId) {
        this.getOption('layout').triggerMethod('show');
        this.getOption('layout').triggerMethod('load:content', new (viewFor('serverStats'))({
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

        'servers/:id/configuration': 'serverConfig',
        'servers/:id/statistics': 'serverStats',

        'servers/:id/zones': 'listZones',
        'servers/:id/zones/:zone/records': 'listRecords'
    },
    controller: new Controller()
});

export default Router;
