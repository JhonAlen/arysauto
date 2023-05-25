import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QuoteByFleetExtraCoverageComponent } from '@app/pop-up/quote-by-fleet-extra-coverage/quote-by-fleet-extra-coverage.component';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-quote-by-fleet-detail',
  templateUrl: './quote-by-fleet-detail.component.html',
  styleUrls: ['./quote-by-fleet-detail.component.css']
})
export class QuoteByFleetDetailComponent implements OnInit {

  private extraCoverageGridApi;
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
  extraCoverageList: any[] = [];
  canCreate: boolean = false;
  canDetail: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;
  code;
  showSaveButton: boolean = false;
  showEditButton: boolean = false;
  editStatus: boolean = false;
  extraCoverageDeletedRowList: any[] = [];

  constructor(private formBuilder: UntypedFormBuilder, 
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private router: Router,
              private translate: TranslateService,
              private activatedRoute: ActivatedRoute,
              private modalService : NgbModal) { }

  ngOnInit(): void {
    this.detail_form = this.formBuilder.group({
      ccliente: [''],
      casociado: [''],
      mmembresia: [''],
      bactivo: [true]
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 67
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
    this.http.post(`${environment.apiUrl}/api/quote-by-fleet/detail`, params, options).subscribe((response: any) => {
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
        this.extraCoverageList = [];
        if(response.data.extraCoverages){
          for(let i =0; i < response.data.extraCoverages.length; i++){
            this.extraCoverageList.push({
              cgrid: i,
              create: false,
              ccoberturaextra: response.data.extraCoverages[i].ccoberturaextra,
              xcoberturaextra: response.data.extraCoverages[i].xcoberturaextra
            });
          }
        }
      }
      this.loading_cancel = false;
    }, 
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.QUOTESBYFLEET.QUOTEBYFLEETNOTFOUND"; }
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
    this.detail_form.get('ccliente').enable();
    this.detail_form.get('casociado').enable();
    this.detail_form.get('mmembresia').enable();
    this.detail_form.get('bactivo').enable();
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
      this.router.navigate([`/quotation/quote-by-fleet-index`]);
    }
  }

  addExtraCoverage(){
    let extraCoverage = { 
      type: 3,
      ccliente: this.detail_form.get('ccliente').value,
      casociado: this.detail_form.get('casociado').value
     };
    const modalRef = this.modalService.open(QuoteByFleetExtraCoverageComponent);
    modalRef.componentInstance.extraCoverage = extraCoverage;
    modalRef.result.then((result: any) => { 
      if(result){
        if(result.type == 3){
          this.extraCoverageList.push({
            cgrid: this.extraCoverageList.length,
            create: true,
            ccoberturaextra: result.ccoberturaextra,
            xcoberturaextra: result.xcoberturaextra
          });
          this.extraCoverageGridApi.setRowData(this.extraCoverageList);
        }
      }
    });
  }

  extraCoverageRowClicked(event: any){
    let extraCoverage = {};
    if(this.editStatus){ 
      extraCoverage = { 
        type: 1,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        ccliente: this.detail_form.get('ccliente').value,
        casociado: this.detail_form.get('casociado').value,
        ccoberturaextra: event.data.ccoberturaextra,
        delete: false
      };
    }else{ 
      extraCoverage = { 
        type: 2,
        create: event.data.create,
        cgrid: event.data.cgrid,
        ccliente: this.detail_form.get('ccliente').value,
        casociado: this.detail_form.get('casociado').value,
        ccoberturaextra: event.data.ccoberturaextra,
        delete: false
      }; 
    }
    const modalRef = this.modalService.open(QuoteByFleetExtraCoverageComponent);
    modalRef.componentInstance.extraCoverage = extraCoverage;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 1){
          for(let i = 0; i < this.extraCoverageList.length; i++){
            if(this.extraCoverageList[i].cgrid == result.cgrid){
              this.extraCoverageList[i].ccoberturaextra = result.ccoberturaextra;
              this.extraCoverageList[i].xcoberturaextra = result.xcoberturaextra;
              this.extraCoverageGridApi.refreshCells();
              return;
            }
          }
        }else if(result.type == 4){
          if(result.delete){
            this.extraCoverageDeletedRowList.push({ ccoberturaextra: result.ccoberturaextra });
          }
          this.extraCoverageList = this.extraCoverageList.filter((row) => { return row.cgrid != result.cgrid });
          for(let i = 0; i < this.extraCoverageList.length; i++){
            this.extraCoverageList[i].cgrid = i;
          }
          this.extraCoverageGridApi.setRowData(this.extraCoverageList);
        }
      }
    });
  }

  onExtraCoveragesGridReady(event){
    this.extraCoverageGridApi = event.api;
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
      let updateExtraCoverageList = this.extraCoverageList.filter((row) => { return !row.create; });
      let createExtraCoverageList = this.extraCoverageList.filter((row) => { return row.create; });
      params = {
        ccotizadorflota: this.code,
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania,
        ccliente: form.ccliente,
        casociado: form.casociado,
        mmembresia: form.mmembresia,
        bactivo: form.bactivo,
        cusuariomodificacion: this.currentUser.data.cusuario,
        extraCoverages: {
          create: createExtraCoverageList,
          update: updateExtraCoverageList,
          delete: this.extraCoverageDeletedRowList
        }
      };
      url = `${environment.apiUrl}/api/quote-by-fleet/update`;
    }else{
      params = {
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania,
        ccliente: form.ccliente,
        casociado: form.casociado,
        mmembresia: form.mmembresia,
        bactivo: form.bactivo,
        cusuariocreacion: this.currentUser.data.cusuario,
        extraCoverages: this.extraCoverageList
      };
      url = `${environment.apiUrl}/api/quote-by-fleet/create`;
    }
    this.http.post(url, params, options).subscribe((response : any) => {
      if(response.data.status){
        if(this.code){
          location.reload();
        }else{
          this.router.navigate([`/quotation/quote-by-fleet-detail/${response.data.ccotizadorflota}`]);
        }
      }else{
        let condition = response.data.condition;
        if(condition == "associate-already-exist"){
          this.alert.message = "QUOTATION.QUOTESBYFLEET.ASSOCIATEALREADYHAVECONFIGURATION";
          this.alert.type = 'danger';
          this.alert.show = true;
        }
      }
      this.loading = false;
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      console.log(err.error.data);
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.QUOTESBYFLEET.QUOTEBYFLEETNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
    });
  }

}
