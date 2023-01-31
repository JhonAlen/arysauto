import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-notification-search-existent-replacement',
  templateUrl: './notification-search-existent-replacement.component.html',
  styleUrls: ['./notification-search-existent-replacement.component.css']
})
export class NotificationSearchExistentReplacementComponent implements OnInit {

  @Input() public replacement;
  currentUser;
  submitted: boolean = false;
  loading: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  vehicleReplacementList: any[] = [];
  thirdpartyVehicleReplacementList: any[] = [];
  alert = { show : false, type : "", message : "" }

  constructor(public activeModal: NgbActiveModal,
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private translate: TranslateService) { }

  ngOnInit(): void {
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania,
        cnotificacion: this.replacement.cnotificacion
      };
      this.http.post(`${environment.apiUrl}/api/notification/search/existent-replacement`, params, options).subscribe((response : any) => {
        if(response.data.status){
          if(response.data.replacements){
            this.vehicleReplacementList = [];
            for(let i = 0; i < response.data.replacements.length; i++){
              this.vehicleReplacementList.push({
                cgrid: i,
                create: false,
                crepuesto: response.data.replacements[i].crepuesto,
                xrepuesto: response.data.replacements[i].xrepuesto,
                ctiporepuesto: response.data.replacements[i].ctiporepuesto,
                xtiporepuesto: response.data.replacements[i].xtiporepuesto,
                ncantidad: response.data.replacements[i].ncantidad,
                cniveldano: response.data.replacements[i].cniveldano,
                xniveldano: response.data.replacements[i].xniveldano
              });
            }
          }
          if(response.data.thirdpartyReplacements){
            this.thirdpartyVehicleReplacementList = [];
            for(let i = 0; i < response.data.thirdpartyReplacements.length; i++){
              this.thirdpartyVehicleReplacementList.push({
                cgrid: i,
                create: false,
                crepuesto: response.data.thirdpartyReplacements[i].crepuesto,
                xrepuesto: response.data.thirdpartyReplacements[i].xrepuesto,
                ctiporepuesto: response.data.thirdpartyReplacements[i].ctiporepuesto,
                xtiporepuesto: response.data.thirdpartyReplacements[i].xtiporepuesto,
                ncantidad: response.data.thirdpartyReplacements[i].ncantidad,
                cniveldano: response.data.thirdpartyReplacements[i].cniveldano,
                xniveldano: response.data.thirdpartyReplacements[i].xniveldano
              });
            }
          }
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.NOTIFICATIONS.NOTIFICATIONNOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
    }
  }

  rowClicked(event: any){
    this.replacement.type = 3;
    this.replacement.crepuesto = event.data.crepuesto;
    this.replacement.xrepuesto = event.data.xrepuesto;
    this.replacement.ctiporepuesto = event.data.ctiporepuesto;
    this.replacement.xtiporepuesto = event.data.xtiporepuesto;
    this.replacement.ncantidad = event.data.ncantidad;
    this.replacement.cniveldano = event.data.cniveldano;
    this.replacement.xniveldano = event.data.xniveldano;
    this.activeModal.close(this.replacement);
  }

}
