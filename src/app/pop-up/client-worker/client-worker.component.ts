import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-client-worker',
  templateUrl: './client-worker.component.html',
  styleUrls: ['./client-worker.component.css']
})
export class ClientWorkerComponent implements OnInit {

  @Input() public worker;
  currentUser;
  popup_form: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  documentTypeList: any[] = [];
  relationshipList: any[] = [];
  civilStatusList: any[] = [];
  stateList: any[] = [];
  cityList: any[] = [];
  alert = { show : false, type : "", message : "" }

  constructor(public activeModal: NgbActiveModal,
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      xnombre: [''],
      xapellido: [''],
      ctipodocidentidad: [''],
      xdocidentidad: [''],
      xtelefonocelular: [''],
      xemail: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])],
      xprofesion: [''],
      xocupacion: [''],
      xtelefonocasa: [''],
      xfax: [''],
      cparentesco: [''],
      cestado: [''],
      cciudad: [''],
      xdireccion: [''],
      fnacimiento: [''],
      cestadocivil: ['']
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania
      };
      this.http.post(`${environment.apiUrl}/api/valrep/document-type`, params, options).subscribe((response : any) => {
        if(response.data.status){
          for(let i = 0; i < response.data.list.length; i++){
            this.documentTypeList.push({ id: response.data.list[i].ctipodocidentidad, value: response.data.list[i].xtipodocidentidad });
          }
          this.documentTypeList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.DOCUMENTTYPENOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
      this.http.post(`${environment.apiUrl}/api/valrep/civil-status`, params, options).subscribe((response : any) => {
        if(response.data.status){
          for(let i = 0; i < response.data.list.length; i++){
            this.civilStatusList.push({ id: response.data.list[i].cestadocivil, value: response.data.list[i].xestadocivil });
          }
          this.civilStatusList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.CIVILSTATUSNOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
      this.http.post(`${environment.apiUrl}/api/valrep/state`, params, options).subscribe((response : any) => {
        if(response.data.status){
          for(let i = 0; i < response.data.list.length; i++){
            this.stateList.push({ id: response.data.list[i].cestado, value: response.data.list[i].xestado });
          }
          this.stateList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.STATENOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
      if(this.worker){
        for(let i = 0; i < this.worker.relationships.length; i++){
          this.relationshipList.push({ id: this.worker.relationships[i].cparentesco, value: this.worker.relationships[i].xparentesco });
        }
        if(this.worker.type == 3){
          this.canSave = true;
        }else if(this.worker.type == 2){
          this.popup_form.get('xnombre').setValue(this.worker.xnombre);
          this.popup_form.get('xnombre').disable();
          this.popup_form.get('xapellido').setValue(this.worker.xapellido);
          this.popup_form.get('xapellido').disable();
          this.popup_form.get('ctipodocidentidad').setValue(this.worker.ctipodocidentidad);
          this.popup_form.get('ctipodocidentidad').disable();
          this.popup_form.get('xdocidentidad').setValue(this.worker.xdocidentidad);
          this.popup_form.get('xdocidentidad').disable();
          this.popup_form.get('xtelefonocelular').setValue(this.worker.xtelefonocelular);
          this.popup_form.get('xtelefonocelular').disable();
          this.popup_form.get('xemail').setValue(this.worker.xemail);
          this.popup_form.get('xemail').disable();
          this.popup_form.get('xprofesion').setValue(this.worker.xprofesion);
          this.popup_form.get('xprofesion').disable();
          this.popup_form.get('xocupacion').setValue(this.worker.xocupacion);
          this.popup_form.get('xocupacion').disable();
          this.popup_form.get('xtelefonocasa').setValue(this.worker.xtelefonocasa);
          this.popup_form.get('xtelefonocasa').disable();
          this.popup_form.get('xfax').setValue(this.worker.xfax);
          this.popup_form.get('xfax').disable();
          this.popup_form.get('cparentesco').setValue(this.worker.cparentesco);
          this.popup_form.get('cparentesco').disable();
          this.popup_form.get('cestado').setValue(this.worker.cestado);
          this.popup_form.get('cestado').disable();
          this.cityDropdownDataRequest();
          this.popup_form.get('cciudad').setValue(this.worker.cciudad);
          this.popup_form.get('cciudad').disable();
          this.popup_form.get('xdireccion').setValue(this.worker.xdireccion);
          this.popup_form.get('xdireccion').disable();
          this.popup_form.get('fnacimiento').setValue(this.worker.fnacimiento);
          this.popup_form.get('fnacimiento').disable();
          this.popup_form.get('cestadocivil').setValue(this.worker.cestadocivil);
          this.popup_form.get('cestadocivil').disable();
          this.canSave = false;
        }else if(this.worker.type == 1){
          this.popup_form.get('xnombre').setValue(this.worker.xnombre);
          this.popup_form.get('xapellido').setValue(this.worker.xapellido);
          this.popup_form.get('ctipodocidentidad').setValue(this.worker.ctipodocidentidad);
          this.popup_form.get('xdocidentidad').setValue(this.worker.xdocidentidad);
          this.popup_form.get('xtelefonocelular').setValue(this.worker.xtelefonocelular);
          this.popup_form.get('xemail').setValue(this.worker.xemail);
          this.popup_form.get('xprofesion').setValue(this.worker.xprofesion);
          this.popup_form.get('xocupacion').setValue(this.worker.xocupacion);
          this.popup_form.get('xtelefonocasa').setValue(this.worker.xtelefonocasa);
          this.popup_form.get('xfax').setValue(this.worker.xfax);
          this.popup_form.get('cparentesco').setValue(this.worker.cparentesco);
          this.popup_form.get('cestado').setValue(this.worker.cestado);
          this.cityDropdownDataRequest();
          this.popup_form.get('cciudad').setValue(this.worker.cciudad);
          this.popup_form.get('xdireccion').setValue(this.worker.xdireccion);
          this.popup_form.get('fnacimiento').setValue(this.worker.fnacimiento);
          this.popup_form.get('cestadocivil').setValue(this.worker.cestadocivil);
          this.canSave = true;
          this.isEdit = true;
        }
      }
    }
  }

  cityDropdownDataRequest(){
    if(this.popup_form.get('cestado').value){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cpais: this.currentUser.data.cpais,
        cestado: this.popup_form.get('cestado').value
      }
      this.http.post(`${environment.apiUrl}/api/valrep/city`, params, options).subscribe((response : any) => {
        if(response.data.status){
          this.cityList = [];
          for(let i = 0; i < response.data.list.length; i++){
            this.cityList.push({ id: response.data.list[i].cciudad, value: response.data.list[i].xciudad });
          }
          this.cityList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.CITYNOTFOUND"; }
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
    this.worker.xnombre = form.xnombre;
    this.worker.xapellido = form.xapellido;
    this.worker.ctipodocidentidad = form.ctipodocidentidad;
    this.worker.xdocidentidad = form.xdocidentidad;
    this.worker.xtelefonocelular = form.xtelefonocelular;
    this.worker.xemail = form.xemail;
    this.worker.xprofesion = form.xprofesion;
    this.worker.xtelefonocasa = form.xtelefonocasa;
    this.worker.xocupacion = form.xocupacion;
    this.worker.xfax = form.xfax;
    this.worker.cparentesco = form.cparentesco;
    this.worker.cestado = form.cestado;
    this.worker.cciudad = form.cciudad;
    this.worker.xdireccion = form.xdireccion;
    this.worker.fnacimiento = form.fnacimiento;
    this.worker.cestadocivil = form.cestadocivil;
    this.activeModal.close(this.worker);
  }

  deleteWorker(){
    this.worker.type = 4;
    if(!this.worker.create){
      this.worker.delete = true;
    }
    this.activeModal.close(this.worker);
  }

}
