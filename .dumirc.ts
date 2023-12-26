import { defineConfig } from 'dumi';

//github仓库名称
const defaultPath = '/candyhouse_sesame_doc'; 
//打包后gh-pages默认会拼接仓库名称在路径上
const baseUrl = process.env.NODE_ENV === 'production' ? defaultPath : '';


export default defineConfig({
  base: defaultPath,
  publicPath: `${baseUrl}/`,
  locales: [
    { id: 'zh-CN', name: '中文' },
    { id: 'en-US', name: 'EN' },
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
      { title: 'Guide', link: '/components/guide' },
      { title: 'Product', link: 'https://jp.candyhouse.co/' },
      { title: 'SesameSDK', link: '/components/sesamesdk' },
      { title: 'GitHub', link: 'https://github.com/CANDY-HOUSE' },
      { title: 'Terms', link: 'https://jp.candyhouse.co/pages/sesamesdk%E5%88%A9%E7%94%A8%E8%A6%8F%E7%B4%84' },

    ],
  },
});
