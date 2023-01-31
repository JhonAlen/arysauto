import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PlanPaymentMethodologyComponent } from '@app/pop-up/plan-payment-methodology/plan-payment-methodology.component';
import { PlanInsurerComponent } from '@app/pop-up/plan-insurer/plan-insurer.component';
import { PlanServiceComponent } from '@app/pop-up/plan-service/plan-service.component';

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
      bactivo: [true, Validators.required]
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
    this.http.post(`${environment.apiUrl}/api/v2/plan/production/detail`, params, options).subscribe((response: any) => {
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
        this.detail_form.get('bactivo').setValue(response.data.bactivo);
        this.detail_form.get('bactivo').disable();
        this.paymentMethodologyList = [];
        if(response.data.paymentMethodologies){
          for(let i =0; i < response.data.paymentMethodologies.length; i++){
            this.paymentMethodologyList.push({
              cgrid: i,
              create: false,
              cmetodologiapago: response.data.paymentMethodologies[i].cmetodologiapago,
              xmetodologiapago: response.data.paymentMethodologies[i].xmetodologiapago,
              mmetodologiapago: response.data.paymentMethodologies[i].mmetodologiapago
            });
          }
        }
        this.insurerList = [];
        if(response.data.insurers){
          for(let i =0; i < response.data.insurers.length; i++){
            this.insurerList.push({
              cgrid: i,
              create: false,
              caseguradora: response.data.insurers[i].caseguradora,
              xaseguradora: response.data.insurers[i].xaseguradora
            });
          }
        }
        this.serviceList = [];
        if(response.data.services){
          for(let i =0; i < response.data.services.length; i++){
            let coverages = [];
            for(let j =0; j < response.data.services[i].coverages.length; j++){
              coverages.push({
                create: false,
                ccobertura: response.data.services[i].coverages[j].ccobertura,
                xcobertura: response.data.services[i].coverages[j].xcobertura,
                cconceptocobertura: response.data.services[i].coverages[j].cconceptocobertura,
                xconceptocobertura: response.data.services[i].coverages[j].xconceptocobertura
              });
            }
            this.serviceList.push({
              cgrid: i,
              create: false,
              cservicio: response.data.services[i].cservicio,
              xservicio: response.data.services[i].xservicio,
              cservicioplan: response.data.services[i].cservicioplan,
              ctiposervicio: response.data.services[i].ctiposervicio,
              xtiposervicio: response.data.services[i].xtiposervicio,
              ctipoagotamientoservicio: response.data.services[i].ctipoagotamientoservicio,
              ncantidad: response.data.services[i].ncantidad,
              pservicio: response.data.services[i].pservicio,
              mmaximocobertura: response.data.services[i].mmaximocobertura,
              mdeducible: response.data.services[i].mdeducible,
              bserviciopadre: response.data.services[i].bserviciopadre,
              coverages: coverages
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

  addPaymentMethodology(){
    let paymentMethodology = { type: 3 };
    const modalRef = this.modalService.open(PlanPaymentMethodologyComponent);
    modalRef.componentInstance.paymentMethodology = paymentMethodology;
    modalRef.result.then((result: any) => { 
      if(result){
        if(result.type == 3){
          this.paymentMethodologyList.push({
            cgrid: this.insurerList.length,
            create: true,
            cmetodologiapago: result.cmetodologiapago,
            xmetodologiapago: result.xmetodologiapago,
            mmetodologiapago: result.mmetodologiapago
          });
          this.paymentMethodologyGridApi.setRowData(this.paymentMethodologyList);
        }
      }
    });
  }

  addInsurer(){
    let insurer = { type: 3 };
    const modalRef = this.modalService.open(PlanInsurerComponent);
    modalRef.componentInstance.insurer = insurer;
    modalRef.result.then((result: any) => { 
      if(result){
        if(result.type == 3){
          this.insurerList.push({
            cgrid: this.insurerList.length,
            create: true,
            caseguradora: result.caseguradora,
            xaseguradora: result.xaseguradora
          });
          this.insurerGridApi.setRowData(this.insurerList);
        }
      }
    });
  }

  addService(){
    let service = { type: 3 };
    const modalRef = this.modalService.open(PlanServiceComponent, {size: 'xl'});
    modalRef.componentInstance.service = service;
    modalRef.result.then((result: any) => { 
      if(result){
        if(result.type == 3){
          this.serviceList.push({
            cgrid: this.serviceList.length,
            create: true,
            cservicio: result.cservicio,
            xservicio: result.xservicio,
            ctiposervicio: result.ctiposervicio,
            xtiposervicio: result.xtiposervicio,
            ctipoagotamientoservicio: result.ctipoagotamientoservicio,
            ncantidad: result.ncantidad,
            pservicio: result.pservicio,
            mmaximocobertura: result.mmaximocobertura,
            mdeducible: result.mdeducible,
            bserviciopadre: result.bserviciopadre,
            coverages: result.coverages
          });
          this.serviceGridApi.setRowData(this.serviceList);
        }
      }
    });
  }

  paymentMethodologyRowClicked(event: any){
    let paymentMethodology = {};
    if(this.editStatus){ 
      paymentMethodology = { 
        type: 1,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        cmetodologiapago: event.data.cmetodologiapago,
        mmetodologiapago: event.data.mmetodologiapago,
        delete: false
      };
    }else{ 
      paymentMethodology = { 
        type: 2,
        create: event.data.create,
        cgrid: event.data.cgrid,
        cmetodologiapago: event.data.cmetodologiapago,
        mmetodologiapago: event.data.mmetodologiapago,
        delete: false
      }; 
    }
    const modalRef = this.modalService.open(PlanPaymentMethodologyComponent);
    modalRef.componentInstance.paymentMethodology = paymentMethodology;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 1){
          for(let i = 0; i < this.paymentMethodologyList.length; i++){
            if(this.paymentMethodologyList[i].cgrid == result.cgrid){
              this.paymentMethodologyList[i].mmetodologiapago = result.mmetodologiapago;
              this.paymentMethodologyGridApi.refreshCells();
              return;
            }
          }
        }else if(result.type == 4){
          if(result.delete){
            this.paymentMethodologyDeletedRowList.push({ cmetodologiapago: result.cmetodologiapago });
          }
          this.paymentMethodologyList = this.paymentMethodologyList.filter((row) => { return row.cgrid != result.cgrid });
          for(let i = 0; i < this.paymentMethodologyList.length; i++){
            this.paymentMethodologyList[i].cgrid = i;
          }
          this.paymentMethodologyGridApi.setRowData(this.paymentMethodologyList);
        }
      }
    });
  }

  insurerRowClicked(event: any){
    let insurer = {};
    if(this.editStatus){ 
      insurer = { 
        type: 1,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        caseguradora: event.data.caseguradora,
        delete: false
      };
    }else{ 
      insurer = { 
        type: 2,
        create: event.data.create,
        cgrid: event.data.cgrid,
        caseguradora: event.data.caseguradora,
        delete: false
      }; 
    }
    const modalRef = this.modalService.open(PlanInsurerComponent);
    modalRef.componentInstance.insurer = insurer;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 1){
          for(let i = 0; i < this.insurerList.length; i++){
            if(this.insurerList[i].cgrid == result.cgrid){
              this.insurerList[i].caseguradora = result.caseguradora;
              this.insurerList[i].xaseguradora = result.xaseguradora;
              this.insurerGridApi.refreshCells();
              return;
            }
          }
        }else if(result.type == 4){
          if(result.delete){
            this.insurerDeletedRowList.push({ caseguradora: result.caseguradora });
          }
          this.insurerList = this.insurerList.filter((row) => { return row.cgrid != result.cgrid });
          for(let i = 0; i < this.insurerList.length; i++){
            this.insurerList[i].cgrid = i;
          }
          this.insurerGridApi.setRowData(this.insurerList);
        }
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
        cservicioplan: event.data.cservicioplan,
        cservicio: event.data.cservicio,
        ctiposervicio: event.data.ctiposervicio,
        ctipoagotamientoservicio: event.data.ctipoagotamientoservicio,
        ncantidad: event.data.ncantidad,
        pservicio: event.data.pservicio,
        mmaximocobertura: event.data.mmaximocobertura,
        mdeducible: event.data.mdeducible,
        bserviciopadre: event.data.bserviciopadre,
        coverages: event.data.coverages,
        delete: false
      };
    }else{ 
      service = { 
        type: 2,
        create: event.data.create,
        cgrid: event.data.cgrid,
        cservicioplan: event.data.cservicioplan,
        cservicio: event.data.cservicio,
        ctiposervicio: event.data.ctiposervicio,
        ctipoagotamientoservicio: event.data.ctipoagotamientoservicio,
        ncantidad: event.data.ncantidad,
        pservicio: event.data.pservicio,
        mmaximocobertura: event.data.mmaximocobertura,
        mdeducible: event.data.mdeducible,
        bserviciopadre: event.data.bserviciopadre,
        coverages: event.data.coverages,
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
              this.serviceList[i].cservicio = result.cservicio;
              this.serviceList[i].xservicio = result.xservicio;
              this.serviceList[i].ctiposervicio = result.ctiposervicio;
              this.serviceList[i].xtiposervicio = result.xtiposervicio;
              this.serviceList[i].ctipoagotamientoservicio = result.ctipoagotamientoservicio;
              this.serviceList[i].ncantidad = result.ncantidad;
              this.serviceList[i].pservicio = result.pservicio;
              this.serviceList[i].mmaximocobertura = result.mmaximocobertura;
              this.serviceList[i].mdeducible = result.mdeducible;
              this.serviceList[i].bserviciopadre = result.bserviciopadre;
              this.serviceList[i].coverages = result.coverages;
              this.serviceList[i].coveragesResult = result.coveragesResult;
              this.serviceGridApi.refreshCells();
              return;
            }
          }
        }else if(result.type == 4){
          if(result.delete){
            this.serviceDeletedRowList.push({ cservicioplan: result.cservicioplan, cservicio: result.cservicio });
          }
          this.serviceList = this.serviceList.filter((row) => { return row.cgrid != result.cgrid });
          for(let i = 0; i < this.serviceList.length; i++){
            this.serviceList[i].cgrid = i;
          }
          this.serviceGridApi.setRowData(this.serviceList);
        }
      }
    });
  }

  onPaymentMethodologiesGridReady(event){
    this.paymentMethodologyGridApi = event.api;
  }

  onInsurersGridReady(event){
    this.insurerGridApi = event.api;
  }

  onServicesGridReady(event){
    this.serviceGridApi = event.api;
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
      let updatePaymentMethodologiesList = this.paymentMethodologyList.filter((row) => { return !row.create; });
      for(let i = 0; i < updatePaymentMethodologiesList.length; i++){
        delete updatePaymentMethodologiesList[i].cgrid;
        delete updatePaymentMethodologiesList[i].create;
        delete updatePaymentMethodologiesList[i].xmetodologiapago;
      }
      let createPaymentMethodologiesList = this.paymentMethodologyList.filter((row) => { return row.create; });
      for(let i = 0; i < createPaymentMethodologiesList.length; i++){
        delete createPaymentMethodologiesList[i].cgrid;
        delete createPaymentMethodologiesList[i].create;
        delete createPaymentMethodologiesList[i].xmetodologiapago;
      }
      let updateInsurerList = this.insurerList.filter((row) => { return !row.create; });
      for(let i = 0; i < updateInsurerList.length; i++){
        delete updateInsurerList[i].cgrid;
        delete updateInsurerList[i].create;
        delete updateInsurerList[i].xaseguradora;
      }
      let createInsurerList = this.insurerList.filter((row) => { return row.create; });
      for(let i = 0; i < createInsurerList.length; i++){
        delete createInsurerList[i].cgrid;
        delete createInsurerList[i].create;
        delete createInsurerList[i].xaseguradora;
      }
      let updateServiceList = this.serviceList.filter((row) => { return !row.create; });
      for(let i = 0; i < updateServiceList.length; i++){
        delete updateServiceList[i].cgrid;
        delete updateServiceList[i].create;
        delete updateServiceList[i].xservicio;
        delete updateServiceList[i].xtiposervicio;
        updateServiceList[i].coverages = updateServiceList[i].coveragesResult;
        delete updateServiceList[i].coveragesResult;
        if(updateServiceList[i].coverages && updateServiceList[i].coverages.create){
          for(let j = 0; j < updateServiceList[i].coverages.create.length; j++){
            delete updateServiceList[i].coverages.create[j].cgrid;
            delete updateServiceList[i].coverages.create[j].create;
            delete updateServiceList[i].coverages.create[j].xcobertura;
            delete updateServiceList[i].coverages.create[j].xconceptocobertura;
          }
        }
        if(updateServiceList[i].coverages && updateServiceList[i].coverages.update){
          for(let j = 0; j < updateServiceList[i].coverages.update.length; j++){
            delete updateServiceList[i].coverages.update[j].cgrid;
            delete updateServiceList[i].coverages.update[j].create;
            delete updateServiceList[i].coverages.update[j].xcobertura;
            delete updateServiceList[i].coverages.update[j].xconceptocobertura;
          }
        }
      }
      let createServiceList = this.serviceList.filter((row) => { return row.create; });
      for(let i = 0; i < createServiceList.length; i++){
        delete createServiceList[i].cgrid;
        delete createServiceList[i].create;
        delete createServiceList[i].xservicio;
        delete createServiceList[i].xtiposervicio;
        if(createServiceList[i].coverages){
          for(let j = 0; j < createServiceList[i].coverages.length; j++){
            delete createServiceList[i].coverages[j].cgrid;
            delete createServiceList[i].coverages[j].create;
            delete createServiceList[i].coverages[j].xcobertura;
            delete createServiceList[i].coverages[j].xconceptocobertura;
          }
        }
      }
      params = {
        permissionData: {
          cusuario: this.currentUser.data.cusuario,
          cmodulo: 81
        },
        cplan: this.code,
        ctipoplan: form.ctipoplan,
        xplan: form.xplan,
        paseguradora: form.paseguradora,        
        parys: form.parys,
        mplan: form.mplan,
        bactivo: form.bactivo,
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania,
        cusuariomodificacion: this.currentUser.data.cusuario,
        paymentMethodologies: {
          create: createPaymentMethodologiesList,
          update: updatePaymentMethodologiesList,
          delete: this.paymentMethodologyDeletedRowList
        },
        insurers: {
          create: createInsurerList,
          update: updateInsurerList,
          delete: this.insurerDeletedRowList
        },
        services: {
          create: createServiceList,
          update: updateServiceList,
          delete: this.serviceDeletedRowList
        }
      };
      url = `${environment.apiUrl}/api/v2/plan/production/update`;
    }else{
      let createPaymentMethodologiesList = this.paymentMethodologyList;
      for(let i = 0; i < createPaymentMethodologiesList.length; i++){
        delete createPaymentMethodologiesList[i].cgrid;
        delete createPaymentMethodologiesList[i].create;
        delete createPaymentMethodologiesList[i].xmetodologiapago;
      }
      let createInsurerList = this.insurerList;
      for(let i = 0; i < createInsurerList.length; i++){
        delete createInsurerList[i].cgrid;
        delete createInsurerList[i].create;
        delete createInsurerList[i].xaseguradora;
      }
      let createServiceList = this.serviceList;
      for(let i = 0; i < createServiceList.length; i++){
        delete createServiceList[i].cgrid;
        delete createServiceList[i].create;
        delete createServiceList[i].xservicio;
        delete createServiceList[i].xtiposervicio;
        if(createServiceList[i].coverages){
          for(let j = 0; j < createServiceList[i].coverages.length; j++){
            delete createServiceList[i].coverages[j].cgrid;
            delete createServiceList[i].coverages[j].create;
            delete createServiceList[i].coverages[j].xcobertura;
            delete createServiceList[i].coverages[j].xconceptocobertura;
          }
        }
      }
      params = {
        permissionData: {
          cusuario: this.currentUser.data.cusuario,
          cmodulo: 81
        },
        ctipoplan: form.ctipoplan,
        xplan: form.xplan,
        bactivo: form.bactivo,
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania,
        cusuariocreacion: this.currentUser.data.cusuario,
        paymentMethodologies: createPaymentMethodologiesList,
        insurers: createInsurerList,
        services: createServiceList
      };
      url = `${environment.apiUrl}/api/v2/plan/production/create`;
    }
    this.http.post(url, params, options).subscribe((response : any) => {
      if(response.data.status){
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

}