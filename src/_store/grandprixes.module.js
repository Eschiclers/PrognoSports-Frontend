import {FETCH_GP_LIST, FETCH_GRAND_PRIX, FETCH_NEXT_GP} from "@/_store/actions.type";
import {grandPrixService} from "@/_services";
import {
    FETCH_GP_LIST_END,
    FETCH_GP_LIST_START,
    FETCH_GRAND_PRIX_END, FETCH_GRAND_PRIX_START,
    FETCH_NEXT_GP_END,
    FETCH_NEXT_GP_START
} from "@/_store/mutations.type";

const state = {
    grandPrix: {
        id: '',
        name: '',
        circuit: {
            id: '',
            name: ''
        }
    },
    isLoadingGrandPrix: true,
    startGrid: undefined,
    nextGp: {},
    isLoadingNextGp: true,
    gpList: [],
    isLoadingGps: true,
};

const getters = {
    grandPrix(state) {
        return state.grandPrix;
    },
    isLoadingGrandPrix(state) {
        return state.isLoadingGrandPrix;
    },
    startGrid(state) {
        return state.startGrid;
    },
    nextGp(state) {
        return state.nextGp;
    },
    isLoadingNextGp(state) {
        return state.isLoadingNextGp;
    },
    gpList(state) {
        return state.gpList;
    },
    isLoadingGps(state) {
        return state.isLoadingGps;
    },
};

const actions = {
    [FETCH_GRAND_PRIX]: ({commit, dispatch}, {season, id}) => {
        commit(FETCH_GRAND_PRIX_START);
        return new Promise((resolve, reject) => {
            grandPrixService.getGrandPrix(season, id)
            .then(gp => {
                commit(FETCH_GRAND_PRIX_END, gp);
            })
        });
    },
    [FETCH_NEXT_GP]: ({commit, dispatch}, searchType) => {
        commit(FETCH_NEXT_GP_START);
        return new Promise((resolve, reject) => {
            grandPrixService.getNextGrandPrix()
            .then(nextGp => {
                commit(FETCH_NEXT_GP_END, nextGp);
            })
        });
    },
    [FETCH_GP_LIST]: ({commit, dispatch}, searchType) => {
        commit(FETCH_GP_LIST_START);
        commit(FETCH_GP_LIST_END, undefined);
        return new Promise((resolve, reject) => {
            grandPrixService.getGrandPrixesList(searchType, 2020)
            .then(list => {
                commit(FETCH_GP_LIST_END, list);
            })
        });
    }
};

const mutations = {
    [FETCH_NEXT_GP_START]: (state) => {
        state.isLoadingNextGp = true;
    },
    [FETCH_NEXT_GP_END]: (state, gp) => {
        state.nextGp = gp;
        state.isLoadingNextGp = false;
    },
    [FETCH_GP_LIST_START]: (state) => {
        state.isLoadingGps = true;
    },
    [FETCH_GP_LIST_END]: (state, gps) => {
        state.gpList = gps;
        state.isLoadingGps = false;
    },
    [FETCH_GRAND_PRIX_START]: (state) => {
        state.isLoadingGrandPrix = true;
    },
    [FETCH_GRAND_PRIX_END]: (state, gp) => {
        state.grandPrix = gp;
        state.isLoadingGrandPrix = false;
    }
};

export default {
    state,
    getters,
    actions,
    mutations,
};