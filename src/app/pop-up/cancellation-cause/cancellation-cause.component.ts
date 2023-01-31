import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-cancellation-cause',
  templateUrl: './cancellation-cause.component.html',
  styleUrls: ['./cancellation-cause.component.css']
})
export class CancellationCauseComponent implements OnInit {

  @Input() public cancellationCause;
  currentUser;
  popup_form: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  cancellationCauseList: any[] = [];
  alert = { show : false, type : "", message : "" }

  constructor(public activeModal: NgbActiveModal,
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      ccausaanulacion: ['', Validators.required]
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania
      };
      this.http.post(`${environment.apiUrl}/api/valrep/cancellation-cause`, params, options).subscribe((response : any) => {
        if(response.data.status){
          for(let i = 0; i < response.data.list.length; i++){
            this.cancellationCauseList.push({ id: response.data.list[i].ccausaanulacion, value: response.data.list[i].xcausaanulacion });
          }
          this.cancellationCauseList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.CANCELLATIONCAUSENOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
      if(this.cancellationCause){
        if(this.cancellationCause.type == 3){
          this.canSave = true;
        }else if(this.cancellationCause.type == 2){
          this.popup_form.get('ccausaanulacion').setValue(this.cancellationCause.ccausaanulacion);
          this.popup_form.get('ccausaanulacion').disable();
          this.canSave = false;
        }else if(this.cancellationCause.type == 1){
          this.popup_form.get('ccausaanulacion').setValue(this.cancellationCause.ccausaanulacion);
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
    let cancellationCauseFilter = this.cancellationCauseList.filter((option) => { return option.id == form.ccausaanulacion; });
    this.cancellationCause.ccausaanulacion = form.ccausaanulacion;
    this.cancellationCause.xcausaanulacion = cancellationCauseFilter[0].value;
    this.activeModal.close(this.cancellationCause);
  }

  deleteCancellationCause(){
    this.cancellationCause.type = 4;
    if(!this.cancellationCause.create){
      this.cancellationCause.delete = true;
    }
    this.activeModal.close(this.cancellationCause);
  }

}
