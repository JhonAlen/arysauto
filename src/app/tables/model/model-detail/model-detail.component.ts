import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { WebServiceConnectionService } from '@services/web-service-connection.service';
import { AuthenticationService } from '@services/authentication.service';

@Component({
  selector: 'app-model-detail',
  templateUrl: './model-detail.component.html',
  styleUrls: ['./model-detail.component.css']
})
export class ModelDetailComponent implements OnInit {

  sub;
  currentUser;
  detail_form: UntypedFormGroup;
  loading: boolean = false;
  loading_cancel: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  brandList: any[] = [];
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
      cmarca: [''],
      // casociado: ['', Validators.required],
      xmodelo: [''],
      bactivo: [true]
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if (this.currentUser) {
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 25
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
        cmodulo: 25
      },
      cpais: this.currentUser.data.cpais
    };
    //  this.http.post(`${environment.apiUrl}/api/valrep/brand`, params, options).subscribe((response : any) => {
    let request = await this.webService.mostrarModel(params);
    if (request.error) {
      request.condition && request.conditionMessage == 'user-dont-have-permissions' ? this.router.navigate([`/permission-error`]) : false;
      this.alert.message = request.message;
      this.alert.type = 'danger';
      this.alert.show = true;
      return;
    }
    if (request.data.status) {
      for (let i = 0; i < request.data.list.length; i++) {
        this.brandList.push({ id: request.data.list[i].cmarca, value: request.data.list[i].xmarca });
      }
      this.brandList.sort((a, b) => a.value > b.value ? 1 : -1);
    }

    this.sub = this.activatedRoute.paramMap.subscribe(params => {
      this.code = params.get('id');
      if (this.code) {
        if (!this.canDetail) {
          this.router.navigate([`/permission-error`]);
          return;
        }
        this.getModelData();
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

  async getModelData(): Promise<void> {
    // let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    // let options = { headers: headers };
    let params = {
      permissionData: {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 25
      },
      cpais: this.currentUser.data.cpais,
      cmodelo: this.code
    };
    // this.http.post(`${environment.apiUrl}/api/model/detail`, params, options).subscribe((response: any) => {
    let request = await this.webService.detailModel(params);
    if (request.error) {
      this.alert.message = request.message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading_cancel = false;
      return;
    }
    if (request.data.status) {
      // this.detail_form.get('casociado').setValue(request.data.casociado);
      // this.detail_form.get('casociado').disable();
      this.detail_form.get('cmarca').setValue(request.data.cmarca);
      this.detail_form.get('cmarca').disable();
      this.detail_form.get('xmodelo').setValue(request.data.xmodelo);
      this.detail_form.get('xmodelo').disable();
      this.detail_form.get('bactivo').setValue(request.data.bactivo);
      this.detail_form.get('bactivo').disable();
    }
    this.loading_cancel = false;
    return;
  }

  editModel() {
   // this.detail_form.get('cmarca').enable();
    // this.detail_form.get('casociado').enable();
    this.detail_form.get('xmodelo').enable();
    this.detail_form.get('bactivo').enable();
    this.showEditButton = false;
    this.showSaveButton = true;
  }

  cancelSave() {
    if (this.code) {
      this.loading_cancel = true;
      this.showSaveButton = false;
      this.showEditButton = true;
      this.getModelData();
    } else {
      this.router.navigate([`/tables/model-index`]);
    }
  }

  async onSubmit(form): Promise<void> {
    console.log(this.detail_form.value, this.code)
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
          cmodulo: 25
        },
        cmodelo: this.code,
        cmarca: this.detail_form.get('cmarca').value,
        // casociado: form.casociado,
        xmodelo: form.xmodelo,
        bactivo: form.bactivo,
        cpais: this.currentUser.data.cpais,
        cusuariomodificacion: this.currentUser.data.cusuario
      };
      //url = `${environment.apiUrl}/api/model/update`;
      request = await this.webService.updateModel(params);
    } else {
      params = {
        permissionData: {
          cusuario: this.currentUser.data.cusuario,
          cmodulo: 25
        },
        cmarca: form.cmarca,
        //casociado: form.casociado,
        xmodelo: form.xmodelo,
        bactivo: form.bactivo,
        cpais: this.currentUser.data.cpais,
        cusuariocreacion: this.currentUser.data.cusuario
      };
      // url = `${environment.apiUrl}/api/model/create`;
      request = await this.webService.createModel(params);
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
        this.router.navigate([`/tables/model-detail/${request.data.cmodelo}`]);
      }
    } else {
      let condition = request.data.condition;
      if (condition == "model-name-already-exist") {
        this.alert.message = "TABLES.MODELS.NAMEALREADYEXIST";
        this.alert.type = 'danger';
        this.alert.show = true;
      }
    }
    this.loading = false;
    return;
  }

}
