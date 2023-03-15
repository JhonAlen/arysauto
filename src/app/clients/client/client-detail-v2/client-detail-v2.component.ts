import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
import { AuthenticationService } from '@services/authentication.service';
import { environment } from '@environments/environment';



@Component({
  selector: 'app-client-detail-v2',
  templateUrl: './client-detail-v2.component.html',
  styleUrls: ['./client-detail-v2.component.css']
})
export class ClientDetailV2Component implements OnInit {
  fileName = '';


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
  imageUrl: string
  detail_form: UntypedFormGroup;
  upload_form: UntypedFormGroup;
  loading: boolean = false;
  loading_cancel: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  keyword = 'value';
  canCreate: boolean = false;
  canDetail: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;
  code;
  showSaveButton: boolean = false;
  showEditButton: boolean = false;
  editStatus: boolean = false;
  xrutaimagen: string;
  stateList: any[] = [];
  cityList: any[] = [];
  documentTypeList: any[] = [];
  businessActivityList: any[] = [];
  enterpriseList: any[] = [];
  paymentTypeList: any[] = [];
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

  constructor(private formBuilder: UntypedFormBuilder,
              private authenticationService: AuthenticationService, 
              private router: Router,
              private http: HttpClient,
              private translate: TranslateService,
              private activatedRoute: ActivatedRoute,
              private modalService : NgbModal) { }

  ngOnInit(): void {
    this.detail_form = this.formBuilder.group({
      xcliente: [''],
      xrepresentante: [''],
      icedula: [''],
      xdocidentidad: [''],
      cestado: [''],
      cciudad: [''],
      xdireccionfiscal: [''],
      xemail: ['', Validators.compose([
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])],
      finicio: [''],
      xtelefono: [''],
      xpaginaweb: [''],
      ximagen: [''],
      bactivo: [true]
    });

    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 59
      }
      this.http.post(`${environment.apiUrl}/api/security/verify-module-permission`, params, options).subscribe((response : any) => {
        if(response.data.status){
          this.canCreate = response.data.bcrear;
          this.canDetail = response.data.bdetalle;
          this.canEdit = response.data.beditar;
          this.canDelete = response.data.beliminar;
          this.initializeDropdownDataRequest();
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

  onFileSelected(event) {

    const file:File = event.target.files[0];

    if (file) {

        this.fileName = file.name;

        const formData = new FormData();

        formData.append("thumbnail", file);

        const upload$ = this.http.post(environment.apiUrl + '/api/upload/image', formData);

        upload$.subscribe();
    }
    console.log(file)
  }

  initializeDropdownDataRequest(){
    this.getStateData();
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

  getStateData(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cpais: this.currentUser.data.cpais
    }
    this.http.post(`${environment.apiUrl}/api/valrep/state`, params, options).subscribe((response: any) => {
      if(response.data.status){
        this.stateList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.stateList.push({ 
            id: response.data.list[i].cestado,
            value: response.data.list[i].xestado,
          });
        }
        this.stateList.sort((a, b) => a.value > b.value ? 1 : -1)
      }
      },);
  }

  getCityData(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cpais: this.currentUser.data.cpais,
      cestado: this.detail_form.get('cestado').value
    }
    this.http.post(`${environment.apiUrl}/api/valrep/city`, params, options).subscribe((response: any) => {
      if(response.data.status){
        this.cityList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.cityList.push({ 
            id: response.data.list[i].cciudad,
            value: response.data.list[i].xciudad,
          });
        }
        this.cityList.sort((a, b) => a.value > b.value ? 1 : -1)
      }
      },);
  }

