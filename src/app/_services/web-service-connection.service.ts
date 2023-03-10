import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WebServiceConnectionService {

  constructor(private http: HttpClient) { }

  async securityVerifyModulePermission(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/security/verify-module-permission`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      let condition = false;
      let conditionMessage;
      switch (err.error.data.code) {
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

  async uploadFile(formData: FormData): Promise<any> {
    try {
      let response = this.http.post<any>(`${environment.apiUrl}/api/upload/image`, formData).toPromise();
      return response;
    }
    catch (err) {
      return { error: true };
    }

  }

  async searchVehicleType(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/v2/vehicle-type/production/search`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.VEHICLETYPES.VEHICLETYPENOTFOUND";
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

  async detailVehicleType(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/v2/vehicle-type/production/detail`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.VEHICLETYPES.VEHICLETYPENOTFOUND";
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

  async createVehicleType(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/v2/vehicle-type/production/create`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.VEHICLETYPES.VEHICLETYPENOTFOUND";
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

  async updateVehicleType(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/v2/vehicle-type/production/update`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.VEHICLETYPES.VEHICLETYPENOTFOUND";
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

  async valrepDocumentType(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/valrep/document-type`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.VALREP.DOCUMENTTYPENOTFOUND";
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

  async valrepState(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/valrep/state`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.VALREP.STATENOTFOUND";
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

  async valrepBusinessActivity(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/valrep/business-activity`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.VALREP.BUSINESSACTIVITYNOTFOUND";
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

  async valrepEnterprise(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/valrep/enterprise`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.VALREP.ENTERPRISENOTFOUND";
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

  async valrepPaymentType(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/valrep/payment-type`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.VALREP.PAYMENTTYPENOTFOUND";
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

  async valrepCity(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/valrep/city`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.VALREP.CITYNOTFOUND";
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

  async valrepClient(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/valrep/client`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.VALREP.CLIENTNOTFOUND";
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

  async valrepGeneralStatus(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/valrep/module/general-status`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.VALREP.GENERALSTATUSNOTFOUND";
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

  async searchClient(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/v2/client/production/search`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.CLIENTS.CLIENTNOTFOUND";
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

  async detailClient(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/v2/client/production/detail`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.CLIENTS.CLIENTNOTFOUND";
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

  async createClient(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/v2/client/production/create`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.CLIENTS.CLIENTNOTFOUND";
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

  async updateClient(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/v2/client/production/update`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.CLIENTS.CLIENTNOTFOUND";
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

  async searchCollectionOrderFleetContract(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/v2/collection-order-fleet-contract/production/search`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.COOLECTIONORDERSFLEETCONTRACTS.COLLECTIONORDERFLEETCONTRACTNOTFOUND";
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

  async detailCollectionOrderFleetContract(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/v2/collection-order-fleet-contract/production/detail`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.COLLECTIONORDERSFLEETCONTRACTS.COLLECTIONORDERFLEETCONTRACTNOTFOUND";
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

  async updateCollectionOrderFleetContract(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/v2/collection-order-fleet-contract/production/update`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.COLLECTIONORDERSFLEETCONTRACTS.COLLECTIONORDERFLEETCONTRACTNOTFOUND";
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

  async searchAccesory(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/accesory/search`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.ACCESORIES.ACCESORYNOTFOUND";
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

  async detailAccesory(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/accesory/detail`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.ACCESORIES.ACCESORYNOTFOUND";
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

  async createAccesory(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/accesory/create`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.ACCESORIES.ACCESORYNOTFOUND";
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

  async updateAccesory(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/accesory/update`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.ACCESORIES.ACCESORYNOTFOUND";
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

  // metodo que permite mostrar el detalle de los associados.
  async detailAssociateType(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/associate-type/detail`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.ASSOCIATETYPE.ASSOCIATETYPENOTFOUND";
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

  // metodo que permite actualizar un tipo de associado.
  async updateAssociateType(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/associate-type/update`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.ASSOCIATETYPE.ASSOCIATETYPENOTFOUND";
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

  // metodo que permite crear un tipo de associado.
  async createAssociateType(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    // validamos.
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/associate-type/create`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.ASSOCIATETYPE.ASSOCIATETYPENOTFOUND";
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

  // metodo que permite buscar associado
  async searcAssociateType(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/associate-type/search`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.ASSOCIATETYPE.ASSOCIATETYPENOTFOUND";
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

  // metodo que permite mostrar el detalle de los bancos
  async detailBankType(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/bank/detail`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.BANKTYPE.BANKTYPENOTFOUND";
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

  // metodo que permite actualizar un tipo de banco.
  async updateBankType(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/bank/update`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.BANKTYPE.BANKTYPENOTFOUND";
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

  // metodo que permite crear banco.
  async createBankType(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    // validamos.
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/bank/create`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.BANKTYPE.BANKTYPENOTFOUND";
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

  // metodo que permite buscar banco.
  async searchBankType(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/bank/search`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.BANKACCOUNTTYPES.BANKTYPENOTFOUND";
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

  // metodo que permite mostrar el detalle de las cuentas x banco
  async detailBankAccountType(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/bank-account-type/detail`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.BANKACCOUNTTYPES.BANKTYPENOTFOUND";
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

  // metodo que permite actualizar un tipo de banco por tipo de cuenta.
  async updateBankAccountType(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/bank-account-type/update`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.BANKACCOUNTTYPES.BANKTYPENOTFOUND";
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

  // metodo que permite crear banco. por tipo de cuenta
  async createBankAccountType(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    // validamos.
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/bank-account-type/create`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.BANKACCOUNTTYPES.BANKTYPENOTFOUND";
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

  // metodo que permite buscar banco x tipo de cuenta
  async searchBankAccountType(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/bank-account-type/search`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.BANKACCOUNTTYPES.BANKTYPENOTFOUND";
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

  // metodo que permite mostrar el detalle brand
  async detailBrand(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/brand/detail`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.BRANDS.BRANDSNOTFOUND";
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

  // metodo que permite actualizar brand
  async updateBrand(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/brand/update`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.BRANDS.BRANDSNOTFOUND";
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

  // metodo que permite crear brand
  async createBrand(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    // validamos.
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/brand/create`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.BRANDS.BRANDSNOTFOUND";
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

  // metodo que permite buscar brand
  async searchBrand(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/valrep/brand`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.BRANDS.BRANDSNOTFOUND";
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

  // metodo que permite mostrar el detalle business activity
  async detailBusinessActivity(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/business-activity/detail`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.BUSINESSACTIVITIES.BUSINESSACTIVITIESNOTFOUND";
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

  // metodo que permite actualizar business activity
  async updateBusinessActivity(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/business-activity/update`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.BUSINESSACTIVITIES.BUSINESSACTIVITIESNOTFOUND";
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

  // metodo que permite crear business activity
  async createBusinessActivity(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    // validamos.
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/business-activity/create`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.BUSINESSACTIVITIES.BUSINESSACTIVITIESNOTFOUND";
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

  // metodo que permite buscar business activity
  async searchBusinessActivity(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/business-activity/search`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.BUSINESSACTIVITIES.BUSINESSACTIVITIESNOTFOUND";
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

  // metodo que permite mostrar el detalle de la causa de la cancelacion
  async detailCancellationCause(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/cancellation-cause/detail`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.CANCELLATIONCAUSE.CANCELLATIONCAUSENOTFOUND";
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

  // metodo que permite actualizar la causa de la cancelacion
  async updateCancellationCause(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/cancellation-cause/update`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.CANCELLATIONCAUSE.CANCELLATIONCAUSENOTFOUND";
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

  // metodo que permite crear la causa de la cancelacion
  async createCancellationCause(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    // validamos.
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/cancellation-cause/create`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.CANCELLATIONCAUSE.CANCELLATIONCAUSENOTFOUND";
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

  // metodo que permite buscar la causa de la cancelacion
  async searchCancellationCause(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/cancellation-cause/search`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.CANCELLATIONCAUSE.CANCELLATIONCAUSENOTFOUND";
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

  async detailCivilStatus(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/civil-status/detail`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.CIVILSTATUSES.CIVILSTATUSNOTFOUND";
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

  async updateCivilStatus(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/civil-status/update`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.CIVILSTATUSES.CIVILSTATUSNOTFOUND";
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

  async createCivilStatus(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    // validamos.
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/civil-status/create`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.CIVILSTATUSES.CIVILSTATUSNOTFOUND";
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

  async searchCivilStatus(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/civil-status/search`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.CIVILSTATUSES.CIVILSTATUSNOTFOUND";
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

  async mostrarListaEstados(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/club/state`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.VALREP.STATENOTFOUND";
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

  async createUserClub(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    // validamos.
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/club/create-user-club`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.COLORS.COLORNOTFOUND";
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

  async createContractIndividual(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    // validamos.
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/fleet-contract-management/create/individualContract`, params).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.COLORS.COLORNOTFOUND";
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



  async detailCity(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/city/detail`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.CITIES.CITYNOTFOUND";
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

  async updateCity(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/city/update`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.CITIES.CITYNOTFOUND";
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

  async createCity(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    // validamos.
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/city/create`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.CITIES.CITYNOTFOUND";
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

  async muestraListaEstado(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/valrep/state`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.VALREP.STATENOTFOUND";
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

  async searchCity(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/club/city`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.CITIES.CITYNOTFOUND";
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

  async searchSex(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/club/sex`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.CITIES.CITYNOTFOUND";
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

  async detailClaimCause(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/claim-cause/detail`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.CLAIMCAUSES.CLAIMCAUSENOTFOUND";
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

  async updateClaimCause(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/claim-cause/update`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.CLAIMCAUSES.CLAIMCAUSENOTFOUND";
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

  async createClaimCause(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    // validamos.
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/claim-cause/create`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.CLAIMCAUSES.CLAIMCAUSENOTFOUND";
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

  async searchClaimCause(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/claim-cause/search`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.CLAIMCAUSES.CLAIMCAUSENOTFOUND";
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

  async detailColor(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/color/detail`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.COLORS.COLORNOTFOUND";
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

  async updateColor(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/color/update`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.COLORS.COLORNOTFOUND";
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

  async createColor(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    // validamos.
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/color/create`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.COLORS.COLORNOTFOUND";
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
  async searchColor(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/color/search`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.COLORS.COLORNOTFOUND";
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

  async searchCoins(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/coin/search`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.COINS.COINNOTFOUND";
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

  async detailCompany(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/company/detail`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.COMPANIES.COMPANYNOTFOUND";
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

  async updateCompany(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/company/update`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.COMPANIES.COMPANYNOTFOUND";
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

  async createCompany(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    // validamos.
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/company/create`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.COMPANIES.COMPANYNOTFOUND";
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

  async searchCompany(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/company/search`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.COMPANIES.COMPANYNOTFOUND";
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

  async detailCountry(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/country/detail`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.COUNTRIES.COUNTRYNOTFOUND";
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

  async updateCountry(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/country/update`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.COUNTRIES.COUNTRYNOTFOUND";
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

  async createCountry(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    // validamos.
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/country/create`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.COUNTRIES.COUNTRYNOTFOUND";
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
  async searchCountry(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/country/search`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.COUNTRIES.COUNTRYNOTFOUND";
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

  async detailCoverage(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/coverage/detail`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.COVERAGES.COVERAGENOTFOUND";
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

  async updateCoverage(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/coverage/update`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.COVERAGES.COVERAGENOTFOUND";
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

  async createCoverage(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    // validamos.
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/coverage/create`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.COVERAGES.COVERAGENOTFOUND";
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

  async searchCoverage(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/coverage/search`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.COVERAGES.COVERAGENOTFOUND";
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

  async detailCoverageConcept(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/coverage-concept/detail`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.COVERAGECONCEPTS.COVERAGECONCEPTNOTFOUND";
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

  async updateCoverageConcept(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/coverage-concept/update`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.COVERAGECONCEPTS.COVERAGECONCEPTNOTFOUND";
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

  async createCoverageConcept(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    // validamos.
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/coverage-concept/create`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.COVERAGECONCEPTS.COVERAGECONCEPTNOTFOUND";
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

  async searchCoverageConcept(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/coverage-concept/search`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.COVERAGECONCEPTS.COVERAGECONCEPTNOTFOUND";
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

  async detailDamageLevel(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/damage-level/detail`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.DAMAGELEVELS.DAMAGELEVELNOTFOUND";
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

  async updateDamageLevel(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/damage-level/update`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.DAMAGELEVELS.DAMAGELEVELNOTFOUND";
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

  async createDamageLevel(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    // validamos.
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/damage-level/create`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.DAMAGELEVELS.DAMAGELEVELNOTFOUND";
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

  async searchDamageLevel(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/damage-level/search`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.DAMAGELEVELS.DAMAGELEVELNOTFOUND";
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

  async detailDepreciation(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/depreciation/detail`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.DEPRECIATIONS.DEPRECIATIONNOTFOUND";
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

  async updateDepreciation(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/depreciation/update`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.DEPRECIATIONS.DEPRECIATIONNOTFOUND";
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

  async createDepreciation(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    // validamos.
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/depreciation/create`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.DEPRECIATIONS.DEPRECIATIONNOTFOUND";
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

  async searchDepreciation(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/depreciation/search`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.DEPRECIATIONS.DEPRECIATIONNOTFOUND";
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

  async detailDocument(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/document/detail`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.DOCUMENTS.DOCUMENTNOTFOUND";
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

  async updateDocument(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/document/update`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.DOCUMENTS.DOCUMENTNOTFOUND";
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

  async createDocument(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    // validamos.
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/document/create`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.DOCUMENTS.DOCUMENTNOTFOUND";
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

  async searchDocument(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/document/search`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.DOCUMENTS.DOCUMENTNOTFOUND";
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

  async detailDocumentType(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/document-type/detail`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.DOCUMENTTYPES.DOCUMENTTYPENOTFOUND";
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

  async updateDocumentType(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/document-type/update`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.DOCUMENTTYPES.DOCUMENTTYPENOTFOUND";
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

  async createDocumentType(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    // validamos.
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/document-type/create`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.DOCUMENTTYPES.DOCUMENTTYPENOTFOUND";
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

  async searchDocumentType(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/document-type/search`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.DOCUMENTTYPES.DOCUMENTTYPENOTFOUND";
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

  async detailGeneralStatus(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/general-status/detail`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.GENERALSTATUSES.GENERALSTATUSNOTFOUND";
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

  async updateGeneralStatus(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/general-status/update`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.GENERALSTATUSES.GENERALSTATUSNOTFOUND";
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

  async createGeneralStatus(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    // validamos.
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/general-status/create`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.GENERALSTATUSES.GENERALSTATUSNOTFOUND";
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

  async searchGeneralStatus(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/general-status/search`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.GENERALSTATUSES.GENERALSTATUSNOTFOUND";
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

  async detailImage(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/v2/image/production/detail`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.IMAGES.IMAGENOTFOUND";
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

  async updateImage(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/v2/image/production/update`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.IMAGES.IMAGENOTFOUND";
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

  async createImage(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    // validamos.
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/v2/image/production/create`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.IMAGES.IMAGENOTFOUND";
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
  async searchImage(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/v2/image/production/search`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.IMAGES.IMAGENOTFOUND";
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

  async detailInspectionType(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/inspection-type/detail`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.INSPECTIONTYPES.INSPECTIONTYPENOTFOUND";
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

  async updateInspectionType(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/inspection-type/update`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.INSPECTIONTYPES.INSPECTIONTYPENOTFOUND";
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

  async createInspectionType(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    // validamos.
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/inspection-type/create`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.INSPECTIONTYPES.INSPECTIONTYPENOTFOUND";
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

  async searchInspectionType(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/inspection-type/search`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.INSPECTIONTYPES.INSPECTIONTYPENOTFOUND";
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

  async detailMaterialDamage(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/material-damage/detail`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.MATERIALDAMAGES.MATERIALDAMAGENOTFOUND";
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

  async updateMaterialDamageType(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/material-damage/update`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.MATERIALDAMAGES.MATERIALDAMAGENOTFOUND";
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

  async createMaterialDamageType(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    // validamos.
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/material-damage/create`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.MATERIALDAMAGES.MATERIALDAMAGENOTFOUND";
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

  async searchMaterialDamage(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/material-damage/search`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.MATERIALDAMAGES.MATERIALDAMAGENOTFOUND";
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

  async mostrarModel(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/valrep/brand`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.VALREP.BRANDNOTFOUND";
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

  async detailModel(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/model/detail`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.MODELS.MODELNOTFOUND";
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

  async updateModel(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/model/update`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.MODELS.MODELNOTFOUND";
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

  async createModel(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    // validamos.
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/model/create`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.MODELS.MODELNOTFOUND";
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

  async modelmostrarIndex(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/valrep/brand`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.VALREP.BRANDNOTFOUND";
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

  async searchModel(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/valrep/model`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.MODELS.MODELNOTFOUND";
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

  async detailNotificationType(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/notification-type/detail`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.NOTIFICATIONTYPES.NOTIFICATIONTYPENOTFOUND";
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

  async updateNotificationType(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/notification-type/update`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.NOTIFICATIONTYPES.NOTIFICATIONTYPENOTFOUND";
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

  async createNotificationType(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    // validamos.
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/notification-type/create`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.NOTIFICATIONTYPES.NOTIFICATIONTYPENOTFOUND";
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

  async searchNotificationType(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/notification-type/search`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.NOTIFICATIONTYPES.NOTIFICATIONTYPENOTFOUND";
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

  async detailPaymentMethodology(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/v2/payment-methodology/production/detail`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.PAYMENTMETHODOLOGIES.PAYMENTMETHODOLOGYNOTFOUND";
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

  async updatePaymentType(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/v2/payment-methodology/production/update`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.PAYMENTMETHODOLOGIES.PAYMENTMETHODOLOGYNOTFOUND";
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

  async createPaymentType(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    // validamos.
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/payment-type/create`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.PAYMENTMETHODOLOGIES.PAYMENTMETHODOLOGYNOTFOUND";
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

  async searchPaymentType(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/payment-type/search`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.PAYMENTTYPES.PAYMENTTYPENOTFOUND";
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

  async detailPaymentType(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/payment-type/detail`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.PAYMENTTYPES.PAYMENTTYPENOTFOUND";
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

  async updatePaymentMethodology(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/v2/payment-methodology/production/update`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.PAYMENTTYPES.PAYMENTTYPENOTFOUND";
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

  async createPaymentMethodology(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    // validamos.
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/v2/payment-methodology/production/create`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.PAYMENTTYPES.PAYMENTTYPENOTFOUND";
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

  async searchPaymentMethodology(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/v2/payment-methodology/production/search`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.PAYMENTTYPES.PAYMENTTYPENOTFOUND";
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

  async detailPenalty(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/penalty/detail`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.PENALTIES.PENALTYNOTFOUND";
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

  async updatePenalty(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/penalty/update`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.PENALTIES.PENALTYNOTFOUND";
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

  async createPenalty(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    // validamos.
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/penalty/create`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.PENALTIES.PENALTYNOTFOUND";
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

  async searchPenalty(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/penalty/search`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.PENALTIES.PENALTYNOTFOUND";
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

  async detailPlanType(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/plan-type/detail`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.PLANTYPES.PLANTYPENOTFOUND";
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

  async updatePlanType(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/plan-type/update`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.PLANTYPES.PLANTYPENOTFOUND";
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

  async createPlanType(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    // validamos.
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/plan-type/create`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.PLANTYPES.PLANTYPENOTFOUND";
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

  async searchPlanType(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/plan-type/search`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.PLANTYPES.PLANTYPENOTFOUND";
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

  async detailProcess(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/process/detail`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.PROCESSES.PROCESSNOTFOUND";
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

  async updateProcess(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/process/update`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.PROCESSES.PROCESSNOTFOUND";
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

  async createProcess(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    // validamos.
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/process/create`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.PROCESSES.PROCESSNOTFOUND";
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

  async searchProcess(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/process/search`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.PROCESSES.PROCESSNOTFOUND";
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

  async detailRelatiponShip(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/relationship/detail`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.RELATIONSHIPS.RELATIONSHIPNOTFOUND";
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

  async updateRelationShip(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/relationship/update`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.RELATIONSHIPS.RELATIONSHIPNOTFOUND";
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

  async createRelationShip(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    // validamos.
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/relationship/create`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.RELATIONSHIPS.RELATIONSHIPNOTFOUND";
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

  async searchRelationShip(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/relationship/search`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.RELATIONSHIPS.RELATIONSHIPNOTFOUND";
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

  async MostrarReplamentType(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/valrep/replacement-type`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.VALREP.REPLACEMENTTYPENOTFOUND";
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

  async detailReplacement(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/replacement/detail`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.SPAREPARTS.REPLACEMENTNOTFOUND";
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

  async updateReplament(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/replacement/update`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.SPAREPARTS.REPLACEMENTNOTFOUND";
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

  async createReplacemnt(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    // validamos.
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/replacement/create`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.SPAREPARTS.REPLACEMENTNOTFOUND";
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

  async MostrarReplacementIndex(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/valrep/replacement-type`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.VALREP.REPLACEMENTTYPENOTFOUND";
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

  async searchReplacement(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/replacement/search`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.SPAREPARTS.REPLACEMENTNOTFOUND";
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
  async detailReplacementType(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/replacement-type/detail`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.REPLACEMENTTYPES.REPLACEMENTTYPENOTFOUND";
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

  async updateReplacementType(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/replacement-type/update`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.REPLACEMENTTYPES.REPLACEMENTTYPENOTFOUND";
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

  async createReplacementType(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    // validamos.
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/replacement-type/create`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.REPLACEMENTTYPES.REPLACEMENTTYPENOTFOUND";
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

  async searchReplacemntType(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/replacement-type/search`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.REPLACEMENTTYPES.REPLACEMENTTYPENOTFOUND";
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

  async mostrarServiceType(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/valrep/service-type`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.VALREP.SERVICETYPENOTFOUND";
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

  async detailService(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/service/detail`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.SERVICES.SERVICENOTFOUND";
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

  async updateService(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/service/update`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.SERVICES.SERVICENOTFOUND";
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

  async createService(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    // validamos.
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/service/create`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.SERVICES.SERVICENOTFOUND";
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

  async searchService(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/service/search`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.SERVICES.SERVICENOTFOUND";
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

  async detailDepletionType(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/service-depletion-type/detail`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.SERVICEDEPLETIONTYPES.SERVICEDEPLETIONTYPENOTFOUND";
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

  async updateDepletionType(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/service-depletion-type/update`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.SERVICEDEPLETIONTYPES.SERVICEDEPLETIONTYPENOTFOUND";
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

  async createDepletionType(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    // validamos.
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/service-depletion-type/create`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.SERVICEDEPLETIONTYPES.SERVICEDEPLETIONTYPENOTFOUND";
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

  async searchDepletionType(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/service-depletion-type/search`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.SERVICEDEPLETIONTYPES.SERVICEDEPLETIONTYPENOTFOUND";
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

  async detailServiceType(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/service-type/detail`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.SERVICEDEPLETIONTYPES.SERVICEDEPLETIONTYPENOTFOUND";
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

  async updateServiceType(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/service-type/update`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.SERVICETYPES.SERVICETYPENOTFOUND";
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
  async createServiceType(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    // validamos.
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/service-type/create`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.SERVICETYPES.SERVICETYPENOTFOUND";
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

  async searchServiceType(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/service-type/search`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.SERVICETYPES.SERVICETYPENOTFOUND";
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

  async detailState(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/state/detail`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.STATES.STATENOTFOUND";
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

  async updateState(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/state/update`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.STATES.STATENOTFOUND";
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

  async createState(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    // validamos.
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/state/create`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.STATES.STATENOTFOUND";
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

  async searchState(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/state/search`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.STATES.STATENOTFOUND";
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

  async detailTax(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/tax/detail`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.TAXES.TAXNOTFOUND";
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

  async updateTax(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/tax/update`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.TAXES.TAXNOTFOUND";
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

  async createTax(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    // validamos.
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/tax/create`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.TAXES.TAXNOTFOUND";
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

  async searchTax(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/tax/search`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.TAXES.TAXNOTFOUND";
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

  async detailTracingMotive(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/tracing-motive/detail`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.TRACINGMOTIVES.TRACINGMOTIVENOTFOUND";
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

  async updateTracingMotive(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/tracing-motive/update`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.TRACINGMOTIVES.TRACINGMOTIVENOTFOUND";
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

  async createTracingMotive(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    // validamos.
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/tracing-motive/create`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.TRACINGMOTIVES.TRACINGMOTIVENOTFOUND";
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

  async searchTracingMotive(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/tracing-motive/search`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.TRACINGMOTIVES.TRACINGMOTIVENOTFOUND";
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

  async detailTracingType(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/tracing-type/detail`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.TRACINGTYPES.TRACINGTYPENOTFOUND";
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

  async updateTracingType(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/tracing-type/update`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.TRACINGTYPES.TRACINGTYPENOTFOUND";
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

  async createTracingType(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    // validamos.
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/tracing-type/create`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.TRACINGTYPES.TRACINGTYPENOTFOUND";
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

  async searchTracingType(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/tracing-type/search`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.TRACINGTYPES.TRACINGTYPENOTFOUND";
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

  async detailTransmissionType(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/transmission-type/detail`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.TRANSMISSIONTYPES.BANKACCOUNTTYPENOTFOUND";
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

  async updateTransmissionType(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/transmission-type/update`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.TRANSMISSIONTYPES.BANKACCOUNTTYPENOTFOUND";
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

  async createTransmissionType(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    // validamos.
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/transmission-type/create`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.TRANSMISSIONTYPES.BANKACCOUNTTYPENOTFOUND";
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

  async searchTransmissionType(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/transmission-type/search`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.TRANSMISSIONTYPES.BANKACCOUNTTYPENOTFOUND";
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

  // METODO ENCARGADO DE LOS DETALLES DE LOS PROVEEDORES.
  async detailProvider(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/v2/provider/production/detail`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.PROVIDERS.PROVIDERNOTFOUND";
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

  async updateProvider(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/v2/provider/production/update`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.PROVIDERS.PROVIDERNOTFOUND";
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

  async createProvider(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    // validamos.
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/v2/provider/production/create`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.PROVIDERS.PROVIDERNOTFOUND";
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

  async searchProvider(params: any): Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    try {
      let response = await this.http.post(`${environment.apiUrl}/api/v2/provider/production/search`, params, options).toPromise();
      return response;
    }
    catch (err) {
      let message;
      switch (err.error.data.code) {
        case 400:
          message = "HTTP.ERROR.PARAMSERROR";
          break;
        case 404:
          message = "HTTP.ERROR.PROVIDERS.PROVIDERNOTFOUND";
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
