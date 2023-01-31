import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { NotificationProviderComponent } from '@app/pop-up/notification-provider/notification-provider.component';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';


@Component({
  selector: 'app-notification-search-provider',
  templateUrl: './notification-search-provider.component.html',
  styleUrls: ['./notification-search-provider.component.css']
})
export class NotificationSearchProviderComponent implements OnInit {

  @Input() public provider;
  currentUser;
  popup_form: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  providerList: any[] = [];
  documentTypeList: any[] = [];
  alert = { show : false, type : "", message : "" }

  constructor(public activeModal: NgbActiveModal,
              private modalService: NgbModal,
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private formBuilder: UntypedFormBuilder,
              private translate: TranslateService) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      //ctipodocidentidad: [''],
      //xdocidentidad: [''],
      xtelefonoproveedor:[''],
      xnombre: [''],
      xrazonsocial: ['']
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania
      };
      this.http.post(`${environment.apiUrl}/api/valrep/service-providers`, params, options).subscribe((response : any) => {
        if(response.data.status){
          for(let i = 0; i < response.data.list.length; i++){
            this.documentTypeList.push({ id: response.data.list[i].cservicio, value: response.data.list[i].xservicio, xtelefonoproveedor: response.data.list[i].xtelefonoproveedor });
          }
          this.documentTypeList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.DOCUMENTTYPENOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
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
      ccompania: this.currentUser.data.ccompania,
      cproveedor: this.provider.cproveedor,
      // xservicio: form.xservicio ? form.xservicio : undefined,
      xnombre: form.xnombre ? form.xnombre : undefined
    }
    this.http.post(`${environment.apiUrl}/api/notification/search/provider`, params, options).subscribe((response : any) => {
      if(response.data.status){
        this.providerList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.providerList.push({ 
            cproveedor: response.data.list[i].cproveedor,
            xdocidentidad: response.data.list[i].xdocidentidad,
            xnombre: response.data.list[i].xnombre,
            xtelefonoproveedor: response.data.list[i].xtelefonoproveedor
          });
        }
      }
      this.loading = false;
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.NOTIFICATIONS.PROVIDERNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
    });
  }

  rowClicked(event: any){
    let providerReturn = { 
      type: 3,
      cproveedor: event.data.cproveedor,
      cnotificacion: this.provider.cnotificacion
    };
    const modalRef = this.modalService.open(NotificationProviderComponent, { size: 'xl' });
    modalRef.componentInstance.provider = providerReturn;
    modalRef.result.then((result: any) => { 
      if(result){
        if(result.type == 3){
          this.provider.type = 3;
          this.provider.cproveedor = result.cproveedor;
          this.provider.xnombre = result.xnombre;
          this.provider.xobservacion = result.xobservacion;
          this.provider.replacements = result.replacements;
          this.provider.replacementsResult = result.replacementsResult;
          this.activeModal.close(this.provider);
        }
      }
    });
  }

}
