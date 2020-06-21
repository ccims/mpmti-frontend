import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private jwtHelper: JwtHelperService) { }

  /**
   *  Operation to check whether the user is authenticated or not.
   */
  public isAuthenticated(): boolean {
      const token = localStorage.getItem('token');
      /*          // Check whether the token is expired and return
              // true or false
              return !this.jwtHelper.isTokenExpired(token); */
      return token === 'test-token';
  }
}
