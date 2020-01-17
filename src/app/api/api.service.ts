import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable, throwError } from 'rxjs';
import { catchError, filter } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Token, IMSCredential } from '../types/types-interfaces';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class ApiService {
    // private streams: Map<string, Subject<Readonly<any>>> = new Map();
    // private httpOptionsWithoutAuth = {
    //     headers: new HttpHeaders({
    //         'Content-Type': 'application/json'
    //         // 'Authorization': 'my-auth-token'
    //     })
    // };
    // private httpOptions = {
    //     headers: new HttpHeaders({
    //         'Content-Type': 'application/json',
    //         'Authorization': localStorage.getItem('token')
    //     })
    // };
    private basePath = 'http://localhost:8080';

    // constructor(private http: HttpClient, private jwtHelper: JwtHelperService) { }
    constructor(private jwtHelper: JwtHelperService) { }


    // /**
    //  * Canonize a resource url.
    //  *
    //  * (Remove schema, host, port, api path prefix and leading/trailing slashes.)
    //  *
    //  * @param streamURL resource url
    //  */
    // private canonizeStreamUrl(streamURL: string): string {
    //     try {
    //         const x = new URL(streamURL);
    //         streamURL = x.pathname;
    //     } catch (TypeError) { }
    //     streamURL = streamURL.replace(/(^\/)|(\/$)/g, '');
    //     streamURL = streamURL.replace(/\/\//g, '/');
    //     return streamURL;
    // }

    // /**
    //  * Fetch the stream source for the given resource url.
    //  *
    //  * @param streamURL resource url
    //  * @param defaultSubject function to create a new streamSource if needed (default: BehaviourSubject)
    //  */
    // private getStreamSource<T>(streamURL: string, defaultSubject: () => Subject<Readonly<T>> =
    //     () => new BehaviorSubject<Readonly<T>>(undefined)
    // ): Subject<Readonly<T>> {
    //     streamURL = this.canonizeStreamUrl(streamURL);
    //     let stream = this.streams.get(streamURL);
    //     if (stream == null) {
    //         stream = defaultSubject();
    //         if (stream != null) {
    //             this.streams.set(streamURL, stream);
    //         }
    //     }
    //     return stream as Subject<Readonly<T>>;
    // }

    // private handleError(error: HttpErrorResponse) {
    //     if (error.error instanceof ErrorEvent) {
    //         // A client-side or network error occurred. Handle it accordingly.
    //         console.error('An error occurred:', error.error.message);
    //     } else {
    //         // The backend returned an unsuccessful response code.
    //         // The response body may contain clues as to what went wrong,
    //         console.error(
    //             `Backend returned code ${error.status}, ` +
    //             `body was: ${error.error}`);
    //     }
    //     // return an observable with a user-facing error message
    //     return throwError(
    //         'Something bad happened; please try again later.');
    // }

    // postLogin(username: string, password: string): Observable<Token> {
    //     const ressouce = `${this.basePath}/login`;
    //     const user = { username, password };
    //     return this.http.post<Token>(ressouce, user, this.httpOptionsWithoutAuth).pipe(
    //         filter(token => token !== undefined && token.token !== undefined)
    //     );
    // }

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

    // postUsersIMSCredentials(credential: IMSCredential) {
    //     const ressouce = `${this.basePath}/users/${localStorage.getItem('username')}/ims-credentials/`;
    //     return this.http.post<string>(ressouce, credential, this.httpOptions).pipe(
    //         filter(response => response !== undefined)
    //     );
    // }

    // postUsersRSCredentials(credential: IMSCredential) {
    //     const ressouce = `${this.basePath}/users/${localStorage.getItem('username')}/repository-credentials/`;
    //     return this.http.post<string>(ressouce, credential, this.httpOptions).pipe(
    //         filter(response => response !== undefined)
    //     );
    // }
}
