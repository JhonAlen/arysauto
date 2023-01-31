import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormControl } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationTypeServiceComponent } from '@app/pop-up/notification-type-service/notification-type-service.component';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-configuration-notification-type-detail',
  templateUrl: './configuration-notification-type-detail.component.html',
  styleUrls: ['./configuration-notification-type-detail.component.css']
})
export class ConfigurationNotificationTypeDetailComponent implements OnInit {

  private servicesGridApi;
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
  editStatus: boolean = false;
  code;
  showSaveButton: boolean = false;
  showEditButton: boolean = false;
  serviceList: any[] = [];
  serviceDeletedRowList: any[] = [];

  constructor(private formBuilder: UntypedFormBuilder, 
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private router: Router,
              private translate: TranslateService,
              private activatedRoute: ActivatedRoute,
              private modalService : NgbModal) { }

  ngOnInit(): void {
    this.detail_form = this.formBuilder.group({
      xtiponotificacion: ['', Validators.required],
      bactivo: [true, Validators.required]
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 79
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
        this.getNotificationTypeData();
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

  getNotificationTypeData(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      ctiponotificacion: this.code,
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania
    };
    this.http.post(`${environment.apiUrl}/api/notification-type/configuration/detail`, params, options).subscribe((response: any) => {
      if(response.data.status){
        this.detail_form.get('xtiponotificacion').setValue(response.data.xtiponotificacion);
        this.detail_form.get('xtiponotificacion').disable();
        this.detail_form.get('bactivo').setValue(response.data.bactivo);
        this.detail_form.get('bactivo').disable();
        this.serviceList = [];
        if(response.data.services){
          for(let i =0; i < response.data.services.length; i++){
            this.serviceList.push({
              cgrid: i,
              create: false,
              cservicio: response.data.services[i].cservicio,
              xservicio: response.data.services[i].xservicio,
              ctiposervicio: response.data.services[i].ctiposervicio,
              xtiposervicio: response.data.services[i].xtiposervicio,
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
      else if(code == 404){ message = "HTTP.ERROR.NOTIFICATIONTYPESCONFIGURATION.NOTIFICATIONTYPENOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }

  editNotificationType(){
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
      this.getNotificationTypeData();
    }
  }

  addService(){
    let service = { type: 3 };
    const modalRef = this.modalService.open(NotificationTypeServiceComponent);
    modalRef.componentInstance.service = service;
    modalRef.result.then((result: any) => { 
      if(result){
        if(result.type == 3){
          this.serviceList.push({
            cgrid: this.serviceList.length,
            create: true,
            cservicio: result.cservicio,
            xservicio: result.xservicio,
            ctiposervicio: result.ctiposervicio,
            xtiposervicio: result.xtiposervicio
          });
          this.servicesGridApi.setRowData(this.serviceList);
        }
      }
    });
  }

  serviceRowClicked(event: any){
    let service = {};
    if(this.editStatus){ 
      service = { 
        type: 1,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        cservicio: event.data.cservicio,
        ctiposervicio: event.data.ctiposervicio,
        delete: false
      };
    }else{ 
      service = { 
        type: 2,
        create: event.data.create,
        cgrid: event.data.cgrid,
        cservicio: event.data.cservicio,
        ctiposervicio: event.data.ctiposervicio,
        delete: false
      }; 
    }
    const modalRef = this.modalService.open(NotificationTypeServiceComponent);
    modalRef.componentInstance.service = service;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 1){
          for(let i = 0; i < this.serviceList.length; i++){
            if(this.serviceList[i].cgrid == result.cgrid){
              this.serviceList[i].cservicio = result.cservicio;
              this.serviceList[i].xservicio = result.xservicio;
              this.serviceList[i].ctiposervicio = result.ctiposervicio;
              this.serviceList[i].xtiposervicio = result.xtiposervicio;
              this.servicesGridApi.refreshCells();
              return;
            }
          }
        }else if(result.type == 4){
          if(result.delete){
            this.serviceDeletedRowList.push({ cservicio: result.cservicio });
          }
          this.serviceList = this.serviceList.filter((row) => { return row.cgrid != result.cgrid });
          for(let i = 0; i < this.serviceList.length; i++){
            this.serviceList[i].cgrid = i;
          }
          this.servicesGridApi.setRowData(this.serviceList);
        }
      }
    });
  }

  onServicesGridReady(event){
    this.servicesGridApi = event.api;
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
      let updateServiceList = this.serviceList.filter((row) => { return !row.create; });
      let createServiceList = this.serviceList.filter((row) => { return row.create; });
      params = {
        ctiponotificacion: this.code,
        cusuariomodificacion: this.currentUser.data.cusuario,
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania,
        services: {
          create: createServiceList,
          update: updateServiceList,
          delete: this.serviceDeletedRowList
        }
      };
      url = `${environment.apiUrl}/api/notification-type/configuration/update`;
    }
    this.http.post(url, params, options).subscribe((response: any) => {
      if(response.data.status){
        if(this.code){
          location.reload();
        }
      }
      this.loading = false;
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.NOTIFICATIONTYPESCONFIGURATION.NOTIFICATIONTYPENOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
    });
  }

}
