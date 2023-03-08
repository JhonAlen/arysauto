import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators,FormControl, FormGroup, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from '@services/authentication.service';


@Component({
  selector: 'app-vehicle.Component',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.css']
})
export class VehicleComponent implements OnInit {

  VehicleDataUser : FormGroup
  submitted = false;
  editClient = false
  createContrat = false
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

    this.VehicleDataUser = this.formBuilder.group({
      xmarca:  [''],
      xmodelo:  [''],
      xversion:  [''],
      xplaca:  [''],
      fano :  [''],
      xcolor :  [''],
      xserialcarroceria :  [''],
      xseriamotor :  [''],
    });


    this.currentUser = this.authenticationService.currentUserValue;
    let params = {
      cpais: this.currentUser.data.cpais,
      cpropietario: this.currentUser.data.cpropietario
    } 
    this.http.post(environment.apiUrl + '/api/club/Data/Client/vehicle', params).subscribe((response : any) => {
      this.DataClient = response
      this.VehicleDataUser.get('xmarca').setValue(response.data.xmarca)
      this.VehicleDataUser.get('xmodelo').setValue(response.data.xmodelo)
      this.VehicleDataUser.get('xversion').setValue(response.data.xversion)
      this.VehicleDataUser.get('xplaca').setValue(response.data.xplaca)
      this.VehicleDataUser.get('fano').setValue(response.data.fano)
      this.VehicleDataUser.get('xcolor').setValue(response.data.xcolor)
      this.VehicleDataUser.get('xserialcarroceria').setValue(response.data.xserialcarroceria)
      this.VehicleDataUser.get('xseriamotor').setValue(response.data.xseriamotor)

  },
  (error) => {
    console.log(error);
  });
  }
}
