import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-proficient-detail',
  templateUrl: './proficient-detail.component.html',
  styleUrls: ['./proficient-detail.component.css']
})
export class ProficientDetailComponent implements OnInit {

  sub;
  currentUser;
  detail_form: UntypedFormGroup;
  loading: boolean = false;
  loading_cancel: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  businessActivityList: any[] = [];
  documentTypeList: any[] = [];
  stateList: any[] = [];
  cityList: any[] = [];
  canCreate: boolean = false;
  canDetail: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;
  code;
  showSaveButton: boolean = false;
  showEditButton: boolean = false;
  editStatus: boolean = false;

  constructor(private formBuilder: UntypedFormBuilder, 
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private router: Router,
              private translate: TranslateService,
              private activatedRoute: ActivatedRoute,
              private modalService : NgbModal) { }

  ngOnInit(): void {
    this.detail_form = this.formBuilder.group({
      xperito: [''],
      xrazonsocial: [''],
      ctipodocidentidad: [''],
      xdocidentidad: [''],
      xtelefono: [''],
      xemail: ['', Validators.compose([
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])],
      xfax: [''],
      xpaginaweb: [''],
      pretencion: [''],
      xdireccion: [''],
      xdireccioncorreo: [''],
      xobservacion: [''],
      centeimpuesto: [''],
      ldiascredito: [''],
      cestado: [''],
      cciudad: [''],
      bafiliado: [false],
      bactivo: [true]
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 70
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
    this.http.post(`${environment.apiUrl}/api/valrep/business-activity`, params, options).subscribe((response : any) => {
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.businessActivityList.push({ id: response.data.list[i].cactividadempresa, value: response.data.list[i].xactividadempresa });
        }
        this.businessActivityList.sort((a,b) => a.value > b.value ? 1 : -1);
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.BUSINESSACTIVITYNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
    this.http.post(`${environment.apiUrl}/api/valrep/document-type`, params, options).subscribe((response : any) => {
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.documentTypeList.push({ id: response.data.list[i].ctipodocidentidad, value: response.data.list[i].xtipodocidentidad });
        }
        this.documentTypeList.sort((a,b) => a.value > b.value ? 1 : -1);
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.DOCUMENTTYPENOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
    this.http.post(`${environment.apiUrl}/api/valrep/state`, params, options).subscribe((response : any) => {
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.stateList.push({ id: response.data.list[i].cestado, value: response.data.list[i].xestado });
        }
        this.stateList.sort((a,b) => a.value > b.value ? 1 : -1);
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.DOCUMENTTYPENOTFOUND"; }
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
        this.getProficientData();
        if(this.canEdit){ this.showEditButton = true; }
      }else{
        if(!this.canCreate){
          this.router.navigate([`/permission-error`]);
          return;
        }
        this.editStatus = true;
        this.showSaveButton = true;
      }
    });
  }

  getProficientData(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania,
      cperito: this.code
    };
    this.http.post(`${environment.apiUrl}/api/proficient/detail`, params, options).subscribe((response: any) => {
      if(response.data.status){
        this.detail_form.get('xperito').setValue(response.data.xperito);
        this.detail_form.get('xperito').disable();
        this.detail_form.get('xrazonsocial').setValue(response.data.xrazonsocial);
        this.detail_form.get('xrazonsocial').disable();
        this.detail_form.get('ctipodocidentidad').setValue(response.data.ctipodocidentidad);
        this.detail_form.get('ctipodocidentidad').disable();
        this.detail_form.get('xdocidentidad').setValue(response.data.xdocidentidad);
        this.detail_form.get('xdocidentidad').disable();
        this.detail_form.get('xtelefono').setValue(response.data.xtelefono);
        this.detail_form.get('xtelefono').disable();
        response.data.xemail ? this.detail_form.get('xemail').setValue(response.data.xemail) : false;
        this.detail_form.get('xemail').disable();
        response.data.xfax ? this.detail_form.get('xfax').setValue(response.data.xfax) : false;
        this.detail_form.get('xfax').disable();
        response.data.xpaginaweb ? this.detail_form.get('xpaginaweb').setValue(response.data.xpaginaweb) : false;
        this.detail_form.get('xpaginaweb').disable();
        response.data.pretencion ? this.detail_form.get('pretencion').setValue(response.data.pretencion) : false;
        this.detail_form.get('pretencion').disable();
        this.detail_form.get('xdireccion').setValue(response.data.xdireccion);
        this.detail_form.get('xdireccion').disable();
        this.detail_form.get('xdireccioncorreo').setValue(response.data.xdireccioncorreo);
        this.detail_form.get('xdireccioncorreo').disable();
        this.detail_form.get('xobservacion').setValue(response.data.xobservacion);
        this.detail_form.get('xobservacion').disable();
        this.detail_form.get('centeimpuesto').setValue(response.data.centeimpuesto);
        this.detail_form.get('centeimpuesto').disable();
        this.detail_form.get('ldiascredito').setValue(response.data.ldiascredito);
        this.detail_form.get('ldiascredito').disable();
        this.detail_form.get('cestado').setValue(response.data.cestado);
        this.detail_form.get('cestado').disable();
        this.cityDropdownDataRequest();
        this.detail_form.get('cciudad').setValue(response.data.cciudad);
        this.detail_form.get('cciudad').disable();
        this.detail_form.get('bafiliado').setValue(response.data.bafiliado);
        this.detail_form.get('bafiliado').disable();
        this.detail_form.get('bactivo').setValue(response.data.bactivo);
        this.detail_form.get('bactivo').disable();
      }
      this.loading_cancel = false;
    }, 
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.PROFICIENTS.PROFICIENTNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }

  cityDropdownDataRequest(){
    if(this.detail_form.get('cestado').value){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cpais: this.currentUser.data.cpais,
        cestado: this.detail_form.get('cestado').value
      }
      this.http.post(`${environment.apiUrl}/api/valrep/city`, params, options).subscribe((response : any) => {
        if(response.data.status){
          this.cityList = [];
          for(let i = 0; i < response.data.list.length; i++){
            this.cityList.push({ id: response.data.list[i].cciudad, value: response.data.list[i].xciudad });
          }
          this.cityList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.CITYNOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
    }
  }

  editProficient(){
    this.detail_form.get('xperito').enable();
    this.detail_form.get('xrazonsocial').enable();
    this.detail_form.get('ctipodocidentidad').enable();
    this.detail_form.get('xdocidentidad').enable();
    this.detail_form.get('xtelefono').enable();
    this.detail_form.get('xemail').enable();
    this.detail_form.get('xfax').enable();
    this.detail_form.get('xpaginaweb').enable();
    this.detail_form.get('pretencion').enable();
    this.detail_form.get('xdireccion').enable();
    this.detail_form.get('xdireccioncorreo').enable();
    this.detail_form.get('xobservacion').enable();
    this.detail_form.get('centeimpuesto').enable();
    this.detail_form.get('ldiascredito').enable();
    this.detail_form.get('cestado').enable();
    this.detail_form.get('cciudad').enable();
    this.detail_form.get('bafiliado').enable();
    this.detail_form.get('bactivo').enable();
    this.showEditButton = false;
    this.showSaveButton = true;
    this.editStatus = true;
  }

  cancelSave(){
    if(this.code){
      this.loading_cancel = true;
      this.showSaveButton = false;
      this.showEditButton = true;
      this.editStatus = false;
      this.getProficientData();
    }else{
      this.router.navigate([`/thirdparties/proficient-index`]);
    }
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
        cperito: this.code,
        cusuariomodificacion: this.currentUser.data.cusuario,
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania,
        xperito: form.xperito,
        ctipodocidentidad: form.ctipodocidentidad,
        xdocidentidad: form.xdocidentidad,
        xrazonsocial: form.xrazonsocial,
        cestado: form.cestado,
        cciudad: form.cciudad,
        xdireccion: form.xdireccion,
        xdireccioncorreo: form.xdireccioncorreo,
        xtelefono: form.xtelefono,
        xfax: form.xfax ? form.xfax : undefined,
        pretencion: form.pretencion ? form.pretencion : undefined,
        centeimpuesto: form.centeimpuesto,
        ldiascredito: form.ldiascredito,
        xemail: form.xemail ? form.xemail : undefined,
        bafiliado: form.bafiliado,
        xpaginaweb: form.xpaginaweb ? form.xpaginaweb : undefined,
        xobservacion: form.xobservacion,
        bactivo: form.bactivo
      };
      url = `${environment.apiUrl}/api/proficient/update`;
    }else{
      params = {
        cusuariocreacion: this.currentUser.data.cusuario,
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania,
        xperito: form.xperito,
        ctipodocidentidad: form.ctipodocidentidad,
        xdocidentidad: form.xdocidentidad,
        xrazonsocial: form.xrazonsocial,
        cestado: form.cestado,
        cciudad: form.cciudad,
        xdireccion: form.xdireccion,
        xdireccioncorreo: form.xdireccioncorreo,
        xtelefono: form.xtelefono,
        xfax: form.xfax ? form.xfax : undefined,
        pretencion: form.pretencion ? form.pretencion : undefined,
        centeimpuesto: form.centeimpuesto,
        ldiascredito: form.ldiascredito,
        xemail: form.xemail ? form.xemail : undefined,
        bafiliado: form.bafiliado,
        xpaginaweb: form.xpaginaweb ? form.xpaginaweb : undefined,
        xobservacion: form.xobservacion,
        bactivo: form.bactivo
      };
      url = `${environment.apiUrl}/api/proficient/create`;
    }
    this.http.post(url, params, options).subscribe((response: any) => {
      if(response.data.status){
        if(this.code){
          location.reload();
        }else{
          this.router.navigate([`/thirdparties/proficient-detail/${response.data.cperito}`]);
        }
      }else{
        let condition = response.data.condition;
        if(condition == "identification-document-already-exist"){
          this.alert.message = "PROFICIENTS.PROFICIENTS.IDENTIFICATIONDOCUMENTALREADYEXIST";
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
      else if(code == 404){ message = "HTTP.ERROR.PROFICIENTS.PROFICIENTNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
    });
  }

}
