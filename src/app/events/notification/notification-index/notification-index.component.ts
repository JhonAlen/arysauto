import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-notification-index',
  templateUrl: './notification-index.component.html',
  styleUrls: ['./notification-index.component.css']
})
export class NotificationIndexComponent implements OnInit {

  currentUser;
  search_form : UntypedFormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  clientList: any[] = [];
  associateList: any[] = [];
  notificationList: any[] = [];

  constructor(private formBuilder: UntypedFormBuilder, 
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private router: Router,
              private translate: TranslateService) { }

  ngOnInit(): void {
    this.search_form = this.formBuilder.group({
      cnotificacion: [''],
      ccliente: [''],
      casociado: [''],
      fcreacion: [''],
      fevento: [''],
      xplaca: [''],
      xcausasiniestro: [''],
      xvehiculo: ['']
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 76
      }
      this.http.post(`${environment.apiUrl}/api/security/verify-module-permission`, params, options).subscribe((response : any) => {
        if(response.data.status){
          if(!response.data.bindice){
            this.router.navigate([`/permission-error`]);
          }else{
            this.initializeDropdownDataRequest();
          }
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 401){
          let condition = err.error.data.condition;
          if(condition == 'user-dont-have-permissions'){ this.router.navigate([`/permission-error`]); }
        }else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
    }
  }

  initializeDropdownDataRequest(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania,
    };
    this.http.post(`${environment.apiUrl}/api/valrep/client`, params, options).subscribe((response : any) => {
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.clientList.push({ id: response.data.list[i].ccliente, value: response.data.list[i].xcliente });
        }
        this.clientList.sort((a,b) => a.value > b.value ? 1 : -1);
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "No se encontró información con los parámetros ingresados."; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'primary';
      this.alert.show = true;
    });
  }

  associateDropdownDataRequest(){
    if(this.search_form.get('ccliente').value){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania,
        ccliente: this.search_form.get('ccliente').value
      }
      this.http.post(`${environment.apiUrl}/api/valrep/client/associate`, params, options).subscribe((response : any) => {
        if(response.data.status){
          this.associateList = [];
          for(let i = 0; i < response.data.list.length; i++){
            this.associateList.push({ id: response.data.list[i].casociado, value: response.data.list[i].xasociado });
          }
          this.associateList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "No se encontró información con los parámetros ingresados."; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'primary';
        this.alert.show = true;
      });
    }
  }

  onSubmit(form){
    this.submitted = true;
    this.loading = true;
    if (this.search_form.invalid) {
      this.loading = false;
      return;
    }
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania,
      cnotificacion: form.cnotificacion ? form.cnotificacion : undefined,
      ccliente: form.ccliente ? form.ccliente : undefined,
      casociado: form.casociado ? form.casociado : undefined,
      fcreacion: form.fcreacion ? new Date(form.fcreacion).toUTCString() : undefined,
      fevento: form.fevento ? new Date(form.fevento).toUTCString() : undefined,
      xplaca: form.xplaca ? form.xplaca : undefined
    }
    this.http.post(`${environment.apiUrl}/api/notification/search`, params, options).subscribe((response : any) => {
      if(response.data.status){
        this.notificationList = [];
        for(let i = 0; i < response.data.list.length; i++){
          let date;
          if(response.data.list[i].fcreacion){
            let dateFormat = new Date(response.data.list[i].fcreacion);
            date = `${dateFormat.getFullYear()}-${('0' + (dateFormat.getMonth() + 1)).slice(-2)}-${('0' + dateFormat.getDate()).slice(-2)}`
          }
          this.notificationList.push({ 
            cnotificacion: response.data.list[i].cnotificacion,
            fcreacion: date,
            fevento: new Date(response.data.list[i].fevento).toISOString().substring(0, 10),
            xcliente: response.data.list[i].xcliente,
            xasociado: response.data.list[i].xasociado,
            xplaca: response.data.list[i].xplaca,
            xvehiculo: response.data.list[i].xvehiculo,
            xcausasiniestro: response.data.list[i].xcausasiniestro
          });
        }
      }
      this.loading = false;
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "No se encontró información con los parámetros ingresados."; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'primary';
      this.alert.show = true;
      this.loading = false;
    });
  }

  goToDetail(){
    this.router.navigate([`events/notification-detail`]);
  }

  rowClicked(event: any){
    this.router.navigate([`events/notification-detail/${event.data.cnotificacion}`]);
  }

}
