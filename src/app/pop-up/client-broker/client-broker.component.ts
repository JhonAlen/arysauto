import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-client-broker',
  templateUrl: './client-broker.component.html',
  styleUrls: ['./client-broker.component.css']
})
export class ClientBrokerComponent implements OnInit {

  @Input() public broker;
  currentUser;
  popup_form: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  brokerList: any[] = [];
  alert = { show : false, type : "", message : "" }

  constructor(public activeModal: NgbActiveModal,
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      ccorredor: [''],
      pcorredor: [''],
      mcorredor: [''],
      fefectiva: ['']
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania
      };
      this.http.post(`${environment.apiUrl}/api/valrep/broker`, params, options).subscribe((response : any) => {
        if(response.data.status){
          for(let i = 0; i < response.data.list.length; i++){
            this.brokerList.push({ id: response.data.list[i].ccorredor, value: response.data.list[i].xcorredor });
          }
          this.brokerList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.BROKERNOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
      if(this.broker){
        if(this.broker.type == 3){
          this.canSave = true;
        }else if(this.broker.type == 2){
          this.popup_form.get('ccorredor').setValue(this.broker.ccorredor);
          this.popup_form.get('ccorredor').disable();
          this.popup_form.get('pcorredor').setValue(this.broker.pcorredor);
          this.popup_form.get('pcorredor').disable();
          this.popup_form.get('mcorredor').setValue(this.broker.mcorredor);
          this.popup_form.get('mcorredor').disable();
          this.popup_form.get('fefectiva').setValue(this.broker.fefectiva);
          this.popup_form.get('fefectiva').disable();
          this.canSave = false;
        }else if(this.broker.type == 1){
          this.popup_form.get('ccorredor').setValue(this.broker.ccorredor);
          this.popup_form.get('pcorredor').setValue(this.broker.pcorredor);
          this.popup_form.get('mcorredor').setValue(this.broker.mcorredor);
          this.popup_form.get('fefectiva').setValue(this.broker.fefectiva);
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
    let brokerFilter = this.brokerList.filter((option) => { return option.id == form.ccorredor; });
    this.broker.ccorredor = form.ccorredor;
    this.broker.xcorredor = brokerFilter[0].value;
    this.broker.pcorredor = form.pcorredor;
    this.broker.mcorredor = form.mcorredor;
    this.broker.fefectiva = form.fefectiva;
    this.activeModal.close(this.broker);
  }

  deleteBroker(){
    this.broker.type = 4;
    if(!this.broker.create){
      this.broker.delete = true;
    }
    this.activeModal.close(this.broker);
  }

}
