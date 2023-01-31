import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-notification-thirdparty-vehicle-replacement',
  templateUrl: './notification-thirdparty-vehicle-replacement.component.html',
  styleUrls: ['./notification-thirdparty-vehicle-replacement.component.css']
})
export class NotificationThirdpartyVehicleReplacementComponent implements OnInit {

  @Input() public replacement;
  currentUser;
  popup_form: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  replacementTypeList: any[] = [];
  replacementList: any[] = [];
  damageLevelList: any[] = [];
  alert = { show : false, type : "", message : "" }

  constructor(public activeModal: NgbActiveModal,
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      ctiporepuesto: ['', Validators.required],
      crepuesto: ['', Validators.required],
      ncantidad: ['', Validators.required],
      cniveldano: ['', Validators.required]
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
      this.http.post(`${environment.apiUrl}/api/valrep/damage-level`, params, options).subscribe((response : any) => {
        if(response.data.status){
          for(let i = 0; i < response.data.list.length; i++){
            this.damageLevelList.push({ id: response.data.list[i].cniveldano, value: response.data.list[i].xniveldano });
          }
          this.damageLevelList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.DAMAGELEVELNOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
      if(this.replacement){
        if(this.replacement.type == 3){
          this.popup_form.get('ctiporepuesto').setValue(this.replacement.ctiporepuesto);
          this.popup_form.get('ctiporepuesto').disable();
          this.replacementDropdownDataRequest();
          this.popup_form.get('crepuesto').setValue(this.replacement.crepuesto);
          this.popup_form.get('crepuesto').disable();
          this.canSave = true;
        }else if(this.replacement.type == 2){
          this.popup_form.get('ctiporepuesto').setValue(this.replacement.ctiporepuesto);
          this.popup_form.get('ctiporepuesto').disable();
          this.replacementDropdownDataRequest();
          this.popup_form.get('crepuesto').setValue(this.replacement.crepuesto);
          this.popup_form.get('crepuesto').disable();
          this.popup_form.get('ncantidad').setValue(this.replacement.ncantidad);
          this.popup_form.get('ncantidad').disable();
          this.popup_form.get('cniveldano').setValue(this.replacement.cniveldano);
          this.popup_form.get('cniveldano').disable();
          this.canSave = false;
        }else if(this.replacement.type == 1){
          this.popup_form.get('ctiporepuesto').setValue(this.replacement.ctiporepuesto);
          this.replacementDropdownDataRequest();
          this.popup_form.get('crepuesto').setValue(this.replacement.crepuesto);
          this.popup_form.get('ncantidad').setValue(this.replacement.ncantidad);
          this.popup_form.get('cniveldano').setValue(this.replacement.cniveldano);
          this.canSave = true;
          this.isEdit = true;
        }
      }
    }
  }

  replacementDropdownDataRequest(){
    if(this.popup_form.get('ctiporepuesto').value){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania,
        ctiporepuesto: this.popup_form.get('ctiporepuesto').value
      }
      this.http.post(`${environment.apiUrl}/api/valrep/replacement`, params, options).subscribe((response : any) => {
        if(response.data.status){
          this.replacementList = [];
          for(let i = 0; i < response.data.list.length; i++){
            this.replacementList.push({ id: response.data.list[i].crepuesto, value: response.data.list[i].xrepuesto });
          }
          this.replacementList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.REPLACEMENTNOTFOUND"; }
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
    let replacementFilter = this.replacementList.filter((option) => { return option.id == this.popup_form.get('crepuesto').value; });
    this.replacement.ctiporepuesto = this.popup_form.get('ctiporepuesto').value;
    this.replacement.crepuesto = this.popup_form.get('crepuesto').value;
    this.replacement.xrepuesto = replacementFilter[0].value;
    this.replacement.ncantidad = form.ncantidad;
    this.replacement.cniveldano = form.cniveldano;
    this.activeModal.close(this.replacement);
  }

  deleteReplacement(){
    this.replacement.type = 4;
    if(!this.replacement.create){
      this.replacement.delete = true;
    }
    this.activeModal.close(this.replacement);
  }

}
