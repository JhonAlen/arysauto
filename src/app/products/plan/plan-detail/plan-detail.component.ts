import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PlanServiceComponent } from '@app/pop-up/plan-service/plan-service.component';
import { PlanAmountRcvComponent } from '@app/pop-up/plan-amount-rcv/plan-amount-rcv.component';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-plan-detail',
  templateUrl: './plan-detail.component.html',
  styleUrls: ['./plan-detail.component.css']
})
export class PlanDetailComponent implements OnInit {

  private paymentMethodologyGridApi;
  private insurerGridApi;
  private serviceGridApi;
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
  rcvAmout = {};

  constructor(private formBuilder: UntypedFormBuilder, 
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private modalService : NgbModal) { }

  ngOnInit(): void {
    this.detail_form = this.formBuilder.group({
      ctipoplan: ['', Validators.required],
      xplan: ['', Validators.required],
      mcosto: ['', Validators.required],
      parys:[''],
      paseguradora:[''],
      bactivo: [true, Validators.required],
      brcv: [false]
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 81
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
      ccompania: this.currentUser.data.ccompania
    };
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
      permissionData: {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 81
      },
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania,
      cplan: this.code
    };
    this.http.post(`${environment.apiUrl}/api/plan/detail`, params, options).subscribe((response: any) => {
      if(response.data.status){
        this.detail_form.get('ctipoplan').setValue(response.data.ctipoplan);
        this.detail_form.get('ctipoplan').disable();
        this.detail_form.get('xplan').setValue(response.data.xplan);
        this.detail_form.get('xplan').disable();
        this.detail_form.get('mcosto').setValue(response.data.mcosto);
        this.detail_form.get('mcosto').disable();
        this.detail_form.get('parys').setValue(response.data.parys);
        this.detail_form.get('parys').disable();
        this.detail_form.get('paseguradora').setValue(response.data.paseguradora);
        this.detail_form.get('paseguradora').disable();
        this.detail_form.get('brcv').setValue(response.data.brcv);
        this.detail_form.get('brcv').disable();
        this.detail_form.get('bactivo').setValue(response.data.bactivo);
        this.detail_form.get('bactivo').disable();
        this.serviceList = [];
        if(response.data.services){
          for(let i =0; i < response.data.services.length; i++){
            this.serviceList.push({
              cgrid: i,
              create: false,
              ctiposervicio: response.data.services[i].ctiposervicio,
              xtiposervicio: response.data.services[i].xtiposervicio,
            });
          }
        }
        this.serviceInsurerList = [];
        if(response.data.servicesInsurers){
          for(let i =0; i < response.data.servicesInsurers.length; i++){
            this.serviceInsurerList.push({
              cservicio: response.data.servicesInsurers[i].cservicio,
              xservicio: response.data.servicesInsurers[i].xservicio,
              xtiposervicio: response.data.servicesInsurers[i].xtiposervicio,
            })
          }
        }
      }
      this.loading_cancel = false;
    }, 
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.PLANS.PLANNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }

  editPlan(){
    this.detail_form.get('ctipoplan').enable();
    this.detail_form.get('xplan').enable();
    this.detail_form.get('parys').enable();
    this.detail_form.get('paseguradora').enable();
    this.detail_form.get('bactivo').enable();
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
      this.router.navigate([`/products/plan-index`]);
    }
  }

  addService(){
    let service = { type: 3 };
    const modalRef = this.modalService.open(PlanServiceComponent, {size: 'xl'});
    modalRef.componentInstance.service = service;
    modalRef.result.then((result: any) => { 
      if(result){
        this.serviceList = []; 
        for(let i = 0; i < result.length; i++){
          // this.serviceList = [];
          this.serviceList.push({
            cgrid: this.serviceList.length,
            create: true,
            ctiposervicio: result[i].ctiposervicio,
            xtiposervicio: result[i].xtiposervicio,
          });
        }
        //this.serviceGridApi.setRowData(this.serviceList);
      }
    });
  }

