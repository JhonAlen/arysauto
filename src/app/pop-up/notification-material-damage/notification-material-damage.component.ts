import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-notification-material-damage',
  templateUrl: './notification-material-damage.component.html',
  styleUrls: ['./notification-material-damage.component.css']
})
export class NotificationMaterialDamageComponent implements OnInit {

  @Input() public materialDamage;
  currentUser;
  popup_form: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  materialDamageList: any[] = [];
  damageLevelList: any[] = [];
  documentTypeList: any[] = [];
  stateList: any[] = [];
  cityList: any[] = [];
  alert = { show : false, type : "", message : "" }

  constructor(public activeModal: NgbActiveModal,
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      cdanomaterial: ['', Validators.required],
      cniveldano: ['', Validators.required],
      xobservacion: ['', Validators.required],
      ctipodocidentidad: ['', Validators.required],
      xdocidentidad: ['', Validators.required],
      xnombre: ['', Validators.required],
      xapellido: ['', Validators.required],
      cestado: ['', Validators.required],
      cciudad: ['', Validators.required],
      xdireccion: ['', Validators.required],
      xtelefonocelular: ['', Validators.required],
      xtelefonocasa: [''],
      xemail: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])],
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania
      };
      this.http.post(`${environment.apiUrl}/api/valrep/material-damage`, params, options).subscribe((response : any) => {
        if(response.data.status){
          for(let i = 0; i < response.data.list.length; i++){
            this.materialDamageList.push({ id: response.data.list[i].cdanomaterial, value: response.data.list[i].xdanomaterial });
          }
          this.materialDamageList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.MATERIALDAMAGENOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
      this.http.post(`${environment.apiUrl}/api/valrep/damage-level`, params, options).subscribe((response : any) => {
        if(response.data.status){
          for(let i = 0; i < response.data.list.length; i++){
            this.damageLevelList.push({ id: response.data.list[i].cniveldano, value: response.data.list[i].xniveldano });
          }
          this.damageLevelList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.DAMAGELEVELNOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
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
      if(this.materialDamage){
        if(this.materialDamage.type == 3){
          this.canSave = true;
        }else if(this.materialDamage.type == 2){
          this.popup_form.get('cdanomaterial').setValue(this.materialDamage.cdanomaterial);
          this.popup_form.get('cdanomaterial').disable();
          this.popup_form.get('cniveldano').setValue(this.materialDamage.cniveldano);
          this.popup_form.get('cniveldano').disable();
          this.popup_form.get('xobservacion').setValue(this.materialDamage.xobservacion);
          this.popup_form.get('xobservacion').disable();
          this.popup_form.get('ctipodocidentidad').setValue(this.materialDamage.ctipodocidentidad);
          this.popup_form.get('ctipodocidentidad').disable();
          this.popup_form.get('xdocidentidad').setValue(this.materialDamage.xdocidentidad);
          this.popup_form.get('xdocidentidad').disable();
          this.popup_form.get('xnombre').setValue(this.materialDamage.xnombre);
          this.popup_form.get('xnombre').disable();
          this.popup_form.get('xapellido').setValue(this.materialDamage.xapellido);
          this.popup_form.get('xapellido').disable();
          this.popup_form.get('cestado').setValue(this.materialDamage.cestado);
          this.popup_form.get('cestado').disable();
          this.cityDropdownDataRequest();
          this.popup_form.get('cciudad').setValue(this.materialDamage.cciudad);
          this.popup_form.get('cciudad').disable();
          this.popup_form.get('xdireccion').setValue(this.materialDamage.xdireccion);
          this.popup_form.get('xdireccion').disable();
          this.popup_form.get('xtelefonocelular').setValue(this.materialDamage.xtelefonocelular);
          this.popup_form.get('xtelefonocelular').disable();
          this.popup_form.get('xtelefonocasa').setValue(this.materialDamage.xtelefonocasa);
          this.popup_form.get('xtelefonocasa').disable();
          this.popup_form.get('xemail').setValue(this.materialDamage.xemail);
          this.popup_form.get('xemail').disable();
          this.canSave = false;
        }else if(this.materialDamage.type == 1){
          this.popup_form.get('cdanomaterial').setValue(this.materialDamage.cdanomaterial);
          this.popup_form.get('cniveldano').setValue(this.materialDamage.cniveldano);
          this.popup_form.get('xobservacion').setValue(this.materialDamage.xobservacion);
          this.popup_form.get('ctipodocidentidad').setValue(this.materialDamage.ctipodocidentidad);
          this.popup_form.get('xdocidentidad').setValue(this.materialDamage.xdocidentidad);
          this.popup_form.get('xnombre').setValue(this.materialDamage.xnombre);
          this.popup_form.get('xapellido').setValue(this.materialDamage.xapellido);
          this.popup_form.get('cestado').setValue(this.materialDamage.cestado);
          this.cityDropdownDataRequest();
          this.popup_form.get('cciudad').setValue(this.materialDamage.cciudad);
          this.popup_form.get('xdireccion').setValue(this.materialDamage.xdireccion);
          this.popup_form.get('xtelefonocelular').setValue(this.materialDamage.xtelefonocelular);
          this.popup_form.get('xtelefonocasa').setValue(this.materialDamage.xtelefonocasa);
          this.popup_form.get('xemail').setValue(this.materialDamage.xemail);
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
    let materialDamageFilter = this.materialDamageList.filter((option) => { return option.id == form.cdanomaterial; });
    let damageLevelFilter = this.damageLevelList.filter((option) => { return option.id == form.cniveldano; });
    this.materialDamage.cdanomaterial = form.cdanomaterial;
    this.materialDamage.xdanomaterial = materialDamageFilter[0].value;
    this.materialDamage.cniveldano = form.cniveldano;
    this.materialDamage.xniveldano = damageLevelFilter[0].value;
    this.materialDamage.xobservacion = form.xobservacion;
    this.materialDamage.ctipodocidentidad = form.ctipodocidentidad;
    this.materialDamage.xdocidentidad = form.xdocidentidad;
    this.materialDamage.xnombre = form.xnombre;
    this.materialDamage.xapellido = form.xapellido;
    this.materialDamage.cestado = form.cestado;
    this.materialDamage.cciudad = form.cciudad;
    this.materialDamage.xdireccion = form.xdireccion;
    this.materialDamage.xtelefonocelular = form.xtelefonocelular;
    this.materialDamage.xtelefonocasa = form.xtelefonocasa;
    this.materialDamage.xemail = form.xemail;
    this.activeModal.close(this.materialDamage);
  }

  deleteMaterialDamage(){
    this.materialDamage.type = 4;
    if(!this.materialDamage.create){
      this.materialDamage.delete = true;
    }
    this.activeModal.close(this.materialDamage);
  }

}
