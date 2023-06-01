import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/', controller.home.index);
  router.get('/api/users/:id', app.jwt as any, controller.user.showUser);
  router.post('/api/users/create', controller.user.createByEmail);
  router.post('/api/users/loginByEmail', controller.user.loginByEmail);
  router.post('/api/users/sendCode', controller.user.sendVeriCode);
  router.post('/api/user/loginByPhoneNumber', controller.user.loginByPhoneNumber);
};
