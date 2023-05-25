import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RoadManagementConfigurationVehicleTypeComponent } from '@app/pop-up/road-management-configuration-vehicle-type/road-management-configuration-vehicle-type.component';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-road-management-configuration-detail',
  templateUrl: './road-management-configuration-detail.component.html',
  styleUrls: ['./road-management-configuration-detail.component.css']
})
export class RoadManagementConfigurationDetailComponent implements OnInit {

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
      ccliente: [''],
      casociado: [''],
      bactivo: [true]
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 65
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
        this.getRoadManagementConfigurationData();
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

  getRoadManagementConfigurationData(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania,
      cconfiguraciongestionvial: this.code
    };
    this.http.post(`${environment.apiUrl}/api/road-management-configuration/detail`, params, options).subscribe((response: any) => {
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
            this.vehicleTypeList.push({
              cgrid: i,
              create: false,
              ctipovehiculo: response.data.vehicleTypes[i].ctipovehiculo,
              xtipovehiculo: response.data.vehicleTypes[i].xtipovehiculo,
              fefectiva: new Date(response.data.vehicleTypes[i].fefectiva).toISOString().substring(0, 10),
              mtipovehiculoconfiguraciongestionvial: response.data.vehicleTypes[i].mtipovehiculoconfiguraciongestionvial,
              nlimiteano: response.data.vehicleTypes[i].nlimiteano,
              mmayorlimiteano: response.data.vehicleTypes[i].mmayorlimiteano
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
      else if(code == 404){ message = "HTTP.ERROR.ROADMANAGEMENTCONFIGURATIONS.ROADMANAGEMENTCONFIGURATIONNOTFOUND"; }
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

  editRoadManagementConfiguration(){
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
      this.getRoadManagementConfigurationData();
    }else{
      this.router.navigate([`/quotation/road-management-configuration-index`]);
    }
  }

  addVehicleType(){
    let vehicleType = { type: 3 };
    const modalRef = this.modalService.open(RoadManagementConfigurationVehicleTypeComponent);
    modalRef.componentInstance.vehicleType = vehicleType;
    modalRef.result.then((result: any) => { 
      if(result){
        if(result.type == 3){
          this.vehicleTypeList.push({
            cgrid: this.vehicleTypeList.length,
            create: true,
            ctipovehiculo: result.ctipovehiculo,
            xtipovehiculo: result.xtipovehiculo,
            fefectiva: result.fefectiva,
            mtipovehiculoconfiguraciongestionvial: result.mtipovehiculoconfiguraciongestionvial,
            nlimiteano: result.nlimiteano,
            mmayorlimiteano: result.mmayorlimiteano
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
        ctipovehiculo: event.data.ctipovehiculo,
        fefectiva: event.data.fefectiva,
        mtipovehiculoconfiguraciongestionvial: event.data.mtipovehiculoconfiguraciongestionvial,
        nlimiteano: event.data.nlimiteano,
        mmayorlimiteano: event.data.mmayorlimiteano,
        delete: false
      };
    }else{ 
      vehicleType = { 
        type: 2,
        create: event.data.create,
        cgrid: event.data.cgrid,
        ctipovehiculo: event.data.ctipovehiculo,
        fefectiva: event.data.fefectiva,
        mtipovehiculoconfiguraciongestionvial: event.data.mtipovehiculoconfiguraciongestionvial,
        nlimiteano: event.data.nlimiteano,
        mmayorlimiteano: event.data.mmayorlimiteano,
        delete: false
      }; 
    }
    const modalRef = this.modalService.open(RoadManagementConfigurationVehicleTypeComponent);
    modalRef.componentInstance.vehicleType = vehicleType;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 1){
          for(let i = 0; i < this.vehicleTypeList.length; i++){
            if(this.vehicleTypeList[i].cgrid == result.cgrid){
              this.vehicleTypeList[i].ctipovehiculo = result.ctipovehiculo;
              this.vehicleTypeList[i].xtipovehiculo = result.xtipovehiculo;
              this.vehicleTypeList[i].fefectiva = result.fefectiva;
              this.vehicleTypeList[i].mtipovehiculoconfiguraciongestionvial = result.mtipovehiculoconfiguraciongestionvial;
              this.vehicleTypeList[i].nlimiteano = result.nlimiteano;
              this.vehicleTypeList[i].mmayorlimiteano = result.mmayorlimiteano;
              this.vehicleTypeGridApi.refreshCells();
              return;
            }
          }
        }else if(result.type == 4){
          if(result.delete){
            this.vehicleTypeDeletedRowList.push({ ctipovehiculo: result.ctipovehiculo });
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
      for(let i = 0; i < updateVehicleTypeList.length; i++){
        updateVehicleTypeList[i].fefectiva = new Date(updateVehicleTypeList[i].fefectiva).toUTCString();
      }
      let createVehicleTypeList = this.vehicleTypeList.filter((row) => { return row.create; });
      for(let i = 0; i < createVehicleTypeList.length; i++){
        createVehicleTypeList[i].fefectiva = new Date(createVehicleTypeList[i].fefectiva).toUTCString();
      }
      params = {
        cconfiguraciongestionvial: this.code,
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
      url = `${environment.apiUrl}/api/road-management-configuration/update`;
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
      url = `${environment.apiUrl}/api/road-management-configuration/create`;
    }
    this.http.post(url, params, options).subscribe((response : any) => {
      if(response.data.status){
        if(this.code){
          location.reload();
        }else{
          this.router.navigate([`/quotation/road-management-configuration-detail/${response.data.cconfiguraciongestionvial}`]);
        }
      }else{
        let condition = response.data.condition;
        if(condition == "associate-already-exist"){
          this.alert.message = "QUOTATION.ROADMANAGEMENTCONFIGURATIONS.ASSOCIATEALREADYHAVECONFIGURATION";
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
      else if(code == 404){ message = "HTTP.ERROR.ROADMANAGEMENTCONFIGURATIONS.ROADMANAGEMENTCONFIGURATIONNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
    });
  }

}
