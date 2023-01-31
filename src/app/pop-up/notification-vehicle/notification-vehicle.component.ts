import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-notification-vehicle',
  templateUrl: './notification-vehicle.component.html',
  styleUrls: ['./notification-vehicle.component.css']
})
export class NotificationVehicleComponent implements OnInit {

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
      cmarca: [''],
      cmodelo: [''],
      cversion: [''],
      xversion: [''],
      xplaca: [''],
      xestatusgeneral: [''],
      cestatusgeneral: [''],
      xpropietario: ['']
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
        cmarca: this.popup_form.get('cmarca').value
      }
      this.http.post(`${environment.apiUrl}/api/valrep/model`, params, options).subscribe((response : any) => {
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
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania,
      cmarca: form.cmarca ? form.cmarca : undefined,
      cmodelo: form.cmodelo ? form.cmodelo : undefined,
      cversion: form.cversion ? form.cversion : undefined,
      xplaca: form.xplaca ? form.xplaca : undefined
    }
    this.http.post(`${environment.apiUrl}/api/notification/search/contract/vehicle`, params, options).subscribe((response : any) => {
      if(response.data.status){
        this.vehicleList = [];
        for(let i = 0; i < response.data.list.length; i++){
          if (response.data.list[i].fdesde_pol) {
            console.log(response.data.list[i].fdesde_pol);
          }
          this.vehicleList.push({ 
            ccontratoflota: response.data.list[i].ccontratoflota,
            xcliente: response.data.list[i].xcliente,
            xestatusgeneral: response.data.list[i].xestatusgeneral,
            cestatusgeneral: response.data.list[i].cestatusgeneral,
            fdesde_pol: response.data.list[i].fdesde_pol,
            fhasta_pol: response.data.list[i].fhasta_pol,
            xmarca: response.data.list[i].xmarca,
            xmodelo: response.data.list[i].xmodelo,
            xversion: response.data.list[i].xversion,
            xtipo: response.data.list[i].xtipo,
            xplaca: response.data.list[i].xplaca,
            fano: response.data.list[i].fano,
            xcolor: response.data.list[i].xcolor,
            xserialcarroceria: response.data.list[i].xserialcarroceria,
            xserialmotor: response.data.list[i].xserialmotor,
            xnombrepropietario: response.data.list[i].xnombrepropietario,
            xapellidopropietario: response.data.list[i].xapellidopropietario,
            xdocidentidadpropietario: response.data.list[i].xdocidentidadpropietario,
            xdireccionpropietario: response.data.list[i].xdireccionpropietario,
            xtelefonocelularpropietario: response.data.list[i].xtelefonocelularpropietario,
            xemailpropietario: response.data.list[i].xemailpropietario,
            xpropietario: response.data.list[i].xpropietario
          });
        }
        console.log(this.vehicleList)
      }
      this.loading = false;
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.NOTIFICATIONS.VEHICLENOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
    });
  }

  rowClicked(event: any){
    this.vehicle.ccontratoflota = event.data.ccontratoflota;
    this.vehicle.xcliente = event.data.xcliente;
    this.vehicle.fdesde_pol = event.data.fdesde_pol;
    this.vehicle.fhasta_pol = event.data.fhasta_pol;
    this.vehicle.xmarca = event.data.xmarca;
    this.vehicle.xmodelo = event.data.xmodelo;
    this.vehicle.xtipo = event.data.xtipo;
    this.vehicle.xplaca = event.data.xplaca;
    this.vehicle.fano = event.data.fano;
    this.vehicle.xcolor = event.data.xcolor;
    this.vehicle.xserialcarroceria = event.data.xserialcarroceria;
    this.vehicle.xserialmotor = event.data.xserialmotor;
    this.vehicle.xnombrepropietario = event.data.xnombrepropietario;
    this.vehicle.xapellidopropietario = event.data.xapellidopropietario;
    this.vehicle.xdocidentidadpropietario = event.data.xdocidentidadpropietario;
    this.vehicle.xdireccionpropietario = event.data.xdireccionpropietario;
    this.vehicle.xtelefonocelularpropietario = event.data.xtelefonocelularpropietario;
    this.vehicle.xemailpropietario = event.data.xemailpropietario;
    this.vehicle.cestatusgeneral = event.data.cestatusgeneral;
    this.vehicle.xestatusgeneral = event.data.xestatusgeneral;
    this.activeModal.close(this.vehicle);
  }

}
