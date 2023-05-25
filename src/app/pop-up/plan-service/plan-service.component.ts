import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NumberOfServiceComponent } from '@app/pop-up/number-of-service/number-of-service.component';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-plan-service',
  templateUrl: './plan-service.component.html',
  styleUrls: ['./plan-service.component.css']
})
export class PlanServiceComponent implements OnInit {

  @Input() public service;
  private coverageGridApi;
  private serviceTypeGridApi;
  private acceptedServiceTypeGridApi;
  currentUser;
  popup_form: FormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  coverageList: any[] = [];
  serviceList: any[] = [];
  serviceTypeList: any[] = [];
  serviceDepletionTypeList: any[] = [];
  alert = { show : false, type : "", message : "" }
  coverageDeletedRowList: any[] = [];
  acceptedserviceTypeList;
  quantityList: any[] = [];
  List: any[] = [];

  constructor(public activeModal: NgbActiveModal,
              private modalService: NgbModal,
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      ctiposervicio: [''],
      cservicio: [''],
      ctipoagotamientoservicio: [''],
      ncantidad: [''],
      pservicio: [''],
      mmaximocobertura: [''],
      mdeducible: [''],
      bserviciopadre: [false]
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania
      };
      this.http.post(`${environment.apiUrl}/api/valrep/service-type`, params, options).subscribe((response : any) => {
        if(response.data.status){
          this.serviceTypeList = [];
          for(let i = 0; i < response.data.list.length; i++){
            this.serviceTypeList.push({ ctiposervicio: response.data.list[i].ctiposervicio, xtiposervicio: response.data.list[i].xtiposervicio });
          }
          this.serviceTypeList.sort((a,b) => a.xtiposervicio > b.xtiposervicio ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.SERVICETYPENOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
          // Pasar valores a la lista
        let arrayPerform = this.serviceTypeList;
        arrayPerform = arrayPerform.filter((obj) => !obj.ctiposervicio);
        for(let i = 0; i < arrayPerform.length; i ++){
          arrayPerform[i].cgrid = i; 
        }
        
        arrayPerform = this.serviceTypeList;
        this.acceptedserviceTypeList = arrayPerform;

      if(this.service){
        if(this.service.type == 3){
          this.canSave = false;
        }else if(this.service.type == 2){
          this.popup_form.get('ctiposervicio').setValue(this.service.ctiposervicio);
          this.popup_form.get('ctiposervicio').disable();
          // this.serviceDropdownDataRequest();
          this.popup_form.get('cservicio').setValue(this.service.cservicio);
          this.popup_form.get('cservicio').disable();
          this.popup_form.get('ctipoagotamientoservicio').setValue(this.service.ctipoagotamientoservicio);
          this.popup_form.get('ctipoagotamientoservicio').disable();
          this.popup_form.get('ncantidad').setValue(this.service.ncantidad);
          this.popup_form.get('ncantidad').disable();
          this.popup_form.get('pservicio').setValue(this.service.pservicio);
          this.popup_form.get('pservicio').disable();
          this.popup_form.get('mmaximocobertura').setValue(this.service.mmaximocobertura);
          this.popup_form.get('mmaximocobertura').disable();
          this.popup_form.get('mdeducible').setValue(this.service.mdeducible);
          this.popup_form.get('mdeducible').disable();
          this.popup_form.get('bserviciopadre').setValue(this.service.bserviciopadre);
          this.popup_form.get('bserviciopadre').disable();
          this.coverageList = this.service.coverages
          this.canSave = false;
        }else if(this.service.type == 1){
          this.popup_form.get('ctiposervicio').setValue(this.service.ctiposervicio);
          // this.serviceDropdownDataRequest();
          this.popup_form.get('cservicio').setValue(this.service.cservicio);
          this.popup_form.get('ctipoagotamientoservicio').setValue(this.service.ctipoagotamientoservicio);
          this.popup_form.get('ncantidad').setValue(this.service.ncantidad);
          this.popup_form.get('pservicio').setValue(this.service.pservicio);
          this.popup_form.get('mmaximocobertura').setValue(this.service.mmaximocobertura);
          this.popup_form.get('mdeducible').setValue(this.service.mdeducible);
          this.popup_form.get('bserviciopadre').setValue(this.service.bserviciopadre);
          for(let i =0; i < this.service.coverages.length; i++){
            this.coverageList.push({
              cgrid: i,
              create: this.service.coverages[i].create,
              ccobertura: this.service.coverages[i].ccobertura,
              xcobertura: this.service.coverages[i].xcobertura,
              cconceptocobertura: this.service.coverages[i].cconceptocobertura,
              xconceptocobertura: this.service.coverages[i].xconceptocobertura
            });
          }
          this.isEdit = true;
        }
      }
    }
  }

  serviceTypeRowClicked(event: any){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      ctiposervicio: event.data.ctiposervicio
    };
    this.http.post(`${environment.apiUrl}/api/plan/search-service`, params, options).subscribe((response : any) => {
      if(response.data.status){
        this.serviceList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.serviceList.push({ cservicio: response.data.list[i].cservicio, xservicio: response.data.list[i].xservicio });
        }
        this.serviceList.sort((a,b) => a.xservicio > b.xservicio ? 1 : -1);
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.SERVICETYPENOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
    let eventObj = event.data;
    this.serviceTypeList = this.serviceTypeList.filter((obj) => obj.ctiposervicio != eventObj.ctiposervicio)
    this.serviceTypeGridApi.setRowData(this.serviceTypeList);
    this.acceptedserviceTypeList.push(eventObj);
    for(let i = 0; i < this.acceptedserviceTypeList.length; i++){
      this.acceptedserviceTypeList[i].cgrid = i;
      this.acceptedserviceTypeList[i].ctiposervicio;
      this.acceptedserviceTypeList[i].xtiposervicio;
    }
    if(this.acceptedserviceTypeList[0]){
      this.canSave = true;
    }
    this.acceptedServiceTypeGridApi.setRowData(this.acceptedserviceTypeList);
    this.quantityList = [];
}

numberServiceRowClicked(event: any){
  let quantity = { cservicio: event.data.cservicio, xservicio: event.data.xservicio };
  const modalRef = this.modalService.open(NumberOfServiceComponent);
  modalRef.componentInstance.quantity = quantity;
  modalRef.result.then((result: any) => { 
    if(result){
      for(let i = 0; i < result.length; i++){
        this.List.push({
          ncantidad: result[i].ncantidad,
          cservicio: result[i].cservicio,
          xservicio: result[i].xservicio,
        })
      } 
      this.quantityList = []
      for(let i = 0; i < this.List.length; i++){
        this.quantityList.push({
          ncantidad: this.List[i].ncantidad,
          cservicio: this.List[i].cservicio,
          xservicio: this.List[i].xservicio,
        })
      } 
    }
  });
}


onServiceTypeGridReady(event){
  this.serviceTypeGridApi = event.api;
}

onAcceptedServiceTypeGridReady(event){
  this.acceptedServiceTypeGridApi = event.api;
}

  // serviceDropdownDataRequest(){
  //   if(this.popup_form.get('ctiposervicio').value){
  //     let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  //     let options = { headers: headers };
  //     let params = {
  //       cpais: this.currentUser.data.cpais,
  //       ccompania: this.currentUser.data.ccompania,
  //       ctiposervicio: this.popup_form.get('ctiposervicio').value
  //     }
  //     this.http.post(`${environment.apiUrl}/api/valrep/service`, params, options).subscribe((response : any) => {
  //       if(response.data.status){
  //         this.serviceList = [];
  //         for(let i = 0; i < response.data.list.length; i++){
  //           this.serviceList.push({ id: response.data.list[i].cservicio, value: response.data.list[i].xservicio });
  //         }
  //         this.serviceList.sort((a,b) => a.value > b.value ? 1 : -1);
  //       }
  //     },
  //     (err) => {
  //       let code = err.error.data.code;
  //       let message;
  //       if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
  //       else if(code == 404){ message = "HTTP.ERROR.VALREP.SERVICENOTFOUND"; }
  //       else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
  //       this.alert.message = message;
  //       this.alert.type = 'danger';
  //       this.alert.show = true;
  //     });
  //   }
  // }

  // addCoverage(){
  //   let coverage = { type: 3 };
  //   const modalRef = this.modalService.open(PlanServiceCoverageComponent);
  //   modalRef.componentInstance.coverage = coverage;
  //   modalRef.result.then((result: any) => {
  //     if(result){
  //       if(result.type == 3){
  //         this.coverageList.push({
  //           cgrid: this.coverageList.length,
  //           create: true,
  //           ccobertura: result.ccobertura,
  //           xcobertura: result.xcobertura,
  //           cconceptocobertura: result.cconceptocobertura,
  //           xconceptocobertura: result.xconceptocobertura
  //         });
  //         this.coverageGridApi.setRowData(this.coverageList);
  //       }
  //     }
  //   });
  // }

  // coverageRowClicked(event: any){
  //   let coverage = {};
  //   if(this.isEdit){ 
  //     coverage = { 
  //       type: 1,
  //       create: event.data.create, 
  //       cgrid: event.data.cgrid,
  //       ccobertura: event.data.ccobertura,
  //       cconceptocobertura: event.data.cconceptocobertura,
  //       delete: false
  //     };
  //   }else{ 
  //     coverage = { 
  //       type: 2,
  //       create: event.data.create,
  //       cgrid: event.data.cgrid,
  //       ccobertura: event.data.ccobertura,
  //       cconceptocobertura: event.data.cconceptocobertura,
  //       delete: false
  //     }; 
  //   }
  //   const modalRef = this.modalService.open(PlanServiceCoverageComponent);
  //   modalRef.componentInstance.coverage = coverage;
  //   modalRef.result.then((result: any) => {
  //     if(result){
  //       if(result.type == 1){
  //         for(let i = 0; i <  this.coverageList.length; i++){
  //           if( this.coverageList[i].cgrid == result.cgrid){
  //             this.coverageList[i].ccobertura = result.ccobertura;
  //             this.coverageList[i].xcobertura = result.xcobertura;
  //             this.coverageList[i].cconceptocobertura = result.cconceptocobertura;
  //             this.coverageList[i].xconceptocobertura = result.xconceptocobertura;
  //             this.coverageGridApi.refreshCells();
  //             return;
  //           }
  //         }
  //       }else if(result.type == 4){
  //         if(result.delete){
  //           this.coverageDeletedRowList.push({ ccobertura: result.ccobertura });
  //         }
  //         this.coverageList = this.coverageList.filter((row) => { return row.cgrid != result.cgrid });
  //         for(let i = 0; i < this.coverageList.length; i++){
  //           this.coverageList[i].cgrid = i;
  //         }
  //         this.coverageGridApi.setRowData(this.coverageList);
  //       }
  //     }
  //   });
  // }

  // onCoveragesGridReady(event){
  //   this.coverageGridApi = event.api;
  // }

  onSubmit(form){
    this.submitted = true;
    this.loading = true;

    let servicios = {};

    servicios = {
      acceptedservice: this.acceptedserviceTypeList,
      quantity: this.quantityList
    }

    this.service = servicios;

    this.activeModal.close(this.service);
  }
}