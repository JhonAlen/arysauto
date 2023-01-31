import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-collection-index',
  templateUrl: './collection-index.component.html',
  styleUrls: ['./collection-index.component.css']
})
export class CollectionIndexComponent implements OnInit {

  currentUser;
  search_form: UntypedFormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  collectionList: any[] = [];
  plateList: any[] = [];

  constructor(private formBuilder: UntypedFormBuilder, 
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private router: Router,
              private translate: TranslateService) { }

  ngOnInit(): void {
    this.search_form = this.formBuilder.group({
      crecibo: [''],
      clote: [''],
      fdesde_pol: [''],
      fhasta_pol: [''],
      xnombrepropietario: [''],
      cestatusgeneral: [''],
      xestatusgeneral: [''],
      ccompania: [''],
      mprima_anual: [''],
      xplaca: ['']
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 103
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
      xplaca: form.xplaca,
      ccorredor: this.currentUser.data.ccorredor
    }
    this.http.post(`${environment.apiUrl}/api/administration-collection/search`, params, options).subscribe((response : any) => {
      if(response.data.list){
        this.collectionList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.collectionList.push({ 
            crecibo: response.data.list[i].crecibo,
            clote: response.data.list[i].clote,
            fdesde_pol: new Date(response.data.list[i].fdesde_pol).toISOString().substring(0, 10),
            fhasta_pol: new Date(response.data.list[i].fhasta_pol).toISOString().substring(0, 10),
            xnombrepropietario: response.data.list[i].xnombrepropietario,
            cestatusgeneral: response.data.list[i].cestatusgeneral,
            xestatusgeneral: response.data.list[i].xestatusgeneral,
            mprima_anual: response.data.list[i].mprima_anual,
            xplaca: response.data.list[i].xplaca,
          });
        }
      }
      this.loading = false;
    },(err) => {
      let code = err.error.data.code;
      console.log(err.error.data.code)
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
    this.router.navigate([`administration/collection-detail`]);
  }

  rowClicked(event: any){
    this.router.navigate([`administration/collection-detail/${event.data.crecibo}`]);
  }

}
