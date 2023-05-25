import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { WebServiceConnectionService } from '@services/web-service-connection.service';
import { AuthenticationService } from '@services/authentication.service';

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.css']
})
export class ServiceDetailComponent implements OnInit {

  sub;
  currentUser;
  detail_form: UntypedFormGroup;
  loading: boolean = false;
  loading_cancel: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  serviceTypeList: any[] = [];
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
      ctiposervicio: [''],
      xservicio: [''],
      bactivo: [true]
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if (this.currentUser) {
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 31
      }
      let request = await this.webService.securityVerifyModulePermission(params);
      if (request.error) {
        request.condition && request.conditionMessage == 'user-dont-have-permissions' ? this.router.navigate([`/permission-error`]) : false;
        this.alert.message = request.message;
        this.alert.type = 'danger';
        this.alert.show = true;
        return;
      }
      if (request.data.status) {
        this.canCreate = request.data.bcrear;
        this.canDetail = request.data.bdetalle;
        this.canEdit = request.data.beditar;
        this.canDelete = request.data.beliminar;
        this.initializeDetailModule();
      }
      return;
    }
  }

  async initializeDetailModule(): Promise<void> {
    let params = {
      permissionData: {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 31
      },
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania
    };
    // this.http.post(`${environment.apiUrl}/api/valrep/service-type`, params, options).subscribe((response : any) => {
    let request = await this.webService.mostrarServiceType(params);
    if (request.error) {
      this.alert.message = request.message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading_cancel = false;
      return;
    }
    if (request.data.status) {
      for (let i = 0; i < request.data.list.length; i++) {
        this.serviceTypeList.push({ id: request.data.list[i].ctiposervicio, value: request.data.list[i].xtiposervicio });
      }
      this.serviceTypeList.sort((a, b) => a.value > b.value ? 1 : -1);
    }
    this.sub = this.activatedRoute.paramMap.subscribe(params => {
      this.code = params.get('id');
      if (this.code) {
        if (!this.canDetail) {
          this.router.navigate([`/permission-error`]);
          return;
        }
        this.getServiceData();
        if (this.canEdit) { this.showEditButton = true; }
      } else {
        if (!this.canCreate) {
          this.router.navigate([`/permission-error`]);
          return;
        }
        this.showSaveButton = true;
      }
    });
  }

  async getServiceData() {
    let params = {
      permissionData: {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 31
      },
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania,
      cservicio: this.code
    };
    // this.http.post(`${environment.apiUrl}/api/service/detail`, params, options).subscribe((response: any) => {
    let request = await this.webService.detailService(params);
    if (request.error) {
      this.alert.message = request.message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading_cancel = false;
      return;
    }
    if (request.data.status) {
      this.detail_form.get('ctiposervicio').setValue(request.data.ctiposervicio);
      this.detail_form.get('ctiposervicio').disable();
      this.detail_form.get('xservicio').setValue(request.data.xservicio);
      this.detail_form.get('xservicio').disable();
      this.detail_form.get('bactivo').setValue(request.data.bactivo);
      this.detail_form.get('bactivo').disable();
    }
    this.loading_cancel = false;
    return;
  }

  editService() {
    this.detail_form.get('ctiposervicio').enable();
    this.detail_form.get('xservicio').enable();
    this.detail_form.get('bactivo').enable();
    this.showEditButton = false;
    this.showSaveButton = true;
  }

  cancelSave() {
    if (this.code) {
      this.loading_cancel = true;
      this.showSaveButton = false;
      this.showEditButton = true;
      this.getServiceData();
    } else {
      this.router.navigate([`/tables/service-index`]);
    }
  }

  async onSubmit(form): Promise<void> {
    this.submitted = true;
    this.loading = true;
    if (this.detail_form.invalid) {
      this.loading = false;
      return;
    }
    let params;
    let request;
    if (this.code) {
      params = {
        permissionData: {
          cusuario: this.currentUser.data.cusuario,
          cmodulo: 31
        },
        cservicio: this.code,
        ctiposervicio: form.ctiposervicio,
        xservicio: form.xservicio,
        bactivo: form.bactivo,
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania,
        cusuariomodificacion: this.currentUser.data.cusuario
      };
      // url = `${environment.apiUrl}/api/service/update`;
      request = await this.webService.updateService(params);
    } else {
      params = {
        permissionData: {
          cusuario: this.currentUser.data.cusuario,
          cmodulo: 31
        },
        ctiposervicio: form.ctiposervicio,
        xservicio: form.xservicio,
        bactivo: form.bactivo,
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania,
        cusuariocreacion: this.currentUser.data.cusuario
      };
      // url = `${environment.apiUrl}/api/service/create`;
      request = await this.webService.createService(params);
    }
    if (request.error) {
      this.alert.message = request.message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
      return;
    }
    if (request.data.status) {
      if (this.code) {
        location.reload();
      } else {
        this.router.navigate([`/tables/service-detail/${request.data.cservicio}`]);
      }
    } else {
      let condition = request.data.condition;
      if (condition == "service-name-already-exist") {
        this.alert.message = "TABLES.SERVICES.NAMEALREADYEXIST";
        this.alert.type = 'danger';
        this.alert.show = true;
      }
    }
    this.loading = false;
    return;
  }
}
