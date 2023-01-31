import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-tables-documents',
  templateUrl: './tables-documents.component.html',
  styleUrls: ['./tables-documents.component.css']
})
export class TablesDocumentsComponent implements OnInit {

  @Input() public recaudo;
  sub;
  currentUser;
  popup_form: FormGroup;
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
  collectionsList: any[] = []
  code;
  alert = { show : false, type : "", message : "" }

  constructor(public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private authenticationService : AuthenticationService,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router) { }


  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      crecaudo: [''],
      xrecaudo: [''],
      cdocumento: [''],
      xdocumentos: [''],
      bactivo: [true]
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
    if(this.recaudo.edit){
      this.canSave = true;
      this.editDocuments();
    }

    if(!this.recaudo.edit && !this.recaudo.createDocuments ){
      this.editDocuments();
    }

    if(this.recaudo.createDocuments){
      this.canSave = true;
      this.createDocuments();
    }
  }

  createDocuments(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      crecaudo: this.recaudo.crecaudo,
      ccompania: this.currentUser.data.ccompania
    };
    this.http.post(`${environment.apiUrl}/api/collections/search-collections`, params, options).subscribe((response : any) => {
      if(response.data.status){
        this.popup_form.get('crecaudo').setValue(response.data.crecaudo);
        this.popup_form.get('crecaudo').disable();
        this.popup_form.get('xrecaudo').setValue(response.data.xrecaudo);
        this.popup_form.get('xrecaudo').disable();
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

  editDocuments(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cdocumento: this.recaudo.cdocumento,
      ccompania: this.currentUser.data.ccompania
    };
    if(this.recaudo.edit){
        this.http.post(`${environment.apiUrl}/api/collections/search-documents`, params, options).subscribe((response : any) => {
          if(response.data.status){
            this.popup_form.get('xrecaudo').setValue(response.data.xrecaudo);
            this.popup_form.get('xrecaudo').disable();
            this.popup_form.get('cdocumento').setValue(response.data.cdocumento);
            this.popup_form.get('xdocumentos').setValue(response.data.xdocumentos);
            this.popup_form.get('bactivo').setValue(response.data.bactivo);
          }
          if(this.recaudo.cdocumento){
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
            this.recaudo.createDocuments = true;
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
    }else{
      this.http.post(`${environment.apiUrl}/api/collections/search-documents`, params, options).subscribe((response : any) => {
        if(response.data.status){
          this.popup_form.get('xrecaudo').setValue(response.data.xrecaudo);
          this.popup_form.get('xrecaudo').disable();
          this.popup_form.get('cdocumento').setValue(response.data.cdocumento);
          this.popup_form.get('cdocumento').disable();
          this.popup_form.get('xdocumentos').setValue(response.data.xdocumentos);
          this.popup_form.get('xdocumentos').disable();
          this.popup_form.get('bactivo').setValue(response.data.bactivo);
          this.popup_form.get('bactivo').disable();
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
  }

  onSubmit(form){
    this.submitted = true;
    this.loading = true;
    if (this.popup_form.invalid) {
      this.loading = false;
      return;
    }

    this.recaudo.crecaudo = this.popup_form.get('crecaudo').value;
    this.recaudo.xrecaudo = this.popup_form.get('xrecaudo').value;
    this.recaudo.xdocumentos = form.xdocumentos;
    this.recaudo.bactivo = form.bactivo;

    console.log(this.recaudo.xdocumentos)

    this.activeModal.close(this.recaudo);
  }

}
