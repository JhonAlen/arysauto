import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { WebServiceConnectionService } from '@services/web-service-connection.service';
import { AuthenticationService } from '@services/authentication.service';

@Component({
  selector: 'app-services-insurers-detail',
  templateUrl: './services-insurers-detail.component.html',
  styleUrls: ['./services-insurers-detail.component.css']
})
export class ServicesInsurersDetailComponent implements OnInit {

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
    private http: HttpClient,
    private webService: WebServiceConnectionService) { }

  async ngOnInit(): Promise<void> {
    this.detail_form = this.formBuilder.group({
      xservicio: ['', Validators.required],
      ctiposervicio: ['', Validators.required],
      bactivo: [true, Validators.required]
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
        let params = {
          permissionData: {
            cusuario: this.currentUser.data.cusuario,
            cmodulo: 31
          },
          cpais: this.currentUser.data.cpais,
          ccompania: this.currentUser.data.ccompania,
        }
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let options = { headers: headers };
        this.http.post(`${environment.apiUrl}/api/valrep/service-type`, params, options).subscribe((response : any) => {
          if(response.data.status){
            this.serviceTypeList = [];
            for (let i = 0; i < response.data.list.length; i++) {
              this.serviceTypeList.push({ id: response.data.list[i].ctiposervicio, value: response.data.list[i].xtiposervicio });
            }
          }
        },
        (err) => {
          let code = err.error.data.code;
          let message;
          if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
          else if(code == 404){ message = "HTTP.ERROR.VALREP.CHARGENOTFOUND"; }
          else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
          this.alert.message = message;
          this.alert.type = 'danger';
          this.alert.show = true;
        });
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
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    this.http.post(`${environment.apiUrl}/api/services-insurers/detail`, params, options).subscribe((response: any) => {
    if (response.error) {
      this.alert.message = response.message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading_cancel = false;
      return;
    }
    if (response.data.status) {
      this.detail_form.get('xservicio').setValue(response.data.xservicio);
      this.detail_form.get('xservicio').disable();
      this.detail_form.get('ctiposervicio').setValue(response.data.ctiposervicio);
      this.detail_form.get('ctiposervicio').disable();
      this.detail_form.get('bactivo').setValue(response.data.bactivo);
      this.detail_form.get('bactivo').disable();
    }
  },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.CHARGENOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
    this.loading_cancel = false;
    return;
  }

  editService() {
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
      this.router.navigate([`/tables/services-insurers-index`]);
    }
  }

  async onSubmit(form): Promise<void> {
    this.submitted = true;
    this.loading = true;
    if (this.detail_form.invalid) {
      this.loading = false;
      return;
    }
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params;
    let request;
    if (this.code) {
      params = {
        permissionData: {
          cusuario: this.currentUser.data.cusuario,
          cmodulo: 31
        },
        cservicio: this.code,
        xservicio: form.xservicio,
        bactivo: form.bactivo,
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania,
        cusuariomodificacion: this.currentUser.data.cusuario
      };
      this.http.post(`${environment.apiUrl}/api/services-insurers/update`, params, options).subscribe((response: any) => {
        if(response.data.status){

        }
      }, (err) => {});
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
        this.router.navigate([`/tables/services-insurers-detail/${request.data.cservicio}`]);
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
