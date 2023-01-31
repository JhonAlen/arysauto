import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-provider-brand',
  templateUrl: './provider-brand.component.html',
  styleUrls: ['./provider-brand.component.css']
})
export class ProviderBrandComponent implements OnInit {

  @Input() public brand;
  currentUser;
  popup_form: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  brandList: any[] = [];
  alert = { show : false, type : "", message : "" }

  constructor(public activeModal: NgbActiveModal,
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      cmarca: ['', Validators.required]
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cpais: this.currentUser.data.cpais
      };
      this.http.post(`${environment.apiUrl}/api/valrep/brand`, params, options).subscribe((response : any) => {
        if(response.data.status){
          for(let i = 0; i < response.data.list.length; i++){
            this.brandList.push({ id: response.data.list[i].cmarca, value: response.data.list[i].xmarca });
          }
          this.brandList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.BRANDNOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
      if(this.brand){
        if(this.brand.type == 3){
          this.canSave = true;
        }else if(this.brand.type == 2){
          this.popup_form.get('cmarca').setValue(this.brand.cmarca);
          this.popup_form.get('cmarca').disable();
          this.canSave = false;
        }else if(this.brand.type == 1){
          this.popup_form.get('cmarca').setValue(this.brand.cmarca);
          this.canSave = true;
          this.isEdit = true;
        }
      }
    }
  }

  onSubmit(form){
    this.submitted = true;
    this.loading = true;
    if (this.popup_form.invalid) {
      this.loading = false;
      return;
    }
    let brandFilter = this.brandList.filter((option) => { return option.id == form.cmarca; });
    this.brand.cmarca = form.cmarca;
    this.brand.xmarca = brandFilter[0].value;
    this.activeModal.close(this.brand);
  }

  deleteBrand(){
    this.brand.type = 4;
    if(!this.brand.create){
      this.brand.delete = true;
    }
    this.activeModal.close(this.brand);
  }

}
