import {Injectable} from '@angular/core';
import {User} from "../_dto/user/user";
import {HttpClient} from "@angular/common/http";
import {AppSettings} from "../app-settings";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private http: HttpClient) {
    }

    getAll() {
        return this.http.get<User[]>(AppSettings.API_ENDPOINT + `/users`);
    }

    register(user: User) {
        return this.http.post(AppSettings.API_ENDPOINT + `/users/register`, user);
    }

    getUserInfo(username: string): Observable<User> {
        return this.http.get<User>("http://localhost:8080/users/" + `${username}`)
    }

    delete(id: number) {
        return this.http.delete(AppSettings.API_ENDPOINT + `/users/${id}`);
    }
}
