import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-owner-vehicle-image',
  templateUrl: './owner-vehicle-image.component.html',
  styleUrls: ['./owner-vehicle-image.component.css']
})
export class OwnerVehicleImageComponent implements OnInit {

  @ViewChild('Ximagen', { static: false }) xarchivo: ElementRef;
  @Input() public image;
  currentUser;
  popup_form: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  alert = { show : false, type : "", message : "" }
  imageList: any[] = [];
  xrutaimagen: string;

  constructor(public activeModal: NgbActiveModal,
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      cimagen: [''],
      ximagen: ['']
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania
      };
      this.http.post(`${environment.apiUrl}/api/v2/valrep/production/search/image`, params, options).subscribe((response : any) => {
        if(response.data.status){
          for(let i = 0; i < response.data.list.length; i++){
            this.imageList.push({ id: response.data.list[i].cimagen, value: response.data.list[i].ximagen });
          }
          this.imageList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.IMAGENOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
      if(this.image){
        if(this.image.type == 3){
          this.canSave = true;
        }else if(this.image.type == 2){
          this.popup_form.get('cimagen').setValue(this.image.cimagen);
          this.popup_form.get('cimagen').disable();
          this.xrutaimagen = this.image.xrutaimagen;
          this.canSave = false;
        }else if(this.image.type == 1){
          this.popup_form.get('cimagen').setValue(this.image.cimagen);
          this.xrutaimagen = this.image.xrutaimagen;
          this.canSave = true;
          this.isEdit = true;
        }
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
    let imageFilter = this.imageList.filter((option) => { return option.id == form.cimagen; });
    this.image.cimagen = form.cimagen;
    this.image.ximagen = imageFilter[0].value;
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
