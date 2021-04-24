import {Injectable} from '@angular/core';
import {User} from "../_dto/user/user";
import {HttpClient} from "@angular/common/http";
import {AppSettings} from "../app-settings";

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

    delete(id: number) {
        return this.http.delete(AppSettings.API_ENDPOINT + `/users/${id}`);
    }
}
