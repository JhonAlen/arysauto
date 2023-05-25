import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModuleComponent } from '@app/pop-up/module/module.component';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.css']
})
export class GroupDetailComponent implements OnInit {

  private gridApi;
  sub;
  currentUser;
  detail_form: UntypedFormGroup;
  loading: boolean = false;
  loading_cancel: boolean = false;
  submitted: boolean = false;
  moduleList: any[] = [];
  deleteRowList: any[] = [];
  alert = { show: false, type: "", message: "" };
  canCreate: boolean = false;
  canDetail: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;
  code;
  showSaveButton: boolean = false;
  showEditButton: boolean = false;
  editStatus: boolean = false;

  constructor(private formBuilder: UntypedFormBuilder, 
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private router: Router,
              private translate: TranslateService,
              private modalService : NgbModal,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.detail_form = this.formBuilder.group({
      xgrupo: [''],
      bactivo: [true]
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 4
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
        this.getGroupData();
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

  getGroupData(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cgrupo: this.code
    };
    this.http.post(`${environment.apiUrl}/api/group/detail`, params, options).subscribe((response: any) => {
      if(response.data.status){
        this.detail_form.get('xgrupo').setValue(response.data.xgrupo);
        this.detail_form.get('xgrupo').disable();
        this.detail_form.get('bactivo').setValue(response.data.bactivo);
        this.detail_form.get('bactivo').disable();
        this.moduleList = [];
        for(let i =0; i < response.data.modules.length; i++){
          this.moduleList.push({
            cgrid: i,
            cmodulo: response.data.modules[i].cmodulo, 
            xmodulo: response.data.modules[i].xmodulo,
            xruta: response.data.modules[i].xruta,
            bactivo: response.data.modules[i].bactivo,
            xactivo: response.data.modules[i].bactivo ? this.translate.instant("DROPDOWN.YES") : this.translate.instant("DROPDOWN.NO")
          });
        }
      }
      this.loading_cancel = false;
    }, 
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.GROUPS.GROUPNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }

  editGroup(){
    this.detail_form.get('xgrupo').enable();
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
      this.getGroupData();
    }else{
      this.router.navigate([`/security/group-index`]);
    }
  }

  addModule(){
    let module = { type: 3 };
    const modalRef = this.modalService.open(ModuleComponent);
    modalRef.componentInstance.module = module;
    modalRef.result.then((result: any) => { 
      if(result){
        if(result.type == 3){
          this.moduleList.push({
            cgrid: this.moduleList.length,
            xmodulo: result.xmodulo,
            xruta: result.xruta,
            bactivo: result.bactivo,
            xactivo: result.bactivo ? this.translate.instant("DROPDOWN.YES") : this.translate.instant("DROPDOWN.NO")
          });
          this.gridApi.setRowData(this.moduleList);
        }
      }
    });
  }

  rowClicked(event: any){
    let module = {};
    if(this.editStatus){ module = { type: 1, cgrid: event.data.cgrid, cmodulo: event.data.cmodulo, xmodulo: event.data.xmodulo, xruta: event.data.xruta, bactivo: event.data.bactivo }; }
    else{ module = { type: 2, cgrid: event.data.cgrid, cmodulo: event.data.cmodulo, xmodulo: event.data.xmodulo, xruta: event.data.xruta, bactivo: event.data.bactivo }; }
    const modalRef = this.modalService.open(ModuleComponent);
    modalRef.componentInstance.module = module;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 1){
          for(let i = 0; i < this.moduleList.length; i++){
            if(this.moduleList[i].cmodulo == result.cmodulo){
              this.moduleList[i].xmodulo = result.xmodulo;
              this.moduleList[i].xruta = result.xruta;
              this.moduleList[i].bactivo = result.bactivo;
              this.moduleList[i].xactivo = result.bactivo ? this.translate.instant("DROPDOWN.YES") : this.translate.instant("DROPDOWN.NO");
              this.gridApi.refreshCells();
              return;
            }
          }
        }else if(result.type == 4){
          if(result.cmodulo){
            this.deleteRowList.push({ cmodulo: result.cmodulo });
          }
          this.moduleList = this.moduleList.filter((row) => { return row.cgrid != result.cgrid });
          for(let i = 0; i < this.moduleList.length; i++){
            this.moduleList[i].cgrid = i;
          }
          this.gridApi.setRowData(this.moduleList);
        }
      }
    });
  }

  onGridReady(event){
    this.gridApi = event.api;
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
      let updateList = this.moduleList.filter((row) => { return row.cmodulo; });
      let createList = this.moduleList.filter((row) => { return !row.cmodulo; });
      params = {
        cgrupo: this.code,
        xgrupo: form.xgrupo,
        bactivo: form.bactivo,
        cusuariomodificacion: this.currentUser.data.cusuario,
        modules: {
          create: createList,
          update: updateList,
          delete: this.deleteRowList
        }
      };
      url = `${environment.apiUrl}/api/group/update`;
    }else{
      params = {
        xgrupo: form.xgrupo,
        bactivo: form.bactivo,
        modules: this.moduleList,
        cusuariocreacion: this.currentUser.data.cusuario
      };
      url = `${environment.apiUrl}/api/group/create`;
    }
    this.http.post(url, params, options).subscribe((response : any) => {
      if(response.data.status){
        if(this.code){
          location.reload();
        }else{
          this.router.navigate([`/security/group-detail/${response.data.cgrupo}`]);
        }
      }else{
        let condition = response.data.condition;
        if(condition == "group-name-already-exist"){
          this.alert.message = "SECURITY.GROUPS.NAMEALREADYEXIST";
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
      else if(code == 404){ message = "HTTP.ERROR.GROUPS.GROUPNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
    });
  }

}
