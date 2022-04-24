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
            const h = require('virtual-dom').h;
            const navLinks = links.map((link) =>
                h('li.'.concat(link.className ?? ''), h('a', { attributes: { href: link.url } }, link.text))
            );

            api.reopenWidget('home-logo', {
                html() {
                    const isMinimized = this.attrs.minimized;

                    return h(
                        'nav.navbar.navbar-default.hidden-xs',
                        h('div.nav-wrapper', [
                            h(
                                'div.logo.nav-1.hidden-sm',
                                h(
                                    'a',
                                    { href: logoLink, attributes: { style: isMinimized ? 'width: 2.4rem' : '' } },
                                    h('img', { attributes: { src: logoUrl } })
                                )
                            ),
                            h('div.main-nav', h('ul.nav', navLinks)),
                        ])
                    );
                },
            });

            if (FeatureFlagStore.get(MOBILE_NAV_ENABLED)) {
                api.decorateWidget('hamburger-menu:before', (helper) => {
                    const { capabilities, site, siteSettings } = this;
                    const mobileTouch = siteSettings.enable_mobile_theme && capabilities.touch;

                    if (site.mobileView || mobileTouch) {
                        return helper.h('div.main-nav', h('ul.nav', navLinks));
                    }
                });
            }
        });
    },
};
