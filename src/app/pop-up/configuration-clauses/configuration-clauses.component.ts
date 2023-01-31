import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-configuration-clauses',
  templateUrl: './configuration-clauses.component.html',
  styleUrls: ['./configuration-clauses.component.css']
})
export class ConfigurationClausesComponent implements OnInit {

  @Input() public anexo;
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
      xobjetivo: ['']
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
    if(this.anexo.edit){
      this.canSave = true;
      this.editClauses();
    }

    if(!this.anexo.edit && !this.anexo.createClauses ){
      this.editClauses();
    }

    if(this.anexo.createClauses){
      this.canSave = true;
      this.createClauses();
    }
  }

  createClauses(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      canexo: this.anexo.canexo
    };
    this.http.post(`${environment.apiUrl}/api/clauses/search-exhibit`, params, options).subscribe((response : any) => {
      if(this.anexo.canexo){
        this.popup_form.get('canexo').setValue(response.data.canexo);
        this.popup_form.get('canexo').disable();
        this.popup_form.get('xanexo').setValue(response.data.xanexo);
        this.popup_form.get('xanexo').disable();
      }

      if(this.anexo.canexo){
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
        this.anexo.createClauses = true;
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

  editClauses(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cclausula: this.anexo.cclausula
    };
    if(this.anexo.edit){
    this.http.post(`${environment.apiUrl}/api/clauses/search-clauses`, params, options).subscribe((response : any) => {
      if(this.anexo.cclausula){
        this.popup_form.get('cclausula').setValue(response.data.cclausula);
        this.popup_form.get('xclausulas').setValue(response.data.xclausulas);
        this.popup_form.get('xobservacion').setValue(response.data.xobservacion);
        this.popup_form.get('bactivo').setValue(response.data.bactivo);
        this.popup_form.get('xanexo').setValue(response.data.xanexo);
        this.popup_form.get('xanexo').disable();
      }
      
      if(this.anexo.canexo){
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
        this.anexo.createClauses = true;
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
      this.http.post(`${environment.apiUrl}/api/clauses/search-clauses`, params, options).subscribe((response : any) => {
        if(this.anexo.cclausula){
          this.popup_form.get('cclausula').setValue(response.data.cclausula);
          this.popup_form.get('cclausula').disable()
          this.popup_form.get('xclausulas').setValue(response.data.xclausulas);
          this.popup_form.get('xclausulas').disable()
          this.popup_form.get('xobservacion').setValue(response.data.xobservacion);
          this.popup_form.get('xobservacion').disable()
          this.popup_form.get('bactivo').setValue(response.data.bactivo);
          this.popup_form.get('bactivo').disable()
          this.popup_form.get('xanexo').setValue(response.data.xanexo);
          this.popup_form.get('xanexo').disable();
        }
        
        if(this.anexo.canexo){
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
          this.anexo.createClauses = true;
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
    this.anexo.canexo = this.popup_form.get('canexo').value;
    this.anexo.xanexo = this.popup_form.get('xanexo').value;
    this.anexo.xclausulas = form.xclausulas;
    this.anexo.xobservacion = form.xobservacion;
    this.anexo.bactivo = form.bactivo;

    this.activeModal.close(this.anexo);
  }
}
