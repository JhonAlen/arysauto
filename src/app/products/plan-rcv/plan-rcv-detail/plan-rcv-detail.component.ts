import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-plan-rcv-detail',
  templateUrl: './plan-rcv-detail.component.html',
  styleUrls: ['./plan-rcv-detail.component.css']
})
export class PlanRcvDetailComponent implements OnInit {

  sub;
  currentUser;
  detail_form: UntypedFormGroup;
  loading: boolean = false;
  loading_cancel: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  planTypeList: any[] = [];
  paymentMethodologyList: any[] = [];
  insurerList: any[] = [];
  serviceList: any[] = [];
  serviceInsurerList: any[] = [];
  canCreate: boolean = false;
  canDetail: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;
  code;
  showSaveButton: boolean = false;
  showEditButton: boolean = false;
  editStatus: boolean = false;
  paymentMethodologyDeletedRowList: any[] = [];
  insurerDeletedRowList: any[] = [];
  serviceDeletedRowList: any[] = [];
  ctarifa;

  constructor(private formBuilder: UntypedFormBuilder, 
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private modalService : NgbModal) { 
                if (this.router.getCurrentNavigation().extras.state) {
                  this.ctarifa = this.router.getCurrentNavigation().extras.state; 
                }
              }

  ngOnInit(): void {
    this.detail_form = this.formBuilder.group({
      cplan_rc: [''],
      xplan_rc: [''],
      ctarifa: [''],
      xclase: [''],
      xtipo: [''],
      xgrupo: [''],
      msuma_cosas_rc: [''],
      msuma_personas_rc: [''],
      mprima_rc: [''],
      msuma_defensa_per: [''],
      mprima_defensa_per: [''],
      msuma_limite_ind: [''],
      mprima_limite_ind: [''],
      msuma_apov_mu: [''],
      mapov_mu: [''],
      msuma_apov_in: [''],
      mapov_in: [''],
      msuma_apov_ga: [''],
      mapov_ga: [''],
      msuma_apov_fu: [''],
      mapov_fu: [''],
      bactivo: [true]
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 108
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
        this.getPlanData();
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

  getPlanData(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cplan_rc: this.code,
      ctarifa: this.ctarifa
    };
    this.http.post(`${environment.apiUrl}/api/plan-rcv/detail`, params, options).subscribe((response : any) => {
      if(response.data.status){
        this.detail_form.get('xplan_rc').setValue(response.data.xplan_rc);
        this.detail_form.get('xplan_rc').disable();
        this.detail_form.get('ctarifa').setValue(response.data.ctarifa);
        this.detail_form.get('ctarifa').disable();
        this.detail_form.get('xclase').setValue(response.data.xclase);
        this.detail_form.get('xclase').disable();
        this.detail_form.get('xtipo').setValue(response.data.xtipo);
        this.detail_form.get('xtipo').disable();
        this.detail_form.get('xgrupo').setValue(response.data.xgrupo);
        this.detail_form.get('xgrupo').disable();
        this.detail_form.get('msuma_cosas_rc').setValue(response.data.msuma_cosas_rc);
        this.detail_form.get('msuma_cosas_rc').disable();
        this.detail_form.get('msuma_personas_rc').setValue(response.data.msuma_personas_rc);
        this.detail_form.get('msuma_personas_rc').disable();
        this.detail_form.get('mprima_rc').setValue(response.data.mprima_rc);
        this.detail_form.get('mprima_rc').disable();
        this.detail_form.get('msuma_defensa_per').setValue(response.data.msuma_defensa_per);
        this.detail_form.get('msuma_defensa_per').disable();
        this.detail_form.get('mprima_defensa_per').setValue(response.data.mprima_defensa_per);
        this.detail_form.get('mprima_defensa_per').disable();
        this.detail_form.get('msuma_limite_ind').setValue(response.data.msuma_limite_ind);
        this.detail_form.get('msuma_limite_ind').disable();
        this.detail_form.get('mprima_limite_ind').setValue(response.data.mprima_limite_ind);
        this.detail_form.get('mprima_limite_ind').disable();
        this.detail_form.get('msuma_apov_mu').setValue(response.data.msuma_apov_mu);
        this.detail_form.get('msuma_apov_mu').disable();
        this.detail_form.get('mapov_mu').setValue(response.data.mapov_mu);
        this.detail_form.get('mapov_mu').disable();
        this.detail_form.get('msuma_apov_in').setValue(response.data.msuma_apov_in);
        this.detail_form.get('msuma_apov_in').disable();
        this.detail_form.get('mapov_in').setValue(response.data.mapov_in);
        this.detail_form.get('mapov_in').disable();
        this.detail_form.get('msuma_apov_ga').setValue(response.data.msuma_apov_ga);
        this.detail_form.get('msuma_apov_ga').disable();
        this.detail_form.get('mapov_ga').setValue(response.data.mapov_ga);
        this.detail_form.get('mapov_ga').disable();
        this.detail_form.get('msuma_apov_fu').setValue(response.data.msuma_apov_fu);
        this.detail_form.get('msuma_apov_fu').disable();
        this.detail_form.get('mapov_fu').setValue(response.data.mapov_fu);
        this.detail_form.get('mapov_fu').disable();
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
  }

  editPlan(){
    this.detail_form.get('xplan_rc').enable();
    this.detail_form.get('xclase').enable();
    this.detail_form.get('xtipo').enable();
    this.detail_form.get('xgrupo').enable();
    this.detail_form.get('msuma_cosas_rc').enable();
    this.detail_form.get('msuma_personas_rc').enable();
    this.detail_form.get('mprima_rc').enable();
    this.detail_form.get('msuma_defensa_per').enable();
    this.detail_form.get('mprima_defensa_per').enable();
    this.detail_form.get('msuma_limite_ind').enable();
    this.detail_form.get('mprima_limite_ind').enable();
    this.detail_form.get('msuma_apov_ga').enable();
    this.detail_form.get('msuma_apov_mu').enable();
    this.detail_form.get('mapov_mu').enable();
    this.detail_form.get('msuma_apov_in').enable();
    this.detail_form.get('mapov_in').enable();
    this.detail_form.get('mapov_ga').enable();
    this.detail_form.get('msuma_apov_fu').enable();
    this.detail_form.get('mapov_fu').enable();
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
      this.getPlanData();
    }else{
      this.router.navigate([`/products/plan-rcv-index`]);
    }
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
      params = {
        cusuario: this.currentUser.data.cusuario,
        cplan_rc: this.code,
        xplan_rc: form.xplan_rc,
        ctarifa: this.ctarifa,
        xclase: form.xclase,
        xtipo: form.xtipo,
        xgrupo: form.xgrupo,
        msuma_cosas_rc: form.msuma_cosas_rc,
        msuma_personas_rc: form.msuma_personas_rc,
        mprima_rc: form.mprima_rc,
        msuma_defensa_per: form.msuma_defensa_per,
        mprima_defensa_per: form.mprima_defensa_per,
        msuma_limite_ind: form.msuma_limite_ind,
        mprima_limite_ind: form.mprima_limite_ind,
        msuma_apov_ga: form.msuma_apov_ga,
        msuma_apov_mu: form.msuma_apov_mu,
        mapov_mu: form.mapov_mu,
        msuma_apov_in: form.msuma_apov_in,
        mapov_in: form.mapov_in,
        mapov_ga: form.mapov_ga,
        msuma_apov_fu: form.msuma_apov_fu,
        mapov_fu: form.mapov_fu
      };
      url = `${environment.apiUrl}/api/plan-rcv/update`;
    }
    this.http.post(url, params, options).subscribe((response: any) => {
      if(response.data.status){
        if(this.code){
          location.reload();
        }else{
          this.router.navigate([`/plan-rcv/plan-rcv-detail/${response.data.cplan_rc}`]);
        }
      }else{
        let condition = response.data.condition;
        if(condition == "service-order-already-exist"){
          this.alert.message = "EVENTS.SERVICEORDER.NAMEREADYEXIST";
          this.alert.type = 'danger';
          this.alert.show = true;
        }
      }
      this.loading = false;
    },
    (err) => {
      let code = 1;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.THIRDPARTIES.ASSOCIATENOTFOUND"; }
      //else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
    });
  }
}
