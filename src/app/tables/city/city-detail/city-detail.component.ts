import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { WebServiceConnectionService } from '@services/web-service-connection.service';
import { AuthenticationService } from '@services/authentication.service';

@Component({
  selector: 'app-city-detail',
  templateUrl: './city-detail.component.html',
  styleUrls: ['./city-detail.component.css']
})
export class CityDetailComponent implements OnInit {

  sub;
  currentUser;
  detail_form: UntypedFormGroup;
  loading: boolean = false;
  loading_cancel: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  stateList: any[] = [];
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
      cestado: ['', Validators.required],
      xciudad: ['', Validators.required],
      bactivo: [true, Validators.required]
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if (this.currentUser) {
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 11
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
      cpais: this.currentUser.data.cpais,
      cmodulo: 11
    };
    // this.http.post(`${environment.apiUrl}/api/valrep/state`, params, options).subscribe((response : any) => {
    let request = await this.webService.mostrarListaEstados(params);
    if (request.error) {
      this.alert.message = request.message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading_cancel = false;
      return;
    }
    if (request.data.status) {
      for (let i = 0; i < request.data.list.length; i++) {
        this.stateList.push({ id: request.data.list[i].cestado, value: request.data.list[i].xestado });
      }
      this.stateList.sort((a, b) => a.value > b.value ? 1 : -1);
    }
    this.sub = this.activatedRoute.paramMap.subscribe(params => {
      this.code = params.get('id');
      if (this.code) {
        if (!this.canDetail) {
          this.router.navigate([`/permission-error`]);
          return;
        }
        this.getCityData();
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

  async getCityData(): Promise<void> {
    let params = {
      permissionData: {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 11
      },
      cpais: this.currentUser.data.cpais,
      cciudad: this.code
    };
    // this.http.post(`${environment.apiUrl}/api/city/detail`, params, options).subscribe((response: any) => {
    let request = await this.webService.detailCity(params);
    if (request.error) {
      this.alert.message = request.message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading_cancel = false;
      return;
    }
    if (request.data.status) {
      this.detail_form.get('cestado').setValue(request.data.cestado);
      this.detail_form.get('cestado').disable();
      this.detail_form.get('xciudad').setValue(request.data.xciudad);
      this.detail_form.get('xciudad').disable();
      this.detail_form.get('bactivo').setValue(request.data.bactivo);
      this.detail_form.get('bactivo').disable();
    }
    this.loading_cancel = false;
    return;
  }

  editCity() {
    this.detail_form.get('cestado').enable();
    this.detail_form.get('xciudad').enable();
    this.detail_form.get('bactivo').enable();
    this.showEditButton = false;
    this.showSaveButton = true;
  }

  cancelSave() {
    if (this.code) {
      this.loading_cancel = true;
      this.showSaveButton = false;
      this.showEditButton = true;
      this.getCityData();
    } else {
      this.router.navigate([`/tables/city-index`]);
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
          cmodulo: 11
        },
        cciudad: this.code,
        cestado: form.cestado,
        xciudad: form.xciudad,
        bactivo: form.bactivo,
        cpais: this.currentUser.data.cpais,
        cusuariomodificacion: this.currentUser.data.cusuario
      };
      //url = `${environment.apiUrl}/api/city/update`;
      request = await this.webService.updateCity(params);
    } else {
      params = {
        permissionData: {
          cusuario: this.currentUser.data.cusuario,
          cmodulo: 11
        },
        cestado: form.cestado,
        xciudad: form.xciudad,
        bactivo: form.bactivo,
        cpais: this.currentUser.data.cpais,
        cusuariocreacion: this.currentUser.data.cusuario
      };
      // url = `${environment.apiUrl}/api/city/create`;
      request = await this.webService.createCity(params);
    }
    // this.http.post(url, params, options).subscribe((response : any) => {
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
        this.router.navigate([`/tables/city-detail/${request.data.cciudad}`]);
      }
    } else {
      let condition = request.data.condition;
      if (condition == "city-name-already-exist") {
        this.alert.message = "TABLES.CITIES.NAMEALREADYEXIST";
        this.alert.type = 'danger';
        this.alert.show = true;
      }
    }
    this.loading = false;
    return;
  }

}
