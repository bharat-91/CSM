import { injectable } from 'inversify'
import { Module } from '../models/moduleModel'
import { Role } from '../models/roleModel'
import { Permission } from '../models/permissionModel'

@injectable()
export class PermissionService {
  constructor() {}
  async getPermissions(module:any, role:any) {
    // console.log(role)
    let roles = await Role.findOne({ _id: role })
    console.log(roles)
    // console.log(roles.role)
    let userRole: any = roles?.role
    console.log(userRole)
    console.log(module)

    const permissions = [
      {
        $lookup: {
          from: 'roles',
          localField: 'roleid',
          foreignField: '_id',
          as: 'role'
        }
      },
      {
        $unwind: {
          path: '$role',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'modules',
          localField: 'moduleid',
          foreignField: '_id',
          as: 'module'
        }
      },
      {
        $unwind: {
          path: '$module',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          moduleName: '$module.name',
          roleName: '$role.role'
        }
      },
      {
        $match: {
          moduleName: module,
          roleName: userRole
        }
      },
      {
        $project: {
          read: { $cond: { if: '$read', then: '$read', else: '$$REMOVE' } },
          write: { $cond: { if: '$write', then: '$write', else: '$$REMOVE' } },
          delete: {
            $cond: { if: '$delete', then: '$delete', else: '$$REMOVE' }
          },
          update: {
            $cond: { if: '$update', then: '$update', else: '$$REMOVE' }
          },
          selfRead: {
            $cond: { if: '$selfRead', then: '$selfRead', else: '$$REMOVE' }
          },
          roleName: 1,
          _id: 0
        }
      }
    ]

    const result = await Permission.aggregate(permissions)
    return result
  }
  async addPermissions(body:any) {
    const module = await Module.findOne({ name: body.name })
    console.log(module)
    const role = await Role.findOne({ role: body.role })
    console.log(role)
    const newPermission = new Permission({
      moduleid: module?._id,
      roleid: role?._id,
      read: body.read,
      write: body.write,
      update: body.update,
      delete: body.delete
    })
    await newPermission.save()
    return newPermission
  }
}
