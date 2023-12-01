module.exports = {
  packagerConfig: {},
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    //{
    //  name: '@electron-forge/maker-zip',
    //},
    //{
    //  name: '@electron-forge/maker-deb',
    //  config: {},
    //},
    //{
    //  name: '@electron-forge/maker-rpm',
    //  config: {},
    //},
    {
      name: '@electron-forge/maker-flatpak',
      config: {
        options: {
          categories: ['Video'],
          mimeType: ['video/h264']
        }
      }
    }
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-webpack',
      config: {
        mainConfig: './webpack.main.config.js',
        renderer: {
          config: './webpack.renderer.config.js',
          entryPoints: [
            {
              html: './src/index.html',
              js: './src/renderer.js',
              name: 'main_window',
              preload: {
                js: './src/preload.js',
              },
            },
            {
              html: './src/plotly_index.html',
              js: './src/plotly_renderer.js',
              name: 'child_window',
              preload: {
                js: './src/plotly_preload.js',
              },
            },
          ],
        },
      },
    },
  ],
};
