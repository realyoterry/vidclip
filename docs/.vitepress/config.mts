import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Vidclip",
  base: "/",
  description: "Next generation JavaScript screenshots Tool",
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],
  vite: {
    publicDir: 'static'
  },
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/getting-started' }
    ],

    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'About', link: '/about' },
          { text: 'Getting Started', link: '/getting-started' },
          { text: 'Configuration', link: '/configuration' },
          { text: 'Functions', link: '/functions' },
          { text: 'FAQ', link: '/faq' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/realyoterry/vidclip' }
    ],

    logo: '/logo.png',

    footer: {
        message: 'Released under the MIT License.',
        copyright: 'Copyright © 2025 Terry Kim. All rights reserved.'
    },
  }
});
