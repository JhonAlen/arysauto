import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InsurerContactComponent } from '@app/pop-up/insurer-contact/insurer-contact.component';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-insurer-detail',
  templateUrl: './insurer-detail.component.html',
  styleUrls: ['./insurer-detail.component.css']
})
export class InsurerDetailComponent implements OnInit {

  private contactGridApi;
  sub;
  currentUser;
  detail_form: UntypedFormGroup;
  loading: boolean = false;
  loading_cancel: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  documentTypeList: any[] = [];
  stateList: any[] =[];
  cityList: any[] =[];
  contactList: any[] = [];
  canCreate: boolean = false;
  canDetail: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;
  code;
  showSaveButton: boolean = false;
  showEditButton: boolean = false;
  editStatus: boolean = false;
  contactDeletedRowList: any[] = [];

  constructor(private formBuilder: UntypedFormBuilder, 
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private router: Router,
              private translate: TranslateService,
              private activatedRoute: ActivatedRoute,
              private modalService : NgbModal) { }

  ngOnInit(): void {
    this.detail_form = this.formBuilder.group({
      xaseguradora: ['', Validators.required],
      xrepresentante: ['', Validators.required],
      ctipodocidentidad: ['', Validators.required],
      xdocidentidad: ['', Validators.required],
      cestado: ['', Validators.required],
      cciudad: ['', Validators.required],
      xdireccionfiscal: ['', Validators.required],
      xemail: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])],
      xtelefono: [''],
      bnotificacionsms: [false, Validators.required],
      xpaginaweb: [''],
      bactivo: [true, Validators.required]
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 82
      }
      this.http.post(`${environment.apiUrl}/api/security/verify-module-permission`, params, options).subscribe((response : any) => {
        if(response.data.status){
          this.canCreate = response.data.bcrear;
          this.canDetail = response.data.bdetalle;
          this.canEdit = response.data.beditar;
          this.canDelete = response.data.beliminar;
          this.initializeDetailModule();
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

  initializeDetailModule(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania,
    };
    this.http.post(`${environment.apiUrl}/api/valrep/document-type`, params, options).subscribe((response : any) => {
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.documentTypeList.push({ id: response.data.list[i].ctipodocidentidad, value: response.data.list[i].xtipodocidentidad });
        }
        this.documentTypeList.sort((a,b) => a.value > b.value ? 1 : -1);
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.DOCUMENTTYPENOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
    this.http.post(`${environment.apiUrl}/api/valrep/state`, params, options).subscribe((response : any) => {
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.stateList.push({ id: response.data.list[i].cestado, value: response.data.list[i].xestado });
        }
        this.stateList.sort((a,b) => a.value > b.value ? 1 : -1);
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.STATENOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
    this.sub = this.activatedRoute.paramMap.subscribe(params => {
      this.code = params.get('id');
      if(this.code){
        if(!this.canDetail){
          this.router.navigate([`/permission-error`]);
          return;
        }
        this.getInsurerData();
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

  getInsurerData(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania,
      caseguradora: this.code
    };
    this.http.post(`${environment.apiUrl}/api/insurer/detail`, params, options).subscribe((response: any) => {
      if(response.data.status){
        this.detail_form.get('xaseguradora').setValue(response.data.xaseguradora);
        this.detail_form.get('xaseguradora').disable();
        this.detail_form.get('xrepresentante').setValue(response.data.xrepresentante);
        this.detail_form.get('xrepresentante').disable();
        this.detail_form.get('ctipodocidentidad').setValue(response.data.ctipodocidentidad);
        this.detail_form.get('ctipodocidentidad').disable();
        this.detail_form.get('xdocidentidad').setValue(response.data.xdocidentidad);
        this.detail_form.get('xdocidentidad').disable();
        this.detail_form.get('cestado').setValue(response.data.cestado);
        this.detail_form.get('cestado').disable();
        this.cityDropdownDataRequest();
        this.detail_form.get('cciudad').setValue(response.data.cciudad);
        this.detail_form.get('cciudad').disable();
        this.detail_form.get('xdireccionfiscal').setValue(response.data.xdireccionfiscal);
        this.detail_form.get('xdireccionfiscal').disable();
        this.detail_form.get('xemail').setValue(response.data.xemail);
        this.detail_form.get('xemail').disable();
        response.data.xtelefono ? this.detail_form.get('xtelefono').setValue(response.data.xtelefono) : false;
        this.detail_form.get('xtelefono').disable();
        this.detail_form.get('bnotificacionsms').setValue(response.data.bnotificacionsms);
        this.detail_form.get('bnotificacionsms').disable();
        response.data.xpaginaweb ? this.detail_form.get('xpaginaweb').setValue(response.data.xpaginaweb) : false;
        this.detail_form.get('xpaginaweb').disable();
        this.detail_form.get('bactivo').setValue(response.data.bactivo);
        this.detail_form.get('bactivo').disable();
        this.contactList = [];
        if(response.data.contacts){
          for(let i =0; i < response.data.contacts.length; i++){
            this.contactList.push({
              cgrid: i,
              create: false,
              ccontacto: response.data.contacts[i].ccontacto,
              xnombre: response.data.contacts[i].xnombre,
              xapellido: response.data.contacts[i].xapellido,
              ctipodocidentidad: response.data.contacts[i].ctipodocidentidad,
              xdocidentidad: response.data.contacts[i].xdocidentidad,
              xtelefonocelular: response.data.contacts[i].xtelefonocelular,
              xemail: response.data.contacts[i].xemail,
              xcargo: response.data.contacts[i].xcargo ? response.data.contacts[i].xcargo : undefined,
              xtelefonooficina: response.data.contacts[i].xtelefonooficina ? response.data.contacts[i].xtelefonooficina : undefined,
              xtelefonocasa: response.data.contacts[i].xtelefonocasa ? response.data.contacts[i].xtelefonocasa : undefined,
              xfax: response.data.contacts[i].xfax ? response.data.contacts[i].xfax : undefined,
              bnotificacion: response.data.contacts[i].bnotificacion
            });
          }
        }
      }
      this.loading_cancel = false;
    }, 
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.INSURERS.INSURERNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }

  cityDropdownDataRequest(){
    if(this.detail_form.get('cestado').value){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cpais: this.currentUser.data.cpais,
        cestado: this.detail_form.get('cestado').value
      }
      this.http.post(`${environment.apiUrl}/api/valrep/city`, params, options).subscribe((response : any) => {
        if(response.data.status){
          this.cityList = [];
          for(let i = 0; i < response.data.list.length; i++){
            this.cityList.push({ id: response.data.list[i].cciudad, value: response.data.list[i].xciudad });
          }
          this.cityList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.CITYNOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
    }
  }

  editInsurer(){
    this.detail_form.get('xaseguradora').enable();
    this.detail_form.get('xrepresentante').enable();
    this.detail_form.get('ctipodocidentidad').enable();
    this.detail_form.get('xdocidentidad').enable();
    this.detail_form.get('cestado').enable();
    this.detail_form.get('cciudad').enable();
    this.detail_form.get('xdireccionfiscal').enable();
    this.detail_form.get('xemail').enable();
    this.detail_form.get('xtelefono').enable();
    this.detail_form.get('bnotificacionsms').enable();
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
      this.getInsurerData();
    }else{
      this.router.navigate([`/thirdparties/insurer-index`]);
    }
  }

  addContact(){
    let contact = { type: 3 };
    const modalRef = this.modalService.open(InsurerContactComponent);
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
    const modalRef = this.modalService.open(InsurerContactComponent);
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

  onContactsGridReady(event){
    this.contactGridApi = event.api;
  }

  onSubmit(form){
    this.submitted = true;
    this.loading = true;
    if(this.detail_form.invalid){
      this.loading = false;
      return;
    }
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params;
    let url;
    if(this.code){
      let updateContactList = this.contactList.filter((row) => { return !row.create; });
      let createContactList = this.contactList.filter((row) => { return row.create; });
      params = {
        caseguradora: this.code,
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania,
        xaseguradora: form.xaseguradora,
        xrepresentante: form.xrepresentante,
        ctipodocidentidad: form.ctipodocidentidad,
        xdocidentidad: form.xdocidentidad,
        cestado: form.cestado,
        cciudad: form.cciudad,
        xdireccionfiscal: form.xdireccionfiscal,
        xemail: form.xemail,
        xtelefono: form.xtelefono ? form.xtelefono : undefined,
        bnotificacionsms: form.bnotificacionsms,
        xpaginaweb: form.xpaginaweb ? form.xpaginaweb : undefined,
        bactivo: form.bactivo,
        cusuariomodificacion: this.currentUser.data.cusuario,
        contacts: {
          create: createContactList,
          update: updateContactList,
          delete: this.contactDeletedRowList
        }
      };
      url = `${environment.apiUrl}/api/insurer/update`;
    }else{
      params = {
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania,
        xaseguradora: form.xaseguradora,
        xrepresentante: form.xrepresentante,
        ctipodocidentidad: form.ctipodocidentidad,
        xdocidentidad: form.xdocidentidad,
        cestado: form.cestado,
        cciudad: form.cciudad,
        xdireccionfiscal: form.xdireccionfiscal,
        xemail: form.xemail,
        xtelefono: form.xtelefono ? form.xtelefono : undefined,
        bnotificacionsms: form.bnotificacionsms,
        xpaginaweb: form.xpaginaweb ? form.xpaginaweb : undefined,
        bactivo: form.bactivo,
        cusuariocreacion: this.currentUser.data.cusuario,
        contacts: this.contactList
      };
      url = `${environment.apiUrl}/api/insurer/create`;
    }
    this.http.post(url, params, options).subscribe((response: any) => {
      if(response.data.status){
        if(this.code){
          location.reload();
        }else{
          this.router.navigate([`/thirdparties/insurer-detail/${response.data.caseguradora}`]);
        }
      }else{
        let condition = response.data.condition;
        if(condition == "identification-document-already-exist"){
          this.alert.message = "THIRDPARTIES.INSURERS.IDENTIFICATIONDOCUMENTALREADYEXIST";
          this.alert.type = 'danger';
          this.alert.show = true;
        }
      }
      this.loading = false;
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.INSURERS.INSURERNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
    });
  }

}
