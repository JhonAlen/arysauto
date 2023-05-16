import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';
import { NotificationQuoteRequestDetailComponent } from '@app/pop-up/notification-quote-request-detail/notification-quote-request-detail.component';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-notification-quote-request-index',
  templateUrl: './notification-quote-request-index.component.html',
  styleUrls: ['./notification-quote-request-index.component.css']
})
export class NotificationQuoteRequestIndexComponent implements OnInit {

  @Input() public quote;
  currentUser;
  popup_form : UntypedFormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  quoteRequestList: any[] = [];

  constructor(public activeModal: NgbActiveModal, 
              private formBuilder: UntypedFormBuilder, 
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private router: Router,
              private modalService : NgbModal) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      fcreacion: ['']
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 76
      }
      this.http.post(`${environment.apiUrl}/api/security/verify-module-permission`, params, options).subscribe((response : any) => {
        if(response.data.status){
          if(!response.data.bindice){
            this.router.navigate([`/No posees permiso`]);
          }
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 401){
          let condition = err.error.data.condition;
          if(condition == 'user-dont-have-permissions'){ this.router.navigate([`/permission-error`]); }
        }else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
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
      cproveedor: this.quote.cproveedor,
      fcreacion: form.fcreacion ? new Date(form.fcreacion).toUTCString() : undefined
    }
    this.http.post(`${environment.apiUrl}/api/notification/search-quote-request`, params, options).subscribe((response : any) => {
      if(response.data.status){
        this.quoteRequestList = [];
        for(let i = 0; i < response.data.list.length; i++){
          let date;
          if(response.data.list[i].fcreacion){
            let dateFormat = new Date(response.data.list[i].fcreacion);
            date = `${dateFormat.getFullYear()}-${('0' + (dateFormat.getMonth() + 1)).slice(-2)}-${('0' + dateFormat.getDate()).slice(-2)}`
          }
          this.quoteRequestList.push({ 
            cproveedor: response.data.list[i].cproveedor,
            ccotizacion: response.data.list[i].ccotizacion,
            fcreacion: date,
            xobservacion: response.data.list[i].xobservacion,
            xcerrada: response.data.list[i].bcerrada
          });
        }
      }
      this.loading = false;
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.FLEETCONTRACTSMANAGEMENT.FLEETCONTRACTNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
    });
  }

  rowClicked(event: any){
    let quote2 = { ccotizacion: event.data.ccotizacion, xobservacion: event.data.xobservacion, cproveedor: event.data.cproveedor}
    const modalRef = this.modalService.open(NotificationQuoteRequestDetailComponent, { size: 'xl' });
    modalRef.componentInstance.quote2 = quote2;
    modalRef.result.then((result: any) => {
      if(result){
        this.quote.repuestos = result
        this.activeModal.close(this.quote);
      }
    });
  }

}
