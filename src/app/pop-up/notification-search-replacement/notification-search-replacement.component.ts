import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { NotificationReplacementComponent } from '@app/pop-up/notification-replacement/notification-replacement.component';
import { NotificationThirdpartyVehicleReplacementComponent } from '@app/pop-up/notification-thirdparty-vehicle-replacement/notification-thirdparty-vehicle-replacement.component';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-notification-search-replacement',
  templateUrl: './notification-search-replacement.component.html',
  styleUrls: ['./notification-search-replacement.component.css']
})
export class NotificationSearchReplacementComponent implements OnInit {

  @Input() public replacement;
  currentUser;
  popup_form: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  replacementList: any[] = [];
  replacementTypeList: any[] = [];
  alert = { show : false, type : "", message : "" }

  constructor(public activeModal: NgbActiveModal,
              private modalService: NgbModal,
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private formBuilder: UntypedFormBuilder,
              private translate: TranslateService) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      ctiporepuesto: [''],
      xrepuesto: [''],
      bizquierda: [false],
      bderecha: [false],
      bsuperior: [false],
      binferior: [false],
      bdelantero: [false],
      btrasero: [false]
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania
      };
      this.http.post(`${environment.apiUrl}/api/valrep/replacement-type`, params, options).subscribe((response : any) => {
        if(response.data.status){
          for(let i = 0; i < response.data.list.length; i++){
            this.replacementTypeList.push({ id: response.data.list[i].ctiporepuesto, value: response.data.list[i].xtiporepuesto });
          }
          this.replacementTypeList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.REPLACEMENTTYPENOTFOUND"; }
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
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania,
      ctiporepuesto: form.ctiporepuesto ? form.ctiporepuesto : undefined,
      xrepuesto: form.xrepuesto ? form.xrepuesto : undefined,
      bizquierda: form.bizquierda ? form.bizquierda : undefined,
      bderecha: form.bderecha ? form.bderecha : undefined,
      bsuperior: form.bsuperior ? form.bsuperior : undefined,
      binferior: form.binferior ? form.binferior : undefined,
      bdelantero: form.bdelantero ? form.bdelantero : undefined,
      btrasero: form.btrasero ? form.btrasero : undefined
    }
    this.http.post(`${environment.apiUrl}/api/notification/search/replacement`, params, options).subscribe((response : any) => {
      if(response.data.status){
        this.replacementList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.replacementList.push({ 
            crepuesto: response.data.list[i].crepuesto,
            xrepuesto: response.data.list[i].xrepuesto,
            ctiporepuesto: response.data.list[i].ctiporepuesto,
            xtiporepuesto: response.data.list[i].xtiporepuesto,
            xactivo: response.data.list[i].bactivo ? this.translate.instant("DROPDOWN.YES") : this.translate.instant("DROPDOWN.NO")
          });
        }
      }
      this.loading = false;
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.NOTIFICATIONS.REPLACEMENTNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
    });
  }

  rowClicked(event: any){
    let replacementReturn = { 
      type: 3,
      ctiporepuesto: event.data.ctiporepuesto,
      crepuesto: event.data.crepuesto
    };
    let modalRef;
    if(this.replacement.from == 1){
      modalRef = this.modalService.open(NotificationReplacementComponent);
    }else if(this.replacement.from == 2){
      modalRef = this.modalService.open(NotificationThirdpartyVehicleReplacementComponent);
    }
    modalRef.componentInstance.replacement = replacementReturn;
    modalRef.result.then((result: any) => { 
      if(result){
        if(result.type == 3){
          this.replacement.type = 3;
          this.replacement.crepuesto = result.crepuesto;
          this.replacement.xrepuesto = result.xrepuesto;
          this.replacement.ctiporepuesto = result.ctiporepuesto;
          this.replacement.ncantidad = result.ncantidad;
          this.replacement.cniveldano = result.cniveldano;
          this.activeModal.close(this.replacement);
        }
      }
    });
  }

}
