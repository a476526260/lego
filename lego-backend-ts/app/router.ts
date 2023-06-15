import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  const jwtMiddleware = app.jwt as any
  router.get('/', controller.home.index);
  router.get('/api/users/:id', jwtMiddleware, controller.user.showUser);
  router.post('/api/users/createEmailAccount', controller.user.createByEmail);
  router.post('/api/users/loginByEmail', controller.user.loginByEmail);
  router.post('/api/users/sendCode', controller.user.sendVeriCode);
  router.post('/api/user/loginByPhoneNumber', controller.user.loginByPhoneNumber);
  router.post('/api/work/createNewWork', jwtMiddleware, controller.work.createWork);
};
