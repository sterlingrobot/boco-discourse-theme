import { withPluginApi } from 'discourse/lib/plugin-api';
import { FeatureFlagStore } from './feature-flag-store';

export default {
    name: 'add-gather-nav',
    initialize() {
        withPluginApi('0.8.7', (api) => {
            console.log('initialize add-gather-nav', {
                MOBILE_NAV_ENABLED: FeatureFlagStore?.get('MOBILE_NAV_ENABLED'),
            });
            api.reopenWidget('home-logo', {
                html() {
                    const h = require('virtual-dom').h;
                    return h('a', { attributes: { href: this.href(), 'data-auto-route': true } }, this.logo());
                },
            });
        });
    },
};
