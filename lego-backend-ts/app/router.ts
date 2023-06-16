import {Application} from 'egg';

export default (app: Application) => {
  const {controller, router} = app;

  const jwtMiddleware = app.jwt as any
  router.get('/', controller.home.index);
  router.get('/api/users/:id', jwtMiddleware, controller.user.showUser);
  router.post('/api/users/createEmailAccount', controller.user.createByEmail);
  router.post('/api/users/loginByEmail', controller.user.loginByEmail);
  router.post('/api/users/sendCode', controller.user.sendVeriCode);
  router.post('/api/user/loginByPhoneNumber', controller.user.loginByPhoneNumber);
  router.post('/api/work/createNewWork', jwtMiddleware, controller.work.createWork);

  router.patch('/api/works/:id', jwtMiddleware, controller.work.update);
  router.delete('/api/works/:id', jwtMiddleware, controller.work.delete);

  router.post('/api/works/publishWork/:id', jwtMiddleware, controller.work.publishWork);
  router.post('/api/works/publishTemplate/:id', jwtMiddleware, controller.work.publishTemplate);
};
