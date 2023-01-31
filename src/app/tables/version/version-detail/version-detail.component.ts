import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, Form } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-version-detail',
  templateUrl: './version-detail.component.html',
  styleUrls: ['./version-detail.component.css']
})
export class VersionDetailComponent implements OnInit {

  sub;
  currentUser;
  detail_form: UntypedFormGroup;
  loading: boolean = false;
  loading_cancel: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  brandList: any[] = [];
  modelList: any[] = [];
  transmissionTypeList: any[] = [];
  vehicleTypeList: any[] = [];
  canCreate: boolean = false;
  canDetail: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;
  code;
  showSaveButton: boolean = false;
  showEditButton: boolean = false;

  constructor(private formBuilder: UntypedFormBuilder, 
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private router: Router,
              private translate: TranslateService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.detail_form = this.formBuilder.group({
      cmarca: [''],
      cmodelo: [''],
     // casociado: [''],
      xversion: [''],
       xtransmision: [''],
      // xcilindrajemotor: ['', Validators.required],
      // ctipovehiculo: ['', Validators.required],
      // ncapacidadcarga: ['', Validators.required],
      npasajero: [''],
      bactivo: [true]
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 44
      }
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
        }else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
    }
  }

  initializeDetailModule(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cpais: this.currentUser.data.cpais
    };
    this.http.post(`${environment.apiUrl}/api/valrep/brand`, params, options).subscribe((response : any) => {
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.brandList.push({ id: response.data.list[i].cmarca, value: response.data.list[i].xmarca });
        }
        this.brandList.sort((a,b) => a.value > b.value ? 1 : -1);
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.BRANDNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
    this.http.post(`${environment.apiUrl}/api/valrep/transmission-type`, params, options).subscribe((response : any) => {
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.transmissionTypeList.push({ id: response.data.list[i].xtransmision, value: response.data.list[i].xtipotransmision });
        }
        this.transmissionTypeList.sort((a,b) => a.value > b.value ? 1 : -1);
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.TRANSMISSIONTYPENOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
    this.http.post(`${environment.apiUrl}/api/valrep/vehicle-type`, params, options).subscribe((response : any) => {
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.vehicleTypeList.push({ id: response.data.list[i].ctipovehiculo, value: response.data.list[i].xtipovehiculo });
        }
        this.vehicleTypeList.sort((a,b) => a.value > b.value ? 1 : -1);
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.VEHICLETYPENOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
    this.sub = this.activatedRoute.paramMap.subscribe(params => {
      this.code = params.get('id');
      if(this.code){
        if(!this.canDetail){
          this.router.navigate([`/permission-error`]);
          return;
        }
        this.getVersionData();
        if(this.canEdit){ this.showEditButton = true; }
      }else{
        if(!this.canCreate){
          this.router.navigate([`/permission-error`]);
          return;
        }
        this.showSaveButton = true;
      }
    });
  }

  getVersionData(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cpais: this.currentUser.data.cpais,
      cversion: this.code
    };
    this.http.post(`${environment.apiUrl}/api/version/detail`, params, options).subscribe((response: any) => {
      if(response.data.status){
        // this.detail_form.get('casociado').setValue(response.data.casociado);
        // this.detail_form.get('casociado').disable();
        this.detail_form.get('cmarca').setValue(response.data.cmarca);
        this.detail_form.get('cmarca').disable();
        this.modelDropdownDataRequest();
        this.detail_form.get('cmodelo').setValue(response.data.cmodelo);
        this.detail_form.get('cmodelo').disable();
        this.detail_form.get('xversion').setValue(response.data.xversion);
        this.detail_form.get('xversion').disable();
        this.detail_form.get('xtransmision').setValue(response.data.xtransmision);
        this.detail_form.get('xtransmision').disable();
        // this.initializeDetailModule();
        this.transmissionTypeList.push({ id: response.data.xtransmision, value: response.data.xtransmision });
        // this.detail_form.get('xcilindrajemotor').setValue(response.data.xcilindrajemotor);
        // this.detail_form.get('xcilindrajemotor').disable();
        // console.log(this.detail_form.get('xcilindrajemotor').value)
        // this.detail_form.get('ctipovehiculo').setValue(response.data.ctipovehiculo);
        // this.detail_form.get('ctipovehiculo').disable();
        // console.log(this.detail_form.get('ctipovehiculo').value)
        // this.detail_form.get('ncapacidadcarga').setValue(response.data.ncapacidadcarga);
        // this.detail_form.get('ncapacidadcarga').disable();
        this.detail_form.get('npasajero').setValue(response.data.npasajero);
        this.detail_form.get('npasajero').disable();
        this.detail_form.get('bactivo').setValue(response.data.bactivo);
        this.detail_form.get('bactivo').disable();
      }
      this.loading_cancel = false;
    }, 
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VERSIONS.VERSIONNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }

  editVersion(){
    this.detail_form.get('cmarca').enable();
    this.detail_form.get('cmodelo').enable();
    this.detail_form.get('xversion').enable();
    this.detail_form.get('xtransmision').enable();
    this.detail_form.get('npasajero').enable();
    this.detail_form.get('bactivo').enable();
    this.showEditButton = false;
    this.showSaveButton = true;
  }

  cancelSave(){
    if(this.code){
      this.loading_cancel = true;
      this.showSaveButton = false;
      this.showEditButton = true;
      this.getVersionData();
    }else{
      this.router.navigate([`/tables/version-index`]);
    }
  }

  modelDropdownDataRequest(){
    if(this.detail_form.get('cmarca').value){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cpais: this.currentUser.data.cpais,
        cmarca: this.detail_form.get('cmarca').value
      }
      this.http.post(`${environment.apiUrl}/api/valrep/model`, params, options).subscribe((response : any) => {
        if(response.data.status){
          this.modelList = [];
          for(let i = 0; i < response.data.list.length; i++){
            this.modelList.push({ id: response.data.list[i].cmodelo, value: response.data.list[i].xmodelo });
          }
          this.modelList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.MODELNOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
    }
  }

  onSubmit(form){
    this.submitted = true;
    this.loading = true;
    // if(this.detail_form.invalid){
    //   this.loading = false;
    //   return;
    // }
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params;
    let url;
    if(this.code){
      params = {
        cversion: this.code,
        xtransmision: form.xtransmision,
       // xcilindrajemotor: form.xcilindrajemotor,
       //ctipovehiculo: form.ctipovehiculo,
       // ncapacidadcarga: form.ncapacidadcarga,
        npasajero: form.npasajero,
        cmodelo: form.cmodelo,
        cmarca: form.cmarca,
        //casociado: form.casociado,
        xversion: form.xversion,
        bactivo: form.bactivo,
        cpais: this.currentUser.data.cpais,
        cusuariomodificacion: this.currentUser.data.cusuario
      };
      url = `${environment.apiUrl}/api/version/update`;
    }else{
      params = {
        cmarca: form.cmarca,
        //xtransmision: form.xtransmision,
        // xcilindrajemotor: form.xcilindrajemotor,
        //ctipovehiculo: form.ctipovehiculo,
        //ncapacidadcarga: form.ncapacidadcarga,
        npasajero: form.npasajero,
        //casociado: form.casociado,
        cmodelo: form.cmodelo,
        xversion: form.xversion,
        bactivo: form.bactivo,
        cpais: this.currentUser.data.cpais,
        cusuariocreacion: this.currentUser.data.cusuario
      };
      url = `${environment.apiUrl}/api/version/create`;
    }
    console.log(params)
    this.http.post(url, params, options).subscribe((response : any) => {
      if(response.data.status){
        if(this.code){
          location.reload();
        }else{
          this.router.navigate([`/tables/version-detail/${response.data.cversion}`]);
        }
      }else{
        let condition = response.data.condition;
        if(condition == "version-name-already-exist"){
          this.alert.message = "TABLES.VERSIONS.NAMEALREADYEXIST";
          this.alert.type = 'danger';
          this.alert.show = true;
        }
      }
      this.loading = false;
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VERSIONS.VERSIONNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
    });
  }

}
