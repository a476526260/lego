import {Application} from 'egg';
import {userRoute} from './router/user';
import {workRoute} from './router/work';

export default (app: Application) => {
  const {controller, router} = app;
  router.get('/', controller.home.index);

  userRoute(app);
  workRoute(app);
};
