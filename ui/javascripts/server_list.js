import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import $ from 'jquery';
import _ from 'underscore';

let ServerCollection = Backbone.Collection.extend({
    url: '/servers'
});

let template = _.template(`
    <a href="#" data-toggle="dropdown" class="dropdown">
        PDNS Servers <span class="caret" />
    </a>
    <ul class="dropdown-menu">
        <li><a href="#" data-target="servers/edit">Configure …</a></li>
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
    collection: new ServerCollection(),
    onShow: function () {
        this.collection.fetch();
    },
    childView: Marionette.ItemView.extend({
        tagName: 'li',
        template: _.template('<a href="#" data-target="servers/<%- id %>"><%- name %></a>')
    }),
    childViewContainer: 'ul.dropdown-menu'
});

export default ServerSelectionView;
