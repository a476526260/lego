export const workRoute = (app) => {
  const {controller, router} = app;
  const jwtMiddleware = app.jwt as any
  router.post('/api/work/createNewWork', jwtMiddleware, controller.work.createWork);
  router.patch('/api/works/:id', jwtMiddleware, controller.work.update);
  router.delete('/api/works/:id', jwtMiddleware, controller.work.delete);
  router.post('/api/works/publishWork/:id', jwtMiddleware, controller.work.publishWork);
  router.post('/api/works/publishTemplate/:id', jwtMiddleware, controller.work.publishTemplate);
};
