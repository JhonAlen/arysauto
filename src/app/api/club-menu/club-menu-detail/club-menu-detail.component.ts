import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClubMenuSubMenuComponent } from '@app/pop-up/club-menu-sub-menu/club-menu-sub-menu.component';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-club-menu-detail',
  templateUrl: './club-menu-detail.component.html',
  styleUrls: ['./club-menu-detail.component.css']
})
export class ClubMenuDetailComponent implements OnInit {

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
  subMenuList: any[] = [];
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
      xmenuclub: ['', Validators.required],
      xcomponente: [''],
      xcontenido: ['', Validators.required],
      bsubmenu: [false, Validators.required],
      bactivo: [true, Validators.required]
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 88
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
        this.getClubMenuData();
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

  getClubMenuData(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      permissionData: {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 88
      },
      cmenuclub: this.code
    };
    this.http.post(`${environment.apiUrl}/api/v2/club-menu/production/detail`, params, options).subscribe((response: any) => {
      if(response.data.status){
        this.detail_form.get('cpais').setValue(response.data.cpais);
        this.detail_form.get('cpais').disable();
        this.detail_form.get('ccompania').setValue(response.data.ccompania);
        this.detail_form.get('ccompania').disable();
        this.detail_form.get('xmenuclub').setValue(response.data.xmenuclub);
        this.detail_form.get('xmenuclub').disable();
        this.detail_form.get('xcomponente').setValue(response.data.xcomponente);
        this.detail_form.get('xcomponente').disable();
        this.detail_form.get('xcontenido').setValue(response.data.xcontenido);
        this.detail_form.get('xcontenido').disable();
        this.detail_form.get('bsubmenu').setValue(response.data.bsubmenu);
        this.detail_form.get('bsubmenu').disable();
        this.detail_form.get('bactivo').setValue(response.data.bactivo);
        this.detail_form.get('bactivo').disable();
        this.subMenuList = [];
        for(let i =0; i < response.data.submenus.length; i++){
          this.subMenuList.push({
            cgrid: i,
            create: false,
            csubmenuclub: response.data.submenus[i].csubmenuclub,
            xsubmenuclub: response.data.submenus[i].xsubmenuclub,
            xcomponente: response.data.submenus[i].xcomponente,
            xcontenido: response.data.submenus[i].xcontenido,
            bactivo: response.data.submenus[i].bactivo,
            xactivo: response.data.submenus[i].bactivo ? this.translate.instant("DROPDOWN.YES") : this.translate.instant("DROPDOWN.NO")
          });
        }
      }
      this.loading_cancel = false;
    }, 
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.CLUBMENUS.CLUBMENUNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }

