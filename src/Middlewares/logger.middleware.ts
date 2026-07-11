// import { Injectable, NestMiddleware } from "@nestjs/common";

import { NextFunction, Request, Response}from "express"




// @Injectable()
// export default class LoggerMiddleware implements NestMiddleware { 
//     use(req: Request, res: Response, next: NextFunction) { 
//         console.log('Request...', req.method, req.url);
//         next()
        
//     }
// } 

export default function LoggerMiddleware(req: Request, res: Response, next: NextFunction) {
  console.log('Request...', req.method, req.url);
  next();
}