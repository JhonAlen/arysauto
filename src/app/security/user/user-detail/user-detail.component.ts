import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserProviderComponent } from '@app/pop-up/user-provider/user-provider.component';
import { UserBrokersComponent } from '@app/pop-up/user-brokers/user-brokers.component';

import { PasswordValidator } from '@app/_validators/password.validator';
import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

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
  departmentList: any[] = [];
  roleList: any[] = [];
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
      cdepartamento: ['', Validators.required],
      crol: ['', Validators.required],
      xnombre: ['', Validators.required],
      xapellido: ['', Validators.required],
      xemail: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])],
      matching_xcontrasena: this.matching_xpasswords_group,
      xtelefono: ['', Validators.required],
      xdireccion: ['', Validators.required],
      bproveedor: [false, Validators.required],
      cproveedor: [''],
      xproveedor: [{ value: '', disabled: true }],
      xrazonsocial: [{ value: '', disabled: true }],
      bactivo: [true, Validators.required],
      bcorredor: [false],
      ccorredor: [''],
      xcorredor: ['']
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 1
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
        this.getUserData();
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

  getUserData(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cusuario: this.code
    };
    this.http.post(`${environment.apiUrl}/api/user/detail`, params, options).subscribe((response: any) => {
      if(response.data.status){
        this.detail_form.get('cpais').setValue(response.data.cpais);
        this.detail_form.get('cpais').disable();
        this.detail_form.get('ccompania').setValue(response.data.ccompania);
        this.detail_form.get('ccompania').disable();
        this.detail_form.get('cdepartamento').setValue(response.data.cdepartamento);
        this.detail_form.get('cdepartamento').disable();
        this.detail_form.get('xnombre').setValue(response.data.xnombre);
        this.detail_form.get('xnombre').disable();
        this.detail_form.get('xapellido').setValue(response.data.xapellido);
        this.detail_form.get('xapellido').disable();
        this.detail_form.get('xemail').setValue(response.data.xemail);
        this.detail_form.get('xemail').disable();
        this.detail_form.get('xtelefono').setValue(response.data.xtelefono);
        this.detail_form.get('xtelefono').disable();
        this.detail_form.get('xdireccion').setValue(response.data.xdireccion);
        this.detail_form.get('xdireccion').disable();
        this.detail_form.get('bproveedor').setValue(response.data.bproveedor);
        this.detail_form.get('bproveedor').disable();
        this.detail_form.get('bcorredor').setValue(response.data.bcorredor);
        this.detail_form.get('bcorredor').disable();
        if(response.data.bproveedor){
          this.detail_form.get('xnombre').setValue(response.data.xnombre);
          this.detail_form.get('xrazonsocial').setValue(response.data.xrazonsocial);
        }
        if(response.data.bcorredor){
          this.detail_form.get('xcorredor').setValue(response.data.xcorredor);
        }
        this.detail_form.get('xcorredor').setValue(response.data.xcorredor);
        this.detail_form.get('xcorredor').disable();
        this.detail_form.get('bactivo').setValue(response.data.bactivo);
        this.detail_form.get('bactivo').disable();
        this.detail_form.get('matching_xcontrasena').disable();
        this.roleDropdownDataRequest();
        this.detail_form.get('crol').setValue(response.data.crol);
        this.detail_form.get('crol').disable();
      }
      this.loading_cancel = false;
    }, 
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.USERS.USERNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }

  roleDropdownDataRequest(){
    if(this.detail_form.get('cdepartamento').value){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cdepartamento: this.detail_form.get('cdepartamento').value
      }
      this.http.post(`${environment.apiUrl}/api/valrep/role`, params, options).subscribe((response : any) => {
        if(response.data.status){
          this.roleList = [];
          for(let i = 0; i < response.data.list.length; i++){
            this.roleList.push({ id: response.data.list[i].crol, value: response.data.list[i].xrol });
          }
          this.roleList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.ROLENOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
    }
  }

  editUser(){
    this.detail_form.get('cpais').enable();
    this.detail_form.get('ccompania').enable();
    this.detail_form.get('cdepartamento').enable();
    this.detail_form.get('xnombre').enable();
    this.detail_form.get('xapellido').enable();
    this.detail_form.get('xemail').enable();
    this.detail_form.get('xtelefono').enable();
    this.detail_form.get('xdireccion').enable();
    this.detail_form.get('bproveedor').enable();
    this.detail_form.get('bcorredor').enable();
    this.detail_form.get('xcorredor').enable();
    this.detail_form.get('bactivo').enable();
    this.detail_form.get('crol').enable();
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
      this.getUserData();
    }else{
      this.router.navigate([`/security/user-index`]);
    }
  }

  checkProvider(event: any){
    if(!event.target.checked){
      this.detail_form.get('cproveedor').setValue('');
      this.detail_form.get('xproveedor').setValue('');
      this.detail_form.get('xrazonsocial').setValue('');
    }
  }

  searchProvider(){
    if(this.detail_form.get('cpais').value && this.detail_form.get('ccompania').value){
      let provider = { 
        cpais: this.detail_form.get('cpais').value,
        ccompania: this.detail_form.get('ccompania').value
      };
      const modalRef = this.modalService.open(UserProviderComponent, { size: 'xl' });
      modalRef.componentInstance.provider = provider;
      modalRef.result.then((result: any) => { 
        if(result){
          this.detail_form.get('cproveedor').setValue(result.cproveedor);
          this.detail_form.get('xnombre').setValue(result.xnombre);
          this.detail_form.get('xrazonsocial').setValue(result.xrazonsocial);
        }
      });
    }else{
      if(!this.detail_form.get('cpais').value){
        this.alert.message = "SECURITY.USERS.REQUIREDCOUNTRY";
        this.alert.type = 'warning';
        this.alert.show = true;
      }else if(!this.detail_form.get('ccompania').value){
        this.alert.message = "SECURITY.USERS.REQUIREDCOMPANY";
        this.alert.type = 'warning';
        this.alert.show = true;
      }
    }
  }

  checkBroker(event: any){
    if(!event.target.checked){
      this.detail_form.get('ccorredor').setValue('');
      this.detail_form.get('xcorredor').setValue('');
    }
  }

  searchBroker(){
    if(this.detail_form.get('cpais').value && this.detail_form.get('ccompania').value){
      let broker = { 
        cpais: this.detail_form.get('cpais').value,
        ccompania: this.detail_form.get('ccompania').value
      };
      const modalRef = this.modalService.open(UserBrokersComponent, { size: 'xl' });
      modalRef.componentInstance.broker = broker;
      modalRef.result.then((result: any) => { 
        if(result){
          this.detail_form.get('ccorredor').setValue(result.ccorredor);
          this.detail_form.get('xcorredor').setValue(result.xcorredor);
        }
      });
    }else{
      if(!this.detail_form.get('cpais').value){
        this.alert.message = "SECURITY.USERS.REQUIREDCOUNTRY";
        this.alert.type = 'warning';
        this.alert.show = true;
      }else if(!this.detail_form.get('ccompania').value){
        this.alert.message = "SECURITY.USERS.REQUIREDCOMPANY";
        this.alert.type = 'warning';
        this.alert.show = true;
      }
    }
  }

  onSubmit(form){
    this.submitted = true;
    this.loading = true;
    if(form.bproveedor && !form.cproveedor){
      this.alert.message = "SECURITY.USERS.REQUIREDPROVIDER";
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
      return;
    }
    if(this.detail_form.invalid){
      this.loading = false;
      return;
    }
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params;
    let url;
    if(this.code){
      params = {
        cusuario: this.code,
        xnombre: form.xnombre,
        xapellido: form.xapellido,
        xemail: form.xemail,
        xtelefono: form.xtelefono,
        xdireccion: form.xdireccion,
        bproveedor: form.bproveedor,
        bactivo: form.bactivo,
        cdepartamento: form.cdepartamento,
        cpais: form.cpais,
        ccompania: form.ccompania,
        crol: form.crol,
        cproveedor: form.cproveedor ? form.cproveedor : undefined,
        cusuariomodificacion: this.currentUser.data.cusuario,
        bcorredor: form.bcorredor,
        ccorredor: form.ccorredor ? form.ccorredor : undefined,
      };
      url = `${environment.apiUrl}/api/user/update`;
    }else{
      params = {
        xnombre: form.xnombre,
        xapellido: form.xapellido,
        xemail: form.xemail,
        xtelefono: form.xtelefono,
        xdireccion: form.xdireccion,
        xcontrasena: form.matching_xcontrasena.xcontrasena,
        bproveedor: form.bproveedor,
        bactivo: form.bactivo,
        cdepartamento: form.cdepartamento,
        cpais: form.cpais,
        ccompania: form.ccompania,
        crol: form.crol,
        cproveedor: form.cproveedor ? form.cproveedor : undefined,
        cusuariocreacion: this.currentUser.data.cusuario,
        bcorredor: form.bcorredor,
        ccorredor: form.ccorredor ? form.ccorredor : undefined,
      };
      url = `${environment.apiUrl}/api/user/create`;
    }
    this.http.post(url, params, options).subscribe((response: any) => {
      if(response.data.status){
        if(this.code){
          location.reload();
        }else{
          this.router.navigate([`/security/user-detail/${response.data.cusuario}`]);
        }
      }else{
        let condition = response.data.condition;
        if(condition == "email-already-exist"){
          this.alert.message = "SECURITY.USERS.EMAILALREADYEXIST";
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
      else if(code == 404){ message = "HTTP.ERROR.USERS.USERNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
    });
  }

}
