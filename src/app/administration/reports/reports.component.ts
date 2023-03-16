import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
import { ColDef} from 'ag-grid-community';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  currentUser;
  search_form: UntypedFormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  primaList: any[] = [];
  receiptList: any[] = [];
  searchStatus: boolean = false;

  columnDefs: ColDef[] = [
    { headerName: 'Póliza N°', field: 'xpoliza', width: 105, resizable: true },
    { headerName: 'Certificado N°', field: 'ccontratoflota', width: 135, resizable: true },
    { headerName: 'Nombre Asegurado', field: 'xnombrepropietario', width: 170, resizable: true },
    { headerName: 'Sucursal', field: 'xsucursalemision', width: 150, resizable: true },
    { headerName: 'Cód. Inter.', field: 'ccorredor', width: 105, resizable: true },
    { headerName: 'Nombre Intermediario', field: 'xcorredor', width: 170, resizable: true },
    { headerName: 'Recibo N°', field: 'nrecibo', width: 140, resizable: true },
    { headerName: 'Moneda', field: 'xmoneda', width: 140, resizable: true },
    { headerName: 'Fec. Emisión', field: 'femision', width: 140, resizable: true },
    { headerName: 'Días', field: 'ndias', width: 140, resizable: true }
  ];

  constructor(private formBuilder: UntypedFormBuilder, 
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private router: Router,
              private translate: TranslateService) { }

  ngOnInit(): void {
    this.search_form = this.formBuilder.group({
      fdesde: [''],
      fhasta: ['']
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 122
      }
      this.http.post(`${environment.apiUrl}/api/security/verify-module-permission`, params, options).subscribe((response : any) => {
        if(response.data.status){
          if(!response.data.bindice){
            this.router.navigate([`/permission-error`]);
          }else{
  
          }
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

  onSearch(form) {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      fdesde: form.fdesde,
      fhasta: form.fhasta
    };
    this.http.post(`${environment.apiUrl}/api/pending-payments/search`, params, options).subscribe((response : any) => {
      if (response.data.status){
        this.receiptList = [];
        for (let i = 0; i < response.data.receipts.length; i++) {
          this.receiptList.push({
            xpoliza: response.data.receipts[i].xpoliza,
            ccontratoflota: response.data.receipts[i].ccontratoflota,
            xnombrepropietario: response.data.receipts[i].xnombre,
            xsucursalemision: response.data.receipts[i].xsucursalemision,
            ccorredor: response.data.receipts[i].ccorredor,
            xcorredor: response.data.receipts[i].xcorredor,
            nrecibo: response.data.receipts[i].nrecibo,
            xmoneda: response.data.receipts[i].xmoneda,
            femision: response.data.receipts[i].femision,
            ndias: 15
            /*fdesde_rec: response.data.receipts[i].fdesde_rec,
            fhasta_rec: response.data.receipts[i].fhasta_rec*/
          })
        }
        console.log(this.receiptList);
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message: string;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 401){
        let condition = err.error.data.condition;
        if(condition == 'user-dont-have-permissions'){ this.router.navigate([`/permission-error`]); }
      }else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
    });
  }

  onChangeDateFrom() {
    let fhasta = this.search_form.get('fhasta').value;
    let fdesde = this.search_form.get('fdesde').value;
    // if (fdesde != null) {
      
    // } 
    // else {
    //   this.searchStatus = false;
    // }
  }

  onChangeDateUntil() {
    let fhasta = this.search_form.get('fhasta').value;
    let fdesde = this.search_form.get('fdesde').value;
    // if (fhasta != null) {
      
    // } 
    // else {
    //   this.searchStatus = false;
    // }
  }

}
