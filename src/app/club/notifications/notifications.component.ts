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
  service= false
  solicitud = false
  proveedor = false
  message : any;
  currentUser;
  ListTypeService : any = [];
  ListService : any = []
  ListSolicitud : any = []
  ListProveedor : any = []
  StateList: any = [];
  CityList:  any = [];

  codeservice : any 
  codetypeservice : any 


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
      cciudad :  [''],
      cproveedor :  [''],
      ccontratoflota :  [''],
    });

  this.currentUser = this.authenticationService.currentUserValue;
  let plandata = {
    cpais: this.currentUser.data.cpais,
    cpropietario: this.currentUser.data.cpropietario
  } 
  this.http.post(environment.apiUrl + '/api/club/Data/Client/Plan', plandata).subscribe((response : any) => {
      let DataTypeServiceI = response.data.listTypeService
      this.servicePlanContract.get('ccontratoflota').setValue(response.data.ccontratoflota);
      const DataTypeServiceP = DataTypeServiceI.filter
      ((data, index, j) => index === j.findIndex((t) => (t.ctiposervicio === data.ctiposervicio && t.xtiposervicio === data.xtiposervicio)))
      this.ListTypeService = DataTypeServiceP
  }

  );

  let params =  {
    cpais: this.currentUser.data.cpais, 
  };
  this.http.post(`${environment.apiUrl}/api/valrep/state`, params).subscribe((response: any) => {

    if(response.data.status){
      this.StateList = [];
      for(let i = 0; i < response.data.list.length; i++){
        this.StateList.push({ 
          id: response.data.list[i].cestado,
          value: response.data.list[i].xestado,
        });
      }
      this.StateList.sort((a, b) => a.value > b.value ? 1 : -1)
    }
    },);

  }

  getdataservice(ctiposervicio:any){
    this.service = true;
    this.codetypeservice = ctiposervicio
    let ctiposervici = ctiposervicio
    this.http.post(environment.apiUrl + '/api/club/Data/Client/Plan/service', {ctiposervici}).subscribe((response : any) => {
      this.ListService = response.data.DataService
  }
  );
  }

  Solicitud(cservicio:any){
    this.solicitud =true;
    this.codeservice = cservicio

  }

  getCity(){
    let params =  {
      cpais: this.currentUser.data.cpais,  
      cestado: this.servicePlanContract.get('cestado').value
    };
    this.http.post(`${environment.apiUrl}/api/valrep/city`, params).subscribe((response: any) => {
      if(response.data.status){
        this.CityList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.CityList.push({ 
            id: response.data.list[i].cciudad,
            value: response.data.list[i].xciudad,
          });
          this.CityList.sort((a, b) => a.value > b.value ? 1 : -1)
        }
      }
      },);
  } 

  getProveedor(){
    let params =  {
      cpais: this.currentUser.data.cpais,  
      cestado: this.servicePlanContract.get('cestado').value,
      cciudad: this.servicePlanContract.get('cciudad').value,
      cservicio: this.codeservice
    };
    this.http.post(`${environment.apiUrl}/api/club/Data/Proveedor`, params).subscribe((response: any) => {

    if(response.data.ListProveedor.length > 0){
      this.proveedor=true
      this.ListProveedor = [];
      for(let i = 0; i < response.data.ListProveedor.length; i++){
        this.ListProveedor.push({ 
          id: response.data.ListProveedor[i].cproveedor,
          value: response.data.ListProveedor[i].xnombre,
        });
      }
      this.ListProveedor.sort((a, b) => a.value > b.value ? 1 : -1)
    }else{
      window.alert('No se encontraron proveedores en la zona,por favor comuniquese con el Call Center.Gracias!')
    }
    },);

    
  }

  GetSolicitud(){
    this.solicitud =true;
    this.codeservice 
    let params = {
      cestado: this.servicePlanContract.get('cestado').value,
      cciudad: this.servicePlanContract.get('cciudad').value,
      cservicio: this.codeservice,
      ctiposervicio: this.codetypeservice,
      cproveedor: this.servicePlanContract.get('cproveedor').value,
      cpropietario: this.currentUser.data.cpropietario,
      ccontratoflota: this.servicePlanContract.get('ccontratoflota').value
    }
//guardar insert  from evsolicitudservicio
    this.http.post(environment.apiUrl + '/api/club/Data/Solicitud',params).subscribe((response : any) => {
      if(response.data.status){
          window.alert('La solicitud fue creada con exito,en breve nos contactamos con usted');
      }
  }
  );
    
  }

}


