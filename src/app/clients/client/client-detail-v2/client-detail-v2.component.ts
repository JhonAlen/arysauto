import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientBankComponent } from '@app/pop-up/client-bank/client-bank.component';
import { ClientContactComponent } from '@app/pop-up/client-contact/client-contact.component';
import { ClientDocumentComponent } from '@app/pop-up/client-document/client-document.component';
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
  private contactGridApi;
  private documentGridApi;
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
  bankList: any[] = [];
  contactList: any[] = [];
  documentList: any[] = [];

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

  onBanksGridReady(event){
    this.bankGridApi = event.api;
  }

  onContactsGridReady(event){
    this.contactGridApi = event.api;
  }

  onDocumentsGridReady(event){
    this.documentGridApi = event.api;
  }


  onFileSelect(event){
    const file = event.target.files[0];
    console.log(file);
    this.detail_form.get('ximagen').setValue(file);

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
        Documents: {
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
