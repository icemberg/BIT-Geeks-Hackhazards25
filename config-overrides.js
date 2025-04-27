const { addWebpackModuleRule, addWebpackPlugin, addWebpackAlias, addWebpackResolve } = require('customize-cra');
const webpack = require('webpack');
const path = require('path');

module.exports = function override(config, env) {
  // Add TypeScript rule
  config = addWebpackModuleRule({
    test: /\.(ts|tsx)$/,
    exclude: /node_modules\/(?!(groq-sdk|@sentry|@fluvio|scheduler)\/).*/,
    use: [
      {
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-env',
            '@babel/preset-react',
            '@babel/preset-typescript'
          ],
          plugins: [
            '@babel/plugin-transform-runtime',
            '@babel/plugin-proposal-class-properties',
            '@babel/plugin-transform-object-rest-spread'
          ]
        }
      }
    ]
  })(config);

  // Add CSS rule
  config = addWebpackModuleRule({
    test: /\.css$/,
    use: [
      'style-loader',
      {
        loader: 'css-loader',
        options: {
          modules: {
            auto: true,
            localIdentName: '[name]__[local]--[hash:base64:5]'
          }
        }
      }
    ]
  })(config);

  // Add file loader rule
  config = addWebpackModuleRule({
    test: /\.(png|jpe?g|gif|svg)$/i,
    use: [
      {
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'images/'
        }
      }
    ]
  })(config);

  // Add webpack aliases
  config = addWebpackAlias({
    '@': path.resolve(__dirname, 'src'),
    'scheduler': require.resolve('scheduler/cjs/scheduler.development.js'),
    'process/browser': require.resolve('process/browser'),
    '@fluvio/client': path.resolve(__dirname, 'src/mocks/fluvioMock.ts'),
    // Add aliases for Next.js modules
    'next/dynamic': path.resolve(__dirname, 'src/mocks/nextDynamicMock.js'),
    'next/font/google': path.resolve(__dirname, 'src/mocks/nextFontMock.js'),
    'next/server': path.resolve(__dirname, 'src/mocks/nextServerMock.js'),
    'next': path.resolve(__dirname, 'src/mocks/nextMock.js')
  })(config);

  // Add webpack resolve configuration
  config = addWebpackResolve({
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.css', '.mjs'],
    modules: ['node_modules'],
    fallback: {
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer/'),
      crypto: require.resolve('crypto-browserify'),
      util: require.resolve('util/'),
      assert: require.resolve('assert/'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      os: require.resolve('os-browserify/browser'),
      url: require.resolve('url/'),
      path: require.resolve('path-browserify'),
      fs: false,
      net: false,
      tls: false,
      zlib: require.resolve('browserify-zlib'),
      process: require.resolve('process/browser')
    }
  })(config);

  // Add plugins
  config = addWebpackPlugin(
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser'
    })
  )(config);

  config = addWebpackPlugin(
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.FLUVIO_SOCKET_TYPE': JSON.stringify('browser'),
      'globalThis.module': '{}'
    })
  )(config);

  // Add specific rule for @fluvio/client
  config.module.rules.push({
    test: /\.m?js/,
    resolve: {
      fullySpecified: false
    }
  });

  // Exclude @fluvio/client from babel-loader
  const babelLoader = config.module.rules.find(rule => rule.oneOf)?.oneOf.find(
    rule => rule.loader && rule.loader.includes('babel-loader')
  );
  if (babelLoader) {
    if (!babelLoader.exclude) babelLoader.exclude = [];
    babelLoader.exclude.push(/node_modules\/@fluvio\/client/);
  }

  // Ignore Next.js specific modules
  config.module.rules.push({
    test: /node_modules\/next\/(?!dynamic\.js)/,
    use: 'null-loader'
  });

  return config;
};