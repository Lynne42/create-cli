// 根目录新建 babel.config.js
module.exports = function (api) {
  api.cache(true)

  const presets = [
    [
      '@babel/env',
      {
        targets: {
          node: '8.9'
        }
      }
    ]
  ]

  if (!process.env['LOCAL_DEBUG']) {
    presets.push([
      'minify'
    ])
  }

  const plugins = []

  return {
    presets,
    plugins,
    ignore: ['node_modules']
  }
}

