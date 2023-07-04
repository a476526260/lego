export const utilsRoute =  (app) => {
  const {controller, router} = app;
  router.post('/api/util/uploadOss', controller.utils.uploadToOss);
  router.post('/api/util/uploadMultipleOss', controller.utils.uploadMutipleFiles);
};
