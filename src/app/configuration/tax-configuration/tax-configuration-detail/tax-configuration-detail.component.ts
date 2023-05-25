import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormControl } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-tax-configuration-detail',
  templateUrl: './tax-configuration-detail.component.html',
  styleUrls: ['./tax-configuration-detail.component.css']
})
export class TaxConfigurationDetailComponent implements OnInit {

  sub;
  currentUser;
  detail_form: UntypedFormGroup;
  loading: boolean = false;
  loading_cancel: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  canCreate: boolean = false;
  canDetail: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;
  paymentTypeList: any[] = [];
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
      ximpuesto: [''],
      xobservacion: [''],
      pimpuesto: [''],
      ctipopago: [''],
      fdesde: [''],
      fhasta: [''],
      mdesde: [''],
      mhasta: [''],
      bactivo: [true]
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 47
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
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania
    };
    this.http.post(`${environment.apiUrl}/api/valrep/payment-type`, params, options).subscribe((response : any) => {
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.paymentTypeList.push({ id: response.data.list[i].ctipopago, value: response.data.list[i].xtipopago });
        }
        this.paymentTypeList.sort((a,b) => a.value > b.value ? 1 : -1);
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.DEPARTMENTNOTFOUND"; }
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
        this.getTaxData();
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

  getTaxData(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cimpuesto: this.code,
      cpais: this.currentUser.data.cpais
    };
    this.http.post(`${environment.apiUrl}/api/tax/configuration/detail`, params, options).subscribe((response: any) => {
      if(response.data.status){
        this.detail_form.get('ximpuesto').setValue(response.data.ximpuesto);
        this.detail_form.get('ximpuesto').disable();
        this.detail_form.get('xobservacion').setValue(response.data.xobservacion);
        this.detail_form.get('xobservacion').disable();
        this.detail_form.get('bactivo').setValue(response.data.bactivo);
        this.detail_form.get('bactivo').disable();
        response.data.pimpuesto ? this.detail_form.get('pimpuesto').setValue(response.data.pimpuesto) : undefined;
        this.detail_form.get('pimpuesto').disable();
        response.data.ctipopago ? this.detail_form.get('ctipopago').setValue(response.data.ctipopago) : undefined;
        this.detail_form.get('ctipopago').disable();
        if(response.data.fdesde){
          let dateFormat = new Date(response.data.fdesde).toISOString().substring(0, 10);
          this.detail_form.get('fdesde').setValue(dateFormat);
        }
        this.detail_form.get('fdesde').disable();
        if(response.data.fhasta){
          let dateFormat = new Date(response.data.fhasta).toISOString().substring(0, 10);
          this.detail_form.get('fhasta').setValue(dateFormat);
        }
        this.detail_form.get('fhasta').disable();
        response.data.mdesde ? this.detail_form.get('mdesde').setValue(response.data.mdesde) : undefined;
        this.detail_form.get('mdesde').disable();
        response.data.mhasta ? this.detail_form.get('mhasta').setValue(response.data.mhasta) : undefined;
        this.detail_form.get('mhasta').disable();
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

  editTax(){
    this.detail_form.get('pimpuesto').enable();
    this.detail_form.get('ctipopago').enable();
    this.detail_form.get('fdesde').enable();
    this.detail_form.get('fhasta').enable();
    this.detail_form.get('mdesde').enable();
    this.detail_form.get('mhasta').enable();
    this.showEditButton = false;
    this.showSaveButton = true;
  }

  cancelSave(){
    if(this.code){
      this.loading_cancel = true;
      this.showSaveButton = false;
      this.showEditButton = true;
      this.getTaxData();
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
      let dateFromFormat = new Date(form.fdesde).toUTCString();
      let dateToFormat = new Date(form.fhasta).toUTCString();
      params = {
        cimpuesto: this.code,
        pimpuesto: form.pimpuesto,
        ctipopago: form.ctipopago,
        fdesde: dateFromFormat,
        fhasta: dateToFormat,
        mdesde: form.mdesde,
        mhasta: form.mhasta,
        cusuariomodificacion: this.currentUser.data.cusuario,
        cpais: this.currentUser.data.cpais
      };
      url = `${environment.apiUrl}/api/tax/configuration/update`;
    }
    this.http.post(url, params, options).subscribe((response: any) => {
      if(response.data.status){
        if(this.code){
          location.reload();
        }else{
          this.router.navigate([`/configuration/tax-configuration-detail/${response.data.cimpuesto}`]);
        }
      }
      this.loading = false;
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
      this.loading = false;
    });
  }

}
