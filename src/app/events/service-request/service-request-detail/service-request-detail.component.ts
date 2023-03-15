import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ServiceRequestContractComponent } from '@app/pop-up/service-request-contract/service-request-contract.component';
import { ServiceRequestProviderComponent } from '@app/pop-up/service-request-provider/service-request-provider.component';
import { ServiceRequestTracingComponent } from '@app/pop-up/service-request-tracing/service-request-tracing.component';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-service-request-detail',
  templateUrl: './service-request-detail.component.html',
  styleUrls: ['./service-request-detail.component.css']
})
export class ServiceRequestDetailComponent implements OnInit {

  private tracingGridApi;
  sub;
  currentUser;
  detail_form: UntypedFormGroup;
  upload_form: UntypedFormGroup;
  loading: boolean = false;
  loading_cancel: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  canCreate: boolean = false;
  canDetail: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;
  serviceList: any[] = [];
  serviceTypeList: any[] = [];
  tracingList: any[] = [];
  code;
  showSaveButton: boolean = false;
  showEditButton: boolean = false;
  editStatus: boolean = false;
  editBlock: boolean = false;

  constructor(private formBuilder: UntypedFormBuilder, 
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private router: Router,
              private translate: TranslateService,
              private activatedRoute: ActivatedRoute,
              private modalService : NgbModal) { }

