import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable } from 'rxjs';
import { LoginResult } from 'src/app/models/login.result';
import { environment } from 'src/environments/environment';
import { User } from '../../models/user';
import { LocalStorageService } from '../local.storage.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private baseUrl = environment.baseUrl;
    
    constructor(private _http: HttpClient) { }
    
    public loginUser(username: string, password: string): Observable<LoginResult> {
        return this._http.post<LoginResult>(this.baseUrl + '/auth/login', {username, password}, {withCredentials: true}).pipe(
            map(x => LoginResult.fromResponse(x))
        );
    }
    
    public getCurrentUser(): Observable<LoginResult> {
        return this._http.get<LoginResult>(this.baseUrl + '/auth/currentuser', {withCredentials: true}).pipe(
            map(x => LoginResult.fromResponse(x))
        );
    }
    
    public updateJWT(): Observable<LoginResult> {
        return this._http.get<LoginResult>(this.baseUrl + '/auth/updateJWT', {withCredentials: true}).pipe(
            map(x => LoginResult.fromResponse(x))
        );
    }
}
