import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators , FormBuilder} from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthenticationService } from '@services/authentication.service';
import { environment } from '@environments/environment';
import { GridApi } from 'ag-grid-community';


@Component({
  selector: 'app-contract-service-arys-administration',
  templateUrl: './contract-service-arys-administration.component.html',
  styleUrls: ['./contract-service-arys-administration.component.css']
})
export class ContractServiceArysAdministrationComponent implements OnInit {

  currentUser;
  keyword = 'value';
  search_form : UntypedFormGroup;
  searchStatus: boolean = false;
  loading: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  contractList: any[] = [];
  batchList: any[] = [];
  fleetContractList: any[] = [];
  id: number;
  xcliente: string;
  xdocidentidadcliente: number;
  xemailcliente: string;
  xpropietario: string;
  xdocidentidadpropietario: number;
  xemailpropietario: string;
  xplaca: string;
  xmarca: string;
  xmodelo: string;
  xversion: string;
  fano: number;
  xserialcarroceria: string;
  xserialmotor: string;
  xcolor: string;
  ncapacidadpasajeros: number;
  mtotal: number;
  fdesde_pol;
  fhasta_pol;
  canCreate: boolean = false;
  canDetail: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;
  filteredData;

  constructor(private formBuilder: UntypedFormBuilder,
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private router: Router) { }

  async ngOnInit(): Promise<void>{
    this.search_form = this.formBuilder.group({
      xnombre: ['', Validators.required],
      xapellido: ['', Validators.required],
      cano: ['', Validators.required],
      xcolor: ['', Validators.required],
      cmarca: ['', Validators.required],
      cmodelo: ['', Validators.required],
      cversion: ['', Validators.required],
      xrif_cliente:['', Validators.required],
      email: ['', Validators.required],
      xtelefono_prop:[''],
      xdireccionfiscal: ['', Validators.required],
      xserialmotor: ['', Validators.required],
      xserialcarroceria: ['', Validators.required],
      xplaca: ['', Validators.required],
      xtelefono_emp: ['', Validators.required],
      cplan: ['', Validators.required],
      ncapacidad_p: ['', Validators.required],
      cestado:['', Validators.required],
      cciudad:['', Validators.required],
      icedula:['', Validators.required],
      femision:['', Validators.required],
      ivigencia:[''],
      cpais:['', Validators.required],
      xreferencia:[''],
      fcobro:[''],
      cbanco: [''],
      xcedula: [''],
      binternacional: [''],
      ctomador: [''],
      cuso: [''],
      cclase: [''],
      ctipovehiculo: [''],
      xzona_postal:[''],
      nkilometraje: [''],
      xmoneda: [''],
    });
    
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 120
      }
      this.http.post(`${environment.apiUrl}/api/security/verify-module-permission`, params, options).subscribe((response : any) => {
        if(response.data.status){
          this.canCreate = response.data.bcrear;
          this.canDetail = response.data.bdetalle;
          this.canEdit = response.data.beditar;
          this.canDelete = response.data.beliminar;
          this.initializeDropdownDataRequest();
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 401){
          let condition = err.error.data.condition;
          if(condition == 'user-dont-have-permissions'){ this.router.navigate([`/permission-error`]); }
        }else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
    }
  }

  initializeDropdownDataRequest(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params;
    this.http.post(`${environment.apiUrl}/api/contract-arys/search-contract-arys`, params, options).subscribe((response : any) => {
      this.contractList = [];
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.contractList.push({
            xnombres: response.data.list[i].xnombres,
            xvehiculo: response.data.list[i].xvehiculo,
            fano: response.data.list[i].fano,
            identificacion: response.data.list[i].identificacion,
          })
        }
        this.filteredData = this.contractList;
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 401){
        let condition = err.error.data.condition;
        if(condition == 'user-dont-have-permissions'){ this.router.navigate([`/permission-error`]); }
      }else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }

  filterData(value: string) {
    this.filteredData = this.contractList.filter((item) => {
      const searchValue = value.toLowerCase();
      return item.xnombres.toString().toLowerCase().includes(searchValue) || item.xvehiculo.toString().toLowerCase().includes(searchValue) || item.identificacion.toString().toLowerCase().includes(searchValue);
    });
  }
}
