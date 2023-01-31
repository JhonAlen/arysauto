import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-fleet-contract-management-accesory',
  templateUrl: './fleet-contract-management-accesory.component.html',
  styleUrls: ['./fleet-contract-management-accesory.component.css']
})
export class FleetContractManagementAccesoryComponent implements OnInit {

  @Input() public accesory;
  currentUser;
  popup_form: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  accesoryList: any[] = [];
  alert = { show : false, type : "", message : "" }

  constructor(public activeModal: NgbActiveModal,
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      caccesorio: ['', Validators.required],
      maccesoriocontratoflota: ['', Validators.required]
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cpais: this.currentUser.data.cpais
      };
      this.http.post(`${environment.apiUrl}/api/valrep/accesory`, params, options).subscribe((response : any) => {
        if(response.data.status){
          for(let i = 0; i < response.data.list.length; i++){
            this.accesoryList.push({ id: response.data.list[i].caccesorio, value: response.data.list[i].xaccesorio });
          }
          this.accesoryList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.ACCESORYNOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
      if(this.accesory){
        if(this.accesory.type == 3){
          this.canSave = true;
        }else if(this.accesory.type == 2){
          this.popup_form.get('caccesorio').setValue(this.accesory.caccesorio);
          this.popup_form.get('caccesorio').disable();
          this.popup_form.get('maccesoriocontratoflota').setValue(this.accesory.maccesoriocontratoflota);
          this.popup_form.get('maccesoriocontratoflota').disable();
          this.canSave = false;
        }else if(this.accesory.type == 1){
          this.popup_form.get('caccesorio').setValue(this.accesory.caccesorio);
          this.popup_form.get('maccesoriocontratoflota').setValue(this.accesory.maccesoriocontratoflota);
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
    let accesoryFilter = this.accesoryList.filter((option) => { return option.id == form.caccesorio; });
    this.accesory.caccesorio = form.caccesorio;
    this.accesory.xaccesorio = accesoryFilter[0].value;
    this.accesory.maccesoriocontratoflota = form.maccesoriocontratoflota;
    this.activeModal.close(this.accesory);
  }

  deleteAccesory(){
    this.accesory.type = 4;
    if(!this.accesory.create){
      this.accesory.delete = true;
    }
    this.activeModal.close(this.accesory);
  }

}
