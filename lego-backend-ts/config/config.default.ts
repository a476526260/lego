import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + 'zds_love_gst_forever_2023';

  // add your egg config in here
  config.middleware = [];

  config.view = {
    defaultViewEngine: 'nunjucks',
  };

  config.mongoose = {
    url: 'mongodb://localhost:27017/lego_backend',
  };
  config.security = {
    csrf: {
      // 判断是否需要 ignore 的方法，请求上下文 context 作为第一个参数
      enable: false,
    },
  };
  config.bcrypt = {
    saltRounds: 5,
  };
  config.session = {
    encrypt: false
  }

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  };

  // the return config will combine to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  };
};
