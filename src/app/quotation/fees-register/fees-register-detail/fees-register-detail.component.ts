import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FeesRegisterVehicleTypeComponent } from '@app/pop-up/fees-register-vehicle-type/fees-register-vehicle-type.component';

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

  constructor(private formBuilder: UntypedFormBuilder, 
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private router: Router,
              private translate: TranslateService,
              private activatedRoute: ActivatedRoute,
              private modalService : NgbModal) { }

  ngOnInit(): void {
    this.detail_form = this.formBuilder.group({
      ccliente: ['', Validators.required],
      casociado: ['', Validators.required],
      bactivo: [true, Validators.required]
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
        this.associateDropdownDataRequest();
        this.detail_form.get('casociado').setValue(response.data.casociado);
        this.detail_form.get('casociado').disable();
        this.detail_form.get('bactivo').setValue(response.data.bactivo);
        this.detail_form.get('bactivo').disable();
        this.vehicleTypeList = [];
        if(response.data.vehicleTypes){
          for(let i =0; i < response.data.vehicleTypes.length; i++){
            let intervals = [];
            for(let j =0; j < response.data.vehicleTypes[i].intervals.length; j++){
              intervals.push({
                create: false,
                crangoanotipovehiculo: response.data.vehicleTypes[i].intervals[j].crangoanotipovehiculo,
                fanoinicio: response.data.vehicleTypes[i].intervals[j].fanoinicio,
                fanofinal: response.data.vehicleTypes[i].intervals[j].fanofinal,
                ptasainterna: response.data.vehicleTypes[i].intervals[j].ptasainterna
              });
            }
            this.vehicleTypeList.push({
              cgrid: i,
              create: false,
              ctipovehiculo: response.data.vehicleTypes[i].ctipovehiculo,
              xtipovehiculo: response.data.vehicleTypes[i].xtipovehiculo,
              ctipovehiculoregistrotasa: response.data.vehicleTypes[i].ctipovehiculoregistrotasa,
              miniciointervalo: response.data.vehicleTypes[i].miniciointervalo,
              mfinalintervalo: response.data.vehicleTypes[i].mfinalintervalo,
              ptasa: response.data.vehicleTypes[i].ptasa,
              intervals: intervals
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
      else if(code == 404){ message = "HTTP.ERROR.FEESREGISTERS.FEESREGISTERNOTFOUND"; }
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

  editFeesRegister(){
    this.detail_form.get('ccliente').enable();
    this.detail_form.get('casociado').enable();
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
      this.getFeesRegisterData();
    }else{
      this.router.navigate([`/quotation/fees-register-index`]);
    }
  }

  addVehicleType(){
    let vehicleType = { type: 3 };
    const modalRef = this.modalService.open(FeesRegisterVehicleTypeComponent, {size: 'xl'});
    modalRef.componentInstance.vehicleType = vehicleType;
    modalRef.result.then((result: any) => { 
      if(result){
        if(result.type == 3){
          this.vehicleTypeList.push({
            cgrid: this.vehicleTypeList.length,
            create: true,
            ctipovehiculo: result.ctipovehiculo,
            xtipovehiculo: result.xtipovehiculo,
            miniciointervalo: result.miniciointervalo,
            mfinalintervalo: result.mfinalintervalo,
            ptasa: result.ptasa,
            intervals: result.intervals
          });
          this.vehicleTypeGridApi.setRowData(this.vehicleTypeList);
        }
      }
    });
  }

  vehicleTypeRowClicked(event: any){
    let vehicleType = {};
    if(this.editStatus){ 
      vehicleType = { 
        type: 1,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        ctipovehiculoregistrotasa: event.data.ctipovehiculoregistrotasa,
        ctipovehiculo: event.data.ctipovehiculo,
        miniciointervalo: event.data.miniciointervalo,
        mfinalintervalo: event.data.mfinalintervalo,
        ptasa: event.data.ptasa,
        intervals: event.data.intervals,
        delete: false
      };
    }else{ 
      vehicleType = { 
        type: 2,
        create: event.data.create,
        cgrid: event.data.cgrid,
        ctipovehiculoregistrotasa: event.data.ctipovehiculoregistrotasa,
        ctipovehiculo: event.data.ctipovehiculo,
        miniciointervalo: event.data.miniciointervalo,
        mfinalintervalo: event.data.mfinalintervalo,
        ptasa: event.data.ptasa,
        intervals: event.data.intervals,
        delete: false
      }; 
    }
    const modalRef = this.modalService.open(FeesRegisterVehicleTypeComponent, {size: 'xl'});
    modalRef.componentInstance.vehicleType = vehicleType;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 1){
          for(let i = 0; i < this.vehicleTypeList.length; i++){
            if(this.vehicleTypeList[i].cgrid == result.cgrid){
              this.vehicleTypeList[i].ctipovehiculo = result.ctipovehiculo;
              this.vehicleTypeList[i].xtipovehiculo = result.xtipovehiculo;
              this.vehicleTypeList[i].miniciointervalo = result.miniciointervalo;
              this.vehicleTypeList[i].mfinalintervalo = result.mfinalintervalo;
              this.vehicleTypeList[i].ptasa = result.ptasa;
              this.vehicleTypeList[i].intervals = result.intervals;
              this.vehicleTypeList[i].intervalsResult = result.intervalsResult;
              this.vehicleTypeGridApi.refreshCells();
              return;
            }
          }
        }else if(result.type == 4){
          if(result.delete){
            this.vehicleTypeDeletedRowList.push({ ctipovehiculoregistrotasa: result.ctipovehiculoregistrotasa, ctipovehiculo: result.ctipovehiculo });
          }
          this.vehicleTypeList = this.vehicleTypeList.filter((row) => { return row.cgrid != result.cgrid });
          for(let i = 0; i < this.vehicleTypeList.length; i++){
            this.vehicleTypeList[i].cgrid = i;
          }
          this.vehicleTypeGridApi.setRowData(this.vehicleTypeList);
        }
      }
    });
  }

  onVehicleTypesGridReady(event){
    this.vehicleTypeGridApi = event.api;
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
        casociado: form.casociado,
        bactivo: form.bactivo,
        cusuariocreacion: this.currentUser.data.cusuario,
        vehicleTypes: this.vehicleTypeList
      };
      url = `${environment.apiUrl}/api/fees-register/create`;
    }
    this.http.post(url, params, options).subscribe((response : any) => {
      if(response.data.status){
        if(this.code){
          location.reload();
        }else{
          this.router.navigate([`/quotation/fees-register-detail/${response.data.cregistrotasa}`]);
        }
      }else{
        let condition = response.data.condition;
        if(condition == "associate-already-exist"){
          this.alert.message = "QUOTATION.FEESREGISTERS.ASSOCIATEALREADYHAVECONFIGURATION";
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
      else if(code == 404){ message = "HTTP.ERROR.FEESREGISTERS.FEESREGISTERNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
    });
  }

}
