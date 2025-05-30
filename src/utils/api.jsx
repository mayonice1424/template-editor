export const Base_URL = import.meta.env.VITE_BASE_URL;

export const user = {
  login: Base_URL + "/login",
  register: Base_URL + "/register",
  show: Base_URL + "/users?",
  get: Base_URL + "/user",
  update: Base_URL + "/users/",
  changePassword: Base_URL + "/change-password",
  count: Base_URL + "/users-count",
};

export const departments = {
  get: Base_URL + "/departments",
  getAllDepartment: Base_URL + "/all/departments",
};

export const sidebar = {
  get: Base_URL + "/sidebars",
};

export const roles = {
  get: Base_URL + "/roles",
  getById: Base_URL + "/roles/",
};

export const dashboard = {
  get: Base_URL + "/7/dashboard",
  show: Base_URL + "/users?roleId=",
};

export const identity = {
  get: Base_URL + "/cards",
  getById: Base_URL + "/cards/",
  post: Base_URL + "/cards",
  patch: Base_URL + "/cards/",
};

export const document = {
  get: Base_URL + "/documents?",
  getType: Base_URL + "/document-types",
  patchSeen: Base_URL + "/count-see/document/",
  postDownload: Base_URL + "/downloads/document/",
  getSeen: Base_URL + "/document-seen/",
  getDetail: Base_URL + "/documents/",
  delete: Base_URL + "/documents/",
  post: Base_URL + "/documents",
};

export const inventory = {
  getCount: Base_URL + "/count/inventories",
  get: Base_URL + "/inventories?search=",
  post: Base_URL + "/inventories",
  patch: Base_URL + "/inventories/",
  getById: Base_URL + "/inventories/",
  delete: Base_URL + "/inventories/",
};

export const notification = {
  count: Base_URL + "/notifications/count",
  get: Base_URL + "/notifications?isRead=",
  delete: Base_URL + "/notifications/",
};

export const reset = {
  post_email: Base_URL + "/reset-password",
  post_new: Base_URL + "/reset-password/",
};

export const announcement = {
  post: Base_URL + "/announcements",
  get: Base_URL + "/announcements",
};

export const grafik = {
  pie: Base_URL + "/grafik/pie-profile",
  year: Base_URL + "/grafik/getYear",
  bar: Base_URL + "/grafik/read-document?",
  param: Base_URL + "/grafik/getParam?dateQuery=",
};
