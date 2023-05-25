import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormControl } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CancellationCauseComponent } from '@app/pop-up/cancellation-cause/cancellation-cause.component';
import { GeneralStatusComponent } from '@app/pop-up/general-status/general-status.component';
import { DocumentComponent } from '@app/pop-up/document/document.component';
import { ProcessModuleComponent } from '@app/pop-up/process-module/process-module.component';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-configuration-process-detail',
  templateUrl: './configuration-process-detail.component.html',
  styleUrls: ['./configuration-process-detail.component.css']
})
export class ConfigurationProcessDetailComponent implements OnInit {

  private cancellationCausesGridApi;
  private generalStatusesGridApi;
  private documentsGridApi;
  private modulesGridApi;
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
  editStatus: boolean = false;
  code;
  showSaveButton: boolean = false;
  showEditButton: boolean = false;
  cancellationCauseList: any[] = [];
  generalStatusList: any[] = [];
  documentList: any[] = [];
  moduleList: any[] = [];
  documentDeletedRowList: any[] = [];
  generalStatusDeletedRowList: any[] = [];
  cancellationCauseDeletedRowList: any[] = [];
  moduleDeletedRowList: any[] = [];

  constructor(private formBuilder: UntypedFormBuilder, 
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private router: Router,
              private translate: TranslateService,
              private activatedRoute: ActivatedRoute,
              private modalService : NgbModal) { }

