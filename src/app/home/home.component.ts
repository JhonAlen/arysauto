import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { AdministrationPaymentComponent } from '@app/pop-up/administration-payment/administration-payment.component';
import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';
import {NgbCarouselConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [NgbCarouselConfig]
})
export class HomeComponent implements OnInit {

  saleData = [
    { name: "Mobiles", value: 105000 },
    { name: "Laptop", value: 55000 },
    { name: "AC", value: 15000 },
    { name: "Headset", value: 150000 },
    { name: "Fridge", value: 20000 }
  ];

  showNavigationArrows = false;
  showNavigationIndicators = false;
  home_form: FormGroup;
  currentUser;
  show = false;
  show2 = false;
  show3 = false;
  autohide = true;
  autohide2 = true;
  autohide3 = true;
  monthsoutstandingList: any[] = [];
  monthschargedList: any[] = [];
  notificationCountList: any[] = [];

  constructor(config: NgbCarouselConfig,
              private formBuilder: FormBuilder, 
              private authenticationService : AuthenticationService,
              public http: HttpClient,
              private router: Router,
              private translate: TranslateService,
              private activatedRoute: ActivatedRoute,) { 

    config.showNavigationArrows = true;
    config.showNavigationIndicators = true;
  }

  ngOnInit(): void {
    this.home_form = this.formBuilder.group({
      npersonas_cobradas: [''],
      npersonas_pendientes: [''],
      nnotificacion: [''],
      npersonas_arys: ['']
    })

    this.currentUser = this.authenticationService.currentUserValue;

    //buscar contratos pendientes y cobrados
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania,
    };
    this.http.post(`${environment.apiUrl}/api/home/contract`, params, options).subscribe((response : any) => {
      if(response.data.status){
        if(response.data.npersonas_pendientes){
          this.home_form.get('npersonas_pendientes').setValue(response.data.npersonas_pendientes)
          this.home_form.get('npersonas_pendientes').disable();
        }else{
          this.home_form.get('npersonas_pendientes').setValue(0)
          this.home_form.get('npersonas_pendientes').disable();
        }

        if(response.data.npersonas_cobradas){
          this.home_form.get('npersonas_cobradas').setValue(response.data.npersonas_cobradas)
          this.home_form.get('npersonas_cobradas').disable();
        }else{
          this.home_form.get('npersonas_cobradas').setValue(0)
          this.home_form.get('npersonas_cobradas').disable();
        }

      }
    });

    this.getDataNotification();
    this.getCountArysService();
    this.getAmountsCharged();
    this.getAmountsOutstanding();
    this.getNotificationCount();
  }

  getDataNotification(){
    //buscar notificaciones
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania,
    };
    this.http.post(`${environment.apiUrl}/api/home/notifications`, params, options).subscribe((response : any) => {
      if(response.data.status){
        if(response.data.nnotificacion){
          this.home_form.get('nnotificacion').setValue(response.data.nnotificacion)
          this.home_form.get('nnotificacion').disable();
        }else{
          this.home_form.get('nnotificacion').setValue(0)
          this.home_form.get('nnotificacion').disable();
        }

      }
    });
  }

  getCountArysService(){
    //busca usuario que inicio sesión
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cusuario: this.currentUser.data.cusuario
    };
    this.http.post(`${environment.apiUrl}/api/home/arys-service`, params, options).subscribe((response : any) => {
      if(response.data.npersonas_arys){
        this.home_form.get('npersonas_arys').setValue(response.data.npersonas_arys)
        this.home_form.get('npersonas_arys').disable();
      }else{
        this.home_form.get('npersonas_arys').setValue(0)
        this.home_form.get('npersonas_arys').disable();
      }
    });
  }

  getAmountsCharged(){
    //busca primas pagadas por meses
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cusuario: this.currentUser.data.cusuario
    };
    this.http.post(`${environment.apiUrl}/api/home/amounts-paid`, params, options).subscribe((response : any) => {
      if(response.data.status){
        this.monthschargedList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.monthschargedList.push({ 
            name: response.data.list[i].mes,
            value: response.data.list[i].mprima_pagada,
          });
        }
      }
    });
  }

  getAmountsOutstanding(){
     //busca primas pendientes por meses
     let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
     let options = { headers: headers };
     let params = {
       cusuario: this.currentUser.data.cusuario
     };
     this.http.post(`${environment.apiUrl}/api/home/amounts-outstanding`, params, options).subscribe((response : any) => {
       if(response.data.status){
         this.monthsoutstandingList = [];
         for(let i = 0; i < response.data.list.length; i++){
           this.monthsoutstandingList.push({ 
             name: response.data.list[i].mes,
             value: response.data.list[i].mprima_anual,
           });
         }
       }
     });
  }

  getNotificationCount(){
     //busca primas pendientes por meses
     let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
     let options = { headers: headers };
     let params = {
       cusuario: this.currentUser.data.cusuario
     };
     this.http.post(`${environment.apiUrl}/api/home/count-notifications`, params, options).subscribe((response : any) => {
       if(response.data.status){
         this.notificationCountList = [];
         for(let i = 0; i < response.data.list.length; i++){
           this.notificationCountList.push({ 
             name: response.data.list[i].mes,
             value: response.data.list[i].notificaciones,
           });
         }
       }
     });
  }

}
