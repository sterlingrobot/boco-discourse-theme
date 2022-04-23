import { withPluginApi } from 'discourse/lib/plugin-api';
import { FeatureFlagStore, MOBILE_NAV_ENABLED } from './feature-flag-store';

const links = [
    {
        url: 'https://bozeman.gather.coop/users',
        text: 'People',
    },
    {
        url: 'https://bozeman.gather.coop/groups',
        text: 'Groups',
    },
    {
        url: 'https://bozeman.gather.coop/meals',
        text: 'Meals',
    },
    {
        url: 'https://bozeman.gather.coop/work/signups',
        text: 'Work',
    },
    {
        url: 'https://bozeman.gather.coop/calendars/events',
        text: 'Calendars',
    },
    {
        url: 'https://bozeman.gather.coop/wiki',
        text: 'Wiki',
    },
    {
        url: '/',
        text: 'Discourse',
    },
];

export default {
    name: 'add-gather-nav',
    initialize() {
        withPluginApi('0.8.7', (api) => {
            api.reopenWidget('home-logo', {
                html() {
                    const h = require('virtual-dom').h;
                    if (FeatureFlagStore?.get(MOBILE_NAV_ENABLED)) {
                        const navLinks = links.map((link) =>
                            h('li', h('a', { attributes: { href: link.url } }, link.text))
                        );
                        return h(
                            'nav.navbar.navbar-default.hidden-xs',
                            h('div.nav-wrapper', h('div.main-nav', h('ul.nav', navLinks)))
                        );
                    }
                    return h('a', { attributes: { href: this.href(), 'data-auto-route': true } }, this.logo());
                },
            });
        });
    },
};
