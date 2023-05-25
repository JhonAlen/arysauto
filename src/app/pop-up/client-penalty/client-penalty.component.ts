import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-client-penalty',
  templateUrl: './client-penalty.component.html',
  styleUrls: ['./client-penalty.component.css']
})
export class ClientPenaltyComponent implements OnInit {

  @Input() public penalty;
  currentUser;
  popup_form: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  penaltyList: any[] = [];
  alert = { show : false, type : "", message : "" }

  constructor(public activeModal: NgbActiveModal,
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      cpenalizacion: [''],
      ppenalizacion: [''],
      mpenalizacion: [''],
      fefectiva: ['']
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cpais: this.currentUser.data.cpais
      };
      this.http.post(`${environment.apiUrl}/api/valrep/penalty`, params, options).subscribe((response : any) => {
        if(response.data.status){
          for(let i = 0; i < response.data.list.length; i++){
            this.penaltyList.push({ id: response.data.list[i].cpenalizacion, value: response.data.list[i].xpenalizacion });
          }
          this.penaltyList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.PENALTYNOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
      if(this.penalty){
        if(this.penalty.type == 3){
          this.canSave = true;
        }else if(this.penalty.type == 2){
          this.popup_form.get('cpenalizacion').setValue(this.penalty.cpenalizacion);
          this.popup_form.get('cpenalizacion').disable();
          this.popup_form.get('ppenalizacion').setValue(this.penalty.ppenalizacion);
          this.popup_form.get('ppenalizacion').disable();
          this.popup_form.get('mpenalizacion').setValue(this.penalty.mpenalizacion);
          this.popup_form.get('mpenalizacion').disable();
          this.popup_form.get('fefectiva').setValue(this.penalty.fefectiva);
          this.popup_form.get('fefectiva').disable();
          this.canSave = false;
        }else if(this.penalty.type == 1){
          this.popup_form.get('cpenalizacion').setValue(this.penalty.cpenalizacion);
          this.popup_form.get('ppenalizacion').setValue(this.penalty.ppenalizacion);
          this.popup_form.get('mpenalizacion').setValue(this.penalty.mpenalizacion);
          this.popup_form.get('fefectiva').setValue(this.penalty.fefectiva);
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
    let penaltyFilter = this.penaltyList.filter((option) => { return option.id == form.cpenalizacion; });
    this.penalty.cpenalizacion = form.cpenalizacion;
    this.penalty.xpenalizacion = penaltyFilter[0].value;
    this.penalty.ppenalizacion = form.ppenalizacion;
    this.penalty.mpenalizacion = form.mpenalizacion;
    this.penalty.fefectiva = form.fefectiva;
    this.activeModal.close(this.penalty);
  }

  deletePenalty(){
    this.penalty.type = 4;
    if(!this.penalty.create){
      this.penalty.delete = true;
    }
    this.activeModal.close(this.penalty);
  }

}
