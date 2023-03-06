import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators,FormControl, FormGroup, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from '@services/authentication.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  DataUser : FormGroup
  submitted = false;
  message : any;
  currentUser;
  DataClient : any[] = [];


  constructor(
    private formBuilder: FormBuilder,
    private authenticationService : AuthenticationService,
    private http : HttpClient,
    private router : Router
  ) { }

  ngOnInit() {

  this.currentUser = this.authenticationService.currentUserValue;
  let plandata = {
    cpais: this.currentUser.data.cpais,
    cpropietario: this.currentUser.data.cpropietario
  } 
  this.http.post(environment.apiUrl + '/api/club/Data/Client/Plan', plandata).subscribe((response : any) => {
      let DataTypeServiceI = response.data.listTypeService

      // let DataServiceI = response.data.listService


      const DataTypeServiceP = DataTypeServiceI.filter((data, index, j) => 

      index === j.findIndex((t) => (t.ctiposervicio === data.ctiposervicio && t.xtiposervicio === data.xtiposervicio)))
      

      // const DataServiceP = DataServiceI.filter((data, index, j) => 

      // index === j.findIndex((t) => (t.ctiposervicio === data.ctiposervicio && t.xservicio === data.xservicio )))


      // console.log(DataTypeServiceP,DataServiceP )    ${item.xtiposervicio}

      const container = document.getElementById("titleService");
      const html = DataTypeServiceP.map(item => `

   
         
              <h3 >${item.xtiposervicio}</h3>
              <p>Revisión y análisis de siniestralidad para determinar causas frecuentes y tipos de daños entre otros datos, orientados a la toma de decisiones y definición de acciones a tomar.</p>
         


      ` ).join('');

    container.innerHTML = html;
  },

  );
  }
}


