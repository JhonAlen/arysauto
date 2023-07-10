import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';
import { Papa } from 'ngx-papaparse';

@Component({
  selector: 'app-fleet-loading',
  templateUrl: './fleet-loading.component.html',
  styleUrls: ['./fleet-loading.component.css']
})
export class FleetLoadingComponent implements OnInit {

  @ViewChild('Xdocumento', { static: false }) xdocumento: ElementRef;
  sub;
  currentUser;
  detail_form: FormGroup;
  loading: boolean = false;
  loading_cancel: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  clientList: any[] = [];
  receiptTypeList: any[] = [];
  parsedData: any[] = [];
  npoliza: number;
  fleetContractList: any[] = [];
  canCreate: boolean = false;
  canDetail: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;

  constructor(private formBuilder: FormBuilder, 
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private router: Router,) { }

  ngOnInit(): void {
    this.detail_form = this.formBuilder.group({
      ccliente: [''],
      ctiporecibo: [''],
      npoliza: ['']
    })
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 101
      }
      this.http.post(`${environment.apiUrl}/api/security/verify-module-permission`, params, options).subscribe((response : any) => {
        if(response.data.status){
          this.canCreate = response.data.bcrear;
          this.canDetail = response.data.bdetalle;
          this.canEdit = response.data.beditar;
          this.canDelete = response.data.beliminar;
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

  onSubmit(form){
    this.submitted = true;
    this.loading = true;
    if (this.detail_form.invalid) {
      this.loading = false;
      return;
    }
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      policiesToRenovate: this.parsedData
    }
    this.http.post(`${environment.apiUrl}/api/fleet-contract-management/renovate-contracts`, params, options).subscribe((response : any) => {
      if(response.data.status){
        console.log('insertado');
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ 
        message = "No se encontraron contratos que cumplan con los parámetros de búsqueda"; 
      }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
    });
  }

  parseCSV(file) {

    return new Promise <any[]>((resolve, reject) => {
      let papa = new Papa();
      papa.parse(file, {
        header: true,
        complete: function(results) {
          console.log(results.data);
          return resolve(results.data);
        }
      });
      
    });
  }

  async onFileSelect(event){
    let fixedData: any[] = [];
    let file = event.target.files[0];
    this.fleetContractList = [];
    this.parsedData = [];
    this.parsedData = await this.parseCSV(file);
    for (let i = 0; i < (this.parsedData.length -1); i++){
      fixedData.push({
        cplan: this.parsedData[i].CPLAN,
        xplaca: this.parsedData[i].XPLACA,
        msuma_casco: this.parsedData[i].MSUMA_CASCO,
        mdeducible: this.parsedData[i].MDEDUCIBLE,
        fdesde_pol: this.parsedData[i].FDESDE_POL,
        fhasta_pol: this.parsedData[i].FHASTA_POL,
        crecibo: 2
      })
    }
    this.fleetContractList = fixedData;
  }

}
