import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-takers-detail',
  templateUrl: './takers-detail.component.html',
  styleUrls: ['./takers-detail.component.css']
})
export class TakersDetailComponent implements OnInit {

  private clausesGridApi;
  private objetivesGridApi;
  showSaveButton: boolean = false;
  showEditButton: boolean = false;
  editStatus: boolean = false;
  editBlock: boolean = false;
  canCreate: boolean = false;
  canDetail: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;
  code;
  sub;
  currentUser;
  detail_form: UntypedFormGroup;
  loading: boolean = false;
  loading_cancel: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  countryList: any[] = [];
  stateList: any[] = [];
  cityList:  any[] = [];
  generalStatusList:  any[] = [];
  keyword: 'value';

  constructor(private formBuilder: UntypedFormBuilder, 
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private router: Router,
              private translate: TranslateService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.detail_form = this.formBuilder.group({
      xtomador: [''],
      xprofesion: [''],
      xrif: [''],
      xdomicilio: [''],
      cestado: [''],
      cciudad: [''],
      xzona_postal: [''],
      xtelefono: [''],
      cestatusgeneral: [''],
      xcorreo: [''],
      cpais: ['']
    })
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 117
      };
      this.http.post(`${environment.apiUrl}/api/security/verify-module-permission`, params, options).subscribe((response : any) => {
        if(response.data.status){
          this.canCreate = response.data.bcrear;
          this.canDetail = response.data.bdetalle;
          this.canEdit = response.data.beditar;
          this.canDelete = response.data.beliminar;
          this.initializeDetailModule();
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 401){ 
          let condition = err.error.data.condition;
          if(condition == 'user-dont-have-permissions'){ this.router.navigate([`/permission-error`]); }
        }else if(code == 500){ message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
    }
  }

  initializeDetailModule(){
    this.sub = this.activatedRoute.paramMap.subscribe(params => {
      this.code = params.get('id');
      if(this.code){
        if(!this.canDetail){
          this.router.navigate([`/permission-error`]);
          return;
        }
        if(this.canEdit){ this.showEditButton = true; }

        this.getTakersData();

      }else{
        if(!this.canCreate){
          this.router.navigate([`/permission-error`]);
          return;
        }
        this.showSaveButton = true;
        this.editStatus = true;

        this.getCountryData();
      }
    });

    this.getGeneralStatus();
  }

  getTakersData(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      ctomador: this.code
    };
    this.http.post(`${environment.apiUrl}/api/takers/detail`, params, options).subscribe((response: any) => {
      if(response.data.status){
        this.detail_form.get('xtomador').setValue(response.data.xtomador);
        this.detail_form.get('xtomador').disable();
        this.detail_form.get('xprofesion').setValue(response.data.xprofesion);
        this.detail_form.get('xprofesion').disable();
        this.detail_form.get('xrif').setValue(response.data.xrif);
        this.detail_form.get('xrif').disable();
        this.detail_form.get('xdomicilio').setValue(response.data.xdomicilio);
        this.detail_form.get('xdomicilio').disable();
        this.detail_form.get('xzona_postal').setValue(response.data.xzona_postal);
        this.detail_form.get('xzona_postal').disable();
        this.detail_form.get('xtelefono').setValue(response.data.xtelefono);
        this.detail_form.get('xtelefono').disable();
        this.detail_form.get('xcorreo').setValue(response.data.xcorreo);
        this.detail_form.get('xcorreo').disable();
        this.detail_form.get('cpais').setValue(response.data.cpais);
        this.detail_form.get('cpais').disable();
        this.detail_form.get('cestado').setValue(response.data.cestado);
        this.detail_form.get('cestado').disable();
        this.detail_form.get('cciudad').setValue(response.data.cciudad);
        this.detail_form.get('cciudad').disable();
        this.detail_form.get('cestatusgeneral').setValue(response.data.cestatusgeneral);
        this.detail_form.get('cestatusgeneral').disable();
        this.countryList.push({ id: response.data.cpais, value: response.data.xpais});
        this.stateList.push({ id: response.data.cestado, value: response.data.xestado});
        this.cityList.push({ id: response.data.cciudad, value: response.data.xciudad});
        this.generalStatusList.push({ id: response.data.cestatusgeneral, value: response.data.xestatusgeneral});
      }
      this.loading_cancel = false;
    }, 
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.TAXESCONFIGURATION.TAXNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }

  getCountryData(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params =  {
      cusuario: this.currentUser.data.cusuario
     };
     this.keyword;
    this.http.post(`${environment.apiUrl}/api/valrep/country`, params, options).subscribe((response: any) => {
      if(response.data.list){
        this.countryList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.countryList.push({ 
            id: response.data.list[i].cpais,
            value: response.data.list[i].xpais,
          });
        }
        this.countryList.sort((a, b) => a.value > b.value ? 1 : -1)
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.NOTIFICATIONS.NOTIFICATIONNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }

  changeStateData(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params =  {
      cpais: this.detail_form.get('cpais').value 
    };
    this.keyword = 'value';
    this.http.post(`${environment.apiUrl}/api/valrep/state`, params, options).subscribe((response: any) => {
      if(response.data.list){
        this.stateList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.stateList.push({ 
            id: response.data.list[i].cestado,
            value: response.data.list[i].xestado,
          });
        }
        console.log(this.stateList)
        this.stateList.sort((a, b) => a.value > b.value ? 1 : -1)
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.NOTIFICATIONS.NOTIFICATIONNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }

  changeCityData(event){
    this.detail_form.get('cestado').setValue(event.id)
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params =  {
      cpais: this.detail_form.get('cpais').value,  
      cestado: this.detail_form.get('cestado').value
    };
    this.keyword;
    this.http.post(`${environment.apiUrl}/api/valrep/city`, params, options).subscribe((response: any) => {
      if(response.data.list){
        this.cityList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.cityList.push({ 
            id: response.data.list[i].cciudad,
            value: response.data.list[i].xciudad,
          });
          this.cityList.sort((a, b) => a.value > b.value ? 1 : -1)
        }
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.NOTIFICATIONS.NOTIFICATIONNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }

  selectCity(event){
    this.detail_form.get('cciudad').setValue(event.id)
  }

  getGeneralStatus(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params =  {
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania
    };
    this.http.post(`${environment.apiUrl}/api/valrep/general-status`, params, options).subscribe((response: any) => {
      if(response.data.list){
        this.generalStatusList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.generalStatusList.push({ 
            id: response.data.list[i].cestatusgeneral,
            value: response.data.list[i].xestatusgeneral,
          });
          this.generalStatusList.sort((a, b) => a.value > b.value ? 1 : -1)
        }
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.NOTIFICATIONS.NOTIFICATIONNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }

  editTakers(){
    this.detail_form.get('xtomador').enable();
    this.detail_form.get('xprofesion').enable();
    this.detail_form.get('xrif').enable();
    this.detail_form.get('xdomicilio').enable();
    this.detail_form.get('xzona_postal').enable();
    this.detail_form.get('xtelefono').enable();
    this.detail_form.get('xcorreo').enable();
    this.detail_form.get('cpais').enable();
    this.detail_form.get('cestado').enable();
    this.detail_form.get('cciudad').enable();
    this.detail_form.get('cestatusgeneral').enable();

    this.showEditButton = false;
    this.showSaveButton = true;
    this.editStatus = true;
  }

  onSubmit(form){
    this.submitted = true;
    this.loading = true;
    if(this.detail_form.invalid){
      this.loading = false;
      return;
    }

    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params;
    let url;

    if(this.code){
      params = {
        ctomador: this.code,
        xtomador: form.xtomador,
        xprofesion: form.xprofesion,
        xrif: form.xrif,
        xdomicilio: form.xdomicilio,
        cestado: form.cestado,
        cciudad: form.cciudad,
        cpais: form.cpais,
        xzona_postal: form.xzona_postal,
        xtelefono: form.xtelefono,
        cestatusgeneral: form.cestatusgeneral,
        xcorreo: form.xcorreo
      };
      url = `${environment.apiUrl}/api/takers/update`;
    }else{
      params = {
        xtomador: form.xtomador,
        xprofesion: form.xprofesion,
        xrif: form.xrif,
        xdomicilio: form.xdomicilio,
        cpais: form.cpais,
        cestado: form.cestado,
        cciudad: form.cciudad,
        xzona_postal: form.xzona_postal,
        xtelefono: form.xtelefono,
        cestatusgeneral: form.cestatusgeneral,
        xcorreo: form.xcorreo,
        cusuario: this.currentUser.data.cusuario
      };
      url = `${environment.apiUrl}/api/takers/create`;
    }


    this.http.post(url, params, options).subscribe((response: any) => {
      if(response.data.create){
        window.alert(`Se ha registrado exitosamente el tomador ${form.xtomador}`)
        this.router.navigate([`/configuration/takers-index`]);
      }else if(response.data.update){
        window.alert(`Se ha editado exitosamente el tomador ${form.xtomador}`)
        this.router.navigate([`/configuration/takers-index`]);
      }
      else{
        let condition = response.data.condition;
        if(condition == "service-order-already-exist"){
          this.alert.message = "EVENTS.SERVICEORDER.NAMEREADYEXIST";
          this.alert.type = 'danger';
          this.alert.show = true;
        }
      }
      this.loading = false;
    },
    (err) => {
      let code = 1;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.THIRDPARTIES.ASSOCIATENOTFOUND"; }
      //else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
    });
  }

}
