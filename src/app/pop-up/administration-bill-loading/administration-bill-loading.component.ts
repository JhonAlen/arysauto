import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-administration-bill-loading',
  templateUrl: './administration-bill-loading.component.html',
  styleUrls: ['./administration-bill-loading.component.css']
})
export class AdministrationBillLoadingComponent implements OnInit {

  @ViewChild('Xarchivo', { static: false }) xarchivo: ElementRef;
  @Input() public bill;
  currentUser;
  popup_form: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  canSave: boolean = false;
  canSaveSettlement: boolean = false;
  isEdit: boolean = false;
  finiquito: boolean = false;
  alert = { show : false, type : "", message : "" }
  xrutaarchivo: string;

  constructor(public activeModal: NgbActiveModal,
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      xnotanotificacion: [''],
      xarchivo: [''],
      cfiniquito: [''],
      cnotificacion: [''],
      corden: [''],
      mmontofiniquito: ['']
    });
  }

  onFileSelect(event){
    const file = event.target.files[0];
    this.popup_form.get('xarchivo').setValue(file);
    this.canSave = true;

  }

  onSubmit(form){
    this.submitted = true;
    this.loading = true;

    if(!this.popup_form.get('xarchivo').value){
      this.savePopUpForm(form);
    }else{
      const formData = new FormData();
      formData.append('xdocumento', this.popup_form.get('xarchivo').value);
      formData.append('agentId', '007');
      this.http.post<any>(`${environment.apiUrl}/api/upload/document`, formData).subscribe(response => {
        if(response.data.status){
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
    this.bill.xrutaarchivo = this.xrutaarchivo ? this.xrutaarchivo : "n/a";
    this.activeModal.close(this.bill);
  }

}
