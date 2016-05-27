'use strict';

import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import layout from 'templates/layout.jade';
import ServerSelectionView from 'javascripts/server';
import menu from 'templates/menu.jade';

let MainMenuView = Marionette.CollectionView.extend({
    tagName: 'menu',
    className: 'nav navbar-nav',
    events: {
        'click li > a': function (e) {
            e.preventDefault();
            this.triggerMethod('set:active:target', $(e.target).attr('data-target'));
        }
    },
    childView: Marionette.ItemView.extend({
        tagName: 'li',
        template: _.template('<a href="#" data-target="<%- target %>"><%- text %></a>')
    }),
    onSetActiveTarget: function (target) {
        this.$('li.active').removeClass('active');
        if (!target) return;
        this.$(`a[data-target="${ target }"]`).parent().addClass('active');
    }
});

let MenuView = Marionette.LayoutView.extend({
    attributes: {
        role: 'navigation'
    },
    events: {
        'click a.navbar-brand': function (e) {
            e.preventDefault();
            this.triggerMethod('load:content', '');
        }
    },
    className: '.container-fluid',
    template: menu,
    regions: {
        main: '.main',
        server_selection: '.navbar-right'
    },
    onShow: function () {
        this.showChildView(
            'main',
            new MainMenuView({
                collection: new Backbone.Collection([
                    { target: 'about', text: 'About' }
                ])
            })
        );
        this.showChildView(
            'server_selection',
            new ServerSelectionView()
        );
    },
    onLoadContent: function (target) {
        if (target === '') {
            this.getChildView('main').triggerMethod('set:active:target');
        }
    },
    onShowServer: function (id) {
        this.getChildView('main').collection.add([
            { target: `servers/${id}/config`, text: 'Configuration' },
            { target: `servers/${id}/zones`, text: 'Zones' },
            { target: `servers/${id}/statistics`, text: 'Statistics' }
        ], { at: 0 });
    },
    onChildviewSetActiveTarget: function (view, target) {
        if (typeof target === 'undefined') return;
        this.triggerMethod('load:content', target);
    }
});

let Layout = Marionette.LayoutView.extend({
    el: '#app-hook',
    template: layout,
    regions: {
        menu: 'nav.main-menu',
        content: 'section.content'
    },
    onShow: function () {
        this.showChildView(
            'menu',
            new MenuView({})
        );
    },
    onLoadContent: function (view) {
        if (view.selectedServer) {
            this.getChildView('menu').triggerMethod('show:server', view.selectedServer);
        }
        this.showChildView(
            'content',
            view
        );
    },
    onChildviewLoadContent: function (view, target) {
        this.triggerMethod('navigate:to', target);
    }
});

export default Layout;
