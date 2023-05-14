import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { from, lastValueFrom, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { LocalStorageService } from '../local.storage.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private _authService: AuthService,
                private _localStorage: LocalStorageService,
                private _router: Router){
    }
    
    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return from(this.handle(req, next))
    }
    
    public async handle(req: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
        if(req.url.endsWith("/auth/updateJWT") || req.url.endsWith("/auth/login") || req.url.endsWith("/users/new") || req.url.endsWith("/auth/logout")) {
            return await lastValueFrom(next.handle(req));
        }
        
        const token = await this.getToken(); 

        if (!token) {
            return await lastValueFrom(next.handle(req));
        }
        
        const req1 = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`),
        });

        return await lastValueFrom(next.handle(req1));
    }
    
    private getToken(): Promise<string> {
        const token = localStorage["auth_token"];
        
        if(this.tokenExpired(token))
        {
            return lastValueFrom(this._authService.updateJWT())
                .then(x => {
                    if (x == null) {
                        return "";
                    }
                    this._localStorage.set("auth_token", x.token);
                    this._localStorage.currentUser = x.currentUser;
                    return x.token;
                })
                .catch((x) => {
                    this._router.navigate(["login"])
                    return x.token;
                })
        }
        else {
            return token;
        }
    }
    
    private tokenExpired(token: string) {
        var jwtTokenData = (JSON.parse(atob(token.split('.')[1])));
        const expiry = jwtTokenData.exp;
        return (Math.floor((new Date).getTime() / 1000)) >= expiry;
    }

}