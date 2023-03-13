import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-tracing-index',
  templateUrl: './tracing-index.component.html',
  styleUrls: ['./tracing-index.component.css']
})
export class TracingIndexComponent implements OnInit {

  currentUser;
  search_form : UntypedFormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  fleetNotificationTracingList: any[] = [];
  fleetNotificationThirdpartyTracingList: any[] = [];
  clubServiceRequestTracingList: any[] = [];

  constructor(private formBuilder: UntypedFormBuilder, 
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private router: Router,
              private translate: TranslateService) { }

  ngOnInit(): void {
    this.search_form = this.formBuilder.group({
      btodos: [true]
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 91
      }
      this.http.post(`${environment.apiUrl}/api/security/verify-module-permission`, params, options).subscribe((response : any) => {
        if(response.data.status){
          if(!response.data.bindice){
            this.router.navigate([`/permission-error`]);
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
    if (this.search_form.invalid) {
      this.loading = false;
      return;
    }
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      permissionData: {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 91
      },
      //cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania,
      cusuario: this.currentUser.data.cusuario,
      btodos: form.btodos ? form.btodos : undefined,
    }
    console.log(params);
    console.log('hola');
    this.http.post(`${environment.apiUrl}/api/v2/tracing/production/search`, params, options).subscribe((response : any) => {
      console.log('si paso');
      if(response.data.status){
        console.log(response.data);
        this.fleetNotificationTracingList = [];
        for(let i = 0; i < response.data.fleetNotificationTracings.length; i++){
          let dateFormat = new Date(response.data.fleetNotificationTracings[i].fseguimientonotificacion);
          let dayFormat = `${dateFormat.getFullYear()}-${("0" + (dateFormat.getMonth() + 1)).slice(-2)}-${("0" + dateFormat.getDate()).slice(-2)}`;
          let timeFormat = `${("0" + dateFormat.getHours()).slice(-2)}:${("0" + dateFormat.getMinutes()).slice(-2)}`;
          this.fleetNotificationTracingList.push({
            cgrid: i,
            create: false,
            cnotificacion: response.data.fleetNotificationTracings[i].cnotificacion,
            cseguimientonotificacion: response.data.fleetNotificationTracings[i].cseguimientonotificacion,
            ctiposeguimiento: response.data.fleetNotificationTracings[i].ctiposeguimiento,
            xtiposeguimiento: response.data.fleetNotificationTracings[i].xtiposeguimiento,
            cmotivoseguimiento: response.data.fleetNotificationTracings[i].cmotivoseguimiento,
            xmotivoseguimiento: response.data.fleetNotificationTracings[i].xmotivoseguimiento,
            fdia: dayFormat,
            fhora: timeFormat,
            fseguimientonotificacion: dateFormat,
            bcerrado: response.data.fleetNotificationTracings[i].bcerrado ? response.data.fleetNotificationTracings[i].bcerrado : false,
            xcerrado: response.data.fleetNotificationTracings[i].bcerrado ? this.translate.instant("DROPDOWN.CLOSE") : this.translate.instant("DROPDOWN.OPEN"),
            xobservacion: response.data.fleetNotificationTracings[i].xobservacion
          });
        }
        this.fleetNotificationThirdpartyTracingList = [];
        for(let i = 0; i < response.data.fleetNotificationThirdpartyTracings.length; i++){
          let dateFormat = new Date(response.data.fleetNotificationThirdpartyTracings[i].fseguimientotercero);
          let dayFormat = `${dateFormat.getFullYear()}-${("0" + (dateFormat.getMonth() + 1)).slice(-2)}-${("0" + dateFormat.getDate()).slice(-2)}`;
          let timeFormat = `${("0" + dateFormat.getHours()).slice(-2)}:${("0" + dateFormat.getMinutes()).slice(-2)}`;
          this.fleetNotificationThirdpartyTracingList.push({
            cgrid: i,
            create: false,
            cnotificacion: response.data.fleetNotificationThirdpartyTracings[i].cnotificacion,
            cseguimientotercero: response.data.fleetNotificationThirdpartyTracings[i].cseguimientotercero,
            xnombre: response.data.fleetNotificationThirdpartyTracings[i].xnombre,
            xapellido: response.data.fleetNotificationThirdpartyTracings[i].xapellido,
            ctiposeguimiento: response.data.fleetNotificationThirdpartyTracings[i].ctiposeguimiento,
            xtiposeguimiento: response.data.fleetNotificationThirdpartyTracings[i].xtiposeguimiento,
            cmotivoseguimiento: response.data.fleetNotificationThirdpartyTracings[i].cmotivoseguimiento,
            xmotivoseguimiento: response.data.fleetNotificationThirdpartyTracings[i].xmotivoseguimiento,
            fdia: dayFormat,
            fhora: timeFormat,
            fseguimientotercero: dateFormat,
            bcerrado: response.data.fleetNotificationThirdpartyTracings[i].bcerrado ? response.data.fleetNotificationThirdpartyTracings[i].bcerrado : false,
            xcerrado: response.data.fleetNotificationThirdpartyTracings[i].bcerrado ? this.translate.instant("DROPDOWN.CLOSE") : this.translate.instant("DROPDOWN.OPEN"),
            xobservacion: response.data.fleetNotificationThirdpartyTracings[i].xobservacion
          });
        }
        this.clubServiceRequestTracingList = [];
        for(let i = 0; i < response.data.clubServiceRequestTracings.length; i++){
          let dateFormat = new Date(response.data.clubServiceRequestTracings[i].fseguimientosolicitudservicio);
          let dayFormat = `${dateFormat.getFullYear()}-${("0" + (dateFormat.getMonth() + 1)).slice(-2)}-${("0" + dateFormat.getDate()).slice(-2)}`;
          let timeFormat = `${("0" + dateFormat.getHours()).slice(-2)}:${("0" + dateFormat.getMinutes()).slice(-2)}`;
          this.clubServiceRequestTracingList.push({
            cgrid: i,
            create: false,
            csolicitudservicio: response.data.clubServiceRequestTracings[i].csolicitudservicio,
            cseguimientosolicitudservicio: response.data.clubServiceRequestTracings[i].cseguimientosolicitudservicio,
            ctiposeguimiento: response.data.clubServiceRequestTracings[i].ctiposeguimiento,
            xtiposeguimiento: response.data.clubServiceRequestTracings[i].xtiposeguimiento,
            cmotivoseguimiento: response.data.clubServiceRequestTracings[i].cmotivoseguimiento,
            xmotivoseguimiento: response.data.clubServiceRequestTracings[i].xmotivoseguimiento,
            fdia: dayFormat,
            fhora: timeFormat,
            fseguimientosolicitudservicio: dateFormat,
            bcerrado: response.data.clubServiceRequestTracings[i].bcerrado ? response.data.clubServiceRequestTracings[i].bcerrado : false,
            xcerrado: response.data.clubServiceRequestTracings[i].bcerrado ? this.translate.instant("DROPDOWN.CLOSE") : this.translate.instant("DROPDOWN.OPEN"),
            xobservacion: response.data.clubServiceRequestTracings[i].xobservacion
          });
        }
      }
      this.loading = false;
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.CLUBCONTRACTSMANAGEMENT.CLUBCONTRACTNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
    });
  }

  fleetNotificationTracingRowClicked(event: any){
    this.router.navigate([`events/notification-detail/${event.data.cnotificacion}`]);
  }

  fleetNotificationThirdpartyTracingRowClicked(event: any){
    this.router.navigate([`events/notification-detail/${event.data.cnotificacion}`]);
  }

  clubServiceRequestTracingRowClicked(event: any){
    this.router.navigate([`events/service-request-detail/${event.data.csolicitudservicio}`]);
  }

}
