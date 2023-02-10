import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-plan-index',
  templateUrl: './plan-index.component.html',
  styleUrls: ['./plan-index.component.css']
})
export class PlanIndexComponent implements OnInit {

  currentUser;
  search_form: UntypedFormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  planTypeList: any[] = [];
  planList: any[] = [];

  constructor(private formBuilder: UntypedFormBuilder, 
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private router: Router,
              private translate: TranslateService) { }

  ngOnInit(): void {
    this.search_form = this.formBuilder.group({
      ctipoplan: [''],
      xplan: ['']
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 81
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
    this.http.post(`${environment.apiUrl}/api/valrep/plan-type`, params, options).subscribe((response : any) => {
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.planTypeList.push({ id: response.data.list[i].ctipoplan, value: response.data.list[i].xtipoplan });
        }
        this.planTypeList.sort((a,b) => a.value > b.value ? 1 : -1);
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.PLANTYPENOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }

  onSubmit(form){
    this.submitted = true;
    this.loading = true;
    if(this.search_form.invalid){
      this.loading = false;
      return;
    }
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      permissionData: {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 81
      },
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania,
      ctipoplan: form.ctipoplan ? form.ctipoplan : undefined,
      xplan: form.xplan ? form.xplan : undefined
    }
    this.http.post(`${environment.apiUrl}/api/plan/search`, params, options).subscribe((response: any) => {
      if(response.data.status){
        this.planList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.planList.push({ 
            cplan: response.data.list[i].cplan,
            xplan: response.data.list[i].xplan,
            mcosto: response.data.list[i].mcosto,
            xactivo: response.data.list[i].bactivo ? this.translate.instant("DROPDOWN.YES") : this.translate.instant("DROPDOWN.NO")
          });
        }
      }
      this.loading = false;
    },(err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.PLANS.PLANNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
    });
  }

  goToDetail(){
    this.router.navigate([`products/plan-detail`]);
  }

  rowClicked(event: any){
    this.router.navigate([`products/plan-detail/${event.data.cplan}`]);
  }

}