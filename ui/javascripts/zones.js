import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';

let Zone = Backbone.Model.extend({
    url: function () {
        return `/servers/${this.collection.serverId}/zones${this.isNew() ? '' : '/' + this.id}`;
    }
});

let ZoneCollection = Backbone.Collection.extend({
    initialize: function (list, options) {
        this.serverId = options.serverId;
    },
    model: Zone,
    url: function () {
        return `/servers/${this.serverId}/zones`;
    }
});

import ZoneEditTemplate from 'templates/zones/edit.jade';

let ZoneEditView = Marionette.ItemView.extend({
    initialize: function (options) {
        this.serverId = options.serverId;
        this.selectedServer = options.serverId;
    },
    className: 'zone-edit',
    template: ZoneEditTemplate,
    templateHelpers: function () {
        return {
            serverId: this.serverId
        };
    },
    events: {
        'click [data-action="submit"]': 'onSubmit'
    },
    onSubmit: function () {
        this.model.set('kind', this.$('input[name="kind"]:checked').val());
        this.model.set('name', this.$('input[name="name"]').val());
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

import ZoneListTemplate from 'templates/zones/list.jade';
import ListEntryTemplate from 'templates/zones/list_entry.jade';

export let ZoneListView = Marionette.CompositeView.extend({
    initialize: function (options) {
        this.selectedServer = options.serverId;
        this.collection = new ZoneCollection(null, {
            serverId: options.serverId
        });
    },
    template: ZoneListTemplate,
    templateHelpers: function () {
        return { zones: this.collection };
    },
    events: {
        'click .add-zone': 'onAddZone'
    },
    onAddZone: function () {
        this.zoneEdit = new ZoneEditView({
            serverId: this.collection.serverId,
            model: new Zone()
        });
        this.zoneEdit.render().$el.appendTo($('section.content'));
        this.listenTo(this.zoneEdit, 'create:model', function (model) {
            this.collection.create(model, { wait: true });
        });
    },
    onRender: function () {
        this.collection.fetch();
    },
    childView: Marionette.ItemView.extend({
        tagName: 'tr',
        events: {
            'click [data-action]': function (e) {
                e.preventDefault();
                const action = $(e.currentTarget).data('action');
                this.triggerMethod(action);
            }
        },
        onView: function () {
            this.triggerMethod('load:content', `servers/${this.model.collection.serverId}/zones/${this.model.id}`);
        },
        onEdit: function () {
            new ZoneEditView({
                serverId: this.model.collection.serverId,
                model: this.model
            }).render().$el.appendTo('body section.content');
        },
        onDelete: function () {
            this.model.destroy();
        },
        template: ListEntryTemplate,
        templateHelpers: function () {
            return {
                serverId: this.model.collection.serverId
            };
        }
    }),
    childViewContainer: 'tbody.zones-list'
});
