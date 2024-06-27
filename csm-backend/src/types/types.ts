export const TYPES = {
    userController:Symbol.for("userController"),
    userService:Symbol.for("userService"),
    adminController:Symbol.for("adminController"),
    adminService:Symbol.for("adminService"),
    mediaService:Symbol.for("mediaService"),
    mediaController:Symbol.for("mediaController"),
            // Controllers
            UserController: Symbol.for('UserController'),
            SuperAdminController: Symbol.for('SuperAdminController'),
            // Services
            UserService: Symbol.for('UserService'),
            PermissionService: Symbol.for('PermissionService'),
            BlogPostService: Symbol.for('BlogPostService'),
          
            // Middlewares
            AuthMiddleware: Symbol.for('AuthMiddleware'),
            CachingMiddleware: Symbol.for('CachingMiddleware'),
            PermissionMiddleware: Symbol.for('PermissionMiddleware'),
            IsSuperAdminMiddleware: Symbol.for('IsSuperAdminMiddleware')
          
}