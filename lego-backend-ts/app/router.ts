import {Application} from 'egg';

export default (app: Application) => {
  const {controller, router} = app;
  router.get('/', controller.home.index);

  require('./router/user')(app);
  require('./router/work')(app);
};
