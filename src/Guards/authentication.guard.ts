import { BadRequestException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
// import { Observable } from "rxjs";
import { TOKEN_TYPES } from "../Common";
import { TokenService } from "../Common/Services";



@Injectable()
export default class AuthGuard implements CanActivate { 
    constructor(
        private readonly tokenService: TokenService
    ) {}
    async canActivate(context: ExecutionContext): Promise<boolean> { 
        const request = context.switchToHttp().getRequest()
        console.log(request);
            const { authorization } = request.headers
    if (!authorization) { 
        throw new BadRequestException('Authorization header is required')
    }

    const [perfix, token] = authorization.split('')
    if (perfix !== 'Bearer') { 
        throw new BadRequestException('Invalid authorization header')
    }

    const { user:userData, decodedData } = await this.tokenService.decodeToken({ token, tokenType: TOKEN_TYPES.ACCESS })
    if (!userData) { 
        throw new BadRequestException('Invalid user credentials, please register')
    }

    const authenticatedRequest = request
    authenticatedRequest.user = userData
    authenticatedRequest.accessTokenData = decodedData

    
        return true
        
    } 
}