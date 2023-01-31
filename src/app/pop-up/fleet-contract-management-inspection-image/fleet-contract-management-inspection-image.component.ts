import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-fleet-contract-management-inspection-image',
  templateUrl: './fleet-contract-management-inspection-image.component.html',
  styleUrls: ['./fleet-contract-management-inspection-image.component.css']
})
export class FleetContractManagementInspectionImageComponent implements OnInit {

  @ViewChild('Ximagen', { static: false }) xarchivo: ElementRef;
  @Input() public image;
  currentUser;
  popup_form: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  alert = { show : false, type : "", message : "" }
  xrutaimagen: string;

  constructor(public activeModal: NgbActiveModal,
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      ximagen: ['']
    });
    if(this.image){
      if(this.image.type == 3){
        this.canSave = true;
      }else if(this.image.type == 2){
        this.xrutaimagen = this.image.xrutaimagen;
        this.canSave = false;
      }else if(this.image.type == 1){
        this.xrutaimagen = this.image.xrutaimagen;
        this.canSave = true;
        this.isEdit = true;
      }
    }
  }

  onFileSelect(event){
    const file = event.target.files[0];
    this.popup_form.get('ximagen').setValue(file);
  }

  onSubmit(form){
    this.submitted = true;
    this.loading = true;
    if (this.popup_form.invalid) {
      this.loading = false;
      return;
    }
    if(!this.popup_form.get('ximagen').value){
      this.savePopUpForm(form);
    }else{
      const formData = new FormData();
      formData.append('ximagen', this.popup_form.get('ximagen').value);
      formData.append('agentId', '007');
      this.http.post<any>(`${environment.apiUrl}/api/upload/image`, formData).subscribe(response => {
        if(response.data.status){
          this.xrutaimagen = `${environment.apiUrl}/images/${response.data.uploadedFile.filename}`;
          this.savePopUpForm(form);
        }else{
          this.alert.message = "THIRDPARTIES.OWNERS.CANTUPLOADIMAGE";
          this.alert.type = 'danger';
          this.alert.show = true;
          this.loading = false;
        }
      }, er => {
        this.alert.message = "THIRDPARTIES.OWNERS.CANTUPLOADIMAGE";
        this.alert.type = 'danger';
        this.alert.show = true;
        this.loading = false;
      });
    }
  }

  savePopUpForm(form){
    this.image.xrutaimagen = this.xrutaimagen ? this.xrutaimagen : "n/a";
    this.activeModal.close(this.image);
  }

  deleteImage(){
    this.image.type = 4;
    if(!this.image.create){
      this.image.delete = true;
    }
    this.activeModal.close(this.image);
  }

}
