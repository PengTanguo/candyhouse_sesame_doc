import { defineConfig } from 'dumi';

export default defineConfig({
  locales: [
    { id: 'zh-CN', name: '中文' },
    // { id: 'en-US', name: 'EN' },
    { id: 'ja', name: '日本語' }
  ],
  outputPath: 'docs-dist',
  themeConfig: {
    name: 'SESAME',
    logo: false,
    socialLinks: {
      github: 'https://github.com/CANDY-HOUSE',
    },
    nav: [
      // { title: 'Guide', link: '/components/guide' },
      // { title: 'Product', link: 'https://jp.candyhouse.co/' },
      // { title: 'SesameSDK', link: '/components/sesamesdk' },
      // { title: 'GitHub', link: 'https://github.com/CANDY-HOUSE' },
      // { title: 'Terms', link: 'https://jp.candyhouse.co/pages/sesamesdk%E5%88%A9%E7%94%A8%E8%A6%8F%E7%B4%84' },

    ],
  },
});
