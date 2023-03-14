import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-client-contact',
  templateUrl: './client-contact.component.html',
  styleUrls: ['./client-contact.component.css']
})
export class ClientContactComponent implements OnInit {

  @Input() public contact;
  currentUser;
  popup_form: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  documentTypeList: any[] = [];
  alert = { show : false, type : "", message : "" }

  constructor(public activeModal: NgbActiveModal,
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      xnombre: ['', Validators.required],
      xapellido: ['', Validators.required],
      icedula: ['', Validators.required],
      xdocidentidad: ['', Validators.required],
      xtelefonocelular: ['', Validators.required],
      xemail: ['', Validators.compose([
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])],
      xcargo: [''],
      xtelefonocasa: [''],
      xtelefonooficina: [''],
      xfax: [''],
      bnotificacion: [false, Validators.required]
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      if(this.contact){
        if(this.contact.type == 3){
          this.canSave = true;
        }else if(this.contact.type == 2){
          this.popup_form.get('xnombre').setValue(this.contact.xnombre);
          this.popup_form.get('xnombre').disable();
          this.popup_form.get('xapellido').setValue(this.contact.xapellido);
          this.popup_form.get('xapellido').disable();
          this.popup_form.get('icedula').setValue(this.contact.icedula);
          this.popup_form.get('icedula').disable();
          this.popup_form.get('xdocidentidad').setValue(this.contact.xdocidentidad);
          this.popup_form.get('xdocidentidad').disable();
          this.popup_form.get('xtelefonocelular').setValue(this.contact.xtelefonocelular);
          this.popup_form.get('xtelefonocelular').disable();
          this.popup_form.get('xemail').setValue(this.contact.xemail);
          this.popup_form.get('xemail').disable();
          this.popup_form.get('xcargo').setValue(this.contact.xcargo);
          this.popup_form.get('xcargo').disable();
          this.popup_form.get('xtelefonooficina').setValue(this.contact.xtelefonooficina);
          this.popup_form.get('xtelefonooficina').disable();
          this.popup_form.get('xtelefonocasa').setValue(this.contact.xtelefonocasa);
          this.popup_form.get('xtelefonocasa').disable();
          this.canSave = false;
        }else if(this.contact.type == 1){
          this.popup_form.get('xnombre').setValue(this.contact.xnombre);
          this.popup_form.get('xapellido').setValue(this.contact.xapellido);
          this.popup_form.get('icedula').setValue(this.contact.icedula);
          this.popup_form.get('xdocidentidad').setValue(this.contact.xdocidentidad);
          this.popup_form.get('xtelefonocelular').setValue(this.contact.xtelefonocelular);
          this.popup_form.get('xemail').setValue(this.contact.xemail);
          this.popup_form.get('xcargo').setValue(this.contact.xcargo);
          this.popup_form.get('xtelefonooficina').setValue(this.contact.xtelefonooficina);
          this.popup_form.get('xtelefonocasa').setValue(this.contact.xtelefonocasa);
          this.popup_form.get('xfax').setValue(this.contact.xfax);
          this.popup_form.get('bnotificacion').setValue(this.contact.bnotificacion);
          this.canSave = true;
          this.isEdit = true;
        }
      }
    }
  }

  onSubmit(form){
    this.submitted = true;
    this.loading = true;

    this.contact.xnombre = form.xnombre;
    this.contact.xapellido = form.xapellido;
    this.contact.icedula = form.icedula;
    this.contact.xdocidentidad = form.xdocidentidad;
    this.contact.xtelefonocelular = form.xtelefonocelular;
    this.contact.xemail = form.xemail;
    this.contact.xcargo = form.xcargo;
    this.contact.xtelefonocasa = form.xtelefonocasa;
    this.contact.xtelefonooficina = form.xtelefonooficina;
    this.contact.xfax = form.xfax;
    this.contact.bnotificacion = form.bnotificacion;
    this.activeModal.close(this.contact);
  }

  deleteContact(){
    this.contact.type = 4;
    if(!this.contact.create){
      this.contact.delete = true;
    }
    this.activeModal.close(this.contact);
  }

}
