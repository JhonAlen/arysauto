import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { WebServiceConnectionService } from '@services/web-service-connection.service';
import { AuthenticationService } from '@services/authentication.service';

@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.css']
})
export class CompanyDetailComponent implements OnInit {

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
      xcompania: [''],
      xcolornav: [''],
      xtemanav: [''],
      xcolorprimario: [''],
      xcolorsegundario: [''],
      xcolorterciario: [''],
      xcolortexto: [''],
      bactivo: [true]
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if (this.currentUser) {
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 14
      }
      //   this.http.post(`${environment.apiUrl}/api/security/verify-module-permission`, params, options).subscribe((response : any) => {
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

  initializeDetailModule() {
    this.sub = this.activatedRoute.paramMap.subscribe(params => {
      this.code = params.get('id');
      if (this.code) {
        if (!this.canDetail) {
          this.router.navigate([`/permission-error`]);
          return;
        }
        this.getCompanyData();
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

  async getCompanyData(): Promise<void> {
    //let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
   // let options = { headers: headers };
    let params = {
      permissionData: {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 14
      },
      ccompania: this.code
    };
    //this.http.post(`${environment.apiUrl}/api/company/detail`, params, options).subscribe((response: any) => {
    let request = await this.webService.detailCompany(params);
    if (request.error) {
      this.alert.message = request.message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading_cancel = false;
      return;
    }
    if (request.data.status) {
      this.detail_form.get('xcompania').setValue(request.data.xcompania);
      this.detail_form.get('xcompania').disable();
      this.detail_form.get('xcolornav').setValue(request.data.xcolornav);
      this.detail_form.get('xcolornav').disable();
      this.detail_form.get('xtemanav').setValue(request.data.xtemanav);
      this.detail_form.get('xtemanav').disable();
      this.detail_form.get('xcolorprimario').setValue(request.data.xcolorprimario);
      this.detail_form.get('xcolorprimario').disable();
      this.detail_form.get('xcolorsegundario').setValue(request.data.xcolorsegundario);
      this.detail_form.get('xcolorsegundario').disable();
      this.detail_form.get('xcolorterciario').setValue(request.data.xcolorterciario);
      this.detail_form.get('xcolorterciario').disable();
      this.detail_form.get('xcolortexto').setValue(request.data.xcolortexto);
      this.detail_form.get('xcolortexto').disable();
      this.detail_form.get('bactivo').setValue(request.data.bactivo);
      this.detail_form.get('bactivo').disable();
    }
    this.loading_cancel = false;
    return;
  }

  editCompany() {
    this.detail_form.get('xcompania').enable();
    this.detail_form.get('xcolornav').enable();
    this.detail_form.get('xtemanav').enable();
    this.detail_form.get('xcolorprimario').enable();
    this.detail_form.get('xcolorsegundario').enable();
    this.detail_form.get('xcolorterciario').enable();
    this.detail_form.get('xcolortexto').enable();
    this.detail_form.get('bactivo').enable();
    this.showEditButton = false;
    this.showSaveButton = true;
  }

  cancelSave() {
    if (this.code) {
      this.loading_cancel = true;
      this.showSaveButton = false;
      this.showEditButton = true;
      this.getCompanyData();
    } else {
      this.router.navigate([`/tables/company-index`]);
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
          cmodulo: 14
        },
        ccompania: this.code,
        xcompania: form.xcompania,
        xcolornav: form.xcolornav,
        xtemanav: form.xtemanav,
        xcolorprimario: form.xcolorprimario,
        xcolorsegundario: form.xcolorsegundario,
        xcolorterciario: form.xcolorterciario,
        xcolortexto: form.xcolortexto,
        bactivo: form.bactivo,
        cusuariomodificacion: this.currentUser.data.cusuario
      };
      // url = `${environment.apiUrl}/api/company/update`;
      request = await this.webService.updateCompany(params);
    } else {
      params = {
        permissionData: {
          cusuario: this.currentUser.data.cusuario,
          cmodulo: 14
        },
        xcompania: form.xcompania,
        xcolornav: form.xcolornav,
        xtemanav: form.xtemanav,
        xcolorprimario: form.xcolorprimario,
        xcolorsegundario: form.xcolorsegundario,
        xcolorterciario: form.xcolorterciario,
        xcolortexto: form.xcolortexto,
        bactivo: form.bactivo,
        cusuariocreacion: this.currentUser.data.cusuario
      };
      // url = `${environment.apiUrl}/api/company/create`;
      request = await this.webService.createCompany(params);
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
        this.router.navigate([`/tables/company-detail/${request.data.ccompania}`]);
      }
    } else {
      let condition = request.data.condition;
      if (condition == "company-name-already-exist") {
        this.alert.message = "TABLES.COMPANIES.NAMEALREADYEXIST";
        this.alert.type = 'danger';
        this.alert.show = true;
      }
    }
    this.loading = false;
    return;

  }

}
