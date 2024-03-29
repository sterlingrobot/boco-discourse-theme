import { withPluginApi } from 'discourse/lib/plugin-api';
import { applyDecorators } from 'discourse/widgets/widget';
import getURL from 'discourse-common/lib/get-url';

import { FeatureFlagStore, MOBILE_NAV_ENABLED } from './feature-flag-store';

const flatten = (array) => [].concat.apply([], array);
const isRootUrl = () => new RegExp(window.location.host.concat('/$')).test(window.location.href);

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
        text: 'Reservations',
    },
    {
        url: 'https://calendar.google.com/calendar/u/4?cid=YWRtaW5AYm9jb2hvLm9ubGluZQ',
        text: 'Calendar'
    },
    {
        url: 'https://drive.google.com/drive/folders/17JICgu7kZ4FCmJiZEih1esubTM6Or3d2?usp=share_link',
        text: 'Documents',
    },
    {
        id: 'discourse-nav-link',
        url: '/',
        text: 'Discussions',
    },
   /* {
        id: 'messages-nav-link',
        url: '/my/messages',
        text: 'Messages',
    },*/
];

export default {
    name: 'add-gather-nav',
    initialize() {
        withPluginApi('0.8.7', (api) => {
            const h = require('virtual-dom').h;
            const navLinks = links.map((link) =>
                h(
                    'li'.concat(link.id ? `#${link.id}` : ''),
                    h('a', { attributes: { href: link.url, id: link.id } }, link.text)
                )
            );

            api.reopenWidget('home-logo', {
                html() {
                    const isMinimized = this.attrs.minimized;

                    const handleClick = (event) => {
                        event.preventDefault();
                        window.scrollTo(0, 0);
                    };

                    return h(
                        'nav.navbar'.concat(isMinimized ? '.minimized' : ''),
                        h('div.nav-wrapper', [
                            h(
                                'div.logo',
                                h(
                                    'a',
                                    {
                                        href: isMinimized ? '#' : getURL('/'),
                                        onclick: isMinimized ? handleClick : undefined,
                                    },
                                    h('img', { attributes: { src: logoUrl } })
                                )
                            ),
                            h('div.main-nav', h('ul.nav', navLinks)),
                        ])
                    );
                },
            });

            api.onPageChange((url) => {
                const isMessages = /\/messages/.test(url);
               // document.getElementById('messages-nav-link').classList.toggle('active', isMessages);
                document.getElementById('discourse-nav-link').classList.toggle('active', !isMessages);
            });

            if (FeatureFlagStore.get(MOBILE_NAV_ENABLED)) {
                api.reopenWidget('hamburger-menu', {
                    panelContents() {
                        const { attrs, capabilities, currentUser, settings, site, siteSettings, state } = this;
                        const results = [];
                        const faqUrl = siteSettings.faq_url || getURL('/faq');
                        const prioritizeFaq = settings.showFAQ && currentUser && !currentUser.read_faq;
                        const mobileTouch = siteSettings.enable_mobile_theme && capabilities.touch;

                        if (prioritizeFaq) {
                            results.push(
                                this.attach('menu-links', {
                                    name: 'faq-link',
                                    heading: true,
                                    contents: () => {
                                        return this.attach('priority-faq-link', { href: faqUrl });
                                    },
                                })
                            );
                        }

                        if (site.mobileView || mobileTouch) {
                            results.push(
                                this.attach('menu-links', {
                                    name: 'gather-links',
                                    contents: () =>
                                        links
                                            .slice(0, 6)
                                            .map((link) => h('a', { attributes: { href: link.url } }, link.text)),
                                })
                            );
                        }

                        if (currentUser && currentUser.staff) {
                            results.push(
                                this.attach('menu-links', {
                                    name: 'admin-links',
                                    contents: () => {
                                        const extraLinks = flatten(applyDecorators(this, 'admin-links', attrs, state));
                                        return this.adminLinks().concat(extraLinks);
                                    },
                                })
                            );
                        }

                        results.push(
                            this.attach('menu-links', {
                                name: 'general-links',
                                contents: () => this.generalLinks(),
                            })
                        );

                        if (settings.showCategories) {
                            results.push(this.listCategories());
                            results.push(h('hr.categories-separator'));
                        }

                        results.push(
                            this.attach('menu-links', {
                                name: 'footer-links',
                                omitRule: true,
                                contents: () => this.footerLinks(prioritizeFaq, faqUrl),
                            })
                        );

                        return results;
                    },
                });
            }
        });
    },
};
