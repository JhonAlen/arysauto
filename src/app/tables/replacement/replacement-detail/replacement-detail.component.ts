import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { WebServiceConnectionService } from '@services/web-service-connection.service';
import { AuthenticationService } from '@services/authentication.service';

@Component({
  selector: 'app-replacement-detail',
  templateUrl: './replacement-detail.component.html',
  styleUrls: ['./replacement-detail.component.css']
})
export class ReplacementDetailComponent implements OnInit {

  sub;
  currentUser;
  detail_form: UntypedFormGroup;
  loading: boolean = false;
  loading_cancel: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  replacementTypeList: any[] = [];
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
      ctiporepuesto: [''],
      xrepuesto: [''],
      bizquierda: [false],
      bderecha: [false],
      bsuperior: [false],
      binferior: [false],
      bdelantero: [false],
      btrasero: [false],
      bactivo: [true]
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if (this.currentUser) {
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 30
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

  async initializeDetailModule() {
    let params = {
      permissionData: {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 30
      },
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania
    };
    // this.http.post(`${environment.apiUrl}/api/valrep/replacement-type`, params, options).subscribe((response : any) => {
    let request = await this.webService.MostrarReplamentType(params);
    if (request.error) {
      this.alert.message = request.message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading_cancel = false;
      return;
    }
    if (request.data.status) {
      for (let i = 0; i < request.data.list.length; i++) {
        this.replacementTypeList.push({ id: request.data.list[i].ctiporepuesto, value: request.data.list[i].xtiporepuesto });
      }
      this.replacementTypeList.sort((a, b) => a.value > b.value ? 1 : -1);
    }

    this.sub = this.activatedRoute.paramMap.subscribe(params => {
      this.code = params.get('id');
      if (this.code) {
        if (!this.canDetail) {
          this.router.navigate([`/permission-error`]);
          return;
        }
        this.getReplacementData();
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

  async getReplacementData(): Promise<void> {
    let params = {
      permissionData: {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 30
      },
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania,
      crepuesto: this.code
    };
    // this.http.post(`${environment.apiUrl}/api/replacement/detail`, params, options).subscribe((response: any) => {
    let request = await this.webService.detailReplacement(params);
    if (request.error) {
      this.alert.message = request.message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading_cancel = false;
      return;
    }
    if (request.data.status) {
      this.detail_form.get('ctiporepuesto').setValue(request.data.ctiporepuesto);
      this.detail_form.get('ctiporepuesto').disable();
      this.detail_form.get('xrepuesto').setValue(request.data.xrepuesto);
      this.detail_form.get('xrepuesto').disable();
      this.detail_form.get('bizquierda').setValue(request.data.bizquierda);
      this.detail_form.get('bizquierda').disable();
      this.detail_form.get('bderecha').setValue(request.data.bderecha);
      this.detail_form.get('bderecha').disable();
      this.detail_form.get('bsuperior').setValue(request.data.bsuperior);
      this.detail_form.get('bsuperior').disable();
      this.detail_form.get('binferior').setValue(request.data.binferior);
      this.detail_form.get('binferior').disable();
      this.detail_form.get('bdelantero').setValue(request.data.bdelantero);
      this.detail_form.get('bdelantero').disable();
      this.detail_form.get('btrasero').setValue(request.data.btrasero);
      this.detail_form.get('btrasero').disable();
      this.detail_form.get('bactivo').setValue(request.data.bactivo);
      this.detail_form.get('bactivo').disable();
    }
    this.loading_cancel = false;
    return;
  }

  editReplacement() {
    this.detail_form.get('ctiporepuesto').enable();
    this.detail_form.get('xrepuesto').enable();
    this.detail_form.get('bizquierda').enable();
    this.detail_form.get('bderecha').enable();
    this.detail_form.get('bsuperior').enable();
    this.detail_form.get('binferior').enable();
    this.detail_form.get('bdelantero').enable();
    this.detail_form.get('btrasero').enable();
    this.detail_form.get('bactivo').enable();
    this.showEditButton = false;
    this.showSaveButton = true;
  }

  cancelSave() {
    if (this.code) {
      this.loading_cancel = true;
      this.showSaveButton = false;
      this.showEditButton = true;
      this.getReplacementData();
    } else {
      this.router.navigate([`/tables/replacement-index`]);
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
          cmodulo: 30
        },
        crepuesto: this.code,
        ctiporepuesto: form.ctiporepuesto,
        xrepuesto: form.xrepuesto,
        bizquierda: form.bizquierda,
        bderecha: form.bderecha,
        bsuperior: form.bsuperior,
        binferior: form.binferior,
        bdelantero: form.bdelantero,
        btrasero: form.btrasero,
        bactivo: form.bactivo,
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania,
        cusuariomodificacion: this.currentUser.data.cusuario
      };
      // url = `${environment.apiUrl}/api/replacement/update`;
      request = await this.webService.updateReplament(params);
    } else {
      params = {
        permissionData: {
          cusuario: this.currentUser.data.cusuario,
          cmodulo: 30
        },
        ctiporepuesto: form.ctiporepuesto,
        xrepuesto: form.xrepuesto,
        bizquierda: form.bizquierda,
        bderecha: form.bderecha,
        bsuperior: form.bsuperior,
        binferior: form.binferior,
        bdelantero: form.bdelantero,
        btrasero: form.btrasero,
        bactivo: form.bactivo,
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania,
        cusuariocreacion: this.currentUser.data.cusuario
      };
      // url = `${environment.apiUrl}/api/replacement/create`;
      request = await this.webService.createReplacemnt(params);
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
        this.router.navigate([`/tables/replacement-detail/${request.data.crepuesto}`]);
      }
    } else {
      let condition = request.data.condition;
      if (condition == "replacement-name-already-exist") {
        this.alert.message = "TABLES.SPAREPARTS.NAMEALREADYEXIST";
        this.alert.type = 'danger';
        this.alert.show = true;
      }
    }
    this.loading = false;
    return;
  }

}
