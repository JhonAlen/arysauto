import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { WebServiceConnectionService } from '@services/web-service-connection.service';
import { AuthenticationService } from '@services/authentication.service';

@Component({
  selector: 'app-notification-type-detail',
  templateUrl: './notification-type-detail.component.html',
  styleUrls: ['./notification-type-detail.component.css']
})
export class NotificationTypeDetailComponent implements OnInit {

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
  code;
  showSaveButton: boolean = false;
  showEditButton: boolean = false;

  constructor(private formBuilder: UntypedFormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private webService: WebServiceConnectionService) { }

    async ngOnInit(): Promise<void> {
    this.detail_form = this.formBuilder.group({
      xtiponotificacion: [''],
      bactivo: [true]
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 37
      }
      let request = await this.webService.securityVerifyModulePermission(params);
      if (request.error) {
        request.condition && request.conditionMessage == 'user-dont-have-permissions' ? this.router.navigate([`/permission-error`]) : false;
        this.alert.message = request.message;
        this.alert.type = 'danger';
        this.alert.show = true;
        return;
      }
        if(request.data.status){
          this.canCreate = request.data.bcrear;
          this.canDetail = request.data.bdetalle;
          this.canEdit = request.data.beditar;
          this.canDelete = request.data.beliminar;
          this.initializeDetailModule();
        }
      return;
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

  async getNotificationTypeData(): Promise<void>{
    let params = {
      permissionData: {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 37
      },
      ctiponotificacion: this.code,
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania
    };
   // this.http.post(`${environment.apiUrl}/api/notification-type/detail`, params, options).subscribe((response: any) => {
    let request = await this.webService.detailNotificationType(params);
    if (request.error) {
      this.alert.message = request.message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading_cancel = false;
      return;
    }
      if(request.data.status){
        this.detail_form.get('xtiponotificacion').setValue(request.data.xtiponotificacion);
        this.detail_form.get('xtiponotificacion').disable();
        this.detail_form.get('bactivo').setValue(request.data.bactivo);
        this.detail_form.get('bactivo').disable();
      }
      this.loading_cancel = false;
      return;
    }

  editNotificationType(){
    this.detail_form.get('xtiponotificacion').enable();
    this.detail_form.get('bactivo').enable();
    this.showEditButton = false;
    this.showSaveButton = true;
  }

  cancelSave(){
    if(this.code){
      this.loading_cancel = true;
      this.showSaveButton = false;
      this.showEditButton = true;
      this.getNotificationTypeData();
    }else{
      this.router.navigate([`/tables/notification-type-index`]);
    }
  }

  async onSubmit(form): Promise<void> {
    this.submitted = true;
    this.loading = true;
    if(this.detail_form.invalid){
      this.loading = false;
      return;
    }
    let params;
    let request;
    if(this.code){
      params = {
        permissionData: {
          cusuario: this.currentUser.data.cusuario,
          cmodulo: 37
        },
        ctiponotificacion: this.code,
        xtiponotificacion: form.xtiponotificacion,
        bactivo: form.bactivo,
        cusuariomodificacion: this.currentUser.data.cusuario,
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania
      };
     // url = `${environment.apiUrl}/api/notification-type/update`;
     request = await this.webService.updateNotificationType(params);
    }else{
      params = {
        permissionData: {
          cusuario: this.currentUser.data.cusuario,
          cmodulo: 37
        },
        xtiponotificacion: form.xtiponotificacion,
        bactivo: form.bactivo,
        cusuariocreacion: this.currentUser.data.cusuario,
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania
      };
     // url = `${environment.apiUrl}/api/notification-type/create`;
     request = await this.webService.createNotificationType(params);
    }
    if (request.error) {
      this.alert.message = request.message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
      return;
    }
      if(request.data.status){
        if(this.code){
          location.reload();
        }else{
          this.router.navigate([`/tables/notification-type-detail/${request.data.ctiponotificacion}`]);
        }
      }else{
        let condition = request.data.condition;
        if(condition == "notification-type-name-already-exist"){
          this.alert.message = "TABLES.NOTIFICATIONTYPES.NAMEALREADYEXIST";
          this.alert.type = 'danger';
          this.alert.show = true;
        }
      }
      this.loading = false;
      return;
  
  }

}
