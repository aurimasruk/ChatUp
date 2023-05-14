import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

    private baseUrl = environment.baseUrl;
    constructor(private http: HttpClient) {
    }

    public createUser(user: User): Observable<User> {
        return this.http.post<User>(this.baseUrl + '/users/new', user);
    }
    
    public getUser(id: string): Observable<User> {
        return this.http.get<User>(this.baseUrl + `/users/${id}`);
    }
    
    public searchUsers(name: string): Observable<User[]> {
        return this.http.get<User[]>(this.baseUrl + `/users/search/${name}`);
    }
    
    public getAllUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.baseUrl + `/users/all`);
    }
    public deleteUser(id: string): Observable<User> {
        return this.http.delete<User>(this.baseUrl + `/users/delete/${id}`);
    }
    
    public isUserDeleted(username: string): Observable<boolean> {
        return this.http.get<boolean>(this.baseUrl + `/users/isDeleted/${username}`);
    }
}
