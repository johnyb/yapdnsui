import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import $ from 'jquery';
import _ from 'underscore';

let Server = Backbone.Model.extend({
    defaults: {
        name: '',
        url: '',
        daemon_type: '',
        version: ''
    },
    url: function () {
        return '/servers/' + this.id;
    }
});
let Servers = Backbone.Collection.extend({
    model: Server,
    url: '/servers'
});

let servers = new Servers();

let template = _.template(`
    <a href="#" data-toggle="dropdown" class="dropdown">
        PDNS Servers <span class="caret" />
    </a>
    <ul class="dropdown-menu">
        <li><a href="#" data-target="servers/">Configure …</a></li>
        <li role="separator" class="divider" />
    </ul>
`);

let ServerSelectionView = Marionette.CompositeView.extend({
    tagName: 'li',
    className: 'server-selection dropdown',
    events: {
        'click li > a': function (e) {
            e.preventDefault();
            this.triggerMethod('set:active:target', $(e.target).attr('data-target'));
        }
    },
    template: template,
    collection: servers,
    onShow: function () {
        this.collection.fetch();
    },
    childView: Marionette.ItemView.extend({
        tagName: 'li',
        template: _.template('<a href="#" data-target="servers/<%- id %>"><%- name %></a>')
    }),
    childViewContainer: 'ul.dropdown-menu'
});

import serverList from 'templates/servers.jade';

export let ServerListView = Marionette.CompositeView.extend({
    template: serverList,
    collection: servers,
    childView: Marionette.ItemView.extend({
        initialize: function () {
            this.model.fetch();
            this.listenTo(this.model, 'change', this.render);
        },
        tagName: 'tr',
        template: _.template('<td><%- name %></td><td><%- url %></td><td><%- daemon_type %></td><td><%- version %></td>')
    }),
    childViewContainer: 'table#servers-table > tbody'
});

export let ServerView = Marionette.LayoutView.extend({
});

export default ServerSelectionView;
