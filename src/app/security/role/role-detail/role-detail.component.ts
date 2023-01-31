import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PermissionComponent } from '@app/pop-up/permission/permission.component';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-role-detail',
  templateUrl: './role-detail.component.html',
  styleUrls: ['./role-detail.component.css']
})
export class RoleDetailComponent implements OnInit {

  private gridApi;
  sub;
  currentUser;
  detail_form: UntypedFormGroup;
  loading: boolean = false;
  loading_cancel: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  departmentList: any[] = [];
  permissionList: any[] = [];
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
              private modalService : NgbModal,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.detail_form = this.formBuilder.group({
      cdepartamento: ['', Validators.required],
      xrol: ['', Validators.required],
      bactivo: [true, Validators.required]
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 3
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
    this.http.post(`${environment.apiUrl}/api/valrep/department`, params, options).subscribe((response : any) => {
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.departmentList.push({ id: response.data.list[i].cdepartamento, value: response.data.list[i].xdepartamento });
        }
        this.departmentList.sort((a,b) => a.value > b.value ? 1 : -1);
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.DEPARTMENTNOTFOUND"; }
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
        this.getRoleData();
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

  getRoleData(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      crol: this.code
    };
    this.http.post(`${environment.apiUrl}/api/role/detail`, params, options).subscribe((response: any) => {
      if(response.data.status){
        this.detail_form.get('cdepartamento').setValue(response.data.cdepartamento);
        this.detail_form.get('cdepartamento').disable();
        this.detail_form.get('xrol').setValue(response.data.xrol);
        this.detail_form.get('xrol').disable();
        this.detail_form.get('bactivo').setValue(response.data.bactivo);
        this.detail_form.get('bactivo').disable();
        this.permissionList = [];
        for(let i =0; i < response.data.permissions.length; i++){
          this.permissionList.push({
            cgrid: i,
            create: false,
            cmodulo: response.data.permissions[i].cmodulo,
            xmodulo: response.data.permissions[i].xmodulo,
            cgrupo: response.data.permissions[i].cgrupo,
            xgrupo: response.data.permissions[i].xgrupo,
            bcrear: response.data.permissions[i].bcrear,
            xcrear: response.data.permissions[i].bcrear ? this.translate.instant("DROPDOWN.YES") : this.translate.instant("DROPDOWN.NO"),
            bindice: response.data.permissions[i].bindice,
            xindice: response.data.permissions[i].bindice ? this.translate.instant("DROPDOWN.YES") : this.translate.instant("DROPDOWN.NO"),
            bdetalle: response.data.permissions[i].bdetalle,
            xdetalle: response.data.permissions[i].bdetalle ? this.translate.instant("DROPDOWN.YES") : this.translate.instant("DROPDOWN.NO"),
            beditar: response.data.permissions[i].beditar,
            xeditar: response.data.permissions[i].beditar ? this.translate.instant("DROPDOWN.YES") : this.translate.instant("DROPDOWN.NO"),
            beliminar: response.data.permissions[i].beliminar,
            xeliminar: response.data.permissions[i].beliminar ? this.translate.instant("DROPDOWN.YES") : this.translate.instant("DROPDOWN.NO")
          });
        }
      }
      this.loading_cancel = false;
    }, 
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.ROLES.ROLENOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }

  editRole(){
    this.detail_form.get('cdepartamento').enable();
    this.detail_form.get('xrol').enable();
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
      this.getRoleData();
    }else{
      this.router.navigate([`/security/role-index`]);
    }
  }

  addPermission(){
    let permission = { type: 3 };
    const modalRef = this.modalService.open(PermissionComponent);
    modalRef.componentInstance.permission = permission;
    modalRef.result.then((result: any) => { 
      if(result){
        if(result.type == 3){
          this.permissionList.push({
            cgrid: this.permissionList.length,
            create: true,
            cmodulo: result.cmodulo,
            xmodulo: result.xmodulo,
            cgrupo: result.cgrupo,
            xgrupo: result.xgrupo,
            bcrear: result.bcrear,
            xcrear: result.bcrear ? this.translate.instant("DROPDOWN.YES") : this.translate.instant("DROPDOWN.NO"),
            bindice:result.bindice,
            xindice: result.bindice ? this.translate.instant("DROPDOWN.YES") : this.translate.instant("DROPDOWN.NO"),
            bdetalle: result.bdetalle,
            xdetalle: result.bdetalle ? this.translate.instant("DROPDOWN.YES") : this.translate.instant("DROPDOWN.NO"),
            beditar: result.beditar,
            xeditar: result.beditar ? this.translate.instant("DROPDOWN.YES") : this.translate.instant("DROPDOWN.NO"),
            beliminar: result.beliminar,
            xeliminar: result.beliminar ? this.translate.instant("DROPDOWN.YES") : this.translate.instant("DROPDOWN.NO")
          });
          this.gridApi.setRowData(this.permissionList);
        }
      }
    });
  }

  rowClicked(event: any){
    let permission = {};
    if(this.editStatus){ 
      permission = { 
        type: 1,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        cmodulo: event.data.cmodulo,
        cgrupo: event.data.cgrupo, 
        bindice: event.data.bindice,
        bcrear: event.data.bcrear,
        bdetalle: event.data.bdetalle,
        beditar: event.data.beditar,
        beliminar: event.data.beliminar,
        delete: false
      };
    }else{ 
      permission = { 
        type: 2,
        create: event.data.create,
        cgrid: event.data.cgrid,
        cmodulo: event.data.cmodulo,
        cgrupo: event.data.cgrupo, 
        bindice: event.data.bindice,
        bcrear: event.data.bcrear,
        bdetalle: event.data.bdetalle,
        beditar: event.data.beditar,
        beliminar: event.data.beliminar,
        delete: false
      }; 
    }
    const modalRef = this.modalService.open(PermissionComponent);
    modalRef.componentInstance.permission = permission;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 1){
          for(let i = 0; i < this.permissionList.length; i++){
            if(this.permissionList[i].cgrid == result.cgrid){
              this.permissionList[i].cgrupo = result.cgrupo;
              this.permissionList[i].xgrupo = result.xgrupo;
              this.permissionList[i].cmodulo = result.cmodulo;
              this.permissionList[i].xmodulo = result.xmodulo;
              this.permissionList[i].bindice = result.bindice;
              this.permissionList[i].xindice = result.bindice ? this.translate.instant("DROPDOWN.YES") : this.translate.instant("DROPDOWN.NO");
              this.permissionList[i].bcrear = result.bcrear;
              this.permissionList[i].xcrear = result.bcrear ? this.translate.instant("DROPDOWN.YES") : this.translate.instant("DROPDOWN.NO");
              this.permissionList[i].bdetalle = result.bdetalle;
              this.permissionList[i].xdetalle = result.bdetalle ? this.translate.instant("DROPDOWN.YES") : this.translate.instant("DROPDOWN.NO");
              this.permissionList[i].beditar = result.beditar;
              this.permissionList[i].xeditar = result.beditar ? this.translate.instant("DROPDOWN.YES") : this.translate.instant("DROPDOWN.NO");
              this.permissionList[i].beliminar = result.beliminar;
              this.permissionList[i].xeliminar = result.beliminar ? this.translate.instant("DROPDOWN.YES") : this.translate.instant("DROPDOWN.NO");
              this.gridApi.refreshCells();
              return;
            }
          }
        }else if(result.type == 4){
          if(result.delete){
            this.deleteRowList.push({ cgrupo: result.cgrupo, cmodulo: result.cmodulo });
          }
          this.permissionList = this.permissionList.filter((row) => { return row.cgrid != result.cgrid });
          for(let i = 0; i < this.permissionList.length; i++){
            this.permissionList[i].cgrid = i;
          }
          this.gridApi.setRowData(this.permissionList);
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
      let updateList = this.permissionList.filter((row) => { return !row.create; });
      let createList = this.permissionList.filter((row) => { return row.create; });
      params = {
        crol: this.code,
        cdepartamento: form.cdepartamento,
        xrol: form.xrol,
        bactivo: form.bactivo,
        cusuariomodificacion: this.currentUser.data.cusuario,
        permissions: {
          create: createList,
          update: updateList,
          delete: this.deleteRowList
        }
      };
      url = `${environment.apiUrl}/api/role/update`;
    }else{
      params = {
        cdepartamento: form.cdepartamento,
        xrol: form.xrol,
        bactivo: form.bactivo,
        permissions: this.permissionList,
        cusuariocreacion: this.currentUser.data.cusuario
      };
      url = `${environment.apiUrl}/api/role/create`;
    }
    this.http.post(url, params, options).subscribe((response : any) => {
      if(response.data.status){
        if(this.code){
          location.reload();
        }else{
          this.router.navigate([`/security/role-detail/${response.data.crol}`]);
        }
      }else{
        let condition = response.data.condition;
        if(condition == "role-name-already-exist"){
          this.alert.message = "SECURITY.ROLES.NAMEALREADYEXIST";
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
      else if(code == 404){ message = "HTTP.ERROR.ROLES.ROLENOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
    });
  }

}
