import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BankComponent } from '@app/pop-up/bank/bank.component';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-broker-detail',
  templateUrl: './broker-detail.component.html',
  styleUrls: ['./broker-detail.component.css']
})
export class BrokerDetailComponent implements OnInit {

  private gridApi;
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
  bankList: any[] = [];
  deleteRowList: any[] = [];
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
              private modalService : NgbModal,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.detail_form = this.formBuilder.group({
      ncorredor: ['', Validators.required],
      xnombre: ['', Validators.required],
      xapellido: ['', Validators.required],
      cactividadempresa: ['', Validators.required],
      ctipodocidentidad: ['', Validators.required],
      xdocidentidad: ['', Validators.required],
      xtelefono: ['', Validators.required],
      xemail: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])],
      xdireccion: ['', Validators.required],
      cestado: ['', Validators.required],
      cciudad: ['', Validators.required],
      bactivo: [true, Validators.required]
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 52
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
        this.getBrokerData();
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

  getBrokerData(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania,
      ccorredor: this.code
    };
    this.http.post(`${environment.apiUrl}/api/broker/detail`, params, options).subscribe((response: any) => {
      if(response.data.status){
        this.detail_form.get('ncorredor').setValue(response.data.ncorredor);
        this.detail_form.get('ncorredor').disable();
        this.detail_form.get('xnombre').setValue(response.data.xnombre);
        this.detail_form.get('xnombre').disable();
        this.detail_form.get('xapellido').setValue(response.data.xapellido);
        this.detail_form.get('xapellido').disable();
        this.detail_form.get('cactividadempresa').setValue(response.data.cactividadempresa);
        this.detail_form.get('cactividadempresa').disable();
        this.detail_form.get('ctipodocidentidad').setValue(response.data.ctipodocidentidad);
        this.detail_form.get('ctipodocidentidad').disable();
        this.detail_form.get('xdocidentidad').setValue(response.data.xdocidentidad);
        this.detail_form.get('xdocidentidad').disable();
        this.detail_form.get('xtelefono').setValue(response.data.xtelefono);
        this.detail_form.get('xtelefono').disable();
        this.detail_form.get('xemail').setValue(response.data.xemail);
        this.detail_form.get('xemail').disable();
        this.detail_form.get('xdireccion').setValue(response.data.xdireccion);
        this.detail_form.get('xdireccion').disable();
        this.detail_form.get('cestado').setValue(response.data.cestado);
        this.detail_form.get('cestado').disable();
        this.cityDropdownDataRequest();
        this.detail_form.get('cciudad').setValue(response.data.cciudad);
        this.detail_form.get('cciudad').disable();
        this.detail_form.get('bactivo').setValue(response.data.bactivo);
        this.detail_form.get('bactivo').disable();
        this.bankList = [];
        if(response.data.banks){
          for(let i =0; i < response.data.banks.length; i++){
            this.bankList.push({
              cgrid: i,
              create: false,
              cbanco: response.data.banks[i].cbanco,
              xbanco: response.data.banks[i].xbanco,
              ctipocuentabancaria: response.data.banks[i].ctipocuentabancaria,
              xtipocuentabancaria: response.data.banks[i].xtipocuentabancaria,
              xnumerocuenta: response.data.banks[i].xnumerocuenta
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
      else if(code == 404){ message = "HTTP.ERROR.BROKERS.BROKERNOTFOUND"; }
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

  editBroker(){
    this.detail_form.get('ncorredor').enable();
    this.detail_form.get('xnombre').enable();
    this.detail_form.get('xapellido').enable();
    this.detail_form.get('cactividadempresa').enable();
    this.detail_form.get('ctipodocidentidad').enable();
    this.detail_form.get('xdocidentidad').enable();
    this.detail_form.get('xtelefono').enable();
    this.detail_form.get('xemail').enable();
    this.detail_form.get('xdireccion').enable();
    this.detail_form.get('cestado').enable();
    this.detail_form.get('cciudad').enable();
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
      this.getBrokerData();
    }else{
      this.router.navigate([`/thirdparties/broker-index`]);
    }
  }

  addBank(){
    let bank = { type: 3 };
    const modalRef = this.modalService.open(BankComponent);
    modalRef.componentInstance.bank = bank;
    modalRef.result.then((result: any) => { 
      if(result){
        if(result.type == 3){
          this.bankList.push({
            cgrid: this.bankList.length,
            create: true,
            cbanco: result.cbanco,
            xbanco: result.xbanco,
            ctipocuentabancaria: result.ctipocuentabancaria,
            xtipocuentabancaria: result.xtipocuentabancaria,
            xnumerocuenta: result.xnumerocuenta
          });
          this.gridApi.setRowData(this.bankList);
        }
      }
    });
  }

  rowClicked(event: any){
    let bank = {};
    if(this.editStatus){ 
      bank = { 
        type: 1,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        cbanco: event.data.cbanco,
        ctipocuentabancaria: event.data.ctipocuentabancaria, 
        xnumerocuenta: event.data.xnumerocuenta,
        delete: false
      };
    }else{ 
      bank = { 
        type: 2,
        create: event.data.create,
        cgrid: event.data.cgrid,
        cbanco: event.data.cbanco,
        ctipocuentabancaria: event.data.ctipocuentabancaria, 
        xnumerocuenta: event.data.xnumerocuenta,
        delete: false
      }; 
    }
    const modalRef = this.modalService.open(BankComponent);
    modalRef.componentInstance.bank = bank;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 1){
          for(let i = 0; i < this.bankList.length; i++){
            if(this.bankList[i].cgrid == result.cgrid){
              this.bankList[i].cbanco = result.cbanco;
              this.bankList[i].xbanco = result.xbanco;
              this.bankList[i].ctipocuentabancaria = result.ctipocuentabancaria;
              this.bankList[i].xtipocuentabancaria = result.xtipocuentabancaria;
              this.bankList[i].xnumerocuenta = result.xnumerocuenta;
              this.gridApi.refreshCells();
              return;
            }
          }
        }else if(result.type == 4){
          if(result.delete){
            this.deleteRowList.push({ cbanco: result.cbanco });
          }
          this.bankList = this.bankList.filter((row) => { return row.cgrid != result.cgrid });
          for(let i = 0; i < this.bankList.length; i++){
            this.bankList[i].cgrid = i;
          }
          this.gridApi.setRowData(this.bankList);
        }
      }
    });
  }

  onGridReady(event){
    this.gridApi = event.api;
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
      let updateList = this.bankList.filter((row) => { return !row.create; });
      let createList = this.bankList.filter((row) => { return row.create; });
      params = {
        ccorredor: this.code,
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania,
        xnombre: form.xnombre,
        ncorredor: form.ncorredor,
        xapellido: form.xapellido,
        cactividadempresa: form.cactividadempresa,
        ctipodocidentidad: form.ctipodocidentidad,
        xdocidentidad: form.xdocidentidad,
        xtelefono: form.xtelefono,
        xemail: form.xemail,
        xdireccion: form.xdireccion,
        cestado: form.cestado,
        cciudad: form.cciudad,
        bactivo: form.bactivo,
        cusuariomodificacion: this.currentUser.data.cusuario,
        banks: {
          create: createList,
          update: updateList,
          delete: this.deleteRowList
        }
      };
      url = `${environment.apiUrl}/api/broker/update`;
    }else{
      params = {
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania,
        xnombre: form.xnombre,
        ncorredor: form.ncorredor,
        xapellido: form.xapellido,
        cactividadempresa: form.cactividadempresa,
        ctipodocidentidad: form.ctipodocidentidad,
        xdocidentidad: form.xdocidentidad,
        xtelefono: form.xtelefono,
        xemail: form.xemail,
        xdireccion: form.xdireccion,
        cestado: form.cestado,
        cciudad: form.cciudad,
        bactivo: form.bactivo,
        banks: this.bankList,
        cusuariocreacion: this.currentUser.data.cusuario
      };
      url = `${environment.apiUrl}/api/broker/create`;
    }
    this.http.post(url, params, options).subscribe((response : any) => {
      if(response.data.status){
        if(this.code){
          location.reload();
        }else{
          this.router.navigate([`/thirdparties/broker-detail/${response.data.ccorredor}`]);
        }
      }else{
        let condition = response.data.condition;
        if(condition == "broker-number-already-exist"){
          this.alert.message = "THIRDPARTIES.BROKERS.BROKERNUMBERALREADYEXIST";
          this.alert.type = 'danger';
          this.alert.show = true;
        }else if(condition == "identification-document-already-exist"){
          this.alert.message = "THIRDPARTIES.BROKERS.IDENTIFICATIONDOCUMENTALREADYEXIST";
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
      else if(code == 404){ message = "HTTP.ERROR.BROKERS.BROKERNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
    });
  }

}
