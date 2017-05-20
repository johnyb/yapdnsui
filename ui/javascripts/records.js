import Vue from 'vue';

import RecordsListView from 'templates/records/list.vue';

export let RecordsList = Vue.component('records-list', {
    render: h => h(RecordsListView)
});
