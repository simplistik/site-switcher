module.exports = {
  plugins: {
    autoprefixer: {
      overrideBrowserslist: [
        'last 2 versions',
        '> 1%',
        'not dead',
        'not ie 11',
      ],
      grid: 'autoplace',
    },

    ...( process.env.NODE_ENV === 'production' && {
      cssnano: {
        preset: [
          'default',
          {
            cssDeclarationSorter: false,
            discardComments: {
              removeAll: true,
              removeAllButFirst: false,
            },
            calc: false,
            discardImportant: false,
          },
        ],
      },
    } ),
  },
};
