import { BindingScopeEnum, Container } from "inversify";
import { mediaController, userController } from "./controller";
import { TYPES } from "./types/types";
import { mediaService, userService } from "./service";
import { adminService } from "./service/admin.service";
import { adminController } from "./controller/admin.controller";
import { PermissionService } from "./service/permission.service";
import { UserService } from "./service/superAdmin";
import { SuperAdminController } from "./controller/superAdminController";
import { PermissionMiddleware } from "./middleware/permission.middleware";

const container = new Container()
container.bind<userController>(TYPES.userController).to(userController)
container
  .bind<SuperAdminController>(TYPES.SuperAdminController)
  .to(SuperAdminController)
container.bind<userService>(TYPES.userService).to(userService)
container.bind<adminService>(TYPES.adminService).to(adminService)
container.bind<adminController>(TYPES.adminController).to(adminController)
container.bind<mediaController>(TYPES.mediaController).to(mediaController);
container.bind<mediaService>(TYPES.mediaService).to(mediaService)
container.bind<UserService>(TYPES.UserService).to(UserService)
container.bind<PermissionService>(TYPES.PermissionService).to(PermissionService)
container.bind<PermissionMiddleware>(TYPES.PermissionMiddleware).to(PermissionMiddleware)

export {container}