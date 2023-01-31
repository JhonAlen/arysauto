import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-collections-index',
  templateUrl: './collections-index.component.html',
  styleUrls: ['./collections-index.component.css']
})
export class CollectionsIndexComponent implements OnInit {

  currentUser;
  search_form: UntypedFormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  collectionsList: any[] = [];

  constructor(private formBuilder: UntypedFormBuilder, 
    private authenticationService : AuthenticationService,
    private http: HttpClient,
    private router: Router,
    private translate: TranslateService) { }

  ngOnInit(): void {
    this.search_form = this.formBuilder.group({
      crecaudo: [''],
      ctiponotificacion: [''],
      xrecaudo: ['']
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 97
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
      crecaudo: form.crecaudo ? form.crecaudo : undefined,
      ctiponotificacion: form.ctiponotificacion ? form.ctiponotificacion : undefined,
      ccompania: this.currentUser.data.ccompania
    }
    this.http.post(`${environment.apiUrl}/api/collections/search`, params, options).subscribe((response : any) => {
      if(response.data.status){
        this.collectionsList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.collectionsList.push({ 
            crecaudo: response.data.list[i].crecaudo,
            xrecaudo: response.data.list[i].xrecaudo
            //xclausulas: response.data.list[i].xclausulas
          });
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
    this.router.navigate([`tables/collections-detail`]);
  }

  rowClicked(event: any){
    this.router.navigate([`tables/collections-detail/${event.data.crecaudo}`]);
  }

}
