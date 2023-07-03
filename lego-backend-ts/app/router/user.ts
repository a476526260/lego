module.exports = (app) => {
  const {controller, router} = app;
  const jwtMiddleware = app.jwt as any
  router.get('/api/users/:id', jwtMiddleware, controller.user.showUser);
  router.post('/api/users/createEmailAccount', controller.user.createByEmail);
  router.post('/api/users/loginByEmail', controller.user.loginByEmail);
  router.post('/api/users/sendCode', controller.user.sendVeriCode);
  router.post('/api/user/loginByPhoneNumber', controller.user.loginByPhoneNumber);
};
