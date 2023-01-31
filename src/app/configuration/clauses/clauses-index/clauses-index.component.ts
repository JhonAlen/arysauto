import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';


@Component({
  selector: 'app-clauses-index',
  templateUrl: './clauses-index.component.html',
  styleUrls: ['./clauses-index.component.css']
})
export class ClausesIndexComponent implements OnInit {

  currentUser;
  search_form: UntypedFormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  clausesList: any[] = [];

  constructor(private formBuilder: UntypedFormBuilder, 
    private authenticationService : AuthenticationService,
    private http: HttpClient,
    private router: Router,
    private translate: TranslateService) { }

  ngOnInit(): void {
    this.search_form = this.formBuilder.group({
      xanexo: [''],
      xclausulas: ['']
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 96
      }
      this.http.post(`${environment.apiUrl}/api/security/verify-module-permission`, params, options).subscribe((response : any) => {
        if(response.data.status){
          if(!response.data.bindice){
            this.router.navigate([`/permission-error`]);
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
    if(this.search_form.invalid){
      this.loading = false;
      return;
    }
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      xanexo: form.xanexo ? form.xanexo : undefined,
      xclausulas: form.xclausulas ? form.xclausulas : undefined
    }
    this.http.post(`${environment.apiUrl}/api/clauses/search`, params, options).subscribe((response : any) => {
      if(response.data.status){
        this.clausesList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.clausesList.push({ 
            canexo: response.data.list[i].canexo,
            xanexo: response.data.list[i].xanexo,
            //xclausulas: response.data.list[i].xclausulas
          });
          console.log(this.clausesList)
        }
      }
      this.loading = false;
    },(err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.TAXESCONFIGURATION.TAXNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
    });
  }

  goToDetail(){
    this.router.navigate([`configuration/clauses-detail`]);
  }

  rowClicked(event: any){
    this.router.navigate([`configuration/clauses-detail/${event.data.canexo}`]);
  }

}
