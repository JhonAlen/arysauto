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

@Component({
  selector: 'app-client-detail',
  templateUrl: './client-detail.component.html',
  styleUrls: ['./client-detail.component.css']
})
export class ClientDetailComponent implements OnInit {

  @ViewChild('Ximagen', { static: false }) ximagen: ElementRef;
  private bankGridApi;
  private associateGridApi;
  private bondGridApi;
  private contactGridApi;
  private brokerGridApi;
  private depreciationGridApi;
  private relationshipGridApi;
  private penaltyGridApi;
  private providerGridApi;
  private modelGridApi;
  private workerGridApi;
  private documentGridApi;
  private grouperGridApi;
  private planGridApi;
  sub;
  currentUser;
  detail_form: UntypedFormGroup;
  upload_form: UntypedFormGroup;
  loading: boolean = false;
  loading_cancel: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  documentTypeList: any[] = [];
  businessActivityList: any[] = [];
  enterpriseList: any[] = [];
  paymentTypeList: any[] = [];
  stateList: any[] =[];
  cityList: any[] =[];
  bankList: any[] = [];
  associateList: any[] = [];
  brokerList: any[] = [];
  depreciationList: any[] = [];
  relationshipList: any[] = [];
  penaltyList: any[] = [];
  providerList: any[] = [];
  bondList: any[] = [];
  contactList: any[] = [];
  modelList: any[] = [];
  workerList: any[] = [];
  documentList: any[] = [];
  grouperList: any[] = [];
  planList: any[] = [];
  canCreate: boolean = false;
  canDetail: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;
  code;
  showSaveButton: boolean = false;
  showEditButton: boolean = false;
  editStatus: boolean = false;
  xrutaimagen: string;
  bankDeletedRowList: any[] = [];
  associateDeletedRowList: any[] = [];
  bondDeletedRowList: any[] = [];
  contactDeletedRowList: any[] = [];
  brokerDeletedRowList: any[] = [];
  depreciationDeletedRowList: any[] = [];
  relationshipDeletedRowList: any[] = [];
  penaltyDeletedRowList: any[] = [];
  providerDeletedRowList: any[] = [];
  modelDeletedRowList: any[] = [];
  workerDeletedRowList: any[] = [];
  documentDeletedRowList: any[] = [];
  grouperDeletedRowList: any[] = [];
  planDeletedRowList: any[] = [];

  constructor(private formBuilder: UntypedFormBuilder,
              private authenticationService: AuthenticationService, 
              private router: Router,
              private translate: TranslateService,
              private activatedRoute: ActivatedRoute,
              private modalService : NgbModal,
              private webService : WebServiceConnectionService) { }

