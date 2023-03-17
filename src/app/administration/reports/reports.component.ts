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
  generarReporte: boolean = false;
  mtotal;

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
      fhasta: [''],
      xprima: [''],
      xtitulo: ['']
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

  getTitulo(){
    if(this.search_form.get('xprima').value == 'PENDIENTES'){
      this.search_form.get('xtitulo').setValue('Pendientes');
      this.search_form.get('xtitulo').disable();
    }else{
      this.search_form.get('xtitulo').setValue('Cobrados');
      this.search_form.get('xtitulo').disable();
    }
    this.onSearch(this.search_form.value)
  }

  onSearch(form) {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      fdesde: form.fdesde,
      fhasta: form.fhasta,
      xprima: form.xprima
    };
    this.http.post(`${environment.apiUrl}/api/administration/search-poliza`, params, options).subscribe((response : any) => {
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
            mprima: response.data.receipts[i].mprima,
            ndias: 15
            /*fdesde_rec: response.data.receipts[i].fdesde_rec,
            fhasta_rec: response.data.receipts[i].fhasta_rec*/
          })
          let monto = 0
          this.mtotal = response.data.receipts.reduce((acc, curr) => acc + curr.mprima, 0);
        }
        if(this.receiptList){
          this.generarReporte = true;
        }else{
          this.generarReporte = false;
        }
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


  getMonthAsString(month) {
    month = month + 1;
    if (month == 1) {
      return 'Enero'
    }
    if (month == 2) {
      return 'Febrero'
    }
    if (month == 3) {
      return 'Marzo'
    }
    if (month == 4) {
      return 'Abril'
    }
    if (month == 5) {
      return 'Mayo'
    }
    if (month == 6) {
      return 'Junio'
    }
    if (month == 7) {
      return 'Julio'
    }
    if (month == 8) {
      return 'Agosto'
    }
    if (month == 9) {
      return 'Septiembre'
    }
    if (month == 10) {
      return 'Octubre'
    }
    if (month == 11) {
      return 'Noviembre'
    }
    if (month == 12) {
      return 'Diciembre'
    }
  }

  changeDateFormat(date) {
    let dateArray = date.split("-");
    return dateArray[2] + '-' + dateArray[1] + '-' + dateArray[0];
  }

  buildReceiptBody(){
    let body = [];
    this.receiptList.forEach(function(row) {
      let dataRow = [];
      dataRow.push({text: row.xpoliza, border:[false, false, false, false]});
      dataRow.push({text: row.xnombrepropietario, border:[false, false, false, false]});
      dataRow.push({text: row.ccontratoflota, border:[false, false, false, false]});
      dataRow.push({text:    `${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(row.mprima)} ${row.xmoneda} `, border:[false, false, false, false]});
      body.push(dataRow);
    });
    return body;
  }

  createPDF(){
    if(this.search_form.get('xprima').value == 'PENDIENTES'){
      const pdfDefinition: any = {
        content: [
          {
            columns: [
            	{
                style: 'header',
                text: [
                  {text: 'RIF: '}, {text: 'J000846448', bold: true},
                  '\nDirección: Av. Francisco de Miranda, Edif. Cavendes, Piso 11 OF 1101',
                  '\nUrb. Los Palos Grandes, 1060 Chacao, Caracas.',
                  '\nTelf. +58 212 283-9619 / +58 424 206-1351',
                  '\nUrl: www.lamundialdeseguros.com'
                ],
                alignment: 'left'
              },
              {
                width: 160,
                height: 80,
                image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAf4AAADDCAYAAABj/HPiAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAIkVJREFUeNrsnU9uG0myh9ODxsMAbyH1CcTezkbsE6h0ArNPIOoEpoG3F32Cpk/g0gks4R3A1Ala2sy2qROMtBhg8DZ+GXJUd5lNkZWRWf+/DyhI7lYVWVlZ+YuIjIx88/XrVwcAAADj4G80AQAAAMIPAAAACD8AAAAg/AAAAIDwAwAAAMIPAAAACD8AAAAg/AAAAIDwAwAAAMIPAAAAe/iBJgDoDm/evJn6H8c1XPr+69evT7QwACD8APUIeKa/iohPd/wuTPxx0uB32v5PD/4oGwPrHb8/eYPhnicKMKDxiU16AMxeeSHuxb8bFfIWKAyFzfbhx5ENPQMA4Qfou7hPVNQnpd+PaJ2DhsFaf0qkgCkGAIQfoFMCXwj6tCTyp7RMcu7UENhgEAAg/ABNevHl44xWaZXHwgjQKAHGAADCD2AW+WIOfqo/Efl+GQOFIbCmSQAQfoBdQj9RgS+OE1plMNypIbDGEABA+AGhR+gxBAAA4YcBCn0Rup8h9LDFbckQoOYAAMIPPRb7aUns+z5H/+y+zV2Xec1b3egRwr6Kf9mOvx3qssRHbdcbP7bd8BYBIPzQfbGflcS+6159WczXO0S784VtNJJSVBOc6FE2JCau39EViQbcqCHAigEAhB86JPbF0TVPVOaTi2I0haiPrlJdyUDY/tknw+CuZARsePMA4QcYr9gXnjsFZuzPs1zGuIgcdHlKQYyAnEgAIPwAwxf7h5LII/DNRQqykjHQtcqIt2oA5DwxQPgB0niCcz2aFvuHLYFf80Q61S+6VkVRIj8yFbBidQAg/ADhXl4h9k16d3+s78aT72W/yUrRAfnZZu6ArA5Y' +
                '+SOnHwHCD7B/4Baxv2ha6PHmB9mfJiVDIHPtTRFcqwFAHwOEH6Dk3S8a8NAkdH/TNaH/zz//WwRK8hakLe7//o9/s368vr6WtWgISBRg6UgIBIQfRjoIT1Xs6/Tu/yjGomLfucHWi74YPRISPtoyUDJvACAO9UcECiOgyYTRZ/fnNMCGJwEIPwx9sJ2rh19XMlbh1d90PcHKi74IzpdX/ve1F/45PaZxY7RYNdJUNECmAZYYAIDww9AG1LrD+bclr743A6gX/vs9AvPohX9C72m1zxZGwNsGPvJODYA1rQ8IP/R98FzokTqM2utSqjqv//ueP3n2wn9ML+pMP85cMzUkMAAA4YdeDpQiakuXfv5+MHXTD4T5XwTAC39Gb+pk/y4MgDrzUzAAoLP8jSaAsuD7I1dPNtWgKHP27/3xkx8EZ1IdbSAZ0VN6TD+RXfv8Mfe//uiPSzVIUyM5MF/8+7TWZa4ACD8MWvAl6/mjP372A+zUH6sBJj8Rxu+/AfCkhqh4/z/544P7tpKkLgMAYxEQfhic4Ivn9IsfSI/9sRh52VNKvvbLCJAdFyU0P/H/PK8hCiAGwG/yvulUGgDCD40K/rE/VokE/1E9pSKUT/Gab7CGv79GwHorCvCc8PLyvt3792+pSYcACD/ULvhL923r2XeRl7tT736intJmZM1J2HYkUQD3bVfB9y7dNICsKrhSA2BOSwPCD3WJ/lwF/8rZlzMVc/fi3Wcj9+4PeWt4/MMxAJ40T0UMgMuEEQCpifGJ+X9A+CG14Gf+kPnmTxGC/6gez0Tn7je07EGY4x+mEZBrBCDlFEAx/0/4HxB+iBJ8SdwTj1zWmlvLl0o4/1LD+Ss2Jgny+GHYEYBlDQZAEf7H+weEH4IEv5jHl8Q9a6lSEfxzDefntOpOTmkCDICSAfAx0WVPCu+fFgaEH6qIvmQi36vnYEE2HCnm79e0aBSE+sdlAEhZa1kFkGoZ4JXO/RNZAoQfdgp+Edb/' +
                '7Gyb6BSCP2f+Pg1syTtKA2CjywClDsBdgkvK3P+Gyn+A8MO26C/Uu7SE9RF8A1qnH+A1A0DqAEgfSbECQBJyvxD6B4QfXvYel1Cg//VXF56tj+DXyzNNAFsrAGK5YtkfIPzjFn2x/n9z30KBCH73YH4fCvEvEgB/dvHh/2LZ343U5dCluhNaGUL5gSbol5fvf4gXEZpRzhahacHrglADQIzBTAtpSbnso4jLvXWlqT1/Tet1ZOfMp5Kx+lT8ZKxA+KE7Xv6V4cVe8BInh0zrBvjPP/97utXW0x1tP93zPM5q+mpiSG/8Ie/VTUgip4T/NRE3d/bltqk4fa2t1Jh4VkNgrfd7P/KNt4ajJ/5B0grdFvyJDhIhg9ijevg5LViLIB0ywj56MVjQUn9pN+nLE/1nVjKipg2IdZ3IFNoidCWHZuvLO3rSs/u9U2PgxSigsBceP6QV/ZkODFXDgmKhSxiRKnvtMrq296J+XPK+p1viPnVxoe2uIzvuZRKhCPT+i2S9hbPX3miDs7KB5u/hQQ2BNYYAwg92wT9WAQ/ZMlcKh1BHvxmykXrshagXnnsh9Gd0iRevXd7ZechJKpJSoz934ZG9rnCqx7uSISDTGTdMDSD8UE30p/rSVA3/MY+Px59a4Athz0oij7gfZmI9UQ32TMP/EgF42+N2KAwBWYL4qJGAm5Hv5onww6uiLy/8rxX/XML6Mo+/ouU6R2+8HC1GNC158Ai8nTz2AmrArzW3Z+nCon5d5ETv4cLf03MpEoAR0KbWkNzXCcEPDe1LWH/OXFprYrk+IJDnf//Hv9cdFvniGMtGQ3c1X1+89byOZ64GgOT6FM/uZCDP5FkNpZzpAIR/jKIfsjb/UQV/Tcu1KqCHXprWhV/D9YVYZD0W+WJJWcF6S3A35X/7dt+MYMzI9NfiZzmhctJD4+BRHZ8cZwbhH4Poh2Ttf9AKYNB94f+x6U161JsvC33Xs+jLgl6IeVFExnUxYtLD8aVs' +
                'EJR/L5IyjztoEF6rAcDzR/gH+VKKiFdZwvOgXj7hsJ4IvxetNw18h0Lo5ejivPxjySP/7hiDV97zKEJhJLS5DPNODYCcp4PwD8UKl858KGuX5D2Ev+tCX4h74amLl/bk7x8jdXhGQVsJoBQjQ/h7/wLJiyPZrIfCa3fq5eMZ9U/4n73wHSf4DOkrs5LYtxm6fygJfOG1r+kJGAMN9k8MAIS/ly/KVD2iI7z8QQv/nRfFzHDNYx1AC7FvI0HrL7XZ8d4hYHwrjIA6axBgACD8vXkp5u7wjlzM5Y9M+Le8+qYLtjyUPPi1ijwZ1ZBqzJtp357VFA2gcBnC3+kXoEpRHjL2RyL8uuPcXAfEprz6QuTvVeAZLKFpI2Bek3FLTROEv3MdPnf7i/JI2GqGlz8o4X/0wjrZ+vu6vZ/tPlWIPJ48dGk8PFYDYJHY6GWKFOHvjei/bOWJpTo44X/x+lV4m8iAvtsS+Q1PCHoSBVgkfj/u1JFiTEX4W7FqZRA+3WOdzqlV3Wvhf3LtZNk/u9I+6ITsYQDjZea+7UlwlvAdYXxF+Dsl+g9qkeKV9Vv4166ZtcyPJW9+TYY9YABUhrwphL8Tok9HHI7wy1ziu5qEfl0SegxEGKMBkLs0OQAk/iH8rYk+y/SGJ/wyOH1JcKnnktDfIPQAf4yp4iRdJbiUjL8Z4o/wp+6g+3bXI4FvuOIvYm0JS946QvcAVcbWiY6tseF/xB/hb8zTv6S61KCFX579TYVB6a4k9GtaDqAV7x/xR/iTdcj7HaL/rB0Mb24cBkBRqrRcn/+lIh4ePUCysXaqhnbM3P+DH5entCbCH9MRdyV4MZ8PAFDPmFs1yraPaz8+zxF+hN9qff62Q/QJJQEA1Dv+5m5/cbRD/DL2df5/oxuZWCH6AADNox77h4hL5Bo9QPihsrU5cd+HmopKUYg+AEAz4r/0Py6Npx/tcN4QftjLbOvfJPIBADQv/nmE+F+oE4fwQyXKIaJLRB8A' +
                'oJfiv0T4IZRr1ukDAHRC/K8Np87GOtdPVn9og33rKFPfbmtaAwCgM2OzGACh2f6jLLSG8AMAwFDEf1dRtX2Mcl0/oX4AABgKi8C/H2UlPzx+AAAYkte/cQGlfb0GvsHjBwAA6C8bmgDhB4BuembHY6+gBp3oh6ML9yP8ANAWMh+b0wyQmCBjcoy1WJjjB4A2vKyJ//G7/vOc5bGQqF+J6P8rUPiZ4wcAaID8ld8BYpgF/v3zGBsJ4QeApr0yGZzLG12d+P+2pGWgBeEfZcl1hB8AmhR9CcXu2hltMeZNUyBJ35L+8zbwtPUY2+qHMd70dX59rJZedjG/2PDKADSGJPTtWmMtW6Xm8k7SRGBkbjjnBo9/POQ6+Mx5VwAa9ciu9vzJmU4DAIT2rWMXXrXvbqy7q45O+L23L52jCAct1PsHgGYM7kOsWNsPBmRcPwo8ZznWxhqV8HuRl0INv5b+05HBSgSAcI9s7r5P6HuNE95JaMjbXyP8wxf941c8DgYZgPoH5lXAKVck+kHN3v58zA02Jo9fBp5d2zUeeaNgzrsDUBtLw8Cc02y9N/iW/vgaeGSBnzExOG+yFe8G4R++ty/CfnFgYAKA9IO/TK+9M5xKoh/UYVQ+M96PQPh1Xv9QmPEErx+gFlYx55LoBwe8/YvQPjV2b3/wwl+a169iETLXD5B2YBZj+iziEiT6wT4s5XlXNNvwPf7X5vV3ceoNhYwuAZBE9EMT+l6DRD9IJfwL7+0/0WwDFn4v4tIpQsNAS7oEQBLkXTpKdK2c5oQdTEMkwYs+/WjIwu9Ff2IcLM7w+gGivX1rQt+r7yWJfrCDqoaliP6c5hq+x38T4W3QQQDiqGMeNSfRDyx+IKI/AuH3HnvIvP4uLjRiAADh3r4k453VcGkx5Je0MJR4RvQR/mJeP0WIkQEGIFz0j2t+d97pNAKAsN7z/94j+iMQ/oh5fbx+gDSsXLqEvn2fAfBaX7jzx89e9Okne/hhQPcS' +
                'M6+/i4VjDTFAVW8/c+GraITnwPdWEv3mZGiDbLLj+8K5/zUrIgBj3nhndB6/986XLm5efxdztuwFqNUTfzQa11T0gz/E3x9LPRD9sQi/Lr+7quHSbNkLUM3bXxgNb/Hab9zhJK1d7+aSlgcYofCrR34TeFrIILPA6wfYK/oxCX25VlK7MZxLoh+Akb7P8YfO6z/qIPUpwLOYOSqHAbyGNaHvtrRZiryTF8bPzngE0JCRK4bmxP1ZMVB+7nIMN3oIa/m9axsD9Vb4dV4/dL3wvPRAqrJE+AF2DoSZUbAL0X5BBkV/rTvD+9xKop9GOYKjDW3MQYfub6/c76tpH3D/E8NnT/31O9GWWi0y03sN6Zvlv73Sa8mPOzUEWk9CfOO/QB9FXx7Gl1AP42J+MdPzRfxPAs699Oci/gDfD4z3zja3f+fHnWyHQH0xXEum7iZNbr5i/a7+O75p4RlZBvjzfcIU8aySUVdbqthb9nmx9FuJWMs2wfd4/IdF3zqvX07Uk/NDCv0MzuvXYkeFNSvHa+HaR42SyEBw7w2gGwehRmqm3s/kQFvvbHNt903HRH/p7Ctplrs8OKPXXyT6kYgL1r58rP1nHugQxnCkxsWF//yXKegmI1e98/j9QCrC8zbwtPd+4Fxtid7nUCvYX2Pd0j2vAwfEO/9dsx3XmZQ6uLXmwf/5479Cb8F/n3kL7TZR4bTc60f/nRfGz52r1/A24e08qPF507YRoNvkWtv1L95+Ik/yvKnwKR7/MDz+kuAvXP2Fp6rQmAHQq6x+P6AuDIPpXVn0BfVaQ5cQLVu89VAv6Gk7SuIP6Uy/a6QjppP/r+GcWUurI6xFnR5CRV/beOkPaftPiUXfqXf9qzxDMQRb3kUypkLfYs9gLmJzHfGdAKqKvhjmYkBfdUT0nUYbPvnvtq57xUpvhN8PdFMd+EJ43jPQhIasW9my11g6+H4ruiEdPMWclVik/2M4r1gd0WS7WTdrkj6TBX7WvOFB' +
                'RAzBL20YAOrtWY2ajxXmMxcGo/zFMNJ6AgB7vXx/yNj/uUOCv+v9/k2n08Yr/MZ5/Rcv3Xturw00eUpvpUbMwq/il7KDLzXMfNvltovcrCnz9/hUtV/q1NOnlgaRwgDIG4yo5MbzRMwPDmSapGf13pdU9IM9oj/VsfFtT77ylXr/yft0Xzz+3IUnXfwlxF9G5+sfA6/5toXNeywe3ZOG9t8l/B7PJePLMjCfatSmiQiJVZwu9xiKu4zRdUcGEYnmbOr2/tUDsSY/Latm3kv5VcO76dT4IuQPu/ruXN/Xk559dTHu71OH/jsv/MZ5fRGpKqHlpeErLRtuAouhMXfpl6PkhSesRtNDR71+67z+ddUlmyXRP+3Qq3Kk3n8t/VMT+qzP78GwW9rcagQZ167DsEW/rqjc3Y4jNWKsJJ3377TwG+f1hVnFcK0lya/pLXstn1XHGtTVgX9Xei51hqQj5vUfAlcdWD+nCepaz15LQt8er18Mq9tEfRUQ/RSIVnz0xy/++FFWFsgKlR2HrDj4Sf/u2tlyVnYZ9snEv7PCHzGv/7Hqsjs1DnLDZzQ513/Wgcdxu72ETL3jR0PnndXUX6zz+kHJfBpOv4gYOK51QDjfOuS/fYjwGORZ/Lxveiti8JR7tk5p3EYss7O+ZyT61YjuiPfm0KH9OZTziteu0m+niURf3slL/7nH/lj44+bQtJVUo9S/k8qSomWXzjZ9tUv8o52nLhfwWbnw+ZgHw9rrlUEwZMveZdUksAgxqyuyUJSOvN/hIU5UCC8qeFAi/qE7Iy5c4mJIkfP6WeBznBs/RwbB1YHPuikZvTP9rCqGn3jG8xr7o7Vtn2OMZC3l+8HZdt+URL+8yYp+0ClP3+o4/qX/plhXr9fI1SBdOnv07EjvK4v5Pp0Ufl0edWF4SMGDsniy/vNuAz2aYsveZc1NkVL4n1XAVxUEItfcCrm/2Z4IysqFF794SfKrmkRXEeu8/qXhe8yMn5MH9Mki' +
                'EpVrhGG5xwD44P++tn4YmdC3SrA5ycrZKqodlc6F8bFycYl8ksOUpTYcJddFlxPKYZ0ulD0qlpoEa6JzoX6d17eEK5cRYmL5vCa27M1SNasYESIQVb1C+TuJnvhjckCgLFb1ImF/sc63X4fuv6B9M9TAuIvZ50GMLq3C+N59P1cov5/XLPoTo7ctPMYMTKWB8inCwCbRb5zefubi8pyufb+b1hUtUmM4c/ZiVcKVvp/9F34V0twwuN7GzG0al/Y1UZQmhccv3madYWDLoDxL1F+s8/oPxhLCFkNvneJetX9n6oncqSG3rrn/5RHnJjPuNEx618I9QD+JMThF9Od1f0ExKvRzbtu4z655/BbvzRTiT+T1L2tuj1jhr31XQU36Cx2Uj3Q6J0b0J8ZBPbgyXySzhG0tm/XINElWd36JljS1JpZKPf7UmzlZDYmTOiugQSe9fWu/fWhC9LeYO9vS6Jchwer1d0b4jfP6LwNrokEwd+HLLk5iBewAMRn9HxrcSnhp7PAxWOf1axfNLU61mFKfBs9jF7ckLvk7oaV+raHRRUxYFHqFte9Vrf2S3POPfF9MBnEnhF+9N8tA8yFVuDNivnpZY5tYeahz7ndH28kzCJ0qObPeY8S8/mVkUqH1XKn9cNNC1ceYwcSaGPUxQULfvu9lWRNNRb9xePvHzj63v6qx39Zp1JqMla5k9Vu8tzrEbWnoOOL1z2rYpz5GJNpYwyxt98nwPUN3wbPO61/HRkDEOPSf/2A0OmTVSKZGy6rhqEPI4Cn97iryGnUanRtr+0sYuKmte6EVsohz2zYMLdrzoj9Sr6DC5lfdEn6j91ZLWEaX9sl8dWiIfeHi14ym6sR3DSR97Wq7XJ9liAE3DxH+iHl9azLfawOEtSjIkYrqlb8XsfDzNp7VAfLI89+57pK7tEtkoVtYq9rdtl3vQWtWWJ0K0Yog4W811B/hvS22K8klxGL51bFl76TB799W24Um+VkiQ0mT+TRq' +
                'kKIet1j3UltfjM1lF6YBIhP6+gCJfnj8u+iK8W11HoPHjtaEP8J7u60zaU1D9pbSiqkHFIv1+ljDlEPdRse8Yn+xzuvXkcwnAvmQ6FonGgX43d/juuZk0X2iH5vQ1xdI9INt7nv+PYK1QuoetyX89667G51Y+SlVJMK3j+XBfDSULE79XHMXPle1t900MvTZ8HVqW85Y2kuiDg85pMpiKuG3lK7uKxLanUW0lXiWX0LPq1pjPvFztYwj5ylyITS6ctXUZ/vP2zhbUuqPXSjtbO1X7tvy2aBoRysef4T31nWWidrHOle17kAbmKog7mkL8c4s4n1dc2To6ZWKeikocgGKaYBaK0TqZiZjEX3hLRX9BolpJcoY93NoXPh1Lnyog0yqLXtN12g5zF98B4nkhM6Bz/f8P+uKj3lD9yuGjgjndQ2XLwyAe416dMlY6zu5g6Fh2v0uxW53CP9+0U+xY9IYvH6Lx//QoTawJPlNd/QX64qPRr05maZQQ+PcpUn82+XJfNZaAEkHKd2v/MyNDxL9hsemwfG2DhozQJr2+K3V1vrELMHgbOmIXUlQsSZIzrZE37riI2trjXxpQ52fa4oASC2AdSrxH1FC32tYNzrZOOgi1ve+K8Jv/R7BY39jwi9zlSPxLIote2OYNPHwaybUm8pKfaXYrCmUy8Tb/VoNgHuNAPzkj48ubQ7AaULxX47AED9EcD+zVnjTXIo+cN/TZ2n93llXnEbjecH9sRHh13n9KzceYrfsPR3Ay3oTKHjTSEG6bnBvgqoGwEZXWYghd+nSTcecusgppQQJfZJ9/aYLh/8uPzrj/K77trd5UzXaG51LthoaPU52WxvPe9v2PL9Gnk6buu/ahX8k8/q7vP65sb0aC/fULHoyeISEkWWef6LJkaGC9ODaKVNcuS3EKJGd9Vy6PIB3kYmkMSH+6y6VvlWhijGEVoaB3/IMJw03jeXzHlxP0T5pja61PX5Y++9jaLnepjz+Mczr' +
                'p+xIlpf1saO133PDvYee81K+uau173cYAUUewHmEl1pg8lQjE/qeu2hk+cEvjzCoTgz3tDF8TtZws1g+b+P6jdXJbK2wk0ZmLpq831qF33skCzfOjOGXwcRYhW06lJdVi/KEJLktDf1lVmP55roNABloPjQp/AkS+lYdDgXHeP2hiX6WCFsfhL+v8/t/9E/jeUeuhci0vo950/db2yY9GrL+NeIS73WNdOtIKVWjAbM0PFSL8K87/CLmAdbsmaGPdPneqxgAUqBHDBfLxj/WPmmNwElYcdnVtpRQrx9IryO8pzxALC39TpYQzvz3rF1gtECRZc6419OyEvb2935nfDdO/bm5v8a8wa+cO/vc/rU10bQWjz/BvP5tV0Q/0pM4MRRemRg+p7MerwpzHWvbr5vsI/Ic/fFURy19TUp835AYxCT0zV33kXfVOs9bOdFP51W7sKdHys95tswXd5CYqagLEf8mPH39nLct6FJtoX65oRPjuQ9dG2AixSu0Ew4ho39Xf0hJo8l8Kvaf1VP+VJP4r1z60r/bxBhKd33Yy149oKipjIBEP4tzc1q3sGhhIovHO4gkbDVePkaK/7quTH+dUpJ36SLiMh+s3n4twq/z+lYrRga+eUcTtayDSeUte60Z/V1Yu17Bo31MdLlGk/m0/sR2GP6T/vfU1HZPfrBZuLj9Mfrg7ZffVWt/C0n0swp4bV6lbrZkXTqdu4HgRXHh4lYoiOG00UTY1O9h7AZ1D7FTbkmFP8G8/qKrIhaxXa9Q9SFNjN5vXwbjFDSWzKc7Db42iF7pNrqThO9OaJSsUhRKPZeYgSLKu2hh0I9d3ndVZQ28epbWSKCIfzJhkWkcf8j3sU7l9CKiEzpWuLgo2kuET73/WeTzmevugb+6uFVuz85e6Ce98CeY1+9cAZYIAd/l9VcRiF6X6q3gTcSGshtJ5pO+LHXx3eFQnHgF97E76EVUKqz67FcRg82z62FZ38jlfSGGaoyBcaLC' +
                'IgaATDHMqq4s0DnimZ4ngvIl0otcuoGhxmqWYNyR9/zz1nM6rvh8cn+IIfrJ2ae/y+9ilsIIT+nxr1zcvP6i6x0pMmRd5cUazFK+HW335OJCiY0k86kIi3FRdbqqvIXuKjQCoPkC1tDfwfbUhL6YucRFjyu5xYjZWRVvXL3k2H0ZTtRTlzyS3/3nfhXvXT3N7UP++1f/d//Sv3+XQFBuB+jtl6MyKcR/+zn9SwT9lWdUfj4XLk0dm0L0kzh6SZbz6eB1EXFDvSnAooOJZemVbNm7PBCmnhiu26cXduVsocgmDcMbowgf6b1JRb0HfS73rxhmEx2MsohB+67itFhsQl/uekqC5X3i3d1UMHwWkc9yF6cNNdNLXpUbMLrEL9N3MmUxuSPXTJ2apKKfxOPXucmYwWXepwIs6vVbrcdlDS97n5bfZD0wDBcJvINTNQLEQPyy4/ikYnQSMRAcHKwTJPQtXP9ZRjzPoypRAzUMZq7+VRl1CcqTGzgqmlPXv5LEMl01Sb3MMkr4S3OTVivqoybN9Q2rofPqlr3GjP7nvkRKIgzERivzqReddXyAWBxqkwQJfddDWNOdYHnfu4BEv6xH4p/ci+xJX5Bn9LEnX1mSamsxzGI9/lWER/GgO5f1Eeua631b9g42sa+U+BlqILZSma8k/l0cIC4rJsHGJvQNwdsvt8Vj5PlVvcrMpVu6WhePYxP90jN60qV+5x1+TuLl/1RnlUyz8KeY1+9r5zHsPPedt/aK1z8xXGvdkyaT7xka1r5us3qj7qjXpQFC3plfqoh+goS+5ZDCvwmW951VXXZXCil31auU7zUdo+hvPae1P2TMfe+6E6WRceYX9fI3dX6QSfgTzOv3cmMVixcQ4PVnhmt1vg11LXxoVKgzqzy2NtNpa4C4lcE6YFosj/gsqce/cgMjxfK+qpXcSl7lTy4+4z9lH/pZvtcY5vQD+sVKna7LFg186ZeXYog0sY9DjMefO3sY8UPfN1Yp' +
                'ef3Wl3qeyOPvtPAbo0KdXOUhm+m0MEDIgHDuP7uyoawJfTHZ5XM3XGK8/qPQ88Vr0w1fflJPu2lhedTPlbDxbOxe/gFDLdcIwLmO688NPZuf1cPPm7znN/4DQwdz65Ksl4FM9yIfBLpm+3fj6d/N1fprfQ29gD//TYfbRqJCvxlOPe+DYaj3J4P6zKVdxlUsBVwNICoGfzXMpN9kekwT951n9+cy0huEPvpZZaVndZbg2bw8F3lGbT+bYOEHqGgQ3TtbMt+qp/c71UMGCQkJV5neKELPxWB9j9iPTlyOtd8UP93W77vYuD+jfcXv94TwGzHaJqVnUzy3fc9H3u1N10peI/yQWgSLyneh8/qSzDenBQEA6uVvNAEkxrLEsxclmwEAEH6A7719Ee9BJPMBAAwVQv2QSvQlye2z4dTzIazyAADA44cxib4kueSGU98j+gAAePzQL9EnmQ8AAI8fRkTuSOYDAED4YRTevmTwvw087WVLWZL5AAAQfuiX6M+drYLjXHe/AwAAhB96IvrWTZo+BGw0AwAANUByH4SKviTzicceWmP8VjaboQUBAPD4oV+sDaIvyXxzmg4AAOGHfnn7uQvP4CeZDwAA4Yceir547BeGU0nmAwBA+KFnoi/JfJ8Mp5LMBwDQMUjug0OiP3HfkvmOAk8lmQ8AAI8feib6ksF/YxB9kvkAABB+6CGyVp9kPgAAhB9G4O1LLX2S+QAAEH4YgejL3PyvhlNJ5gMA6Dgk9wEAAODxAwAAAMIPAAAACD8AAAAg/AAAAIDwAwAAAMIPAAAACD8AAAAg/AAAAIDwAwAAAMIPAAAACD8AAADCDwAAAAg/AAAA9J//F2AA16O5hU8xXAQAAAAASUVORK5CYII=',
                alignment: 'right'
              },
            ],
            footer: function(currentPage, pageCount) {
              return {
                text: `Página ${currentPage} de ${pageCount}`,
                alignment: 'center'
              };
            }
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            alignment: 'center',
            style: 'title',
            text: [
              {text: '\nPRIMAS PENDIENTES ', bold: true}
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            table: {
              widths: ['*'],
              body: [
                [{text: ' ', border: [false, true, false, false]}]
              ]
            }
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            style: 'data',
            columns: [
              {
                alignment: 'left',
                style: 'data',
                text: [
                  // {text: 'CLIENTE:   ', bold: true}, {text: `${this.search_form.get('xcliente').value}`}
                ]
              },
              {
                alignment: 'center',
                text: [
                  {text: ''}
                ]
              },
              {
                table: {
                  alignment: 'right',
                  widths: [200, -49, 5],
                  body: [
                    [{text: [{text: `Caracas, ${new Date().getDate()} de ${this.getMonthAsString(new Date().getMonth())} de ${new Date().getFullYear()}`}], border: [false, false, false, false]} ]
                  ]
                },
              },
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            style: 'tableExample',
            table: {
              headerRows: 1,
              widths: [120, 115, 120, 110],
              body: [
                [{text: 'Póliza', style: 'tableHeader', fillColor: '#fdd213'},
                 {text: 'Nombre', style: 'tableHeader', fillColor: '#fdd213'}, 
                 {text: 'N° de Contrato', style: 'tableHeader', fillColor: '#fdd213'},
                 {text: 'Monto Prima', style: 'tableHeader', fillColor: '#fdd213'},]
              ]
            },
            layout: 'headerLineOnly'
          },
          {
            style: 'data',
            table: {
              widths: [120, 150, 120, 120],
              heights: 20,
              body: this.buildReceiptBody()
            }
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            style: 'tableExample',
            alignment: 'right',
            table: {
              headerRows: 1,
              widths: ['*', 80],
              body: [
                [{text: 'Monto Total:', style: 'tableHeader', fillColor: '#fdd213'},
                 {text: `${this.mtotal}' '${this.receiptList[0].xmoneda}`, style: 'tableHeader', fillColor: '#fdd213'}]
              ],
            },
            layout: 'headerLineOnly'
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            columns: [
              {
                style: 'data',
                text: [
                  {text: 'Sin más a que hacer referencia, me despido'}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            table: {
              widths: [200],
              body: [
                [{text: ' ', border: [false, true, false, false]}]
              ]
            }
          },
          {
            columns: [
              {
                style: 'data',
                text: [
                  // {text: 'NOMBRE APELLIDO:      '}, {text: this.search_form.get('xnombres').value}
                ]
              }
            ]
          }
        ],
        styles: {
          data: {
            fontSize: 10
          },
          color1: {
            color: '#1D4C01'
          },
          color2: {
            color: '#7F0303'
          },
          header: {
            fontSize: 7.5,
            color: 'gray'
          },
        }
      }
      pdfMake.createPdf(pdfDefinition).open();
      //pdfMake.createPdf(pdfDefinition).download(`ORDEN DE SERVICIO PARA ${this.getServiceOrderService()} #${this.search_form.get('corden').value}, PARA ${this.search_form.get('xcliente').value}.pdf`, function() { alert('El PDF se está Generando'); });
    }else{
      const pdfDefinition: any = {
        content: [
          {
            columns: [
            	{
                style: 'header',
                text: [
                  {text: 'RIF: '}, {text: 'J000846448', bold: true},
                  '\nDirección: Av. Francisco de Miranda, Edif. Cavendes, Piso 11 OF 1101',
                  '\nUrb. Los Palos Grandes, 1060 Chacao, Caracas.',
                  '\nTelf. +58 212 283-9619 / +58 424 206-1351',
                  '\nUrl: www.lamundialdeseguros.com'
                ],
                alignment: 'left'
              },
              {
                width: 160,
                height: 80,
                image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAf4AAADDCAYAAABj/HPiAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAIkVJREFUeNrsnU9uG0myh9ODxsMAbyH1CcTezkbsE6h0ArNPIOoEpoG3F32Cpk/g0gks4R3A1Ala2sy2qROMtBhg8DZ+GXJUd5lNkZWRWf+/DyhI7lYVWVlZ+YuIjIx88/XrVwcAAADj4G80AQAAAMIPAAAACD8AAAAg/AAAAIDwAwAAAMIPAAAACD8AAAAg/AAAAIDwAwAAAMIPAAAAe/iBJgDoDm/evJn6H8c1XPr+69evT7QwACD8APUIeKa/iohPd/wuTPxx0uB32v5PD/4oGwPrHb8/eYPhnicKMKDxiU16AMxeeSHuxb8bFfIWKAyFzfbhx5ENPQMA4Qfou7hPVNQnpd+PaJ2DhsFaf0qkgCkGAIQfoFMCXwj6tCTyp7RMcu7UENhgEAAg/ABNevHl44xWaZXHwgjQKAHGAADCD2AW+WIOfqo/Efl+GQOFIbCmSQAQfoBdQj9RgS+OE1plMNypIbDGEABA+AGhR+gxBAAA4YcBCn0Rup8h9LDFbckQoOYAAMIPPRb7aUns+z5H/+y+zV2Xec1b3egRwr6Kf9mOvx3qssRHbdcbP7bd8BYBIPzQfbGflcS+6159WczXO0S784VtNJJSVBOc6FE2JCau39EViQbcqCHAigEAhB86JPbF0TVPVOaTi2I0haiPrlJdyUDY/tknw+CuZARsePMA4QcYr9gXnjsFZuzPs1zGuIgcdHlKQYyAnEgAIPwAwxf7h5LII/DNRQqykjHQtcqIt2oA5DwxQPgB0niCcz2aFvuHLYFf80Q61S+6VkVRIj8yFbBidQAg/ADhXl4h9k16d3+s78aT72W/yUrRAfnZZu6ArA5Y' +
                '+SOnHwHCD7B/4Baxv2ha6PHmB9mfJiVDIHPtTRFcqwFAHwOEH6Dk3S8a8NAkdH/TNaH/zz//WwRK8hakLe7//o9/s368vr6WtWgISBRg6UgIBIQfRjoIT1Xs6/Tu/yjGomLfucHWi74YPRISPtoyUDJvACAO9UcECiOgyYTRZ/fnNMCGJwEIPwx9sJ2rh19XMlbh1d90PcHKi74IzpdX/ve1F/45PaZxY7RYNdJUNECmAZYYAIDww9AG1LrD+bclr743A6gX/vs9AvPohX9C72m1zxZGwNsGPvJODYA1rQ8IP/R98FzokTqM2utSqjqv//ueP3n2wn9ML+pMP85cMzUkMAAA4YdeDpQiakuXfv5+MHXTD4T5XwTAC39Gb+pk/y4MgDrzUzAAoLP8jSaAsuD7I1dPNtWgKHP27/3xkx8EZ1IdbSAZ0VN6TD+RXfv8Mfe//uiPSzVIUyM5MF/8+7TWZa4ACD8MWvAl6/mjP372A+zUH6sBJj8Rxu+/AfCkhqh4/z/544P7tpKkLgMAYxEQfhic4Ivn9IsfSI/9sRh52VNKvvbLCJAdFyU0P/H/PK8hCiAGwG/yvulUGgDCD40K/rE/VokE/1E9pSKUT/Gab7CGv79GwHorCvCc8PLyvt3792+pSYcACD/ULvhL923r2XeRl7tT736intJmZM1J2HYkUQD3bVfB9y7dNICsKrhSA2BOSwPCD3WJ/lwF/8rZlzMVc/fi3Wcj9+4PeWt4/MMxAJ40T0UMgMuEEQCpifGJ+X9A+CG14Gf+kPnmTxGC/6gez0Tn7je07EGY4x+mEZBrBCDlFEAx/0/4HxB+iBJ8SdwTj1zWmlvLl0o4/1LD+Ss2Jgny+GHYEYBlDQZAEf7H+weEH4IEv5jHl8Q9a6lSEfxzDefntOpOTmkCDICSAfAx0WVPCu+fFgaEH6qIvmQi36vnYEE2HCnm79e0aBSE+sdlAEhZa1kFkGoZ4JXO/RNZAoQfdgp+Edb/' +
                '7Gyb6BSCP2f+Pg1syTtKA2CjywClDsBdgkvK3P+Gyn+A8MO26C/Uu7SE9RF8A1qnH+A1A0DqAEgfSbECQBJyvxD6B4QfXvYel1Cg//VXF56tj+DXyzNNAFsrAGK5YtkfIPzjFn2x/n9z30KBCH73YH4fCvEvEgB/dvHh/2LZ343U5dCluhNaGUL5gSbol5fvf4gXEZpRzhahacHrglADQIzBTAtpSbnso4jLvXWlqT1/Tet1ZOfMp5Kx+lT8ZKxA+KE7Xv6V4cVe8BInh0zrBvjPP/97utXW0x1tP93zPM5q+mpiSG/8Ie/VTUgip4T/NRE3d/bltqk4fa2t1Jh4VkNgrfd7P/KNt4ajJ/5B0grdFvyJDhIhg9ijevg5LViLIB0ywj56MVjQUn9pN+nLE/1nVjKipg2IdZ3IFNoidCWHZuvLO3rSs/u9U2PgxSigsBceP6QV/ZkODFXDgmKhSxiRKnvtMrq296J+XPK+p1viPnVxoe2uIzvuZRKhCPT+i2S9hbPX3miDs7KB5u/hQQ2BNYYAwg92wT9WAQ/ZMlcKh1BHvxmykXrshagXnnsh9Gd0iRevXd7ZechJKpJSoz934ZG9rnCqx7uSISDTGTdMDSD8UE30p/rSVA3/MY+Px59a4Athz0oij7gfZmI9UQ32TMP/EgF42+N2KAwBWYL4qJGAm5Hv5onww6uiLy/8rxX/XML6Mo+/ouU6R2+8HC1GNC158Ai8nTz2AmrArzW3Z+nCon5d5ETv4cLf03MpEoAR0KbWkNzXCcEPDe1LWH/OXFprYrk+IJDnf//Hv9cdFvniGMtGQ3c1X1+89byOZ64GgOT6FM/uZCDP5FkNpZzpAIR/jKIfsjb/UQV/Tcu1KqCHXprWhV/D9YVYZD0W+WJJWcF6S3A35X/7dt+MYMzI9NfiZzmhctJD4+BRHZ8cZwbhH4Poh2Ttf9AKYNB94f+x6U161JsvC33Xs+jLgl6IeVFExnUxYtLD8aVs' +
                'EJR/L5IyjztoEF6rAcDzR/gH+VKKiFdZwvOgXj7hsJ4IvxetNw18h0Lo5ejivPxjySP/7hiDV97zKEJhJLS5DPNODYCcp4PwD8UKl858KGuX5D2Ev+tCX4h74amLl/bk7x8jdXhGQVsJoBQjQ/h7/wLJiyPZrIfCa3fq5eMZ9U/4n73wHSf4DOkrs5LYtxm6fygJfOG1r+kJGAMN9k8MAIS/ly/KVD2iI7z8QQv/nRfFzHDNYx1AC7FvI0HrL7XZ8d4hYHwrjIA6axBgACD8vXkp5u7wjlzM5Y9M+Le8+qYLtjyUPPi1ijwZ1ZBqzJtp357VFA2gcBnC3+kXoEpRHjL2RyL8uuPcXAfEprz6QuTvVeAZLKFpI2Bek3FLTROEv3MdPnf7i/JI2GqGlz8o4X/0wjrZ+vu6vZ/tPlWIPJ48dGk8PFYDYJHY6GWKFOHvjei/bOWJpTo44X/x+lV4m8iAvtsS+Q1PCHoSBVgkfj/u1JFiTEX4W7FqZRA+3WOdzqlV3Wvhf3LtZNk/u9I+6ITsYQDjZea+7UlwlvAdYXxF+Dsl+g9qkeKV9Vv4166ZtcyPJW9+TYY9YABUhrwphL8Tok9HHI7wy1ziu5qEfl0SegxEGKMBkLs0OQAk/iH8rYk+y/SGJ/wyOH1JcKnnktDfIPQAf4yp4iRdJbiUjL8Z4o/wp+6g+3bXI4FvuOIvYm0JS946QvcAVcbWiY6tseF/xB/hb8zTv6S61KCFX579TYVB6a4k9GtaDqAV7x/xR/iTdcj7HaL/rB0Mb24cBkBRqrRcn/+lIh4ePUCysXaqhnbM3P+DH5entCbCH9MRdyV4MZ8PAFDPmFs1yraPaz8+zxF+hN9qff62Q/QJJQEA1Dv+5m5/cbRD/DL2df5/oxuZWCH6AADNox77h4hL5Bo9QPihsrU5cd+HmopKUYg+AEAz4r/0Py6Npx/tcN4QftjLbOvfJPIBADQv/nmE+F+oE4fwQyXKIaJLRB8A' +
                'oJfiv0T4IZRr1ukDAHRC/K8Np87GOtdPVn9og33rKFPfbmtaAwCgM2OzGACh2f6jLLSG8AMAwFDEf1dRtX2Mcl0/oX4AABgKi8C/H2UlPzx+AAAYkte/cQGlfb0GvsHjBwAA6C8bmgDhB4BuembHY6+gBp3oh6ML9yP8ANAWMh+b0wyQmCBjcoy1WJjjB4A2vKyJ//G7/vOc5bGQqF+J6P8rUPiZ4wcAaID8ld8BYpgF/v3zGBsJ4QeApr0yGZzLG12d+P+2pGWgBeEfZcl1hB8AmhR9CcXu2hltMeZNUyBJ35L+8zbwtPUY2+qHMd70dX59rJZedjG/2PDKADSGJPTtWmMtW6Xm8k7SRGBkbjjnBo9/POQ6+Mx5VwAa9ciu9vzJmU4DAIT2rWMXXrXvbqy7q45O+L23L52jCAct1PsHgGYM7kOsWNsPBmRcPwo8ZznWxhqV8HuRl0INv5b+05HBSgSAcI9s7r5P6HuNE95JaMjbXyP8wxf941c8DgYZgPoH5lXAKVck+kHN3v58zA02Jo9fBp5d2zUeeaNgzrsDUBtLw8Cc02y9N/iW/vgaeGSBnzExOG+yFe8G4R++ty/CfnFgYAKA9IO/TK+9M5xKoh/UYVQ+M96PQPh1Xv9QmPEErx+gFlYx55LoBwe8/YvQPjV2b3/wwl+a169iETLXD5B2YBZj+iziEiT6wT4s5XlXNNvwPf7X5vV3ceoNhYwuAZBE9EMT+l6DRD9IJfwL7+0/0WwDFn4v4tIpQsNAS7oEQBLkXTpKdK2c5oQdTEMkwYs+/WjIwu9Ff2IcLM7w+gGivX1rQt+r7yWJfrCDqoaliP6c5hq+x38T4W3QQQDiqGMeNSfRDyx+IKI/AuH3HnvIvP4uLjRiAADh3r4k453VcGkx5Je0MJR4RvQR/mJeP0WIkQEGIFz0j2t+d97pNAKAsN7z/94j+iMQ/oh5fbx+gDSsXLqEvn2fAfBaX7jzx89e9Okne/hhQPcS' +
                'M6+/i4VjDTFAVW8/c+GraITnwPdWEv3mZGiDbLLj+8K5/zUrIgBj3nhndB6/986XLm5efxdztuwFqNUTfzQa11T0gz/E3x9LPRD9sQi/Lr+7quHSbNkLUM3bXxgNb/Hab9zhJK1d7+aSlgcYofCrR34TeFrIILPA6wfYK/oxCX25VlK7MZxLoh+Akb7P8YfO6z/qIPUpwLOYOSqHAbyGNaHvtrRZiryTF8bPzngE0JCRK4bmxP1ZMVB+7nIMN3oIa/m9axsD9Vb4dV4/dL3wvPRAqrJE+AF2DoSZUbAL0X5BBkV/rTvD+9xKop9GOYKjDW3MQYfub6/c76tpH3D/E8NnT/31O9GWWi0y03sN6Zvlv73Sa8mPOzUEWk9CfOO/QB9FXx7Gl1AP42J+MdPzRfxPAs699Oci/gDfD4z3zja3f+fHnWyHQH0xXEum7iZNbr5i/a7+O75p4RlZBvjzfcIU8aySUVdbqthb9nmx9FuJWMs2wfd4/IdF3zqvX07Uk/NDCv0MzuvXYkeFNSvHa+HaR42SyEBw7w2gGwehRmqm3s/kQFvvbHNt903HRH/p7Ctplrs8OKPXXyT6kYgL1r58rP1nHugQxnCkxsWF//yXKegmI1e98/j9QCrC8zbwtPd+4Fxtid7nUCvYX2Pd0j2vAwfEO/9dsx3XmZQ6uLXmwf/5479Cb8F/n3kL7TZR4bTc60f/nRfGz52r1/A24e08qPF507YRoNvkWtv1L95+Ik/yvKnwKR7/MDz+kuAvXP2Fp6rQmAHQq6x+P6AuDIPpXVn0BfVaQ5cQLVu89VAv6Gk7SuIP6Uy/a6QjppP/r+GcWUurI6xFnR5CRV/beOkPaftPiUXfqXf9qzxDMQRb3kUypkLfYs9gLmJzHfGdAKqKvhjmYkBfdUT0nUYbPvnvtq57xUpvhN8PdFMd+EJ43jPQhIasW9my11g6+H4ruiEdPMWclVik/2M4r1gd0WS7WTdrkj6TBX7WvOFB' +
                'RAzBL20YAOrtWY2ajxXmMxcGo/zFMNJ6AgB7vXx/yNj/uUOCv+v9/k2n08Yr/MZ5/Rcv3Xturw00eUpvpUbMwq/il7KDLzXMfNvltovcrCnz9/hUtV/q1NOnlgaRwgDIG4yo5MbzRMwPDmSapGf13pdU9IM9oj/VsfFtT77ylXr/yft0Xzz+3IUnXfwlxF9G5+sfA6/5toXNeywe3ZOG9t8l/B7PJePLMjCfatSmiQiJVZwu9xiKu4zRdUcGEYnmbOr2/tUDsSY/Latm3kv5VcO76dT4IuQPu/ruXN/Xk559dTHu71OH/jsv/MZ5fRGpKqHlpeErLRtuAouhMXfpl6PkhSesRtNDR71+67z+ddUlmyXRP+3Qq3Kk3n8t/VMT+qzP78GwW9rcagQZ167DsEW/rqjc3Y4jNWKsJJ3377TwG+f1hVnFcK0lya/pLXstn1XHGtTVgX9Xei51hqQj5vUfAlcdWD+nCepaz15LQt8er18Mq9tEfRUQ/RSIVnz0xy/++FFWFsgKlR2HrDj4Sf/u2tlyVnYZ9snEv7PCHzGv/7Hqsjs1DnLDZzQ513/Wgcdxu72ETL3jR0PnndXUX6zz+kHJfBpOv4gYOK51QDjfOuS/fYjwGORZ/Lxveiti8JR7tk5p3EYss7O+ZyT61YjuiPfm0KH9OZTziteu0m+niURf3slL/7nH/lj44+bQtJVUo9S/k8qSomWXzjZ9tUv8o52nLhfwWbnw+ZgHw9rrlUEwZMveZdUksAgxqyuyUJSOvN/hIU5UCC8qeFAi/qE7Iy5c4mJIkfP6WeBznBs/RwbB1YHPuikZvTP9rCqGn3jG8xr7o7Vtn2OMZC3l+8HZdt+URL+8yYp+0ClP3+o4/qX/plhXr9fI1SBdOnv07EjvK4v5Pp0Ufl0edWF4SMGDsniy/vNuAz2aYsveZc1NkVL4n1XAVxUEItfcCrm/2Z4IysqFF794SfKrmkRXEeu8/qXhe8yMn5MH9Mki' +
                'EpVrhGG5xwD44P++tn4YmdC3SrA5ycrZKqodlc6F8bFycYl8ksOUpTYcJddFlxPKYZ0ulD0qlpoEa6JzoX6d17eEK5cRYmL5vCa27M1SNasYESIQVb1C+TuJnvhjckCgLFb1ImF/sc63X4fuv6B9M9TAuIvZ50GMLq3C+N59P1cov5/XLPoTo7ctPMYMTKWB8inCwCbRb5zefubi8pyufb+b1hUtUmM4c/ZiVcKVvp/9F34V0twwuN7GzG0al/Y1UZQmhccv3madYWDLoDxL1F+s8/oPxhLCFkNvneJetX9n6oncqSG3rrn/5RHnJjPuNEx618I9QD+JMThF9Od1f0ExKvRzbtu4z655/BbvzRTiT+T1L2tuj1jhr31XQU36Cx2Uj3Q6J0b0J8ZBPbgyXySzhG0tm/XINElWd36JljS1JpZKPf7UmzlZDYmTOiugQSe9fWu/fWhC9LeYO9vS6Jchwer1d0b4jfP6LwNrokEwd+HLLk5iBewAMRn9HxrcSnhp7PAxWOf1axfNLU61mFKfBs9jF7ckLvk7oaV+raHRRUxYFHqFte9Vrf2S3POPfF9MBnEnhF+9N8tA8yFVuDNivnpZY5tYeahz7ndH28kzCJ0qObPeY8S8/mVkUqH1XKn9cNNC1ceYwcSaGPUxQULfvu9lWRNNRb9xePvHzj63v6qx39Zp1JqMla5k9Vu8tzrEbWnoOOL1z2rYpz5GJNpYwyxt98nwPUN3wbPO61/HRkDEOPSf/2A0OmTVSKZGy6rhqEPI4Cn97iryGnUanRtr+0sYuKmte6EVsohz2zYMLdrzoj9Sr6DC5lfdEn6j91ZLWEaX9sl8dWiIfeHi14ym6sR3DSR97Wq7XJ9liAE3DxH+iHl9azLfawOEtSjIkYrqlb8XsfDzNp7VAfLI89+57pK7tEtkoVtYq9rdtl3vQWtWWJ0K0Yog4W811B/hvS22K8klxGL51bFl76TB799W24Um+VkiQ0mT+TRq' +
                'kKIet1j3UltfjM1lF6YBIhP6+gCJfnj8u+iK8W11HoPHjtaEP8J7u60zaU1D9pbSiqkHFIv1+ljDlEPdRse8Yn+xzuvXkcwnAvmQ6FonGgX43d/juuZk0X2iH5vQ1xdI9INt7nv+PYK1QuoetyX89667G51Y+SlVJMK3j+XBfDSULE79XHMXPle1t900MvTZ8HVqW85Y2kuiDg85pMpiKuG3lK7uKxLanUW0lXiWX0LPq1pjPvFztYwj5ylyITS6ctXUZ/vP2zhbUuqPXSjtbO1X7tvy2aBoRysef4T31nWWidrHOle17kAbmKog7mkL8c4s4n1dc2To6ZWKeikocgGKaYBaK0TqZiZjEX3hLRX9BolpJcoY93NoXPh1Lnyog0yqLXtN12g5zF98B4nkhM6Bz/f8P+uKj3lD9yuGjgjndQ2XLwyAe416dMlY6zu5g6Fh2v0uxW53CP9+0U+xY9IYvH6Lx//QoTawJPlNd/QX64qPRr05maZQQ+PcpUn82+XJfNZaAEkHKd2v/MyNDxL9hsemwfG2DhozQJr2+K3V1vrELMHgbOmIXUlQsSZIzrZE37riI2trjXxpQ52fa4oASC2AdSrxH1FC32tYNzrZOOgi1ve+K8Jv/R7BY39jwi9zlSPxLIote2OYNPHwaybUm8pKfaXYrCmUy8Tb/VoNgHuNAPzkj48ubQ7AaULxX47AED9EcD+zVnjTXIo+cN/TZ2n93llXnEbjecH9sRHh13n9KzceYrfsPR3Ay3oTKHjTSEG6bnBvgqoGwEZXWYghd+nSTcecusgppQQJfZJ9/aYLh/8uPzrj/K77trd5UzXaG51LthoaPU52WxvPe9v2PL9Gnk6buu/ahX8k8/q7vP65sb0aC/fULHoyeISEkWWef6LJkaGC9ODaKVNcuS3EKJGd9Vy6PIB3kYmkMSH+6y6VvlWhijGEVoaB3/IMJw03jeXzHlxP0T5pja61PX5Y++9jaLnepjz+Mczr' +
                'p+xIlpf1saO133PDvYee81K+uau173cYAUUewHmEl1pg8lQjE/qeu2hk+cEvjzCoTgz3tDF8TtZws1g+b+P6jdXJbK2wk0ZmLpq831qF33skCzfOjOGXwcRYhW06lJdVi/KEJLktDf1lVmP55roNABloPjQp/AkS+lYdDgXHeP2hiX6WCFsfhL+v8/t/9E/jeUeuhci0vo950/db2yY9GrL+NeIS73WNdOtIKVWjAbM0PFSL8K87/CLmAdbsmaGPdPneqxgAUqBHDBfLxj/WPmmNwElYcdnVtpRQrx9IryO8pzxALC39TpYQzvz3rF1gtECRZc6419OyEvb2935nfDdO/bm5v8a8wa+cO/vc/rU10bQWjz/BvP5tV0Q/0pM4MRRemRg+p7MerwpzHWvbr5vsI/Ic/fFURy19TUp835AYxCT0zV33kXfVOs9bOdFP51W7sKdHys95tswXd5CYqagLEf8mPH39nLct6FJtoX65oRPjuQ9dG2AixSu0Ew4ho39Xf0hJo8l8Kvaf1VP+VJP4r1z60r/bxBhKd33Yy149oKipjIBEP4tzc1q3sGhhIovHO4gkbDVePkaK/7quTH+dUpJ36SLiMh+s3n4twq/z+lYrRga+eUcTtayDSeUte60Z/V1Yu17Bo31MdLlGk/m0/sR2GP6T/vfU1HZPfrBZuLj9Mfrg7ZffVWt/C0n0swp4bV6lbrZkXTqdu4HgRXHh4lYoiOG00UTY1O9h7AZ1D7FTbkmFP8G8/qKrIhaxXa9Q9SFNjN5vXwbjFDSWzKc7Db42iF7pNrqThO9OaJSsUhRKPZeYgSLKu2hh0I9d3ndVZQ28epbWSKCIfzJhkWkcf8j3sU7l9CKiEzpWuLgo2kuET73/WeTzmevugb+6uFVuz85e6Ce98CeY1+9cAZYIAd/l9VcRiF6X6q3gTcSGshtJ5pO+LHXx3eFQnHgF97E76EVUKqz67FcRg82z62FZ38jlfSGGaoyBcaLC' +
                'IgaATDHMqq4s0DnimZ4ngvIl0otcuoGhxmqWYNyR9/zz1nM6rvh8cn+IIfrJ2ae/y+9ilsIIT+nxr1zcvP6i6x0pMmRd5cUazFK+HW335OJCiY0k86kIi3FRdbqqvIXuKjQCoPkC1tDfwfbUhL6YucRFjyu5xYjZWRVvXL3k2H0ZTtRTlzyS3/3nfhXvXT3N7UP++1f/d//Sv3+XQFBuB+jtl6MyKcR/+zn9SwT9lWdUfj4XLk0dm0L0kzh6SZbz6eB1EXFDvSnAooOJZemVbNm7PBCmnhiu26cXduVsocgmDcMbowgf6b1JRb0HfS73rxhmEx2MsohB+67itFhsQl/uekqC5X3i3d1UMHwWkc9yF6cNNdNLXpUbMLrEL9N3MmUxuSPXTJ2apKKfxOPXucmYwWXepwIs6vVbrcdlDS97n5bfZD0wDBcJvINTNQLEQPyy4/ikYnQSMRAcHKwTJPQtXP9ZRjzPoypRAzUMZq7+VRl1CcqTGzgqmlPXv5LEMl01Sb3MMkr4S3OTVivqoybN9Q2rofPqlr3GjP7nvkRKIgzERivzqReddXyAWBxqkwQJfddDWNOdYHnfu4BEv6xH4p/ci+xJX5Bn9LEnX1mSamsxzGI9/lWER/GgO5f1Eeua631b9g42sa+U+BlqILZSma8k/l0cIC4rJsHGJvQNwdsvt8Vj5PlVvcrMpVu6WhePYxP90jN60qV+5x1+TuLl/1RnlUyz8KeY1+9r5zHsPPedt/aK1z8xXGvdkyaT7xka1r5us3qj7qjXpQFC3plfqoh+goS+5ZDCvwmW951VXXZXCil31auU7zUdo+hvPae1P2TMfe+6E6WRceYX9fI3dX6QSfgTzOv3cmMVixcQ4PVnhmt1vg11LXxoVKgzqzy2NtNpa4C4lcE6YFosj/gsqce/cgMjxfK+qpXcSl7lTy4+4z9lH/pZvtcY5vQD+sVKna7LFg186ZeXYog0sY9DjMefO3sY8UPfN1Yp' +
                'ef3Wl3qeyOPvtPAbo0KdXOUhm+m0MEDIgHDuP7uyoawJfTHZ5XM3XGK8/qPQ88Vr0w1fflJPu2lhedTPlbDxbOxe/gFDLdcIwLmO688NPZuf1cPPm7znN/4DQwdz65Ksl4FM9yIfBLpm+3fj6d/N1fprfQ29gD//TYfbRqJCvxlOPe+DYaj3J4P6zKVdxlUsBVwNICoGfzXMpN9kekwT951n9+cy0huEPvpZZaVndZbg2bw8F3lGbT+bYOEHqGgQ3TtbMt+qp/c71UMGCQkJV5neKELPxWB9j9iPTlyOtd8UP93W77vYuD+jfcXv94TwGzHaJqVnUzy3fc9H3u1N10peI/yQWgSLyneh8/qSzDenBQEA6uVvNAEkxrLEsxclmwEAEH6A7719Ee9BJPMBAAwVQv2QSvQlye2z4dTzIazyAADA44cxib4kueSGU98j+gAAePzQL9EnmQ8AAI8fRkTuSOYDAED4YRTevmTwvw087WVLWZL5AAAQfuiX6M+drYLjXHe/AwAAhB96IvrWTZo+BGw0AwAANUByH4SKviTzicceWmP8VjaboQUBAPD4oV+sDaIvyXxzmg4AAOGHfnn7uQvP4CeZDwAA4Yceir547BeGU0nmAwBA+KFnoi/JfJ8Mp5LMBwDQMUjug0OiP3HfkvmOAk8lmQ8AAI8feib6ksF/YxB9kvkAABB+6CGyVp9kPgAAhB9G4O1LLX2S+QAAEH4YgejL3PyvhlNJ5gMA6Dgk9wEAAODxAwAAAMIPAAAACD8AAAAg/AAAAIDwAwAAAMIPAAAACD8AAAAg/AAAAIDwAwAAAMIPAAAACD8AAADCDwAAAAg/AAAA9J//F2AA16O5hU8xXAQAAAAASUVORK5CYII=',
                alignment: 'right'
              },
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            alignment: 'center',
            style: 'title',
            text: [
              {text: '\nPRIMAS COBRADAS ', bold: true}
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            table: {
              widths: ['*'],
              body: [
                [{text: ' ', border: [false, true, false, false]}]
              ]
            }
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            style: 'data',
            columns: [
              {
                alignment: 'left',
                style: 'data',
                text: [
                  // {text: 'CLIENTE:   ', bold: true}, {text: `${this.search_form.get('xcliente').value}`}
                ]
              },
              {
                alignment: 'center',
                text: [
                  {text: ''}
                ]
              },
              {
                table: {
                  alignment: 'right',
                  widths: [200, -49, 5],
                  body: [
                    [{text: [{text: `Caracas, ${new Date().getDate()} de ${this.getMonthAsString(new Date().getMonth())} de ${new Date().getFullYear()}`}], border: [false, false, false, false]} ]
                  ]
                },
              },
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            style: 'tableExample',
            table: {
              headerRows: 1,
              widths: [120, 115, 120, 110],
              body: [
                [{text: 'Póliza', style: 'tableHeader', fillColor: '#fdd213'},
                 {text: 'Nombre', style: 'tableHeader', fillColor: '#fdd213'}, 
                 {text: 'N° de Contrato', style: 'tableHeader', fillColor: '#fdd213'},
                 {text: 'Monto Prima', style: 'tableHeader', fillColor: '#fdd213'},]
              ]
            },
            layout: 'headerLineOnly'
          },
          {
            style: 'data',
            table: {
              widths: [120, 150, 120, 120],
              heights: 20,
              body: this.buildReceiptBody()
            }
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            style: 'tableExample',
            alignment: 'right',
            table: {
              headerRows: 1,
              widths: ['*', 80],
              body: [
                [{text: 'Monto Total:', style: 'tableHeader', fillColor: '#fdd213'},
                 {text: `${this.mtotal}' '${this.receiptList[0].xmoneda}`, style: 'tableHeader', fillColor: '#fdd213'}]
              ],
            },
            layout: 'headerLineOnly'
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            columns: [
              {
                style: 'data',
                text: [
                  {text: 'Sin más a que hacer referencia, me despido'}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            table: {
              widths: [200],
              body: [
                [{text: ' ', border: [false, true, false, false]}]
              ]
            }
          },
          {
            columns: [
              {
                style: 'data',
                text: [
                  // {text: 'NOMBRE APELLIDO:      '}, {text: this.search_form.get('xnombres').value}
                ]
              }
            ]
          }
        ],
        styles: {
          data: {
            fontSize: 10
          },
          color1: {
            color: '#1D4C01'
          },
          color2: {
            color: '#7F0303'
          },
          header: {
            fontSize: 7.5,
            color: 'gray'
          },
        }
      }
      pdfMake.createPdf(pdfDefinition).open();
      //pdfMake.createPdf(pdfDefinition).download(`ORDEN DE SERVICIO PARA ${this.getServiceOrderService()} #${this.search_form.get('corden').value}, PARA ${this.search_form.get('xcliente').value}.pdf`, function() { alert('El PDF se está Generando'); });
    }
  }
}
