import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-owner-document',
  templateUrl: './owner-document.component.html',
  styleUrls: ['./owner-document.component.css']
})
export class OwnerDocumentComponent implements OnInit {

  @ViewChild('Xarchivo', { static: false }) xarchivo: ElementRef;
  @Input() public document;
  currentUser;
  popup_form: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  documentList: any[] = [];
  alert = { show : false, type : "", message : "" }
  xrutaarchivo: string;

  constructor(public activeModal: NgbActiveModal,
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      cdocumento: [''],
      xarchivo: ['']
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania,
        cmodulo: 69
      };
      this.http.post(`${environment.apiUrl}/api/valrep/process/document`, params, options).subscribe((response : any) => {
        if(response.data.status){
          for(let i = 0; i < response.data.list.length; i++){
            this.documentList.push({ id: response.data.list[i].cdocumento, value: response.data.list[i].xdocumento });
          }
          this.documentList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.DOCUMENTNOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
      if(this.document){
        if(this.document.type == 3){
          this.canSave = true;
        }else if(this.document.type == 2){
          this.popup_form.get('cdocumento').setValue(this.document.cdocumento);
          this.popup_form.get('cdocumento').disable();
          this.xrutaarchivo = this.document.xrutaarchivo;
          this.canSave = false;
        }else if(this.document.type == 1){
          this.popup_form.get('cdocumento').setValue(this.document.cdocumento);
          this.xrutaarchivo = this.document.xrutaarchivo;
          this.canSave = true;
          this.isEdit = true;
        }
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
          this.xrutaarchivo = `${environment.apiUrl}/documents/${response.data.uploadedFile.filename}`;
          this.savePopUpForm(form);
        }else{
          this.alert.message = "THIRDPARTIES.OWNERS.CANTUPLOADDOCUMENT";
          this.alert.type = 'danger';
          this.alert.show = true;
          this.loading = false;
        }
      }, er => {
        this.alert.message = "THIRDPARTIES.OWNERS.CANTUPLOADDOCUMENT";
        this.alert.type = 'danger';
        this.alert.show = true;
        this.loading = false;
      });
    }
  }

  savePopUpForm(form){
    let documentFilter = this.documentList.filter((option) => { return option.id == form.cdocumento; });
    this.document.cdocumento = form.cdocumento;
    this.document.xdocumento = documentFilter[0].value;
    this.document.xrutaarchivo = this.xrutaarchivo ? this.xrutaarchivo : "n/a";
    this.activeModal.close(this.document);
  }

  deleteDocument(){
    this.document.type = 4;
    if(!this.document.create){
      this.document.delete = true;
    }
    this.activeModal.close(this.document);
  }

}
