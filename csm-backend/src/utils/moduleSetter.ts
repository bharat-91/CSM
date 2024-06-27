import { NextFunction, Request } from 'express'

export const moduleType = (moduleName: string) => {
  return (req: any, res: Response, next: NextFunction) => {
    req.headers.module = moduleName
    next()
  }
}