  async ngOnInit(): Promise<void> {
    this.detail_form = this.formBuilder.group({
      xcliente: ['', Validators.required],
      xcontrato: [''],
      xrepresentante: ['', Validators.required],
      cempresa: [''],
      cactividadempresa: ['', Validators.required],
      ctipodocidentidad: ['', Validators.required],
      xdocidentidad: ['', Validators.required],
      cestado: ['', Validators.required],
      cciudad: ['', Validators.required],
      xdireccionfiscal: ['', Validators.required],
      xemail: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])],
      fanomaximo: [''],
      finicio: ['', Validators.required],
      xtelefono: [''],
      bcolectivo: [false, Validators.required],
      bfacturar: [false, Validators.required],
      bfinanciar: [false, Validators.required],
      bcontribuyente: [false, Validators.required],
      bimpuesto: [false, Validators.required],
      bnotificacionsms: [false, Validators.required],
      xpaginaweb: [''],
      ctipopago: [''],
      ximagen: [''],
      ifacturacion: [''],
      bactivo: [true, Validators.required]
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 59
      }
      let request = await this.webService.securityVerifyModulePermission(params);
      if(request.error){
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
    }
  }

  async initializeDetailModule(): Promise<void>{
    let documentTypeParams = { cpais: this.currentUser.data.cpais };
    let documentTypeRequest = await this.webService.valrepDocumentType(documentTypeParams);
    if(documentTypeRequest.error){
      this.alert.message = documentTypeRequest.message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
      return;
    }
    if(documentTypeRequest.data.status){
      for(let i = 0; i < documentTypeRequest.data.list.length; i++){
        this.documentTypeList.push({ id: documentTypeRequest.data.list[i].ctipodocidentidad, value: documentTypeRequest.data.list[i].xtipodocidentidad });
      }
      this.documentTypeList.sort((a,b) => a.value > b.value ? 1 : -1);
    }
    let stateParams = { cpais: this.currentUser.data.cpais };
    let stateRequest = await this.webService.valrepState(stateParams);
    if(stateRequest.error){
      this.alert.message = stateRequest.message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
      return;
    }
    if(stateRequest.data.status){
      for(let i = 0; i < stateRequest.data.list.length; i++){
        this.stateList.push({ id: stateRequest.data.list[i].cestado, value: stateRequest.data.list[i].xestado });
      }
      this.stateList.sort((a,b) => a.value > b.value ? 1 : -1);
    }
    let businessActivityParams = { cpais: this.currentUser.data.cpais };
    let businessActivityRequest = await this.webService.valrepBusinessActivity(businessActivityParams);
    if(businessActivityRequest.error){
      this.alert.message = stateRequest.message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
      return;
    }
    if(businessActivityRequest.data.status){
      for(let i = 0; i < businessActivityRequest.data.list.length; i++){
        this.businessActivityList.push({ id: businessActivityRequest.data.list[i].cactividadempresa, value: businessActivityRequest.data.list[i].xactividadempresa });
      }
      this.businessActivityList.sort((a,b) => a.value > b.value ? 1 : -1);
    }
    let enterpriseParams = { cpais: this.currentUser.data.cpais, ccompania: this.currentUser.data.ccompania };
    let enterpriseRequest = await this.webService.valrepEnterprise(enterpriseParams);
    if(enterpriseRequest.error){
      this.alert.message = stateRequest.message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
      return;
    }
    if(enterpriseRequest.data.status){
      for(let i = 0; i < enterpriseRequest.data.list.length; i++){
        this.enterpriseList.push({ id: enterpriseRequest.data.list[i].cempresa, value: enterpriseRequest.data.list[i].xnombre });
      }
      this.enterpriseList.sort((a,b) => a.value > b.value ? 1 : -1);
    }
    let paymentTypeParams = { cpais: this.currentUser.data.cpais, ccompania: this.currentUser.data.ccompania };
    let paymentTypeRequest = await this.webService.valrepPaymentType(paymentTypeParams);
    if(paymentTypeRequest.error){
      this.alert.message = stateRequest.message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
      return;
    }
    if(paymentTypeRequest.data.status){
      for(let i = 0; i < paymentTypeRequest.data.list.length; i++){
        this.paymentTypeList.push({ id: paymentTypeRequest.data.list[i].ctipopago, value: paymentTypeRequest.data.list[i].xtipopago });
      }
      this.paymentTypeList.sort((a,b) => a.value > b.value ? 1 : -1);
    }
    this.sub = this.activatedRoute.paramMap.subscribe(params => {
      this.code = params.get('id');
      if(this.code){
        if(!this.canDetail){
          this.router.navigate([`/permission-error`]);
          return;
        }
        this.getClientData();
        if(this.canEdit){ this.showEditButton = true; }
      }else{
        if(!this.canCreate){
          this.router.navigate([`/permission-error`]);
          return;
        }
        this.editStatus = true;
        this.showSaveButton = true;
      }
    });
  }

  async getClientData(): Promise<void>{
    let params = {
      permissionData: {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 59
      },
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania,
      ccliente: this.code
    };
    let request = await this.webService.detailClient(params);
    if(request.error){
      this.alert.message = request.message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
      return;
    }
    if(request.data.status){
      this.detail_form.get('xcliente').setValue(request.data.xcliente);
      this.detail_form.get('xcliente').disable();
      this.detail_form.get('xcontrato').setValue(request.data.xcontrato);
      this.detail_form.get('xcontrato').disable();
      this.detail_form.get('xrepresentante').setValue(request.data.xrepresentante);
      this.detail_form.get('xrepresentante').disable();
      this.detail_form.get('cempresa').setValue(request.data.cempresa);
      this.detail_form.get('cempresa').disable();
      this.detail_form.get('cactividadempresa').setValue(request.data.cactividadempresa);
      this.detail_form.get('cactividadempresa').disable();
      this.detail_form.get('ctipodocidentidad').setValue(request.data.ctipodocidentidad);
      this.detail_form.get('ctipodocidentidad').disable();
      this.detail_form.get('xdocidentidad').setValue(request.data.xdocidentidad);
      this.detail_form.get('xdocidentidad').disable();
      this.detail_form.get('cestado').setValue(request.data.cestado);
      this.detail_form.get('cestado').disable();
      await this.cityDropdownDataRequest();
      this.detail_form.get('cciudad').setValue(request.data.cciudad);
      this.detail_form.get('cciudad').disable();
      this.detail_form.get('xdireccionfiscal').setValue(request.data.xdireccionfiscal);
      this.detail_form.get('xdireccionfiscal').disable();
      this.detail_form.get('xemail').setValue(request.data.xemail);
      this.detail_form.get('xemail').disable();
      this.detail_form.get('fanomaximo').setValue(request.data.fanomaximo);
      this.detail_form.get('fanomaximo').disable();
      if(request.data.finicio){
        let dateFormat = new Date(request.data.finicio).toISOString().substring(0, 10);
        this.detail_form.get('finicio').setValue(dateFormat);
        this.detail_form.get('finicio').disable();
      }
      request.data.xtelefono ? this.detail_form.get('xtelefono').setValue(request.data.xtelefono) : false;
      this.detail_form.get('xtelefono').disable();
      this.detail_form.get('bcolectivo').setValue(request.data.bcolectivo);
      this.detail_form.get('bcolectivo').disable();
      this.detail_form.get('bfacturar').setValue(request.data.bfacturar);
      this.detail_form.get('bfacturar').disable();
      this.detail_form.get('bfinanciar').setValue(request.data.bfinanciar);
      this.detail_form.get('bfinanciar').disable();
      this.detail_form.get('bcontribuyente').setValue(request.data.bcontribuyente);
      this.detail_form.get('bcontribuyente').disable();
      this.detail_form.get('bimpuesto').setValue(request.data.bimpuesto);
      this.detail_form.get('bimpuesto').disable();
      this.detail_form.get('bnotificacionsms').setValue(request.data.bnotificacionsms);
      this.detail_form.get('bnotificacionsms').disable();
      request.data.xpaginaweb ? this.detail_form.get('xpaginaweb').setValue(request.data.xpaginaweb) : false;
      this.detail_form.get('xpaginaweb').disable();
      this.detail_form.get('ctipopago').setValue(request.data.ctipopago);
      this.detail_form.get('ctipopago').disable();
      this.detail_form.get('ifacturacion').setValue(request.data.ifacturacion);
      this.detail_form.get('ifacturacion').disable();
      this.detail_form.get('bactivo').setValue(request.data.bactivo);
      this.detail_form.get('bactivo').disable();
      request.data.xrutaimagen ? this.xrutaimagen = request.data.xrutaimagen : this.xrutaimagen = '';
      this.bankList = [];
      if(request.data.banks){
        for(let i =0; i < request.data.banks.length; i++){
          this.bankList.push({
            cgrid: i,
            create: false,
            cbanco: request.data.banks[i].cbanco,
            xbanco: request.data.banks[i].xbanco,
            ctipocuentabancaria: request.data.banks[i].ctipocuentabancaria,
            xtipocuentabancaria: request.data.banks[i].xtipocuentabancaria,
            xnumerocuenta: request.data.banks[i].xnumerocuenta,
            xcontrato: request.data.banks[i].xcontrato,
            bprincipal: request.data.banks[i].bprincipal,
            xprincipal: request.data.banks[i].bprincipal ? this.translate.instant("DROPDOWN.YES") : this.translate.instant("DROPDOWN.NO")
          });
        }
      }
      this.associateList = [];
      if(request.data.associates){
        for(let i =0; i < request.data.associates.length; i++){
          this.associateList.push({
            cgrid: i,
            create: false,
            casociado: request.data.associates[i].casociado,
            xasociado: request.data.associates[i].xasociado
          });
        }
      }
      this.bondList = [];
      if(request.data.bonds){
        for(let i =0; i < request.data.bonds.length; i++){
          this.bondList.push({
            cgrid: i,
            create: false,
            cbono: request.data.bonds[i].cbono,
            pbono: request.data.bonds[i].pbono,
            mbono: request.data.bonds[i].mbono,
            fefectiva: new Date(request.data.bonds[i].fefectiva).toISOString().substring(0, 10)
          });
        }
      }
      this.contactList = [];
      if(request.data.contacts){
        for(let i =0; i < request.data.contacts.length; i++){
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
            bnotificacion: request.data.contacts[i].bnotificacion
          });
        }
      }
      this.brokerList = [];
      if(request.data.brokers){
        for(let i =0; i < request.data.brokers.length; i++){
          this.brokerList.push({
            cgrid: i,
            create: false,
            ccorredor: request.data.brokers[i].ccorredor,
            xcorredor: request.data.brokers[i].xcorredor,
            pcorredor: request.data.brokers[i].pcorredor,
            mcorredor: request.data.brokers[i].mcorredor,
            fefectiva: new Date(request.data.brokers[i].fefectiva).toISOString().substring(0, 10)
          });
        }
      }
      this.depreciationList = [];
      if(request.data.depreciations){
        for(let i =0; i < request.data.depreciations.length; i++){
          this.depreciationList.push({
            cgrid: i,
            create: false,
            cdepreciacion: request.data.depreciations[i].cdepreciacion,
            xdepreciacion: request.data.depreciations[i].xdepreciacion,
            pdepreciacion: request.data.depreciations[i].pdepreciacion,
            mdepreciacion: request.data.depreciations[i].mdepreciacion,
            fefectiva: new Date(request.data.depreciations[i].fefectiva).toISOString().substring(0, 10)
          });
        }
      }
      this.relationshipList = [];
      if(request.data.relationships){
        for(let i =0; i < request.data.relationships.length; i++){
          this.relationshipList.push({
            cgrid: i,
            create: false,
            cparentesco: request.data.relationships[i].cparentesco,
            xparentesco: request.data.relationships[i].xparentesco,
            xobservacion: request.data.relationships[i].xobservacion,
            fefectiva: new Date(request.data.relationships[i].fefectiva).toISOString().substring(0, 10)
          });
        }
      }
      this.penaltyList = [];
      if(request.data.penalties){
        for(let i =0; i < request.data.penalties.length; i++){
          this.penaltyList.push({
            cgrid: i,
            create: false,
            cpenalizacion: request.data.penalties[i].cpenalizacion,
            xpenalizacion: request.data.penalties[i].xpenalizacion,
            ppenalizacion: request.data.penalties[i].ppenalizacion,
            mpenalizacion: request.data.penalties[i].mpenalizacion,
            fefectiva: new Date(request.data.penalties[i].fefectiva).toISOString().substring(0, 10)
          });
        }
      }
      this.providerList = [];
      if(request.data.providers){
        for(let i =0; i < request.data.providers.length; i++){
          this.providerList.push({
            cgrid: i,
            create: false,
            cproveedor: request.data.providers[i].cproveedor,
            xproveedor: request.data.providers[i].xproveedor,
            xobservacion: request.data.providers[i].xobservacion,
            fefectiva: new Date(request.data.providers[i].fefectiva).toISOString().substring(0, 10)
          });
        }
      }
      this.modelList = [];
      if(request.data.models){
        for(let i =0; i < request.data.models.length; i++){
          this.modelList.push({
            cgrid: i,
            create: false,
            cmodelo: request.data.models[i].cmodelo,
            xmodelo: request.data.models[i].xmodelo,
            cmarca: request.data.models[i].cmarca,
            xmarca: request.data.models[i].xmarca,
            xobservacion: request.data.models[i].xobservacion
          });
        }
      }
      this.workerList = [];
      if(request.data.workers){
        for(let i =0; i < request.data.workers.length; i++){
          this.workerList.push({
            cgrid: i,
            create: false,
            ctrabajador: request.data.workers[i].ctrabajador,
            xnombre: request.data.workers[i].xnombre,
            xapellido: request.data.workers[i].xapellido,
            ctipodocidentidad: request.data.workers[i].ctipodocidentidad,
            xdocidentidad: request.data.workers[i].xdocidentidad,
            xtelefonocelular: request.data.workers[i].xtelefonocelular,
            xemail: request.data.workers[i].xemail,
            xprofesion: request.data.workers[i].xprofesion ? request.data.workers[i].xprofesion : undefined,
            xocupacion: request.data.workers[i].xocupacion ? request.data.workers[i].xocupacion : undefined,
            xtelefonocasa: request.data.workers[i].xtelefonocasa ? request.data.workers[i].xtelefonocasa : undefined,
            xfax: request.data.workers[i].xfax ? request.data.workers[i].xfax : undefined,
            cparentesco: request.data.workers[i].cparentesco,
            xdireccion: request.data.workers[i].xdireccion,
            cestado: request.data.workers[i].cestado,
            cciudad: request.data.workers[i].cciudad,
            cestadocivil: request.data.workers[i].cestadocivil,
            fnacimiento: new Date(request.data.workers[i].fnacimiento).toISOString().substring(0, 10)
          });
        }
      }
      this.documentList = [];
      if(request.data.documents){
        for(let i =0; i < request.data.documents.length; i++){
          this.documentList.push({
            cgrid: i,
            create: false,
            cdocumento: request.data.documents[i].cdocumento,
            xdocumento: request.data.documents[i].xdocumento,
            xrutaarchivo: request.data.documents[i].xrutaarchivo
          });
        }
      }
      this.grouperList = [];
      if(request.data.groupers){
        for(let i =0; i < request.data.groupers.length; i++){
          let banks = [];
          for(let j =0; j < request.data.groupers[i].banks.length; j++){
            banks.push({
              create: false,
              cbanco: request.data.groupers[i].banks[j].cbanco,
              xbanco: request.data.groupers[i].banks[j].xbanco,
              ctipocuentabancaria: request.data.groupers[i].banks[j].ctipocuentabancaria,
              xtipocuentabancaria: request.data.groupers[i].banks[j].xtipocuentabancaria,
              xnumerocuenta: request.data.groupers[i].banks[j].xnumerocuenta,
              xcontrato: request.data.groupers[i].banks[j].xcontrato,
              bprincipal: request.data.groupers[i].banks[j].bprincipal,
              xprincipal: request.data.groupers[i].banks[j].bprincipal ? this.translate.instant("DROPDOWN.YES") : this.translate.instant("DROPDOWN.NO")
            });
          }
          this.grouperList.push({
            cgrid: i,
            create: false,
            cagrupador: request.data.groupers[i].cagrupador,
            xcontratoalternativo: request.data.groupers[i].xcontratoalternativo,
            xnombre: request.data.groupers[i].xnombre,
            xrazonsocial: request.data.groupers[i].xrazonsocial,
            cestado: request.data.groupers[i].cestado,
            cciudad: request.data.groupers[i].cciudad,
            xdireccionfiscal: request.data.groupers[i].xdireccionfiscal,
            ctipodocidentidad: request.data.groupers[i].ctipodocidentidad,
            xdocidentidad: request.data.groupers[i].xdocidentidad,
            bfacturar: request.data.groupers[i].bfacturar,
            bcontribuyente: request.data.groupers[i].bcontribuyente,
            bimpuesto: request.data.groupers[i].bimpuesto,
            xtelefono: request.data.groupers[i].xtelefono,
            xfax: request.data.groupers[i].xfax ? request.data.groupers[i].xfax : undefined,
            xemail: request.data.groupers[i].xemail,
            xrutaimagen: request.data.groupers[i].xrutaimagen ? request.data.groupers[i].xrutaimagen : undefined,
            bactivo: request.data.groupers[i].bactivo,
            banks: banks
          });
        }
      }
      this.planList = [];
      if(request.data.plans){
        for(let i =0; i < request.data.plans.length; i++){
          this.planList.push({
            cgrid: i,
            create: false,
            cplancliente: request.data.plans[i].cplancliente,
            cplan: request.data.plans[i].cplan,
            xplan: request.data.plans[i].xplan,
            casociado: request.data.plans[i].casociado,
            xasociado: request.data.plans[i].xasociado,
            ctipoplan: request.data.plans[i].ctipoplan,
            xtipoplan: request.data.plans[i].xtipoplan,
            fdesde: new Date(request.data.plans[i].fdesde).toISOString().substring(0, 10),
            fhasta: new Date(request.data.plans[i].fhasta).toISOString().substring(0, 10)
          });
        }
      }
    }
    this.loading_cancel = false;
  }

  async cityDropdownDataRequest(){
    if(this.detail_form.get('cestado').value){
      let params = { cpais: this.currentUser.data.cpais, cestado: this.detail_form.get('cestado').value };
      let request = await this.webService.valrepCity(params);
      if(request.error){
        this.alert.message = request.message;
        this.alert.type = 'danger';
        this.alert.show = true;
        this.loading = false;
        return;
      }
      if(request.data.status){
        this.cityList = [];
        for(let i = 0; i < request.data.list.length; i++){
          this.cityList.push({ id: request.data.list[i].cciudad, value: request.data.list[i].xciudad });
        }
        this.cityList.sort((a,b) => a.value > b.value ? 1 : -1);
      }
    }
  }

  editClient(){
    this.detail_form.get('xcliente').enable();
    this.detail_form.get('xcontrato').enable();
    this.detail_form.get('xrepresentante').enable();
    this.detail_form.get('cempresa').enable();
    this.detail_form.get('cactividadempresa').enable();
    this.detail_form.get('ctipodocidentidad').enable();
    this.detail_form.get('xdocidentidad').enable();
    this.detail_form.get('cestado').enable();
    this.detail_form.get('cciudad').enable();
    this.detail_form.get('xdireccionfiscal').enable();
    this.detail_form.get('xemail').enable();
    this.detail_form.get('fanomaximo').enable();
    this.detail_form.get('finicio').enable();
    this.detail_form.get('xtelefono').enable();
    this.detail_form.get('bcolectivo').enable();
    this.detail_form.get('bfacturar').enable();
    this.detail_form.get('bfinanciar').enable();
    this.detail_form.get('bcontribuyente').enable();
    this.detail_form.get('bimpuesto').enable();
    this.detail_form.get('bnotificacionsms').enable();
    this.detail_form.get('xpaginaweb').enable();
    this.detail_form.get('ctipopago').enable();
    this.detail_form.get('ifacturacion').enable();
    this.detail_form.get('bactivo').enable();
    this.showEditButton = false;
    this.showSaveButton = true;
    this.editStatus = true;
  }

  cancelSave(){
    if(this.code){
      this.loading_cancel = true;
      this.showSaveButton = false;
      this.editStatus = false;
      this.showEditButton = true;
      this.getClientData();
    }else{
      this.router.navigate([`/clients/client-index`]);
    }
  }

  addBank(){
    let bank = { type: 3 };
    const modalRef = this.modalService.open(ClientBankComponent);
    modalRef.componentInstance.bank = bank;
    modalRef.result.then((result: any) => { 
      if(result){
        if(result.type == 3){
          this.bankList.push({
            cgrid: this.bankList.length,
            create: true,
            cbanco: result.cbanco,
            xbanco: result.xbanco,
            ctipocuentabancaria: result.ctipocuentabancaria,
            xtipocuentabancaria: result.xtipocuentabancaria,
            xnumerocuenta: result.xnumerocuenta,
            xcontrato: result.xcontrato,
            bprincipal: result.bprincipal,
            xprincipal: result.bprincipal ? this.translate.instant("DROPDOWN.YES") : this.translate.instant("DROPDOWN.NO")
          });
          this.bankGridApi.setRowData(this.bankList);
        }
      }
    });
  }

  addAssociate(){
    let associate = { type: 3 };
    const modalRef = this.modalService.open(ClientAssociateComponent);
    modalRef.componentInstance.associate = associate;
    modalRef.result.then((result: any) => { 
      if(result){
        if(result.type == 3){
          this.associateList.push({
            cgrid: this.associateList.length,
            create: true,
            casociado: result.casociado,
            xasociado: result.xasociado
          });
          this.associateGridApi.setRowData(this.associateList);
        }
      }
    });
  }

  addBond(){
    let bond = { type: 3 };
    const modalRef = this.modalService.open(ClientBondComponent);
    modalRef.componentInstance.bond = bond;
    modalRef.result.then((result: any) => { 
      if(result){
        if(result.type == 3){
          this.bondList.push({
            cgrid: this.bondList.length,
            create: true,
            pbono: result.pbono,
            mbono: result.mbono,
            fefectiva: result.fefectiva
          });
          this.bondGridApi.setRowData(this.bondList);
        }
      }
    });
  }

  addContact(){
    let contact = { type: 3 };
    const modalRef = this.modalService.open(ClientContactComponent);
    modalRef.componentInstance.contact = contact;
    modalRef.result.then((result: any) => { 
      if(result){
        if(result.type == 3){
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
            xtelefonocasa: result.xtelefonocasa,
            bnotificacion: result.bnotificacion
          });
          this.contactGridApi.setRowData(this.contactList);
        }
      }
    });
  }

  addBroker(){
    let broker = { type: 3 };
    const modalRef = this.modalService.open(ClientBrokerComponent);
    modalRef.componentInstance.broker = broker;
    modalRef.result.then((result: any) => { 
      if(result){
        if(result.type == 3){
          this.brokerList.push({
            cgrid: this.brokerList.length,
            create: true,
            ccorredor: result.ccorredor,
            xcorredor: result.xcorredor,
            pcorredor: result.pcorredor,
            mcorredor: result.mcorredor,
            fefectiva: result.fefectiva
          });
          this.brokerGridApi.setRowData(this.brokerList);
        }
      }
    });
  }

  addDepreciation(){
    let depreciation = { type: 3 };
    const modalRef = this.modalService.open(ClientDepreciationComponent);
    modalRef.componentInstance.depreciation = depreciation;
    modalRef.result.then((result: any) => { 
      if(result){
        if(result.type == 3){
          this.depreciationList.push({
            cgrid: this.depreciationList.length,
            create: true,
            cdepreciacion: result.cdepreciacion,
            xdepreciacion: result.xdepreciacion,
            pdepreciacion: result.pdepreciacion,
            mdepreciacion: result.mdepreciacion,
            fefectiva: result.fefectiva
          });
          this.depreciationGridApi.setRowData(this.depreciationList);
        }
      }
    });
  }

  addRelationship(){
    let relationship = { type: 3 };
    const modalRef = this.modalService.open(ClientRelationshipComponent);
    modalRef.componentInstance.relationship = relationship;
    modalRef.result.then((result: any) => { 
      if(result){
        if(result.type == 3){
          this.relationshipList.push({
            cgrid: this.relationshipList.length,
            create: true,
            cparentesco: result.cparentesco,
            xparentesco: result.xparentesco,
            xobservacion: result.xobservacion,
            fefectiva: result.fefectiva
          });
          this.relationshipGridApi.setRowData(this.relationshipList);
        }
      }
    });
  }

  addPenalty(){
    let penalty = { type: 3 };
    const modalRef = this.modalService.open(ClientPenaltyComponent);
    modalRef.componentInstance.penalty = penalty;
    modalRef.result.then((result: any) => { 
      if(result){
        if(result.type == 3){
          this.penaltyList.push({
            cgrid: this.penaltyList.length,
            create: true,
            cpenalizacion: result.cpenalizacion,
            xpenalizacion: result.xpenalizacion,
            ppenalizacion: result.ppenalizacion,
            mpenalizacion: result.mpenalizacion,
            fefectiva: result.fefectiva
          });
          this.penaltyGridApi.setRowData(this.penaltyList);
        }
      }
    });
  }

  addProvider(){
    let provider = { type: 3 };
    const modalRef = this.modalService.open(ClientExcludedProviderComponent);
    modalRef.componentInstance.provider = provider;
    modalRef.result.then((result: any) => { 
      if(result){
        if(result.type == 3){
          this.providerList.push({
            cgrid: this.providerList.length,
            create: true,
            cproveedor: result.cproveedor,
            xproveedor: result.xproveedor,
            xobservacion: result.xobservacion,
            fefectiva: result.fefectiva
          });
          this.providerGridApi.setRowData(this.providerList);
        }
      }
    });
  }

  addModel(){
    let model = { type: 3 };
    const modalRef = this.modalService.open(ClientExcludedModelComponent);
    modalRef.componentInstance.model = model;
    modalRef.result.then((result: any) => { 
      if(result){
        if(result.type == 3){
          this.modelList.push({
            cgrid: this.modelList.length,
            create: true,
            cmodelo: result.cmodelo,
            xmodelo: result.xmodelo,
            cmarca: result.cmarca,
            xmarca: result.xmarca,
            xobservacion: result.xobservacion
          });
          this.modelGridApi.setRowData(this.modelList);
        }
      }
    });
  }

  addWorker(){
    let worker = { type: 3, relationships: this.relationshipList };
    const modalRef = this.modalService.open(ClientWorkerComponent);
    modalRef.componentInstance.worker = worker;
    modalRef.result.then((result: any) => { 
      if(result){
        if(result.type == 3){
          this.workerList.push({
            cgrid: this.contactList.length,
            create: true,
            xnombre: result.xnombre,
            xapellido: result.xapellido,
            ctipodocidentidad: result.ctipodocidentidad,
            xdocidentidad: result.xdocidentidad,
            xtelefonocelular: result.xtelefonocelular,
            xemail: result.xemail,
            xprofesion: result.xprofesion,
            xfax: result.xfax,
            xocupacion: result.xocupacion,
            xtelefonocasa: result.xtelefonocasa,
            cparentesco: result.cparentesco,
            cciudad: result.cciudad,
            cestado: result.cestado,
            xdireccion: result.xdireccion,
            fnacimiento: result.fnacimiento,
            cestadocivil: result.cestadocivil
          });
          this.workerGridApi.setRowData(this.workerList);
        }
      }
    });
  }

  addDocument(){
    let document = { type: 3 };
    const modalRef = this.modalService.open(ClientDocumentComponent);
    modalRef.componentInstance.document = document;
    modalRef.result.then((result: any) => { 
      if(result){
        if(result.type == 3){
          this.documentList.push({
            cgrid: this.documentList.length,
            create: true,
            cdocumento: result.cdocumento,
            xdocumento: result.xdocumento,
            xrutaarchivo: result.xrutaarchivo
          });
          this.documentGridApi.setRowData(this.documentList);
        }
      }
    });
  }

  addGrouper(){
    let grouper = { type: 3 };
    const modalRef = this.modalService.open(ClientGrouperComponent, { size: 'xl' });
    modalRef.componentInstance.grouper = grouper;
    modalRef.result.then((result: any) => { 
      if(result){
        if(result.type == 3){
          this.grouperList.push({
            cgrid: this.grouperList.length,
            create: true,
            xcontratoalternativo: result.xcontratoalternativo,
            xnombre: result.xnombre,
            xrazonsocial: result.xrazonsocial,
            cestado: result.cestado,
            cciudad: result.cciudad,
            xdireccionfiscal: result.xdireccionfiscal,
            ctipodocidentidad: result.ctipodocidentidad,
            xdocidentidad: result.xdocidentidad,
            bfacturar: result.bfacturar,
            bcontribuyente: result.bcontribuyente,
            bimpuesto: result.bimpuesto,
            xtelefono: result.xtelefono,
            xfax: result.xfax,
            xemail: result.xemail,
            xrutaimagen: result.xrutaimagen,
            bactivo: result.bactivo,
            banks: result.banks
          });
          this.grouperGridApi.setRowData(this.grouperList);
        }
      }
    });
  }

  addPlan(){
    let plan = { type: 3, associates: this.associateList };
    const modalRef = this.modalService.open(ClientPlanComponent);
    modalRef.componentInstance.plan = plan;
    modalRef.result.then((result: any) => { 
      if(result){
        if(result.type == 3){
          this.planList.push({
            cgrid: this.planList.length,
            create: true,
            cplan: result.cplan,
            xplan: result.xplan,
            casociado: result.casociado,
            xasociado: result.xasociado,
            ctipoplan: result.ctipoplan,
            xtipoplan: result.xtipoplan,
            fdesde: result.fdesde,
            fhasta: result.fhasta
          });
          this.planGridApi.setRowData(this.planList);
        }
      }
    });
  }

  bankRowClicked(event: any){
    let bank = {};
    if(this.editStatus){ 
      bank = { 
        type: 1,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        cbanco: event.data.cbanco,
        ctipocuentabancaria: event.data.ctipocuentabancaria,
        xnumerocuenta: event.data.xnumerocuenta,
        xcontrato: event.data.xcontrato,
        bprincipal: event.data.bprincipal,
        delete: false
      };
    }else{ 
      bank = { 
        type: 2,
        create: event.data.create,
        cgrid: event.data.cgrid,
        cbanco: event.data.cbanco,
        ctipocuentabancaria: event.data.ctipocuentabancaria,
        xnumerocuenta: event.data.xnumerocuenta,
        xcontrato: event.data.xcontrato,
        bprincipal: event.data.bprincipal,
        delete: false
      }; 
    }
    const modalRef = this.modalService.open(ClientBankComponent);
    modalRef.componentInstance.bank = bank;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 1){
          for(let i = 0; i < this.bankList.length; i++){
            if(this.bankList[i].cgrid == result.cgrid){
              this.bankList[i].cbanco = result.cbanco;
              this.bankList[i].xbanco = result.xbanco;
              this.bankList[i].ctipocuentabancaria = result.ctipocuentabancaria;
              this.bankList[i].xnumerocuenta = result.xnumerocuenta;
              this.bankList[i].xcontrato = result.xcontrato;
              this.bankList[i].bprincipal = result.bprincipal;
              this.bankList[i].xprincipal = result.bprincipal ? this.translate.instant("DROPDOWN.YES") : this.translate.instant("DROPDOWN.NO");
              this.bankGridApi.refreshCells();
              return;
            }
          }
        }else if(result.type == 4){
          if(result.delete){
            this.bankDeletedRowList.push({ cbanco: result.cbanco });
          }
          this.bankList = this.bankList.filter((row) => { return row.cgrid != result.cgrid });
          for(let i = 0; i < this.bankList.length; i++){
            this.bankList[i].cgrid = i;
          }
          this.bankGridApi.setRowData(this.bankList);
        }
      }
    });
  }

  associateRowClicked(event: any){
    let associate = {};
    if(this.editStatus){ 
      associate = { 
        type: 1,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        casociado: event.data.casociado,
        delete: false
      };
    }else{ 
      associate = { 
        type: 2,
        create: event.data.create,
        cgrid: event.data.cgrid,
        casociado: event.data.casociado,
        delete: false
      }; 
    }
    const modalRef = this.modalService.open(ClientAssociateComponent);
    modalRef.componentInstance.associate = associate;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 1){
          for(let i = 0; i < this.associateList.length; i++){
            if(this.associateList[i].cgrid == result.cgrid){
              this.associateList[i].casociado = result.casociado;
              this.associateList[i].xasociado = result.xasociado;
              this.associateGridApi.refreshCells();
              return;
            }
          }
        }else if(result.type == 4){
          if(result.delete){
            this.associateDeletedRowList.push({ casociado: result.casociado });
          }
          this.associateList = this.associateList.filter((row) => { return row.cgrid != result.cgrid });
          for(let i = 0; i < this.associateList.length; i++){
            this.associateList[i].cgrid = i;
          }
          this.associateGridApi.setRowData(this.associateList);
        }
      }
    });
  }

  bondRowClicked(event: any){
    let bond = {};
    if(this.editStatus){ 
      bond = { 
        type: 1,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        cbono: event.data.cbono,
        pbono: event.data.pbono,
        mbono: event.data.mbono,
        fefectiva: event.data.fefectiva,
        delete: false
      };
    }else{ 
      bond = { 
        type: 2,
        create: event.data.create,
        cgrid: event.data.cgrid,
        cbono: event.data.cbono,
        pbono: event.data.pbono,
        mbono: event.data.mbono,
        fefectiva: event.data.fefectiva,
        delete: false
      }; 
    }
    const modalRef = this.modalService.open(ClientBondComponent);
    modalRef.componentInstance.bond = bond;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 1){
          for(let i = 0; i < this.bondList.length; i++){
            if(this.bondList[i].cgrid == result.cgrid){
              this.bondList[i].pbono = result.pbono;
              this.bondList[i].mbono = result.mbono;
              this.bondList[i].fefectiva = result.fefectiva;
              this.bondGridApi.refreshCells();
              return;
            }
          }
        }else if(result.type == 4){
          if(result.cbono){
            this.bondDeletedRowList.push({ cbono: result.cbono });
          }
          this.bondList = this.bondList.filter((row) => { return row.cgrid != result.cgrid });
          for(let i = 0; i < this.bondList.length; i++){
            this.bondList[i].cgrid = i;
          }
          this.bondGridApi.setRowData(this.bondList);
        }
      }
    });
  }

  contactRowClicked(event: any){
    let contact = {};
    if(this.editStatus){ 
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
        bnotificacion: event.data.bnotificacion,
        delete: false
      };
    }else{ 
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
        bnotificacion: event.data.bnotificacion,
        delete: false
      }; 
    }
    const modalRef = this.modalService.open(ClientContactComponent);
    modalRef.componentInstance.contact = contact;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 1){
          for(let i = 0; i < this.contactList.length; i++){
            if(this.contactList[i].cgrid == result.cgrid){
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
              this.contactList[i].bnotificacion = result.bnotificacion;
              this.contactGridApi.refreshCells();
              return;
            }
          }
        }else if(result.type == 4){
          if(result.delete){
            this.contactDeletedRowList.push({ ccontacto: result.ccontacto });
          }
          this.contactList = this.contactList.filter((row) => { return row.cgrid != result.cgrid });
          for(let i = 0; i < this.contactList.length; i++){
            this.contactList[i].cgrid = i;
          }
          this.contactGridApi.setRowData(this.contactList);
        }
      }
    });
  }

  brokerRowClicked(event: any){
    let broker = {};
    if(this.editStatus){ 
      broker = { 
        type: 1,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        ccorredor: event.data.ccorredor,
        pcorredor: event.data.pcorredor,
        mcorredor: event.data.mcorredor,
        fefectiva: event.data.fefectiva,
        delete: false
      };
    }else{ 
      broker = { 
        type: 2,
        create: event.data.create,
        cgrid: event.data.cgrid,
        ccorredor: event.data.ccorredor,
        pcorredor: event.data.pcorredor,
        mcorredor: event.data.mcorredor,
        fefectiva: event.data.fefectiva,
        delete: false
      }; 
    }
    const modalRef = this.modalService.open(ClientBrokerComponent);
    modalRef.componentInstance.broker = broker;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 1){
          for(let i = 0; i < this.brokerList.length; i++){
            if(this.brokerList[i].cgrid == result.cgrid){
              this.brokerList[i].ccorredor = result.ccorredor;
              this.brokerList[i].xcorredor = result.xcorredor;
              this.brokerList[i].pcorredor = result.pcorredor;
              this.brokerList[i].mcorredor = result.mcorredor;
              this.brokerList[i].fefectiva = result.fefectiva;
              this.brokerGridApi.refreshCells();
              return;
            }
          }
        }else if(result.type == 4){
          if(result.delete){
            this.brokerDeletedRowList.push({ ccorredor: result.ccorredor });
          }
          this.brokerList = this.brokerList.filter((row) => { return row.cgrid != result.cgrid });
          for(let i = 0; i < this.brokerList.length; i++){
            this.brokerList[i].cgrid = i;
          }
          this.brokerGridApi.setRowData(this.brokerList);
        }
      }
    });
  }

  depreciationRowClicked(event: any){
    let depreciation = {};
    if(this.editStatus){ 
      depreciation = { 
        type: 1,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        cdepreciacion: event.data.cdepreciacion,
        pdepreciacion: event.data.pdepreciacion,
        mdepreciacion: event.data.mdepreciacion,
        fefectiva: event.data.fefectiva,
        delete: false
      };
    }else{ 
      depreciation = { 
        type: 2,
        create: event.data.create,
        cgrid: event.data.cgrid,
        cdepreciacion: event.data.cdepreciacion,
        pdepreciacion: event.data.pdepreciacion,
        mdepreciacion: event.data.mdepreciacion,
        fefectiva: event.data.fefectiva,
        delete: false
      }; 
    }
    const modalRef = this.modalService.open(ClientDepreciationComponent);
    modalRef.componentInstance.depreciation = depreciation;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 1){
          for(let i = 0; i < this.depreciationList.length; i++){
            if(this.depreciationList[i].cgrid == result.cgrid){
              this.depreciationList[i].cdepreciacion = result.cdepreciacion;
              this.depreciationList[i].xdepreciacion = result.xdepreciacion;
              this.depreciationList[i].pdepreciacion = result.pdepreciacion;
              this.depreciationList[i].mdepreciacion = result.mdepreciacion;
              this.depreciationList[i].fefectiva = result.fefectiva;
              this.depreciationGridApi.refreshCells();
              return;
            }
          }
        }else if(result.type == 4){
          if(result.delete){
            this.depreciationDeletedRowList.push({ cdepreciacion: result.cdepreciacion });
          }
          this.depreciationList = this.depreciationList.filter((row) => { return row.cgrid != result.cgrid });
          for(let i = 0; i < this.depreciationList.length; i++){
            this.depreciationList[i].cgrid = i;
          }
          this.depreciationGridApi.setRowData(this.depreciationList);
        }
      }
    });
  }

  relationshipRowClicked(event: any){
    let relationship = {};
    if(this.editStatus){ 
      relationship = { 
        type: 1,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        cparentesco: event.data.cparentesco,
        xobservacion: event.data.xobservacion,
        fefectiva: event.data.fefectiva,
        delete: false
      };
    }else{ 
      relationship = { 
        type: 2,
        create: event.data.create,
        cgrid: event.data.cgrid,
        cparentesco: event.data.cparentesco,
        xobservacion: event.data.xobservacion,
        fefectiva: event.data.fefectiva,
        delete: false
      }; 
    }
    const modalRef = this.modalService.open(ClientRelationshipComponent);
    modalRef.componentInstance.relationship = relationship;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 1){
          for(let i = 0; i < this.relationshipList.length; i++){
            if(this.relationshipList[i].cgrid == result.cgrid){
              this.relationshipList[i].cparentesco = result.cparentesco;
              this.relationshipList[i].xparentesco = result.xparentesco;
              this.relationshipList[i].xobservacion = result.xobservacion;
              this.relationshipList[i].fefectiva = result.fefectiva;
              this.relationshipGridApi.refreshCells();
              return;
            }
          }
        }else if(result.type == 4){
          if(result.delete){
            this.relationshipDeletedRowList.push({ cparentesco: result.cparentesco });
          }
          this.relationshipList = this.relationshipList.filter((row) => { return row.cgrid != result.cgrid });
          for(let i = 0; i < this.relationshipList.length; i++){
            this.relationshipList[i].cgrid = i;
          }
          this.relationshipGridApi.setRowData(this.relationshipList);
        }
      }
    });
  }

  penaltyRowClicked(event: any){
    let penalty = {};
    if(this.editStatus){ 
      penalty = { 
        type: 1,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        cpenalizacion: event.data.cpenalizacion,
        ppenalizacion: event.data.ppenalizacion,
        mpenalizacion: event.data.mpenalizacion,
        fefectiva: event.data.fefectiva,
        delete: false
      };
    }else{ 
      penalty = { 
        type: 2,
        create: event.data.create,
        cgrid: event.data.cgrid,
        cpenalizacion: event.data.cpenalizacion,
        ppenalizacion: event.data.ppenalizacion,
        mpenalizacion: event.data.mpenalizacion,
        fefectiva: event.data.fefectiva,
        delete: false
      }; 
    }
    const modalRef = this.modalService.open(ClientPenaltyComponent);
    modalRef.componentInstance.penalty = penalty;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 1){
          for(let i = 0; i < this.penaltyList.length; i++){
            if(this.penaltyList[i].cgrid == result.cgrid){
              this.penaltyList[i].cpenalizacion = result.cpenalizacion;
              this.penaltyList[i].xpenalizacion = result.xpenalizacion;
              this.penaltyList[i].ppenalizacion = result.ppenalizacion;
              this.penaltyList[i].mpenalizacion = result.mpenalizacion;
              this.penaltyList[i].fefectiva = result.fefectiva;
              this.penaltyGridApi.refreshCells();
              return;
            }
          }
        }else if(result.type == 4){
          if(result.delete){
            this.penaltyDeletedRowList.push({ cpenalizacion: result.cpenalizacion });
          }
          this.penaltyList = this.penaltyList.filter((row) => { return row.cgrid != result.cgrid });
          for(let i = 0; i < this.penaltyList.length; i++){
            this.penaltyList[i].cgrid = i;
          }
          this.penaltyGridApi.setRowData(this.penaltyList);
        }
      }
    });
  }

  providerRowClicked(event: any){
    let provider = {};
    if(this.editStatus){ 
      provider = { 
        type: 1,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        cproveedor: event.data.cproveedor,
        xobservacion: event.data.xobservacion,
        fefectiva: event.data.fefectiva,
        delete: false
      };
    }else{ 
      provider = { 
        type: 2,
        create: event.data.create,
        cgrid: event.data.cgrid,
        cproveedor: event.data.cproveedor,
        xobservacion: event.data.xobservacion,
        fefectiva: event.data.fefectiva,
        delete: false
      }; 
    }
    const modalRef = this.modalService.open(ClientExcludedProviderComponent);
    modalRef.componentInstance.provider = provider;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 1){
          for(let i = 0; i < this.providerList.length; i++){
            if(this.providerList[i].cgrid == result.cgrid){
              this.providerList[i].cproveedor = result.cproveedor;
              this.providerList[i].xproveedor = result.xproveedor;
              this.providerList[i].xobservacion = result.xobservacion;
              this.providerList[i].fefectiva = result.fefectiva;
              this.providerGridApi.refreshCells();
              return;
            }
          }
        }else if(result.type == 4){
          if(result.delete){
            this.providerDeletedRowList.push({ cproveedor: result.cproveedor });
          }
          this.providerList = this.providerList.filter((row) => { return row.cgrid != result.cgrid });
          for(let i = 0; i < this.providerList.length; i++){
            this.providerList[i].cgrid = i;
          }
          this.providerGridApi.setRowData(this.providerList);
        }
      }
    });
  }

  modelRowClicked(event: any){
    let model = {};
    if(this.editStatus){ 
      model = { 
        type: 1,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        cmodelo: event.data.cmodelo,
        cmarca: event.data.cmarca,
        xobservacion: event.data.xobservacion,
        delete: false
      };
    }else{ 
      model = { 
        type: 2,
        create: event.data.create,
        cgrid: event.data.cgrid,
        cmodelo: event.data.cmodelo,
        cmarca: event.data.cmarca,
        xobservacion: event.data.xobservacion,
        delete: false
      }; 
    }
    const modalRef = this.modalService.open(ClientExcludedModelComponent);
    modalRef.componentInstance.model = model;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 1){
          for(let i = 0; i < this.modelList.length; i++){
            if(this.modelList[i].cgrid == result.cgrid){
              this.modelList[i].cmodelo = result.cmodelo;
              this.modelList[i].xmodelo = result.xmodelo;
              this.modelList[i].cmarca = result.cmarca;
              this.modelList[i].xmarca = result.xmarca;
              this.modelList[i].xobservacion = result.xobservacion;
              this.modelGridApi.refreshCells();
              return;
            }
          }
        }else if(result.type == 4){
          if(result.delete){
            this.modelDeletedRowList.push({ cmodelo: result.cmodelo });
          }
          this.modelList = this.modelList.filter((row) => { return row.cgrid != result.cgrid });
          for(let i = 0; i < this.modelList.length; i++){
            this.modelList[i].cgrid = i;
          }
          this.modelGridApi.setRowData(this.modelList);
        }
      }
    });
  }

  workerRowClicked(event: any){
    let worker = {};
    if(this.editStatus){ 
      worker = { 
        type: 1,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        ctrabajador: event.data.ctrabajador,
        xnombre: event.data.xnombre,
        xapellido: event.data.xapellido,
        ctipodocidentidad: event.data.ctipodocidentidad,
        xdocidentidad: event.data.xdocidentidad,
        xtelefonocelular: event.data.xtelefonocelular,
        xemail: event.data.xemail,
        xprofesion: event.data.xprofesion,
        xtelefonocasa: event.data.xtelefonocasa,
        xocupacion: event.data.xocupacion,
        xfax: event.data.xfax,
        cparentesco: event.data.cparentesco,
        cciudad: event.data.cciudad,
        cestado: event.data.cestado,
        xdireccion: event.data.xdireccion,
        fnacimiento: event.data.fnacimiento,
        cestadocivil: event.data.cestadocivil,
        relationships: this.relationshipList,
        delete: false
      };
    }else{ 
      worker = { 
        type: 2,
        create: event.data.create,
        cgrid: event.data.cgrid,
        ctrabajador: event.data.ctrabajador,
        xnombre: event.data.xnombre,
        xapellido: event.data.xapellido,
        ctipodocidentidad: event.data.ctipodocidentidad,
        xdocidentidad: event.data.xdocidentidad,
        xtelefonocelular: event.data.xtelefonocelular,
        xemail: event.data.xemail,
        xprofesion: event.data.xprofesion,
        xtelefonocasa: event.data.xtelefonocasa,
        xocupacion: event.data.xocupacion,
        xfax: event.data.xfax,
        cparentesco: event.data.cparentesco,
        cciudad: event.data.cciudad,
        cestado: event.data.cestado,
        xdireccion: event.data.xdireccion,
        fnacimiento: event.data.fnacimiento,
        cestadocivil: event.data.cestadocivil,
        relationships: this.relationshipList,
        delete: false
      }; 
    }
    const modalRef = this.modalService.open(ClientWorkerComponent);
    modalRef.componentInstance.worker = worker;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 1){
          for(let i = 0; i < this.workerList.length; i++){
            if(this.workerList[i].cgrid == result.cgrid){
              this.workerList[i].ctrabajador = result.ctrabajador;
              this.workerList[i].xnombre = result.xnombre;
              this.workerList[i].xapellido = result.xapellido;
              this.workerList[i].ctipodocidentidad = result.ctipodocidentidad;
              this.workerList[i].xdocidentidad = result.xdocidentidad;
              this.workerList[i].xtelefonocelular = result.xtelefonocelular;
              this.workerList[i].xemail = result.xemail;
              this.workerList[i].xprofesion = result.xprofesion;
              this.workerList[i].xtelefonocasa = result.xtelefonocasa;
              this.workerList[i].xocupacion = result.xocupacion;
              this.workerList[i].xfax = result.xfax;
              this.workerList[i].cparentesco = result.cparentesco;
              this.workerList[i].cciudad = result.cciudad;
              this.workerList[i].cestado = result.cestado;
              this.workerList[i].xdireccion = result.xdireccion;
              this.workerList[i].fnacimiento = result.fnacimiento;
              this.workerList[i].cestadocivil = result.cestadocivil;
              this.workerGridApi.refreshCells();
              return;
            }
          }
        }else if(result.type == 4){
          if(result.delete){
            this.workerDeletedRowList.push({ ctrabajador: result.ctrabajador });
          }
          this.workerList = this.workerList.filter((row) => { return row.cgrid != result.cgrid });
          for(let i = 0; i < this.workerList.length; i++){
            this.workerList[i].cgrid = i;
          }
          this.workerGridApi.setRowData(this.workerList);
        }
      }
    });
  }

  documentRowClicked(event: any){
    let document = {};
    if(this.editStatus){ 
      document = { 
        type: 1,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        cdocumento: event.data.cdocumento,
        xrutaarchivo: event.data.xrutaarchivo,
        delete: false
      };
    }else{ 
      document = { 
        type: 2,
        create: event.data.create,
        cgrid: event.data.cgrid,
        cdocumento: event.data.cdocumento,
        xrutaarchivo: event.data.xrutaarchivo,
        delete: false
      }; 
    }
    const modalRef = this.modalService.open(ClientDocumentComponent);
    modalRef.componentInstance.document = document;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 1){
          for(let i = 0; i < this.documentList.length; i++){
            if(this.documentList[i].cgrid == result.cgrid){
              this.documentList[i].cdocumento = result.cdocumento;
              this.documentList[i].xdocumento = result.xdocumento;
              this.documentList[i].xrutaarchivo = result.xrutaarchivo;
              this.documentGridApi.refreshCells();
              return;
            }
          }
        }else if(result.type == 4){
          if(result.delete){
            this.documentDeletedRowList.push({ cdocumento: result.cdocumento });
          }
          this.documentList = this.documentList.filter((row) => { return row.cgrid != result.cgrid });
          for(let i = 0; i < this.documentList.length; i++){
            this.documentList[i].cgrid = i;
          }
          this.documentGridApi.setRowData(this.documentList);
        }
      }
    });
  }

  grouperRowClicked(event: any){
    let grouper = {};
    if(this.editStatus){ 
      grouper = { 
        type: 1,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        cagrupador: event.data.cagrupador,
        xcontratoalternativo: event.data.xcontratoalternativo,
        xnombre: event.data.xnombre,
        xrazonsocial: event.data.xrazonsocial,
        cestado: event.data.cestado,
        cciudad: event.data.cciudad,
        xdireccionfiscal: event.data.xdireccionfiscal,
        ctipodocidentidad: event.data.ctipodocidentidad,
        xdocidentidad: event.data.xdocidentidad,
        bfacturar: event.data.bfacturar,
        bcontribuyente: event.data.bcontribuyente,
        bimpuesto: event.data.bimpuesto,
        xtelefono: event.data.xtelefono,
        xfax: event.data.xfax,
        xemail: event.data.xemail,
        xrutaimagen: event.data.xrutaimagen,
        bactivo: event.data.bactivo,
        banks: event.data.banks,
        delete: false
      };
    }else{ 
      grouper = { 
        type: 2,
        create: event.data.create,
        cgrid: event.data.cgrid,
        cagrupador: event.data.cagrupador,
        xcontratoalternativo: event.data.xcontratoalternativo,
        xnombre: event.data.xnombre,
        xrazonsocial: event.data.xrazonsocial,
        cestado: event.data.cestado,
        cciudad: event.data.cciudad,
        xdireccionfiscal: event.data.xdireccionfiscal,
        ctipodocidentidad: event.data.ctipodocidentidad,
        xdocidentidad: event.data.xdocidentidad,
        bfacturar: event.data.bfacturar,
        bcontribuyente: event.data.bcontribuyente,
        bimpuesto: event.data.bimpuesto,
        xtelefono: event.data.xtelefono,
        xfax: event.data.xfax,
        xemail: event.data.xemail,
        xrutaimagen: event.data.xrutaimagen,
        bactivo: event.data.bactivo,
        banks: event.data.banks,
        delete: false
      }; 
    }
    const modalRef = this.modalService.open(ClientGrouperComponent, { size: 'xl' });
    modalRef.componentInstance.grouper = grouper;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 1){
          for(let i = 0; i < this.grouperList.length; i++){
            if(this.grouperList[i].cgrid == result.cgrid){
              this.grouperList[i].xcontratoalternativo = result.xcontratoalternativo;
              this.grouperList[i].xnombre = result.xnombre;
              this.grouperList[i].xrazonsocial = result.xrazonsocial;
              this.grouperList[i].cestado = result.cestado;
              this.grouperList[i].cciudad = result.cciudad;
              this.grouperList[i].xdireccionfiscal = result.xdireccionfiscal;
              this.grouperList[i].ctipodocidentidad = result.ctipodocidentidad;
              this.grouperList[i].xdocidentidad = result.xdocidentidad;
              this.grouperList[i].bfacturar = result.bfacturar;
              this.grouperList[i].bcontribuyente = result.bcontribuyente;
              this.grouperList[i].bimpuesto = result.bimpuesto;
              this.grouperList[i].xtelefono = result.xtelefono;
              this.grouperList[i].xfax = result.xfax;
              this.grouperList[i].xemail = result.xemail;
              this.grouperList[i].xrutaimagen = result.xrutaimagen;
              this.grouperList[i].bactivo = result.bactivo;
              this.grouperList[i].banks = result.banks;
              this.grouperList[i].banksResult = result.banksResult;
              this.documentGridApi.refreshCells();
              return;
            }
          }
        }else if(result.type == 4){
          if(result.delete){
            this.grouperDeletedRowList.push({ cagrupador: result.cagrupador });
          }
          this.grouperList = this.grouperList.filter((row) => { return row.cgrid != result.cgrid });
          for(let i = 0; i < this.grouperList.length; i++){
            this.grouperList[i].cgrid = i;
          }
          this.grouperGridApi.setRowData(this.grouperList);
        }
      }
    });
  }

  planRowClicked(event: any){
    let plan = {};
    if(this.editStatus){ 
      plan = { 
        type: 1,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        cplancliente: event.data.cplancliente,
        cplan: event.data.cplan,
        xplan: event.data.xplan,
        casociado: event.data.casociado,
        ctipoplan: event.data.ctipoplan,
        fdesde: event.data.fdesde,
        fhasta: event.data.fhasta,
        associates: this.associateList,
        delete: false
      };
    }else{ 
      plan = { 
        type: 2,
        create: event.data.create,
        cgrid: event.data.cgrid,
        cplancliente: event.data.cplancliente,
        cplan: event.data.cplan,
        xplan: event.data.xplan,
        casociado: event.data.casociado,
        ctipoplan: event.data.ctipoplan,
        fdesde: event.data.fdesde,
        fhasta: event.data.fhasta,
        associates: this.associateList,
        delete: false
      }; 
    }
    const modalRef = this.modalService.open(ClientPlanComponent);
    modalRef.componentInstance.plan = plan;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 1){
          for(let i = 0; i < this.planList.length; i++){
            if(this.planList[i].cgrid == result.cgrid){
              this.planList[i].cplan = result.cplan;
              this.planList[i].xplan = result.xplan;
              this.planList[i].casociado = result.casociado;
              this.planList[i].xasociado = result.xasociado;
              this.planList[i].ctipoplan = result.ctipoplan;
              this.planList[i].xtipoplan = result.xtipoplan;
              this.planList[i].fdesde = result.fdesde;
              this.planList[i].fhasta = result.fhasta;
              this.planGridApi.refreshCells();
              return;
            }
          }
        }else if(result.type == 4){
          if(result.delete){
            this.planDeletedRowList.push({ cplancliente: result.cplancliente });
          }
          this.planList = this.planList.filter((row) => { return row.cgrid != result.cgrid });
          for(let i = 0; i < this.planList.length; i++){
            this.planList[i].cgrid = i;
          }
          this.planGridApi.setRowData(this.planList);
        }
      }
    });
  }

  onBanksGridReady(event){
    this.bankGridApi = event.api;
  }

  onAssociatesGridReady(event){
    this.associateGridApi = event.api;
  }

  onBondsGridReady(event){
    this.bondGridApi = event.api;
  }

  onContactsGridReady(event){
    this.contactGridApi = event.api;
  }

  onBrokersGridReady(event){
    this.brokerGridApi = event.api;
  }

  onDepreciationsGridReady(event){
    this.depreciationGridApi = event.api;
  }

  onRelationshipsGridReady(event){
    this.relationshipGridApi = event.api;
  }

  onPenaltiesGridReady(event){
    this.penaltyGridApi = event.api;
  }

  onProvidersGridReady(event){
    this.providerGridApi = event.api;
  }

  onModelsGridReady(event){
    this.modelGridApi = event.api;
  }

  onWorkersGridReady(event){
    this.workerGridApi = event.api;
  }

  onDocumentsGridReady(event){
    this.documentGridApi = event.api;
  }

  onGroupersGridReady(event){
    this.grouperGridApi = event.api;
  }

  onPlansGridReady(event){
    this.planGridApi = event.api;
  }

  onFileSelect(event){
    const file = event.target.files[0];
    this.detail_form.get('ximagen').setValue(file);
  }

  async onSubmit(form): Promise<void>{
    this.submitted = true;
    this.loading = true;
    if(this.detail_form.invalid){
      this.loading = false;
      return;
    }
    if(!this.detail_form.get('ximagen').value){
      this.saveDetailForm(form);
    }else{
      const formData = new FormData();
      formData.append('ximagen', this.detail_form.get('ximagen').value);
      formData.append('agentId', '007');
      let request = await this.webService.uploadFile(formData);
      if(request.error){
        this.alert.message = "CLIENTS.CLIENTS.CANTUPLOADIMAGE";
        this.alert.type = 'danger';
        this.alert.show = true;
        this.loading = false;
      }
      if(request.data.status){
        this.xrutaimagen = `${environment.apiUrl}/images/${request.data.uploadedFile.filename}`;
        this.saveDetailForm(form);
      }
    }
  }

  async saveDetailForm(form): Promise<void>{
    let params;
    let request;
    if(this.code){
      let updateBankList = this.bankList.filter((row) => { return !row.create; });
      for(let i = 0; i < updateBankList.length; i++){
        delete updateBankList[i].cgrid;
        delete updateBankList[i].create;
        delete updateBankList[i].xbanco;
        delete updateBankList[i].xprincipal;
        delete updateBankList[i].xtipocuentabancaria;
      }
      let createBankList = this.bankList.filter((row) => { return row.create; });
      for(let i = 0; i < createBankList.length; i++){
        delete createBankList[i].cgrid;
        delete createBankList[i].create;
        delete createBankList[i].xbanco;
        delete createBankList[i].xprincipal;
        delete createBankList[i].xtipocuentabancaria;
      }
      let updateAssociateList = this.associateList.filter((row) => { return !row.create; });
      for(let i = 0; i < updateAssociateList.length; i++){
        delete updateAssociateList[i].cgrid;
        delete updateAssociateList[i].create;
        delete updateAssociateList[i].xasociado;
      }
      let createAssociateList = this.associateList.filter((row) => { return row.create; });
      for(let i = 0; i < createAssociateList.length; i++){
        delete createAssociateList[i].cgrid;
        delete createAssociateList[i].create;
        delete createAssociateList[i].xasociado;
      }
      let updateBondList = this.bondList.filter((row) => { return !row.create; });
      for(let i = 0; i < updateBondList.length; i++){
        updateBondList[i].fefectiva = new Date(updateBondList[i].fefectiva).toUTCString();
        delete updateBondList[i].cgrid;
        delete updateBondList[i].create;
      }
      let createBondList = this.bondList.filter((row) => { return row.create; });
      for(let i = 0; i < createBondList.length; i++){
        createBondList[i].fefectiva = new Date(createBondList[i].fefectiva).toUTCString();
        delete createBondList[i].cgrid;
        delete createBondList[i].create;
      }
      let updateContactList = this.contactList.filter((row) => { return !row.create; });
      for(let i = 0; i < updateContactList.length; i++){
        delete updateContactList[i].cgrid;
        delete updateContactList[i].create;
      }
      let createContactList = this.contactList.filter((row) => { return row.create; });
      for(let i = 0; i < createContactList.length; i++){
        delete createContactList[i].cgrid;
        delete createContactList[i].create;
      }
      let updateBrokerList = this.brokerList.filter((row) => { return !row.create; });
      for(let i = 0; i < updateBrokerList.length; i++){
        updateBrokerList[i].fefectiva = new Date(updateBrokerList[i].fefectiva).toUTCString();
        delete updateBrokerList[i].cgrid;
        delete updateBrokerList[i].create;
        delete updateBrokerList[i].xcorredor;
      }
      let createBrokerList = this.brokerList.filter((row) => { return row.create; });
      for(let i = 0; i < createBrokerList.length; i++){
        createBrokerList[i].fefectiva = new Date(createBrokerList[i].fefectiva).toUTCString();
        delete createBrokerList[i].cgrid;
        delete createBrokerList[i].create;
        delete createBrokerList[i].xcorredor;
      }
      let updateDepreciationList = this.depreciationList.filter((row) => { return !row.create; });
      for(let i = 0; i < updateDepreciationList.length; i++){
        updateDepreciationList[i].fefectiva = new Date(updateDepreciationList[i].fefectiva).toUTCString();
        delete updateDepreciationList[i].cgrid;
        delete updateDepreciationList[i].create;
        delete updateDepreciationList[i].xdepreciacion;
      }
      let createDepreciationList = this.depreciationList.filter((row) => { return row.create; });
      for(let i = 0; i < createDepreciationList.length; i++){
        createDepreciationList[i].fefectiva = new Date(createDepreciationList[i].fefectiva).toUTCString();
        delete createDepreciationList[i].cgrid;
        delete createDepreciationList[i].create;
        delete createDepreciationList[i].xdepreciacion;
      }
      let updateRelationshipList = this.relationshipList.filter((row) => { return !row.create; });
      for(let i = 0; i < updateRelationshipList.length; i++){
        updateRelationshipList[i].fefectiva = new Date(updateRelationshipList[i].fefectiva).toUTCString();
        delete updateRelationshipList[i].cgrid;
        delete updateRelationshipList[i].create;
        delete updateRelationshipList[i].xparentesco;
      }
      let createRelationshipList = this.relationshipList.filter((row) => { return row.create; });
      for(let i = 0; i < createRelationshipList.length; i++){
        createRelationshipList[i].fefectiva = new Date(createRelationshipList[i].fefectiva).toUTCString();
        delete createRelationshipList[i].cgrid;
        delete createRelationshipList[i].create;
        delete createRelationshipList[i].xparentesco;
      }
      let updatePenaltyList = this.penaltyList.filter((row) => { return !row.create; });
      for(let i = 0; i < updatePenaltyList.length; i++){
        updatePenaltyList[i].fefectiva = new Date(updatePenaltyList[i].fefectiva).toUTCString();
        delete updatePenaltyList[i].cgrid;
        delete updatePenaltyList[i].create;
        delete updatePenaltyList[i].xpenalizacion;
      }
      let createPenaltyList = this.penaltyList.filter((row) => { return row.create; });
      for(let i = 0; i < createPenaltyList.length; i++){
        createPenaltyList[i].fefectiva = new Date(createPenaltyList[i].fefectiva).toUTCString();
        delete createPenaltyList[i].cgrid;
        delete createPenaltyList[i].create;
        delete createPenaltyList[i].xpenalizacion;
      }
      let updateProviderList = this.providerList.filter((row) => { return !row.create; });
      for(let i = 0; i < updateProviderList.length; i++){
        updateProviderList[i].fefectiva = new Date(updateProviderList[i].fefectiva).toUTCString();
        delete updateProviderList[i].cgrid;
        delete updateProviderList[i].create;
        delete updateProviderList[i].xproveedor;
      }
      let createProviderList = this.providerList.filter((row) => { return row.create; });
      for(let i = 0; i < createProviderList.length; i++){
        createProviderList[i].fefectiva = new Date(createProviderList[i].fefectiva).toUTCString();
        delete createProviderList[i].cgrid;
        delete createProviderList[i].create;
        delete createProviderList[i].xproveedor;
      }
      let updateModelList = this.modelList.filter((row) => { return !row.create; });
      for(let i = 0; i < updateModelList.length; i++){
        delete updateModelList[i].cgrid;
        delete updateModelList[i].create;
        delete updateModelList[i].xmarca;
        delete updateModelList[i].xmodelo;
      }
      let createModelList = this.modelList.filter((row) => { return row.create; });
      for(let i = 0; i < createModelList.length; i++){
        delete createModelList[i].cgrid;
        delete createModelList[i].create;
        delete createModelList[i].xmarca;
        delete createModelList[i].xmodelo;
      }
      let updateWorkerList = this.workerList.filter((row) => { return !row.create; });
      for(let i = 0; i < updateWorkerList.length; i++){
        updateWorkerList[i].fnacimiento = new Date(updateWorkerList[i].fnacimiento).toUTCString();
        delete updateWorkerList[i].cgrid;
        delete updateWorkerList[i].create;
      }
      let createWorkerList = this.workerList.filter((row) => { return row.create; });
      for(let i = 0; i < createWorkerList.length; i++){
        createWorkerList[i].fnacimiento = new Date(createWorkerList[i].fnacimiento).toUTCString();
        delete createWorkerList[i].cgrid;
        delete createWorkerList[i].create;
      }
      let updateDocumentList = this.documentList.filter((row) => { return !row.create; });
      for(let i = 0; i < updateDocumentList.length; i++){
        delete updateDocumentList[i].cgrid;
        delete updateDocumentList[i].create;
        delete updateDocumentList[i].xdocumento;
      }
      let createDocumentList = this.documentList.filter((row) => { return row.create; });
      for(let i = 0; i < createDocumentList.length; i++){
        delete createDocumentList[i].cgrid;
        delete createDocumentList[i].create;
        delete createDocumentList[i].xdocumento;
      }
      let updateGrouperList = this.grouperList.filter((row) => { return !row.create; });
      for(let i = 0; i < updateGrouperList.length; i++){
        delete updateGrouperList[i].cgrid;
        delete updateGrouperList[i].create;
        updateGrouperList[i].banks = updateGrouperList[i].banksResult;
        delete updateGrouperList[i].banksResult;
        if(updateGrouperList[i].banks && updateGrouperList[i].banks.create){
          for(let j = 0; j < updateGrouperList[i].banks.create.length; j++){
            delete updateGrouperList[i].banks.create[j].cgrid;
            delete updateGrouperList[i].banks.create[j].create;
            delete updateGrouperList[i].banks.create[j].xbanco;
            delete updateGrouperList[i].banks.create[j].xprincipal;
            delete updateGrouperList[i].banks.create[j].xtipocuentabancaria;
          }
        }
        if(updateGrouperList[i].banks && updateGrouperList[i].banks.update){
          for(let j = 0; j < updateGrouperList[i].banks.update.length; j++){
            delete updateGrouperList[i].banks.update[j].cgrid;
            delete updateGrouperList[i].banks.update[j].create;
            delete updateGrouperList[i].banks.update[j].xbanco;
            delete updateGrouperList[i].banks.update[j].xprincipal;
            delete updateGrouperList[i].banks.update[j].xtipocuentabancaria;
          }
        }
      }
      let createGrouperList = this.grouperList.filter((row) => { return row.create; });
      for(let i = 0; i < createGrouperList.length; i++){
        delete createGrouperList[i].cgrid;
        delete createGrouperList[i].create;
        if(createGrouperList[i].banks){
          for(let j = 0; j < createGrouperList[i].banks.length; j++){
            delete createGrouperList[i].banks[j].cgrid;
            delete createGrouperList[i].banks[j].create;
            delete createGrouperList[i].banks[j].xbanco;
            delete createGrouperList[i].banks[j].xprincipal;
            delete createGrouperList[i].banks[j].xtipocuentabancaria;
          }
        }
      }
      let updatePlanList = this.planList.filter((row) => { return !row.create; });
      for(let i = 0; i < updatePlanList.length; i++){
        updatePlanList[i].fdesde = new Date(updatePlanList[i].fdesde).toUTCString();
        updatePlanList[i].fhasta = new Date(updatePlanList[i].fhasta).toUTCString();
        delete updatePlanList[i].cgrid;
        delete updatePlanList[i].create;
        delete updatePlanList[i].xasociado;
        delete updatePlanList[i].xplan;
        delete updatePlanList[i].xtipoplan;
      }
      let createPlanList = this.planList.filter((row) => { return row.create; });
      for(let i = 0; i < createPlanList.length; i++){
        createPlanList[i].fdesde = new Date(createPlanList[i].fdesde).toUTCString();
        createPlanList[i].fhasta = new Date(createPlanList[i].fhasta).toUTCString();
        delete createPlanList[i].cgrid;
        delete createPlanList[i].create;
        delete createPlanList[i].xasociado;
        delete createPlanList[i].xplan;
        delete createPlanList[i].xtipoplan;
      }
      params = {
        permissionData: {
          cusuario: this.currentUser.data.cusuario,
          cmodulo: 59
        },
        ccliente: this.code,
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania,
        xcliente: form.xcliente,
        xcontrato: form.xcontrato,
        xrepresentante: form.xrepresentante,
        cempresa: form.cempresa,
        cactividadempresa: form.cactividadempresa,
        ctipodocidentidad: form.ctipodocidentidad,
        xdocidentidad: form.xdocidentidad,
        cestado: form.cestado,
        cciudad: form.cciudad,
        xdireccionfiscal: form.xdireccionfiscal,
        xemail: form.xemail,
        fanomaximo: form.fanomaximo,
        finicio: new Date(form.finicio).toUTCString(),
        xtelefono: form.xtelefono ? form.xtelefono : undefined,
        bcolectivo: form.bcolectivo,
        bfacturar: form.bfacturar,
        bfinanciar: form.bfinanciar,
        bcontribuyente: form.bcontribuyente,
        bimpuesto: form.bimpuesto,
        bnotificacionsms: form.bnotificacionsms,
        xpaginaweb: form.xpaginaweb ? form.xpaginaweb : undefined,
        ctipopago: form.ctipopago,
        ifacturacion: form.ifacturacion,
        bactivo: form.bactivo,
        xrutaimagen: this.xrutaimagen ? this.xrutaimagen : undefined,
        cusuariomodificacion: this.currentUser.data.cusuario,
        banks: {
          create: createBankList,
          update: updateBankList,
          delete: this.bankDeletedRowList
        },
        associates: {
          create: createAssociateList,
          update: updateAssociateList,
          delete: this.associateDeletedRowList
        },
        bonds: {
          create: createBondList,
          update: updateBondList,
          delete: this.bondDeletedRowList
        },
        contacts: {
          create: createContactList,
          update: updateContactList,
          delete: this.contactDeletedRowList
        },
        brokers: {
          create: createBrokerList,
          update: updateBrokerList,
          delete: this.brokerDeletedRowList
        },
        depreciations: {
          create: createDepreciationList,
          update: updateDepreciationList,
          delete: this.depreciationDeletedRowList
        },
        relationships: {
          create: createRelationshipList,
          update: updateRelationshipList,
          delete: this.relationshipDeletedRowList
        },
        penalties: {
          create: createPenaltyList,
          update: updatePenaltyList,
          delete: this.penaltyDeletedRowList
        },
        providers: {
          create: createProviderList,
          update: updateProviderList,
          delete: this.providerDeletedRowList
        },
        models: {
          create: createModelList,
          update: updateModelList,
          delete: this.modelDeletedRowList
        },
        workers: {
          create: createWorkerList,
          update: updateWorkerList,
          delete: this.workerDeletedRowList
        },
        documents: {
          create: createDocumentList,
          update: updateDocumentList,
          delete: this.documentDeletedRowList
        },
        groupers: {
          create: createGrouperList,
          update: updateGrouperList,
          delete: this.grouperDeletedRowList
        },
        plans: {
          create: createPlanList,
          update: updatePlanList,
          delete: this.planDeletedRowList
        }
      };
      request = await this.webService.updateClient(params);
    }else{
      let createBanksList = this.bankList;
      for(let i = 0; i < createBanksList.length; i++){
        delete createBanksList[i].cgrid;
        delete createBanksList[i].create;
        delete createBanksList[i].xbanco;
        delete createBanksList[i].xprincipal;
        delete createBanksList[i].xtipocuentabancaria;
      }
      let createAssociatesList = this.associateList;
      for(let i = 0; i < createAssociatesList.length; i++){
        delete createAssociatesList[i].cgrid;
        delete createAssociatesList[i].create;
        delete createAssociatesList[i].xasociado;
      }
      let createBondsList = this.bondList;
      for(let i = 0; i < createBondsList.length; i++){
        delete createBondsList[i].cgrid;
        delete createBondsList[i].create;
      }
      let createContactsList = this.contactList;
      for(let i = 0; i < createContactsList.length; i++){
        delete createContactsList[i].cgrid;
        delete createContactsList[i].create;
      }
      let createBrokersList = this.brokerList;
      for(let i = 0; i < createBrokersList.length; i++){
        delete createBrokersList[i].cgrid;
        delete createBrokersList[i].create;
        delete createBrokersList[i].xcorredor;
      }
      let createDepreciationsList = this.depreciationList;
      for(let i = 0; i < createDepreciationsList.length; i++){
        delete createDepreciationsList[i].cgrid;
        delete createDepreciationsList[i].create;
        delete createDepreciationsList[i].xdepreciacion;
      }
      let createRelationshipsList = this.relationshipList;
      for(let i = 0; i < createRelationshipsList.length; i++){
        delete createRelationshipsList[i].cgrid;
        delete createRelationshipsList[i].create;
        delete createRelationshipsList[i].xparentesco;
      }
      let createPenaltiesList = this.penaltyList;
      for(let i = 0; i < createPenaltiesList.length; i++){
        delete createPenaltiesList[i].cgrid;
        delete createPenaltiesList[i].create;
        delete createPenaltiesList[i].xpenalizacion;
      }
      let createProvidersList = this.providerList;
      for(let i = 0; i < createProvidersList.length; i++){
        delete createProvidersList[i].cgrid;
        delete createProvidersList[i].create;
        delete createProvidersList[i].xproveedor;
      }
      let createModelsList = this.modelList;
      for(let i = 0; i < createModelsList.length; i++){
        delete createModelsList[i].cgrid;
        delete createModelsList[i].create;
        delete createModelsList[i].xmarca;
        delete createModelsList[i].xmodelo;
      }
      let createWorkersList = this.workerList;
      for(let i = 0; i < createWorkersList.length; i++){
        delete createWorkersList[i].cgrid;
        delete createWorkersList[i].create;
      }
      let createDocumentsList = this.documentList;
      for(let i = 0; i < createDocumentsList.length; i++){
        delete createDocumentsList[i].cgrid;
        delete createDocumentsList[i].create;
        delete createDocumentsList[i].xdocumento;
      }
      let createGroupersList = this.grouperList;
      for(let i = 0; i < createGroupersList.length; i++){
        delete createGroupersList[i].cgrid;
        delete createGroupersList[i].create;
        if(createGroupersList[i].banks){
          for(let j = 0; j < createGroupersList[i].banks.length; j++){
            delete createGroupersList[i].banks[j].cgrid;
            delete createGroupersList[i].banks[j].create;
            delete createGroupersList[i].banks[j].xbanco;
            delete createGroupersList[i].banks[j].xprincipal;
            delete createGroupersList[i].banks[j].xtipocuentabancaria;
          }
        }
      }
      let createPlansList = this.planList;
      for(let i = 0; i < createPlansList.length; i++){
        delete createPlansList[i].cgrid;
        delete createPlansList[i].create;
        delete createPlansList[i].xasociado;
        delete createPlansList[i].xplan;
        delete createPlansList[i].xtipoplan;
      }
      params = {
        permissionData: {
          cusuario: this.currentUser.data.cusuario,
          cmodulo: 59
        },
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania,
        xcliente: form.xcliente,
        xcontrato: form.xcontrato,
        xrepresentante: form.xrepresentante,
        cempresa: form.cempresa,
        cactividadempresa: form.cactividadempresa,
        ctipodocidentidad: form.ctipodocidentidad,
        xdocidentidad: form.xdocidentidad,
        cestado: form.cestado,
        cciudad: form.cciudad,
        xdireccionfiscal: form.xdireccionfiscal,
        xemail: form.xemail,
        fanomaximo: form.fanomaximo,
        finicio: new Date(form.finicio).toUTCString(),
        xtelefono: form.xtelefono ? form.xtelefono : undefined,
        bcolectivo: form.bcolectivo,
        bfacturar: form.bfacturar,
        bfinanciar: form.bfinanciar,
        bcontribuyente: form.bcontribuyente,
        bimpuesto: form.bimpuesto,
        bnotificacionsms: form.bnotificacionsms,
        xpaginaweb: form.xpaginaweb ? form.xpaginaweb : undefined,
        ctipopago: form.ctipopago,
        ifacturacion: form.ifacturacion,
        bactivo: form.bactivo,
        xrutaimagen: this.xrutaimagen ? this.xrutaimagen : undefined,
        cusuariocreacion: this.currentUser.data.cusuario,
        banks: createBanksList,
        associates: createAssociatesList,
        bonds: createBondsList,
        contacts: createContactsList,
        brokers: createBrokersList,
        depreciations: createDepreciationsList,
        relationships: createRelationshipsList,
        penalties: createPenaltiesList,
        providers: createProvidersList,
        models: createModelsList,
        workers: createWorkersList,
        documents: createDocumentsList,
        groupers: createGroupersList,
        plans: createPlansList
      };
      request = await this.webService.createClient(params);
    }
    if(request.error){
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
        this.router.navigate([`/clients/client-detail/${request.data.ccliente}`]);
      }
    }else{
      let condition = request.data.condition;
      if(condition == "identification-document-already-exist"){
        this.alert.message = "CLIENTS.CLIENTS.IDENTIFICATIONDOCUMENTALREADYEXIST";
        this.alert.type = 'danger';
        this.alert.show = true;
      }
    }
    this.loading = false;
    return;
  }

}
