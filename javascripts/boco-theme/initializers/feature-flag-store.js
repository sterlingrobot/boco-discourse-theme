// import { withPluginApi } from 'discourse/lib/plugin-api';
const STORE_KEY = '__featureFlags';

const MOBILE_NAV_ENABLED = 'MOBILE_NAV_ENABLED';

const FEATURE_FLAG_DEFAULT_VALUES = {
    [MOBILE_NAV_ENABLED]: false,
};
class FeatureFlagStore {
    data = {};

    callback = () => {};

    constructor() {
        this.load();
    }

    static store = window.sessionStorage;

    static get(key) {
        const data = FeatureFlagStore.load();
        return data[key];
    }

    static load() {
        const rawData = FeatureFlagStore.store.getItem(STORE_KEY);
        // if data is empty, save and return default values (runs once on session start)
        if (!rawData) {
            FeatureFlagStore.save();
            return FEATURE_FLAG_DEFAULT_VALUES;
        }
        return JSON.parse(rawData);
    }

    static save(rawData) {
        if (!rawData) {
            // save default values
            FeatureFlagStore.store.setItem(STORE_KEY, JSON.stringify(FEATURE_FLAG_DEFAULT_VALUES));
        } else {
            FeatureFlagStore.store.setItem(STORE_KEY, JSON.stringify(rawData));
        }
    }

    getData() {
        return this.data || {};
    }

    get(key) {
        return this.data[key];
    }

    set(key, value) {
        this.data[key] = value;
        this.save();
        this.callback(this.data);
    }

    load() {
        this.data = FeatureFlagStore.load();
        this.callback(this.data);
    }

    save() {
        FeatureFlagStore.save(this.data);
    }

    clear() {
        FeatureFlagStore.save();
        this.load();
    }

    subscribe(callback) {
        this.callback = callback;
    }
}

export default {
    name: 'feature-flag-store',
    initialize() {
        window.featureFlagStore = new FeatureFlagStore();
        console.log(window.featureFlagStore.getData());
    },
};
