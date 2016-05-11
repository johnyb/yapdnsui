'use strict';

import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import layout from 'templates/layout.jade';
import menu from 'templates/menu.jade';
import about from 'templates/about.jade';

let templates = {
    index: about,
    about: about
};

let MainMenuView = Marionette.CollectionView.extend({
    tagName: 'menu',
    className: 'nav navbar-nav',
    events: {
        'click li > a': function (e) {
            e.preventDefault();
            this.triggerMethod('set:active:target', $(e.target).attr('data-target'));
        }
    },
    childView: Marionette.LayoutView.extend({
        tagName: 'li',
        template: _.template('<a href="#" data-target="<%- target %>"><%- text %></a>')
    }),
    onSetActiveTarget: function (target) {
        this.$el.removeClass('active');
        if (!target) return;
        this.$(`a[data-target=${ target }]`).parent().addClass('active');
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
        server_selection: '.server-selection'
    },
    onShow: function () {
        this.showChildView(
            'main',
            new MainMenuView({
                collection: new Backbone.Collection([{ target: 'about', text: 'About' }])
            })
        );
    },
    onLoadContent: function (target) {
        if (target === '') {
            this.getChildView('main').triggerMethod('set:active:target');
        }
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
    onLoadContent: function (target) {
        if (target === '') target = 'index';
        this.showChildView(
            'content',
            new (Marionette.LayoutView.extend({
                template: templates[target]
            }))()
        );
    },
    onChildviewLoadContent: function (view, target) {
        this.triggerMethod('load:content', target);
        Backbone.history.navigate(target);
    }
});

export default Layout;
