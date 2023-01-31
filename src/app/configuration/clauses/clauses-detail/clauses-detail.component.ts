import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfigurationClausesComponent } from '@app/pop-up/configuration-clauses/configuration-clauses.component';
import { ConfigurationObjetivesComponent } from '@app/pop-up/configuration-objetives/configuration-objetives.component';


import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';
import { ignoreElements } from 'rxjs/operators';

@Component({
  selector: 'app-clauses-detail',
  templateUrl: './clauses-detail.component.html',
  styleUrls: ['./clauses-detail.component.css']
})
export class ClausesDetailComponent implements OnInit {

  private clausesGridApi;
  private objetivesGridApi;
  showSaveButton: boolean = false;
  showEditButton: boolean = false;
  editStatus: boolean = false;
  editBlock: boolean = false;
  canCreate: boolean = false;
  canDetail: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;
  code;
  sub;
  currentUser;
  detail_form: UntypedFormGroup;
  loading: boolean = false;
  loading_cancel: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  clausesList: any[] = [];
  exhibitList: any[] = [];
  objetivesList: any[] = [];

  constructor(private formBuilder: UntypedFormBuilder, 
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private router: Router,
              private translate: TranslateService,
              private activatedRoute: ActivatedRoute,
              private modalService : NgbModal) { }

