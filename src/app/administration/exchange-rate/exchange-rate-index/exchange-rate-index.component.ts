import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';


@Component({
  selector: 'app-exchange-rate-index',
  templateUrl: './exchange-rate-index.component.html',
  styleUrls: ['./exchange-rate-index.component.css']
})
export class ExchangeRateIndexComponent implements OnInit {

  currentUser;
  search_form: UntypedFormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  rateList: any[] = [];
  plateList: any[] = [];

  constructor(private formBuilder: UntypedFormBuilder, 
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private router: Router,
              private translate: TranslateService) { }

  ngOnInit(): void {
    this.search_form = this.formBuilder.group({
      ctasa: [''],
      fingreso: ['']
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 114
      }
      this.http.post(`${environment.apiUrl}/api/security/verify-module-permission`, params, options).subscribe((response : any) => {
        if(response.data.status){
          if(!response.data.bindice){
            this.router.navigate([`/permission-error`]);
          }else{

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

  onSubmit(form){
    this.submitted = true;
    this.loading = true;

    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      ccompania: this.currentUser.data.ccompania,
      cpais: this.currentUser.data.cpais,
      fingreso: form.fingreso
    }
    this.http.post(`${environment.apiUrl}/api/administration/search-exchange-rate`, params, options).subscribe((response : any) => {
      if(response.data.list){
        this.rateList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.rateList.push({ 
            ctasa: response.data.list[i].ctasa,
            mtasa_cambio: response.data.list[i].mtasa_cambio,
            fingreso: new Date(response.data.list[i].fingreso).toISOString().substring(0, 10)
          });
        }
      }
      this.loading = false;
    },(err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "No se encontraron contratos pendientes"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'primary';
      this.alert.show = true;
      this.loading = false;
    });
  }

  goToDetail(){
    this.router.navigate([`administration/exchange-rate-detail`]);
  }

  rowClicked(event: any){
    this.router.navigate([`administration/exchange-rate-detail/${event.data.ctasa}`]);
  }

}
