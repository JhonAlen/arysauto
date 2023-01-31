import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-cause-for-cancellation',
  templateUrl: './cause-for-cancellation.component.html',
  styleUrls: ['./cause-for-cancellation.component.css']
})
export class CauseForCancellationComponent implements OnInit {

  @Input() public cancellation;
  sub;
  currentUser;
  popup_form: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  loading_cancel: boolean = false;
  canSave: boolean = false;
  code;
  causeCancellationList: any[] = [];
  alert = { show : false, type : "", message : "" }
  keyword = 'value'

  constructor(public activeModal: NgbActiveModal,
    private authenticationService : AuthenticationService,
    private http: HttpClient,
    private formBuilder: UntypedFormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      ccausaanulacion: [''],
      xobservacion: [''],
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 115
      }
      this.http.post(`${environment.apiUrl}/api/security/verify-module-permission`, params, options).subscribe((response : any) => {
        if(response.data.status){
          this.initializeDetailModule();
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 401){
        }else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
    }
  }

  initializeDetailModule(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania
    }
    this.keyword;
    this.http.post(`${environment.apiUrl}/api/valrep/cancellation-cause`, params, options).subscribe((response: any) => {
      if(response.data.list){
        for(let i = 0; i < response.data.list.length; i++){
          this.causeCancellationList.push({ 
            id: response.data.list[i].ccausaanulacion, 
            value: response.data.list[i].xcausaanulacion
          })
        }
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "No se encontraron Daños"; }
      //else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'primary';
      this.alert.show = true;
    });
  }

  codeSelected(event){
    this.popup_form.get('ccausaanulacion').setValue(event.id)

    if(this.popup_form.get('ccausaanulacion').value){
      this.canSave = true;
    }
  }

  onSubmit(form){
    this.submitted = true;
    this.loading = true;

    this.cancellation.ccausaanulacion = form.ccausaanulacion;

    if(this.popup_form.get('xobservacion').value){
      this.cancellation.xobservacion = this.popup_form.get('xobservacion').value;
    }else{
      this.cancellation.xobservacion = "Sin observación"
    }
    
    this.activeModal.close(this.cancellation);

  }
}
