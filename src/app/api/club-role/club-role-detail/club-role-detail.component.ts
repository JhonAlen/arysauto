import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClubRoleMenuComponent } from '@app/pop-up/club-role-menu/club-role-menu.component';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-club-role-detail',
  templateUrl: './club-role-detail.component.html',
  styleUrls: ['./club-role-detail.component.css']
})
export class ClubRoleDetailComponent implements OnInit {

  private gridApi;
  sub;
  currentUser;
  detail_form: UntypedFormGroup;
  loading: boolean = false;
  loading_cancel: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  menuList: any[] = [];
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
      crolclub: [''],
      xrolclub: [''],
      bactivo: [true]
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 89
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
        this.getClubRoleData();
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

  getClubRoleData(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      permissionData: {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 89
      },
      crolclub: this.code
    };
    this.http.post(`${environment.apiUrl}/api/v2/club-role/production/detail`, params, options).subscribe((response: any) => {
      if(response.data.status){
        this.detail_form.get('crolclub').setValue(response.data.crolclub);
        this.detail_form.get('crolclub').disable();
        this.detail_form.get('xrolclub').setValue(response.data.xrolclub);
        this.detail_form.get('xrolclub').disable();
        this.detail_form.get('bactivo').setValue(response.data.bactivo);
        this.detail_form.get('bactivo').disable();
        this.menuList = [];
        for(let i =0; i < response.data.menus.length; i++){
          this.menuList.push({
            cgrid: i,
            create: false,
            cmenuclub: response.data.menus[i].cmenuclub,
            xmenuclub: response.data.menus[i].xmenuclub,
            xcomponente: response.data.menus[i].xcomponente,
            xpais: response.data.menus[i].xpais,
            xcompania: response.data.menus[i].xcompania
          });
        }
      }
      this.loading_cancel = false;
    }, 
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.CLUBROLES.CLUBROLENOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }

  editClubRole(){
    this.detail_form.get('xrolclub').enable();
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
      this.getClubRoleData();
    }else{
      this.router.navigate([`/api/club-role-index`]);
    }
  }

  addMenu(){
    let menu = { type: 3 };
    const modalRef = this.modalService.open(ClubRoleMenuComponent);
    modalRef.componentInstance.menu = menu;
    modalRef.result.then((result: any) => { 
      if(result){
        if(result.type == 3){
          this.menuList.push({
            cgrid: this.menuList.length,
            create: true,
            cmenuclub: result.cmenuclub,
            xmenuclub: result.xmenuclub,
            xcomponente: result.xcomponente,
            xpais: result.xpais,
            xcompania: result.xcompania
          });
          this.gridApi.setRowData(this.menuList);
        }
      }
    });
  }

  rowClicked(event: any){
    let menu = {};
    if(this.editStatus){ 
      menu = { 
        type: 1,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        cmenuclub: event.data.cmenuclub,
        delete: false
      };
    }else{ 
      menu = { 
        type: 2,
        create: event.data.create,
        cgrid: event.data.cgrid,
        cmenuclub: event.data.cmenuclub,
        delete: false
      }; 
    }
    const modalRef = this.modalService.open(ClubRoleMenuComponent);
    modalRef.componentInstance.menu = menu;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 1){
          for(let i = 0; i < this.menuList.length; i++){
            if(this.menuList[i].cgrid == result.cgrid){
              this.menuList[i].cmenuclub = result.cmenuclub;
              this.menuList[i].xmenuclub = result.xmenuclub,
              this.menuList[i].xcomponente = result.xcomponente,
              this.menuList[i].xpais = result.xpais,
              this.menuList[i].xcompania = result.xcompania
              this.gridApi.refreshCells();
              return;
            }
          }
        }else if(result.type == 4){
          if(result.delete){
            this.deleteRowList.push({ cmenuclub: result.cmenuclub });
          }
          this.menuList = this.menuList.filter((row) => { return row.cgrid != result.cgrid });
          for(let i = 0; i < this.menuList.length; i++){
            this.menuList[i].cgrid = i;
          }
          this.gridApi.setRowData(this.menuList);
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
      let updateList = this.menuList.filter((row) => { return !row.create; });
      for(let i = 0; i < updateList.length; i++){
        delete updateList[i].cgrid;
        delete updateList[i].create;
        delete updateList[i].xmenuclub;
        delete updateList[i].xcomponente;
        delete updateList[i].xpais;
        delete updateList[i].xcompania;
      }
      let createList = this.menuList.filter((row) => { return row.create; });
      for(let i = 0; i < createList.length; i++){
        delete createList[i].cgrid;
        delete createList[i].create;
        delete createList[i].xmenuclub;
        delete createList[i].xcomponente;
        delete createList[i].xpais;
        delete createList[i].xcompania;
      }
      params = {
        permissionData: {
          cusuario: this.currentUser.data.cusuario,
          cmodulo: 89
        },
        crolclub: this.code,
        xrolclub: form.xrolclub,
        bactivo: form.bactivo,
        cusuariomodificacion: this.currentUser.data.cusuario,
        menus: {
          create: createList,
          update: updateList,
          delete: this.deleteRowList
        }
      };
      url = `${environment.apiUrl}/api/v2/club-role/production/update`;
    }else{
      let createList = this.menuList;
      for(let i = 0; i < createList.length; i++){
        delete createList[i].cgrid;
        delete createList[i].create;
        delete createList[i].xmenuclub;
        delete createList[i].xcomponente;
        delete createList[i].xpais;
        delete createList[i].xcompania;
      }
      params = {
        permissionData: {
          cusuario: this.currentUser.data.cusuario,
          cmodulo: 89
        },
        crolclub: form.crolclub,
        xrolclub: form.xrolclub,
        bactivo: form.bactivo,
        cusuariocreacion: this.currentUser.data.cusuario,
        menus: createList,
      };
      url = `${environment.apiUrl}/api/v2/club-role/production/create`;
    }
    this.http.post(url, params, options).subscribe((response: any) => {
      if(response.data.status){
        if(this.code){
          location.reload();
        }else{
          this.router.navigate([`/api/club-role-detail/${response.data.crolclub}`]);
        }
      }else{
        let condition = response.data.condition;
        if(condition == "club-role-code-already-exist"){
          this.alert.message = "API.CLUBROLES.CLUBROLECODEALREADYEXIST";
          this.alert.type = 'danger';
          this.alert.show = true;
        }else if(condition == "club-role-name-already-exist"){
          this.alert.message = "API.CLUBROLES.CLUBROLENAMEALREADYEXIST";
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
      else if(code == 404){ message = "HTTP.ERROR.CLUBROLES.CLUBROLENOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
    });
  }

}
