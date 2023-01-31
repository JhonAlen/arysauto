import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-plan-insurer',
  templateUrl: './plan-insurer.component.html',
  styleUrls: ['./plan-insurer.component.css']
})
export class PlanInsurerComponent implements OnInit {

  @Input() public insurer;
  currentUser;
  popup_form: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  insurerList: any[] = [];
  alert = { show : false, type : "", message : "" }

  constructor(public activeModal: NgbActiveModal,
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      caseguradora: ['', Validators.required]
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania
      };
      this.http.post(`${environment.apiUrl}/api/valrep/insurer`, params, options).subscribe((response : any) => {
        if(response.data.status){
          for(let i = 0; i < response.data.list.length; i++){
            this.insurerList.push({ id: response.data.list[i].caseguradora, value: response.data.list[i].xaseguradora });
          }
          this.insurerList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.INSURERNOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
      if(this.insurer){
        if(this.insurer.type == 3){
          this.canSave = true;
        }else if(this.insurer.type == 2){
          this.popup_form.get('caseguradora').setValue(this.insurer.caseguradora);
          this.popup_form.get('caseguradora').disable();
          this.canSave = false;
        }else if(this.insurer.type == 1){
          this.popup_form.get('caseguradora').setValue(this.insurer.caseguradora);
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
    let insurerFilter = this.insurerList.filter((option) => { return option.id == form.caseguradora; });
    this.insurer.caseguradora = form.caseguradora;
    this.insurer.xaseguradora = insurerFilter[0].value;
    this.activeModal.close(this.insurer);
  }

  deleteInsurer(){
    this.insurer.type = 4;
    if(!this.insurer.create){
      this.insurer.delete = true;
    }
    this.activeModal.close(this.insurer);
  }

}
