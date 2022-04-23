import { withPluginApi } from 'discourse/lib/plugin-api';
import { FeatureFlagStore, MOBILE_NAV_ENABLED } from './feature-flag-store';

const logoLink = 'https://bozeman.gather.coop/';
const logoUrl =
    'https://bozeman.gather.coop/assets/logo-white-98a1c78e06ef648c78ed7534fd90afacac1a02bfef6ba6cb8260aab41a73f590.png';
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
        className: 'active',
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
                            h('li.'.concat(link.className ?? ''), h('a', { attributes: { href: link.url } }, link.text))
                        );
                        return h(
                            'nav.navbar.navbar-default.hidden-xs',
                            h('div.nav-wrapper', [
                                h(
                                    'div.logo.nav-1.hidden-sm',
                                    h('a', { href: logoLink }, h('img', { attributes: { src: logoUrl } }))
                                ),
                                h('div.main-nav', h('ul.nav', navLinks)),
                            ])
                        );
                    }
                    return h('a', { attributes: { href: this.href(), 'data-auto-route': true } }, this.logo());
                },
            });
        });
    },
};
