module.exports = {
  presets: [['@babel/preset-env']],
  plugins: [
    ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }],
    ['@babel/plugin-transform-runtime', { corejs: 3 }],
  ],
};