  ngOnInit(): void {
    this.detail_form = this.formBuilder.group({
      canexo: [''],
      cclausula: [''],
      xanexo: ['', Validators.required],
      xobservacion: [''],
      xclausulas: [''],
      xobjetivo: [''],
      bactivo: true
    })
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 96
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
      if(this.code){
        if(!this.canDetail){
          this.router.navigate([`/permission-error`]);
          return;
        }
        this.getExhibitData();
        this.getClauses();
        if(this.canEdit){ this.showEditButton = true; }
      }else{
        if(!this.canCreate){
          this.router.navigate([`/permission-error`]);
          return;
        }
        this.showSaveButton = true;
        this.editStatus = true;
      }
    });
  }

  getExhibitData(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      canexo: this.code
    };
    this.http.post(`${environment.apiUrl}/api/clauses/exhibit/detail`, params, options).subscribe((response: any) => {
      if(response.data.status){
        this.detail_form.get('xanexo').setValue(response.data.xanexo);
        this.detail_form.get('xanexo').disable();
        this.detail_form.get('xobservacion').setValue(response.data.xobservacion);
        this.detail_form.get('xobservacion').disable();
        this.detail_form.get('bactivo').setValue(response.data.bactivo);
        this.detail_form.get('bactivo').disable();
      }
      this.exhibitList.push({ id: response.data.canexo, xanexo: response.data.xanexo, xobservacion: response.data.xobservacion, bactivo: response.data.bactivo, create: true});
      this.loading_cancel = false;
    }, 
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.TAXESCONFIGURATION.TAXNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }

  getClauses(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      canexo: this.code
    };
    this.http.post(`${environment.apiUrl}/api/clauses/detail`, params, options).subscribe((response: any) => {
      if(response.data.status){
        if(response.data.clauses){
          this.clausesList = [];
          for(let i = 0; i < response.data.clauses.length; i++){
            this.clausesList.push({
              cgrid: i,
              createClauses: false,
              canexo: response.data.clauses[i].canexo,
              cclausula: response.data.clauses[i].cclausula,
              xclausulas: response.data.clauses[i].xclausulas,
              xobservacion: response.data.clauses[i].xobservacion
            })  
            if(this.clausesList[i].cclausula){
              this.getObjetives();
            }
          }
        } 
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      //else if(code == 404){ message = "HTTP.ERROR.NOTIFICATIONS.NOTIFICATIONNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }

  getObjetives(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cclausula: this.detail_form.get('cclausula').value,
      canexo: this.code
    };
    this.http.post(`${environment.apiUrl}/api/clauses/detail-objetives`, params, options).subscribe((response: any) => {
      if(response.data.status){
        if(response.data.objetives){
          this.objetivesList = [];
          for(let i = 0; i < response.data.objetives.length; i++){
            this.objetivesList.push({
              cgrid: i,
              createObjetives: false,
              cclausula: response.data.objetives[i].cclausula,
              xclausulas: response.data.objetives[i].xclausulas,
              cobjetivo: response.data.objetives[i].cobjetivo,
              xobjetivo: response.data.objetives[i].xobjetivo
            })  
          }
        } 
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.NOTIFICATIONS.NOTIFICATIONNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }

  addClauses(){
    if(this.code){
      let anexo = {canexo: this.code, createClauses: true};
      const modalRef = this.modalService.open(ConfigurationClausesComponent, {size: 'xl'});
      modalRef.componentInstance.anexo = anexo;
      modalRef.result.then((result: any) => { 

        this.clausesList.push({
        cgrid: this.clausesList.length,
        createClauses: true,
        edit: false,
        canexo: result.canexo,
        xanexo: result.xanexo,
        cclausula: result.cclausula,
        xclausulas: result.xclausulas,
        xobservacion: result.xobservacion,
        bactivo: result.bactivo
       });
       this.clausesGridApi.setRowData(this.clausesList);
      });
    }
  }

  addObjetivesFromClauses(){
    if(this.code){
      let clausula = {cclausula: this.clausesList, canexo: this.code ,createObjetives: true};
      const modalRef = this.modalService.open(ConfigurationObjetivesComponent, {size: 'xl'});
      modalRef.componentInstance.clausula = clausula;
      modalRef.result.then((result: any) => { 

        this.objetivesList.push({
        cgrid: this.objetivesList.length,
        createObjetives: true,
        edit: false,
        cclausula: result.cclausula,
        xclausulas: result.xclausulas,
        xobjetivo: result.xobjetivo,
        bactivo: result.bactivo
       });
       this.objetivesGridApi.setRowData(this.objetivesList);
      });
    }
  }

  onClausesGridReady(event){
    this.clausesGridApi = event.api;
  }
  onObjetivesGridReady(event){
    this.objetivesGridApi = event.api;
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
    let dateFormat = new Date(form.fcreacion).toUTCString();
    if(this.code){

      let updateClausesList = this.clausesList.filter((row) => { return !row.createClauses; });
      let createClausesList = this.clausesList.filter((row) => { return row.createClauses; });

      let updateExhibitList = this.exhibitList.filter((row) => { return !row.create; });
      let createExhibitList = this.exhibitList.filter((row) => { return row.create; });

      let updateObjetivesList = this.objetivesList.filter((row) => { return !row.createObjetives; });
      let createObjetivesList = this.objetivesList.filter((row) => { return row.createObjetives; });
      
      params = {
        canexo: this.code,
        cclausula: form.cclausula,
        fcreacion: dateFormat,
        clauses: {
          create: createClausesList,
          update: updateClausesList
        },
        exhibit:{
          create: createExhibitList,
          update: updateExhibitList
        },
        objetives:{
          create: createObjetivesList,
          update: updateObjetivesList
        }
      };
      url = `${environment.apiUrl}/api/clauses/update`;
    }else{
      params = { 
        xanexo: form.xanexo,
        xobservacion: form.xobservacion,
        bactivo: form.bactivo,
        fcreacion: dateFormat
      };
      url = `${environment.apiUrl}/api/clauses/exhibit/create`;
    }; 
    this.http.post(url, params, options).subscribe((response: any) => {
      if(response.data.status){
        if(this.code){
          location.reload();
        }else{
          this.router.navigate([`/configuration/clauses-detail/${response.data.canexo}`]);
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
      let code = err.error.data.code;
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

  clausesRowClicked(event: any){
    let anexo = {};
    if(this.editStatus){ 
      anexo = { 
        edit: this.editStatus,
        createClauses: false,
        type: 1,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        canexo: event.data.canexo,
        xanexo: event.data.xanexo,
        cclausula: event.data.cclausula,
        xclausulas: event.data.xclausulas,
        xobservacion: event.data.xobservacion,
        bactivo: event.data.bactivo,
        delete: false
      };
    }else{ 
      anexo = { 
        edit: this.editStatus,
        createClauses: false,
        type: 2,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        canexo: event.data.canexo,
        xanexo: event.data.xanexo,
        cclausula: event.data.cclausula,
        xclausulas: event.data.xclausulas,
        xobservacion: event.data.xobservacion,
        bactivo: event.data.bactivo,
        delete: false
      }; 
    }
    if(this.editStatus){
    const modalRef = this.modalService.open(ConfigurationClausesComponent, {size: 'xl'});
    modalRef.componentInstance.anexo = anexo;
    modalRef.result.then((result: any) => {

      let index = this.clausesList.findIndex(el=> el.cclausula == result.cclausula);
      this.clausesList[index].cclausula = result.cclausula;
      this.clausesList[index].xclausulas = result.xclausulas;
      this.clausesList[index].xobservacion = result.xobservacion;
      this.clausesList[index].bactivo = result.bactivo;
      this.clausesGridApi.refreshCells();
      return;
    });
  }else{
    const modalRef = this.modalService.open(ConfigurationClausesComponent, {size: 'xl'});
    modalRef.componentInstance.anexo = anexo;
  }
  }

  objetivesRowClicked(event: any){
    let clausula = {};
    if(this.editStatus){ 
      clausula = { 
        edit: this.editStatus,
        createObjetives: false,
        type: 1,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        canexo: event.data.canexo,
        cclausula: event.data.cclausula,
        xclausulas: event.data.xclausulas,
        cobjetivo: event.data.cobjetivo,
        xobjetivo: event.data.xobjetivo,
        bactivo: event.data.bactivo,
        delete: false
      };
      console.log(clausula)
    }else{ 
      clausula = { 
        edit: this.editStatus,
        createObjetives: false,
        type: 2,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        canexo: event.data.canexo,
        cclausula: event.data.cclausula,
        xclausulas: event.data.xclausulas,
        cobjetivo: event.data.cobjetivo,
        xobjetivo: event.data.xobjetivo,
        bactivo: event.data.bactivo,
        delete: false
      }; 
      console.log(clausula)
    }
    if(this.editStatus){
    const modalRef = this.modalService.open(ConfigurationObjetivesComponent, {size: 'xl'});
    modalRef.componentInstance.clausula = clausula;
    modalRef.result.then((result: any) => {

      let index = this.objetivesList.findIndex(el=> el.cobjetivo == result.cobjetivo);
      this.clausesList[index].cobjetivo = result.cobjetivo;
      this.clausesList[index].xobjetivo = result.xobjetivo;
      this.clausesList[index].cclausula = result.cclausula;
      this.clausesList[index].bactivo = result.bactivo;
      this.clausesGridApi.refreshCells();
      return;
    });
  }else{
    const modalRef = this.modalService.open(ConfigurationObjetivesComponent, {size: 'xl'});
    modalRef.componentInstance.clausula = clausula;
  }
  }

  editExhibit(){
    this.detail_form.get('xanexo').enable();
    this.detail_form.get('xobservacion').enable();
    this.detail_form.get('bactivo').enable();
    this.showEditButton = false;
    this.showSaveButton = true;
    this.editStatus = true;
    this.editBlock = true;
  }

  cancelSave(){
    if(this.code){
      this.loading_cancel = true;
      this.showSaveButton = false;
      this.editStatus = false;
      this.showEditButton = true;
      this.getExhibitData();
    }else{
      this.router.navigate([`/configuration/clauses-index`]);
    }
  }

}
