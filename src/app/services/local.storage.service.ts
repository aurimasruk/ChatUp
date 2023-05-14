import { Injectable } from '@angular/core';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
    
    public currentUser: User | undefined;
    
    public set(key: string, value: string) {
        localStorage.setItem(key, value);
    }

    public get(key: string) {
        return localStorage.getItem(key);
    }

    public remove(key: string) {
        localStorage.removeItem(key);
    }
    
    public getJwtToken(): string {
        return localStorage.getItem("auth_token") || "";
    }

    // private getCurrentUsername() {
    //     const token = this.getJwtToken();
    //     if (token == null) {
            
    //     }
        
    //     var jwtTokenData = (JSON.parse(atob(token.split('.')[1])));
    //     const nameIdentifierKey = Object.keys(jwtTokenData).find(x => x.includes("nameidentifier")) || "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
    //     const username = jwtTokenData[nameIdentifierKey];
    //     return username;
    // }
}
