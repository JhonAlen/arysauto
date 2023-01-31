import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SecurityConnectionService {

  constructor(private http: HttpClient) { }

  async securityVerifyModulePermission(params : any) : Promise<any>{
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try{
      let response = await this.http.post(`${environment.apiUrl}/api/security/verify-module-permission`, params, options).toPromise();
      return response;
    }
    catch(err){
      let message;
      let condition = false;
      let conditionMessage;
      switch(err.error.data.code){
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 401:
          condition = true;
          conditionMessage = err.error.data.condition;
          break;
        case 500:
          message = "HTTP.ERROR.INTERNALSERVERERROR";
          break;
        default:
          message = "HTTP.ERROR.INTERNALSERVERERROR";
          break;
      } 
      return { error: true, code: err.error.data.code, message: message, condition: condition, conditionMessage: conditionMessage };
    }
  }
}