  ngOnInit(): void {
    this.detail_form = this.formBuilder.group({
      xproceso: [''],
      bactivo: [true]
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 46
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
    this.sub = this.activatedRoute.paramMap.subscribe(params => {
      this.code = params.get('id');
      if(this.code){
        if(!this.canDetail){
          this.router.navigate([`/permission-error`]);
          return;
        }
        this.getProcessData();
        if(this.canEdit){ this.showEditButton = true; }
      }else{
        if(!this.canCreate){
          this.router.navigate([`/permission-error`]);
          return;
        }
        this.showSaveButton = true;
      }
    });
  }

  getProcessData(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cproceso: this.code,
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania
    };
    this.http.post(`${environment.apiUrl}/api/process/configuration/detail`, params, options).subscribe((response: any) => {
      if(response.data.status){
        this.detail_form.get('xproceso').setValue(response.data.xproceso);
        this.detail_form.get('xproceso').disable();
        this.detail_form.get('bactivo').setValue(response.data.bactivo);
        this.detail_form.get('bactivo').disable();
        this.cancellationCauseList = [];
        for(let i =0; i < response.data.cancellationCauses.length; i++){
          this.cancellationCauseList.push({
            cgrid: i,
            create: false,
            ccausaanulacion: response.data.cancellationCauses[i].ccausaanulacion,
            xcausaanulacion: response.data.cancellationCauses[i].xcausaanulacion
          });
        }
        this.generalStatusList = [];
        for(let i =0; i < response.data.generalStatus.length; i++){
          this.generalStatusList.push({
            cgrid: i,
            create: false,
            cestatusgeneral: response.data.generalStatus[i].cestatusgeneral,
            xestatusgeneral: response.data.generalStatus[i].xestatusgeneral,
            bdefault: response.data.generalStatus[i].bdefault,
            cgrupo: response.data.generalStatus[i].cgrupo ? response.data.generalStatus[i].cgrupo : '',
            cmodulo: response.data.generalStatus[i].cmodulo ? response.data.generalStatus[i].cmodulo : '',
            bgestionable: response.data.generalStatus[i].bgestionable
          });
        }
        this.documentList = [];
        for(let i =0; i < response.data.documents.length; i++){
          this.documentList.push({
            cgrid: i,
            create: false,
            cdocumento: response.data.documents[i].cdocumento,
            xdocumento: response.data.documents[i].xdocumento
          });
        }
        this.moduleList = [];
        for(let i =0; i < response.data.modules.length; i++){
          this.moduleList.push({
            cgrid: i,
            create: false,
            cmodulo: response.data.modules[i].cmodulo,
            xmodulo: response.data.modules[i].xmodulo,
            cgrupo: response.data.modules[i].cgrupo,
            xgrupo: response.data.modules[i].xgrupo
          });
        }
      }
      this.loading_cancel = false;
    }, 
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.PROCESSCANCELLATIONCAUSES.PROCESSNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }

  editProcess(){
    this.showEditButton = false;
    this.showSaveButton = true;
    this.editStatus = true;
  }

  cancelSave(){
    if(this.code){
      this.loading_cancel = true;
      this.showSaveButton = false;
      this.showEditButton = true;
      this.editStatus = false;
      this.getProcessData();
    }
  }

  addCancellationCause(){
    let cancellationCause = { type: 3 };
    const modalRef = this.modalService.open(CancellationCauseComponent);
    modalRef.componentInstance.cancellationCause = cancellationCause;
    modalRef.result.then((result: any) => { 
      if(result){
        if(result.type == 3){
          this.cancellationCauseList.push({
            cgrid: this.cancellationCauseList.length,
            create: true,
            ccausaanulacion: result.ccausaanulacion,
            xcausaanulacion: result.xcausaanulacion
          });
          this.cancellationCausesGridApi.setRowData(this.cancellationCauseList);
        }
      }
    });
  }

  addGeneralStatus(){
    let generalStatus = { type: 3 };
    const modalRef = this.modalService.open(GeneralStatusComponent);
    modalRef.componentInstance.generalStatus = generalStatus;
    modalRef.result.then((result: any) => { 
      if(result){
        if(result.type == 3){
          this.generalStatusList.push({
            cgrid: this.generalStatusList.length,
            create: true,
            cestatusgeneral: result.cestatusgeneral,
            xestatusgeneral: result.xestatusgeneral,
            bdefault: result.bdefault,
            cgrupo: result.cgrupo,
            cmodulo: result.cmodulo,
            bgestionable: result.bgestionable
          });
          this.generalStatusesGridApi.setRowData(this.generalStatusList);
        }
      }
    });
  }

  addDocument(){
    let document = { type: 3 };
    const modalRef = this.modalService.open(DocumentComponent);
    modalRef.componentInstance.document = document;
    modalRef.result.then((result: any) => { 
      if(result){
        if(result.type == 3){
          this.documentList.push({
            cgrid: this.documentList.length,
            create: true,
            cdocumento: result.cdocumento,
            xdocumento: result.xdocumento
          });
          this.documentsGridApi.setRowData(this.documentList);
        }
      }
    });
  }

  addModule(){
    let module = { type: 3 };
    const modalRef = this.modalService.open(ProcessModuleComponent);
    modalRef.componentInstance.module = module;
    modalRef.result.then((result: any) => { 
      if(result){
        if(result.type == 3){
          this.moduleList.push({
            cgrid: this.moduleList.length,
            create: true,
            cmodulo: result.cmodulo,
            xmodulo: result.xmodulo,
            cgrupo: result.cgrupo,
            xgrupo: result.xgrupo
          });
          this.modulesGridApi.setRowData(this.moduleList);
        }
      }
    });
  }

  cancellationCauseRowClicked(event: any){
    let cancellationCause = {};
    if(this.editStatus){ 
      cancellationCause = { 
        type: 1,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        ccausaanulacion: event.data.ccausaanulacion,
        delete: false
      };
    }else{ 
      cancellationCause = { 
        type: 2,
        create: event.data.create,
        cgrid: event.data.cgrid,
        ccausaanulacion: event.data.ccausaanulacion,
        delete: false
      }; 
    }
    const modalRef = this.modalService.open(CancellationCauseComponent);
    modalRef.componentInstance.cancellationCause = cancellationCause;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 1){
          for(let i = 0; i < this.cancellationCauseList.length; i++){
            if(this.cancellationCauseList[i].cgrid == result.cgrid){
              this.cancellationCauseList[i].ccausaanulacion = result.ccausaanulacion;
              this.cancellationCauseList[i].xcausaanulacion = result.xcausaanulacion;
              this.cancellationCausesGridApi.refreshCells();
              return;
            }
          }
        }else if(result.type == 4){
          if(result.delete){
            this.cancellationCauseDeletedRowList.push({ ccausaanulacion: result.ccausaanulacion });
          }
          this.cancellationCauseList = this.cancellationCauseList.filter((row) => { return row.cgrid != result.cgrid });
          for(let i = 0; i < this.cancellationCauseList.length; i++){
            this.cancellationCauseList[i].cgrid = i;
          }
          this.cancellationCausesGridApi.setRowData(this.cancellationCauseList);
        }
      }
    });
  }

  generalStatusRowClicked(event: any){
    let generalStatus = {};
    if(this.editStatus){ 
      generalStatus = { 
        type: 1,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        cestatusgeneral: event.data.cestatusgeneral,
        bdefault: event.data.bdefault,
        cgrupo: event.data.cgrupo,
        cmodulo: event.data.cmodulo,
        bgestionable: event.data.bgestionable,
        delete: false
      };
    }else{ 
      generalStatus = { 
        type: 2,
        create: event.data.create,
        cgrid: event.data.cgrid,
        cestatusgeneral: event.data.cestatusgeneral,
        bdefault: event.data.bdefault,
        cgrupo: event.data.cgrupo,
        cmodulo: event.data.cmodulo,
        bgestionable: event.data.bgestionable,
        delete: false
      }; 
    }
    const modalRef = this.modalService.open(GeneralStatusComponent);
    modalRef.componentInstance.generalStatus = generalStatus;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 1){
          for(let i = 0; i < this.generalStatusList.length; i++){
            if(this.generalStatusList[i].cgrid == result.cgrid){
              this.generalStatusList[i].cestatusgeneral = result.cestatusgeneral;
              this.generalStatusList[i].xestatusgeneral = result.xestatusgeneral;
              this.generalStatusList[i].bdefault = result.bdefault;
              this.generalStatusList[i].cgrupo = result.cgrupo;
              this.generalStatusList[i].cmodulo = result.cmodulo;
              this.generalStatusList[i].bgestionable = result.bgestionable;
              this.generalStatusesGridApi.refreshCells();
              return;
            }
          }
        }else if(result.type == 4){
          if(result.delete){
            this.generalStatusDeletedRowList.push({ cestatusgeneral: result.cestatusgeneral });
          }
          this.generalStatusList = this.generalStatusList.filter((row) => { return row.cgrid != result.cgrid });
          for(let i = 0; i < this.generalStatusList.length; i++){
            this.generalStatusList[i].cgrid = i;
          }  
          this.generalStatusesGridApi.setRowData(this.generalStatusList);
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
        delete: false
      };
    }else{ 
      document = { 
        type: 2,
        create: event.data.create,
        cgrid: event.data.cgrid,
        cdocumento: event.data.cdocumento,
        delete: false
      }; 
    }
    const modalRef = this.modalService.open(DocumentComponent);
    modalRef.componentInstance.document = document;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 1){
          for(let i = 0; i < this.documentList.length; i++){
            if(this.documentList[i].cgrid == result.cgrid){
              this.documentList[i].cdocumento = result.cdocumento;
              this.documentList[i].xdocumento = result.xdocumento;
              this.documentsGridApi.refreshCells();
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
          this.documentsGridApi.setRowData(this.documentList);
        }
      }
    });
  }

  moduleRowClicked(event: any){
    let module = {};
    if(this.editStatus){ 
      module = { 
        type: 1,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        cmodulo: event.data.cmodulo,
        cgrupo: event.data.cgrupo,
        delete: false
      };
    }else{ 
      module = { 
        type: 2,
        create: event.data.create,
        cgrid: event.data.cgrid,
        cmodulo: event.data.cmodulo,
        cgrupo: event.data.cgrupo,
        delete: false
      }; 
    }
    const modalRef = this.modalService.open(ProcessModuleComponent);
    modalRef.componentInstance.module = module;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 1){
          for(let i = 0; i < this.moduleList.length; i++){
            if(this.moduleList[i].cgrid == result.cgrid){
              this.moduleList[i].cgrupo = result.cgrupo;
              this.moduleList[i].xgrupo = result.xgrupo;
              this.moduleList[i].cmodulo = result.cmodulo;
              this.moduleList[i].xmodulo = result.xmodulo;
              this.modulesGridApi.refreshCells();
              return;
            }
          }
        }else if(result.type == 4){
          if(result.delete){
            this.moduleDeletedRowList.push({ cmodulo: result.cmodulo });
          }
          this.moduleList = this.moduleList.filter((row) => { return row.cgrid != result.cgrid });
          for(let i = 0; i < this.moduleList.length; i++){
            this.moduleList[i].cgrid = i;
          }
          this.modulesGridApi.setRowData(this.moduleList);
        }
      }
    });
  }

  onCancellationCausesGridReady(event){
    this.cancellationCausesGridApi = event.api;
  }

  onGeneralStatusesGridReady(event){
    this.generalStatusesGridApi = event.api;
  }

  onDocumentsGridReady(event){
    this.documentsGridApi = event.api;
  }

  onModulesGridReady(event){
    this.modulesGridApi = event.api;
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
      let updateCancellationCauseList = this.cancellationCauseList.filter((row) => { return !row.create; });
      let createCancellationCauseList = this.cancellationCauseList.filter((row) => { return row.create; });
      let updateGeneralStatusList = this.generalStatusList.filter((row) => { return !row.create; });
      let createGeneralStatusList = this.generalStatusList.filter((row) => { return row.create; });
      let updateDocumentList = this.documentList.filter((row) => { return !row.create; });
      let createDocumentList = this.documentList.filter((row) => { return row.create; });
      let updatModuleList = this.moduleList.filter((row) => { return !row.create; });
      let createModuleList = this.moduleList.filter((row) => { return row.create; });
      params = {
        cproceso: this.code,
        cusuariomodificacion: this.currentUser.data.cusuario,
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania,
        cancellationCauses: {
          create: createCancellationCauseList,
          update: updateCancellationCauseList,
          delete: this.cancellationCauseDeletedRowList
        },
        generalStatus: {
          create: createGeneralStatusList,
          update: updateGeneralStatusList,
          delete: this.generalStatusDeletedRowList
        },
        documents: {
          create: createDocumentList,
          update: updateDocumentList,
          delete: this.documentDeletedRowList
        },
        modules: {
          create: createModuleList,
          update: updatModuleList,
          delete: this.moduleDeletedRowList
        }
      };
      url = `${environment.apiUrl}/api/process/configuration/update`;
    }
    this.http.post(url, params, options).subscribe((response: any) => {
      if(response.data.status){
        if(this.code){
          location.reload();
        }
      }
      this.loading = false;
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.PROCESSCCONFIGURATION.PROCESSNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
    });
  }

}
