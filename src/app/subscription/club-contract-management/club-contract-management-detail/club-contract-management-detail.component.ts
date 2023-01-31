import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClubContractManagementOwnerComponent } from '@app/pop-up/club-contract-management-owner/club-contract-management-owner.component';
import { ClubContractManagementPaymentVoucherComponent } from '@app/pop-up/club-contract-management-payment-voucher/club-contract-management-payment-voucher.component';
import { ClubContractManagementVehicleComponent } from '@app/pop-up/club-contract-management-vehicle/club-contract-management-vehicle.component';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-club-contract-management-detail',
  templateUrl: './club-contract-management-detail.component.html',
  styleUrls: ['./club-contract-management-detail.component.css']
})
export class ClubContractManagementDetailComponent implements OnInit {

  private paymentVoucherGridApi;
  sub;
  currentUser;
  detail_form: UntypedFormGroup;
  upload_form: UntypedFormGroup;
  loading: boolean = false;
  loading_cancel: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  canCreate: boolean = false;
  canDetail: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;
  documentTypeList: any[] = [];
  civilStatusList: any[] = [];
  stateList: any[] = [];
  cityList: any[] = [];
  relationshipList: any[] = [];
  planTypeList: any[] = [];
  planList: any[] = [];
  paymentMethodologyList: any[] = [];
  paymentVoucherList: any[] = [];
  code;
  showSaveButton: boolean = false;
  showEditButton: boolean = false;
  editStatus: boolean = false;
  paymentVoucherDeletedRowList: any[] = [];

  constructor(private formBuilder: UntypedFormBuilder, 
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private router: Router,
              private translate: TranslateService,
              private activatedRoute: ActivatedRoute,
              private modalService : NgbModal) { }

