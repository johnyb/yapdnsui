import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import { Zone } from 'javascripts/zones';

let Record = Backbone.Model.extend({
    initialize: function (options) {
        if (options.serverId) this.serverId = options.serverId;
        if (options.zoneId) this.zoneId = options.zoneId;
        if (!!options.name && !!options.type) {
            this.set('id', `${options.name}/${options.type}`);
        }
        this.listenTo(this, 'sync', function (model, response) {
            if (!response.rrsets) return;
            // when creating a new record, the complete zone is returned, we only need to store the record
            let value = response.rrsets
                .filter((set) => { return set.name === this.previous('name') && set.type === this.get('type'); })[0];
            this.set(value);
        });

    },
    defaults: {
        records: [{}]
    },
    url: function () {
        return `/servers/${this.serverId || this.collection.serverId}/zones/${this.zoneId || this.collection.zoneId}/records${this.isNew() ? '' : '/' + this.id}`;
    }
});

let RecordCollection = Backbone.Collection.extend({
    initialize: function (list, options) {
        this.serverId = options.serverId;
        this.zoneId = options.zoneId;
    },
    model: Record,
    url: function () {
        return `/servers/${this.serverId}/zones/${this.zoneId}/records`;
    }
});

import RecordEditTemplate from 'templates/records/edit.jade';

let RecordEditView = Marionette.ItemView.extend({
    initialize: function (options) {
        this.serverId = options.serverId;
        this.zoneId = options.zoneId;
        this.selectedServer = options.serverId;
    },
    className: 'records-edit',
    template: RecordEditTemplate,
    templateHelpers: function () {
        return {
            serverId: this.serverId,
            zoneId: this.zoneId
        };
    },
    events: {
        'click [data-action="submit"]': 'onSubmit'
    },
    onSubmit: function (ev) {
        ev.preventDefault();
        this.model.set('name', this.$('#mod-edit-record-name').val());
        this.model.set('type', this.$('#mod-edit-record-type').val());
        this.model.set('priority', this.$('#mod-edit-record-prio').val());
        this.model.set('ttl', parseInt(this.$('#mod-edit-record-ttl').val(), 10));
        this.model.set('records', [{
            content: this.$('#mod-edit-record-content').val(),
            disabled: this.$('#mod-edit-record-disabled').prop('checked')
        }]);
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

import RecordListTemplate from 'templates/records/list.jade';
import ListEntryTemplate from 'templates/records/list_entry.jade';

export let RecordListView = Marionette.CompositeView.extend({
    initialize: function (options) {
        this.selectedServer = options.serverId;
        this.selectedZone = options.zoneId;
        this.zone = new Zone({
            serverId: options.serverId,
            id: options.zoneId
        });
        this.zone.fetch();
        this.collection = new RecordCollection(null, {
            serverId: options.serverId,
            zoneId: options.zoneId
        });
        this.listenTo(this.collection, 'add remove reset', () => {
            this.$('.record-counter').text(
                this.collection.length
            );
        });
    },
    template: RecordListTemplate,
    templateHelpers: function () {
        return {
            zone: this.zone,
            records: this.collection
        };
    },
    events: {
        'click .create-record': 'onCreateRecord'
    },
    onCreateRecord: function () {
        this.recordEdit = new RecordEditView({
            serverId: this.collection.serverId,
            zoneId: this.collection.zoneId,
            model: new Record({
                serverId: this.collection.serverId,
                zoneId: this.collection.zoneId
            })
        });
        this.recordEdit.render().$el.appendTo($('section.content'));
        this.listenTo(this.recordEdit, 'create:model', function (model) {
            this.collection.create(model, { wait: true });
        });
    },
    onRender: function () {
        this.collection.fetch();
    },
    childView: Marionette.ItemView.extend({
        initialize: function () {
            this.listenTo(this.model, 'change', () => this.render());
        },
        tagName: 'tr',
        events: {
            'click [data-action]': function (e) {
                e.preventDefault();
                const action = $(e.currentTarget).data('action');
                this.triggerMethod(action);
            }
        },
        onView: function () {
            this.triggerMethod('load:content', `servers/${this.model.serverId}/zones/${this.model.zoneId}/${this.model.id}`);
        },
        onEdit: function () {
            new RecordEditView({
                serverId: this.model.serverId,
                zoneId: this.model.zoneId,
                model: this.model
            }).render().$el.appendTo('body section.content');
        },
        onDelete: function () {
            this.model.destroy();
        },
        template: ListEntryTemplate,
        templateHelpers: function () {
            return {
                serverId: this.model.serverId,
                zoneId: this.model.zoneId
            };
        }
    }),
    childViewContainer: 'tbody.records-list'
});
