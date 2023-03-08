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

  servicePlanContract : FormGroup
  submitted = false;
  message : any;
  currentUser;
  ListTypeService : any = [];
  ListService : any = []


  constructor(
    private formBuilder: FormBuilder,
    private authenticationService : AuthenticationService,
    private http : HttpClient,
    private router : Router
  ) { }

  ngOnInit() {

    this.servicePlanContract = this.formBuilder.group({
      ctiposervcicio:  [''],
      cservicio:  [''],
      cpais:  [''],
      cestado:  [''],
      ccuidad :  [''],
      cproveedor :  [''],
    });

  this.currentUser = this.authenticationService.currentUserValue;
  let plandata = {
    cpais: this.currentUser.data.cpais,
    cpropietario: this.currentUser.data.cpropietario
  } 
  this.http.post(environment.apiUrl + '/api/club/Data/Client/Plan', plandata).subscribe((response : any) => {
      
      let DataTypeServiceI = response.data.listTypeService
      const DataTypeServiceP = DataTypeServiceI.filter
      ((data, index, j) => index === j.findIndex((t) => (t.ctiposervicio === data.ctiposervicio && t.xtiposervicio === data.xtiposervicio)))

      this.ListTypeService = DataTypeServiceP
      this.ListService = response.data.listService
  }

  );
  }

  getdataservice(ctiposervicio:any){
    
    console.log(ctiposervicio)
  }

  Solicitud(cservicio:any){
    console.log(cservicio)
  }
}


