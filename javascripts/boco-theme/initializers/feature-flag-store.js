import { withPluginApi } from 'discourse/lib/plugin-api';
export default {
    name: 'feature-flag-store',
    initialize() {
        withPluginApi('0.8.7', (api) => {
            console.log('initialized feature-flag-store');
        });
    },
};
