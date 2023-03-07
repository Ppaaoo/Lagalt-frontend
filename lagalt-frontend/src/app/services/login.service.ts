import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';

const { apiUsers, apiKey } = environment;

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private readonly http: HttpClient) { }

  //Login
  public login(username: string): Observable<User> {
      return this.checkUsername(username)
        .pipe(
          switchMap((userResponse: User | undefined) => {
              if(userResponse == undefined) {
                return this.createUser(username);
              }
              return of(userResponse);
          })
        )
  }

  //Check if user exists
  private checkUsername(username: string): Observable<User | undefined> {
    return this.http.get<User[]>(`${apiUsers}?user=${username}`)
    .pipe(
      map((response: User[]) => response.pop())
    )
  }

  //Create user
  private createUser(username: string): Observable<User> {
    const user = {
      username,
    };
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      "x-api-ker": apiKey
    });

    return this.http.post<User>(apiUsers, user, { headers })
  }
}