  ngOnInit(): void {
    this.detail_form = this.formBuilder.group({
      fcreacion: [{ value: false, disabled: true }],
      fdiagestion: [''],
      fhoragestion: [''],
      isolicitante: [''],
      bcubierto: [{ value: false, disabled: true }],
      bactivo: [false],
      cprocedencia: [{ value: '', disabled: true }],
      ccontratoflota: [''],
      cplan: [''],
      xnombre: [{ value: '', disabled: true }],
      xapellido: [{ value: '', disabled: true }],
      xdocidentidad: [{ value: '', disabled: true }],
      xplaca: [{ value: '', disabled: true }],
      cservicio: [''],
      xservicio: [''],
      ctiposervicio: [''],
      xtiposervicio: [''],
      cproveedor: [''],
      xproveedor: [{ value: '', disabled: true }],
      xrazonsocial: [{ value: '', disabled: true }],
      xdireccion: [{ value: '', disabled: true }],
      xestado: [{ value: '', disabled: true }],
      xciudad: [{ value: '', disabled: true }],
      xmarca: [''],
      xmodelo: [''],
      xversion: [''],
      fano: [''],
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 87
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
    this.sub = this.activatedRoute.paramMap.subscribe(params => {
      this.code = params.get('id');
      if(this.code){
        if(!this.canDetail){
          this.router.navigate([`/permission-error`]);
          return;
        }
        this.getServiceRequestData();
        if(this.canEdit){ this.showEditButton = true; }
      }else{
        if(!this.canCreate){
          this.router.navigate([`/permission-error`]);
          return;
        }
        this.editStatus = true;
        this.showSaveButton = true;
        this.detail_form.get('bactivo').disable();
      }
    });
  }

  getServiceRequestData(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania,
      csolicitudservicio: this.code
    };
    this.http.post(`${environment.apiUrl}/api/service-request/detail`, params, options).subscribe((response: any) => {
      if(response.data.status){
        if(response.data.fcreacion){
          let dateFormat = new Date(response.data.fcreacion);
          this.detail_form.get('fcreacion').setValue(`${dateFormat.getFullYear()}-${("0" + (dateFormat.getMonth() + 1)).slice(-2)}-${("0" + dateFormat.getDate()).slice(-2)}`);
        }
        if(response.data.fgestion){
          let dateFormat = new Date(response.data.fgestion);
          this.detail_form.get('fdiagestion').setValue(`${dateFormat.getFullYear()}-${("0" + (dateFormat.getMonth() + 1)).slice(-2)}-${("0" + dateFormat.getDate()).slice(-2)}`);
          this.detail_form.get('fhoragestion').setValue(`${("0" + dateFormat.getHours()).slice(-2)}:${("0" + dateFormat.getMinutes()).slice(-2)}`);
        }
        this.detail_form.get('fdiagestion').disable();
        this.detail_form.get('fhoragestion').disable();
        this.detail_form.get('isolicitante').setValue(response.data.isolicitante);
        this.detail_form.get('isolicitante').disable();
        this.detail_form.get('bcubierto').setValue(response.data.bcubierto);
        this.detail_form.get('bactivo').setValue(response.data.bactivo);
        this.detail_form.get('bactivo').disable();
        this.detail_form.get('cprocedencia').setValue(response.data.cprocedencia);
        this.detail_form.get('ccontratoflota').setValue(response.data.ccontratoflota);
        this.detail_form.get('ccontratoflota').disable();
        this.detail_form.get('cplan').setValue(response.data.cplan);
        this.detail_form.get('cplan').disable();
        this.detail_form.get('xnombre').setValue(response.data.xnombre);
        this.detail_form.get('xapellido').setValue(response.data.xapellido);
        this.detail_form.get('xdocidentidad').setValue(response.data.xdocidentidad);
        this.detail_form.get('xmarca').setValue(response.data.xmarca);
        this.detail_form.get('xmarca').disable();
        this.detail_form.get('xmodelo').setValue(response.data.xmodelo);
        this.detail_form.get('xmodelo').disable();
        this.detail_form.get('xversion').setValue(response.data.xversion);
        this.detail_form.get('xversion').disable();
        this.detail_form.get('fano').setValue(response.data.fano);
        this.detail_form.get('fano').disable();
        this.detail_form.get('xplaca').setValue(response.data.xplaca);
        this.serviceTypeDropdownDataRequest();
        this.detail_form.get('ctiposervicio').setValue(response.data.ctiposervicio);
        this.detail_form.get('ctiposervicio').disable();
        this.detail_form.get('xtiposervicio').setValue(response.data.xtiposervicio);
        this.detail_form.get('xtiposervicio').disable();
        console.log(this.detail_form.get('ctiposervicio').value)
        this.serviceDropdownDataRequest();
        this.detail_form.get('cservicio').setValue(response.data.cservicio);
        this.detail_form.get('cservicio').disable();
        this.detail_form.get('xservicio').setValue(response.data.xservicio);
        this.detail_form.get('xservicio').disable();
        this.detail_form.get('cproveedor').setValue(response.data.cproveedor);
        this.detail_form.get('cproveedor').disable();
        this.detail_form.get('xproveedor').setValue(response.data.xproveedor);
        if(response.data.xrazonsocial){
          this.detail_form.get('xrazonsocial').setValue(response.data.xrazonsocial);
        }else{
          this.detail_form.get('xrazonsocial').setValue(response.data.xproveedor);
        }
        this.detail_form.get('xestado').setValue(response.data.xestado);
        this.detail_form.get('xciudad').setValue(response.data.xciudad);
        this.detail_form.get('xdireccion').setValue(response.data.xdireccion);
        this.tracingList = [];
        if(response.data.tracings){
          for(let i = 0; i < response.data.tracings.length; i++){
            let dateFormat = new Date(response.data.tracings[i].fseguimientosolicitudservicio);
            let dayFormat = `${dateFormat.getFullYear()}-${("0" + (dateFormat.getMonth() + 1)).slice(-2)}-${("0" + dateFormat.getDate()).slice(-2)}`;
            let timeFormat = `${("0" + dateFormat.getHours()).slice(-2)}:${("0" + dateFormat.getMinutes()).slice(-2)}`;
            this.tracingList.push({
              cgrid: i,
              create: false,
              cseguimientosolicitudservicio: response.data.tracings[i].cseguimientosolicitudservicio,
              ctiposeguimiento: response.data.tracings[i].ctiposeguimiento,
              xtiposeguimiento: response.data.tracings[i].xtiposeguimiento,
              cmotivoseguimiento: response.data.tracings[i].cmotivoseguimiento,
              xmotivoseguimiento: response.data.tracings[i].xmotivoseguimiento,
              fdia: dayFormat,
              fhora: timeFormat,
              fseguimientosolicitudservicio: dateFormat,
              bcerrado: response.data.tracings[i].bcerrado ? response.data.tracings[i].bcerrado : false,
              xcerrado: response.data.tracings[i].bcerrado ? this.translate.instant("DROPDOWN.CLOSE") : this.translate.instant("DROPDOWN.OPEN"),
              xobservacion: response.data.tracings[i].xobservacion
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
      else if(code == 404){ message = "HTTP.ERROR.SERVICEREQUESTS.SERVICEREQUESTNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }

  serviceTypeDropdownDataRequest(){
    if(this.detail_form.get('cplan').value){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cplan: this.detail_form.get('cplan').value
      };
      this.http.post(`${environment.apiUrl}/api/v2/valrep/production/search/plan/service-type`, params, options).subscribe((response : any) => {
        if(response.data.status){
          this.serviceTypeList = [];
          for(let i = 0; i < response.data.list.length; i++){
            this.serviceTypeList.push({ id: response.data.list[i].ctiposervicio, value: response.data.list[i].xtiposervicio });
          }
          this.serviceTypeList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.SERVICETYPENOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
    }
  }

  serviceDropdownDataRequest(){
    if(this.detail_form.get('cplan').value && this.detail_form.get('ctiposervicio').value){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cplan: this.detail_form.get('cplan').value,
        ctiposervicio: this.detail_form.get('ctiposervicio').value
      };
      this.http.post(`${environment.apiUrl}/api/v2/valrep/production/search/plan/service`, params, options).subscribe((response : any) => {
        if(response.data.status){
          this.serviceList = [];
          for(let i = 0; i < response.data.list.length; i++){
            this.serviceList.push({ id: response.data.list[i].cservicio, value: response.data.list[i].xservicio });
          }
          this.serviceList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.SERVICENOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
    }
  }

  editServiceRequest(){
    this.detail_form.get('fdiagestion').enable();
    this.detail_form.get('fhoragestion').enable();
    this.detail_form.get('bactivo').enable();
    this.detail_form.get('ccontratoflota').enable();
    this.detail_form.get('cplan').enable();
    this.detail_form.get('cservicio').enable();
    this.detail_form.get('ctiposervicio').enable();
    this.detail_form.get('cproveedor').enable();
    this.showEditButton = false;
    this.showSaveButton = true;
    this.editStatus = true;
    this.editBlock = true;
  }

  cancelSave(){
    if(this.code){
      this.loading_cancel = true;
      this.showSaveButton = false;
      this.editStatus = false;
      this.showEditButton = true;
      this.editBlock = false;
      this.getServiceRequestData();
    }else{
      this.router.navigate([`/events/service-request-detail`]);
    }
  }

  searchClubContractManagement(){
    let contract = { };
    const modalRef = this.modalService.open(ServiceRequestContractComponent, { size: 'xl' });
    modalRef.componentInstance.contract = contract;
    modalRef.result.then((result: any) => { 
      if(result){
        this.detail_form.get('ccontratoflota').setValue(result.ccontratoflota);
        this.detail_form.get('cplan').setValue(result.cplan);
        this.detail_form.get('xnombre').setValue(result.xnombre);
        this.detail_form.get('xapellido').setValue(result.xapellido);
        this.detail_form.get('xdocidentidad').setValue(result.xdocidentidad);
        this.detail_form.get('xplaca').setValue(result.xplaca);
        this.detail_form.get('ctiposervicio').setValue('');
        this.detail_form.get('cservicio').setValue('');
        this.detail_form.get('cproveedor').setValue('');
        this.detail_form.get('xproveedor').setValue('');
        this.detail_form.get('xrazonsocial').setValue('');
        this.detail_form.get('xdireccion').setValue('');
        this.detail_form.get('xestado').setValue('');
        this.detail_form.get('xciudad').setValue('');
        this.serviceTypeDropdownDataRequest();
      }
    });
  }

  searchProvider(){
    let provider = { ctiposervicio: this.detail_form.get('ctiposervicio').value, cservicio: this.detail_form.get('cservicio').value };
    const modalRef = this.modalService.open(ServiceRequestProviderComponent, { size: 'xl' });
    modalRef.componentInstance.provider = provider;
    modalRef.result.then((result: any) => { 
      if(result){
        this.detail_form.get('cproveedor').setValue(result.cproveedor);
        this.detail_form.get('xproveedor').setValue(result.xproveedor);
        this.detail_form.get('xrazonsocial').setValue(result.xrazonsocial);
        this.detail_form.get('xdireccion').setValue(result.xdireccion);
        this.detail_form.get('xestado').setValue(result.xestado);
        this.detail_form.get('xciudad').setValue(result.xciudad);
      }
    });
  }

  addTracing(){
    let tracing = { type: 3 };
    const modalRef = this.modalService.open(ServiceRequestTracingComponent);
    modalRef.componentInstance.tracing = tracing;
    modalRef.result.then((result: any) => { 
      if(result){
        if(result.type == 3){
          this.tracingList.push({
            cgrid: this.tracingList.length,
            create: true,
            ctiposeguimiento: result.ctiposeguimiento,
            xtiposeguimiento: result.xtiposeguimiento,
            cmotivoseguimiento: result.cmotivoseguimiento,
            xmotivoseguimiento: result.xmotivoseguimiento,
            fdia: result.fdia,
            fhora: result.fhora,
            fseguimientosolicitudservicio: result.fseguimientosolicitudservicio,
            bcerrado: result.bcerrado,
            xcerrado: result.bcerrado ? this.translate.instant("DROPDOWN.CLOSE") : this.translate.instant("DROPDOWN.OPEN"),
            xobservacion: result.xobservacion
          });
          this.tracingGridApi.setRowData(this.tracingList);
        }
      }
    });
  }

  tracingRowClicked(event: any){
    let tracing = {};
    if(this.editStatus){ 
      tracing = { 
        type: 1,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        cseguimientosolicitudservicio: event.data.cseguimientosolicitudservicio,
        ctiposeguimiento: event.data.ctiposeguimiento,
        cmotivoseguimiento: event.data.cmotivoseguimiento,
        fdia: event.data.fdia,
        fhora: event.data.fhora,
        fseguimientosolicitudservicio: event.data.fseguimientosolicitudservicio,
        bcerrado: event.data.bcerrado,
        xobservacion: event.data.xobservacion,
        delete: false
      };
    }else{ 
      tracing = { 
        type: 2,
        create: event.data.create,
        cgrid: event.data.cgrid,
        cseguimientosolicitudservicio: event.data.cseguimientosolicitudservicio,
        ctiposeguimiento: event.data.ctiposeguimiento,
        cmotivoseguimiento: event.data.cmotivoseguimiento,
        fdia: event.data.fdia,
        fhora: event.data.fhora,
        fseguimientosolicitudservicio: event.data.fseguimientosolicitudservicio,
        bcerrado: event.data.bcerrado,
        xobservacion: event.data.xobservacion,
        delete: false
      }; 
    }
    const modalRef = this.modalService.open(ServiceRequestTracingComponent);
    modalRef.componentInstance.tracing = tracing;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 1){
          for(let i = 0; i < this.tracingList.length; i++){
            if(this.tracingList[i].cgrid == result.cgrid){
              this.tracingList[i].ctiposeguimiento = result.ctiposeguimiento;
              this.tracingList[i].xtiposeguimiento = result.xtiposeguimiento;
              this.tracingList[i].cmotivoseguimiento = result.cmotivoseguimiento;
              this.tracingList[i].xmotivoseguimiento = result.xmotivoseguimiento;
              this.tracingList[i].fdia = result.fdia;
              this.tracingList[i].fhora = result.fhora;
              this.tracingList[i].fseguimientosolicitudservicio = result.fseguimientosolicitudservicio;
              this.tracingList[i].bcerrado = result.bcerrado;
              this.tracingList[i].xcerrado = result.bcerrado ? this.translate.instant("DROPDOWN.CLOSE") : this.translate.instant("DROPDOWN.OPEN"),
              this.tracingList[i].xobservacion = result.xobservacion;
              this.tracingGridApi.refreshCells();
              return;
            }
          }
        }
      }
    });
  }

  onTracingsGridReady(event){
    this.tracingGridApi = event.api;
  }

  onSubmit(form){
    this.submitted = true;
    this.loading = true;
    if(this.detail_form.invalid){
      this.loading = false;
      return;
    }
    let params;
    let url;
    let fgestion = undefined;
    if(form.fdiagestion && form.fhoragestion){
      fgestion = new Date(`${form.fdiagestion} ${form.fhoragestion}`);
    }
    if(this.code){
      let updateTracingList = this.tracingList.filter((row) => { return !row.create; });
      for(let i = 0; i < updateTracingList.length; i++){
        delete updateTracingList[i].cgrid;
        delete updateTracingList[i].create;
        delete updateTracingList[i].xtiposeguimiento;
        delete updateTracingList[i].xmotivoseguimiento;
        delete updateTracingList[i].fdia;
        delete updateTracingList[i].fhora;
        delete updateTracingList[i].xcerrado;
        if(!updateTracingList[i].xobservacion){
          delete updateTracingList[i].xobservacion;
        }
      }
      let createTracingList = this.tracingList.filter((row) => { return row.create; });
      for(let i = 0; i < createTracingList.length; i++){
        delete createTracingList[i].cgrid;
        delete createTracingList[i].create;
        delete createTracingList[i].xtiposeguimiento;
        delete createTracingList[i].xmotivoseguimiento;
        delete createTracingList[i].fdia;
        delete createTracingList[i].fhora;
        delete createTracingList[i].bcerrado;
        delete createTracingList[i].xcerrado;
        delete createTracingList[i].xobservacion;
      }
      params = {
        permissionData: {
          cusuario: this.currentUser.data.cusuario,
          cmodulo: 87
        },
        csolicitudservicio: this.code,
        cusuariomodificacion: this.currentUser.data.cusuario,
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania,
        fgestion: fgestion ? fgestion : undefined,
        ccontratoflota: form.ccontratoflota,
        cproveedor: form.cproveedor,
        ctiposervicio: form.ctiposervicio,
        cservicio: form.cservicio,
        tracings: {
          create: createTracingList,
          update: updateTracingList
        }
      };
      url = `${environment.apiUrl}/api/v2/service-request/production/update`;
      this.sendFormData(params, url);
    }else{
      let tracing = { type: 3 };
      const modalRef = this.modalService.open(ServiceRequestTracingComponent);
      modalRef.componentInstance.tracing = tracing;
      modalRef.result.then((result: any) => { 
        if(result){
          if(result.type == 3){
            params = {
              permissionData: {
                cusuario: this.currentUser.data.cusuario,
                cmodulo: 87
              },
              cpais: this.currentUser.data.cpais,
              ccompania: this.currentUser.data.ccompania,
              cusuariocreacion: this.currentUser.data.cusuario,
              fgestion: fgestion? fgestion : undefined,
              isolicitante: form.isolicitante,
              ccontratoflota: form.ccontratoflota,
              cproveedor: form.cproveedor,
              ctiposervicio: form.ctiposervicio,
              cservicio: form.cservicio,
              ctiposeguimiento: result.ctiposeguimiento,
              cmotivoseguimiento: result.cmotivoseguimiento,
              fseguimientosolicitudservicio: result.fseguimientosolicitudservicio
            };
            url = `${environment.apiUrl}/api/v2/service-request/production/create`;
            this.sendFormData(params, url);
          }
        }else{
          this.loading = false;
          return;
        }
      });
    }
  }

  sendFormData(params, url){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    this.http.post(url, params, options).subscribe((response: any) => {
      if(response.data.status){
        if(this.code){
          location.reload();
        }else{
          this.router.navigate([`/events/service-request-detail/${response.data.csolicitudservicio}`]);
        }
      }else{
        let condition = response.data.condition;
        if(condition == "club-contract-management-not-found"){
          this.alert.message = "EVENTS.SERVICEREQUESTS.CLUBCONTRACTMANAGEMENTNOTFOUD";
          this.alert.type = 'danger';
          this.alert.show = true;
        }else if(condition == "club-contract-management-not-active"){
          this.alert.message = "EVENTS.SERVICEREQUESTS.CLUBCONTRACTMANAGEMENTNOTACTIVE";
          this.alert.type = 'danger';
          this.alert.show = true;
        }else if(condition == "service-not-found"){
          this.alert.message = "EVENTS.SERVICEREQUESTS.SERVICENOTFOUND";
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
      else if(code == 404){ message = "HTTP.ERROR.CLUBCONTRACTSMANAGEMENT.CLUBCONTRACTMANAGEMENTNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
    });
  }

}
