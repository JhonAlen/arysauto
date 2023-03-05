import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators,FormControl, FormGroup, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from '@services/authentication.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

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

    this.DataUser = this.formBuilder.group({
      xnombre:  [''],
      xapellido:  [''],
      xzona_postal:  [''],
      icedula:  [''],
      xdocidentidad :  [''],
      xemail :  [''],
    });


    this.currentUser = this.authenticationService.currentUserValue;
    let params = {
      cpais: this.currentUser.data.cpais,
      cpropietario: this.currentUser.data.cpropietario
    } 
    this.http.post(environment.apiUrl + '/api/club/Data/Client', params).subscribe((response : any) => {
      this.DataClient = response
      this.DataUser.get('xnombre').setValue(response.data.xnombre)
      this.DataUser.get('xapellido').setValue(response.data.xapellido)
      this.DataUser.get('xzona_postal').setValue(response.data.xzona_postal)
      this.DataUser.get('icedula').setValue(response.data.icedula)
      this.DataUser.get('xdocidentidad').setValue(response.data.xdocidentidad)
      this.DataUser.get('xemail').setValue(response.data.xemail)
  });


  this.currentUser = this.authenticationService.currentUserValue;
  let plandata = {
    cpais: this.currentUser.data.cpais,
    cpropietario: this.currentUser.data.cpropietario
  } 
  this.http.post(environment.apiUrl + '/api/club/Data/Client/Plan', plandata).subscribe((response : any) => {
      let DataServiceI = response.data.listTypeService

      const DataServiceP = DataServiceI.filter((data, index, j) => 

      index === j.findIndex((t) => (t.ctiposervicio === data.ctiposervicio && t.xtiposervicio === data.xtiposervicio)))

      const container = document.getElementById("accordionFlushExample");
      const html = DataServiceP.map(item => `<p> Servicio: ${item.xtiposervicio}</p>`).join('');

    container.innerHTML = html;
  },

  );
  }
}



