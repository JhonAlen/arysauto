import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-providers-documents',
  templateUrl: './providers-documents.component.html',
  styleUrls: ['./providers-documents.component.css']
})
export class ProvidersDocumentsComponent implements OnInit {

  @ViewChild('Xarchivo', { static: false }) xarchivo: ElementRef;
  @Input() public provider;
  currentUser;
  popup_form: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  alert = { show : false, type : "", message : "" }
  xrutaarchivo: string;

  constructor(public activeModal: NgbActiveModal,
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      xobservacion: [''],
      xarchivo: [''],
      xdocumento: [''],
    });
    if(this.provider){
      if(this.provider.type == 3){
        this.canSave = true;
      }else if(this.provider.type == 2){
        console.log(this.provider)
        this.popup_form.get('xobservacion').setValue(this.provider.xobservacion);
        this.popup_form.get('xobservacion').disable();
        this.xrutaarchivo = this.provider.xrutaarchivo;
        this.canSave = false;
        
      }else if(this.provider.type == 1){
        this.popup_form.get('xobservacion').setValue(this.provider.xobservacion);
        this.xrutaarchivo = this.provider.xrutaarchivo;
        this.canSave = true;
        this.isEdit = true;
      }
    }
  }

  onFileSelect(event){
    const file = event.target.files[0];
    this.popup_form.get('xarchivo').setValue(file);
  }

  onSubmit(form){
    this.submitted = true;
    this.loading = true;
    if (this.popup_form.invalid) {
      this.loading = false;
      return;
    }
    if(!this.popup_form.get('xarchivo').value){
      this.savePopUpForm(form);
    }else{
      const formData = new FormData();
      formData.append('xdocumento', this.popup_form.get('xarchivo').value);
      formData.append('agentId', '007');
      this.http.post<any>(`${environment.apiUrl}/api/upload/document`, formData).subscribe(response => {
        if(response.data.status){
          console.log('hola')
          this.xrutaarchivo = `${environment.apiUrl}/documents/${response.data.uploadedFile.filename}`;
          this.savePopUpForm(form);
        }else{
          this.alert.message = "EVENTS.NOTIFICATIONS.CANTUPLOADDOCUMENT";
          this.alert.type = 'danger';
          this.alert.show = true;
          this.loading = false;
        }
      }, err => {
        this.alert.message = "EVENTS.NOTIFICATIONS.CANTUPLOADDOCUMENT";
        this.alert.type = 'danger';
        this.alert.show = true;
        this.loading = false;
      });
    }
  }

  savePopUpForm(form){
    this.provider.xobservacion = form.xobservacion;
    this.provider.xrutaarchivo = this.xrutaarchivo ? this.xrutaarchivo : "n/a";
    this.activeModal.close(this.provider);
  }

}
