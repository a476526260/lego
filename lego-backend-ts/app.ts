import { Application } from 'egg';
class AppBootHook {
  private readonly app: Application;
  constructor(app:Application) {
    app.sessionMap = {};
    app.sessionStore = {
      async get(key) {
        app.logger.info('key', key);
        return app.sessionMap[key];
      },
      async set(key, val) {
        app.logger.info('key', key);
        app.logger.info('value', val);
        app.sessionMap[key] = val;
      },
      async destroy(key) {
        delete app.sessionMap[key];
      },
    };
    this.app = app;
  }

  configWillLoad() {
    // 此时 config 文件已经被读取并合并，但是还并未生效
    // 这是应用层修改配置的最后时机
    // 注意：此函数只支持同步调用
  }

  async didLoad() {
    // 所有的配置已经加载完毕
    // 可以用来加载应用自定义的文件，启动自定义的服务
    console.log(this.app);
  }

  async willReady() {
    // 所有的插件都已启动完毕，但是应用整体还未 ready
    // 可以做一些数据初始化等操作，这些操作成功才会启动应用
  }

  async didReady() {
    // 应用已经启动完毕
    // console.log(this.app.middleware)
  }

  async serverDidReady() {
    // http / https server 已启动，开始接受外部请求
    // 此时可以从 app.server 拿到 server 的实例
  }
}

export default AppBootHook;
