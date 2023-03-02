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
  CdClient : any
  currentUser;


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
    this.http.post(environment.apiUrl + '/api/club/Data/Client', params).subscribe((response : any) => {
      console.log(response.data.ClientData)
      this.VehicleDataUser.get('xmarca').setValue(response.data.ClientData[0].xmarca)
      this.VehicleDataUser.get('xmodelo').setValue(response.data.ClientData[0].xmodelo)
      this.VehicleDataUser.get('xversion').setValue(response.data.ClientData[0].xversion)
      this.VehicleDataUser.get('xplaca').setValue(response.data.ClientData[0].xplaca)
      this.VehicleDataUser.get('fano').setValue(response.data.ClientData[0].fano)
      this.VehicleDataUser.get('xcolor').setValue(response.data.ClientData[0].xcolor)
      this.VehicleDataUser.get('xserialcarroceria').setValue(response.data.ClientData[0].xserialcarroceria)
      this.VehicleDataUser.get('xseriamotor').setValue(response.data.ClientData[0].xseriamotor)

      console.log(this.VehicleDataUser.value)

  },
  (error) => {
    console.log(error);
  });
  }

  onSubmit(form): void {
    this.submitted = true;
    if (this.VehicleDataUser.invalid) {
      return;
    }
    let client = this.VehicleDataUser.value

    this.http.post(environment.apiUrl + '/api/v1/data/' , client).subscribe((response : any) => {
      localStorage.setItem('xcliente', response.client.xcliente);
      this.message = response.message;
        window.alert(`${this.message}`)
        this.router.navigate(['/contract',response.client.ncliente]);

    },
    (error) => {
      window.alert(`${this.message}`)
      console.log(error);

    });
  }

}
