const title = process.env.VUE_APP_TITLE;

module.exports = {
  chainWebpack: (config) => {
    config
      .plugin('html')
      .tap((args) => {
        args[0].title = title;
        return args;
      });
  },
};
