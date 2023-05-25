import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PlanServiceComponent } from '@app/pop-up/plan-service/plan-service.component';
import { PlanAmountRcvComponent } from '@app/pop-up/plan-amount-rcv/plan-amount-rcv.component';
import { PlanValuationApovComponent } from '@app/pop-up/plan-valuation-apov/plan-valuation-apov.component';
import { PlanValuationExcesoComponent } from '@app/pop-up/plan-valuation-exceso/plan-valuation-exceso.component';
import { Papa } from 'ngx-papaparse';
import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-plan-detail',
  templateUrl: './plan-detail.component.html',
  styleUrls: ['./plan-detail.component.css']
})
export class PlanDetailComponent implements OnInit {

  private paymentMethodologyGridApi;
  private apovGridApi;
  private serviceGridApi;
  private excesoGridApi;
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
  coinList: any[] = [];
  metodologiaList:any[] = [];
  countryList: any[] = [];
  serviceTypeList: any[] = [];
  acceptedServiceList: any[] = [];
  quantityServiceList: any[] = [];
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
  boculta_rcv: boolean = false;
  bactiva_apov: boolean = false;
  apovList: any[] = [];
  activaCorporativo: boolean = false;
  ActivaPlan: boolean = true;
  bactiva_exceso: boolean = false;
  excesoList: any[] = [];
  ratesList: any[] = [];
  parsedData: any[] = [];
  activaTasasArys: boolean = false;
  canReadFile: boolean = false;

  constructor(private formBuilder: UntypedFormBuilder, 
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private modalService : NgbModal) { }

