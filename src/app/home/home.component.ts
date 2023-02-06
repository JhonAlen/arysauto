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
  images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/1700/600`);

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
    })

    this.currentUser = this.authenticationService.currentUserValue;
    //buscar contratos pendientes
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania,
    };
    this.http.post(`${environment.apiUrl}/api/home/contract`, params, options).subscribe((response : any) => {
      if(response.data.status){
        this.home_form.get('npersonas_pendientes').setValue(response.data.npersonas_pendientes)
        this.home_form.get('npersonas_pendientes').disable();
        this.home_form.get('npersonas_cobradas').setValue(response.data.npersonas_cobradas)
        this.home_form.get('npersonas_cobradas').disable();
      }
    });
  }

}
