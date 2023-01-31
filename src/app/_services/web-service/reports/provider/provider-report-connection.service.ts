import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProviderReportConnectionService {

  constructor(private http: HttpClient) { }

  async searchProviderReport(params : any) : Promise<any>{
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try{
      let response = await this.http.post(`${environment.apiUrl}/api/v2/report/provider/production/search`, params, options).toPromise();
      return response;
    }
    catch(err){
      let message;
      switch(err.error.data.code){
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.PROVIDERREPORTS.PROVIDERREPORTNOTFOUND";
          break;
        case 500:
          message = "HTTP.ERROR.INTERNALSERVERERROR";
          break;
        default:
          message = "HTTP.ERROR.INTERNALSERVERERROR";
          break;
      } 
      return { error: true, code: err.error.data.code, message: message }
    }
  }

}
