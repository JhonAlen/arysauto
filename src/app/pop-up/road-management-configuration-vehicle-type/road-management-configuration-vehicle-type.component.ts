import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-road-management-configuration-vehicle-type',
  templateUrl: './road-management-configuration-vehicle-type.component.html',
  styleUrls: ['./road-management-configuration-vehicle-type.component.css']
})
export class RoadManagementConfigurationVehicleTypeComponent implements OnInit {

  @Input() public vehicleType;
  currentUser;
  popup_form: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  vehicleTypeList: any[] = [];
  alert = { show : false, type : "", message : "" }

  constructor(public activeModal: NgbActiveModal,
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      ctipovehiculo: ['', Validators.required],
      fefectiva: ['', Validators.required],
      mtipovehiculoconfiguraciongestionvial: ['', Validators.required],
      nlimiteano: ['', Validators.required],
      mmayorlimiteano: ['', Validators.required]
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cpais: this.currentUser.data.cpais
      };
      this.http.post(`${environment.apiUrl}/api/valrep/vehicle-type`, params, options).subscribe((response : any) => {
        if(response.data.status){
          for(let i = 0; i < response.data.list.length; i++){
            this.vehicleTypeList.push({ id: response.data.list[i].ctipovehiculo, value: response.data.list[i].xtipovehiculo });
          }
          this.vehicleTypeList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.VEHICLETYPENOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
      if(this.vehicleType){
        if(this.vehicleType.type == 3){
          this.canSave = true;
        }else if(this.vehicleType.type == 2){
          this.popup_form.get('ctipovehiculo').setValue(this.vehicleType.ctipovehiculo);
          this.popup_form.get('ctipovehiculo').disable();
          this.popup_form.get('fefectiva').setValue(this.vehicleType.fefectiva);
          this.popup_form.get('fefectiva').disable();
          this.popup_form.get('mtipovehiculoconfiguraciongestionvial').setValue(this.vehicleType.mtipovehiculoconfiguraciongestionvial);
          this.popup_form.get('mtipovehiculoconfiguraciongestionvial').disable();
          this.popup_form.get('nlimiteano').setValue(this.vehicleType.nlimiteano);
          this.popup_form.get('nlimiteano').disable();
          this.popup_form.get('mmayorlimiteano').setValue(this.vehicleType.mmayorlimiteano);
          this.popup_form.get('mmayorlimiteano').disable();
          this.canSave = false;
        }else if(this.vehicleType.type == 1){
          this.popup_form.get('ctipovehiculo').setValue(this.vehicleType.ctipovehiculo);
          this.popup_form.get('fefectiva').setValue(this.vehicleType.fefectiva);
          this.popup_form.get('mtipovehiculoconfiguraciongestionvial').setValue(this.vehicleType.mtipovehiculoconfiguraciongestionvial);
          this.popup_form.get('nlimiteano').setValue(this.vehicleType.nlimiteano);
          this.popup_form.get('mmayorlimiteano').setValue(this.vehicleType.mmayorlimiteano);
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
    let vehicleTypeFilter = this.vehicleTypeList.filter((option) => { return option.id == form.ctipovehiculo; });
    this.vehicleType.ctipovehiculo = form.ctipovehiculo;
    this.vehicleType.xtipovehiculo = vehicleTypeFilter[0].value;
    this.vehicleType.fefectiva = form.fefectiva;
    this.vehicleType.mtipovehiculoconfiguraciongestionvial = form.mtipovehiculoconfiguraciongestionvial;
    this.vehicleType.nlimiteano = form.nlimiteano;
    this.vehicleType.mmayorlimiteano = form.mmayorlimiteano;
    this.activeModal.close(this.vehicleType);
  }

  deleteVehicleType(){
    this.vehicleType.type = 4;
    if(!this.vehicleType.create){
      this.vehicleType.delete = true;
    }
    this.activeModal.close(this.vehicleType);
  }

}
