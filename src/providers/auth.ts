import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { Api } from "./api";
import {CheckUser} from "../models/check_user";
import {Data} from "./data";
import {User} from "../models/user";
import {NavController} from "ionic-angular";


/**
 * Most apps have the concept of an Account. This is a simple provider
 * with stubs for login/signup/etc.
 *
 * This Account provider makes calls to our API at the `login` and `signup` endpoints.
 *
 * By default, it expects `login` and `signup` to return a JSON object of the shape:
 *
 * ```json
 * {
 *   status: 'success',
 *   user: {
 *     // User fields your app needs, like "id", "name", "email", etc.
 *   }
 * }
 * ```
 *
 * If the `status` field is not `success`, then an error is detected and returned.
 */
@Injectable()
export class Auth {
  currentUser: User;
  _authenticated: Boolean = false;

  //TODO: Change to observable so that api class can deal with token changes

  constructor(public http: HttpClient, public api: Api, public data: Data) {
    this.currentUser = data.datastore.user;

    console.log('name:', this.currentUser.username);
  }

  /**
   * Send a GET request to our login endpoint to obtain the csrf cookie.
   */
/*
  getcsrf() {
		//let options = new RequestOptions({
		//	withCredentials: true
		//});
    let seq = this.api.get('login/', '').share();


    console.log('OK000');
    seq
      //.map(res => res.json())
      .map((res: any) => res)
      .subscribe((res: any) => {
        console.log('res',res);
        // If the API returned a successful response, mark the user as logged in
        if(res.status == 200) {
          //let rx = /csrfmiddlewaretoken' value='(.*)'.*\/>/g;
          //let arr = rx.exec(res._body);
          //console.log(arr[1]);
        } else {
          console.error('ERROR !200');
        }
      }, err => {
        console.error('ERROR 22222222222', err);
      }
      );
    return seq;
  }
*/

  token_api(api: string, body: any): Observable<boolean> {
    //let seq = this.api.post('auth/register', accountInfo).share();
    console.log('token_api:', this.api.url + api + '/', body);
    return this.http.post(this.api.url + api + '/', body)
      //.subscribe(res => {
      .map(res => {
        console.log('token_api');
        console.log('token_api result:', res);
        // login successful if there's a jwt token in the response
        if (res['token']) {
            // set token property
            this.token = res['token'];

            //console.log('SETTING WEBSOCKETTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT');
            //Ng2DjangoChannelsDemultiplexingModule.forRoot({websocket_url: 'ws://XXXXXhome.nadalia.com/stream'});

            // return true to indicate successful login
            return true;
        } else {
            // return false to indicate failed login
            return false;
        }
      })
      .catch(error => {
        console.log('loading login error');
        console.log('loading login error: ' + error);
        if (error.status == 0)
          return Observable.throw('Cannot access server');
        return Observable.of(false);
      });
  }

  login(credentials: any): Observable<boolean> {
    this.currentUser.first_name = credentials.first_name;
    this.currentUser.last_name = credentials.last_name;
    //this.currentUser.username = User.generate_username(credentials.first_name, credentials.last_name);
    this.currentUser.password = credentials.password;

    return this.token_api('api-token-auth', {username: credentials.username, password: credentials.password});
/*

    return Observable.create(observer => {
        // At this point make a request to your backend to make a real check!
        let access = (credentials.password === "pass" && credentials.username === "name");
        console.log('LEEEEEEEEEEEEEEEEEEEEEEEEEEEEEET:', access);
        this.currentUser = new User(credentials.username);
        observer.next(access);
        observer.complete();
      });
    }
*/

/*    let headers = new Headers({
			'Content-Type': 'application/x-www-form-urlencoded'
		});
		let options = new RequestOptions({
			headers: headers
		});

    let body = 'username=' + credentials.username + '&password=' + credentials.password + '&csrfmiddlewaretoken=' + credentials.csrf;
    //let body = 'username=nadav&password=das&csrfmiddlewaretoken=' + accountInfo.csrf;
    let seq = this.api.post('login/', body, options).share();

    seq
      .map(res => res.json())
      .subscribe(res => {
        // If the API returned a successful response, mark the user as logged in
        if(res.status == 'success') {
          this._loggedIn(res);
        } else {
        }
      }, err => {
        console.error('ERROR', err);
      });



    return seq;
*/
  }

  get token() {
    return this.currentUser.token
  }

  verify_session(): Observable<boolean> {
    console.log('verifying_session');
    return this.refresh_token();
  }

  refresh_token(): Observable<boolean> {
    console.log('refreshing_session:', this.currentUser);
    if (!this.currentUser.token) {
      console.log('refreshing_session: clear');
      this.clearToken();      //Not sure why we are doing this...
      console.log('No token');

      return Observable.of(false);
      //return Observable.throw('Please reenter credentials');
    }

    return this.token_api('api-token-verify', {'token': this.currentUser.token});
  }

  /**
   * Send a POST request to our signup endpoint with the data
   * the user entered on the form.
   */
  signup(accountInfo: any): Observable<User> {
    console.log('Creating user:', accountInfo);
    return this.api.post('auth/users/create', accountInfo)//.share();
      .map((resp: any) => {
        console.log('Creating user response:', resp);
        this.token = resp.token;
        return resp;
      })
      .catch((error: any) => {
        let errorString: String = '';
        try {
          for (var element in error.error) {
            errorString += error.error[element].toString();             // deals with form {'password':["This password is too common.", "This password is entirely numeric."]}
          }
        }
        catch (e) { errorString += error.error.toString(); }
        return Observable.throw(errorString);
      });
  }


  /**
   * Send a GET request to receive info about the account - if it's free/validated.
   */
  check(accountInfo: any, onNext: (check_user: CheckUser) => void) {
    let seq = this.http.get(this.api.construct_url('users/check_user_free/' + accountInfo.first_name + "/" + accountInfo.last_name + "/" + accountInfo.verification_code)).share();

    //let seq = this.api.get('users/check_user/' + accountInfo.first_name + "/" + accountInfo.last_name).share();

    seq
      .map(res => new CheckUser(res))
      .subscribe(onNext,error => onNext(new CheckUser(error)));

    return seq;
  }

  /**
   * Send a GET request to receive info about the account - if it's free/validated.
   */
  get_profiles(verification_code: string): Observable<{}> {
    return this.api.get('users/get_profiles/' + verification_code)
      //.map(resp => resp.json())
      .catch((res:any) => Observable.throw(res.status));
  }

  set token(token: string){
    this.currentUser.token = token;
    this.api.token = token;
    this._authenticated = true;
  }

  clearToken(){
    this.currentUser.token = null;
    this.api.token = null;
    this._authenticated = false;
  }

  /**
   * Log the user out, which forgets the session
   */
  logout() {
    this.clearToken();
    //this.currentUser = null;
    //localStorage.removeItem('currentUser');
  }

  get authenticated() {
    return this._authenticated;
  }

  redirect_if_not_authenticated(navCtrl: NavController) {
    if (this.authenticated) return true;
    else
      setTimeout(() => {
        navCtrl.setRoot('LoginPage')
      }, 0);
    return false
  }
}
