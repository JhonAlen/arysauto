import { Component, OnInit, } from '@angular/core';
import { FormBuilder, FormGroup} from '@angular/forms';
import { Router,  } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '@services/authentication.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { WebServiceConnectionService } from '@services/web-service-connection.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  closeResult: string;
  DataUser : FormGroup
  DataUserDocuments : FormGroup
  submitted = false;
  message : any;
  currentUser;
  DataClient : any = [];
  DataVehicle : any = [];
  xrutaarchivo: string;
  ListTypeService: any;
  monto : any
  xtitulo : any


  constructor(
    private formBuilder: FormBuilder,
    private authenticationService : AuthenticationService,
    private http : HttpClient,
    private router : Router,
    private modalService: NgbModal,
    private webService : WebServiceConnectionService
  ) { }

  ngOnInit() {
    // this.DataUser = this.formBuilder.group({
    //   xnombre:  [''],
    //   xapellido:  [''],
    //   xzona_postal:  [''],
    //   icedula:  [''],
    //   xdocidentidad :  [''],
    //   xemail :  [''],
    //   xmarca:  [''],
    //   xmodelo:  [''],
    //   xversion:  [''],
    //   xplaca:  [''],
    //   fano :  [''],
    //   xcolor :  [''],
    //   xserialcarroceria :  [''],
    //   xseriamotor :  [''],
    // });


    this.DataUserDocuments = this.formBuilder.group({
      cpropietario:  [''],
      xdocumento:  [''],
      xarchivo:  [''],
      itipodocumento:  [''],
      fvencimiento:  [''],
      fcreacion :  [''],
      cusuariocreacion:  [''],

    });
    
    this.currentUser = this.authenticationService.currentUserValue;
    let params = {
      cpais: this.currentUser.data.cpais,
      cpropietario: this.currentUser.data.cpropietario
    } 
    this.http.post(environment.apiUrl + '/api/club/Data/Client/vehicle', params).subscribe((response : any) => {
        this.DataVehicle = response.data.listdatavehicle;

  },
  (error) => {
    console.log(error);
  });

    this.currentUser = this.authenticationService.currentUserValue;
    let data = {
      cpais: this.currentUser.data.cpais,
      cpropietario: this.currentUser.data.cpropietario
    } 
    this.http.post(environment.apiUrl + '/api/club/Data/Client', data).subscribe((response : any) => {
      this.DataClient = response.data.UserProfile
  });


  let plandata = {
    cpais: this.currentUser.data.cpais,
    cpropietario: this.currentUser.data.cpropietario
  } 
  this.http.post(environment.apiUrl + '/api/club/Data/Client/Plan', plandata).subscribe((response : any) => {

    let DataTypeServiceI = response.data.listTypeService

    const DataTypeServiceP = DataTypeServiceI.filter
    ((data, index, j) => index === j.findIndex((t) => (t.ctiposervicio === data.ctiposervicio && t.xtiposervicio === data.xtiposervicio)))
    this.ListTypeService = DataTypeServiceP
    this.monto = response.data.mcosto
    this.xtitulo = response.data.xplan



  })

  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    },);
  }

  onFileSelect(event){
    const file = event.target.files[0];
    this.DataUserDocuments.get('xarchivo').setValue(file);
    this.submitted=true
  }



  onSubmit(form){
    const formData = new FormData();
    formData.append('xdocumento',this.DataUserDocuments.get('xarchivo').value);
    formData.append('agentId', '007');
    this.http.post<any>(`${environment.apiUrl}/api/upload/document`, formData).subscribe(response => {
      if(response.data.status){
        this.xrutaarchivo = `${environment.apiUrl}/documents/${response.data.uploadedFile.filename}`;
        
        let params = {
          cpropietario: this.currentUser.data.cpropietario,
          xarchivo: this.xrutaarchivo,
          itipodocumento: form.itipodocumento,
          fvencimiento: form.fvencimiento,
          cusuariocreacion: this.currentUser.data.cusuario,
        }

        this.http.post<any>(environment.apiUrl + `/api/club/upload/client-agenda`, params).subscribe(response => {
          if(response.data.status){
            this.DataUserDocuments.reset()
            this.message = 'Documento guardado con éxito'
          }
        })

        
      }
    })
    
  }
}



