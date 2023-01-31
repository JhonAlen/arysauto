import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';
// import { renderFlagCheckIfStmt } from '@angular/compiler/src/render3/view/templateUrl';

@Component({
  selector: 'app-configuration-objetives',
  templateUrl: './configuration-objetives.component.html',
  styleUrls: ['./configuration-objetives.component.css']
})
export class ConfigurationObjetivesComponent implements OnInit {

  @Input() public clausula;
  sub;
  currentUser;
  popup_form: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  loading_cancel: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  canCreate: boolean = false;
  canDetail: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;
  corden: number;
  variablex: number;
  showSaveButton: boolean = false;
  showEditButton: boolean = false;
  objetivesList: any[] = [];
  clausesList: any[] = []
  code;
  alert = { show : false, type : "", message : "" }

  constructor(public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private authenticationService : AuthenticationService,
    private http: HttpClient,
    private formBuilder: UntypedFormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      canexo: [''],
      xanexo: [''],
      cclausula: [''],
      xclausulas: [''],
      xobservacion: [''],
      bactivo: [true],
      xobjetivo: [''],
      cobjetivo: ['']
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 96
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
        }else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
    }
  }

  initializeDetailModule(){
    if(this.clausula.edit){
      this.canSave = true;
      this.editObjetives();
    }

    if(!this.clausula.edit && !this.clausula.createObjetives ){
      this.editObjetives();
    }

    if(this.clausula.createObjetives){
      this.canSave = true;
      this.createObjetives();
    }
  }


  createObjetives(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cclausula: this.clausula.cclausula,
      canexo: this.clausula.canexo
    };
    this.http.post(`${environment.apiUrl}/api/valrep/clauses/search-clauses`, params, options).subscribe((response : any) => {
      if(response.data.list){
        for(let i = 0; i < response.data.list.length; i++){
          this.clausesList.push({ cclausula: response.data.list[i].cclausula, xclausulas: response.data.list[i].xclausulas});
        }
      }
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

  editObjetives(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cobjetivo: this.clausula.cobjetivo
    };
    if(this.clausula.edit){
    this.http.post(`${environment.apiUrl}/api/clauses/search-objetives`, params, options).subscribe((response : any) => {
      if(this.clausula.cobjetivo){
        this.clausesList.push({cclausula: response.data.cclausula, xclausulas: response.data.xclausulas})
        this.popup_form.get('cclausula').setValue(response.data.cclausula);
        this.popup_form.get('xclausulas').setValue(response.data.xclausulas);
        this.popup_form.get('cobjetivo').setValue(response.data.cobjetivo);
        this.popup_form.get('xobjetivo').setValue(response.data.xobjetivo);
        this.popup_form.get('bactivo').setValue(response.data.bactivo);
      }
      
      if(this.clausula.canexo){
        if(!this.canDetail){
          this.router.navigate([`/permission-error`]);
          return;
        }
        if(this.canEdit){ this.showEditButton = true; }
      }else{
        if(!this.canCreate){
          this.router.navigate([`/permission-error`]);
          return;
        }
        this.clausula.createClauses = true;
      }
    },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.NOTIFICATIONNOTFOUND"; }
        //else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
    }else{
      this.http.post(`${environment.apiUrl}/api/clauses/search-objetives`, params, options).subscribe((response : any) => {
        if(this.clausula.cobjetivo){
          this.clausesList.push({cclausula: response.data.cclausula, xclausulas: response.data.xclausulas})
          this.popup_form.get('cclausula').setValue(response.data.cclausula);
          this.popup_form.get('cclausula').disable();
          this.popup_form.get('xclausulas').setValue(response.data.xclausulas);
          this.popup_form.get('xclausulas').disable();
          this.popup_form.get('cobjetivo').setValue(response.data.cobjetivo);
          this.popup_form.get('cobjetivo').disable();
          this.popup_form.get('xobjetivo').setValue(response.data.xobjetivo);
          this.popup_form.get('xobjetivo').disable();
          this.popup_form.get('bactivo').setValue(response.data.bactivo);
          this.popup_form.get('bactivo').disable();
          console.log(this.clausesList)
        }
        
        if(this.clausula.canexo){
          if(!this.canDetail){
            this.router.navigate([`/permission-error`]);
            return;
          }
          if(this.canEdit){ this.showEditButton = true; }
        }else{
          if(!this.canCreate){
            this.router.navigate([`/permission-error`]);
            return;
          }
          this.clausula.createObjetives = true;
        }
      },
        (err) => {
          let code = err.error.data.code;
          let message;
          if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
          else if(code == 404){ message = "HTTP.ERROR.VALREP.NOTIFICATIONNOTFOUND"; }
          //else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
          this.alert.message = message;
          this.alert.type = 'danger';
          this.alert.show = true;
        });
    } 
  }

  onSubmit(form){
    this.submitted = true;
    this.loading = true;
    if (this.popup_form.invalid) {
      this.loading = false;
      return;
    }

    let clausesFilter = this.clausesList.filter((option) => { return option.cclausula == this.popup_form.get('cclausula').value; });

    this.clausula.cclausula = this.popup_form.get('cclausula').value;
    this.clausula.xclausulas = clausesFilter[0].xclausulas;
    this.clausula.xobjetivo = form.xobjetivo;
    this.clausula.bactivo = form.bactivo;

    this.activeModal.close(this.clausula);
  }
}
