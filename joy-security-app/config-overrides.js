const { override, fixBabelImports, addLessLoader } = require('customize-cra');
const HOST = process.env.HOST || '0.0.0.0';
const isInteractive = process.stdout.isTTY;
module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: { '@primary-color': '#25b864' },
  }),
);

module.exports = function override(config, env) {

    return config;
};
