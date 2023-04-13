import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-provider-state',
  templateUrl: './provider-state.component.html',
  styleUrls: ['./provider-state.component.css']
})
export class ProviderStateComponent implements OnInit {

  @Input() public state;
  currentUser;
  popup_form: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  stateList: any[] = [];
  alert = { show : false, type : "", message : "" }

  constructor(public activeModal: NgbActiveModal,
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      cestado: ['', Validators.required]
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cpais: this.currentUser.data.cpais
      };
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
      if(this.state){
        if(this.state.type == 3){
          this.canSave = true;
        }else if(this.state.type == 1){
          this.popup_form.get('cestado').setValue(this.state.cestado);
          this.popup_form.get('cestado').disable();
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
    let stateFilter = this.stateList.filter((option) => { return option.id == form.cestado; });
    this.state.cestado = form.cestado;
    this.state.xestado = stateFilter[0].value;
    this.activeModal.close(this.state);
  }

  deleteState(){
    this.state.type = 4;
    if(!this.state.create){
      this.state.delete = true;
    }
    this.activeModal.close(this.state);
  }

}
