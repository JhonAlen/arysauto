import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-quote-by-fleet-approval-detail',
  templateUrl: './quote-by-fleet-approval-detail.component.html',
  styleUrls: ['./quote-by-fleet-approval-detail.component.css']
})
export class QuoteByFleetApprovalDetailComponent implements OnInit {

  sub;
  currentUser;
  detail_form: UntypedFormGroup;
  upload_form: UntypedFormGroup;
  loading: boolean = false;
  loading_cancel: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  associateList: any[] = [];
  clientList: any[] = [];
  taxList: any[] = [];
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
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.detail_form = this.formBuilder.group({
      ccliente: ['', Validators.required],
      casociado: ['', Validators.required],
      mmembresia: ['', Validators.required],
      bactivo: [true, Validators.required],
      mperdidaparcial: ['', Validators.required],
      cimpuestoevento: ['', Validators.required],
      mhonorario: ['', Validators.required],
      cimpuestoprofesional: ['', Validators.required],
      mgestionvial: ['', Validators.required],
      cimpuestogestion: ['', Validators.required],
      mtotalcreditofiscal: ['', Validators.required],
      mtotalcapital: ['', Validators.required]
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 68
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
    this.http.post(`${environment.apiUrl}/api/valrep/client`, params, options).subscribe((response : any) => {
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.clientList.push({ id: response.data.list[i].ccliente, value: response.data.list[i].xcliente });
        }
        this.clientList.sort((a,b) => a.value > b.value ? 1 : -1);
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.CLIENTNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
    this.http.post(`${environment.apiUrl}/api/valrep/tax`, params, options).subscribe((response : any) => {
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.taxList.push({ id: response.data.list[i].cimpuesto, value: response.data.list[i].ximpuesto });
        }
        this.taxList.sort((a,b) => a.value > b.value ? 1 : -1);
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.TAXNOTFOUND"; }
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
        this.getQuoteByFleetData();
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

  getQuoteByFleetData(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania,
      ccotizadorflota: this.code
    };
    this.http.post(`${environment.apiUrl}/api/quote-by-fleet/approval/detail`, params, options).subscribe((response: any) => {
      if(response.data.status){
        this.detail_form.get('ccliente').setValue(response.data.ccliente);
        this.detail_form.get('ccliente').disable();
        this.associateDropdownDataRequest();
        this.detail_form.get('casociado').setValue(response.data.casociado);
        this.detail_form.get('casociado').disable();
        this.detail_form.get('mmembresia').setValue(response.data.mmembresia);
        this.detail_form.get('mmembresia').disable();
        this.detail_form.get('bactivo').setValue(response.data.bactivo);
        this.detail_form.get('bactivo').disable();
        response.data.mperdidaparcial ? this.detail_form.get('mperdidaparcial').setValue(response.data.mperdidaparcial) : undefined;
        this.detail_form.get('mperdidaparcial').disable();
        response.data.cimpuestoevento ? this.detail_form.get('cimpuestoevento').setValue(response.data.cimpuestoevento) : undefined;
        this.detail_form.get('cimpuestoevento').disable();
        response.data.mhonorario ? this.detail_form.get('mhonorario').setValue(response.data.mhonorario) : undefined;
        this.detail_form.get('mhonorario').disable();
        response.data.cimpuestoprofesional ? this.detail_form.get('cimpuestoprofesional').setValue(response.data.cimpuestoprofesional) : undefined;
        this.detail_form.get('cimpuestoprofesional').disable();
        response.data.mgestionvial ? this.detail_form.get('mgestionvial').setValue(response.data.mgestionvial) : undefined;
        this.detail_form.get('mgestionvial').disable();
        response.data.cimpuestogestion ? this.detail_form.get('cimpuestogestion').setValue(response.data.cimpuestogestion) : undefined;
        this.detail_form.get('cimpuestogestion').disable();
        response.data.mtotalcreditofiscal ? this.detail_form.get('mtotalcreditofiscal').setValue(response.data.mtotalcreditofiscal) : undefined;
        this.detail_form.get('mtotalcreditofiscal').disable();
        response.data.mtotalcapital ? this.detail_form.get('mtotalcapital').setValue(response.data.mtotalcapital) : undefined;
        this.detail_form.get('mtotalcapital').disable();
      }
      this.loading_cancel = false;
    }, 
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.QUOTESBYFLEETAPPROVAL.QUOTEBYFLEETNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }

  associateDropdownDataRequest(){
    if(this.detail_form.get('ccliente').value){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania,
        ccliente: this.detail_form.get('ccliente').value
      }
      this.http.post(`${environment.apiUrl}/api/valrep/client/associate`, params, options).subscribe((response : any) => {
        if(response.data.status){
          this.associateList = [];
          for(let i = 0; i < response.data.list.length; i++){
            this.associateList.push({ id: response.data.list[i].casociado, value: response.data.list[i].xasociado });
          }
          this.associateList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.ASSOCIATENOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
    }
  }

  editQuoteByFleet(){
    this.detail_form.get('mperdidaparcial').enable();
    this.detail_form.get('cimpuestoevento').enable();
    this.detail_form.get('mhonorario').enable();
    this.detail_form.get('cimpuestoprofesional').enable();
    this.detail_form.get('mgestionvial').enable();
    this.detail_form.get('cimpuestogestion').enable();
    this.detail_form.get('mtotalcreditofiscal').enable();
    this.detail_form.get('mtotalcapital').enable();
    this.showEditButton = false;
    this.showSaveButton = true;
    this.editStatus = true;
  }

  cancelSave(){
    if(this.code){
      this.loading_cancel = true;
      this.showSaveButton = false;
      this.editStatus = false;
      this.showEditButton = true;
      this.getQuoteByFleetData();
    }else{
      this.router.navigate([`/quotation/quote-by-fleet-approval-index`]);
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
        ccotizadorflota: this.code,
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania,
        mperdidaparcial: form.mperdidaparcial,
        cimpuestoevento: form.cimpuestoevento,
        mhonorario: form.mhonorario,
        cimpuestoprofesional: form.cimpuestoprofesional,
        mgestionvial: form.mgestionvial,
        cimpuestogestion: form.cimpuestogestion,
        mtotalcreditofiscal: form.mtotalcreditofiscal,
        mtotalcapital: form.mtotalcapital,
        cusuariomodificacion: this.currentUser.data.cusuario
      };
      url = `${environment.apiUrl}/api/quote-by-fleet/approval/update`;
    }
    this.http.post(url, params, options).subscribe((response : any) => {
      if(response.data.status){
        if(this.code){
          location.reload();
        }else{
          this.router.navigate([`/quotation/quote-by-fleet-approval-detail/${response.data.ccotizadorflota}`]);
        }
      }
      this.loading = false;
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      console.log(err.error.data);
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.QUOTESBYFLEETAPPROVAL.QUOTEBYFLEETNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
    });
  }

}