  getClientData(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania,
      ccliente: this.code
    }
    this.http.post(`${environment.apiUrl}/api/client/detail`, params, options).subscribe((response: any) => {
      if(response.data.status){
        this.detail_form.get('xcliente').setValue(response.data.xcliente);
        this.detail_form.get('xcliente').disable();
        this.detail_form.get('xrepresentante').setValue(response.data.xrepresentante);
        this.detail_form.get('xrepresentante').disable();
        this.detail_form.get('icedula').setValue(response.data.icedula);
        this.detail_form.get('icedula').disable();
        this.detail_form.get('xdocidentidad').setValue(response.data.xdocidentidad);
        this.detail_form.get('xdocidentidad').disable();
        this.detail_form.get('cestado').setValue(response.data.cestado);
        this.detail_form.get('cestado').disable();
        this.detail_form.get('cciudad').setValue(response.data.cciudad);
        this.detail_form.get('cciudad').disable();
        this.cityList.push({ id: response.data.cciudad, value: response.data.xciudad});
        this.detail_form.get('xdireccionfiscal').setValue(response.data.xdireccionfiscal);
        this.detail_form.get('xdireccionfiscal').disable();
        this.detail_form.get('xemail').setValue(response.data.xemail);
        this.detail_form.get('xemail').disable();
        if(response.data.finicio){
          let dateFormat = new Date(response.data.finicio).toISOString().substring(0, 10);
          this.detail_form.get('finicio').setValue(dateFormat);
          this.detail_form.get('finicio').disable();
        }
        response.data.xtelefono ? this.detail_form.get('xtelefono').setValue(response.data.xtelefono) : false;
        this.detail_form.get('xtelefono').disable();
        response.data.xpaginaweb ? this.detail_form.get('xpaginaweb').setValue(response.data.xpaginaweb) : false;
        this.detail_form.get('xpaginaweb').disable();
        this.detail_form.get('bactivo').setValue(response.data.bactivo);
        this.detail_form.get('bactivo').disable();
        response.data.xrutaimagen ? this.xrutaimagen = response.data.xrutaimagen : this.xrutaimagen = '';
        this.bankList = [];
        if(response.data.banks){
          for(let i =0; i < response.data.banks.length; i++){
            this.bankList.push({
              cgrid: i,
              create: false,
              cbanco: response.data.banks[i].cbanco,
              xbanco: response.data.banks[i].xbanco,
              ctipocuentabancaria: response.data.banks[i].ctipocuentabancaria,
              xtipocuentabancaria: response.data.banks[i].xtipocuentabancaria,
              xnumerocuenta: response.data.banks[i].xnumerocuenta,
              bprincipal: response.data.banks[i].bprincipal,
              xprincipal: response.data.banks[i].bprincipal ? this.translate.instant("DROPDOWN.YES") : this.translate.instant("DROPDOWN.NO")
            });
          }
        }
        this.associateList = [];
        if(response.data.associates){
          for(let i =0; i < response.data.associates.length; i++){
            this.associateList.push({
              cgrid: i,
              create: false,
              casociado: response.data.associates[i].casociado,
              xasociado: response.data.associates[i].xasociado
            });
          }
        }
        this.contactList = [];
        if(response.data.contacts){
          for(let i =0; i < response.data.contacts.length; i++){
            this.contactList.push({
              cgrid: i,
              create: false,
              ccontacto: response.data.contacts[i].ccontacto,
              xnombre: response.data.contacts[i].xnombre,
              xapellido: response.data.contacts[i].xapellido,
              icedula: response.data.contacts[i].icedula,
              xdocidentidad: response.data.contacts[i].xdocidentidad,
              xtelefonocelular: response.data.contacts[i].xtelefonocelular,
              xemail: response.data.contacts[i].xemail,
              xcargo: response.data.contacts[i].xcargo ? response.data.contacts[i].xcargo : undefined,
              xtelefonooficina: response.data.contacts[i].xtelefonooficina ? response.data.contacts[i].xtelefonooficina : undefined,
              xtelefonocasa: response.data.contacts[i].xtelefonocasa ? response.data.contacts[i].xtelefonocasa : undefined
            });
          }
        }
        this.documentList = [];
        if(response.data.documents){
          for(let i =0; i < response.data.documents.length; i++){
            this.documentList.push({
              cgrid: i,
              create: false,
              xdocumento: response.data.documents[i].xdocumento,
              xrutaarchivo: response.data.documents[i].xrutaarchivo
            });
          }
        }
      }
      },);
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
            bprincipal: result.bprincipal,
            xprincipal: result.bprincipal ? this.translate.instant("DROPDOWN.YES") : this.translate.instant("DROPDOWN.NO")
          });
          this.bankGridApi.setRowData(this.bankList);
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
        bprincipal: event.data.bprincipal,
        delete: false
      }; 
    }
    const modalRef = this.modalService.open(ClientBankComponent);
    modalRef.componentInstance.bank = bank;
    modalRef.result.then((result: any) => {
      if(result){
        for(let i = 0; i < this.bankList.length; i++){
          if(this.bankList[i].cgrid == result.cgrid){
            this.bankList[i].cbanco = result.cbanco;
            this.bankList[i].xbanco = result.xbanco;
            this.bankList[i].ctipocuentabancaria = result.ctipocuentabancaria;
            this.bankList[i].xtipocuentabancaria = result.xtipocuentabancaria;
            this.bankList[i].xnumerocuenta = result.xnumerocuenta;
            this.bankList[i].bprincipal = result.bprincipal;
            this.bankList[i].xprincipal = result.bprincipal ? this.translate.instant("DROPDOWN.YES") : this.translate.instant("DROPDOWN.NO");
            this.bankGridApi.refreshCells();
            return;
          }
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
            icedula: result.icedula,
            xdocidentidad: result.xdocidentidad,
            xtelefonocelular: result.xtelefonocelular,
            xemail: result.xemail,
            xcargo: result.xcargo,
            xtelefonooficina: result.xtelefonooficina,
            xtelefonocasa: result.xtelefonocasa
          });
          this.contactGridApi.setRowData(this.contactList);
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
        icedula: event.data.icedula,
        xdocidentidad: event.data.xdocidentidad,
        xtelefonocelular: event.data.xtelefonocelular,
        xemail: event.data.xemail,
        xcargo: event.data.xcargo,
        xtelefonocasa: event.data.xtelefonocasa,
        xtelefonooficina: event.data.xtelefonooficina,
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
        icedula: event.data.icedula,
        xdocidentidad: event.data.xdocidentidad,
        xtelefonocelular: event.data.xtelefonocelular,
        xemail: event.data.xemail,
        xcargo: event.data.xcargo,
        xtelefonocasa: event.data.xtelefonocasa,
        xtelefonooficina: event.data.xtelefonooficina,
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
              this.contactList[i].icedula = result.icedula;
              this.contactList[i].xdocidentidad = result.xdocidentidad;
              this.contactList[i].xtelefonocelular = result.xtelefonocelular;
              this.contactList[i].xemail = result.xemail;
              this.contactList[i].xcargo = result.xcargo;
              this.contactList[i].xtelefonooficina = result.xtelefonooficina;
              this.contactList[i].xtelefonocasa = result.xtelefonocasa;
              this.contactGridApi.refreshCells();
              return;
            }
          }
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
          console.log(this.documentList)
          this.documentGridApi.setRowData(this.documentList);
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
    console.log(file);
    this.detail_form.get('ximagen').setValue(file);
    if(this.detail_form.get('ximagen').value){
      this.onSaveImages()
    }
  }

  editClient(){
    this.detail_form.get('xcliente').enable();
    this.detail_form.get('xrepresentante').enable();
    this.detail_form.get('icedula').enable();
    this.detail_form.get('xdocidentidad').enable();
    this.detail_form.get('cestado').enable();
    this.detail_form.get('cciudad').enable();
    this.detail_form.get('xdireccionfiscal').enable();
    this.detail_form.get('xemail').enable();
    this.detail_form.get('finicio').enable();
    this.detail_form.get('xtelefono').enable();
    this.detail_form.get('xpaginaweb').enable();
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

  onSaveImages(){
    const formData = new FormData();
    formData.append('ximagen', this.detail_form.get('ximagen').value);
    formData.append('agentId', '007');
    this.http.post<any>(`${environment.apiUrl}/api/upload/image`, formData).subscribe(response => {
      if(response.data.status){
        this.xrutaimagen = `${environment.apiUrl}/images/${response.data.uploadedFile.filename}`;
      }
    });
  }

  onSubmit(form){
    console.log(this.imageUrl)

    this.submitted = true;
    this.loading = true;
    if(this.detail_form.invalid){
      this.loading = false;
      return;
    }
    let params;
    let url;

    if(this.code){
      let updateBankList = this.bankList.filter((row) => { return !row.create; });
      let createBankList = this.bankList.filter((row) => { return row.create; });
      let updateContactList = this.contactList.filter((row) => { return !row.create; });
      let createContactList = this.contactList.filter((row) => { return row.create; });
      let updateDocumentsList = this.documentList.filter((row) => { return !row.create; });
      let createDocumentsList = this.documentList.filter((row) => { return row.create; });
      params = {
        ccliente: this.code,
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania,
        cusuariomodificacion: this.currentUser.data.cusuario,
        xcliente: form.xcliente,
        xrepresentante: form.xrepresentante,
        icedula: form.icedula,
        xdocidentidad: form.xdocidentidad,
        cestado: form.cestado,
        cciudad: form.cciudad,
        xdireccionfiscal: form.xdireccionfiscal,
        xemail: form.xemail,
        finicio: new Date(form.finicio).toUTCString(),
        xtelefono: form.xtelefono ? form.xtelefono : undefined,
        xpaginaweb: form.xpaginaweb ? form.xpaginaweb : undefined,
        bactivo: form.bactivo,
        xrutaimagen: this.xrutaimagen ? this.xrutaimagen : undefined,
        banks: {
          create: createBankList,
          update: updateBankList
        },
        contacts: {
          create: createContactList,
          update: updateContactList
        },
        documents: {
          create: createDocumentsList,
          update: updateDocumentsList
        },
      };
      url = `${environment.apiUrl}/api/client/update`;
      this.sendFormData(params, url);
    }else{
      params = {
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania,
        xcliente: form.xcliente,
        xrepresentante: form.xrepresentante,
        icedula: form.icedula,
        xdocidentidad: form.xdocidentidad,
        cestado: form.cestado,
        cciudad: form.cciudad,
        xdireccionfiscal: form.xdireccionfiscal,
        xemail: form.xemail,
        finicio: new Date(form.finicio).toUTCString(),
        xtelefono: form.xtelefono ? form.xtelefono : undefined,
        xpaginaweb: form.xpaginaweb ? form.xpaginaweb : undefined,
        bactivo: form.bactivo,
        xrutaimagen: this.xrutaimagen ? this.xrutaimagen : undefined,
        cusuariocreacion: this.currentUser.data.cusuario,
        banks: this.bankList,
        contacts: this.contactList,
        documents: this.documentList,
      };
      url = `${environment.apiUrl}/api/client/create`;
      this.sendFormData(params, url);
    }
  }

  sendFormData(params, url){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    this.http.post(url, params, options).subscribe((response : any) => {
      if(response.data.status){
        if(this.code){
          location.reload();
        }else{
          this.router.navigate([`/client/client-detail-v2/${response.data.ccliente}`]);
        }
      }
      this.loading = false;
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.NOTIFICATIONS.NOTIFICATIONNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
    });
  }
}
