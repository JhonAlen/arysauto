import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WebServiceConnectionService } from '@services/web-service-connection.service';
import { BatchComponent } from '@app/pop-up/batch/batch.component';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-parent-policy-detail',
  templateUrl: './parent-policy-detail.component.html',
  styleUrls: ['./parent-policy-detail.component.css']
})
export class ParentPolicyDetailComponent implements OnInit {

  private batchGridApi;
  sub;
  code;
  currentUser;
  detail_form: UntypedFormGroup;
  loading: boolean = false;
  loading_cancel: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  xpoliza: string = '';
  clientList: any[] = [];
  paymentMethodologyList: any[] = [];
  coinList: any[] = [];
  brokerList: any[] = [];
  batchList: any[] = [];
  showSaveButton: boolean = false;
  showEditButton: boolean = false;
  canCreate: boolean = false;
  canDetail: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;
  editStatus: boolean = false;
  isEditing: boolean = false;
  saveStatus: boolean = false;
  createBatch: boolean = false;
  batchDeletedRowList: any[] = [];

  constructor(private formBuilder: UntypedFormBuilder, 
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private modalService : NgbModal,
              private webService: WebServiceConnectionService) { }

  async ngOnInit(): Promise<void> {
    this.detail_form = this.formBuilder.group({
      ccliente: [''],
      ccorredor: ['']
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if (this.currentUser) {
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 109
      }
      let request = await this.webService.securityVerifyModulePermission(params);
      if (request.error) {
        request.condition && request.conditionMessage == 'user-dont-have-permissions' ? this.router.navigate([`/permission-error`]) : false;
        this.alert.message = request.message;
        this.alert.type = 'danger';
        this.alert.show = true;
        return;
      }
      if (request.data.status) {
        if (!request.data.bindice) {
          this.router.navigate([`/permission-error`]);
        } else {
          this.canCreate = request.data.bcrear;
          this.canDetail = request.data.bdetalle;
          this.canEdit = request.data.beditar;
          this.canDelete = request.data.beliminar;
          this.initializeDetailModule();
        }
      }

    }
  }

  async initializeDetailModule() {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania,
      cmodulo: 109
    };
    this.http.post(`${environment.apiUrl}/api/valrep/client`, params, options).subscribe((response : any) => {
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.clientList.push({ id: response.data.list[i].ccliente, value: response.data.list[i].xcliente });
        }
        this.clientList.sort((a,b) => a.value > b.value ? 1 : -1);
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.CLIENTNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
    this.http.post(`${environment.apiUrl}/api/valrep/broker`, params, options).subscribe((response : any) => {
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.brokerList.push({ id: response.data.list[i].ccorredor, value: response.data.list[i].xcorredor });
        }
        this.brokerList.sort((a,b) => a.value > b.value ? 1 : -1);
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.BROKERNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
    this.sub = this.activatedRoute.paramMap.subscribe(params => {
      this.code = params.get('id');
      if(this.code){
        this.isEditing = true;
        if(!this.canDetail){
          this.router.navigate([`/permission-error`]);
          return;
        }
        this.getParentPolicyData();
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

  getParentPolicyData() {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      permissionData: {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 109
      },
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania,
      ccarga: this.code
    };
    this.http.post(`${environment.apiUrl}/api/parent-policy/detail`, params, options).subscribe((response: any) => {
      if(response.data.status){
        this.xpoliza = response.data.xpoliza;
        this.detail_form.get('ccliente').setValue(response.data.ccliente);
        this.detail_form.get('ccliente').disable();
        this.detail_form.get('ccorredor').setValue(response.data.ccorredor);
        this.detail_form.get('ccorredor').disable();
        this.batchList = [];
        if(response.data.batches){
          for(let i = 0; i < response.data.batches.length; i++){
            this.batchList.push({
              cgrid: i,
              create: false,
              clote: response.data.batches[i].clote,
              xobservacion: response.data.batches[i].xobservacion,
              contratos: response.data.batches[i].contratos,
              fcreacion: response.data.batches[i].fcreacion
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
      else if(code == 404){ message = "HTTP.ERROR.PLANS.PLANNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }

  createNewBatch() {
    let batch = this.batchList.filter(batch => !batch.clote);
    this.submitted = true;
    this.loading = true;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      ccarga: this.code,
      cusuario: this.currentUser.data.cusuario,
      xobservacion: batch[0].xobservacion,
      parsedData: batch[0].contratosCSV
    }
    this.http.post(`${environment.apiUrl}/api/fleet-contract-management/charge-contracts`, params, options).subscribe((response : any) => {
      if (response.data.status) {
        this.showSaveButton = false;
        this.saveStatus = false;
        this.showEditButton = true;
        this.createBatch = false;
        this.getParentPolicyData();
        alert(response.data.message);
        this.loading = false;
      }
    },
    (err) => {
      let message = err.error.data.message;
      this.showSaveButton = false;
      this.saveStatus = false;
      this.showEditButton = true;
      this.createBatch = false;
      this.getParentPolicyData();
      alert(message);
      this.loading = false;
    });
  }

  onSubmit(form) {
    if (this.saveStatus && this.createBatch) {
      this.createNewBatch();
    }
    else {
      this.submitted = true;
      this.loading = true;
      if (this.detail_form.invalid) {
        this.loading = false;
        return;
      }
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania,
        polizaMatriz: {
          ccarga: this.code,
          ccliente: form.ccliente,
          ccorredor: form.ccorredor,
          xpoliza: this.xpoliza,
          xdescripcion_l: this.clientList.filter((cli) => { return cli.id == form.ccliente})[0].value,
          lotes: this.batchList
        }
      }
      this.http.post(`${environment.apiUrl}/api/parent-policy/create`, params, options).subscribe((response : any) => {
        if(response.data.status){
          if(this.code){
            location.reload();
          }else{
            this.router.navigate([`/subscription/parent-policy-detail/${response.data.ccarga}`]);
          }
        }
        this.loading = false
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ 
          message = "No se encontraron contratos que cumplan con los parámetros de búsqueda"; 
        }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
        this.loading = false;
      });
  }
  }

  editParentPolicy() {
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
      this.getParentPolicyData();
    }else{
      this.router.navigate([`/subscription/parent-policy-index`]);
    }
  }

  addBatch () {
    let batch = { type: 3 };
    const modalRef = this.modalService.open(BatchComponent, {size: 'xl'});
    modalRef.componentInstance.batch = batch;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 3){
          this.createBatch = true;
          this.saveStatus = true;
          this.editStatus = false;
          this.batchList.push({
            cgrid: this.batchList.length,
            create: true,
            xobservacion: result.xobservacion,
            fcreacion: result.fcreacion,
            contratos: result.contratos,
            contratosCSV: result.contratosCSV
          });
          this.batchGridApi.setRowData(this.batchList);
        }
      }
     });
  }

  batchRowClicked (event: any) {
    let batch = {};
    if(this.editStatus){ 
      batch = { 
        type: 1,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        ccarga: event.data.clote,
        xobservacion: event.data.xobservacion,
        fcreacion: event.data.fcreacion,
        contratos: event.data.contratos,
        delete: false
      };
    }else{ 
      batch = { 
        type: 2,
        create: event.data.create,
        cgrid: event.data.cgrid,
        ccarga: event.data.clote,
        xobservacion: event.data.xobservacion,
        fcreacion: event.data.fcreacion,
        contratos: event.data.contratos,
        delete: false
      }; 
    }
    const modalRef = this.modalService.open(BatchComponent, {size: 'xl'});
    modalRef.componentInstance.batch = batch;
    modalRef.result.then((result: any) => {
      if(result){
        console.log(result);
        /*if(result.type == 1){
          for(let i = 0; i < this.batchList.length; i++){
            if(this.batchList[i].cgrid == result.cgrid){
              this.batchList[i].cservicio = result.cservicio;
              this.batchList[i].xservicio = result.xservicio;
              this.batchList[i].ctiposervicio = result.ctiposervicio;
              this.batchList[i].xtiposervicio = result.xtiposervicio;
              this.batchList[i].ctipoagotamientoservicio = result.ctipoagotamientoservicio;
              this.batchList[i].ncantidad = result.ncantidad;
              this.batchList[i].pservicio = result.pservicio;
              this.batchList[i].mmaximocobertura = result.mmaximocobertura;
              this.batchList[i].mdeducible = result.mdeducible;
              this.batchList[i].bserviciopadre = result.bserviciopadre;
              this.batchList[i].coverages = result.coverages;
              this.batchList[i].coveragesResult = result.coveragesResult;
              this.batchGridApi.refreshCells();
              return;
            }
          }
        }else if(result.type == 4){
          if(result.delete){
            this.batchDeletedRowList.push({ cservicioplan: result.cservicioplan, cservicio: result.cservicio });
          }
          this.batchList = this.batchList.filter((row) => { return row.cgrid != result.cgrid });
          for(let i = 0; i < this.batchList.length; i++){
            this.batchList[i].cgrid = i;
          }
          this.batchGridApi.setRowData(this.batchList);
        }*/
      }
    });
  }

  onBatchesGridReady(event){
    this.batchGridApi = event.api;
  }

  checkIfCanCreateParentPolicy(form) {
    if (form.ccliente && form.ccorredor && !this.code) {
      this.saveStatus = true;
    }
    else {
      this.saveStatus = false;
    }
  }

}
