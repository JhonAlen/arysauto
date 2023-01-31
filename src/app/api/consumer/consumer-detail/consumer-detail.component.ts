import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConsumerPermissionComponent } from '@app/pop-up/consumer-permission/consumer-permission.component';

import { PasswordValidator } from '@app/_validators/password.validator';
import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-consumer-detail',
  templateUrl: './consumer-detail.component.html',
  styleUrls: ['./consumer-detail.component.css']
})
export class ConsumerDetailComponent implements OnInit {

  private gridApi;
  sub;
  currentUser;
  detail_form: UntypedFormGroup;
  matching_xpasswords_group: UntypedFormGroup;
  loading: boolean = false;
  loading_cancel: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  countryList: any[] = [];
  companyList: any[] = [];
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
              private activatedRoute: ActivatedRoute,
              private modalService : NgbModal) { }

  ngOnInit(): void {
    this.matching_xpasswords_group = new UntypedFormGroup({
      xcontrasena: new UntypedFormControl('', Validators.compose([
        Validators.minLength(8),
        Validators.required,
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*#?&])[a-zA-Z0-9$@$!%*#?&]+$')
      ])),
      verify_xcontrasena: new UntypedFormControl('', Validators.required) 
    }, (formGroup: UntypedFormGroup) => {
      return PasswordValidator.areEqual(formGroup);
    });
    this.detail_form = this.formBuilder.group({
      cpais: ['', Validators.required],
      ccompania: ['', Validators.required],
      xconsumidor: ['', Validators.required],
      xproducto: ['', Validators.required],
      xemail: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])],
      matching_xcontrasena: this.matching_xpasswords_group,
      xusuario: ['', Validators.required],
      bactivo: [true, Validators.required]
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 83
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
        this.getConsumerData();
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

  getConsumerData(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      permissionData: {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 83
      },
      cconsumidor: this.code
    };
    this.http.post(`${environment.apiUrl}/api/v2/consumer/production/detail`, params, options).subscribe((response: any) => {
      if(response.data.status){
        this.detail_form.get('cpais').setValue(response.data.cpais);
        this.detail_form.get('cpais').disable();
        this.detail_form.get('ccompania').setValue(response.data.ccompania);
        this.detail_form.get('ccompania').disable();
        this.detail_form.get('xconsumidor').setValue(response.data.xconsumidor);
        this.detail_form.get('xconsumidor').disable();
        this.detail_form.get('xproducto').setValue(response.data.xproducto);
        this.detail_form.get('xproducto').disable();
        this.detail_form.get('xemail').setValue(response.data.xemail);
        this.detail_form.get('xemail').disable();
        this.detail_form.get('xusuario').setValue(response.data.xusuario);
        this.detail_form.get('xusuario').disable();
        this.detail_form.get('bactivo').setValue(response.data.bactivo);
        this.detail_form.get('bactivo').disable();
        this.detail_form.get('matching_xcontrasena').disable();
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
      else if(code == 404){ message = "HTTP.ERROR.CONSUMERS.CONSUMERNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }

  editConsumer(){
    this.detail_form.get('cpais').enable();
    this.detail_form.get('ccompania').enable();
    this.detail_form.get('xconsumidor').enable();
    this.detail_form.get('xproducto').enable();
    this.detail_form.get('xemail').enable();
    this.detail_form.get('xusuario').enable();
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
      this.getConsumerData();
    }else{
      this.router.navigate([`/api/consumer-index`]);
    }
  }

  addPermission(){
    let permission = { type: 3 };
    const modalRef = this.modalService.open(ConsumerPermissionComponent);
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
    const modalRef = this.modalService.open(ConsumerPermissionComponent);
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
      for(let i = 0; i < updateList.length; i++){
        delete updateList[i].cgrid;
        delete updateList[i].create;
        delete updateList[i].xgrupo;
        delete updateList[i].xmodulo;
        delete updateList[i].xindice;
        delete updateList[i].xcrear;
        delete updateList[i].xdetalle;
        delete updateList[i].xeditar;
        delete updateList[i].xeliminar;
      }
      let createList = this.permissionList.filter((row) => { return row.create; });
      for(let i = 0; i < createList.length; i++){
        delete createList[i].cgrid;
        delete createList[i].create;
        delete createList[i].xgrupo;
        delete createList[i].xmodulo;
        delete createList[i].xindice;
        delete createList[i].xcrear;
        delete createList[i].xdetalle;
        delete createList[i].xeditar;
        delete createList[i].xeliminar;
      }
      params = {
        permissionData: {
          cusuario: this.currentUser.data.cusuario,
          cmodulo: 83
        },
        cconsumidor: this.code,
        xconsumidor: form.xconsumidor,
        xproducto: form.xproducto,
        xemail: form.xemail,
        xusuario: form.xusuario,
        bactivo: form.bactivo,
        cpais: form.cpais,
        ccompania: form.ccompania,
        cusuariomodificacion: this.currentUser.data.cusuario,
        permissions: {
          create: createList,
          update: updateList,
          delete: this.deleteRowList
        }
      };
      url = `${environment.apiUrl}/api/v2/consumer/production/update`;
    }else{
      let createList = this.permissionList;
      for(let i = 0; i < createList.length; i++){
        delete createList[i].cgrid;
        delete createList[i].create;
        delete createList[i].xgrupo;
        delete createList[i].xmodulo;
        delete createList[i].xindice;
        delete createList[i].xcrear;
        delete createList[i].xdetalle;
        delete createList[i].xeditar;
        delete createList[i].xeliminar;
      }
      params = {
        permissionData: {
          cusuario: this.currentUser.data.cusuario,
          cmodulo: 83
        },
        xconsumidor: form.xconsumidor,
        xproducto: form.xproducto,
        xemail: form.xemail,
        xusuario: form.xusuario,
        xcontrasena: form.matching_xcontrasena.xcontrasena,
        bactivo: form.bactivo,
        cpais: form.cpais,
        ccompania: form.ccompania,
        cusuariocreacion: this.currentUser.data.cusuario,
        permissions: createList,
      };
      url = `${environment.apiUrl}/api/v2/consumer/production/create`;
    }
    this.http.post(url, params, options).subscribe((response: any) => {
      if(response.data.status){
        if(this.code){
          location.reload();
        }else{
          this.router.navigate([`/api/consumer-detail/${response.data.cconsumidor}`]);
        }
      }else{
        let condition = response.data.condition;
        if(condition == "product-already-exist"){
          this.alert.message = "API.CONSUMERS.PRODCUTALREADYEXIST";
          this.alert.type = 'danger';
          this.alert.show = true;
        }
        if(condition == "user-already-exist"){
          this.alert.message = "API.CONSUMERS.USERALREADYEXIST";
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
      else if(code == 404){ message = "HTTP.ERROR.CONSUMERS.CONSUMERNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
    });
  }
}
