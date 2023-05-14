import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { LocalStorageService } from '../local.storage.service';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
    
    constructor(private _router: Router,
                private _localStorage: LocalStorageService,
                private _authService: AuthService) {}
                
    public canActivate(): Promise<boolean> {
        const token = this._localStorage.get("auth_token");
        if (token == null) {
            this._router.navigate(['login']);
            return Promise.resolve(false);
        }
        
        if(this._localStorage.currentUser == null) {
            return lastValueFrom(this._authService.getCurrentUser())
            .then(x => {
                if (x == null) {
                    return false;
                }
                this._localStorage.set("auth_token", x.token);
                this._localStorage.currentUser = x.currentUser;
                return true;
            })
            .catch(() => {
                this._router.navigate(["login"]);
                return false;
            })
        }
        
        return Promise.resolve(true);
    }
  
}