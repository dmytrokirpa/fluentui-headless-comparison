import gitStorage from 'monosize-storage-git';
import webpackBundler from 'monosize-bundler-webpack';

/** @type {import('monosize').MonoSizeConfig} */
const config = {
  repository: 'https://github.com/dmytrokirpa/fluentui-headless-comparison',
  storage: gitStorage({
    owner: 'dmytrokirpa',
    repo: 'fluentui-headless-comparison',
    workflowFileName: 'bundle-size.yml',
    outputPath: 'public/monosize.json',
  }),
  bundler: webpackBundler(config => {
    return config;
  }),
  assetTypes: ['js', 'css', 'json'],
};

export default config;