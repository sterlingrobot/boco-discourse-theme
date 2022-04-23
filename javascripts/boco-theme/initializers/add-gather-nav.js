import { withPluginApi } from 'discourse/lib/plugin-api';
import { FeatureFlagStore, MOBILE_NAV_ENABLED } from './feature-flag-store';

export default {
    name: 'add-gather-nav',
    initialize() {
        withPluginApi('0.8.7', (api) => {
            api.reopenWidget('home-logo', {
                html() {
                    const h = require('virtual-dom').h;
                    if(FeatureFlagStore?.get(MOBILE_NAV_ENABLED)) {
                        return h('a', { attributes: { href: this.href(), 'data-auto-route': true, 'data-gather': true } }, this.logo());
                    }
                    return h('a', { attributes: { href: this.href(), 'data-auto-route': true } }, this.logo());
                },
            });
        });
    },
};
