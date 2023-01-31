import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-fleet-contract-management-vehicle',
  templateUrl: './fleet-contract-management-vehicle.component.html',
  styleUrls: ['./fleet-contract-management-vehicle.component.css']
})
export class FleetContractManagementVehicleComponent implements OnInit {

  @Input() public vehicle;
  currentUser;
  popup_form: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  vehicleList: any[] = [];
  brandList: any[] = [];
  modelList: any[] = [];
  versionList: any[] = [];
  alert = { show : false, type : "", message : "" }

  constructor(public activeModal: NgbActiveModal,
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      xplaca: [''],
      cmarca: [''],
      cmodelo: [''],
      cversion: [''],
      xserialcarroceria: [''],
      xserialmotor: ['']
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cpais: this.currentUser.data.cpais
      };
      this.http.post(`${environment.apiUrl}/api/valrep/brand`, params, options).subscribe((response : any) => {
        if(response.data.status){
          for(let i = 0; i < response.data.list.length; i++){
            this.brandList.push({ id: response.data.list[i].cmarca, value: response.data.list[i].xmarca });
          }
          this.brandList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.BRANDNOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
    }
  }

  modelDropdownDataRequest(){
    if(this.popup_form.get('cmarca').value){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cpais: this.currentUser.data.cpais,
        cmarca: this.popup_form.get('cmarca').value,
        ccliente: this.vehicle.ccliente
      }
      this.http.post(`${environment.apiUrl}/api/valrep/client/available-model`, params, options).subscribe((response : any) => {
        if(response.data.status){
          this.modelList = [];
          for(let i = 0; i < response.data.list.length; i++){
            this.modelList.push({ id: response.data.list[i].cmodelo, value: response.data.list[i].xmodelo });
          }
          this.modelList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.MODELNOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
    }
  }

  versionDropdownDataRequest(){
    if(this.popup_form.get('cmarca').value && this.popup_form.get('cmodelo').value){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cpais: this.currentUser.data.cpais,
        cmarca: this.popup_form.get('cmarca').value,
        cmodelo: this.popup_form.get('cmodelo').value
      }
      this.http.post(`${environment.apiUrl}/api/valrep/version`, params, options).subscribe((response : any) => {
        if(response.data.status){
          this.versionList = [];
          for(let i = 0; i < response.data.list.length; i++){
            this.versionList.push({ id: response.data.list[i].cversion, value: response.data.list[i].xversion });
          }
          this.versionList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.VERSIONNOTFOUND"; }
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
      cpropietario: this.vehicle.cpropietario,
      ccliente: this.vehicle.ccliente,
      xplaca: form.xplaca ? form.xplaca : undefined,
      cmarca: form.cmarca ? form.cmarca : undefined,
      cmodelo: form.cmodelo ? form.cmodelo : undefined,
      cversion: form.cversion ? form.cversion : undefined,
      xserialcarroceria: form.xserialcarroceria ? form.xserialcarroceria : undefined,
      xserialmotor: form.xserialmotor ? form.xserialmotor : undefined
    }
    this.http.post(`${environment.apiUrl}/api/fleet-contract-management/search/owner/vehicle`, params, options).subscribe((response : any) => {
      if(response.data.status){
        this.vehicleList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.vehicleList.push({ 
            cvehiculopropietario: response.data.list[i].cvehiculopropietario,
            xmarca: response.data.list[i].xmarca,
            xmodelo: response.data.list[i].xmodelo,
            xversion: response.data.list[i].xversion,
            xplaca: response.data.list[i].xplaca,
            fano: response.data.list[i].fano,
            xcolor: response.data.list[i].xcolor,
            xserialcarroceria: response.data.list[i].xserialcarroceria,
            xserialmotor: response.data.list[i].xserialmotor,
            ctipovehiculo: response.data.list[i].ctipovehiculo,
            mpreciovehiculo: response.data.list[i].mpreciovehiculo
          });
        }
      }
      this.loading = false;
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.FLEETCONTRACTSMANAGEMENT.VEHICLENOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
    });
  }

  rowClicked(event: any){
    this.vehicle.cvehiculopropietario = event.data.cvehiculopropietario;
    this.vehicle.xmarca = event.data.xmarca;
    this.vehicle.xmodelo = event.data.xmodelo;
    this.vehicle.xversion = event.data.xversion;
    this.vehicle.xplaca = event.data.xplaca;
    this.vehicle.fano = event.data.fano;
    this.vehicle.xcolor = event.data.xcolor;
    this.vehicle.xserialcarroceria = event.data.xserialcarroceria;
    this.vehicle.xserialmotor = event.data.xserialmotor;
    this.vehicle.ctipovehiculo = event.data.ctipovehiculo;
    this.vehicle.mpreciovehiculo = event.data.mpreciovehiculo;
    this.activeModal.close(this.vehicle);
  }

}
