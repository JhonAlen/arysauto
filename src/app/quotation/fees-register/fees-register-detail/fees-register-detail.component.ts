import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Papa } from 'ngx-papaparse';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-fees-register-detail',
  templateUrl: './fees-register-detail.component.html',
  styleUrls: ['./fees-register-detail.component.css']
})
export class FeesRegisterDetailComponent implements OnInit {

  private vehicleTypeGridApi;
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
  vehicleTypeList: any[] = [];
  canCreate: boolean = false;
  canDetail: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;
  code;
  showSaveButton: boolean = false;
  showEditButton: boolean = false;
  editStatus: boolean = false;
  vehicleTypeDeletedRowList: any[] = [];
  ratesList: any[] = [];
  parsedData: any[] = [];
  canReadFile: boolean = true;

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
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 66
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
        this.getFeesRegisterData();
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

  getFeesRegisterData(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania,
      cregistrotasa: this.code
    };
    this.http.post(`${environment.apiUrl}/api/fees-register/detail`, params, options).subscribe((response: any) => {
      if(response.data.status){
        this.detail_form.get('ccliente').setValue(response.data.ccliente);
        this.detail_form.get('ccliente').disable();
        this.vehicleTypeList = [];
      }
      this.loading_cancel = false;
    }, 
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.FEESREGISTERS.FEESREGISTERNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }

  editFeesRegister(){
    this.detail_form.get('ccliente').enable();
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
      this.getFeesRegisterData();
    }else{
      this.router.navigate([`/quotation/fees-register-index`]);
    }
  }

  async onFileSelect(event){
    let fixedData: any[] = [];
    let file = event.target.files[0];
    this.ratesList = [];
    this.parsedData = [];
    let parsedCSV = await this.parseCSV(file);
    if (parsedCSV.length > 0) {
      this.parsedData = parsedCSV;
      for (let i = 0; i < (this.parsedData.length); i++){
        fixedData.push({
          cano: this.parsedData[i].CANO,
          particular1: this.parsedData[i].PARTICULAR1,
          particular2: this.parsedData[i].PARTICULAR2,
          rustico1: this.parsedData[i].RUSTICO1,
          rustico2: this.parsedData[i].RUSTICO2,
          pickup1: this.parsedData[i].PICKUP1,
          pickup2: this.parsedData[i].PICKUP2,
          carga2_1: this.parsedData[i].CARGA2_1,
          carga2_2: this.parsedData[i].CARGA2_2,
          carga5_1: this.parsedData[i].CARGA5_1,
          carga5_2: this.parsedData[i].CARGA5_2,
          carga8_1: this.parsedData[i].CARGA8_1,
          carga8_2: this.parsedData[i].CARGA8_2,
          carga12_1: this.parsedData[i].CARGA12_1,
          carga12_2: this.parsedData[i].CARGA12_2,
          moto1: this.parsedData[i].MOTO1,
          moto2: this.parsedData[i].MOTO2,
          iestado: this.parsedData[i].IESTADO,
        })
      }
      this.ratesList = fixedData;
      if (this.detail_form.get('xobservacion').value) {
       
      }
    }
    else {
      event.target.value = null;
      
    }
  }

  parseCSV(file) {

    const requiredHeaders: any[] = [
      "CANO", "PARTICULAR1", "PARTICULAR2", "RUSTICO1", "RUSTICO2", "PICKUP1", "PICKUP2", "CARGA2_1", "CARGA2_2", "CARGA5_1",
      "CARGA5_2", "CARGA8_1", "CARGA8_2", "CARGA12_1", "CARGA12_2", "MOTO1", "MOTO2", "IESTADO"
    ]

    return new Promise <any[]>((resolve, reject) => {
      let papa = new Papa();
      papa.parse(file, {
        delimiter: ";",
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
          let error = "";
          let csvHeaders = Object.keys(results.data[0]);
          let lastRow = results.data[results.data.length - 1];
          let isEmpty = true;
          for (let key in lastRow) {
            if (lastRow[key]) {
              isEmpty = false;
              break;
            }
          }
          if (isEmpty) {
            results.data.pop();
          }
          if (JSON.stringify(csvHeaders) !== JSON.stringify(requiredHeaders)) {
            let missingAttributes = []
            missingAttributes  = requiredHeaders.filter(requiredHeader => !csvHeaders.some(csvHeader => csvHeader === requiredHeader));
            if (missingAttributes.length > 0) {
              error = `Error: El archivo suministrado no incluye todos los atributos necesarios. Se necesita incluir la/s columna/s: ${missingAttributes}`;
            }
            else {
              let additionalAttributes = [];
              additionalAttributes = csvHeaders.filter(csvHeader => !requiredHeaders.some(requiredHeader => requiredHeader === csvHeader));
              error = `Error: El archivo suministrado incluye atributos adicionales, elimine la/s siguiente/s columna/s: ${additionalAttributes}`;
            }
          }
          if (error) {
            results.data = [];
            alert(error);
          }
          resolve(results.data);
        }
      });
    });
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
      let updateVehicleTypeList = this.vehicleTypeList.filter((row) => { return !row.create; });
      let createVehicleTypeList = this.vehicleTypeList.filter((row) => { return row.create; });
      params = {
        cregistrotasa: this.code,
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania,
        ccliente: form.ccliente,
        casociado: form.casociado,
        bactivo: form.bactivo,
        cusuariomodificacion: this.currentUser.data.cusuario,
        vehicleTypes: {
          create: createVehicleTypeList,
          update: updateVehicleTypeList,
          delete: this.vehicleTypeDeletedRowList
        }
      };
      url = `${environment.apiUrl}/api/fees-register/update`;
    }else{
      params = {
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania,
        ccliente: form.ccliente,
        cusuariocreacion: this.currentUser.data.cusuario,
        rates: this.ratesList
      };
      url = `${environment.apiUrl}/api/fees-register/create`;
    }
    this.http.post(url, params, options).subscribe((response : any) => {
      if(response.data.status){
        if(this.code){
          location.reload();
        }else{
          let message = 'Se ha registrado exitosamente';
          this.alert.message = message;
          this.alert.type = 'success';
          this.alert.show = true;
      
          setTimeout(() => {
            this.alert.show = false;
          }, 3000);
    
          location.reload();
          this.loading = false;
        }
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      console.log(err.error.data);
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.FEESREGISTERS.FEESREGISTERNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
    });
  }

  alertSuccess(){

  }

  onContractsGridReady(event){

  }
}