  ngOnInit(): void {
    this.detail_form = this.formBuilder.group({
      finicio: [{ value: '', disabled: true }],
      fvencimiento: ['', Validators.required],
      frenovacion: [''],
      bactivo: [true, Validators.required],
      cprocedencia: [{ value: '', disabled: true }],
      cpropietario: ['', Validators.required],
      xnombrepropietario: [{ value: '', disabled: true }],
      xapellidopropietario: [{ value: '', disabled: true }],
      xdocidentidadpropietario: [{ value: '', disabled: true }],
      cvehiculopropietario: ['', Validators.required],
      xplaca: [{ value: '', disabled: true }],
      xmarca: [{ value: '', disabled: true }],
      xmodelo: [{ value: '', disabled: true }],
      xversion: [{ value: '', disabled: true }],
      bpropietario: [false, Validators.required],
      xnombre: ['', Validators.required],
      xapellido: ['', Validators.required],
      ctipodocidentidad: ['', Validators.required],
      xdocidentidad: ['', Validators.required],
      cestadocivil: ['', Validators.required],
      fnacimiento: ['', Validators.required],
      xprofesion: [''],
      xocupacion: [''],
      xdireccion: ['', Validators.required],
      cestado: ['', Validators.required],
      cciudad: ['', Validators.required],
      xtelefonocasa: [''],
      xtelefonocelular: ['', Validators.required],
      xfax: [''],
      xemail: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])],
      cparentesco: ['', Validators.required],
      ctipoplan: ['', Validators.required],
      cplan: ['', Validators.required],
      cmetodologiapago: ['', Validators.required]
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 86
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
    this.http.post(`${environment.apiUrl}/api/valrep/civil-status`, params, options).subscribe((response : any) => {
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.civilStatusList.push({ id: response.data.list[i].cestadocivil, value: response.data.list[i].xestadocivil });
        }
        this.civilStatusList.sort((a,b) => a.value > b.value ? 1 : -1);
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
    this.http.post(`${environment.apiUrl}/api/valrep/relationship`, params, options).subscribe((response : any) => {
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.relationshipList.push({ id: response.data.list[i].cparentesco, value: response.data.list[i].xparentesco });
        }
        this.relationshipList.sort((a,b) => a.value > b.value ? 1 : -1);
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.RELATIONSHIPNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
    this.http.post(`${environment.apiUrl}/api/valrep/plan-type`, params, options).subscribe((response : any) => {
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.planTypeList.push({ id: response.data.list[i].ctipoplan, value: response.data.list[i].xtipoplan });
        }
        this.planTypeList.sort((a,b) => a.value > b.value ? 1 : -1);
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.PLANTYPENOTFOUND"; }
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
        this.getClubContractData();
        if(this.canEdit){ this.showEditButton = true; }
      }else{
        if(!this.canCreate){
          this.router.navigate([`/permission-error`]);
          return;
        }
        this.editStatus = true;
        this.showSaveButton = true;
        this.detail_form.get('frenovacion').disable();
      }
    });
  }

  getClubContractData(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      permissionData: {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 86
      },
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania,
      ccontratoclub: this.code
    };
    this.http.post(`${environment.apiUrl}/api/v2/club-contract-management/production/detail`, params, options).subscribe((response: any) => {
      if(response.data.status){
        if(response.data.finicio){
          let dateFormat = new Date(response.data.finicio).toISOString().substring(0, 10);
          this.detail_form.get('finicio').setValue(dateFormat);
        }
        if(response.data.fvencimiento){
          let dateFormat = new Date(response.data.fvencimiento).toISOString().substring(0, 10);
          this.detail_form.get('fvencimiento').setValue(dateFormat);
        }
        this.detail_form.get('fvencimiento').disable();
        if(response.data.frenovacion){
          let dateFormat = new Date(response.data.frenovacion).toISOString().substring(0, 10);
          this.detail_form.get('frenovacion').setValue(dateFormat);
        }
        this.detail_form.get('frenovacion').disable();
        this.detail_form.get('bactivo').setValue(response.data.bactivo);
        this.detail_form.get('bactivo').disable();
        this.detail_form.get('cprocedencia').setValue(response.data.cprocedencia);
        if(response.data.cprocedencia == 'API'){ this.showEditButton = false;  }
        this.detail_form.get('cpropietario').setValue(response.data.cpropietario);
        this.detail_form.get('cpropietario').disable();
        this.detail_form.get('xnombrepropietario').setValue(response.data.xnombrepropietario);
        this.detail_form.get('xapellidopropietario').setValue(response.data.xapellidopropietario);
        this.detail_form.get('xdocidentidadpropietario').setValue(response.data.xdocidentidadpropietario);
        this.detail_form.get('cvehiculopropietario').setValue(response.data.cvehiculopropietario);
        this.detail_form.get('cvehiculopropietario').disable();
        this.detail_form.get('xplaca').setValue(response.data.xplaca);
        this.detail_form.get('xmarca').setValue(response.data.xmarca);
        this.detail_form.get('xmodelo').setValue(response.data.xmodelo);
        this.detail_form.get('xversion').setValue(response.data.xversion);
        this.detail_form.get('bpropietario').setValue(response.data.bpropietario);
        this.detail_form.get('bpropietario').disable();
        this.detail_form.get('xnombre').setValue(response.data.xnombre);
        this.detail_form.get('xnombre').disable();
        this.detail_form.get('xapellido').setValue(response.data.xapellido);
        this.detail_form.get('xapellido').disable();
        this.detail_form.get('cestadocivil').setValue(response.data.cestadocivil);
        this.detail_form.get('cestadocivil').disable();
        if(response.data.fnacimiento){
          let dateFormat = new Date(response.data.fnacimiento).toISOString().substring(0, 10);
          this.detail_form.get('fnacimiento').setValue(dateFormat);
          this.detail_form.get('fnacimiento').disable();
        }
        response.data.xprofesion ? this.detail_form.get('xprofesion').setValue(response.data.xprofesion) : false;
        this.detail_form.get('xprofesion').disable();
        response.data.xprofesion ? this.detail_form.get('xocupacion').setValue(response.data.xocupacion) : false;
        this.detail_form.get('xocupacion').disable();
        this.detail_form.get('ctipodocidentidad').setValue(response.data.ctipodocidentidad);
        this.detail_form.get('ctipodocidentidad').disable();
        this.detail_form.get('xdocidentidad').setValue(response.data.xdocidentidad);
        this.detail_form.get('xdocidentidad').disable();
        this.detail_form.get('cestado').setValue(response.data.cestado);
        this.detail_form.get('cestado').disable();
        this.cityDropdownDataRequest();
        this.detail_form.get('cciudad').setValue(response.data.cciudad);
        this.detail_form.get('cciudad').disable();
        this.detail_form.get('xdireccion').setValue(response.data.xdireccion);
        this.detail_form.get('xdireccion').disable();
        this.detail_form.get('xemail').setValue(response.data.xemail);
        this.detail_form.get('xemail').disable();
        this.detail_form.get('xtelefonocelular').setValue(response.data.xtelefonocelular);
        this.detail_form.get('xtelefonocelular').disable();
        response.data.xtelefonocasa ? this.detail_form.get('xtelefonocasa').setValue(response.data.xtelefonocasa) : false;
        this.detail_form.get('xtelefonocasa').disable();
        response.data.xfax ? this.detail_form.get('xfax').setValue(response.data.xfax) : false;
        this.detail_form.get('xfax').disable();
        this.detail_form.get('cparentesco').setValue(response.data.cparentesco);
        this.detail_form.get('cparentesco').disable();
        this.detail_form.get('ctipoplan').setValue(response.data.ctipoplan);
        this.detail_form.get('ctipoplan').disable();
        this.planDropdownDataRequest();
        this.detail_form.get('cplan').setValue(response.data.cplan);
        this.detail_form.get('cplan').disable();
        this.paymentMethodologyDropdownDataRequest();
        this.detail_form.get('cmetodologiapago').setValue(response.data.cmetodologiapago);
        this.detail_form.get('cmetodologiapago').disable();
        this.paymentVoucherList = [];
        if(response.data.paymentVouchers){
          for(let i =0; i < response.data.paymentVouchers.length; i++){
            this.paymentVoucherList.push({
              cgrid: i,
              create: false,
              ccomprobantepago: response.data.paymentVouchers[i].ccomprobantepago,
              ctransaccion: response.data.paymentVouchers[i].ctransaccion,
              creferenciatransaccion: response.data.paymentVouchers[i].creferenciatransaccion,
              cbanco: response.data.paymentVouchers[i].cbanco,
              xbanco: response.data.paymentVouchers[i].xbanco
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
      else if(code == 404){ message = "HTTP.ERROR.CLUBCONTRACTSMANAGEMENT.CLUBCONTRACTMANAGEMENTNOTFOUND"; }
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

  planDropdownDataRequest(){
    if(this.detail_form.get('ctipoplan').value){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania,
        ctipoplan: this.detail_form.get('ctipoplan').value
      }
      this.http.post(`${environment.apiUrl}/api/valrep/plan`, params, options).subscribe((response : any) => {
        if(response.data.status){
          this.planList = [];
          for(let i = 0; i < response.data.list.length; i++){
            this.planList.push({ id: response.data.list[i].cplan, value: response.data.list[i].xplan });
          }
          this.planList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.PLANNOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
    }
  }

  paymentMethodologyDropdownDataRequest(){
    if(this.detail_form.get('cplan').value){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania,
        cplan: this.detail_form.get('cplan').value
      }
      this.http.post(`${environment.apiUrl}/api/v2/valrep/production/search/plan/payment-methodology`, params, options).subscribe((response : any) => {
        if(response.data.status){
          this.paymentMethodologyList = [];
          for(let i = 0; i < response.data.list.length; i++){
            this.paymentMethodologyList.push({ id: response.data.list[i].cmetodologiapago, value: response.data.list[i].xmetodologiapago });
          }
          this.paymentMethodologyList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.PAYMENTMETHODOLOGYNOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
    }
  }

  editClubContract(){
    this.detail_form.get('cpropietario').enable();
    this.detail_form.get('cvehiculopropietario').enable();
    this.detail_form.get('bpropietario').enable();
    this.detail_form.get('ctipoplan').enable();
    this.detail_form.get('cplan').enable();
    this.detail_form.get('cmetodologiapago').enable();
    this.detail_form.get('frenovacion').enable();
    this.detail_form.get('fvencimiento').enable();
    this.detail_form.get('bactivo').enable();
    this.detail_form.get('xnombre').enable();
    this.detail_form.get('xapellido').enable();
    this.detail_form.get('ctipodocidentidad').enable();
    this.detail_form.get('xdocidentidad').enable();
    this.detail_form.get('cestadocivil').enable();
    this.detail_form.get('fnacimiento').enable();
    this.detail_form.get('xprofesion').enable();
    this.detail_form.get('xocupacion').enable();
    this.detail_form.get('xdireccion').enable();
    this.detail_form.get('cestado').enable();
    this.detail_form.get('cciudad').enable();
    this.detail_form.get('xtelefonocasa').enable();
    this.detail_form.get('xtelefonocelular').enable();
    this.detail_form.get('xfax').enable();
    this.detail_form.get('xemail').enable();
    this.detail_form.get('cparentesco').enable();
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
      this.getClubContractData();
    }else{
      this.router.navigate([`/subscription/club-contract-management-index`]);
    }
  }

  checkOwner(event: any){
    if(!event.target.checked){
      this.detail_form.get('xnombre').setValue('');
      this.detail_form.get('xapellido').setValue('');
      this.detail_form.get('ctipodocidentidad').setValue('');
      this.detail_form.get('xdocidentidad').setValue('');
      this.detail_form.get('cestadocivil').setValue('');
      this.detail_form.get('fnacimiento').setValue('');
      this.detail_form.get('xprofesion').setValue('');
      this.detail_form.get('xocupacion').setValue('');
      this.detail_form.get('xdireccion').setValue('');
      this.detail_form.get('cestado').setValue('');
      this.detail_form.get('cciudad').setValue('');
      this.detail_form.get('xtelefonocasa').setValue('');
      this.detail_form.get('xtelefonocelular').setValue('');
      this.detail_form.get('xfax').setValue('');
      this.detail_form.get('xemail').setValue('');
      this.detail_form.get('cparentesco').setValue('');
    }else if(event.target.checked){
      if(this.detail_form.get('cpropietario').value){
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let options = { headers: headers };
        let params = {
          cpais: this.currentUser.data.cpais,
          ccompania: this.currentUser.data.ccompania,
          cpropietario: this.detail_form.get('cpropietario').value
        };
        this.http.post(`${environment.apiUrl}/api/v2/club-contract-management/production/detail/owner`, params, options).subscribe((response: any) => {
          if(response.data.status){
            this.detail_form.get('xnombre').setValue(response.data.xnombre);
            this.detail_form.get('xapellido').setValue(response.data.xapellido);
            this.detail_form.get('cestadocivil').setValue(response.data.cestadocivil);
            if(response.data.fnacimiento){
              let dateFormat = new Date(response.data.fnacimiento).toISOString().substring(0, 10);
              this.detail_form.get('fnacimiento').setValue(dateFormat);
            }
            response.data.xprofesion ? this.detail_form.get('xprofesion').setValue(response.data.xprofesion) : false;
            response.data.xprofesion ? this.detail_form.get('xocupacion').setValue(response.data.xocupacion) : false;
            this.detail_form.get('ctipodocidentidad').setValue(response.data.ctipodocidentidad);
            this.detail_form.get('xdocidentidad').setValue(response.data.xdocidentidad);
            this.detail_form.get('cestado').setValue(response.data.cestado);
            this.cityDropdownDataRequest();
            this.detail_form.get('cciudad').setValue(response.data.cciudad);
            this.detail_form.get('xdireccion').setValue(response.data.xdireccion);
            this.detail_form.get('xemail').setValue(response.data.xemail);
            this.detail_form.get('xtelefonocelular').setValue(response.data.xtelefonocelular);
            response.data.xtelefonocasa ? this.detail_form.get('xtelefonocasa').setValue(response.data.xtelefonocasa) : false;
            response.data.xfax ? this.detail_form.get('xfax').setValue(response.data.xfax) : false;
            this.detail_form.get('cparentesco').setValue(response.data.cparentesco);
          }
          this.loading_cancel = false;
        }, 
        (err) => {
          let code = err.error.data.code;
          let message;
          if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
          else if(code == 404){ message = "HTTP.ERROR.CLUBCONTRACTSMANAGEMENT.OWNERNOTFOUND"; }
          else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
          this.alert.message = message;
          this.alert.type = 'danger';
          this.alert.show = true;
        });
      }else{
        console.log('aqui');
        this.detail_form.get('bpropietario').setValue(false);
        this.alert.message = "SUBSCRIPTION.CLUBCONTRACTSMANAGEMENT.REQUIREDOWNER";
        this.alert.type = 'warning';
        this.alert.show = true;
      }
    }
  }

  searchOwner(){
    let owner = { };
    const modalRef = this.modalService.open(ClubContractManagementOwnerComponent, { size: 'xl' });
    modalRef.componentInstance.owner = owner;
    modalRef.result.then((result: any) => { 
      if(result){
        this.detail_form.get('cpropietario').setValue(result.cpropietario);
        this.detail_form.get('xnombrepropietario').setValue(result.xnombre);
        this.detail_form.get('xapellidopropietario').setValue(result.xapellido);
        this.detail_form.get('xdocidentidadpropietario').setValue(result.xdocidentidad);
        this.detail_form.get('cvehiculopropietario').setValue('');
        this.detail_form.get('xplaca').setValue('');
        this.detail_form.get('xmarca').setValue('');
        this.detail_form.get('xmodelo').setValue('');
        this.detail_form.get('xversion').setValue('');
        this.detail_form.get('bpropietario').setValue(false);
        this.detail_form.get('xnombre').setValue('');
        this.detail_form.get('xapellido').setValue('');
        this.detail_form.get('ctipodocidentidad').setValue('');
        this.detail_form.get('xdocidentidad').setValue('');
        this.detail_form.get('cestadocivil').setValue('');
        this.detail_form.get('fnacimiento').setValue('');
        this.detail_form.get('xprofesion').setValue('');
        this.detail_form.get('xocupacion').setValue('');
        this.detail_form.get('xdireccion').setValue('');
        this.detail_form.get('cestado').setValue('');
        this.detail_form.get('cciudad').setValue('');
        this.detail_form.get('xtelefonocasa').setValue('');
        this.detail_form.get('xtelefonocelular').setValue('');
        this.detail_form.get('xfax').setValue('');
        this.detail_form.get('xemail').setValue('');
        this.detail_form.get('cparentesco').setValue('');
      }
    });
  }

  searchVehicle(){
    let vehicle = { cpropietario: this.detail_form.get('cpropietario').value };
    const modalRef = this.modalService.open(ClubContractManagementVehicleComponent, { size: 'xl' });
    modalRef.componentInstance.vehicle = vehicle;
    modalRef.result.then((result: any) => { 
      if(result){
        this.detail_form.get('cvehiculopropietario').setValue(result.cvehiculopropietario);
        this.detail_form.get('xplaca').setValue(result.xplaca);
        this.detail_form.get('xmarca').setValue(result.xmarca);
        this.detail_form.get('xmodelo').setValue(result.xmodelo);
        this.detail_form.get('xversion').setValue(result.xversion);
      }
    });
  }

  addPaymentVoucher(){
    let paymentVoucher = { type: 3 };
    const modalRef = this.modalService.open(ClubContractManagementPaymentVoucherComponent);
    modalRef.componentInstance.paymentVoucher = paymentVoucher;
    modalRef.result.then((result: any) => { 
      if(result){
        if(result.type == 3){
          this.paymentVoucherList.push({
            cgrid: this.paymentVoucherList.length,
            create: true,
            cbanco: result.cbanco,
            xbanco: result.xbanco,
            ctransaccion: result.ctransaccion,
            creferenciatransaccion: result.creferenciatransaccion
          });
          this.paymentVoucherGridApi.setRowData(this.paymentVoucherList);
        }
      }
    });
  }

  paymentVoucherRowClicked(event: any){
    let paymentVoucher = {};
    if(this.editStatus){ 
      paymentVoucher = { 
        type: 1,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        ccomprobantepago: event.data.ccomprobantepago,
        cbanco: event.data.cbanco,
        ctransaccion: event.data.ctransaccion,
        creferenciatransaccion: event.data.creferenciatransaccion,
        delete: false
      };
    }else{ 
      paymentVoucher = { 
        type: 2,
        create: event.data.create,
        cgrid: event.data.cgrid,
        ccomprobantepago: event.data.ccomprobantepago,
        cbanco: event.data.cbanco,
        ctransaccion: event.data.ctransaccion,
        creferenciatransaccion: event.data.creferenciatransaccion,
        delete: false
      }; 
    }
    const modalRef = this.modalService.open(ClubContractManagementPaymentVoucherComponent);
    modalRef.componentInstance.paymentVoucher = paymentVoucher;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 1){
          for(let i = 0; i < this.paymentVoucherList.length; i++){
            if(this.paymentVoucherList[i].cgrid == result.cgrid){
              this.paymentVoucherList[i].cbanco = result.cbanco;
              this.paymentVoucherList[i].xbanco = result.xbanco;
              this.paymentVoucherList[i].ctransaccion = result.ctransaccion;
              this.paymentVoucherList[i].creferenciatransaccion = result.creferenciatransaccion;
              this.paymentVoucherGridApi.refreshCells();
              return;
            }
          }
        }else if(result.type == 4){
          if(result.delete){
            this.paymentVoucherDeletedRowList.push({ ccomprobantepago: result.ccomprobantepago });
          }
          this.paymentVoucherList = this.paymentVoucherList.filter((row) => { return row.cgrid != result.cgrid });
          for(let i = 0; i < this.paymentVoucherList.length; i++){
            this.paymentVoucherList[i].cgrid = i;
          }
          this.paymentVoucherGridApi.setRowData(this.paymentVoucherList);
        }
      }
    });
  }

  onPaymentVouchersGridReady(event){
    this.paymentVoucherGridApi = event.api;
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
      let updatePaymentVoucherList = this.paymentVoucherList.filter((row) => { return !row.create; });
      for(let i = 0; i < updatePaymentVoucherList.length; i++){
        delete updatePaymentVoucherList[i].cgrid;
        delete updatePaymentVoucherList[i].create;
        delete updatePaymentVoucherList[i].xbanco;
      }
      let createPaymentVoucherList = this.paymentVoucherList.filter((row) => { return row.create; });
      for(let i = 0; i < createPaymentVoucherList.length; i++){
        delete createPaymentVoucherList[i].cgrid;
        delete createPaymentVoucherList[i].create;
        delete createPaymentVoucherList[i].xbanco;
      }
      params = {
        permissionData: {
          cusuario: this.currentUser.data.cusuario,
          cmodulo: 86
        },
        ccontratoclub: this.code,
        cusuariomodificacion: this.currentUser.data.cusuario,
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania,
        cpropietario: form.cpropietario,
        cvehiculopropietario: form.cvehiculopropietario,
        bpropietario: form.bpropietario,
        xnombre: form.xnombre,
        xapellido: form.xapellido,
        ctipodocidentidad: form.ctipodocidentidad,
        xdocidentidad: form.xdocidentidad,
        cestadocivil: form.cestadocivil,
        fnacimiento: form.fnacimiento,
        xprofesion: form.xprofesion ? form.xprofesion : undefined,
        xocupacion: form.xocupacion ? form.xocupacion : undefined,
        cestado: form.cestado,
        cciudad: form.cciudad,
        xdireccion: form.xdireccion,
        xtelefonocasa: form.xtelefonocasa ? form.xtelefonocasa : undefined,
        xfax: form.xfax ? form.xfax : undefined,
        xtelefonocelular: form.xtelefonocelular,
        xemail: form.xemail,
        cparentesco: form.cparentesco,
        fvencimiento: form.fvencimiento,
        frenovacion: form.frenovacion ? form.frenovacion : undefined,
        ctipoplan: form.ctipoplan,
        cplan: form.cplan,
        cmetodologiapago: form.cmetodologiapago,
        bactivo: form.bactivo,
        paymentVouchers: {
          create: createPaymentVoucherList,
          update: updatePaymentVoucherList,
          delete: this.paymentVoucherDeletedRowList
        }
      };
      url = `${environment.apiUrl}/api/v2/club-contract-management/production/update`;
    }else{
      let createPaymentVoucherList = this.paymentVoucherList;
      for(let i = 0; i < createPaymentVoucherList.length; i++){
        delete createPaymentVoucherList[i].cgrid;
        delete createPaymentVoucherList[i].create;
        delete createPaymentVoucherList[i].xbanco;
      }
      params = {
        permissionData: {
          cusuario: this.currentUser.data.cusuario,
          cmodulo: 86
        },
        cusuariocreacion: this.currentUser.data.cusuario,
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania,
        cpropietario: form.cpropietario,
        cvehiculopropietario: form.cvehiculopropietario,
        bpropietario: form.bpropietario,
        xnombre: form.xnombre,
        xapellido: form.xapellido,
        ctipodocidentidad: form.ctipodocidentidad,
        xdocidentidad: form.xdocidentidad,
        cestadocivil: form.cestadocivil,
        fnacimiento: form.fnacimiento,
        xprofesion: form.xprofesion ? form.xprofesion : undefined,
        xocupacion: form.xocupacion ? form.xocupacion : undefined,
        cestado: form.cestado,
        cciudad: form.cciudad,
        xdireccion: form.xdireccion,
        xtelefonocasa: form.xtelefonocasa ? form.xtelefonocasa : undefined,
        xfax: form.xfax ? form.xfax : undefined,
        xtelefonocelular: form.xtelefonocelular,
        xemail: form.xemail,
        cparentesco: form.cparentesco,
        fvencimiento: form.fvencimiento,
        ctipoplan: form.ctipoplan,
        cplan: form.cplan,
        cmetodologiapago: form.cmetodologiapago,
        bactivo: form.bactivo,
        paymentVouchers: createPaymentVoucherList
      };
      url = `${environment.apiUrl}/api/v2/club-contract-management/production/create`;
    }
    this.http.post(url, params, options).subscribe((response: any) => {
      if(response.data.status){
        if(this.code){
          location.reload();
        }else{
          this.router.navigate([`/subscription/club-contract-management-detail/${response.data.ccontratoclub}`]);
        }
      }else{
        let condition = response.data.condition;
        if(condition == "owner-already-exist"){
          this.alert.message = "SUBSCRIPTION.CLUBCONTRACTSMANAGEMENT.OWNERREADYEXIST";
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
      else if(code == 404){ message = "HTTP.ERROR.CLUBCONTRACTSMANAGEMENT.CLUBCONTRACTMANAGEMENTNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
    });
  }

}
