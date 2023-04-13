import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientBankComponent } from '@app/pop-up/client-bank/client-bank.component';
import { ClientAssociateComponent } from '@app/pop-up/client-associate/client-associate.component';
import { ClientBondComponent } from '@app/pop-up/client-bond/client-bond.component';
import { ClientContactComponent } from '@app/pop-up/client-contact/client-contact.component';
import { ClientBrokerComponent } from '@app/pop-up/client-broker/client-broker.component';
import { ClientDepreciationComponent } from '@app/pop-up/client-depreciation/client-depreciation.component';
import { ClientRelationshipComponent } from '@app/pop-up/client-relationship/client-relationship.component';
import { ClientPenaltyComponent } from '@app/pop-up/client-penalty/client-penalty.component';
import { ClientExcludedProviderComponent } from '@app/pop-up/client-excluded-provider/client-excluded-provider.component';
import { ClientExcludedModelComponent } from '@app/pop-up/client-excluded-model/client-excluded-model.component';
import { ClientWorkerComponent } from '@app/pop-up/client-worker/client-worker.component';
import { ClientDocumentComponent } from '@app/pop-up/client-document/client-document.component';
import { ClientGrouperComponent } from '@app/pop-up/client-grouper/client-grouper.component';
import { ClientPlanComponent } from '@app/pop-up/client-plan/client-plan.component';
import { WebServiceConnectionService } from '@services/web-service-connection.service';
import { AuthenticationService } from '@services/authentication.service';
import { environment } from '@environments/environment';
import { ProviderBankComponent } from '@app/pop-up/provider-bank/provider-bank.component';
import { ProviderStateComponent } from '@app/pop-up/provider-state/provider-state.component';
import { ProviderBrandComponent } from '@app/pop-up/provider-brand/provider-brand.component';
import { ProviderServiceComponent } from '@app/pop-up/provider-service/provider-service.component';
import { ProviderContactComponent } from '@app/pop-up/provider-contact/provider-contact.component';

@Component({
  selector: 'app-provider-detail',
  templateUrl: './provider-detail.component.html',
  styleUrls: ['./provider-detail.component.css']
})
export class ProviderDetailComponent implements OnInit {

  private bankGridApi;
  private brandGridApi;
  private stateGridApi;
  private contactGridApi;
  private serviceGridApi;
  sub;
  currentUser;
  detail_form: UntypedFormGroup;
  loading: boolean = false;
  loading_cancel: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  businessActivityList: any[] = [];
  documentTypeList: any[] = [];
  stateList: any[] = [];
  cityList: any[] = [];
  bankList: any[] = [];
  brandList: any[] = [];
  stateProviderList: any[] = [];
  contactList: any[] = [];
  serviceList: any[] = [];
  canCreate: boolean = false;
  canDetail: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;
  code;
  showSaveButton: boolean = false;
  showEditButton: boolean = false;
  editStatus: boolean = false;
  bankDeletedRowList: any[] = [];
  stateDeletedRowList: any[] = [];
  brandDeletedRowList: any[] = [];
  serviceDeletedRowList: any[] = [];
  contactDeletedRowList: any[] = [];

  constructor(private formBuilder: UntypedFormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private webService: WebServiceConnectionService) { }