  editClubMenu(){
    this.detail_form.get('cpais').enable();
    this.detail_form.get('ccompania').enable();
    this.detail_form.get('xmenuclub').enable();
    this.detail_form.get('xcomponente').enable();
    this.detail_form.get('xcontenido').enable();
    this.detail_form.get('bsubmenu').enable();
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
      this.getClubMenuData();
    }else{
      this.router.navigate([`/api/club-menu-index`]);
    }
  }

  addSubMenu(){
    let subMenu = { type: 3 };
    const modalRef = this.modalService.open(ClubMenuSubMenuComponent);
    modalRef.componentInstance.subMenu = subMenu;
    modalRef.result.then((result: any) => { 
      if(result){
        if(result.type == 3){
          this.subMenuList.push({
            cgrid: this.subMenuList.length,
            create: true,
            xsubmenuclub: result.xsubmenuclub,
            xcomponente: result.xcomponente,
            xcontenido: result.xcontenido,
            bactivo: result.bactivo,
            xactivo: result.bactivo ? this.translate.instant("DROPDOWN.YES") : this.translate.instant("DROPDOWN.NO")
          });
          this.gridApi.setRowData(this.subMenuList);
        }
      }
    });
  }

  rowClicked(event: any){
    let subMenu = {};
    if(this.editStatus){ 
      subMenu = { 
        type: 1,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        csubmenuclub: event.data.csubmenuclub,
        xsubmenuclub: event.data.xsubmenuclub, 
        xcomponente: event.data.xcomponente,
        xcontenido: event.data.xcontenido,
        bactivo: event.data.bactivo,
        delete: false
      };
    }else{ 
      subMenu = { 
        type: 2,
        create: event.data.create,
        cgrid: event.data.cgrid,
        csubmenuclub: event.data.csubmenuclub,
        xsubmenuclub: event.data.xsubmenuclub, 
        xcomponente: event.data.xcomponente,
        xcontenido: event.data.xcontenido,
        bactivo: event.data.bactivo,
        delete: false
      }; 
    }
    const modalRef = this.modalService.open(ClubMenuSubMenuComponent);
    modalRef.componentInstance.subMenu = subMenu;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 1){
          for(let i = 0; i < this.subMenuList.length; i++){
            if(this.subMenuList[i].cgrid == result.cgrid){
              this.subMenuList[i].xsubmenuclub = result.xsubmenuclub;
              this.subMenuList[i].xcomponente = result.xcomponente;
              this.subMenuList[i].xcontenido = result.xcontenido;
              this.subMenuList[i].bactivo = result.bactivo;
              this.subMenuList[i].xactivo = result.bactivo ? this.translate.instant("DROPDOWN.YES") : this.translate.instant("DROPDOWN.NO");
              this.gridApi.refreshCells();
              return;
            }
          }
        }else if(result.type == 4){
          if(result.delete){
            this.deleteRowList.push({ csubmenuclub: result.csubmenuclub });
          }
          this.subMenuList = this.subMenuList.filter((row) => { return row.cgrid != result.cgrid });
          for(let i = 0; i < this.subMenuList.length; i++){
            this.subMenuList[i].cgrid = i;
          }
          this.gridApi.setRowData(this.subMenuList);
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
      let updateList = this.subMenuList.filter((row) => { return !row.create; });
      for(let i = 0; i < updateList.length; i++){
        delete updateList[i].cgrid;
        delete updateList[i].create;
        delete updateList[i].xactivo;
      }
      let createList = this.subMenuList.filter((row) => { return row.create; });
      for(let i = 0; i < createList.length; i++){
        delete createList[i].cgrid;
        delete createList[i].create;
        delete createList[i].xactivo;
      }
      params = {
        permissionData: {
          cusuario: this.currentUser.data.cusuario,
          cmodulo: 88
        },
        cmenuclub: this.code,
        xmenuclub: form.xmenuclub,
        xcomponente: form.xcomponente ? form.xcomponente : undefined,
        xcontenido: form.xcontenido,
        bsubmenu: form.bsubmenu,
        bactivo: form.bactivo,
        cpais: form.cpais,
        ccompania: form.ccompania,
        cusuariomodificacion: this.currentUser.data.cusuario,
        submenus: {
          create: createList,
          update: updateList,
          delete: this.deleteRowList
        }
      };
      url = `${environment.apiUrl}/api/v2/club-menu/production/update`;
    }else{
      let createList = this.subMenuList;
      for(let i = 0; i < createList.length; i++){
        delete createList[i].cgrid;
        delete createList[i].create;
        delete createList[i].xactivo;
      }
      params = {
        permissionData: {
          cusuario: this.currentUser.data.cusuario,
          cmodulo: 88
        },
        xmenuclub: form.xmenuclub,
        xcomponente: form.xcomponente ? form.xcomponente : undefined,
        xcontenido: form.xcontenido,
        bsubmenu: form.bsubmenu,
        bactivo: form.bactivo,
        cpais: form.cpais,
        ccompania: form.ccompania,
        cusuariocreacion: this.currentUser.data.cusuario,
        submenus: createList,
      };
      url = `${environment.apiUrl}/api/v2/club-menu/production/create`;
    }
    this.http.post(url, params, options).subscribe((response: any) => {
      if(response.data.status){
        if(this.code){
          location.reload();
        }else{
          this.router.navigate([`/api/club-menu-detail/${response.data.cmenuclub}`]);
        }
      }else{
        let condition = response.data.condition;
        if(condition == "club-menu-already-exist"){
          this.alert.message = "API.CLUBMENUS.CLUBMENUALREADYEXIST";
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
      else if(code == 404){ message = "HTTP.ERROR.CLUBMENUS.CLUBMENUNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
    });
  }

}
