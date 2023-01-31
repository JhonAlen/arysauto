import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-service-order-index',
  templateUrl: './service-order-index.component.html',
  styleUrls: ['./service-order-index.component.css']
})
export class ServiceOrderIndexComponent implements OnInit {

  currentUser;
  search_form : UntypedFormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  serviceOrderList: any[] = [];
  serviceList: any[] = [];
  clientList: any[] = [];
  ownerList: any[] = [];

  constructor(private formBuilder: UntypedFormBuilder, 
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private router: Router,
              private translate: TranslateService) { }

  ngOnInit(): void {
    this.search_form = this.formBuilder.group({
      corden: [''],
      ctiposervicio: [''],
      xtiposervicio: [''],
      cnotificacion: [''],
      xservicio: ['']
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 95
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
        corden: this.currentUser.data.corden
      };
/*      this.http.post(`${environment.apiUrl}/api/valrep/service-order`, params, options).subscribe((response : any) => {
        if(response.data.status){
          for(let i = 0; i < response.data.list.length; i++){
            this.serviceOrderList.push({ id: response.data.list[i].orden });
          }
          this.serviceOrderList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.SERVICEORDERNOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });*/
      this.http.post(`${environment.apiUrl}/api/valrep/service-order`, params, options).subscribe((response : any) => {
        if(response.data.status){
          for(let i = 0; i < response.data.list.length; i++){
            this.serviceOrderList.push({ id: response.data.list[i].orden, value: `Orden ${response.data.list[i].orden} - ${response.data.list[i].fcreacion.substring(0,10)}` });
          }
          //this.serviceOrderList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.SERVICEORDERNOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
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
        corden: form.corden ? form.corden : undefined
      }
      console.log(params);
      this.http.post(`${environment.apiUrl}/api/service-order/search`, params, options).subscribe((response : any) => {
        if(response.data.status){
          this.serviceList = [];
          for(let i = 0; i < response.data.list.length; i++){
            this.serviceList.push({ 
              corden: response.data.list[i].corden,
              ctiposervicio: response.data.list[i].ctiposervicio,
              xtiposervicio: response.data.list[i].xtiposervicio,
              xservicio: response.data.list[i].xservicio,
              cnotificacion: response.data.list[i].cnotificacion,
              xnombre: response.data.list[i].xnombre,
              xapellido: response.data.list[i].xapellido,
              xcliente: response.data.list[i].xcliente,
              fcreacion: response.data.list[i].fcreacion.substring(0,10)
            });
            console.log(this.serviceList);
          }
        }
        console.log(this.serviceList);
        this.loading = false;
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.SERVICEORDER.SERVICEORDERNOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
        this.loading = false;
      });
    }

    goToDetail(){
      this.router.navigate([`events/service-order-detail`]);
    }
  
    rowClicked(event: any){
      this.router.navigate([`events/service-order-detail/${event.data.corden}`]);
    }
}