  async ngOnInit(): Promise<void> {
    this.detail_form = this.formBuilder.group({
      xnombre: [''],
      xrazonsocial: [''],
      xdocidentidad: [''],
      xtelefono: [''],
      xcorreo: ['', Validators.compose([
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])],
      pislr: [''],
      pretencion: [''],
      xdireccion: [''],
      xobservacion: [''],
      centeimpuesto: [''],
      nlimite: [''],
      cestado: [''],
      cciudad: [''],
      bactivo: [true]
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if (this.currentUser) {
      // let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      // let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 57
      }
      //  this.http.post(`${environment.apiUrl}/api/security/verify-module-permission`, params, options).subscribe((response : any) => {
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
    }
  }

  async initializeDetailModule() {
    let stateParams = { cpais: this.currentUser.data.cpais };
    let stateRequest = await this.webService.valrepState(stateParams);
    // this.http.post(`${environment.apiUrl}/api/valrep/state`, params, options).subscribe((response : any) => {
    if (stateRequest.error) {
      this.alert.message = stateRequest.message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
      return;
    }
    if (stateRequest.data.status) {
      for (let i = 0; i < stateRequest.data.list.length; i++) {
        this.stateList.push({ id: stateRequest.data.list[i].cestado, value: stateRequest.data.list[i].xestado });
      }
      this.stateList.sort((a, b) => a.value > b.value ? 1 : -1);
    }
    //let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    //let options = { headers: headers };
    let businessActivityParams = { cpais: this.currentUser.data.cpais };
    //this.http.post(`${environment.apiUrl}/api/valrep/business-activity`, params, options).subscribe((response : any) => {
    let businessActivityRequest = await this.webService.valrepBusinessActivity(businessActivityParams);
    if (businessActivityRequest.error) {
      this.alert.message = stateRequest.message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
      return;
    }
    if (businessActivityRequest.data.status) {
      for (let i = 0; i < businessActivityRequest.data.list.length; i++) {
        this.businessActivityList.push({ id: businessActivityRequest.data.list[i].cactividadempresa, value: businessActivityRequest.data.list[i].xactividadempresa });
      }
      this.businessActivityList.sort((a, b) => a.value > b.value ? 1 : -1);
    }
    let documentTypeParams = { cpais: this.currentUser.data.cpais };
    //this.http.post(`${environment.apiUrl}/api/valrep/document-type`, params, options).subscribe((response : any) => {
    let documentTypeRequest = await this.webService.valrepDocumentType(documentTypeParams);
    if (documentTypeRequest.error) {
      this.alert.message = documentTypeRequest.message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
      return;
    }
    if (documentTypeRequest.data.status) {
      for (let i = 0; i < documentTypeRequest.data.list.length; i++) {
        this.documentTypeList.push({ id: documentTypeRequest.data.list[i].ctipodocidentidad, value: documentTypeRequest.data.list[i].xtipodocidentidad });
      }
      this.documentTypeList.sort((a, b) => a.value > b.value ? 1 : -1);
    }




    this.sub = this.activatedRoute.paramMap.subscribe(params => {
      this.code = params.get('id');
      if (this.code) {
        if (!this.canDetail) {
          this.router.navigate([`/permission-error`]);
          return;
        }
        this.getProviderData();
        if (this.canEdit) { this.showEditButton = true; }
      } else {
        if (!this.canCreate) {
          this.router.navigate([`/permission-error`]);
          return;
        }
        this.editStatus = true;
        this.showSaveButton = true;
      }
    });
  }

  async getProviderData() {
    //  let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    //  let options = { headers: headers };
    let params = {
      permissionData: {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 57
      },
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania,
      cproveedor: this.code
    };
    //  this.http.post(`${environment.apiUrl}/api/v2/provider/production/detail`, params, options).subscribe((response: any) => {
    let request = await this.webService.detailProvider(params);
    if (request.error) {
      this.alert.message = request.message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
      return;
    }
    if (request.data.status) {
      this.detail_form.get('xnombre').setValue(request.data.xnombre);
      this.detail_form.get('xnombre').disable();
      this.detail_form.get('xrazonsocial').setValue(request.data.xrazonsocial);
      this.detail_form.get('xrazonsocial').disable();
      this.detail_form.get('xdocidentidad').setValue(request.data.xdocidentidad);
      this.detail_form.get('xdocidentidad').disable();
      this.detail_form.get('xtelefono').setValue(request.data.xtelefono);
      this.detail_form.get('xtelefono').disable();
      request.data.xcorreo ? this.detail_form.get('xcorreo').setValue(request.data.xcorreo) : false;
      this.detail_form.get('xcorreo').disable();
      request.data.pretencion ? this.detail_form.get('pretencion').setValue(request.data.pretencion) : false;
      this.detail_form.get('pretencion').disable();
      request.data.pislr ? this.detail_form.get('pislr').setValue(request.data.pislr) : false;
      this.detail_form.get('pislr').disable();
      this.detail_form.get('xdireccion').setValue(request.data.xdireccion);
      this.detail_form.get('xdireccion').disable();
      this.detail_form.get('xobservacion').setValue(request.data.xobservacion);
      this.detail_form.get('xobservacion').disable();
      this.detail_form.get('centeimpuesto').setValue(request.data.centeimpuesto);
      this.detail_form.get('centeimpuesto').disable();
      this.detail_form.get('nlimite').setValue(request.data.nlimite);
      this.detail_form.get('nlimite').disable();
      this.detail_form.get('cestado').setValue(request.data.cestado);
      this.detail_form.get('cestado').disable();
      this.cityDropdownDataRequest();
      this.detail_form.get('cciudad').setValue(request.data.cciudad);
      this.detail_form.get('cciudad').disable();
      this.detail_form.get('bactivo').setValue(request.data.bactivo);
      this.detail_form.get('bactivo').disable();
      this.bankList = [];
      if (request.data.banks) {
        for (let i = 0; i < request.data.banks.length; i++) {
          this.bankList.push({
            cgrid: i,
            create: false,
            cbanco: request.data.banks[i].cbanco,
            xbanco: request.data.banks[i].xbanco,
            ctipocuentabancaria: request.data.banks[i].ctipocuentabancaria,
            xtipocuentabancaria: request.data.banks[i].xtipocuentabancaria,
            xnumerocuenta: request.data.banks[i].xnumerocuenta,
            bprincipal: request.data.banks[i].bprincipal,
            xprincipal: request.data.banks[i].bprincipal ? this.translate.instant("DROPDOWN.YES") : this.translate.instant("DROPDOWN.NO")
          });
        }
      }
      this.stateProviderList = [];
      if (request.data.states) {
        for (let i = 0; i < request.data.states.length; i++) {
          this.stateProviderList.push({
            cgrid: i,
            create: false,
            cestado: request.data.states[i].cestado,
            xestado: request.data.states[i].xestado,
            xpais: request.data.states[i].xpais
          });
        }
      }
      this.brandList = [];
      if (request.data.brands) {
        for (let i = 0; i < request.data.brands.length; i++) {
          this.brandList.push({
            cgrid: i,
            create: false,
            cmarca: request.data.brands[i].cmarca,
            xmarca: request.data.brands[i].xmarca
          });
        }
      }
      this.serviceList = [];
      if (request.data.services) {
        for (let i = 0; i < request.data.services.length; i++) {
          this.serviceList.push({
            cgrid: i,
            create: false,
            cservicio: request.data.services[i].cservicio,
            xservicio: request.data.services[i].xservicio,
            xtiposervicio: request.data.services[i].xtiposervicio
          });
        }
      }
      this.contactList = [];
      if (request.data.contacts) {
        for (let i = 0; i < request.data.contacts.length; i++) {
          this.contactList.push({
            cgrid: i,
            create: false,
            ccontacto: request.data.contacts[i].ccontacto,
            xnombre: request.data.contacts[i].xnombre,
            xapellido: request.data.contacts[i].xapellido,
            ctipodocidentidad: request.data.contacts[i].ctipodocidentidad,
            xdocidentidad: request.data.contacts[i].xdocidentidad,
            xtelefonocelular: request.data.contacts[i].xtelefonocelular,
            xemail: request.data.contacts[i].xemail,
            xcargo: request.data.contacts[i].xcargo ? request.data.contacts[i].xcargo : undefined,
            xtelefonooficina: request.data.contacts[i].xtelefonooficina ? request.data.contacts[i].xtelefonooficina : undefined,
            xtelefonocasa: request.data.contacts[i].xtelefonocasa ? request.data.contacts[i].xtelefonocasa : undefined,
            xfax: request.data.contacts[i].xfax ? request.data.contacts[i].xfax : undefined,
          });
        }
      }
    }
    this.loading_cancel = false;
  }


  async cityDropdownDataRequest() {
    if (this.detail_form.get('cestado').value) {
      let params = { cpais: this.currentUser.data.cpais, cestado: this.detail_form.get('cestado').value };
      // this.http.post(`${environment.apiUrl}/api/valrep/city`, params, options).subscribe((response : any) => {
      let request = await this.webService.valrepCity(params);
      if (request.error) {
        this.alert.message = request.message;
        this.alert.type = 'danger';
        this.alert.show = true;
        this.loading = false;
        return;
      }
      if (request.data.status) {
        this.cityList = [];
        for (let i = 0; i < request.data.list.length; i++) {
          this.cityList.push({ id: request.data.list[i].cciudad, value: request.data.list[i].xciudad });
        }
        this.cityList.sort((a, b) => a.value > b.value ? 1 : -1);
      }
    }
  }

  editProvider() {
    this.detail_form.get('xnombre').enable();
    this.detail_form.get('xrazonsocial').enable();
    this.detail_form.get('xdocidentidad').enable();
    this.detail_form.get('xtelefono').enable();
    this.detail_form.get('xcorreo').enable();
    this.detail_form.get('pretencion').enable();
    this.detail_form.get('pislr').enable();
    this.detail_form.get('xdireccion').enable();
    this.detail_form.get('xobservacion').enable();
    this.detail_form.get('centeimpuesto').enable();
    this.detail_form.get('nlimite').enable();
    this.detail_form.get('cestado').enable();
    this.detail_form.get('cciudad').enable();
    this.detail_form.get('bactivo').enable();
    this.showEditButton = false;
    this.showSaveButton = true;
    this.editStatus = true;
  }

  cancelSave() {
    if (this.code) {
      this.loading_cancel = true;
      this.showSaveButton = false;
      this.showEditButton = true;
      this.editStatus = false;
      this.getProviderData();
    } else {
      this.router.navigate([`/providers/provider-index`]);
    }
  }

  addBank() {
    let bank = { type: 3 };
    const modalRef = this.modalService.open(ProviderBankComponent);
    modalRef.componentInstance.bank = bank;
    modalRef.result.then((result: any) => {
      if (result) {
        if (result.type == 3) {
          this.bankList.push({
            cgrid: this.bankList.length,
            create: true,
            cbanco: result.cbanco,
            xbanco: result.xbanco,
            ctipocuentabancaria: result.ctipocuentabancaria,
            xtipocuentabancaria: result.xtipocuentabancaria,
            xnumerocuenta: result.xnumerocuenta,
            bprincipal: result.bprincipal,
            xprincipal: result.bprincipal ? this.translate.instant("DROPDOWN.YES") : this.translate.instant("DROPDOWN.NO")
          });
          this.bankGridApi.setRowData(this.bankList);
        }
      }
    });
  }

  addState() {
    let state = { type: 3 };
    const modalRef = this.modalService.open(ProviderStateComponent);
    modalRef.componentInstance.state = state;
    modalRef.result.then((result: any) => {
      if (result) {
        if (result.type == 3) {
          this.stateProviderList.push({
            cgrid: this.stateProviderList.length,
            create: true,
            cestado: result.cestado,
            xestado: result.xestado
          });
          this.stateGridApi.setRowData(this.stateProviderList);
        }
      }
    });
  }

  addBrand() {
    let brand = { type: 3 };
    const modalRef = this.modalService.open(ProviderBrandComponent);
    modalRef.componentInstance.brand = brand;
    modalRef.result.then((result: any) => {
      if (result) {
        if (result.type == 3) {
          this.brandList.push({
            cgrid: this.brandList.length,
            create: true,
            cmarca: result.cmarca,
            xmarca: result.xmarca
          });
          this.brandGridApi.setRowData(this.brandList);
        }
      }
    });
  }

  async addAllBrands() {
    // let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    // let options = { headers: headers };
    let params = {
      permissionData: {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 57
      },
      cpais: this.currentUser.data.cpais
    };
    // this.http.post(`${environment.apiUrl}/api/valrep/brand`, params, options).subscribe((response : any) => {
    let request = await this.webService.mostrarModel(params);
    if (request.error) {
      this.alert.message = request.message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
      return;
    }
    if (request.data.status) {
      for (let i = 0; i < request.data.list.length; i++) {
        if (this.brandList.filter((row) => { return row.cmarca == request.data.list[i].cmarca; }).length == 0) {
          this.brandList.push({
            cgrid: this.brandList.length,
            create: true,
            cmarca: request.data.list[i].cmarca,
            xmarca: request.data.list[i].xmarca
          });
        }
      }
    }
    this.brandGridApi.setRowData(this.brandList);
  }



  addService() {
    let service = { type: 3 };
    const modalRef = this.modalService.open(ProviderServiceComponent);
    modalRef.componentInstance.service = service;
    modalRef.result.then((result: any) => {
      if (result) {
        if (result.type == 3) {
          this.serviceList.push({
            cgrid: this.serviceList.length,
            create: true,
            cservicio: result.cservicio,
            xservicio: result.xservicio,
            cestado: this.detail_form.get('cestado').value
          });
          this.serviceGridApi.setRowData(this.serviceList);
        }
      }
    });
  }

  addContact() {
    let contact = { type: 3 };
    const modalRef = this.modalService.open(ProviderContactComponent);
    modalRef.componentInstance.contact = contact;
    modalRef.result.then((result: any) => {
      if (result) {
        if (result.type == 3) {
          this.contactList.push({
            cgrid: this.contactList.length,
            create: true,
            xnombre: result.xnombre,
            xapellido: result.xapellido,
            ctipodocidentidad: result.ctipodocidentidad,
            xdocidentidad: result.xdocidentidad,
            xtelefonocelular: result.xtelefonocelular,
            xemail: result.xemail,
            xcargo: result.xcargo,
            xfax: result.xfax,
            xtelefonooficina: result.xtelefonooficina,
            xtelefonocasa: result.xtelefonocasa
          });
          this.contactGridApi.setRowData(this.contactList);
        }
      }
    });
  }

  bankRowClicked(event: any) {
    let bank = {};
    if (this.editStatus) {
      bank = {
        type: 1,
        create: event.data.create,
        cgrid: event.data.cgrid,
        cbanco: event.data.cbanco,
        ctipocuentabancaria: event.data.ctipocuentabancaria,
        xnumerocuenta: event.data.xnumerocuenta,
        bprincipal: event.data.bprincipal,
        delete: false
      };
    } else {
      bank = {
        type: 2,
        create: event.data.create,
        cgrid: event.data.cgrid,
        cbanco: event.data.cbanco,
        ctipocuentabancaria: event.data.ctipocuentabancaria,
        xnumerocuenta: event.data.xnumerocuenta,
        bprincipal: event.data.bprincipal,
        delete: false
      };
    }
    const modalRef = this.modalService.open(ProviderBankComponent);
    modalRef.componentInstance.bank = bank;
    modalRef.result.then((result: any) => {
      if (result) {
        if (result.type == 1) {
          for (let i = 0; i < this.bankList.length; i++) {
            if (this.bankList[i].cgrid == result.cgrid) {
              this.bankList[i].cbanco = result.cbanco;
              this.bankList[i].xbanco = result.xbanco;
              this.bankList[i].ctipocuentabancaria = result.ctipocuentabancaria;
              this.bankList[i].xnumerocuenta = result.xnumerocuenta;
              this.bankList[i].bprincipal = result.bprincipal;
              this.bankList[i].xprincipal = result.bprincipal ? this.translate.instant("DROPDOWN.YES") : this.translate.instant("DROPDOWN.NO");
              this.bankGridApi.refreshCells();
              return;
            }
          }
        } else if (result.type == 4) {
          if (result.delete) {
            this.bankDeletedRowList.push({ cbanco: result.cbanco });
          }
          this.bankList = this.bankList.filter((row) => { return row.cgrid != result.cgrid });
          for (let i = 0; i < this.bankList.length; i++) {
            this.bankList[i].cgrid = i;
          }
          this.bankGridApi.setRowData(this.bankList);
        }
      }
    });
  }

  stateRowClicked(event: any) {
    let state = {};
    if (this.editStatus) {
      state = {
        type: 1,
        create: event.data.create,
        cgrid: event.data.cgrid,
        cestado: event.data.cestado,
        delete: false
      };
      const modalRef = this.modalService.open(ProviderStateComponent);
      modalRef.componentInstance.state = state;
      modalRef.result.then((result: any) => {
        if (result) {
          if (result.type == 1) {
            for (let i = 0; i < this.stateProviderList.length; i++) {
              if (this.stateProviderList[i].cgrid == result.cgrid) {
                this.stateProviderList[i].cestado = result.cestado;
                this.stateProviderList[i].xestado = result.xestado;
                this.stateGridApi.refreshCells();
                return;
              }
            }
          } else if (result.type == 4) {
            if (result.delete) {
              this.stateDeletedRowList.push({ cestado: result.cestado });
            }
            this.stateProviderList = this.stateProviderList.filter((row) => { return row.cgrid != result.cgrid });
            for (let i = 0; i < this.stateProviderList.length; i++) {
              this.stateProviderList[i].cgrid = i;
            }
            this.stateGridApi.setRowData(this.stateProviderList);
          }
        }
      });
    }
  }

  brandRowClicked(event: any) {
    let brand = {};
    if (this.editStatus) {
      brand = {
        type: 1,
        create: event.data.create,
        cgrid: event.data.cgrid,
        cmarca: event.data.cmarca,
        delete: false
      };
    } else {
      brand = {
        type: 2,
        create: event.data.create,
        cgrid: event.data.cgrid,
        cmarca: event.data.cmarca,
        delete: false
      };
    }
    const modalRef = this.modalService.open(ProviderBrandComponent);
    modalRef.componentInstance.brand = brand;
    modalRef.result.then((result: any) => {
      if (result) {
        if (result.type == 1) {
          for (let i = 0; i < this.brandList.length; i++) {
            if (this.brandList[i].cgrid == result.cgrid) {
              this.brandList[i].cmarca = result.cmarca;
              this.brandList[i].xmarca = result.xmarca;
              this.brandGridApi.refreshCells();
              return;
            }
          }
        } else if (result.type == 4) {
          if (result.delete) {
            this.brandDeletedRowList.push({ cmarca: result.cmarca });
          }
          this.brandList = this.brandList.filter((row) => { return row.cgrid != result.cgrid });
          for (let i = 0; i < this.brandList.length; i++) {
            this.brandList[i].cgrid = i;
          }
          this.brandGridApi.setRowData(this.brandList);
        }
      }
    });
  }

  serviceRowClicked(event: any) {
    let service = {};
    if (this.editStatus) {
      service = {
        type: 1,
        create: event.data.create,
        cgrid: event.data.cgrid,
        cservicio: event.data.cservicio,
        ctiposervicio: event.data.ctiposervicio,
        delete: false
      };
      const modalRef = this.modalService.open(ProviderServiceComponent);
      modalRef.componentInstance.service = service;
      modalRef.result.then((result: any) => {
        if (result) {
          if (result.type == 1) {
            for (let i = 0; i < this.serviceList.length; i++) {
              if (this.serviceList[i].cgrid == result.cgrid) {
                this.serviceList[i].cservicio = result.cservicio;
                this.serviceList[i].xservicio = result.xservicio;
                this.serviceGridApi.refreshCells();
                return;
              }
            }
          } else if (result.type == 4) {
            if (result.delete) {
              this.serviceDeletedRowList.push({ cservicio: result.cservicio });
            }
            this.serviceList = this.serviceList.filter((row) => { return row.cgrid != result.cgrid });
            for (let i = 0; i < this.serviceList.length; i++) {
              this.serviceList[i].cgrid = i;
            }
            this.serviceGridApi.setRowData(this.serviceList);
          }
        }
      });
    }
    
  }

  contactRowClicked(event: any) {
    let contact = {};
    if (this.editStatus) {
      contact = {
        type: 1,
        create: event.data.create,
        cgrid: event.data.cgrid,
        ccontacto: event.data.ccontacto,
        xnombre: event.data.xnombre,
        xapellido: event.data.xapellido,
        ctipodocidentidad: event.data.ctipodocidentidad,
        xdocidentidad: event.data.xdocidentidad,
        xtelefonocelular: event.data.xtelefonocelular,
        xemail: event.data.xemail,
        xcargo: event.data.xcargo,
        xtelefonocasa: event.data.xtelefonocasa,
        xtelefonooficina: event.data.xtelefonooficina,
        xfax: event.data.xfax,
        delete: false
      };
    } else {
      contact = {
        type: 2,
        create: event.data.create,
        cgrid: event.data.cgrid,
        ccontacto: event.data.ccontacto,
        xnombre: event.data.xnombre,
        xapellido: event.data.xapellido,
        ctipodocidentidad: event.data.ctipodocidentidad,
        xdocidentidad: event.data.xdocidentidad,
        xtelefonocelular: event.data.xtelefonocelular,
        xemail: event.data.xemail,
        xcargo: event.data.xcargo,
        xtelefonocasa: event.data.xtelefonocasa,
        xtelefonooficina: event.data.xtelefonooficina,
        xfax: event.data.xfax,
        delete: false
      };
    }
    const modalRef = this.modalService.open(ProviderContactComponent);
    modalRef.componentInstance.contact = contact;
    modalRef.result.then((result: any) => {
      if (result) {
        if (result.type == 1) {
          for (let i = 0; i < this.contactList.length; i++) {
            if (this.contactList[i].cgrid == result.cgrid) {
              this.contactList[i].ccontacto = result.ccontacto;
              this.contactList[i].xnombre = result.xnombre;
              this.contactList[i].xapellido = result.xapellido;
              this.contactList[i].ctipodocidentidad = result.ctipodocidentidad;
              this.contactList[i].xdocidentidad = result.xdocidentidad;
              this.contactList[i].xtelefonocelular = result.xtelefonocelular;
              this.contactList[i].xemail = result.xemail;
              this.contactList[i].xcargo = result.xcargo;
              this.contactList[i].xtelefonooficina = result.xtelefonooficina;
              this.contactList[i].xtelefonocasa = result.xtelefonocasa;
              this.contactList[i].xfax = result.xfax;
              this.contactGridApi.refreshCells();
              return;
            }
          }
        } else if (result.type == 4) {
          if (result.delete) {
            this.contactDeletedRowList.push({ ccontacto: result.ccontacto });
          }
          this.contactList = this.contactList.filter((row) => { return row.cgrid != result.cgrid });
          for (let i = 0; i < this.contactList.length; i++) {
            this.contactList[i].cgrid = i;
          }
          this.contactGridApi.setRowData(this.contactList);
        }
      }
    });
  }

  onBanksGridReady(event) {
    this.bankGridApi = event.api;
  }

  onStatesGridReady(event) {
    this.stateGridApi = event.api;
  }

  onBrandsGridReady(event) {
    this.brandGridApi = event.api;
  }

  onServicesGridReady(event) {
    this.serviceGridApi = event.api;
  }

  onContactsGridReady(event) {
    this.contactGridApi = event.api;
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
      let updateBankList = this.bankList.filter((row) => { return !row.create; });
      for (let i = 0; i < updateBankList.length; i++) {
        delete updateBankList[i].cgrid;
        delete updateBankList[i].create;
        delete updateBankList[i].xbanco;
        delete updateBankList[i].xtipocuentabancaria;
        delete updateBankList[i].xprincipal;
      }
      let createBankList = this.bankList.filter((row) => { return row.create; });
      for (let i = 0; i < createBankList.length; i++) {
        delete createBankList[i].cgrid;
        delete createBankList[i].create;
        delete createBankList[i].xbanco;
        delete createBankList[i].xtipocuentabancaria;
        delete createBankList[i].xprincipal;
      }
      let updateStateList = this.stateProviderList.filter((row) => { return !row.create; });
      for (let i = 0; i < updateStateList.length; i++) {
        delete updateStateList[i].cgrid;
        delete updateStateList[i].create;
        delete updateStateList[i].xestado;
      }
      let createStateList = this.stateProviderList.filter((row) => { return row.create; });
      for (let i = 0; i < createStateList.length; i++) {
        delete createStateList[i].cgrid;
        delete createStateList[i].create;
        delete createStateList[i].xestado;
      }
      let updateBrandList = this.brandList.filter((row) => { return !row.create; });
      for (let i = 0; i < updateBrandList.length; i++) {
        delete updateBrandList[i].cgrid;
        delete updateBrandList[i].create;
        delete updateBrandList[i].xmarca;
      }
      let createBrandList = this.brandList.filter((row) => { return row.create; });
      for (let i = 0; i < createBrandList.length; i++) {
        delete createBrandList[i].cgrid;
        delete createBrandList[i].create;
        delete createBrandList[i].xmarca;
      }
      let updateServiceList = this.serviceList.filter((row) => { return !row.create; });
      for (let i = 0; i < updateServiceList.length; i++) {
        delete updateServiceList[i].cgrid;
        delete updateServiceList[i].create;
        delete updateServiceList[i].xservicio;
      }
      let createServiceList = this.serviceList.filter((row) => { return row.create; });
      for (let i = 0; i < createServiceList.length; i++) {
        delete createServiceList[i].cgrid;
        delete createServiceList[i].create;
        delete createServiceList[i].xservicio;
      }
      let updateContactList = this.contactList.filter((row) => { return !row.create; });
      for (let i = 0; i < updateContactList.length; i++) {
        delete updateContactList[i].cgrid;
        delete updateContactList[i].create;
        updateContactList[i].xcargo ? false : delete updateContactList[i].xcargo;
        updateContactList[i].xtelefonooficina ? false : delete updateContactList[i].xtelefonooficina;
        updateContactList[i].xtelefonocasa ? false : delete updateContactList[i].xtelefonocasa;
        updateContactList[i].xfax ? false : delete updateContactList[i].xfax;
      }
      let createContactList = this.contactList.filter((row) => { return row.create; });
      for (let i = 0; i < createContactList.length; i++) {
        delete createContactList[i].cgrid;
        delete createContactList[i].create;
        createContactList[i].xcargo ? false : delete createContactList[i].xcargo;
        createContactList[i].xtelefonooficina ? false : delete createContactList[i].xtelefonooficina;
        createContactList[i].xtelefonocasa ? false : delete createContactList[i].xtelefonocasa;
        createContactList[i].xfax ? false : delete createContactList[i].xfax;
      }
      params = {
        permissionData: {
          cusuario: this.currentUser.data.cusuario,
          cmodulo: 57
        },
        cproveedor: this.code,
        cusuariomodificacion: this.currentUser.data.cusuario,
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania,
        xnombre: form.xnombre,
        xdocidentidad: form.xdocidentidad,
        xrazonsocial: form.xrazonsocial,
        cestado: form.cestado,
        cciudad: form.cciudad,
        xdireccion: form.xdireccion,
        xtelefono: form.xtelefono,
        pretencion: form.pretencion ? form.pretencion : undefined,
        centeimpuesto: form.centeimpuesto,
        nlimite: form.nlimite,
        xcorreo: form.xcorreo ? form.xcorreo : undefined,
        xobservacion: form.xobservacion,
        bactivo: form.bactivo,
        pislr: form.pislr,
        banks: {
          create: createBankList,
          update: updateBankList,
          delete: this.bankDeletedRowList
        },
        states: {
          create: createStateList,
          update: updateStateList,
          delete: this.stateDeletedRowList
        },
        brands: {
          create: createBrandList,
          update: updateBrandList,
          delete: this.brandDeletedRowList
        },
        services: {
          create: createServiceList,
          update: updateServiceList,
          delete: this.serviceDeletedRowList
        },
        contacts: {
          create: createContactList,
          update: updateContactList,
          delete: this.contactDeletedRowList
        }
      };
      // url = `${environment.apiUrl}/api/v2/provider/production/update`;
      request = await this.webService.updateProvider(params);
    } else {
      let createBankList = this.bankList;
      for (let i = 0; i < createBankList.length; i++) {
        delete createBankList[i].cgrid;
        delete createBankList[i].create;
        delete createBankList[i].xbanco;
        delete createBankList[i].xtipocuentabancaria;
        delete createBankList[i].xprincipal;
      }
      let createStateList = this.stateProviderList;
      for (let i = 0; i < createStateList.length; i++) {
        delete createStateList[i].cgrid;
        delete createStateList[i].create;
        delete createStateList[i].xestado;
      }
      let createBrandList = this.brandList;
      for (let i = 0; i < createBrandList.length; i++) {
        delete createBrandList[i].cgrid;
        delete createBrandList[i].create;
        delete createBrandList[i].xmarca;
      }
      let createServiceList = this.serviceList;
      for (let i = 0; i < createServiceList.length; i++) {
        delete createServiceList[i].cgrid;
        delete createServiceList[i].create;
        delete createServiceList[i].xservicio;
        delete createServiceList[i].xtiposervicio;
      }
      let createContactList = this.contactList;
      for (let i = 0; i < createContactList.length; i++) {
        delete createContactList[i].cgrid;
        delete createContactList[i].create;
        createContactList[i].xcargo ? false : delete createContactList[i].xcargo;
        createContactList[i].xtelefonooficina ? false : delete createContactList[i].xtelefonooficina;
        createContactList[i].xtelefonocasa ? false : delete createContactList[i].xtelefonocasa;
        createContactList[i].xfax ? false : delete createContactList[i].xfax;
      }
      params = {
        permissionData: {
          cusuario: this.currentUser.data.cusuario,
          cmodulo: 57
        },
        cusuariocreacion: this.currentUser.data.cusuario,
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania,
        xnombre: form.xnombre,
        xdocidentidad: form.xdocidentidad,
        xrazonsocial: form.xrazonsocial,
        cestado: form.cestado,
        cciudad: form.cciudad,
        xdireccion: form.xdireccion,
        xtelefono: form.xtelefono,
        pretencion: form.pretencion ? form.pretencion : undefined,
        centeimpuesto: form.centeimpuesto,
        nlimite: form.nlimite,
        xcorreo: form.xcorreo ? form.xcorreo : undefined,
        xobservacion: form.xobservacion,
        bactivo: form.bactivo,
        pislr: form.pislr,
        banks: createBankList,
        states: createStateList,
        brands: createBrandList,
        services: createServiceList,
        contacts: createContactList
      };
      // url = `${environment.apiUrl}/api/v2/provider/production/create`;
      request = await this.webService.createProvider(params);
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
          this.router.navigate([`/providers/provider-detail/${request.data.cproveedor}`]);
        }
      } else {
        let condition = request.data.condition;
        if (condition == "identification-document-already-exist") {
          this.alert.message = "PROVIDERS.PROVIDERS.IDENTIFICATIONDOCUMENTALREADYEXIST";
          this.alert.type = 'danger';
          this.alert.show = true;
        }
      }
      this.loading = false;
      return;
    }

  }