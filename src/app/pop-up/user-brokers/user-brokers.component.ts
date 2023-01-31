import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-user-brokers',
  templateUrl: './user-brokers.component.html',
  styleUrls: ['./user-brokers.component.css']
})
export class UserBrokersComponent implements OnInit {

  @Input() public broker;
  currentUser;
  popup_form: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  brokerList: any[] = [];
  documentTypeList: any[] = [];
  alert = { show : false, type : "", message : "" }

  constructor(public activeModal: NgbActiveModal,
    private authenticationService : AuthenticationService,
    private http: HttpClient,
    private formBuilder: UntypedFormBuilder,
    private translate: TranslateService) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      xdocidentidad: [''],
      xcorredor: [''],
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      // let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      // let options = { headers: headers };
      // let params = {
      //   cpais: this.broker.cpais
      // };
      // this.http.post(`${environment.apiUrl}/api/valrep/broker`, params, options).subscribe((response : any) => {
      //   this.brokerList = [];
      //   if(response.data.status){
      //     for(let i = 0; i < response.data.list.length; i++){
      //         this.brokerList.push({ id: response.data.list[i].ctipodocidentidad, value: response.data.list[i].xtipodocidentidad });
      //     }
      //   }
      // },
      //   (err) => {
      //   let code = err.error.data.code;
      //   let message;
      //   if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      //   else if(code == 404){ message = "HTTP.ERROR.VALREP.DOCUMENTTYPENOTFOUND"; }
      //   else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      //   this.alert.message = message;
      //   this.alert.type = 'danger';
      //   this.alert.show = true;
      // });
    }
  }

  onSubmit(form){
    this.submitted = true;
    this.loading = true;
    if (this.popup_form.invalid) {
      this.loading = false;
      return;
    }
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cpais: this.broker.cpais,
      ccompania: this.broker.ccompania,
    }
    this.http.post(`${environment.apiUrl}/api/user/search/broker`, params, options).subscribe((response : any) => {
      if(response.data.status){
        this.brokerList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.brokerList.push({ 
            ccorredor: response.data.list[i].ccorredor,
            xcorredor: response.data.list[i].xcorredor
          });
        }
      }
      this.loading = false;
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.USERS.PROVIDERNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
    });
  }

  rowClicked(event: any){
    this.broker.ccorredor = event.data.ccorredor;
    this.broker.xcorredor = event.data.xcorredor;
    this.activeModal.close(this.broker);
  }

}
