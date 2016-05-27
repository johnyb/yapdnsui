import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import $ from 'jquery';
import _ from 'underscore';

let Server = Backbone.Model.extend({
    defaults: {
        name: '',
        url: 'http://localhost:8053',
        password: 'changeme',
        pdns: {
            daemon_type: '',
            version: ''
        }
    },
    url: function () {
        return this.isNew() ? '/servers' : '/servers/' + this.id;
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

import ServerEditTemplate from 'templates/server/edit.jade';

let ServerEditView = Marionette.ItemView.extend({
    initialize: function () {
    },
    className: 'server-edit',
    template: ServerEditTemplate,
    events: {
        'click [data-action="submit"]': 'onSubmit'
    },
    onSubmit: function () {
        this.model.set('url', this.$('#mod-edit-url').val());
        this.model.set('password', this.$('#mod-edit-api-key').val());
        if (this.model.isNew()) {
            this.trigger('create:model', this.model);
        } else {
            this.model.save();
        }
        this.$('.modal').modal('hide');
    },
    onRender: function () {
        this.$('.modal')
            .modal()
            .one('hidden.bs.modal', () => this.remove());
    }
});

import serverList from 'templates/server/list.jade';

export let ServerListView = Marionette.CompositeView.extend({
    template: serverList,
    collection: servers,
    events: {
        'click .add-server': 'onAddServer'
    },
    onAddServer: function () {
        this.serverEdit = new ServerEditView({
            model: new Server()
        });
        this.serverEdit.render().$el.appendTo($('section.content'));
        this.listenTo(this.serverEdit, 'create:model', function (model) {
            this.collection.create(model, { wait: true });
        });
    },
    childView: Marionette.ItemView.extend({
        initialize: function () {
            this.model.fetch();
            this.listenTo(this.model, 'change', this.render);
        },
        tagName: 'tr',
        events: {
            'click .server-action button': function (e) {
                e.preventDefault();
                const action = $(e.currentTarget).data('action');
                const id = $(e.currentTarget).data('id');
                this.triggerMethod(action, id);
            }
        },
        onFetch: function () {
            this.model.fetch();
        },
        onEdit: function () {
            new ServerEditView({
                model: this.model
            }).render().$el.appendTo($('body section.content'));
        },
        onZones: function (id) {
            this.triggerMethod('load:content', `/servers/${id}`);
        },
        onDelete: function () {
            this.model.destroy();
        },
        template: _.template(`
        <td><%- name %></td>
        <td><%- url %></td>
        <td><%- pdns.daemon_type %></td>
        <td><%- pdns.version %></td>
        <td class="server-action">
            <div class="btn-group">
                  <button class="btn btn-default btn-xs" href="#" data-id="<%- id %>" data-action="zones" rel="tooltip" title="View zones for server">
                      <span class="glyphicon glyphicon-eye-open" />
                  </button>
                  <button class="btn btn-default btn-xs" href="#" data-id="<%- id %>" data-action="fetch" rel="tooltip" title="Refresh server information">
                    <span class="glyphicon glyphicon-retweet" />
                  </button>
                  <button class="btn btn-default btn-xs" href="#" data-id="<%- id %>" data-action="edit" rel="tooltip" title="Edit server">
                    <span class="glyphicon glyphicon-pencil" />
                  </button>
                  <button class="btn btn-danger btn-xs" href="#" data-id="<%- id %>" data-action="delete" rel="tooltip" title="Delete server">
                    <span class="glyphicon glyphicon-trash" />
                  </button>
            </div>
        </td>`)
    }),
    childViewContainer: 'table#servers-table > tbody'
});

export let ServerView = Marionette.LayoutView.extend({
});

export default ServerSelectionView;
