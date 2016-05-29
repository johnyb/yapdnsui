import Marionette from 'backbone.marionette';

export let RecordListView = Marionette.View.extend({
    initialize: function (options) {
        this.selectedServer = options.serverId;
        this.selectedZone = options.zoneId;
    },
    render: function () {
        this.$el.append('TODO: implement me');
    }
});
