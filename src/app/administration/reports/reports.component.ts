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
import { ColDef } from 'ag-grid-community';
import { footerLinePDF, headerLogoPDF } from './images.const';

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
  mtotalUSD;
  mtotalB;
  xtitulo: String = "";


  columnDefs: ColDef[] = [
    { headerName: 'Contrato N°', field: 'xpoliza', width: 110, resizable: true },
    { headerName: 'Certificado N°', field: 'ccontratoflota', width: 120, resizable: true },
    { headerName: 'Nombre Asegurado', field: 'xnombrepropietario', width: 170, resizable: true },
    { headerName: 'Sucursal', field: 'xsucursalemision', width: 130, resizable: true },
    { headerName: 'Cód. Inter.', field: 'ccorredor', width: 105, resizable: true },
    { headerName: 'Nombre Intermediario', field: 'xcorredor', width: 170, resizable: true },
    { headerName: 'Recibo N°', field: 'nrecibo', width: 140, resizable: true },
    { headerName: 'Monto Prima', field: 'mprima', width: 140, resizable: true },
    { headerName: 'Moneda', field: 'xmoneda', width: 100, resizable: true },
    { headerName: 'Fec. Emisión', field: 'femision', width: 140, resizable: true },
    { headerName: 'Días', field: 'ndias', width: 80, resizable: true }
  ];

  constructor(private formBuilder: UntypedFormBuilder,
    private authenticationService: AuthenticationService,
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
    if (this.currentUser) {
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 122
      }
      this.http.post(`${environment.apiUrl}/api/security/verify-module-permission`, params, options).subscribe((response: any) => {
        if (response.data.status) {
          if (!response.data.bindice) {
            this.router.navigate([`/permission-error`]);
          } else {

          }
        }
      },
        (err) => {
          let code = err.error.data.code;
          let message;
          if (code == 400) { message = "HTTP.ERROR.PARAMSERROR"; }
          else if (code == 401) {
            let condition = err.error.data.condition;
            if (condition == 'user-dont-have-permissions') { this.router.navigate([`/permission-error`]); }
          } else if (code == 500) { message = "HTTP.ERROR.INTERNALSERVERERROR"; }
          this.alert.message = message;
          this.alert.type = 'danger';
          this.alert.show = true;
        });
    }
  }

  onChangeDateFrom() {
    let fdesde = this.search_form.get('fdesde').value;
    let fhasta = this.search_form.get('fhasta').value;
    if (fdesde) {
      if (fhasta) {
        if (fdesde > fhasta) {
          alert('La fecha desde debe de ser menor que la fecha hasta');
          this.searchStatus = false;
        }
        else {
          this.searchStatus = true;
        }
      }
      else {
        this.searchStatus = false;
      }
    }
    else {
      this.searchStatus = false;
    }
  }

  onChangeDateUntil() {
    let fhasta = this.search_form.get('fhasta').value;
    let fdesde = this.search_form.get('fdesde').value;
    if (fhasta) {
      if (fdesde) {
        if (fhasta < fdesde) {
          alert('La fecha hasta debe de ser mayor que la fecha desde');
          this.searchStatus = false;
        }
        else {
          this.searchStatus = true;
        }
      }
      else {
        this.searchStatus = false;
      }
    }
    else {
      this.searchStatus = false;
    }
  }

  getTitulo() {
    if (this.search_form.get('xprima').value == 'PENDIENTES') {
      this.search_form.get('xtitulo').setValue('Pendientes');
      this.search_form.get('xtitulo').disable();
      this.xtitulo = "Pendientes"
    } else {
      this.search_form.get('xtitulo').setValue('Cobrados');
      this.search_form.get('xtitulo').disable();
      this.xtitulo = "Cobrados"
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
    this.http.post(`${environment.apiUrl}/api/administration/search-poliza`, params, options).subscribe((response: any) => {
      if (response.data.status) {
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
            mprima: response.data.receipts[i].mprima,
            xmoneda: response.data.receipts[i].xmoneda,
            femision: response.data.receipts[i].femision,
            ndias: 15
          })
          if (response.data.receipts[i].xmoneda == "USD") {
            this.mtotalUSD = response.data.receipts.reduce((acc, curr) => acc + curr.mprima, 0);
          } else {
            this.mtotalB = response.data.receipts.reduce((acc, curr) => acc + curr.mprima, 0);
          }
        }
        if (this.receiptList) {
          this.generarReporte = true;
        } else {
          this.generarReporte = false;
        }
      }
    },
      (err) => {
        let code = err.error.data.code;
        let message: string;
        if (code == 400) { message = "HTTP.ERROR.PARAMSERROR"; }
        else if (code == 401) {
          let condition = err.error.data.condition;
          if (condition == 'user-dont-have-permissions') { this.router.navigate([`/permission-error`]); }
        } else if (code == 500) { message = "HTTP.ERROR.INTERNALSERVERERROR"; }
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

  buildReceiptBody() {
    let body = [];
    this.receiptList.forEach(function (row) {
      let dataRow = [];
      dataRow.push({ text: row.xpoliza, border: [false, false, false, false] });
      dataRow.push({ text: row.xnombrepropietario, border: [false, false, false, false] });
      dataRow.push({ text: row.ccontratoflota, border: [false, false, false, false] });
      dataRow.push({ text: `${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(row.mprima)} ${row.xmoneda} `, border: [false, false, false, false] });
      body.push(dataRow);
    });
    return body;
  }

  createPDF() {
    // if(this.search_form.get('xprima').value == 'PENDIENTES'){
    this.mtotalB = this.mtotalB ? this.mtotalB : 0
    this.mtotalUSD = this.mtotalUSD ? this.mtotalUSD : 0
    const tipoPrimas = this.search_form.get('xprima').value;
    const pdfDefinition: any = {
      content: [
        {
          margin: [0, -40, 0, 0],
          alignment: 'center',
          width: 600,
          height: 100,
          image: headerLogoPDF,
        },
        {
          columns: [
            {
              margin: [0, 100, 0, 0],
              alignment: 'center',
              style: 'title',
              text: [
                { text: `\nPRIMAS ${tipoPrimas} `, bold: true }
              ]
            },
          ],
        },
        {
          columns: [
            {
              text: [
                { text: ' ' }
              ]
            }
          ]
        },
        {
          table: {
            widths: ['*'],
            body: [
              [{ text: ' ', border: [false, true, false, false] }]
            ]
          }
        },
        {
          columns: [
            {
              text: [
                { text: ' ' }
              ]
            }
          ]
        },
        {
          margin: [350, 0, 0, 0],
          table: {
            alignment: 'right',
            widths: [200, -49, 5],
            body: [
              [{ text: [{ text: `Caracas, ${new Date().getDate()} de ${this.getMonthAsString(new Date().getMonth())} de ${new Date().getFullYear()}` }], border: [false, false, false, false] }]
            ]
          },
        },
        {
          columns: [
            {
              text: [
                { text: ' ' }
              ]
            }
          ]
        },
        {
          style: 'data',
          columns: [
            {
              alignment: 'center',
              text: [
                { text: ' ' }
              ]
            },

          ]
        },
        {
          columns: [
            {
              text: [
                { text: ' ' }
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
              [{ text: 'Póliza', style: 'tableHeader', fillColor: '#fdd213' },
              { text: 'Nombre', style: 'tableHeader', fillColor: '#fdd213' },
              { text: 'N° de Contrato', style: 'tableHeader', fillColor: '#fdd213' },
              { text: 'Monto Prima', style: 'tableHeader', fillColor: '#fdd213' },]
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
                { text: ' ' }
              ]
            }
          ]
        },
        {
          columns: [
            {
              text: [
                { text: ' ' }
              ]
            }
          ]
        },
        {
          columns: [
            {
              margin: [0, 20, 0, 20],
              alignment: 'center',
              style: 'title',
              text: [
                { text: `Montos Totales`}
              ]
            },
          ],
        },
        {
          style: 'tableExample',
          // alignment: 'right',
          table: {
            headerRows: 1,
            widths: ['*', '*'],
            body: [
              [
                // { text: 'Monto Total USD:', style: 'tableHeader', fillColor: '#b9d4ff', border: [false, false, false, false] },
                { text: `${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.mtotalUSD)} USD`, style: 'tableHeader', fillColor: '#fdd213', border: [false, false, false, false], alignment: 'left' },
                { text: `${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.mtotalB)} Bs.`, style: 'tableHeader', fillColor: '#fdd213', border: [false, false, false, false], alignment: 'right' }
              ],
              // [
              //   { text: 'Monto Total B/. :', style: 'tableHeader', fillColor: '#b9d4ff', border: [false, false, false, false] },
              //   { text: `${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.mtotalB)} B/ .`, style: 'tableHeader', fillColor: '#b9d4ff', border: [false, false, false, false], alignment: 'right' }
              // ],
            ],
          },
          // layout: 'headerLineOnly'
        },
        {
          columns: [
            {
              text: [
                { text: ' ' }
              ]
            }
          ]
        },
        {
          columns: [
            {
              text: [
                { text: ' ' }
              ]
            }
          ]
        },
        {
          columns: [
            {
              text: [
                { text: ' ' }
              ]
            }
          ]
        },
        {
          columns: [
            {
              text: [
                { text: ' ' }
              ]
            }
          ]
        },
        {
          columns: [
            {
              text: [
                { text: ' ' }
              ]
            }
          ]
        },
        {
          columns: [
            {
              text: [
                { text: ' ' }
              ]
            }
          ]
        },
        {
          columns: [
            {
              text: [
                { text: ' ' }
              ]
            }
          ]
        },
        {
          columns: [
            {
              style: 'data',
              text: [
                { text: 'Sin más a que hacer referencia, me despido' }
              ]
            }
          ]
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
      },
      footer: function (currentPage, pageCount) {
        return {
          width: 600,
          height: 20,
          margin: [0, 19, 0, 0],
          image: footerLinePDF,
        };
      },
    }
    pdfMake.createPdf(pdfDefinition).open();
    //pdfMake.createPdf(pdfDefinition).download(`ORDEN DE SERVICIO PARA ${this.getServiceOrderService()} #${this.search_form.get('corden').value}, PARA ${this.search_form.get('xcliente').value}.pdf`, function() { alert('El PDF se está Generando'); });
  }

}
