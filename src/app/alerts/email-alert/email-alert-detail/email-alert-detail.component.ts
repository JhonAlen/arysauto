import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmailAlertRoleComponent } from '@app/pop-up/email-alert-role/email-alert-role.component';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-email-alert-detail',
  templateUrl: './email-alert-detail.component.html',
  styleUrls: ['./email-alert-detail.component.css']
})
export class EmailAlertDetailComponent implements OnInit {

  private gridApi;
  sub;
  currentUser;
  detail_form: UntypedFormGroup;
  loading: boolean = false;
  loading_cancel: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  countryList: any[] = [];
  companyList: any[] = [];
  roleList: any[] = [];
  deleteRowList: any[] = [];
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
              private activatedRoute: ActivatedRoute,
              private modalService : NgbModal) { }

  ngOnInit(): void {
    this.detail_form = this.formBuilder.group({
      cpais: ['', Validators.required],
      ccompania: ['', Validators.required],
      xcorreo: ['', Validators.required],
      ilenguaje: ['', Validators.required],
      xasunto: ['', Validators.required],
      xhtml: ['', Validators.required],
      bactivo: [true, Validators.required]
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 90
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
    let params = {};
    this.http.post(`${environment.apiUrl}/api/valrep/country`, params, options).subscribe((response : any) => {
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.countryList.push({ id: response.data.list[i].cpais, value: response.data.list[i].xpais });
        }
        this.countryList.sort((a,b) => a.value > b.value ? 1 : -1);
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.COUNTRYNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
    this.http.post(`${environment.apiUrl}/api/valrep/company`, params, options).subscribe((response: any) => {
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.companyList.push({ id: response.data.list[i].ccompania, value: response.data.list[i].xcompania });
        }
        this.companyList.sort((a,b) => a.value > b.value ? 1 : -1);
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.COMPANYNOTFOUND"; }
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
        this.getEmailAlertData();
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

  getEmailAlertData(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      permissionData: {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 90
      },
      ccorreo: this.code
    };
    this.http.post(`${environment.apiUrl}/api/v2/email-alert/production/detail`, params, options).subscribe((response: any) => {
      if(response.data.status){
        this.detail_form.get('cpais').setValue(response.data.cpais);
        this.detail_form.get('cpais').disable();
        this.detail_form.get('ccompania').setValue(response.data.ccompania);
        this.detail_form.get('ccompania').disable();
        this.detail_form.get('xcorreo').setValue(response.data.xcorreo);
        this.detail_form.get('xcorreo').disable();
        this.detail_form.get('ilenguaje').setValue(response.data.ilenguaje);
        this.detail_form.get('ilenguaje').disable();
        this.detail_form.get('xasunto').setValue(response.data.xasunto);
        this.detail_form.get('xasunto').disable();
        this.detail_form.get('xhtml').setValue(response.data.xhtml);
        this.detail_form.get('xhtml').disable();
        this.detail_form.get('bactivo').setValue(response.data.bactivo);
        this.detail_form.get('bactivo').disable();
        this.roleList = [];
        for(let i =0; i < response.data.roles.length; i++){
          this.roleList.push({
            cgrid: i,
            create: false,
            cdepartamento: response.data.roles[i].cdepartamento,
            xdepartamento: response.data.roles[i].xdepartamento,
            crol: response.data.roles[i].crol,
            xrol: response.data.roles[i].xrol
          });
        }
      }
      this.loading_cancel = false;
    }, 
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.EMAILALERTS.EMAILALERTNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }

  editEmailAlert(){
    this.detail_form.get('cpais').enable();
    this.detail_form.get('ccompania').enable();
    this.detail_form.get('xcorreo').enable();
    this.detail_form.get('ilenguaje').enable();
    this.detail_form.get('xasunto').enable();
    this.detail_form.get('xhtml').enable();
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
      this.getEmailAlertData();
    }else{
      this.router.navigate([`/alerts/email-alert-index`]);
    }
  }

  addRole(){
    let role = { type: 3 };
    const modalRef = this.modalService.open(EmailAlertRoleComponent);
    modalRef.componentInstance.role = role;
    modalRef.result.then((result: any) => { 
      if(result){
        if(result.type == 3){
          this.roleList.push({
            cgrid: this.roleList.length,
            create: true,
            cdepartamento: result.cdepartamento,
            xdepartamento: result.xdepartamento,
            crol: result.crol,
            xrol: result.xrol
          });
          this.gridApi.setRowData(this.roleList);
        }
      }
    });
  }

  rowClicked(event: any){
    let role = {};
    if(this.editStatus){ 
      role = { 
        type: 1,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        cdepartamento: event.data.cdepartamento,
        crol: event.data.crol,
        delete: false
      };
    }else{ 
      role = { 
        type: 2,
        create: event.data.create,
        cgrid: event.data.cgrid,
        cdepartamento: event.data.cdepartamento,
        crol: event.data.crol,
        delete: false
      }; 
    }
    const modalRef = this.modalService.open(EmailAlertRoleComponent);
    modalRef.componentInstance.role = role;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 1){
          for(let i = 0; i < this.roleList.length; i++){
            if(this.roleList[i].cgrid == result.cgrid){
              this.roleList[i].cepartamento = result.cepartamento;
              this.roleList[i].xdepartamento = result.xdepartamento;
              this.roleList[i].crol = result.crol;
              this.roleList[i].xrol = result.xrol;
              this.gridApi.refreshCells();
              return;
            }
          }
        }else if(result.type == 4){
          if(result.delete){
            this.deleteRowList.push({ cdepartamento: result.cdepartamento, crol: result.crol });
          }
          this.roleList = this.roleList.filter((row) => { return row.cgrid != result.cgrid });
          for(let i = 0; i < this.roleList.length; i++){
            this.roleList[i].cgrid = i;
          }
          this.gridApi.setRowData(this.roleList);
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
      let updateList = this.roleList.filter((row) => { return !row.create; });
      for(let i = 0; i < updateList.length; i++){
        delete updateList[i].cgrid;
        delete updateList[i].create;
        delete updateList[i].xdepartamento;
        delete updateList[i].xrol;
      }
      let createList = this.roleList.filter((row) => { return row.create; });
      for(let i = 0; i < createList.length; i++){
        delete createList[i].cgrid;
        delete createList[i].create;
        delete createList[i].xdepartamento;
        delete createList[i].xrol;
      }
      params = {
        permissionData: {
          cusuario: this.currentUser.data.cusuario,
          cmodulo: 90
        },
        ccorreo: this.code,
        xcorreo: form.xcorreo,
        ilenguaje: form.ilenguaje,
        xasunto: form.xasunto,
        xhtml: form.xhtml,
        bactivo: form.bactivo,
        cpais: form.cpais,
        ccompania: form.ccompania,
        cusuariomodificacion: this.currentUser.data.cusuario,
        roles: {
          create: createList,
          update: updateList,
          delete: this.deleteRowList
        }
      };
      url = `${environment.apiUrl}/api/v2/email-alert/production/update`;
    }else{
      let createList = this.roleList;
      for(let i = 0; i < createList.length; i++){
        delete createList[i].cgrid;
        delete createList[i].create;
        delete createList[i].xdepartamento;
        delete createList[i].xrol;
      }
      params = {
        permissionData: {
          cusuario: this.currentUser.data.cusuario,
          cmodulo: 90
        },
        xcorreo: form.xcorreo,
        ilenguaje: form.ilenguaje,
        xasunto: form.xasunto,
        xhtml: form.xhtml,
        bactivo: form.bactivo,
        cpais: form.cpais,
        ccompania: form.ccompania,
        cusuariocreacion: this.currentUser.data.cusuario,
        roles: createList,
      };
      url = `${environment.apiUrl}/api/v2/email-alert/production/create`;
    }
    this.http.post(url, params, options).subscribe((response: any) => {
      if(response.data.status){
        if(this.code){
          location.reload();
        }else{
          this.router.navigate([`/alerts/email-alert-detail/${response.data.ccorreo}`]);
        }
      }else{
        let condition = response.data.condition;
        if(condition == "email-alert-already-exist"){
          this.alert.message = "ALERTS.EMAILALERTS.EMAILALERTALREADYEXIST";
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
      else if(code == 404){ message = "HTTP.ERROR.EMAILALERTS.EMAILALERTNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
    });
  }

}