  serviceRowClicked(event: any){
    let service = {};
    if(this.editStatus){ 
      service = { 
        type: 1,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        ctiposervicio: event.data.ctiposervicio,
        delete: false
      };
    }else{ 
      service = { 
        type: 2,
        create: event.data.create,
        cgrid: event.data.cgrid,
        ctiposervicio: event.data.ctiposervicio,
        delete: false
      }; 
    }
    const modalRef = this.modalService.open(PlanServiceComponent, {size: 'xl'});
    modalRef.componentInstance.service = service;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 1){
          for(let i = 0; i < this.serviceList.length; i++){
            if(this.serviceList[i].cgrid == result.cgrid){
              this.serviceList[i].ctiposervicio = result.ctiposervicio;
              this.serviceList[i].xtiposervicio = result.xtiposervicio;
              this.serviceGridApi.refreshCells();
              return;
            }
          }
        }
      }
    });
  }

  onServicesGridReady(event){
    this.serviceGridApi = event.api;
  }

  changeRcv(){
    if(this.detail_form.get('brcv').value == true){
      let rcv = { };
      const modalRef = this.modalService.open(PlanAmountRcvComponent, {size: 'xl'});
      modalRef.componentInstance.rcv = rcv;
      modalRef.result.then((result: any) => { 
        if(result){
          this.rcvAmout = {
            msuma_dc: result.msuma_dc,
            msuma_personas: result.msuma_personas,
            msuma_exceso: result.msuma_exceso,
            msuma_dp: result.msuma_dp,
            msuma_muerte: result.msuma_muerte,
            msuma_invalidez: result.msuma_invalidez,
            msuma_gm: result.msuma_gm,
            msuma_gf: result.msuma_gf,
          };
        }
      });
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
      let createServiceList = this.serviceList.filter((row) => { return row.create; });
      let updateServiceList = this.serviceList.filter((row) => { return !row.create; });

      params = {
        cplan: this.code,
        ctipoplan: form.ctipoplan,
        xplan: form.xplan,
        paseguradora: form.paseguradora,        
        parys: form.parys,
        mcosto: form.mcosto,
        bactivo: form.bactivo,
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania,
        cusuariomodificacion: this.currentUser.data.cusuario,
        services: {
          create: createServiceList,
          update: updateServiceList
        }
      };
      url = `${environment.apiUrl}/api/plan/update`;
    }else{
      params = {
        cusuario: this.currentUser.data.cusuario,
        ctipoplan: form.ctipoplan,
        xplan: form.xplan,
        paseguradora: form.paseguradora,        
        parys: form.parys,
        mcosto: form.mcosto,
        brcv: form.brcv,
        bactivo: form.bactivo,
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania,
        cusuariocreacion: this.currentUser.data.cusuario,
        services: this.serviceList
      };
      url = `${environment.apiUrl}/api/plan/create`;
    }

    this.http.post(url, params, options).subscribe((response : any) => {
      if(response.data.status){
        if(this.detail_form.get('brcv').value == true){
          this.onSubmitRcv();
        }
        if(this.code){
          location.reload();
        }else{
          this.router.navigate([`/products/plan-detail/${response.data.cplan}`]);
        }
      }else{
        let condition = response.data.condition;
        if(condition == "plan-name-already-exist"){
          this.alert.message = "PRODUCTS.PLANS.NAMEALREADYEXIST";
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
      else if(code == 404){ message = "HTTP.ERROR.PLANS.PLANNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
    });
  }

  onSubmitRcv(){
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

    params = {
      cusuario: this.currentUser.data.cusuario,
      cservicio_aseg: 1,
      ctiposervicio: 68,
      ctipoagotamientoservicio: 3,
      ncantidad: 0,
      pservicio: 0,
      mmaximocobertura: 0,
      mdeducible: 0,
      bserviciopadre: false,
      bactivo: true,
      rcv: this.rcvAmout
    };
    url = `${environment.apiUrl}/api/plan/create-plan-rcv`;
    
    this.http.post(url, params, options).subscribe((response : any) => {

      this.loading = false;
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.PLANS.PLANNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
    });
  }

}