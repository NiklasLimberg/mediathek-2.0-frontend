import VuexORM from '@vuex-orm/core'
import database from '~/database'

export const state = () => ({
    lastUpdated: 0
});

export const plugins = [
    VuexORM.install(database)
];

import Show from "~/models/Show";
import Episode from "~/models/Episode";

export const actions = {
    async nuxtServerInit(store, { $auth, $axios }) {
        if ($auth.loggedIn) {
            Show.insert({ data: await this.$axios.$get('/api/shows') });
            Episode.insert({ data: await this.$axios.$get('/api/episodes') });
        }
    }
};

export const mutations = {
    updateTimestamp: (state) => {
        state.lastUpdated = Math.floor(Date.now() / 1000);
    }
}

export const getters = {
    lastUpdated: (state) => {
        return state.lastUpdated;
    }
};
