import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';
import { WebServiceConnectionService } from '@services/web-service-connection.service';

@Component({
  selector: 'app-brand-model-version-detail',
  templateUrl: './brand-model-version-detail.component.html',
  styleUrls: ['./brand-model-version-detail.component.css']
})
export class BrandModelVersionDetailComponent implements OnInit {

  showSaveButton: boolean = false;
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
  cmarca;
  cmodelo;
  cversion;
  createBrand: boolean = false;
  createModel: boolean = false;
  createVersion: boolean = false;
  alert = { show: false, type: "", message: "" };
  showEditButton: boolean;
  transmissionTypeList: any;
  modelList: any[];

  constructor(private formBuilder: FormBuilder, 
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private router: Router,
              private translate: TranslateService,
              private activatedRoute: ActivatedRoute,
              private modalService : NgbModal,
              private webService: WebServiceConnectionService) {    
              // if (this.router.getCurrentNavigation().extras.state == null) {
              //   // this.router.navigate([`tables/brand-model-version-index`]);
              //   console.log('pasa tranquilo rey')
              // } else {
              //   this.cmarca = this.router.getCurrentNavigation().extras.state.cmarca;
              //   this.cmodelo = this.router.getCurrentNavigation().extras.state.cmodelo; 
              //   this.cversion = this.router.getCurrentNavigation().extras.state.cversion;  
              // } 
            }

  ngOnInit(): void {
    this.detail_form = this.formBuilder.group({
      cmarca:[''],
      xmarca: [''],
      cmodelo:[''],
      xmodelo:[''],
      cversion: [''],
      xversion: [''],
      npasajeros: [''],
      xtransmision:[''],
      bactivo: [true]
    })
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 113
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
    this.sub = this.activatedRoute.paramMap.subscribe(params => {
      this.code = params.get('id');
      if (this.code) {
        if (!this.canDetail) {
          this.router.navigate([`/permission-error`]);
          return;
        }
        this.getBrandData();
        if (this.canEdit) { this.showEditButton = true; }
      } else {
        if (!this.canCreate) {
          this.router.navigate([`/permission-error`]);
          return;
        }
        this.showSaveButton = true;
      }
    });

  }
   async getBrandData(): Promise<void> {
    let params = {
      permissionData: {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 24
      },
      cmarca: this.code,
      cpais: this.currentUser.data.cpais
    };
    let request = await this.webService.detailBrand(params);
    if (request.error) {
      this.alert.message = request.message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading_cancel = false;
      return;
    }
    if (request.data.status) {
      this.detail_form.get('xmarca').setValue(request.data.xmarca);
      this.detail_form.get('xmarca').disable();
      this.detail_form.get('bactivo').setValue(request.data.bactivo);
      this.detail_form.get('bactivo').disable();
    }
    this.loading_cancel = false;
    return;
  }

   async getModelData(): Promise<void> {
    // let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    // let options = { headers: headers };
    let params = {
      permissionData: {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 25
      },
      cpais: this.currentUser.data.cpais,
      cmodelo: this.code
    };
    // this.http.post(`${environment.apiUrl}/api/model/detail`, params, options).subscribe((response: any) => {
    let request = await this.webService.detailModel(params);
    if (request.error) {
      this.alert.message = request.message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading_cancel = false;
      return;
    }
    if (request.data.status) {
      // this.detail_form.get('casociado').setValue(request.data.casociado);
      // this.detail_form.get('casociado').disable();
      this.detail_form.get('cmarca').setValue(request.data.cmarca);
      this.detail_form.get('cmarca').disable();
      this.detail_form.get('xmodelo').setValue(request.data.xmodelo);
      this.detail_form.get('xmodelo').disable();
      this.detail_form.get('bactivo').setValue(request.data.bactivo);
      this.detail_form.get('bactivo').disable();
    }
    this.loading_cancel = false;
    return;
  }

  getVersionData(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cpais: this.currentUser.data.cpais,
      cversion: this.code
    };
    this.http.post(`${environment.apiUrl}/api/version/detail`, params, options).subscribe((response: any) => {
      if(response.data.status){
        this.detail_form.get('cmarca').setValue(response.data.cmarca);
        this.detail_form.get('cmarca').disable();
        this.modelDropdownDataRequest();
        this.detail_form.get('cmodelo').setValue(response.data.cmodelo);
        this.detail_form.get('cmodelo').disable();
        this.detail_form.get('xversion').setValue(response.data.xversion);
        this.detail_form.get('xversion').disable();
        this.detail_form.get('xtransmision').setValue(response.data.xtransmision);
        this.detail_form.get('xtransmision').disable();
        this.transmissionTypeList.push({ id: response.data.xtransmision, value: response.data.xtransmision });
        this.detail_form.get('npasajero').setValue(response.data.npasajero);
        this.detail_form.get('npasajero').disable();
        this.detail_form.get('bactivo').setValue(response.data.bactivo);
        this.detail_form.get('bactivo').disable();
      }
      this.loading_cancel = false;
    }, 
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VERSIONS.VERSIONNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }

  modelDropdownDataRequest(){
    if(this.detail_form.get('cmarca').value){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cpais: this.currentUser.data.cpais,
        cmarca: this.detail_form.get('cmarca').value
      }
      this.http.post(`${environment.apiUrl}/api/valrep/model`, params, options).subscribe((response : any) => {
        if(response.data.status){
          this.modelList = [];
          for(let i = 0; i < response.data.list.length; i++){
            this.modelList.push({ id: response.data.list[i].cmodelo, value: response.data.list[i].xmodelo });
          }
          this.modelList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.MODELNOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
    }
  }


}
