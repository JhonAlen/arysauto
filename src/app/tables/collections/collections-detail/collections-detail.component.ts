import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TablesDocumentsComponent } from '@app/pop-up/tables-documents/tables-documents.component';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';
import { ignoreElements } from 'rxjs/operators';

@Component({
  selector: 'app-collections-detail',
  templateUrl: './collections-detail.component.html',
  styleUrls: ['./collections-detail.component.css']
})
export class CollectionsDetailComponent implements OnInit {

  private documentsGridApi;

  showSaveButton: boolean = false;
  showEditButton: boolean = false;
  editStatus: boolean = false;
  editBlock: boolean = false;
  canCreate: boolean = false;
  canDetail: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;
  code;
  sub;
  currentUser;
  detail_form: FormGroup;
  loading: boolean = false;
  loading_cancel: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  collections: any[] = [];
  notificationTypeList: any[] = [];
  documentsList: any[] = [];

  constructor(private formBuilder: FormBuilder, 
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private router: Router,
              private translate: TranslateService,
              private activatedRoute: ActivatedRoute,
              private modalService : NgbModal) { }

  ngOnInit(): void {
    this.detail_form = this.formBuilder.group({
      crecaudo: [''],
      ctiponotificacion: [''],
      xtiponotificacion: [''],
      xrecaudo: [''],
      bactivo: true
    })
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 97
      };
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
        }else if(code == 500){ message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
    }
  }

  initializeDetailModule(){
    this.searchNotificationType();
    this.sub = this.activatedRoute.paramMap.subscribe(params => {
      this.code = params.get('id');
      if(this.code){
        if(!this.canDetail){
          this.router.navigate([`/permission-error`]);
          return;
        }
      
        this.getCollectionsData();
        this.getDocuments();
        if(this.canEdit){ this.showEditButton = true; }
      }else{
        if(!this.canCreate){
          this.router.navigate([`/permission-error`]);
          return;
        }
        this.showSaveButton = true;
        this.editStatus = true;
      }
    });
  }

  searchNotificationType(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania
    };
    this.notificationTypeList = [];
    this.http.post(`${environment.apiUrl}/api/valrep/notification-type`, params, options).subscribe((response: any) => {
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.notificationTypeList.push({ id: response.data.list[i].ctiponotificacion, value: response.data.list[i].xtiponotificacion });
        }
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.NOTIFICATIONTYPENOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }

  getCollectionsData(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      crecaudo: this.code,
      ccompania: this.currentUser.data.ccompania
    };
    this.http.post(`${environment.apiUrl}/api/collections/detail`, params, options).subscribe((response: any) => {
      if(response.data.status){
        this.notificationTypeList.push({ id: response.data.ctiponotificacion, value: response.data.xtiponotificacion });
        this.detail_form.get('crecaudo').setValue(response.data.crecaudo);
        this.detail_form.get('crecaudo').disable();
        this.detail_form.get('xrecaudo').setValue(response.data.xrecaudo);
        this.detail_form.get('xrecaudo').disable();
        this.detail_form.get('ctiponotificacion').setValue(response.data.ctiponotificacion);
        this.detail_form.get('ctiponotificacion').disable();
        this.detail_form.get('xtiponotificacion').setValue(response.data.xtiponotificacion);
        this.detail_form.get('xtiponotificacion').disable();
      }
      this.collections.push({ id: response.data.crecaudo, xrecaudo: response.data.xrecaudo, ctiponotificacion: response.data.ctiponotificacion, xtiponotificacion: response.data.xtiponotificacion, createCollections: false});
      this.loading_cancel = false;
    }, 
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.TAXESCONFIGURATION.TAXNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }

  getDocuments(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      crecaudo: this.code,
      ccompania: this.currentUser.data.ccompania
    };
    this.http.post(`${environment.apiUrl}/api/collections/documents-detail`, params, options).subscribe((response: any) => {
      if(response.data.list){
        this.documentsList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.documentsList.push({
            cgrid: i,
            createDocuments: false,
            crecaudo: response.data.list[i].crecaudo,
            cdocumento: response.data.list[i].cdocumento,
            xdocumentos: response.data.list[i].xdocumentos,
            bactivo: response.data.list[i].bactivo
          })
        }
      }
    }, 
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.TAXESCONFIGURATION.TAXNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }

  addDocuments(){
    let recaudo = { crecaudo: this.code, createDocuments: true };
    const modalRef = this.modalService.open(TablesDocumentsComponent, {size: 'xl'});
    modalRef.componentInstance.recaudo = recaudo;
    modalRef.result.then((result: any) => { 
      if(result){
        this.documentsList.push({
          cgrid: this.documentsList.length,
          createDocuments: true,
          crecaudo: result.crecaudo,
          xrecaudo: result.xrecaudo,
          cdocumento: result.cdocumento,
          xdocumentos: result.xdocumentos,
          bactivo: result.bactivo
        });
        this.documentsGridApi.setRowData(this.documentsList);
      }
    });
  }

  documentsRowClicked(event: any){
    let recaudo = {};
    if(this.editStatus){ 
      recaudo = { 
        edit: this.editStatus,
        createDocuments: false,
        type: 1,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        crecaudo: event.data.crecaudo,
        xrecaudo: event.data.xrecaudo,
        cdocumento: event.data.cdocumento,
        xdocumentos: event.data.xdocumentos,
        ccompania: event.data.ccompania,
        bactivo: event.data.bactivo,
        delete: false
      };
      console.log(recaudo)
    }else{ 
      recaudo = { 
        edit: this.editStatus,
        createDocuments: false,
        type: 2,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        crecaudo: event.data.crecaudo,
        xrecaudo: event.data.xrecaudo,
        cdocumento: event.data.cdocumento,
        xdocumentos: event.data.xdocumentos,
        ccompania: event.data.ccompania,
        bactivo: event.data.bactivo,
        delete: false
      }; 
      console.log(recaudo)
    }
    if(this.editStatus){
    const modalRef = this.modalService.open(TablesDocumentsComponent, {size: 'xl'});
    modalRef.componentInstance.recaudo = recaudo;
    modalRef.result.then((result: any) => {

      let index = this.documentsList.findIndex(el=> el.cdocumento == result.cdocumento);
      this.documentsList[index].cdocumento = result.cdocumento;
      this.documentsList[index].crecaudo = result.crecaudo;
      this.documentsList[index].xdocumentos = result.xdocumentos;
      this.documentsList[index].bactivo = result.bactivo;
      this.documentsGridApi.refreshCells();
      return;
    });
  }else{
    const modalRef = this.modalService.open(TablesDocumentsComponent, {size: 'xl'});
    modalRef.componentInstance.recaudo = recaudo;
  }
  }

  onDocumentsGridReady(event){
    this.documentsGridApi = event.api;
  }

  editCollections(){
    this.detail_form.get('xrecaudo').enable();
    this.detail_form.get('ctiponotificacion').enable();
    this.detail_form.get('bactivo').enable();
    this.showEditButton = false;
    this.showSaveButton = true;
    this.editStatus = true;
    this.editBlock = true;
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
    let dateFormat = new Date(form.fcreacion).toUTCString();
    if(this.code){

      let updateCollections= this.collections.filter((row) => { return !row.createCollections; });
      let updateDocuments= this.documentsList.filter((row) => { return !row.createDocuments; });
      let createDocuments = this.documentsList.filter((row) => { return row.createDocuments; });
      
      params = {
        crecaudo: this.code,
        fcreacion: dateFormat,
        ccompania: this.currentUser.data.ccompania,
        xrecaudo: form.xrecaudo,
        bactivo: form.bactivo,
        collection: {
          update: updateCollections
        },
        document: {
          create: createDocuments,
          update: updateDocuments
        }
      };
      url = `${environment.apiUrl}/api/collections/update`;
    }else{
      params = { 
        xrecaudo: form.xrecaudo,
        ctiponotificacion: form.ctiponotificacion,
        bactivo: form.bactivo,
        fcreacion: dateFormat,
        ccompania: this.currentUser.data.ccompania
      };
      url = `${environment.apiUrl}/api/collections/create`;
    }; 
    this.http.post(url, params, options).subscribe((response: any) => {
      if(response.data.status){
        console.log('hola')
        if(this.code){
          location.reload();
        }else{
          this.router.navigate([`/tables/collections-detail/${response.data.crecaudo}`]);
        }
      }else{
        let condition = response.data.condition;
        console.log('hola')
        if(condition == "service-order-already-exist"){
          this.alert.message = "EVENTS.SERVICEORDER.NAMEREADYEXIST";
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
      else if(code == 404){ message = "HTTP.ERROR.THIRDPARTIES.ASSOCIATENOTFOUND"; }
      //else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
    });
  }
}