  ngOnInit(): void {
    this.detail_form = this.formBuilder.group({
      ctipoplan: [''],
      xplan: [''],
      mcosto: [''],
      cmetodologia:[''],
      cpais:[''],
      caseguradora:[''],
      fdesde:[''],
      fhasta:[''],
      bactivo: [true],
      brcv: [false],
      cmoneda:[''],
      ptasa_casco:[''],
      ptasa_catastrofico:[''],
      msuma_recuperacion:[''],
      mprima_recuperacion:[''],
      mdeducible:[''],
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

    //busca moneda

    this.http.post(`${environment.apiUrl}/api/valrep/coin`, params, options).subscribe((response : any) => {
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.coinList.push({ id: response.data.list[i].cmoneda, value: response.data.list[i].xmoneda });
        }
        this.coinList.sort((a,b) => a.value > b.value ? 1 : -1);
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
        this.activaTasasArys = true;
        this.canReadFile = true;
        if(!this.canCreate){
          this.router.navigate([`/permission-error`]);
          return;
        }
        this.editStatus = true;
        this.showSaveButton = true;
      }
    });

    this.http.post(`${environment.apiUrl}/api/valrep/country`, params).subscribe((response : any) => {
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
       
    this.http.post(`${environment.apiUrl}/api/valrep/metodologia-pago`, params).subscribe((response: any) => {
      if(response.data.status){
        this.metodologiaList = [];
        
        for(let i = 0; i < response.data.list.length; i++){
          this.metodologiaList.push( { 
            id: response.data.list[i].cmetodologiapago,
            value: response.data.list[i].xmetodologiapago,
          });
        }

        this.metodologiaList.sort((a, b) => a.value > b.value ? 1 : -1)
      }
    },);

      this.http.post(`${environment.apiUrl}/api/valrep/insurer`, params).subscribe((response: any) => {
        if(response.data.status){
          this.insurerList = [];
          
          for(let i = 0; i < response.data.list.length; i++){
            this.insurerList.push( { 
              id: response.data.list[i].caseguradora,
              value: response.data.list[i].xaseguradora,
            });
          }
  
          this.insurerList.sort((a, b) => a.value > b.value ? 1 : -1)
        }
    },);
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
        if(this.detail_form.get('ctipoplan').value == 1){
          this.bactiva_apov = true;
          this.activaCorporativo = true;
          this.ActivaPlan = false;
          this.bactiva_exceso = true;
        }else{
          this.activaCorporativo = false;
          this.ActivaPlan = true;
        }
        this.detail_form.get('xplan').setValue(response.data.xplan);
        this.detail_form.get('xplan').disable();
        this.detail_form.get('mcosto').setValue(response.data.mcosto);
        this.detail_form.get('mcosto').disable();
        this.detail_form.get('parys').setValue(response.data.parys);
        this.detail_form.get('parys').disable();
        this.detail_form.get('paseguradora').setValue(response.data.paseguradora);
        this.detail_form.get('paseguradora').disable();
        this.detail_form.get('ptasa_casco').setValue(response.data.ptasa_casco);
        this.detail_form.get('ptasa_casco').disable();
        this.detail_form.get('ptasa_catastrofico').setValue(response.data.ptasa_catastrofico);
        this.detail_form.get('ptasa_catastrofico').disable();
        this.detail_form.get('msuma_recuperacion').setValue(response.data.msuma_recuperacion);
        this.detail_form.get('msuma_recuperacion').disable();
        this.detail_form.get('mprima_recuperacion').setValue(response.data.mprima_recuperacion);
        this.detail_form.get('mprima_recuperacion').disable();
        this.detail_form.get('mdeducible').setValue(response.data.mdeducible);
        this.detail_form.get('mdeducible').disable();
        this.detail_form.get('brcv').setValue(response.data.brcv);
        this.detail_form.get('brcv').disable();
        this.detail_form.get('bactivo').setValue(response.data.bactivo);
        this.detail_form.get('bactivo').disable();
        this.detail_form.get('cmoneda').setValue(response.data.cmoneda);
        this.detail_form.get('cmoneda').disable();
        if(this.code, this.detail_form.get('cmoneda').value){
          this.getStoreProcedure()
        }
        this.serviceTypeList = [];
        if(response.data.services){
          for(let i =0; i < response.data.services.length; i++){
            this.serviceTypeList.push({
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
        this.ratesList = [];
        if(response.data.ratesArys){
          this.activaTasasArys = true;
          for(let i =0; i < response.data.ratesArys.length; i++){
            this.ratesList.push({
              cano: response.data.ratesArys[i].cano,
              particular1: response.data.ratesArys[i].particular1,
              particular2: response.data.ratesArys[i].particular2,
              rustico1: response.data.ratesArys[i].rustico1,
              rustico2: response.data.ratesArys[i].rustico2,
              pickup1: response.data.ratesArys[i].pickup1,
              pickup2: response.data.ratesArys[i].pickup2,
              carga2_1: response.data.ratesArys[i].carga2_1,
              carga2_2: response.data.ratesArys[i].carga2_2,
              carga5_1: response.data.ratesArys[i].carga5_1,
              carga5_2: response.data.ratesArys[i].carga5_2,
              carga8_1: response.data.ratesArys[i].carga8_1,
              carga8_2: response.data.ratesArys[i].carga8_2,
              carga12_1: response.data.ratesArys[i].carga12_1,
              carga12_2: response.data.ratesArys[i].carga12_2,
              moto1: response.data.ratesArys[i].moto1,
              moto2: response.data.ratesArys[i].moto2,
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
  
  getStoreProcedure(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cplan: this.code,
      cmoneda: this.detail_form.get('cmoneda').value
    };
    this.http.post(`${environment.apiUrl}/api/plan/store-procedure`, params, options).subscribe((response: any) => {
      if(response.data.apov){
        this.apovList = [];
        for(let i = 0; i < response.data.apov.length; i++){
          this.apovList.push({
            cplan: response.data.apov[i].cplan,
            ccobertura: response.data.apov[i].ccobertura,
            xcobertura: response.data.apov[i].xcobertura,
            msuma_aseg: response.data.apov[i].msuma_aseg,
            ptasa_par_rus: response.data.apov[i].ptasa_par_rus,
            mprima_par_rus: response.data.apov[i].mprima_par_rus,
            ptasa_carga: response.data.apov[i].ptasa_carga,
            mprima_carga: response.data.apov[i].mprima_carga,
          })
        }
      }

      if(response.data.exceso){
        this.excesoList = [];
        for(let i = 0; i < response.data.exceso.length; i++){
          this.excesoList.push({
            cplan: response.data.exceso[i].cplan,
            ctarifa: response.data.exceso[i].ctarifa,
            xtipo: response.data.exceso[i].xtipo,
            cmoneda: response.data.exceso[i].cmoneda,
            ms_defensa_penal: response.data.exceso[i].ms_defensa_penal,
            mp_defensa_penal: response.data.exceso[i].mp_defensa_penal,
            ms_exceso_limite: response.data.exceso[i].ms_exceso_limite,
            mp_exceso_limite: response.data.exceso[i].mp_exceso_limite,
          })
        }
      }
    });
  }

  apovRowClicked(event: any){
    let apov = {};
    if(this.editStatus){
      apov = { 
        type: 1,
        create: event.data.create,
        cgrid: event.data.cgrid,
        cplan: this.code,
        ccobertura: event.data.ccobertura,
        ptasa_par_rus: event.data.ptasa_par_rus,
        ptasa_carga: event.data.ptasa_carga,
        delete: false
      }; 
    }else{
      apov = { 
        type: 2,
        create: event.data.create,
        cgrid: event.data.cgrid,
        cplan: this.code,
        ccobertura: event.data.ccobertura,
        msuma_aseg: event.data.msuma_aseg,
        ptasa_par_rus: event.data.ptasa_par_rus,
        mprima_par_rus: event.data.mprima_par_rus,
        ptasa_carga: event.data.ptasa_carga,
        mprima_carga: event.data.mprima_carga,
        delete: false
      }; 
    }
    const modalRef = this.modalService.open(PlanValuationApovComponent, {size: 'xl'});
    modalRef.componentInstance.apov = apov;
    modalRef.result.then((result: any) => {
      if(result){
        for(let i = 0; i < result.length; i++){
          for(let j = 0; j < this.apovList.length; j++){
            if(this.apovList[j].ccobertura == result[i].ccobertura){
              this.apovList[j].cplan = result[i].cplan;
              this.apovList[j].ccobertura = result[i].ccobertura;
              this.apovList[j].msuma_aseg = result[i].msuma_aseg.toFixed(2);
              this.apovList[j].ptasa_par_rus = result[i].ptasa_par_rus;
              this.apovList[j].mprima_par_rus = result[i].mprima_par_rus.toFixed(2);
              this.apovList[j].ptasa_carga = result[i].ptasa_carga;
              this.apovList[j].mprima_carga = result[i].mprima_carga.toFixed(2);
              this.apovGridApi.refreshCells();
              return;
            }
          }
        }
      }
    });
  }

  excesoRowClicked(event: any){
    let exceso = {};
    if(this.editStatus){
      exceso = { 
        type: 1,
        create: event.data.create,
        cgrid: event.data.cgrid,
        cplan: this.code,
        ctarifa: event.data.ctarifa,
        delete: false
      }; 
    }else{
      exceso = { 
        type: 2,
        create: event.data.create,
        cgrid: event.data.cgrid,
        cplan: this.code,
        ctarifa: event.data.ctarifa,
        delete: false
      }; 
    }
    const modalRef = this.modalService.open(PlanValuationExcesoComponent, {size: 'xl'});
    modalRef.componentInstance.exceso = exceso;
    modalRef.result.then((result: any) => {
      if(result){
        for(let i = 0; i < result.length; i++){
          for(let j = 0; j < this.excesoList.length; j++){
            if(this.excesoList[j].ctarifa == result[i].ctarifa){
              this.excesoList[j].cplan = result[i].cplan;
              this.excesoList[j].ctarifa = result[i].ctarifa;
              this.excesoList[j].ms_defensa_penal = result[i].ms_defensa_penal;
              this.excesoList[j].mp_defensa_penal = result[i].mp_defensa_penal;
              this.excesoList[j].ms_exceso_limite = result[i].ms_exceso_limite;
              this.excesoList[j].mp_exceso_limite = result[i].mp_exceso_limite;
              this.excesoGridApi.refreshCells();
              return;
            }
          }
        }
      }
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
    this.activaTasasArys = true;
    this.canReadFile = true;
  }

  changeApov(){
    if(this.detail_form.get('ctipoplan').value != 1){
      this.boculta_rcv = true;
      this.bactiva_apov = false;
      this.activaCorporativo = false;
      this.ActivaPlan = true;
      this.bactiva_exceso = false;
    }else{
      this.boculta_rcv = false;
      this.bactiva_apov = true;
      this.bactiva_exceso = true;
      this.activaCorporativo = true;
      this.ActivaPlan = false;
    }
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
        this.serviceTypeList = []; 

        for(let i = 0; i < result.acceptedservice.length; i++){
          this.serviceTypeList.push({
            cgrid: this.serviceTypeList.length,
            create: true,
            ctiposervicio: result.acceptedservice[i].ctiposervicio,
            xtiposervicio: result.acceptedservice[i].xtiposervicio,
          });
        }

        for(let i = 0; i < result.quantity.length; i++){
          this.quantityServiceList.push({
            cgrid: this.quantityServiceList.length,
            create: true,
            ncantidad: result.quantity[i].ncantidad,
            cservicio: result.quantity[i].cservicio,
            xservicio: result.quantity[i].xservicio ,
          });
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
          for(let i = 0; i < this.serviceTypeList.length; i++){
            if(this.serviceTypeList[i].cgrid == result.cgrid){
              this.serviceTypeList[i].ctiposervicio = result.ctiposervicio;
              this.serviceTypeList[i].xtiposervicio = result.xtiposervicio;
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

  onApovGridReady(event){
    this.apovGridApi = event.api;
  }

  onExcesoGridReady(event){
    this.excesoGridApi = event.api;
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

  async onFileSelect(event){
    let fixedData: any[] = [];
    let file = event.target.files[0];
    this.ratesList = [];
    this.parsedData = [];
    let parsedCSV = await this.parseCSV(file);
    if (parsedCSV.length > 0) {
      this.parsedData = parsedCSV;
      for (let i = 0; i < (this.parsedData.length); i++){
        fixedData.push({
          cano: this.parsedData[i].CANO,
          particular1: this.parsedData[i].PARTICULAR1,
          particular2: this.parsedData[i].PARTICULAR2,
          rustico1: this.parsedData[i].RUSTICO1,
          rustico2: this.parsedData[i].RUSTICO2,
          pickup1: this.parsedData[i].PICKUP1,
          pickup2: this.parsedData[i].PICKUP2,
          carga2_1: this.parsedData[i].CARGA2_1,
          carga2_2: this.parsedData[i].CARGA2_2,
          carga5_1: this.parsedData[i].CARGA5_1,
          carga5_2: this.parsedData[i].CARGA5_2,
          carga8_1: this.parsedData[i].CARGA8_1,
          carga8_2: this.parsedData[i].CARGA8_2,
          carga12_1: this.parsedData[i].CARGA12_1,
          carga12_2: this.parsedData[i].CARGA12_2,
          moto1: this.parsedData[i].MOTO1,
          moto2: this.parsedData[i].MOTO2
        })
      }
      this.ratesList = fixedData;
    }
    else {
      event.target.value = null;
      
    }
  }

  parseCSV(file) {

    const requiredHeaders: any[] = [
      "CANO", "PARTICULAR1", "PARTICULAR2", "RUSTICO1", "RUSTICO2", "PICKUP1", "PICKUP2", "CARGA2_1", "CARGA2_2", "CARGA5_1",
      "CARGA5_2", "CARGA8_1", "CARGA8_2", "CARGA12_1", "CARGA12_2", "MOTO1", "MOTO2" 
    ]

    return new Promise <any[]>((resolve, reject) => {
      let papa = new Papa();
      papa.parse(file, {
        delimiter: ";",
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
          let error = "";
          let csvHeaders = Object.keys(results.data[0]);
          let lastRow = results.data[results.data.length - 1];
          let isEmpty = true;
          for (let key in lastRow) {
            if (lastRow[key]) {
              isEmpty = false;
              break;
            }
          }
          if (isEmpty) {
            results.data.pop();
          }
          if (JSON.stringify(csvHeaders) !== JSON.stringify(requiredHeaders)) {
            let missingAttributes = []
            missingAttributes  = requiredHeaders.filter(requiredHeader => !csvHeaders.some(csvHeader => csvHeader === requiredHeader));
            if (missingAttributes.length > 0) {
              error = `Error: El archivo suministrado no incluye todos los atributos necesarios. Se necesita incluir la/s columna/s: ${missingAttributes}`;
            }
            else {
              let additionalAttributes = [];
              additionalAttributes = csvHeaders.filter(csvHeader => !requiredHeaders.some(requiredHeader => requiredHeader === csvHeader));
              error = `Error: El archivo suministrado incluye atributos adicionales, elimine la/s siguiente/s columna/s: ${additionalAttributes}`;
            }
          }
          if (error) {
            results.data = [];
            alert(error);
          }
          resolve(results.data);
        }
      });
    });
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
      let createServiceList = this.serviceTypeList.filter((row) => { return row.create; });
      let updateServiceList = this.serviceTypeList.filter((row) => { return !row.create; });

      params = {
        cplan: this.code,
        ctipoplan: form.ctipoplan,
        xplan: form.xplan,
        mcosto: form.mcosto,
        bactivo: form.bactivo,
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania,
        cusuariomodificacion: this.currentUser.data.cusuario,
        ptasa_casco: this.detail_form.get('ptasa_casco').value,
        ptasa_catastrofico: this.detail_form.get('ptasa_catastrofico').value,
        msuma_recuperacion: this.detail_form.get('msuma_recuperacion').value,
        mprima_recuperacion: this.detail_form.get('mprima_recuperacion').value,
        mdeducible: this.detail_form.get('mdeducible').value,
        apov: this.apovList,
        exceso: this.excesoList,
        rates: this.ratesList,
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
        cmoneda: this.detail_form.get('cmoneda').value,
        brcv: form.brcv,
        bactivo: form.bactivo,
        ptasa_casco: this.detail_form.get('ptasa_casco').value,
        ptasa_catastrofico: this.detail_form.get('ptasa_catastrofico').value,
        msuma_recuperacion: this.detail_form.get('msuma_recuperacion').value,
        mprima_recuperacion: this.detail_form.get('mprima_recuperacion').value,
        mdeducible: this.detail_form.get('mdeducible').value,
        cpais: this.detail_form.get('cpais').value,
        cmetodologia: this.detail_form.get('cmetodologia').value,
        fdesde: this.detail_form.get('fdesde').value,
        fhasta: this.detail_form.get('fhasta').value,
        caseguradora: this.detail_form.get('caseguradora').value,
        ccompania: this.currentUser.data.ccompania,
        cusuariocreacion: this.currentUser.data.cusuario,
        servicesType: this.serviceTypeList,
        quantity: this.quantityServiceList,
        rates: this.ratesList
      };
      url = `${environment.apiUrl}/api/plan/create`;
    }

    this.http.post(url, params, options).subscribe((response : any) => {
      if(response.data.status){
        if(this.detail_form.get('brcv').value == true){
          this.onSubmitRcv();
        }
        if(this.code){
          let message = 'Se ha modificado exitosamente';
          this.alert.message = message;
          this.alert.type = 'success';
          this.alert.show = true;
      
          setTimeout(() => {
            this.alert.show = false;
          }, 3000);
    
          location.reload();
          this.loading = false;
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