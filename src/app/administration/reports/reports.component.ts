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
      const header = {
        columns: [
          {
            width: 600,
            height: 85,
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABdwAAADwCAIAAACVATHZAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAFSvSURBVHja7N15mFxVmT/w73tv7VtXd/WSzp4QthD2AGFfBFQIA7IoiEIGFRxHwXH4uY3gwrjjgjqjoiKiCAzIogFRFEEQw76FPWRPOun0Xl1d673v74/q9Ja6t7o73V3p7u/n6Weese+tqnPfe26R8/Y57xHrpQSIiIiIiIiIiGhiGQwBEREREREREdHEY1KGiIiIiIiIiKgCmJQhIiIiIiIiIqoAJmWIiIiIiIiIiCqASRkiIiIiIiIiogpgUoaIiIiIiIiIqAKYlCEiIiIiIiIiqgAmZYiIiIiIiIiIKoBJGSIiIiIiIiKiCmBShoiIiIiIiIioApiUISIiIiIiIiKqACZliIiIiIiIiIgqgEkZIiIiIiIiIqIKYFKGiIiIiIiIiKgCmJQhIiIiIiIiIqoAJmWIiIiIiIiIiCqASRkiIiIiIiIiogpgUoaIiIiIiIiIqAKYlCEiIiIiIiIiqgAmZYiIiIiIiIiIKoBJGSIiIiIiIiKiCmBShoiIiIiIiIioApiUISIiIiIiIiKqACZliIiIiIiIiIgqwMMQ0OQkEB+MIMQDIwwARhDiBQAJiW8ujABUh/E2AlUUmjS/HWIAgJUEbEBhdQEKuxtqMdxEREREREQ05piUoT2emPA0wKwWMw4zDk8NzAQ8NTCr4akVIwLvDKgN74z+mV9iADKCj1BbsDODY7VBc9CC5jYAitwG2Cnkt8HqhNWuVhsKbSi0wE7yzhAREREREdHuYFKG9jy+ueKbD988eOfCUwtPrXjqYMZhVsPwAQZg7Ey7GID0znAZURZmiIEvNWYBCkB8CwAANtQG7OL/I3YKhRa1WlBoQ2EH8luRW6+59cith93DW0dERERERETDx6QM7QF8cyVwEAL7I7CP' +
                'eBphxmFWwQhDPBATMHr/78QRABDPwP/Vy4zBO0PU2pmsKcDOitUBO6mFNuQ2IP2cZtcisxp2ijeWiIiIiIiI3Aaf1ksJRoEmttP54akT/yIE9kfwQAkcACMCIwQjAAn01oWZlGzYOdgpaBZ2j+Y3I/Mqep7VzOuwWlBo5Z0nIiIiIiKiQeNjJmVoIhgB+PcT3wL490ZgPwnsDyMEIwQjDPFN2au2e2AnYfeg0KqZ15B5Bdm3Nfs68k3sEURERERERMSkDI0n7xwJL4V/MfwLxb8vzBiMCIwwxJx2odAcrCTsbs1tQPZNZNdo+gX0PMM+QkRERERENG0xKUPjIHiQRE5EYLH45sI7G2YNjMBuFeKdYooJmsJ2zW9G+hX0/FN7noHVxcAQERERERFNK0zK0Bgx4/AvktCRCB8p3nnwzYMZG/tPUQua6/2xe6B5LWyH2r17V8MqNgV2NwrNsLM7N2bqe7kNMWHWwFPbW6lXBGZcPA2qeTEi8NQCgBGG4ZugAjeaQ26j5rcg8ypST2j6eeS3sTcRERERERFNB0zK0O4xayR4IIKHIHSoeOfBPx9GdGze2U6i0AarXa0O2N2wOlBoRaEFVjusbtjdqjmoBbsLUKjCaituZQ0INA+7G1rYZXqOAtJbzgbae76EYEahFgy/FBtvBGBE4KmDEYKnFmYNzCqYUTGrYVb37gw1HnLrNLsOmZfR85Rm3kBuPfsXERERERHRFMakDI2y5yC0VIJLEDpGAvvDN2e38xSK/Fbkt2puM6x2WC3INyHfpMUUjGZgd8POQDNQawKv0te7J1SxJrEREU8tPLXwzoQnAbNKPI3wzYKnYSzLFWsB+U2aXYuep5B+UVNPwO5hhyMiIiIiIpqCQ2smZWhkfAskdDhCh0noKPj3hhEa5fuohcJW5LZobgMKzchvQX6z5puQb4LVAc3vnPayhz44MAIwovA2iKcR3gZ4G+FphH+BeBrhnQkjOAYfUszOpP6Bnme15zlkXmHvIyIiIiIimkqYlKHh' +
                'MWvgXySRExBaKqEjYFaN+B00C6sDhR2a24LceuQ3IrdJcxuRWw+7e0o8TF749xLvLHhnw1MP33zxzYV3Jjw1u7ukS/Pa8xRST6H7Uc2+iUIz+yMREREREdFUGEcyKUNl+PeWwP6IvkOCByOwZMQvz29DoUkLO9DzPHJrNb8FuS3IbwHsKR43Mw5vo/jmwzcX/n3hWyCeBDwN8OzGE5d9U9MvoetPmnkV2TfYN4mIiIiIiCY1JmXIqWt4EVgiwYMQO0OCh4wslaB55NZpvgm5jeh5WjOvIr91DOZ3mDUwwig0QQuTLJhGEJ56eGdJYF8ED4dvdu+EmtHt7mR1avp5dP1Re55FZvXkiwYREREREREVR95MytBQRhSBfSR8vMTPRWDxCF5odSG/RXMbkHkNqcc0/QKsrjHqp14JHYWqs+BJIPWkdt43uZfweGoleChCRyK4RHzz4G0c5fqmzCva8Tvt/huya2Cn2XOJiIiIiIgmFyZlaABPAv59JHKyxN8D34JhvUQLsLuQb9bsa0i/oqkn0PPUWDfLQHiZMes78O/d+5nN39Pmb0zoNkzj9fyZCB0h4WMQWCz+feBpgBkb8fSZ9MvaeZ92/xXZtbBT7MVERERERESTZlDIpAwBxXTMvlJ1tsTOhHfGsF5itaHQoennkH5e0y8itWrc2lYnjddJ/Pz+3+Q22GveAatjSt2C0FIJHojgUgkthVkFTw1gjODlmVe0815N/hXZN2Fn2KOJiIiIiIgmwVicIZjuzGr4F0n8PIm/F2as/Pl2GlarZtci+SftfhyZ18a9ZK9voQQPGfwrGWU1lj1ZzzPa8wzwSw3sL6GliJ4mgQPgScCIDOvlgQMkcIBUnadtv9KuP6KwHZpn7yYiIiIiItqTcabMNGaE4JsnNR+U6othhMucrAXYKRSaNfmwdt6L9IvQ3AT10eipMvsGeBr6f9XznL3uPNjJKX6D/HtL/DyJnQFPA8woxDfcF/Y8rS0/1dRjsDqmwiIvIiIiIiKiKYozZaYl' +
                '8cM3S2JnSe1H4alzPVVhZ2B3a8+z6P6rdtxTgUVDnkSpOrg69W9T9i3d/g1t/o7E3oXYcgkdAU8tjCAgZV4YOkLmHoHkn9HyY+15DnbPtAgXERERERHRZMOkzDQjHphxqTpLEh+Bfx/XU23YWeS3aNdKdD+u3Y9UrtHm4Ooqtlod02htjua18w/o/IOGjpDICVJ1NnzzYQTKVpyR6OkIH4e2X2vbzcit52omIiIiIiKiPQ2TMtOHQDwSOVnqPoHQkRDT+UwbmkfmNW37lXY/itzGyrd84EQPLaCwA5qddjew52nteVrb75DIiVL7Efj3gXjLzJoxQlJ7hURP1pYfa/vt0AKnzBAREREREe05mJSZNgL7St1VEjsTRsjtNDutPU+j7Zfa9eAeMYYXc+eanYG/lOl7H/Obtf232nmfxM+TxL8isLj8Jk3+fWTmNxF7t277GjKr+SgQERERERHtIZiUmQbMuFRfKHWfgFnrNkHGzmjyQbTdqql/ANYeUyDWgOEf9AstoNA+ve+owu7W9lu143dS+zFJXDqoCnJJ4pPoqRI8RHf8SFt/MR3nGREREREREe15mJSZ4iR6KmqvkNARbjsr2z3aea+234b0S9AstLCHXcTgRJIWYLXxzkIL0G7dcYMmH5Lq90n1+8vMgYIBT700fBqhpdr8LWReZwiJiIiIiIgqi0mZKXxv66T+aqk6G2Yc4nSjVdtv17ZfI/sG7O49cftk8cOsGvwbKb9gZ/rQLNIvavYt7bxX6j4p0VPLnG9EJPZu8e+jzd/WzvsYPyIiIiIiokoO3BmCKUliZ0r9f8K/D4yA43C+4/+07dfIvAGrfc+u/zq4gozmUdjBWzyADbsbqac0+wnEzpC6T8A33zWcXgT2k5nfhHeWtvwvw0dERERERFQpTMpMOd5ZUvtRiZ/rWGdEC9r9CFpv0vRzKLTs6Zdj+IeuylEbdjfv8y5sFHZo++2afkGqL5Lqi4dWRx766NdK/afgX6jbvgqrneEjIiIiIiKaeEzK' +
                'TCkSPRV1n5DgoY7lRVL/1PbfaGoVchsmxyWZVfDU7fJbm/e6tOJqpvxmpJ6Q2isQOso1tnGJXwhPozZ/G+kXGDwiIiIiIqIJxqTMVGEEpe6TEj8fvnmlT8i8ou23afJh5NbueaV83S6s1PIlFvp1VWjVzpWafUvi75XEv7rVeDYCEnun+GZp50pN/gW5jSyiTERERERENGGYlJkSggdL3ZUSPRVGuMRRq0s779b225F+CZqbZJdmhGVIoV+oambq3Dvx7sw6KWDACEFGUsbYzsBOlTyAzGu64wakX5LaKxBa6vYmgSXimydVZ8HqVCsJOOXsDGgG+WbYKRRaUGjS/DbkNsLudmgDERERERERuWFSZvIP6uMXSO1HETy4xDHNa/IvaL9Ve55GoXVSXp4RhBkbclGTYKaPeCEBmGGIHxKAWQUxxExAvBATngYYYWgeZhSeWogfsKEWjCDMKsAYdt1lgd2D/GakX9bUP5FbN/S41aGd92huvdR8QOIXuO2ZbUQROABDZyU50BzsFKyk2EkttEEzyLyG3AbkN/WnaYiIiIiIiKgcJmUmMzMmiQ9LzSXwzi5xNP2idtylXQ+WGKtPIqrQwRVk7OQetMRGTJjVMKvhSYhZBTMBww8jBk89zDDMGhhhEX/v/BcjCjEBA0YY4gVsiA/i2/0YodCM7FtouVGTfy6RsUo/r9s3Iv2C1Kwonbwb8VX7YPpgVqMviRM5EVYSVqtY7Zp5E9m3kNuo2beQfYOPKRERERERkRMmZSYt/75S+1GJn19ikx27Wzvu0fbfoufpyX6VYkaHzpSxs7CzFWqNF556eBvEUwdPIzz18NTAk4BZI2YNzBjMGMQH8Y5FqmUEzYKnQTwN8NTD7tHuR0qcUmjVtl9r5k2peb9UnVtmY6bRNMEHTwKeBAAJHQXNorAD2XXIvIrcGk2/hPSLk6qSERERERER0URgUmZSksgJqPukRE4ocSy1Sttv1857p8gSErMKZs3gXxUmqDKOEYQRhSch3tnwzoB3' +
                'Jjx18NSJZwY8dfDOmNjMyzD490F4GUomZYp6ntTMq+h5DlXLJbQURnTcOqgf3tninY3I8dCCpF/S9AvIrNb0i8iuYQEaIiIiIiKiIiZlJhvxSdXZUnclAvsPPZTfol33a9utyLwyda5XrcEbYKtaSVid4/JZRhSeGpjV4p0NbwP8i2Am4K0X7xx4GmAE9vRY5dYj83qZc+yktv0KqccQPg7x88S3F7wzxrnHehA6TEKHQfOSfk7TL6LnWc28guxbUIsPNBERERERTWdMykwqZlyqL5S6q+CpG3JEU4+j7Tfa+fvJt7+SO8MPMQdeKDQ7ltdoVsM7QzwN8DbCvw/8C8QzE96Z8FRD/ONyRWpB07B7oBbsFDQLKKzu/i2l7DSsNoh3JG/qhfYg+VdN/mVYp2fXanYtUv9A6EiEDod3tphVMKIwYyhWwBnz9U0AxIvQURI6CvF2pF9C9yPa8zQyb3ITbiIiIiIimraYlJk8vDMk8WFJfHTolI3CDu26X1t+iuxbU/CqzcSg5IgqNL/b7xmDd6Z46uCdi+ABElgC/z4wq0aYB3GledhJ2D2wU7C6AUutDmgB+SZoBoU2FFqhWVitanUDFgqtsDohBrSYdcoCI9kYGwLND55SNAzZtzX7NtrvgBFSb6N4GuBtgBGFpw6eaph1MAIwgiIBGAEYYRhBGCFIcHdTNma1RE5E5ETJbdTkQ+h6QLNvIL+NjzgREREREU03TMpMEr65UvdJqblk8G9tpF/Rtl9q2y1T98qH7NFswUqO/E0MGGGYVfDNFt8C+PeR0BEIHggjvHtts2HnoFloBnYaVpdabbA6YHXA7kF+C/LNKDRrfgs0h/zWPTXCNuxuZN/Skkk98amnBkZMvA0wa+FtgFkNT30xnuKphxmDEYHhhwQgnhH36sSHUPNBdNyFrgc1/SLyTSNOLREREREREU1aTMpMBv59ZMYXJHbG4OxEh3Y/ojt+hPQLU/ritUQSYZjEBzMOT0L8+yCwH/z7SejQ0tuHD7MldqZ3' +
                '5ZGdhdWm+a3IN6GwA4UdKGzT/HYUmlHYMbXCn0N+G7BNs28OPWRWq2+2eBrhmw9PHL694J0hnsadaZrA8G+TVL8f8QvQtRKdv9fUkyg086EnIiIiIqLpgEmZPV7wIKPxqwgfPSg7kNukbbdoy4+h2ekVDbVg95Q5xwjCrIYZl+BhCB8pgQMR2HeUOyXZPb1LkOwezW9Bbi1ym5Bbp/kmWO0otJRvzBRmtSPdrnh5Z9gDMKvVO1sC+yFwoISWwlMNIwazaljvJl6peg+ip6PzD9r2a2TfhNXOp5+IiIiIiKY2JmX2YOJB4ABj9g8QOKD/l5pD+iVtvn64JV2nGM04rAMyYPhhROCdIeHjED1VAkvgSYzwzS1oHpqB3QM7qYUWpF9A5jVNr0Z+M+zUGJSzmcLsDOwm5Ju052kAagQQWCzhYxB5h/gXwqyCESpfKMcIS/WFUnWmtt+mrb9AbvO0SzsSEREREdF0wqTMnko8CB1pzPo2/PsOGPf2aPIvuv2ryL49XeMyuNCveCBeGBHx74PAAYieItF37FKGxuXNLMCC5mFnUNiu+W3IrUfmFc28jvTzU20fqwlmZ9DznPY8hx0/0sB+UnW2hI+HfxHMWPlZS0ZUEpdL9DRt/r4mH0ShrdQqNiIiIiIiokmPSZk9kpgSPl5mfh3+RX35AxTatPVn2vJj2KlpHBoTRgTigxiQgAQPRvBQhI+S6KnDzcX0JmIKsNPIrdXsG8iuQeZ1zb6N3Dp2vXGReV0zr6vxA4mcjNgZEjkWnobyqRnfApl9Azr+T3f8D7JvQAsMJBERERERTTFMyux5xEToCJn9vQElaW1k1+n2/9bOP0zDcAz6X2ZUYmfAaoNvvoSORGBfmNXDeBOF2oAFO4PsG9rzNNIvanYtCk3ciXni2GntegBdD2pwicTfK/FzYSYgZpnbH3+vhI7Spms0+VcuZSIiIiIioqk24rVeSjAKe9Ytib1TZl4Pb2NfQkG7H9WmLyGzejpGI/ERmfn1XX6tw5sXo1Ab' +
                'mkd+o/Y8i+6Htec5FNpgp7jvcuUFDpDayyV+PsQ/jDuZ1+3f1LabYHUxckRERERENHXGvEzK7FlCRxpzfwbvzL6kg7b9Wpu/i/zm6VlWQ6reI7O/ByMyspdZXchv0exb6HlWux9Bdg1gAzbUZnWSPefeQrwIHSZ1n5TIyWWnzEAL2naTbr8eVhtjR0REREREU2RcxKTMHsS/rzHvl/Av6t2kprBDm7+nHXfBap++qYTQUcasbw3af8pFvknTzyK9GukXNP0C7BTUghY4L2YP/gYyYVRJ1VlS93H4FpQ5WXPaeZ9u+zIXnRERERER0dTAmjJ7jMASY/YN/RmZzKva9EVNPTHd62hk39D0C+KelOl5VntWIf2SZtcitwGahuZZF3ZyUAtWm7bfrunnpfbjEj/X7WTxSdXZsHt021c5X4aIiIiIiKYAzpTZM3gSxrxbEDqimJHR5F9023XccabYRRE8WBq/LOFjBw7lYXVp6p9I/UN7nkK+GVYHNAvNc3XSJL7Rnnqpeb80fL5MwSA7o22/1OZvs74MERERERFN+oEQkzKVZ4Rk1nclfm5vRqbjHt3+NW7PPKCTeuCdJaHD4NsLAKx2ZNdofgusJOwk7B5GaOowYxI5SRq/OqDQdSl2t27/hrb8hAEjIiIiIqLJPd5lUqbSd8Ar8XNl1vcgPgDa/htt/i5yGxmYXQJlQkIAgDzsDOMxdW+0R8JHS+PXEdjP7bT8Zt3yKU0+zIAREREREdHkZTAEFeaZIbUf683IdN6n27/FjExpasEuTo1hRmZq3+iCdj9mb7kS6RfcTvPORvX7y0yoISIiIiIi2rMxKVNR4pHgwQgsBoDMK7rtOuS3MipE6HnO3vIp9Dzt9vRET5XoOxkqIiIiIiKavJiUqWz4QwgfCQgKrfbWzyG3niEh6pV+yd76eWRecX58IoieyskyREREREQ0ibMCDEEliRf+/QDoju8h9QTjQTRI+nltuhaFHY4PUHiZRE5gnIiIiIiIaJJiUqai7By6H9HW' +
                'n2nbrxgMol1p96O64/uOu1+bcYSPKZZkIiIiIiIimnQ8DEEl2Slt/w3Uhp1mMIhK0tZfwrdQqi+GEdj1qPgXqW8esm8xUERERERENOlwpkxl2bC6YHczEESONKct/+uYdvE0iH8Rg0RERERERJMRkzJEtMfLbdDMaqhV4pBZBU8tI0RERERERJMRkzJENBkUmqG5Er8XP4wQw0NERERERJMRkzJE4/JkSeQE+OYxEGNGvBCD32NERERERDSlho4MAdFYE3hnyazvSOIyQBiOseFpLL3LkuZh9zA8REREREQ0GTEpQzTmT1VAqi+Eb4HEL4B/IeMxBjwJ8e9VOsOlBWiBESIiIiIiokk5fGQIiMaUwLeXJFYAgKdeEh+F+BmU3Y1p5ER4G0ofs9pRaGKIiIiIiIhoMmJSZpzH59458NQzENOIGZXqi+DpzSBI9YUIHsgHbXe/psLHw6wueUzzmzTzFmNERERERESTc7RD48c7W2Z9UxL/yjhPGwL/3lJ90YAnLCh1V8GMMjSj518goUMdCspYSK9GfhODREREREREkxGTBeM3PDel5v0SPR2hI+Gbw3hMC56E1FwGMzaoI0TfIeFjIF6GZ5RPUuwseOeWPpZ9C90PM0RERERERDRJMSkzbiPJ8AlSdQ4ACR4o4WUMyDS45aaElkn1+3b5vQ+Jy2BM88ky4vrj8hUVkvi5Q/JcO6mmntDUk+x6REREREQ0SXkYgnFhRJG4FP5FAGDWIHw0Ou6CWgzMlH6YZqDmgyWPSOQkRE7Qrvuh+ekYGfHA0wizCtASR+1u5DY4vjR+PrwzSx/LrkPyQWiOXY+IiIiIiCbrOJIhGJdBaO3lEjmpbwqAhI5E+BjtfoyRmbq33CPhoyVyktNhqf+k9jyF/NbpGBwzLrO+KeHjSx7UnlW6/sLSKUsjItXvh1lV+oWpxzX1T3Y9IiIiIiKavLh8aRyG5+FjJX4ujEj/r3x7IfIORmYq886SmhUQ0/EE//4SWw4jMC2jo1AbRrD0j1pQ' +
                'Lf0oxd8D/z6l1zflNqDrQdhpdj0iIiIiIpq8mJQZa2YcdZ+Ab9HgwaUp4SMQOIDhmZrEK9FTETrc9RxTai6Bd/Z0jZHtfEidoorwCU5pLO3+u3Y/yq5HRERERESTGpMyYz08r71CwseUmDERWCzhoxifqcm/jyQ+VH5/Jf/eEjsTRogBGxbPDAkdWjqqufXovA+aZZCIiIiIiGhSY1JmTIWPlqrzSo+6jSgiJ8NTzyBNuWcoLLF39RZ1diem1H4MvgWM2bCYVTCrS6xdsjPa+nNWkyEiIiIioqkwoGQIxm4MGZO6/4BvnuOQPHiwhI5knKaawP5SffFwHyVPQmougVnNsJUnXkiJqOqOG7T9Nk6TISIiIiKiKYBJmbEbQtZ+VMJHu5V69TQgdhoDNaWYNRI/D765I+gn8QvEvfoM9VJg6NOkLf+rrT+H1cnoEBERERHRFMCkzNiQyPFSfRGMoOtJpoSOROgIhmvq3PfQYVJ17sheY8ZQ/T546hi9Mgo7YCf7/6fmdMcNuuMHsNoZGyIiIiIimhqYlBkLnjqp/8ywNtbxzZOqf2HApsp9b0D8vfAkRvo6iZ4m4aMZvzIKzdr2W+SbYLUj9YRu/YzuuAGFFgaGiIiIiIimzrCSIdh9krgcoSNKVCQtcapPQkeqdw7ymxi3SX/fo6eI43o0RaENmi6dqjMiqFmBnufZDdxoXlt/hsyrEI9mXkNmNUNCRERERERTDGfK7PbIPHKC1FzsVkpmCP9eUnUG4zbpeWej6hwY0dJHNa8dd2jyb87d5niJnQphVtRVoVk779GOO5mRISIiIiKiKYlJmd3jSUjDZx03utYc1Br6SzOOyCllqs/QHk9i75bwMY6H7Yy23Yzuv0ELTm8g8Qvh22taBEstwHY+arsdHYNb5YERhRmDGYNZBSPIXBgREREREe0pSQWGYDcGe16p/RgcdrnW1D9gZyV8JCQy9HWBAxA+TpMPMYSTlX9vib/HMbOmlmZeQnatWp2S3wzfvNJL20KHS+xd' +
                '2rIOmpvq8XLPuegYf5oRhKcBnnox4/DNghGFp2FnIsaA3QmrE4Vm5LepnUS+GfnN7NFERERERFQRTMqMnkROlsQVDsPMLFp+DE8dQoeUinoC8fPR/XCJeTQ0CW68V+LnI7TU8QTtQfvtAFBo1a4HpPbfHN+p+r2aegI9T4++MWaVRE6CJ1FiSo74kd+kyb9Bs6N//8B+EjoKkF0SKwLYmnkVPc8ObU/0dBih/lSLnYEnIb75jkHwzUXNpdDC4DWAqh13wU6PrLX+ReLfG8GDEFgivnnw1MKsgvh2SYrZsFMotIvVrtk16HkSmTc1+yYKzezdREREREQ0kZiUGS3vTGn4DIxA6VF596OaekICB8FKwqwpMaoPHaGBg5B+fixyBB7HZWhaGDqW9iTgmSHeRphRwAC0d7xtdWthBwrbUGhz/iTbeTHOiBrscz5kQBUolE9XGUF46mHWiBmHGYfIoHyBWrA6tLAdhRZYHdD8WN764KESO9N56Z8iu37nNCjRtlul+sISfaA3ibCvVJ2tmVdg94z2Ca6Xhk/Dv2/po6lV2vMMCqNPykjkZGm8zuFCs2j9hQ5JyngbpfG/R7YjVWCxzPpOibfv+vNwkzLig39vCS9D9J0SOc6tg+3sPTCi8EWBuRI8GPHzUGhF8kF0PaTpF1l9mYiIiIiIJgyTMqNiBCRxOYIHlz5qdaLtFlhdmluL3FrxzSs9lo6/R3c/KeOdI7F3Q7wl14Bo1/3IbQJswIC3QYKHIXKshI5C4IBdymrYknlT0y8g+5ZjCkPz2nk3Cq271+BZUnW2c2CDyKzW7segDkkK8cI7SwL7IbA/goeLfy94Z8IIlzjTTknmFc28hsyrmn4euQ272/KdLZT4BQjs53iCndHOe3d+liL7hnY9JPHznOqYSOwMdP9dk38eddpkt08Y9culdGZKJrJSlcC/UCLvkOr3OT6Pw/oiTEj1xai+GJ33ov027XkOVju/54iIiIiIaLwxKTOacaCEj5Pay50Oa8ddmnoSAPJb' +
                'kXkTkZNKjGyNgISOUk8tCi271ZTwUTLza46Hs29qbgOMqESOQdV5Ej/HeX6HgcB+EtgPmod4Hd+wsE27Hhz9xBOzSho+J9UXupyi27+K5COlj3nnSORYVJ0t4WNhhMp8lhFG6EgJHQlAsmu0+1Ek/6w9z8Nq272AHy/Rd7g0H7n12vG7Qb9q/blEjoV3VukEh28u4uei50lYnaNqke0yq0hh7W4NXZe5UVoocVTHaDrVcFb2GRGJHIfE5RI5Ycye7apzEH0XWn+m7bch9zYXGBIRERER0bji7ksjHrXBN1caPu+4RCK3Qdtv7f8ze/o5xwVB/r2l6pzdbYwZdzyYW6fZt+BJSO1HZPaPJH5umdutlib/otuucyu8GjkZ4h9tY70Se7dbRkZzuuP72nJjiRoo4kXoKJn5NZn9I4meVj4jMzTUiyTxIZnzM2n4fwgeOIzlLU6PSxjVF8A31/EEu1vbfzu0cGz6ee1c6ZLJkshJEn0nH62RMWskcZnM+ckYZmR23uWA1H3CmP1D2Z3eTkRERERENJzxB0MwwqFglSQ+jOBBjmmFlh8j83r/L9IvaGa1w1tFEDvDbVpK+bsXgqfB4ZhqfgvUkob/kobPw6wu/25WGzp+p11/RL7JMX1QtRyemlG1VeBfJPX/6XKGdj+mrTfBTu3yUp9ETzHm/K/E3r179y4miY8Yc34msTNhREdzDVVnuW2DDUX2bW37dYkD7b9Fodkx2+WpRdVZw7pH1BuxhDR8VmZcCyMyXh8ROlxm/1Di53D3eiIiIiIiGj9MyoxoUG5K+Dip/ahzWuER7fz9oB2Os28j/ZLDIghDAgcgdPhuZBlq4N/LOUVgScPVUnPJcN8tt1HTz6Ow3a2+iVkj4WNHM9PEUyt1/wHfAscTCs264/vIb90l5h6JvkNmfgslS/OMgn+RzP6h1H9yxEkQTwJV5zhnwYBCm7b9GnZ3iUOZV7XjHpeytRI5QeLnT4nnUcbmKlwK03hnSOPXJHHZsN5Hc7B7YCdhtcHq' +
                'gNUOOwk7PawleJ46mfltqf7A6KdWERERERERuQ87GIIRjDZ9C6XhM46lTwstuv1bJXbVTT2OqrNQcktgMyo1l2nqqVEW/jBCztvciAQPRfjonfsrlWVr+llk1wBA9+Oo/uDg/YkHqDobyYdGVgpH/BI9XeLnOo+c89r87aGbKxcFDpC6q+CdVWbgPWgSilFm/pERkKqzkXpyJOV1RareI6HDXBqhmZeHVJMZdLj1pxI9BYHFpW+HEUbVmUj+Bbl1k/wpEWgP7IGzSxQQiM+p1DHUgmaH21GNsDT8l8TPK3eeQnMotGvqMWReQ2EHCjsAA7DhbYSnEaFDJHg4zGiZhIsRkobPwurQzrtZX4aIiIiIiMYckzLDD1WNJD6EwP6OSY0dP0T2zRKjw8xryKyWkkkZ8Un4CPXvhexbo2pStfgWOh41Y6VGqjZgD0hhGBADMJDbjNQ/e09KPy89T8JhnY4ED1bv7JEkZQTBA6ThM27pjPbbh84w2tk8qToboaXOL7VgtWnnH3ZG3oYEENhfIifCUwcxS83aUOTWa/P12v23kd39qnMcd7YGUGhB532lp8kU5bdpxz1SNxtmlUNgD0P8HG3+vltNnz1fboO98cMQX/9VaEHMGqm7EuFlpV+Sftbe9t9Qa/C+5ii1/5EhdR8vX4lJC8it1/Zbe3cfKzkpxgirb77UXCrxc2DG3Wb3mFUy44ua34TUKn4LEhERERHRGGcaGILhMSR8jMtSIO3+h3bcCbvURs75reh+ArHlDkO+hMTO1B3fH0WbRIKlMi9OTcwhu0a7H0HPs7C6esfMgX2l6myEjtTi/kQ78wua/Itj8RRPnYSP1eybpS+2xPn1UvsxeGc6npB+SXd8v/R+1YHFxe2TnK5I22/T5utRaIYOmGokHjWCEj4WNZdK5PihtVrTL9lN/4XUkyPKfUjNhxA80C266Re1/bdl7kD7bRJ7t+OCNSMk0dO08/6Sqb1Jw07vOuNJjSiq3+s0DUYLLUg9May7ED1Z4ueXKfKi' +
                'We24V7dfh/x2t1tsp5B5Rbd+Rjt+Z8z4AsJHu72nt8GYca297vzh9nkiIiIiIqJh5hoYgmHxL5K6qxxXOmhWm7/lMnlE088h/YLDHQhK1VnOq5DgPlaEBIZ1Zvol3fwJe+1Zuu067Vqp3Y9q99+1++/a+gt7/UW65T/RtRJWV994VZN/cZv0ETl+uAVZxCdVZ0jsLOchdEG3fw25TaVf7d8LgX0cXpjTzvt162eR3wa1AO3/0TysLk3+WTdcohsvR/rl/hcl/2pv/gRST41sNkpgP4m9E0bY8YT8ZrTfVn55S6FZu+6H1eF4QvBw9/3CJ+3XjM9tlZB4h/VFZARQc2npZYB97G5t/p5u+Y8yGZkB3Qg9T9ubLtf22937MQJLpO6T/CIkIiIiIqIxHi0xBOWZ1VJzKQKOEyV0x4+QfsmtLkz6Re15ynG8518ooWUjv3Uh+OY6Vn4Z2Ly2X9kbPqCdv4fVCc1DLcDu/dECrE5tv23ooDS/TTvucRyhRk6Ed/awGhk8ROr+06WR2vxtTT3pGDqz2nF7HSuJjjuhecext1rQnCb/ZG/6iHbdD0Dbb9Ut/4HM6yOt4CM1lyKwn1uEU09q1wPDSQFo6y/dJsKIKdHTJXwsn7kSsak6R4KHudWdsTq1+Tu644e71BhyZyO/Tbd+Tlt/4f64SfV7x6zaNBERERERUXGowRCUHQxK9DSpucQxs5B+UdtuLrGR86DBeB6ppx2nSEgQNR8Yebv8MMvPr9G2X+n2byK/1W27Gc0NredidyL5kPNHeyV8lNvMkSJvo9T+G7wzHD82+ZC2/cZtSo54HAfhYg5r6ZYWkH1bm66x3z6zNw4jrakcOlwipwxdAzVQfhM67x7Wbj4A7KS231Z6rVaRf29Uv58PZglVZ8Nb73KntfP32vpzaHbkb62wk9ryY03+xe0sT53EL+B9ICIiIiKiMcSxXzmBfaX23xzLWGhetxWrV5Qb9mVe1vTzTqkHCS9zK2dbkhmDt7HMOal/avN3S2wIVb65' +
                'lqZfhFODAYmd4Vb1FsWFS++R2OmOJ+Q36bYvo1A2dOJ0+ZK4HP6Fwxpy5zai56kS+20PgyQ+7L5kRrv+qMmHRxDajju1x7lkrJgSXibRU/jkDRI+Wvz7uH1f9TynO77vsul4ebkNaP+tWycRr8TeBU8t7wYREREREY0VJmVcmVVS/UEEFjsOsFt+rKl/DmvyRW4Duv/hPN4LSfXFI7x1IXEv7KJZ3fG90WUiAMBq1y7nyTLBg8Q1ISKhI6Xu310mmGjTl5ApV9HW6oBmHLtu8CBj1g8k+o7hXc9otjSSyEkSPsZtjVj2bXQ/CtgwY8P7qYKdQfJht0yZdzaqLxrOwrTpQyKnuGVDrA7tvA+5Dbv3IarJv7lOljHg3xv+RbwdREREREQ0Vrj7kutQMPZuqb7QcXiceUVbfjrc5RKaR/o55DbCN7fUJxkSPVl985DbONz0gVkNT73bByYf1tSq0e+vbGe0636pvRxmvFSDfYi+A+kXS6/J8s5G3cfgaXBsW+vPNflQ2WSWZtdIdg2ChzjcHg/Cy8T7bSQfRPJv6rLeapS334faK+CZ4XoXYqi+ROIXQLzDfFPYWXgSblsIiSnho1F1jnb8js9g7432L3BbQZZbp6nHxuCD7CRSTyB+gePdEZ8ED1fujU1ERERERGOESRlngQMk8RGYVSXTBchvs7d+Zhirbwa8pudpdD0gtR8tPVb3NEr0dG39xTDTKOJpgLfB+cMKaL9tt1ZzwEZuoyYflvi5pRsQOUnb7yiRlBG/VF8kkZMc37jnGW3+3rB2F86+rl1/EqekTJFvrtRciug7kX4fUv/Qzt+7VWwZUSog9i4JHV5mxoonIdFTICN8jtQq97a1qLkEyYdhtfNBhKdefPPcykVn1yL79ph8lGbfkuzrCB7q1CkQ2J83hIiIiIiIxgqXLzkwayRxGYIOOy5pQVP/QOZ1mDXwJIb7A3Xb+kdMqbkYZnTYI9U651K7itx67X5s9NNket+mB+23OR71L5LA/rt2IYkcL4kV' +
                'jlsgF3bYTV8YbjLLzmj77eU3NhI/fPOk6hyp/4wx92Zp+JzjjRvBkxGSxEdKzxIa8gSJF5CR/bgUMN75thI40CkdNv2+pcIwYo4R0wJyG4aV4xuO/DZ1ye+IIe57chMREREREY0EZ8o4DL6qzpKqc5yTVoYED8Gcn46s8IcWxFPrNhoPHCDBQzX1GNQq1z4vPHXOw1RLU/+EndzdKKil6ecl8woCB5Rqgw+hI5F8GFZb/y9981B7hePCJc1r87fR88xIBsmbdPvXAZXYmcPozrXw1ErocIm+Q7sf0677R/ZZAy+u+gMIHlrJrKUZlfh7tXPliGZjTU1mFIbPuZdmUNgxZp+laViuD47LujMiIiIiIqIRYlKmlODBkrjMYeFScchuwr9Ixr7kpyCxAqkngHJJGTPmstU0oOh+GJDdnSkDwO7R9v+Txi+Xbm7sXdpxO3p2JmWMkNSskPBxjs3qvE/bfzviNmRe06ZrkXlDqt8H76xhRNGH4CESWCKRE7Rrpbb9dsR5DW+jJD4Ew1/RXigIHCA1l2rzt6b78yh+wDn7qdaotsF2ejct99QoiIiIiIiIxgiXL+2iuHCp5NyQCRh+Rk9H8ODy98WscUvKaEbTq8dm9Kh57f4rCi2lj3pnin+fgY2X6gsdS96mX9Lmb8HOjKYZuQ3a/B3d+nnt+hO0MLxQehA8WOr/n8z6JsLLRnYXai6Ff0G5FUYT8HQGJH4+/HuVe4SlQhkEgUzIF4jdDc07t8LnvI5vFNdklLsofmcSEREREdHYDfsYgqGDsvjZEjujch/vk6qz3BZrFHkS4ml0HIfnt8LuGqMGKbLrtNt5a5vAgb1Tivx7S+JD8NSVPq3QrNu/huza3WhIVrvu16bP6bYvafffhpvcEZ/ElhszvyHRU4f7Qf59pPqiymdkinxzpfbf3U6wk65ZKtntC3FN66g9EUGwut1Kxhh+eBvH7H4ZMZg1blfM0stERERERDR2uHxpsNBhUvOvMKsr2ASJvkvbbkH2bZfxsJjV' +
                '8M1yGjVqdi2s7jFrkObRcQeqlpecAiPBg9VTD6tLqi9G+CiHxEFaW2/W5F/GoDG5jdryEyT/jOjpiJ4ugX1dNt7uF1giM76gVid6ni4f/9qPllkkVWhBfusYZQHsYpVi5z2YPRI7U9tvRc+zjo3RnOO1SEDNuONEp2F1R5e8bQF250Q8Ela7Wq0CdYi5Ad98mNWDahuNmm+WuMySU3ustnkiIiIiIiICkzKDg5GQxL8hsLjCzfAvlMiJmtvkVinDUwsj6jjOz60byyobsLX7Mcm8juCSEqNi3zxAEFgsVWc6TLyytftv2vLjsQxRdq1mf4KuPyF8FGLLJXgwvI1lXhJYIokPaXZNmU2mg4dK/DzXYGS07dea/PMYzTKzxAgjcZlbGWMzLnVX6saPlE6+aF7tlGN+yAjBU4vsmtE30Ig5Zygs5Jsn4omwOpBdh9CRTlt6iX9vBPbX1D92/6PEvx/c9lcSZF7mNyUREREREY1ZHoIh6Bt9SvX7JXbqntAUiZ+vnb933lNG3KaHqI3cxjFukGa1404JLC6x25T4xDcbkZPhW1D6tZk3dMcPx2ArqF3l1mluHTrvR+ydqL5QQke574wj4aMQPkq7HnTuAmGp+3f3AiWaelzbbkK+acxCC4j4EDoCnnqHdpsSORmREzX5UOkT8lsBu3SSyIyIp270dWXE55btUgtWywQ9EpmXYC+H6bCszzcXsdOR+qfjfvPD5J2J6GluW6rZXdrzHL8riYiIiIhozDIRDEGv0OFS/UHn6ScAAKsTVtvY/Ngp18YcIcEDHQeHRth1zU4B+a1jHR3RrgdgtZRaUWWj5lLHiR6FVm29cTiLhkbPTmrHXbrxQ9ryv8hvcjvT04DAgS7PgoSPldi7XT8rhY47xzAj05vc6HlKk392fUwDqPu4Y8opvxl2uvQhs263Slb75sI3zzka3ZrbMjFPp3b/HQXnWTnil9jykZZz3uVNPBI7QyLHOjfC0p7nkNvAL0siIiIiIhornClTHLvGpfYK+Be6' +
                'jAqRfVPb74BmxyKTZcM7R2ougRFyPKX6YqRfLj1ZxlPrWFAGgNWl+TEfKityGzT5sMTPH1pZxqyR2Bmli31oVjvv0bZfj3aQ7IMRgZ1023mn/6o7dfvXkX1LGj4P3+zS90h88C+EeEpXxvVUo/YKiNs22Jp8SFP/HPvuZ3Wi64+InuacazMkfCxiy7XjzhIHs2tgdZWe4GMEEDwERrhMEtDpDgT2d973XZHfgty6CXpCs29r6inx7QVx+MryzZP6q3Xzv486ZSbho6XmUhgR59ufQ+c9sLtBREREREQ0RpiUAcQjNR+U6Dvczslv1+bvacddY/ahRhS+OS6VRCR6ivr3QqHU5BQzLmbCcahcaEF+8ziESdG1ErEzevda6m+o01oPW7sf1x3/M9qbYkr0VISPQfKv2v234Tax4y6YcWn4jGOpZvGXTsqIV6LvksiJbu9up9D+f+MwCwkAtPtxdN4niY841w+2pe7j2v23Xav2auYVKexwWmckwQNRtVzb7xh5Fw0heqpjzWPNa27t6HI9owxR+20SPgoDtmAfeqXhYzHji9p0rducGodLRfAA1H0Kgf3d+n/2Le38Pb8viYiIiIhoDHH5EhA8XBKXuS1c0px23juWGRkAmkHnfW6bGRtRiZwCs0SrxFMDT63D21pqtaPQNh5x0tQqZN8ebtmO7Dq0/rzMeiLH4bVHQkdLw2ek9qPScDUCBwy/o2rrL5Df5nzchu66AkvgmSF1Hy/zzp1/0MxL49UJ7RS6HoTbFCcDgQMkfkGJqSK5dZpb67hXl6dBEh8ZcflqIyjVF0n0XY4nWEmMx6QhFz1PadeDLltNQUyJny8zvw7vbMcJNSWuNCSR44xZN0jkeLfTrA5t+V+3nbmJiIiIiIhGbtonZYyQ1H0C3tkuw2VN/XOMNw8CoHnteR7Z191SE1Vnlp6nYFSVTNb0Jh0K21320t4tVqcm/wR7GPs62Sltv9WxMK078Uj4GJn1zd5iKKGjjFnfRmip0847uwQn7JY20lyJ' +
                'o0ZQ4ufAv7frFaXRcYdrume3e0T6Be1c6ZrzUqm5FJ5dZsTYGaSeguW8O3XwEGPmt3rXMZXJVgjEB7NKqi+W+k/D4zIha9vY7HE+ohC1/kxTT7qnBaXqbGP+byVyMswqiM955pEB8cM7U2oulTk3InhQmae1+7ExTssSERERERFN96SMmFL7MYkc5zxyA3Kb0HoT8uNQ0LSwQzsfcDvBv68EDyuxPshbDwk5jR6ReXMcR8Udd8HqKHeSpR13a+uNo7ojHgkfLzO/Af++/b8MHWnM/ZnE3wszNrSizdCX+6T6fc4bBtnIbdqlQo3At0BqLnW/JG27RdOvjG9vtLrQ9SCy610uD/5Fklixayki7X4Y2Tfc3jy8zFhwt9T/h4SPhaceRgRGEEZgwE8IRgT+vaXqTJl9gzR+xTkjA9jd2nU/Cq0T/cDmm7Dj+8i8USbtGFgs834tM6+XquXwLxp0seLvvdLggVLzAWPuzdJ4neO8s75uk35Om67hfy2IiIiIiGjMTe+aMsFDypX2zGvnvdp1/7h8ut2tnfdK7RVDq7QMFHsnuh8dVCNG/PDOhhFwSoggv3EcI5bboKnHpeps53krivQz2vpz2JmRv7tI5GRp/GqJisveWTLr24ifjfbfauf9gA5aiCQCGIBIzQek/mqYNY5D+syrQ39pxiR+Lnzz3dpVaNOulbDaxrs/avo5dP1e6q5yyRJKzSXaeR/SLw9KTGTXaNefJLDEbT9vMyZ1n0TNZZJ7WwutyG2A1QURqEIMeGfDUyPeefAvcMtRFm9xbkOlpo1o96Novl5mXAvfXLd2ikfi70H8PZJ9S3Mbkd+MQivEgBbgmw9PnfgXOZbLGXKxmdftLZ8el7QsERERERFNe9M4KWMEpP4/4alzHQH+TXf8aBzbUNiuHXdI4nLHoWXsDLT9RgcmZYyA2xQGzemueYex1XEPIqc4tqGwQ1t/icyoJpX45krDpx33wBKvRE5G+Dipe0O7/4H0syi0QQyoDSOI0OESORGBg5wL' +
                'D0Mzr2rPsyU+tGZFmXF5+63IvDYRfdLu0a4/Suxf3DYCM6sl8WHd+l+wk4Ma2fZrhJdJ9PQyH2HGEDxUdqvTtmn77ciurdSDq533wQjKjGtcN4bfyb+3uC9Mc5ddq03/Ncr+TEREREREVM70TcpI4qMSWuZWYiP7JlpuhNU+jo2wutB5P5yTMgAQezfSz/fvjW3EYMadB6zpcR8th45wnKcDaPtvtfOeUb5zbqN23CO+hW5Th8SLwAHi3x+4bMBUEQEEYrpNnSi0oP2OofMdzBqpvtjt41BcZXZf+UVbYyXzmnbeJfWfduu6VWdp+20YUl3Fatfm74l3JgJLxrF5mtPO32nrzyr78GrHnbAz0vgl12pQuy21ym76HNLMyBARERER0XiZrjVlQkdK4l+dy+UCmtOO32nq8fEeXWr2LfctnyVy3KDFNd568dQ7vRsKLW7b0+w2iZ4mNR/YtaZJ78d33qetN0Gt0Uej9efadE25bacFYkK8EN/OHy/E47roRrXtV9r1wJBaJBI8QKovKtOm1puQXTNxPdPu0eTDyLoWBjKiUnNZid6bfk63XYfs2+PYXzv+T7d9ZTdu8Vi1w9KulfbGj2jqH+NzFzLaeqO9+WNIvzLc7caIiIiIiIhGblomZYyQNHwWnhkuw3jt+qO23ey2ZfVYsTrQcY/bwM87V8LHwgj25hHMGpjVDo3OafrlcWyqfy9p/DI8taXjlnkNrTch37R7g+2cdtxlb/zQ2A62tfn72vI/Q9NVnjpUf8CtCAuA3AbtvG+iN0LOvKYd97qfIlVnSmjp0OdXLe3+u73lKqRWjUOeolu3f0ObvjiqakFwLc07qs3CtID0c7rp33T718d4HlNmtW66XLd9FbmNzMgQEREREdH45iem4TVL7ccldIRL8RGkX9aWn07Q5jKa0+Rfkdvk3FxTqs6Eb17v//TNdtxdSHPIbRi3qPlkxpfg26t0RkZz2naT9jw1Brtxaw49z+rGD+v2b4xBbd38Ft3yKd1xA6yuwZfj' +
                'ldiZEn9Pmba0/Qr5TeO1xbgTO6XJB5F9q9zt+DL8C3ZpcR49T9ubPqxNX0BuzEo+a/IvuuFSbfmx28bb7t8zzmvExIxDRlXlRi3kt2rLT+x152nLT2Gndvc6s29q0xfs9Rdr8qExeDciIiIiIqJypl1NGYmfK/WfdN48CNCstt+K9PMT1yarQzvvlbqrHE8IHirR0zTzOgD493FsvPj7S8+MedxqL5fISU6ZLG37jbbfuctu06NPS6CwQ1t+osmHpOocqVoO34IRv0ehWTvv147bkXmlxOQOMw7fXGTXOo69xdTceu24Z7QTQ3YzO/CWtvxUaj/qnBoQQMQ3X3Mbh4ZdLeS3aduvtPsxib1LYu+Ce5keF/lN2vMcOu7R9DPIN49+2ogWkF4NswZaGJzhEgCafgm6GxNS7BTSL2puo3bcJbHTJXrqiK8336SZV9B1v3b/HYVm2Gn+h4GIiIiIiCYoR2G9lJheF1zzQYSWOs59ED/SL2vHneOX3Sg9wPbNlbpPOs4XkCC6H9HOe2GnJX4eoqdDdx03GrA6tPWXyK0b+/ZFjpc5P3facUm7H9Wm/0IxZzTmzDi8syV0KEJHim8B/Avc9tyxU8it0+waZF7R7seQW+c43Ul88NTCCDmWRxGBnUZ+20RPk+m/nxF4Z7hVbxEDhRZYXW4tNCLw1IlvDoIHwbcA3lniqYMnAfHCUz9o0pNmUWiHplFo0fwW5Lci86ZmVqOwbbfSMb1NNWEmYEZLJ1/sHhS2j1FvicFTK965CB4M/97wzRHPDJhReOr6L9ZOw+5CoUVzm1FoQuZVTb+A/HYUdoxrPSYiIiIiIqISo6XplpSBJwGYbgNdK1mZlQsDx427tsrOwu6CWjCiMCMOY3ULhfaxr4LhX2jM/RUC+5c+mt+kW/6fJh8e3+ob4oNZDTMm3pnwzoYZLbHyzuqA1aG5DbDaYXXB7ubj3c8I7fyJihmHeOBJAJ7ehI4YsHtgdaqdgdUBuxt2GnZqEicpjDCMCMwwzFoxQvDU' +
                '9D71Ox9wLbTC6oSmYSWhWXYQIiIiIiKqiOmXlKGRdRCvzL5B4u91Oq7bvqQtP5vYYa1RevdrLbAs60jv7sDwTZuLVd54IiIiIiLaQ3gYAnIbyNZcKlVnOx3V9ju0/Y4Jn2hg71YJEhpwA3mxREREREREFWQwBOREIidJ3Sch/tKH0y9qy48ntvgOEREREe2p/3Sct9I4sAXmfIZiyt7i+uuNA1uk/np2obEfli/eYCx6mn1svGK7eMOe3ELOlCEHvvky4wvwzih9tNCqzd9B5lXGiYiIiKYvc77Uf15ix8FXX/yFdq1C91Pa+pURDETjVyGyTKpP6/uNtj+E9GsjepPxuDRj8TOwUvar88ZwSC8NK3T7zdp89XBfsvARCS8Z22bsTuMB6PpPafKWUQwLAUzkVUj8KplzjdsZe0BUK9ClB9OuVUi/PvwOOaVSFYueRnDBkGho80+QXsmv9om+FwwBleoXEam7EsFDnI5r2y81+RfWcCEiIqJpSxLXGoufgRm1N37afrm2+IP061J9lix8ZJh/7ZfGG2XONQMzMgCk+jSZeeX4zUeYNHzLihkZmGFJXFvh2119BqwUAFS9m51/6jzFsWXSsGL4D+yUj4ax6GaJXsJQTPTgmyGgXR5Hn1S/V6rf73Rcux/Vtl9z/2AiIiKavv9cqr9eai+016zQzRcN/MOyNl9trzkCuSZjwZ1lh3lSf73UngtA2x+yX13al9nR7TdranWFr9Bab79cW9mZFBI/H4C23AkAVadUsiXRS+Cr1/Y/IdcssWMmRRfVjhv6epT9cq12rQJgr1nR/8tpNU2mT3rdgAgs1Za7kWuW8BJjwZ3T86us/5vn1aW9Xzt1l/EbfoIxKUND/6Mj4aOl7iqIw9K2/Gbd/k3ktzBSRERENE3/tRS9RGovsNddhvRKmPNl9m3GgS3FH5m3Er5luvkizayReTeXeZ/aCwDoput080Ww1vcPp5uv1rUn9S+pGPIRs28bmO7pLfMRv0oab+w9Z/GG/lk25nxj' +
                '8QZj36FLzotviOByDCjk0fcO0ngjShW5kMS1xqKne89Z+IgsfKTvTfqZM/pbu++rEr+q97WNNxaX/0jDit6j5SpoSOxEWCltvlpTqyW8BL5lg46WanaxeUPPTFw7sBKK1F9v7Ptqfwsbbyx/yyPHAUD349r+wK7TdooN6LvS3lFWX/TM+caBLTDDMMP9N7EvLANCaix6euiEoODy4mX29a4hn7K7gsuLN3Fotyl5wr6vIrJ06AmunXOU0XbocmMfH2u9Nl1uv7EY6XUILhhy+f0P1M7n2r3v9R6KXzUwYruGdFBAFj099IQBAZeFjwzpyeMbbWu9blgBQAKD1jTBt2xQkIe8p/stcH1t7zMy4Jzit5nT91VxCo/UX28s3tD3niV6xeBzZN7Kie5XTMrQ7vIvQN1V8M4qfdTO6Pbr0cMaVERERDSNkzINn9CWO5FbBXO+seBOCSyy31huv1xrv7EcgISOAqCbLxJvvcs/5SVxLcywplZrxw1uH2bONxY9MHB9k1SfZix6YOhgbM41xUk3AGCGpWFF72DPWq+pl+Eb3BJzvsSOQXrdwDk+xqIH+t+hZIPrr5eZV/YVoZDwEgkvKTG6WHRHf2t99TLnmqFZm2HnCxBcoF1PAEDnw9g5cWaXjxvUbO16FIAkBv2pX6rPgpXS1h8VR3fSsKKvBhB89VJ7btkRl8SOQ65Zk7dox13AmE3bGRJSBBcMWrbmW2Ys+B+JDcgFxJZJ7QfGMLdoLLq5/yYWu83CRwbeAmPB//Sf4KsfesfLdc7RRXvi42Nv+TKKK9T6r+vpgf1KYsuMBTcNeeh2fWSk/nqZc82giPU9icUTFj4yKCDBBdKwov8B8dUPvCMSXmIsuGnCog0A5gwAyDUP6gOL7hgU5Npz+zuJ+y1wf+3OXjfonNwm7VoFX/2QJVTF76tiLSeJnQgzPKCFC2TmlQMvU+atlIYVfedIbNmg8yv93DEpQ2WfwypJfFgiJzgd1447teN27i5MRERE05dvGXz1xWkskvg4' +
                'ggvsLV9GbhUA5FbphuV9SRZtfwCRZc7/7ooBQPczZcals38EX72mVveuMnhjuaZWw1cv9Z8fdF56nW79Qe9Cla0/GDTC7HwIAKoGjOUSH4cZ1vY/DHoHK9X/Dk2X75ob6p3Xs/3m3sUObyxHel2JFuea+9+naxUAiZ4EQJsu1+03D3qHNUe4XXj8XwCg848AtOMWWCmJnVjivMHN1tYfwUpJ7LgSyR1rfe/oLtfct2RDN11XbKRrS66Cr17bHyjeYqTXSWDBCEqQWOvtl2thpWCl+hcTddyA4HJpWDGo/dtvRnH+lDm/NwllhvvD9XKtttyt+e1jlpSZ+VkA2nJ3XyiKC3n6xrfGrC/CDGvXqiFroIbfOUcR7YE3buLik16JXDN89b3vXP95BBdo16r+lrc/BF+9JD7u9sgUn5EB/d9eswK55uKD05sLCC9Brlk3XdcfkIELFc2wplb3LjF7dSnS6wamJ8Y32sWAz/5GX2ZzUB/oC/KrS4vT1nonrbjeAvfX9mWONLOub1Wddtyw8/vq3QO+r66FGe5rlb3miIHr8uw1K2Cl+r7fJH6VxJYNDHLvCRXpV0zK0Mi/mH0SP08Slzt/W72ozd+CFhgqIiIimr7/YoqerpmdyYjIUlgpx81K0i9JYFGZpEzZjwsfiFyzrj2pd31TbpVuWDE07wBoy2/6dmvS1q8U/9pc/Au8dtyAXLOED+z/i3r1Gcg1D9ndyV53gct+T715nIEbJ+VWlRyoDHqftv8DAN+s0cR55+SUYl5DUy8juGDXSTdDm22t164nBs4MksTFALT11oFDX/h6JyNoxw0D82ilVZ0GoHeOTHHIaoaHjs9H05FOAqAtd/bfuOarteVumGGJDxi1Bvfrv8tNl+uG5WPUjS+Br167VvUl4LTjBt3+UwC9mUTfMgQXaGr1oE9Mvz7izjnSaFcqPgPG7VL9TqTX6YblfYsKdfNFyDUPWb01pO/tfEZ+2v/L9EptuR1muDcNEVkKQLf/tD9v23GDrj2p/wsk' +
                'va7/f1rre9MQvvnjGm1j8TM7V/HcLOEl2rWq7xmX6CUILtCWu/ufemu9bv4sAAQPcr8Fw33twEve2eyhlZuqTumb6daXppHGG3sXKC26GWZYvA07v5OXAdCt3+i/8MHfz5V97piUoXJCS90yMoVWbfoi8k2MExEREU1rZgxWd++/742wy4laaOtfSlBiENg1jM+aDzOs+ebBL1w/8K/6peW2AhD/Xr0t6a2E8nH0zfvoenzEVw0g/dKIXqSFNgAwoyNOGezayM6H0Dd9xl3nHwGg5j3FAA5ZqKUtd8IMG4tuLpbkkMYby8x5MedL+ECk1/VOhgJ2TsY5cQw60q4hTb8CAL7ZvR+Ua5bYst6yF403juUWVGb1rkkWTd4HoJhJLK7Cc5vJNYzOOeJoVzA+fStcfMtghhFc0F+15MAW48AW+OrFW+/2Dr5ZAGTONQNfJTOv7EusSGABrNQwc1JD4zDe0e59Ou4elH0oNrv23EGh2Hdl38W63YJyr3VrxsDKTb5lEl7SN9MNxSVgM6+U2nOHLErqPRpYBCvltml9ZZ87Bx7+h5UAwDdPEh+B3+GPOZrVlh9q6nHGiYiIiKY7qwtmZFiZBU/NoOoMJZMykaVoHvcma+uPpPYCqT5Dm68uZiu04/ejeZ9ikmUCRJYVR3RDa3bEjtNyfyLU5C2S/oSEl2hwuURPGrjwAcW/iicfkfi/wDezWJ5Dqt9pr/t3p+lOEr+kb4g+6EBx2o7TJKmx6Wnr7TcWS/31MGMSO643FJEjx/uP9mPZ8UYY7YrFJ7gcvnrkmmGt762r4p64GXHGJ7bHRtt+dSms9b31g6rfqa3L+vKPrlcUHf0tKJel1Y67pGEFqk5B61d6K0kVM619S8DS6zT1fN8kL2Pxhsn+3DEpQ4ARlMRlUnWWw2NhafIhbfkx40RERESkyT8bDR8qFtjT1PMSPNdxcB48SDNrnBMlX5GGD0l4CeJXOf7x3FoPKyXe+kH1/Mz5/QNIBxI+FID2PNn3Ppp6WWLLikMa' +
                'Ta0e8ajY6gIgocN0XNMQ/ckXh22nffXiEq6+2HY9KsEFEv8XiR1X3L9p0OH0yuJVaHEdxMwrJXGxbna4LueavhL/l95oFPNrZtUoQorgQUgO7DMHAEBu88CRNoBiKspY9LTElqlveMPmMp/eDgxaowFAomcD6O20xRNcJjUMs3OOKNoVio80Xo3iBA0AuVWwUppZp2tPGllIc1sA6PpPOU3T0My6YsmeEU+WmYBop1fq1r1kzjXGgpvsdZftLJK1HsCgRYsOyaBSt2BYr3WI5Kpi9Rn1LZPqM/pK/PZ1SHvLl52+wdROiRmGSx+o7HPnNBznf1mnO/FI1XlSs8L5qVivTV+CWgwVEREREXKrkGsubtWhzV9DrtmY9cXenWt9ywZunirVZ6Db7R/x2nInihsn7bLLtcxb2fsRxb2TFj7Se4Jvmcy7GWZ46PqjyKD9ehFcMHDFDbBz+U/DCgBou2fEV51+CYDUXthX1UXqr5fAwtGkIXbdVnnIP06LdT0HFNrsLbe5/lNDrtQ54fUjWCmpPRe+em3/08BBrCx8pMTGz06KSydSq4e0pFi4t7+WR/G6dqZvipsiD51VYaX6a4sUG5l8BIDUXtC3OELqr5fac2GltOMWFDcRb7zRce8qc37vsppRbW6lyVuKazQG7eXccAWAYqfV5C2wUlJ92qDmDV60VaZzjjTaQ1u4e/EZbjrmRmPfV3snX+xMH2jqZQkvkXkr+59Kc7403iizbyvf4JmfHbjaRRLXysJHehvZ/QwAabii/yui2FWGdwnjGm30FhW6Gb56Y+4Pe9dDFTvJ4A2kEFwus28r/sblFpR9bRlt9wCQ2d+Ar37gTDdYSQxcxuhbJrNvG/SsFYM8+xv9URp8wsT0q5HiTJnpnpJB8HBJfAhOK6KtTt3+1WKmk4iIiIgA6PYfypzrtOMu5FbZa86Qxq/31koAtGtVcX6KzL5N883ufxLX5qvhmyXVpxV/hh5Nvw5AN39cFj0g4SWyeEB1j1yzNn9t0D/pqk+T' +
                '6paBKQB74yeGjLik4Yri39VH8Yd6Td6C1GUSXmIsunn0cUv+WXClhJdIcSlQel3pDZiqTsGAwroD2yC5z0rsmPL7gFrrteuJYkiHLNSS8BKEl/Qmp/ozVn8s/Q/l3qUTD5ccIUtsmUQv0eQt2nFLcdKTHDjoFgw+/0XxnSbzvyv4LgDddF1xDCwNK2Tmlb2VR/pSdX3lM3ZZwKWp1WP153rd+g2Z/90hHzFwj3ZtuXPX5g16h3Kdc0TRHiq9clzis+tKtOJVb1gx6LoW3CmxZYOuCyizmZFDg7Fz51ptvhqRpRJeInOukTnXDDla/n6Na7T7WmjGpPZcmXdzcaKQvfHTxoL/kYYVQ962uGOR+y0o+1r3DJE0XCHhJUNK/GrH74ufOOhDBzxr2vojqT5jaJQmoF/tHs6Umd48Can5AIIHQrOwM4N+NAerQ9tv087fM05EREREA7MD2nKnseAmBJfDWq+bL+qfzbFhOXKrZPZtElg0cJjnPNC6aNeda7Xlbt10Xe/f7a319poztP2h/qPtD9lrzhiydkm7VvXVr9HUanvN+3YdQhRXZ/Su0RjFVa89qb8ZVkq33zyyDXcB5Fbp1h/0t7PkLrM7J6eUHAJp1+P9FUDdFffSHrJQy1qv228euAlxcQdip/UmUn0GrFTpTakGbtxrrbfX/XvfBuHatcp+Y+if2bXpcwPDpdm3i2Ng3fqD/p3F0+t06w/652u03qQtd/cPOIsxH+maGtdubK9Z0R+NXd5fm6/W7Tf3NUBb7h46nHbvnCOMdskcwXjHR7tW9b5q4ANlrbfXHDH0zVvu1qb/Lt/gwbtca2q1br+5v8702pMGhXTw0TLGOdo7O+rl2rVKwktk4SPFFIa95n0DPxTpdX17KpW5Ba6vHcateRzF+UEDb016pW66zu1Zs9bb6y7ri4OmVuum64ZmSCv63JX+qrFeSvC/rEREREREI/tndOJamXmltj+krbf2DauKSzzUTumGFS41X8ayGfXXS8OK4syLMmfOWymx' +
                'ZfYby8fqT76y8BEJL+ktFLqn3Z1iWLb+wGWfbyKiPQFnyhARERERjZi2fsV+dSmspDH3W/375gb30/Y/DP3D+57At0xiy7Rr1ZhlZBpvLFbi2AMzMihOcsk1MyNDRHs+1pQhIiIiIhoVa702XV52k+Y9gSQuA3YuuhndOzTeOKTOAgDd/sM98WLjV8FXry13s4cS0Z6PM2WIiIiIiKY4qX7n6Er89ku/Mqig5qgqVkyQmvcA0NabeN+JaBJ8P7OmDBERERERERHRxONMGSIiIiIiIiKiCmBShoiIiIiIiIioApiUISIiIiIiIiKqACZliIiIiIiIiIgqgEkZIiIiIiIiIqIKYFKGiIiIiIiIiKgCmJQhIiIiIiIiIqoAJmWIiIiIiIiIiCqASRkiIiIiIiIiogpgUoaIiIiIiIiIqAKYlCEiIiIiIiIiqgAmZYiIiIiIiIiIKoBJGSIiIiIiIiKiCmBShoiIiIiIiIioApiUISIiIiIiIiKqACZliIiIiIiIiIgqgEkZIiIiIiIiIqIKYFKGiIiIiIiIiKgCmJQhIiIiIiIiIqoAJmWIiIiIiIiIiCqASRkiIiIiIiIiogpgUoaIiIiIiIiIqAKYlCEiIiIiIiIiqgAmZYiIiIiIiIiIKoBJGSIiIiIiIiKiCmBShoiIiIiIiIioApiUISIiIiIiIiKqACZliIiIiIiIiIgqgEkZIiIiIiIiIqIKYFKGiIiIiIiIiKgCPBvetOxcBwNBRERE05zhi9cfPo9xICIioon75wdDQEREREREREQ08ZiUISIiIiIiIiKqACZliIiIiIiIiIgqgEkZIiIiIiIiIqIKYFKGiIiIiIiIiKgCmJQhIiIiIiIiIqoAJmWIiIiIiIiIiCqASRkiIiIiIiIiogpgUoaIiIiIiIiIqAKYlCEiIiIiIiIiqgAmZYiIiIiIiIiIKoBJGSIiIiIiIiKiCmBShoiIiIiIiIioApiUISIiIiIiIiKqACZliIiIiIiIiIgqgEkZIiIiIiIi' +
                'IqIKYFKGiIiIiIiIiKgCmJQhIiIiIiIiIqoAJmWIiIiIiIiIiCqASRkiIiIiIiIiogpgUoaIiIiIiIiIqAKYlCEiIiIiIiIiqgAmZYiIiIiIiIiIKoBJGSIiIiIiIiKiCmBShoiIiIiIiIioApiUISIiIiIiIiKqACZliIiIiIiIiIgqgEkZIiIiIiIiIqIKYFKGiIiIiIiIiKgCmJQhIiIiIiIiIqoAJmWIiIiIiIiIiCqASRkiIiIiIiIiogpgUoaIiIiIiIiIqAKYlCEiIiIiIiIiqgAmZYiIiIiIiIiIKoBJGSIiIiIiIiKiCmBShoiIiIiIiIioApiUISIiIiIiIiKqACZliIiIiIiIiIgq4P8PADoUozXdVNbLAAAAAElFTkSuQmCC'
          },
      ],
      };
      const pdfDefinition: any = {
        header: header,
        content: [
          {
            columns: [
              {
                margin: [0,100,0,0],
                alignment: 'center',
                style: 'title',
                text: [
                  {text: '\nCONTRATOS PENDIENTES ', bold: true}
                ]
              },
            ],
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
            margin: [350,0,0,0],
            table: {
              alignment: 'right',
              widths: [200, -49, 5],
              body: [
                [{text: [{text: `Caracas, ${new Date().getDate()} de ${this.getMonthAsString(new Date().getMonth())} de ${new Date().getFullYear()}`}], border: [false, false, false, false]} ]
              ]
            },
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
                alignment: 'center',
                text: [
                  {text: ''}
                ]
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
                {text: `${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.mtotal)} ${this.receiptList[0].xmoneda}`, style: 'tableHeader', fillColor: '#fdd213'}]
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
        footer: function(currentPage, pageCount) {
          return {
            width: 600,
            height: 20,
            margin: [0,19,0,0],
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABdwAAAAoCAIAAABrbK+bAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAFASURBVHja7NixEUAAAARBBGKRVBHaVpMaxAKjCxfYLeGjnxvPY3nuawAA+LdpXtZ9swMA8N39MAEAAADA90QZAAAAgIAoAwAAABAQZQAAAAACogwAAABAQJQBAAAACIgyAAAAAAFRBgAAACAgygAAAAAERBkAAACAgCgDAAAAEBBlAAAAAAKiDAAAAEBAlAEAAAAIiDIAAAAAAVEGAAAAICDKAAAAAAREGQAAAICAKAMAAAAQEGUAAAAAAqIMAAAAQECUAQAAAAiIMgAAAAABUQYAAAAgIMoAAAAABEQZAAAAgIAoAwAAABAQZQAAAAACogwAAABAQJQBAAAACIgyAAAAAAFRBgAAACAgygAAAAAERBkAAACAgCgDAAAAEBBlAAAAAAKiDAAAAEBAlAEAAAAIiDIAAAAAgRcAAP//AwDAGwVS1BukKgAAAABJRU5ErkJggg=='
          };
        },
      }
      pdfMake.createPdf(pdfDefinition).open();
      //pdfMake.createPdf(pdfDefinition).download(`ORDEN DE SERVICIO PARA ${this.getServiceOrderService()} #${this.search_form.get('corden').value}, PARA ${this.search_form.get('xcliente').value}.pdf`, function() { alert('El PDF se está Generando'); });
    }else{
      const header = {
        columns: [
          {
            width: 600,
            height: 85,
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABdwAAADwCAIAAACVATHZAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAFSvSURBVHja7N15mFxVmT/w73tv7VtXd/WSzp4QthD2AGFfBFQIA7IoiEIGFRxHwXH4uY3gwrjjgjqjoiKiCAzIogFRFEEQw76FPWRPOun0Xl1d673v74/q9Ja6t7o73V3p7u/n6Weese+tqnPfe26R8/Y57xHrpQSIiIiIiIiIiGhiGQwBEREREREREdHEY1KGiIiIiIiIiKgCmJQhIiIiIiIiIqoAJmWIiIiIiIiIiCqASRkiIiIiIiIiogpgUoaIiIiIiIiIqAKYlCEiIiIiIiIiqgAmZYiIiIiIiIiIKoBJGSIiIiIiIiKiCmBShoiIiIiIiIioApiUISIiIiIiIiKqACZliIiIiIiIiIgqgEkZIiIiIiIiIqIKYFKGiIiIiIiIiKgCmJQhIiIiIiIiIqoAJmWIiIiIiIiIiCqASRkiIiIiIiIiogpgUoaIiIiIiIiIqAKYlCEiIiIiIiIiqgAmZYiIiIiIiIiIKoBJGSIiIiIiIiKiCmBShoiIiIiIiIioApiUISIiIiIiIiKqACZliIiIiIiIiIgqwMMQ0OQkEB+MIMQDIwwARhDiBQAJiW8ujABUh/E2AlUUmjS/HWIAgJUEbEBhdQEKuxtqMdxEREREREQ05piUoT2emPA0wKwWMw4zDk8NzAQ8NTCr4akVIwLvDKgN74z+mV9iADKCj1BbsDODY7VBc9CC5jYAitwG2Cnkt8HqhNWuVhsKbSi0wE7yzhAREREREdHuYFKG9jy+ueKbD988eOfCUwtPrXjqYMZhVsPwAQZg7Ey7GID0znAZURZmiIEvNWYBCkB8CwAANtQG7OL/I3YKhRa1WlBoQ2EH8luRW6+59cith93DW0dERERERETDx6QM7QF8cyVwEAL7I7CP' +
                'eBphxmFWwQhDPBATMHr/78QRABDPwP/Vy4zBO0PU2pmsKcDOitUBO6mFNuQ2IP2cZtcisxp2ijeWiIiIiIiI3Aaf1ksJRoEmttP54akT/yIE9kfwQAkcACMCIwQjAAn01oWZlGzYOdgpaBZ2j+Y3I/Mqep7VzOuwWlBo5Z0nIiIiIiKiQeNjJmVoIhgB+PcT3wL490ZgPwnsDyMEIwQjDPFN2au2e2AnYfeg0KqZ15B5Bdm3Nfs68k3sEURERERERMSkDI0n7xwJL4V/MfwLxb8vzBiMCIwwxJx2odAcrCTsbs1tQPZNZNdo+gX0PMM+QkRERERENG0xKUPjIHiQRE5EYLH45sI7G2YNjMBuFeKdYooJmsJ2zW9G+hX0/FN7noHVxcAQERERERFNK0zK0Bgx4/AvktCRCB8p3nnwzYMZG/tPUQua6/2xe6B5LWyH2r17V8MqNgV2NwrNsLM7N2bqe7kNMWHWwFPbW6lXBGZcPA2qeTEi8NQCgBGG4ZugAjeaQ26j5rcg8ypST2j6eeS3sTcRERERERFNB0zK0O4xayR4IIKHIHSoeOfBPx9GdGze2U6i0AarXa0O2N2wOlBoRaEFVjusbtjdqjmoBbsLUKjCaituZQ0INA+7G1rYZXqOAtJbzgbae76EYEahFgy/FBtvBGBE4KmDEYKnFmYNzCqYUTGrYVb37gw1HnLrNLsOmZfR85Rm3kBuPfsXERERERHRFMakDI2y5yC0VIJLEDpGAvvDN2e38xSK/Fbkt2puM6x2WC3INyHfpMUUjGZgd8POQDNQawKv0te7J1SxJrEREU8tPLXwzoQnAbNKPI3wzYKnYSzLFWsB+U2aXYuep5B+UVNPwO5hhyMiIiIiIpqCQ2smZWhkfAskdDhCh0noKPj3hhEa5fuohcJW5LZobgMKzchvQX6z5puQb4LVAc3vnPayhz44MAIwovA2iKcR3gZ4G+FphH+BeBrhnQkjOAYfUszOpP6Bnme15zlkXmHvIyIiIiIimkqYlKHh' +
                'MWvgXySRExBaKqEjYFaN+B00C6sDhR2a24LceuQ3IrdJcxuRWw+7e0o8TF749xLvLHhnw1MP33zxzYV3Jjw1u7ukS/Pa8xRST6H7Uc2+iUIz+yMREREREdFUGEcyKUNl+PeWwP6IvkOCByOwZMQvz29DoUkLO9DzPHJrNb8FuS3IbwHsKR43Mw5vo/jmwzcX/n3hWyCeBDwN8OzGE5d9U9MvoetPmnkV2TfYN4mIiIiIiCY1JmXIqWt4EVgiwYMQO0OCh4wslaB55NZpvgm5jeh5WjOvIr91DOZ3mDUwwig0QQuTLJhGEJ56eGdJYF8ED4dvdu+EmtHt7mR1avp5dP1Re55FZvXkiwYREREREREVR95MytBQRhSBfSR8vMTPRWDxCF5odSG/RXMbkHkNqcc0/QKsrjHqp14JHYWqs+BJIPWkdt43uZfweGoleChCRyK4RHzz4G0c5fqmzCva8Tvt/huya2Cn2XOJiIiIiIgmFyZlaABPAv59JHKyxN8D34JhvUQLsLuQb9bsa0i/oqkn0PPUWDfLQHiZMes78O/d+5nN39Pmb0zoNkzj9fyZCB0h4WMQWCz+feBpgBkb8fSZ9MvaeZ92/xXZtbBT7MVERERERESTZlDIpAwBxXTMvlJ1tsTOhHfGsF5itaHQoennkH5e0y8itWrc2lYnjddJ/Pz+3+Q22GveAatjSt2C0FIJHojgUgkthVkFTw1gjODlmVe0815N/hXZN2Fn2KOJiIiIiIgmwVicIZjuzGr4F0n8PIm/F2as/Pl2GlarZtci+SftfhyZ18a9ZK9voQQPGfwrGWU1lj1ZzzPa8wzwSw3sL6GliJ4mgQPgScCIDOvlgQMkcIBUnadtv9KuP6KwHZpn7yYiIiIiItqTcabMNGaE4JsnNR+U6othhMucrAXYKRSaNfmwdt6L9IvQ3AT10eipMvsGeBr6f9XznL3uPNjJKX6D/HtL/DyJnQFPA8woxDfcF/Y8rS0/1dRjsDqmwiIvIiIiIiKiKYozZaYl' +
                '8cM3S2JnSe1H4alzPVVhZ2B3a8+z6P6rdtxTgUVDnkSpOrg69W9T9i3d/g1t/o7E3oXYcgkdAU8tjCAgZV4YOkLmHoHkn9HyY+15DnbPtAgXERERERHRZMOkzDQjHphxqTpLEh+Bfx/XU23YWeS3aNdKdD+u3Y9UrtHm4Ooqtlod02htjua18w/o/IOGjpDICVJ1NnzzYQTKVpyR6OkIH4e2X2vbzcit52omIiIiIiKiPQ2TMtOHQDwSOVnqPoHQkRDT+UwbmkfmNW37lXY/itzGyrd84EQPLaCwA5qddjew52nteVrb75DIiVL7Efj3gXjLzJoxQlJ7hURP1pYfa/vt0AKnzBAREREREe05mJSZNgL7St1VEjsTRsjtNDutPU+j7Zfa9eAeMYYXc+eanYG/lOl7H/Obtf232nmfxM+TxL8isLj8Jk3+fWTmNxF7t277GjKr+SgQERERERHtIZiUmQbMuFRfKHWfgFnrNkHGzmjyQbTdqql/ANYeUyDWgOEf9AstoNA+ve+owu7W9lu143dS+zFJXDqoCnJJ4pPoqRI8RHf8SFt/MR3nGREREREREe15mJSZ4iR6KmqvkNARbjsr2z3aea+234b0S9AstLCHXcTgRJIWYLXxzkIL0G7dcYMmH5Lq90n1+8vMgYIBT700fBqhpdr8LWReZwiJiIiIiIgqi0mZKXxv66T+aqk6G2Yc4nSjVdtv17ZfI/sG7O49cftk8cOsGvwbKb9gZ/rQLNIvavYt7bxX6j4p0VPLnG9EJPZu8e+jzd/WzvsYPyIiIiIiokoO3BmCKUliZ0r9f8K/D4yA43C+4/+07dfIvAGrfc+u/zq4gozmUdjBWzyADbsbqac0+wnEzpC6T8A33zWcXgT2k5nfhHeWtvwvw0dERERERFQpTMpMOd5ZUvtRiZ/rWGdEC9r9CFpv0vRzKLTs6Zdj+IeuylEbdjfv8y5sFHZo++2afkGqL5Lqi4dWRx766NdK/afgX6jbvgqrneEjIiIiIiKaeEzK' +
                'TCkSPRV1n5DgoY7lRVL/1PbfaGoVchsmxyWZVfDU7fJbm/e6tOJqpvxmpJ6Q2isQOso1tnGJXwhPozZ/G+kXGDwiIiIiIqIJxqTMVGEEpe6TEj8fvnmlT8i8ou23afJh5NbueaV83S6s1PIlFvp1VWjVzpWafUvi75XEv7rVeDYCEnun+GZp50pN/gW5jSyiTERERERENGGYlJkSggdL3ZUSPRVGuMRRq0s779b225F+CZqbZJdmhGVIoV+oambq3Dvx7sw6KWDACEFGUsbYzsBOlTyAzGu64wakX5LaKxBa6vYmgSXimydVZ8HqVCsJOOXsDGgG+WbYKRRaUGjS/DbkNsLudmgDERERERERuWFSZvIP6uMXSO1HETy4xDHNa/IvaL9Ve55GoXVSXp4RhBkbclGTYKaPeCEBmGGIHxKAWQUxxExAvBATngYYYWgeZhSeWogfsKEWjCDMKsAYdt1lgd2D/GakX9bUP5FbN/S41aGd92huvdR8QOIXuO2ZbUQROABDZyU50BzsFKyk2EkttEEzyLyG3AbkN/WnaYiIiIiIiKgcJmUmMzMmiQ9LzSXwzi5xNP2idtylXQ+WGKtPIqrQwRVk7OQetMRGTJjVMKvhSYhZBTMBww8jBk89zDDMGhhhEX/v/BcjCjEBA0YY4gVsiA/i2/0YodCM7FtouVGTfy6RsUo/r9s3Iv2C1Kwonbwb8VX7YPpgVqMviRM5EVYSVqtY7Zp5E9m3kNuo2beQfYOPKRERERERkRMmZSYt/75S+1GJn19ikx27Wzvu0fbfoufpyX6VYkaHzpSxs7CzFWqNF556eBvEUwdPIzz18NTAk4BZI2YNzBjMGMQH8Y5FqmUEzYKnQTwN8NTD7tHuR0qcUmjVtl9r5k2peb9UnVtmY6bRNMEHTwKeBAAJHQXNorAD2XXIvIrcGk2/hPSLk6qSERERERER0URgUmZSksgJqPukRE4ocSy1Sttv1857p8gSErMKZs3gXxUmqDKOEYQRhSch3tnwzoB3' +
                'Jjx18NSJZwY8dfDOmNjMyzD490F4GUomZYp6ntTMq+h5DlXLJbQURnTcOqgf3tninY3I8dCCpF/S9AvIrNb0i8iuYQEaIiIiIiKiIiZlJhvxSdXZUnclAvsPPZTfol33a9utyLwyda5XrcEbYKtaSVid4/JZRhSeGpjV4p0NbwP8i2Am4K0X7xx4GmAE9vRY5dYj83qZc+yktv0KqccQPg7x88S3F7wzxrnHehA6TEKHQfOSfk7TL6LnWc28guxbUIsPNBERERERTWdMykwqZlyqL5S6q+CpG3JEU4+j7Tfa+fvJt7+SO8MPMQdeKDQ7ltdoVsM7QzwN8DbCvw/8C8QzE96Z8FRD/ONyRWpB07B7oBbsFDQLKKzu/i2l7DSsNoh3JG/qhfYg+VdN/mVYp2fXanYtUv9A6EiEDod3tphVMKIwYyhWwBnz9U0AxIvQURI6CvF2pF9C9yPa8zQyb3ITbiIiIiIimraYlJk8vDMk8WFJfHTolI3CDu26X1t+iuxbU/CqzcSg5IgqNL/b7xmDd6Z46uCdi+ABElgC/z4wq0aYB3GledhJ2D2wU7C6AUutDmgB+SZoBoU2FFqhWVitanUDFgqtsDohBrSYdcoCI9kYGwLND55SNAzZtzX7NtrvgBFSb6N4GuBtgBGFpw6eaph1MAIwgiIBGAEYYRhBGCFIcHdTNma1RE5E5ETJbdTkQ+h6QLNvIL+NjzgREREREU03TMpMEr65UvdJqblk8G9tpF/Rtl9q2y1T98qH7NFswUqO/E0MGGGYVfDNFt8C+PeR0BEIHggjvHtts2HnoFloBnYaVpdabbA6YHXA7kF+C/LNKDRrfgs0h/zWPTXCNuxuZN/Skkk98amnBkZMvA0wa+FtgFkNT30xnuKphxmDEYHhhwQgnhH36sSHUPNBdNyFrgc1/SLyTSNOLREREREREU1aTMpMBv59ZMYXJHbG4OxEh3Y/ojt+hPQLU/ritUQSYZjEBzMOT0L8+yCwH/z7SejQ0tuHD7MldqZ3' +
                '5ZGdhdWm+a3IN6GwA4UdKGzT/HYUmlHYMbXCn0N+G7BNs28OPWRWq2+2eBrhmw9PHL694J0hnsadaZrA8G+TVL8f8QvQtRKdv9fUkyg086EnIiIiIqLpgEmZPV7wIKPxqwgfPSg7kNukbbdoy4+h2ekVDbVg95Q5xwjCrIYZl+BhCB8pgQMR2HeUOyXZPb1LkOwezW9Bbi1ym5Bbp/kmWO0otJRvzBRmtSPdrnh5Z9gDMKvVO1sC+yFwoISWwlMNIwazaljvJl6peg+ip6PzD9r2a2TfhNXOp5+IiIiIiKY2JmX2YOJB4ABj9g8QOKD/l5pD+iVtvn64JV2nGM04rAMyYPhhROCdIeHjED1VAkvgSYzwzS1oHpqB3QM7qYUWpF9A5jVNr0Z+M+zUGJSzmcLsDOwm5Ju052kAagQQWCzhYxB5h/gXwqyCESpfKMcIS/WFUnWmtt+mrb9AbvO0SzsSEREREdF0wqTMnko8CB1pzPo2/PsOGPf2aPIvuv2ryL49XeMyuNCveCBeGBHx74PAAYieItF37FKGxuXNLMCC5mFnUNiu+W3IrUfmFc28jvTzU20fqwlmZ9DznPY8hx0/0sB+UnW2hI+HfxHMWPlZS0ZUEpdL9DRt/r4mH0ShrdQqNiIiIiIiokmPSZk9kpgSPl5mfh3+RX35AxTatPVn2vJj2KlpHBoTRgTigxiQgAQPRvBQhI+S6KnDzcX0JmIKsNPIrdXsG8iuQeZ1zb6N3Dp2vXGReV0zr6vxA4mcjNgZEjkWnobyqRnfApl9Azr+T3f8D7JvQAsMJBERERERTTFMyux5xEToCJn9vQElaW1k1+n2/9bOP0zDcAz6X2ZUYmfAaoNvvoSORGBfmNXDeBOF2oAFO4PsG9rzNNIvanYtCk3ciXni2GntegBdD2pwicTfK/FzYSYgZpnbH3+vhI7Spms0+VcuZSIiIiIioqk24rVeSjAKe9Ytib1TZl4Pb2NfQkG7H9WmLyGzejpGI/ERmfn1XX6tw5sXo1Ab' +
                'mkd+o/Y8i+6Htec5FNpgp7jvcuUFDpDayyV+PsQ/jDuZ1+3f1LabYHUxckRERERENHXGvEzK7FlCRxpzfwbvzL6kg7b9Wpu/i/zm6VlWQ6reI7O/ByMyspdZXchv0exb6HlWux9Bdg1gAzbUZnWSPefeQrwIHSZ1n5TIyWWnzEAL2naTbr8eVhtjR0REREREU2RcxKTMHsS/rzHvl/Av6t2kprBDm7+nHXfBap++qYTQUcasbw3af8pFvknTzyK9GukXNP0C7BTUghY4L2YP/gYyYVRJ1VlS93H4FpQ5WXPaeZ9u+zIXnRERERER0dTAmjJ7jMASY/YN/RmZzKva9EVNPTHd62hk39D0C+KelOl5VntWIf2SZtcitwGahuZZF3ZyUAtWm7bfrunnpfbjEj/X7WTxSdXZsHt021c5X4aIiIiIiKYAzpTZM3gSxrxbEDqimJHR5F9023XccabYRRE8WBq/LOFjBw7lYXVp6p9I/UN7nkK+GVYHNAvNc3XSJL7Rnnqpeb80fL5MwSA7o22/1OZvs74MERERERFN+oEQkzKVZ4Rk1nclfm5vRqbjHt3+NW7PPKCTeuCdJaHD4NsLAKx2ZNdofgusJOwk7B5GaOowYxI5SRq/OqDQdSl2t27/hrb8hAEjIiIiIqLJPd5lUqbSd8Ar8XNl1vcgPgDa/htt/i5yGxmYXQJlQkIAgDzsDOMxdW+0R8JHS+PXEdjP7bT8Zt3yKU0+zIAREREREdHkZTAEFeaZIbUf683IdN6n27/FjExpasEuTo1hRmZq3+iCdj9mb7kS6RfcTvPORvX7y0yoISIiIiIi2rMxKVNR4pHgwQgsBoDMK7rtOuS3MipE6HnO3vIp9Dzt9vRET5XoOxkqIiIiIiKavJiUqWz4QwgfCQgKrfbWzyG3niEh6pV+yd76eWRecX58IoieyskyREREREQ0ibMCDEEliRf+/QDoju8h9QTjQTRI+nltuhaFHY4PUHiZRE5gnIiIiIiIaJJiUqai7By6H9HW' +
                'n2nbrxgMol1p96O64/uOu1+bcYSPKZZkIiIiIiIimnQ8DEEl2Slt/w3Uhp1mMIhK0tZfwrdQqi+GEdj1qPgXqW8esm8xUERERERENOlwpkxl2bC6YHczEESONKct/+uYdvE0iH8Rg0RERERERJMRkzJEtMfLbdDMaqhV4pBZBU8tI0RERERERJMRkzJENBkUmqG5Er8XP4wQw0NERERERJMRkzJE4/JkSeQE+OYxEGNGvBCD32NERERERDSlho4MAdFYE3hnyazvSOIyQBiOseFpLL3LkuZh9zA8REREREQ0GTEpQzTmT1VAqi+Eb4HEL4B/IeMxBjwJ8e9VOsOlBWiBESIiIiIiokk5fGQIiMaUwLeXJFYAgKdeEh+F+BmU3Y1p5ER4G0ofs9pRaGKIiIiIiIhoMmJSZpzH59458NQzENOIGZXqi+DpzSBI9YUIHsgHbXe/psLHw6wueUzzmzTzFmNERERERESTc7RD48c7W2Z9UxL/yjhPGwL/3lJ90YAnLCh1V8GMMjSj518goUMdCspYSK9GfhODREREREREkxGTBeM3PDel5v0SPR2hI+Gbw3hMC56E1FwGMzaoI0TfIeFjIF6GZ5RPUuwseOeWPpZ9C90PM0RERERERDRJMSkzbiPJ8AlSdQ4ACR4o4WUMyDS45aaElkn1+3b5vQ+Jy2BM88ky4vrj8hUVkvi5Q/JcO6mmntDUk+x6REREREQ0SXkYgnFhRJG4FP5FAGDWIHw0Ou6CWgzMlH6YZqDmgyWPSOQkRE7Qrvuh+ekYGfHA0wizCtASR+1u5DY4vjR+PrwzSx/LrkPyQWiOXY+IiIiIiCbrOJIhGJdBaO3lEjmpbwqAhI5E+BjtfoyRmbq33CPhoyVyktNhqf+k9jyF/NbpGBwzLrO+KeHjSx7UnlW6/sLSKUsjItXvh1lV+oWpxzX1T3Y9IiIiIiKavLh8aRyG5+FjJX4ujEj/r3x7IfIORmYq886SmhUQ0/EE//4SWw4jMC2jo1AbRrD0j1pQ' +
                'Lf0oxd8D/z6l1zflNqDrQdhpdj0iIiIiIpq8mJQZa2YcdZ+Ab9HgwaUp4SMQOIDhmZrEK9FTETrc9RxTai6Bd/Z0jZHtfEidoorwCU5pLO3+u3Y/yq5HRERERESTGpMyYz08r71CwseUmDERWCzhoxifqcm/jyQ+VH5/Jf/eEjsTRogBGxbPDAkdWjqqufXovA+aZZCIiIiIiGhSY1JmTIWPlqrzSo+6jSgiJ8NTzyBNuWcoLLF39RZ1diem1H4MvgWM2bCYVTCrS6xdsjPa+nNWkyEiIiIioqkwoGQIxm4MGZO6/4BvnuOQPHiwhI5knKaawP5SffFwHyVPQmougVnNsJUnXkiJqOqOG7T9Nk6TISIiIiKiKYBJmbEbQtZ+VMJHu5V69TQgdhoDNaWYNRI/D765I+gn8QvEvfoM9VJg6NOkLf+rrT+H1cnoEBERERHRFMCkzNiQyPFSfRGMoOtJpoSOROgIhmvq3PfQYVJ17sheY8ZQ/T546hi9Mgo7YCf7/6fmdMcNuuMHsNoZGyIiIiIimhqYlBkLnjqp/8ywNtbxzZOqf2HApsp9b0D8vfAkRvo6iZ4m4aMZvzIKzdr2W+SbYLUj9YRu/YzuuAGFFgaGiIiIiIimzrCSIdh9krgcoSNKVCQtcapPQkeqdw7ymxi3SX/fo6eI43o0RaENmi6dqjMiqFmBnufZDdxoXlt/hsyrEI9mXkNmNUNCRERERERTDGfK7PbIPHKC1FzsVkpmCP9eUnUG4zbpeWej6hwY0dJHNa8dd2jyb87d5niJnQphVtRVoVk779GOO5mRISIiIiKiKYlJmd3jSUjDZx03utYc1Br6SzOOyCllqs/QHk9i75bwMY6H7Yy23Yzuv0ELTm8g8Qvh22taBEstwHY+arsdHYNb5YERhRmDGYNZBSPIXBgREREREe0pSQWGYDcGe16p/RgcdrnW1D9gZyV8JCQy9HWBAxA+TpMPMYSTlX9vib/HMbOmlmZeQnatWp2S3wzfvNJL20KHS+xd' +
                '2rIOmpvq8XLPuegYf5oRhKcBnnox4/DNghGFp2FnIsaA3QmrE4Vm5LepnUS+GfnN7NFERERERFQRTMqMnkROlsQVDsPMLFp+DE8dQoeUinoC8fPR/XCJeTQ0CW68V+LnI7TU8QTtQfvtAFBo1a4HpPbfHN+p+r2aegI9T4++MWaVRE6CJ1FiSo74kd+kyb9Bs6N//8B+EjoKkF0SKwLYmnkVPc8ObU/0dBih/lSLnYEnIb75jkHwzUXNpdDC4DWAqh13wU6PrLX+ReLfG8GDEFgivnnw1MKsgvh2SYrZsFMotIvVrtk16HkSmTc1+yYKzezdREREREQ0kZiUGS3vTGn4DIxA6VF596OaekICB8FKwqwpMaoPHaGBg5B+fixyBB7HZWhaGDqW9iTgmSHeRphRwAC0d7xtdWthBwrbUGhz/iTbeTHOiBrscz5kQBUolE9XGUF46mHWiBmHGYfIoHyBWrA6tLAdhRZYHdD8WN764KESO9N56Z8iu37nNCjRtlul+sISfaA3ibCvVJ2tmVdg94z2Ca6Xhk/Dv2/po6lV2vMMCqNPykjkZGm8zuFCs2j9hQ5JyngbpfG/R7YjVWCxzPpOibfv+vNwkzLig39vCS9D9J0SOc6tg+3sPTCi8EWBuRI8GPHzUGhF8kF0PaTpF1l9mYiIiIiIJgyTMqNiBCRxOYIHlz5qdaLtFlhdmluL3FrxzSs9lo6/R3c/KeOdI7F3Q7wl14Bo1/3IbQJswIC3QYKHIXKshI5C4IBdymrYknlT0y8g+5ZjCkPz2nk3Cq271+BZUnW2c2CDyKzW7segDkkK8cI7SwL7IbA/goeLfy94Z8IIlzjTTknmFc28hsyrmn4euQ272/KdLZT4BQjs53iCndHOe3d+liL7hnY9JPHznOqYSOwMdP9dk38eddpkt08Y9culdGZKJrJSlcC/UCLvkOr3OT6Pw/oiTEj1xai+GJ33ov027XkOVju/54iIiIiIaLwxKTOacaCEj5Pay50Oa8ddmnoSAPJb' +
                'kXkTkZNKjGyNgISOUk8tCi271ZTwUTLza46Hs29qbgOMqESOQdV5Ej/HeX6HgcB+EtgPmod4Hd+wsE27Hhz9xBOzSho+J9UXupyi27+K5COlj3nnSORYVJ0t4WNhhMp8lhFG6EgJHQlAsmu0+1Ek/6w9z8Nq272AHy/Rd7g0H7n12vG7Qb9q/blEjoV3VukEh28u4uei50lYnaNqke0yq0hh7W4NXZe5UVoocVTHaDrVcFb2GRGJHIfE5RI5Ycye7apzEH0XWn+m7bch9zYXGBIRERER0bji7ksjHrXBN1caPu+4RCK3Qdtv7f8ze/o5xwVB/r2l6pzdbYwZdzyYW6fZt+BJSO1HZPaPJH5umdutlib/otuucyu8GjkZ4h9tY70Se7dbRkZzuuP72nJjiRoo4kXoKJn5NZn9I4meVj4jMzTUiyTxIZnzM2n4fwgeOIzlLU6PSxjVF8A31/EEu1vbfzu0cGz6ee1c6ZLJkshJEn0nH62RMWskcZnM+ckYZmR23uWA1H3CmP1D2Z3eTkRERERENJzxB0MwwqFglSQ+jOBBjmmFlh8j83r/L9IvaGa1w1tFEDvDbVpK+bsXgqfB4ZhqfgvUkob/kobPw6wu/25WGzp+p11/RL7JMX1QtRyemlG1VeBfJPX/6XKGdj+mrTfBTu3yUp9ETzHm/K/E3r179y4miY8Yc34msTNhREdzDVVnuW2DDUX2bW37dYkD7b9Fodkx2+WpRdVZw7pH1BuxhDR8VmZcCyMyXh8ROlxm/1Di53D3eiIiIiIiGj9MyoxoUG5K+Dip/ahzWuER7fz9oB2Os28j/ZLDIghDAgcgdPhuZBlq4N/LOUVgScPVUnPJcN8tt1HTz6Ow3a2+iVkj4WNHM9PEUyt1/wHfAscTCs264/vIb90l5h6JvkNmfgslS/OMgn+RzP6h1H9yxEkQTwJV5zhnwYBCm7b9GnZ3iUOZV7XjHpeytRI5QeLnT4nnUcbmKlwK03hnSOPXJHHZsN5Hc7B7YCdhtcHq' +
                'gNUOOwk7PawleJ46mfltqf7A6KdWERERERERuQ87GIIRjDZ9C6XhM46lTwstuv1bJXbVTT2OqrNQcktgMyo1l2nqqVEW/jBCztvciAQPRfjonfsrlWVr+llk1wBA9+Oo/uDg/YkHqDobyYdGVgpH/BI9XeLnOo+c89r87aGbKxcFDpC6q+CdVWbgPWgSilFm/pERkKqzkXpyJOV1RareI6HDXBqhmZeHVJMZdLj1pxI9BYHFpW+HEUbVmUj+Bbl1k/wpEWgP7IGzSxQQiM+p1DHUgmaH21GNsDT8l8TPK3eeQnMotGvqMWReQ2EHCjsAA7DhbYSnEaFDJHg4zGiZhIsRkobPwurQzrtZX4aIiIiIiMYckzLDD1WNJD6EwP6OSY0dP0T2zRKjw8xryKyWkkkZ8Un4CPXvhexbo2pStfgWOh41Y6VGqjZgD0hhGBADMJDbjNQ/e09KPy89T8JhnY4ED1bv7JEkZQTBA6ThM27pjPbbh84w2tk8qToboaXOL7VgtWnnH3ZG3oYEENhfIifCUwcxS83aUOTWa/P12v23kd39qnMcd7YGUGhB532lp8kU5bdpxz1SNxtmlUNgD0P8HG3+vltNnz1fboO98cMQX/9VaEHMGqm7EuFlpV+Sftbe9t9Qa/C+5ii1/5EhdR8vX4lJC8it1/Zbe3cfKzkpxgirb77UXCrxc2DG3Wb3mFUy44ua34TUKn4LEhERERHRGGcaGILhMSR8jMtSIO3+h3bcCbvURs75reh+ArHlDkO+hMTO1B3fH0WbRIKlMi9OTcwhu0a7H0HPs7C6esfMgX2l6myEjtTi/kQ78wua/Itj8RRPnYSP1eybpS+2xPn1UvsxeGc6npB+SXd8v/R+1YHFxe2TnK5I22/T5utRaIYOmGokHjWCEj4WNZdK5PihtVrTL9lN/4XUkyPKfUjNhxA80C266Re1/bdl7kD7bRJ7t+OCNSMk0dO08/6Sqb1Jw07vOuNJjSiq3+s0DUYLLUg9May7ED1Z4ueXKfKi' +
                'We24V7dfh/x2t1tsp5B5Rbd+Rjt+Z8z4AsJHu72nt8GYca297vzh9nkiIiIiIqJh5hoYgmHxL5K6qxxXOmhWm7/lMnlE088h/YLDHQhK1VnOq5DgPlaEBIZ1Zvol3fwJe+1Zuu067Vqp3Y9q99+1++/a+gt7/UW65T/RtRJWV994VZN/cZv0ETl+uAVZxCdVZ0jsLOchdEG3fw25TaVf7d8LgX0cXpjTzvt162eR3wa1AO3/0TysLk3+WTdcohsvR/rl/hcl/2pv/gRST41sNkpgP4m9E0bY8YT8ZrTfVn55S6FZu+6H1eF4QvBw9/3CJ+3XjM9tlZB4h/VFZARQc2npZYB97G5t/p5u+Y8yGZkB3Qg9T9ubLtf22937MQJLpO6T/CIkIiIiIqIxHi0xBOWZ1VJzKQKOEyV0x4+QfsmtLkz6Re15ynG8518ooWUjv3Uh+OY6Vn4Z2Ly2X9kbPqCdv4fVCc1DLcDu/dECrE5tv23ooDS/TTvucRyhRk6Ed/awGhk8ROr+06WR2vxtTT3pGDqz2nF7HSuJjjuhecext1rQnCb/ZG/6iHbdD0Dbb9Ut/4HM6yOt4CM1lyKwn1uEU09q1wPDSQFo6y/dJsKIKdHTJXwsn7kSsak6R4KHudWdsTq1+Tu644e71BhyZyO/Tbd+Tlt/4f64SfV7x6zaNBERERERUXGowRCUHQxK9DSpucQxs5B+UdtuLrGR86DBeB6ppx2nSEgQNR8Yebv8MMvPr9G2X+n2byK/1W27Gc0NredidyL5kPNHeyV8lNvMkSJvo9T+G7wzHD82+ZC2/cZtSo54HAfhYg5r6ZYWkH1bm66x3z6zNw4jrakcOlwipwxdAzVQfhM67x7Wbj4A7KS231Z6rVaRf29Uv58PZglVZ8Nb73KntfP32vpzaHbkb62wk9ryY03+xe0sT53EL+B9ICIiIiKiMcSxXzmBfaX23xzLWGhetxWrV5Qb9mVe1vTzTqkHCS9zK2dbkhmDt7HMOal/avN3S2wIVb65' +
                'lqZfhFODAYmd4Vb1FsWFS++R2OmOJ+Q36bYvo1A2dOJ0+ZK4HP6Fwxpy5zai56kS+20PgyQ+7L5kRrv+qMmHRxDajju1x7lkrJgSXibRU/jkDRI+Wvz7uH1f9TynO77vsul4ebkNaP+tWycRr8TeBU8t7wYREREREY0VJmVcmVVS/UEEFjsOsFt+rKl/DmvyRW4Duv/hPN4LSfXFI7x1IXEv7KJZ3fG90WUiAMBq1y7nyTLBg8Q1ISKhI6Xu310mmGjTl5ApV9HW6oBmHLtu8CBj1g8k+o7hXc9otjSSyEkSPsZtjVj2bXQ/CtgwY8P7qYKdQfJht0yZdzaqLxrOwrTpQyKnuGVDrA7tvA+5Dbv3IarJv7lOljHg3xv+RbwdREREREQ0Vrj7kutQMPZuqb7QcXiceUVbfjrc5RKaR/o55DbCN7fUJxkSPVl985DbONz0gVkNT73bByYf1tSq0e+vbGe0636pvRxmvFSDfYi+A+kXS6/J8s5G3cfgaXBsW+vPNflQ2WSWZtdIdg2ChzjcHg/Cy8T7bSQfRPJv6rLeapS334faK+CZ4XoXYqi+ROIXQLzDfFPYWXgSblsIiSnho1F1jnb8js9g7432L3BbQZZbp6nHxuCD7CRSTyB+gePdEZ8ED1fujU1ERERERGOESRlngQMk8RGYVSXTBchvs7d+Zhirbwa8pudpdD0gtR8tPVb3NEr0dG39xTDTKOJpgLfB+cMKaL9tt1ZzwEZuoyYflvi5pRsQOUnb7yiRlBG/VF8kkZMc37jnGW3+3rB2F86+rl1/EqekTJFvrtRciug7kX4fUv/Qzt+7VWwZUSog9i4JHV5mxoonIdFTICN8jtQq97a1qLkEyYdhtfNBhKdefPPcykVn1yL79ph8lGbfkuzrCB7q1CkQ2J83hIiIiIiIxgqXLzkwayRxGYIOOy5pQVP/QOZ1mDXwJIb7A3Xb+kdMqbkYZnTYI9U651K7itx67X5s9NNket+mB+23OR71L5LA/rt2IYkcL4kV' +
                'jlsgF3bYTV8YbjLLzmj77eU3NhI/fPOk6hyp/4wx92Zp+JzjjRvBkxGSxEdKzxIa8gSJF5CR/bgUMN75thI40CkdNv2+pcIwYo4R0wJyG4aV4xuO/DZ1ye+IIe57chMREREREY0EZ8o4DL6qzpKqc5yTVoYED8Gcn46s8IcWxFPrNhoPHCDBQzX1GNQq1z4vPHXOw1RLU/+EndzdKKil6ecl8woCB5Rqgw+hI5F8GFZb/y9981B7hePCJc1r87fR88xIBsmbdPvXAZXYmcPozrXw1ErocIm+Q7sf0677R/ZZAy+u+gMIHlrJrKUZlfh7tXPliGZjTU1mFIbPuZdmUNgxZp+laViuD47LujMiIiIiIqIRYlKmlODBkrjMYeFScchuwr9Ixr7kpyCxAqkngHJJGTPmstU0oOh+GJDdnSkDwO7R9v+Txi+Xbm7sXdpxO3p2JmWMkNSskPBxjs3qvE/bfzviNmRe06ZrkXlDqt8H76xhRNGH4CESWCKRE7Rrpbb9dsR5DW+jJD4Ew1/RXigIHCA1l2rzt6b78yh+wDn7qdaotsF2ejct99QoiIiIiIiIxgiXL+2iuHCp5NyQCRh+Rk9H8ODy98WscUvKaEbTq8dm9Kh57f4rCi2lj3pnin+fgY2X6gsdS96mX9Lmb8HOjKYZuQ3a/B3d+nnt+hO0MLxQehA8WOr/n8z6JsLLRnYXai6Ff0G5FUYT8HQGJH4+/HuVe4SlQhkEgUzIF4jdDc07t8LnvI5vFNdklLsofmcSEREREdHYDfsYgqGDsvjZEjujch/vk6qz3BZrFHkS4ml0HIfnt8LuGqMGKbLrtNt5a5vAgb1Tivx7S+JD8NSVPq3QrNu/huza3WhIVrvu16bP6bYvafffhpvcEZ/ElhszvyHRU4f7Qf59pPqiymdkinxzpfbf3U6wk65ZKtntC3FN66g9EUGwut1Kxhh+eBvH7H4ZMZg1blfM0stERERERDR2uHxpsNBhUvOvMKsr2ASJvkvbbkH2bZfxsJjV' +
                '8M1yGjVqdi2s7jFrkObRcQeqlpecAiPBg9VTD6tLqi9G+CiHxEFaW2/W5F/GoDG5jdryEyT/jOjpiJ4ugX1dNt7uF1giM76gVid6ni4f/9qPllkkVWhBfusYZQHsYpVi5z2YPRI7U9tvRc+zjo3RnOO1SEDNuONEp2F1R5e8bQF250Q8Ela7Wq0CdYi5Ad98mNWDahuNmm+WuMySU3ustnkiIiIiIiICkzKDg5GQxL8hsLjCzfAvlMiJmtvkVinDUwsj6jjOz60byyobsLX7Mcm8juCSEqNi3zxAEFgsVWc6TLyytftv2vLjsQxRdq1mf4KuPyF8FGLLJXgwvI1lXhJYIokPaXZNmU2mg4dK/DzXYGS07dea/PMYzTKzxAgjcZlbGWMzLnVX6saPlE6+aF7tlGN+yAjBU4vsmtE30Ig5Zygs5Jsn4omwOpBdh9CRTlt6iX9vBPbX1D92/6PEvx/c9lcSZF7mNyUREREREY1ZHoIh6Bt9SvX7JXbqntAUiZ+vnb933lNG3KaHqI3cxjFukGa1404JLC6x25T4xDcbkZPhW1D6tZk3dMcPx2ArqF3l1mluHTrvR+ydqL5QQke574wj4aMQPkq7HnTuAmGp+3f3AiWaelzbbkK+acxCC4j4EDoCnnqHdpsSORmREzX5UOkT8lsBu3SSyIyIp270dWXE55btUgtWywQ9EpmXYC+H6bCszzcXsdOR+qfjfvPD5J2J6GluW6rZXdrzHL8riYiIiIhozDIRDEGv0OFS/UHn6ScAAKsTVtvY/Ngp18YcIcEDHQeHRth1zU4B+a1jHR3RrgdgtZRaUWWj5lLHiR6FVm29cTiLhkbPTmrHXbrxQ9ryv8hvcjvT04DAgS7PgoSPldi7XT8rhY47xzAj05vc6HlKk392fUwDqPu4Y8opvxl2uvQhs263Slb75sI3zzka3ZrbMjFPp3b/HQXnWTnil9jykZZz3uVNPBI7QyLHOjfC0p7nkNvAL0siIiIiIhornClTHLvGpfYK+Be6' +
                'jAqRfVPb74BmxyKTZcM7R2ougRFyPKX6YqRfLj1ZxlPrWFAGgNWl+TEfKityGzT5sMTPH1pZxqyR2Bmli31oVjvv0bZfj3aQ7IMRgZ1023mn/6o7dfvXkX1LGj4P3+zS90h88C+EeEpXxvVUo/YKiNs22Jp8SFP/HPvuZ3Wi64+InuacazMkfCxiy7XjzhIHs2tgdZWe4GMEEDwERrhMEtDpDgT2d973XZHfgty6CXpCs29r6inx7QVx+MryzZP6q3Xzv486ZSbho6XmUhgR59ufQ+c9sLtBREREREQ0RpiUAcQjNR+U6Dvczslv1+bvacddY/ahRhS+OS6VRCR6ivr3QqHU5BQzLmbCcahcaEF+8ziESdG1ErEzevda6m+o01oPW7sf1x3/M9qbYkr0VISPQfKv2v234Tax4y6YcWn4jGOpZvGXTsqIV6LvksiJbu9up9D+f+MwCwkAtPtxdN4niY841w+2pe7j2v23Xav2auYVKexwWmckwQNRtVzb7xh5Fw0heqpjzWPNa27t6HI9owxR+20SPgoDtmAfeqXhYzHji9p0rducGodLRfAA1H0Kgf3d+n/2Le38Pb8viYiIiIhoDHH5EhA8XBKXuS1c0px23juWGRkAmkHnfW6bGRtRiZwCs0SrxFMDT63D21pqtaPQNh5x0tQqZN8ebtmO7Dq0/rzMeiLH4bVHQkdLw2ek9qPScDUCBwy/o2rrL5Df5nzchu66AkvgmSF1Hy/zzp1/0MxL49UJ7RS6HoTbFCcDgQMkfkGJqSK5dZpb67hXl6dBEh8ZcflqIyjVF0n0XY4nWEmMx6QhFz1PadeDLltNQUyJny8zvw7vbMcJNSWuNCSR44xZN0jkeLfTrA5t+V+3nbmJiIiIiIhGbtonZYyQ1H0C3tkuw2VN/XOMNw8CoHnteR7Z191SE1Vnlp6nYFSVTNb0Jh0K21320t4tVqcm/wR7GPs62Sltv9WxMK078Uj4GJn1zd5iKKGjjFnfRmip0847uwQn7JY20lyJ' +
                'o0ZQ4ufAv7frFaXRcYdrume3e0T6Be1c6ZrzUqm5FJ5dZsTYGaSeguW8O3XwEGPmt3rXMZXJVgjEB7NKqi+W+k/D4zIha9vY7HE+ohC1/kxTT7qnBaXqbGP+byVyMswqiM955pEB8cM7U2oulTk3InhQmae1+7ExTssSERERERFN96SMmFL7MYkc5zxyA3Kb0HoT8uNQ0LSwQzsfcDvBv68EDyuxPshbDwk5jR6ReXMcR8Udd8HqKHeSpR13a+uNo7ojHgkfLzO/Af++/b8MHWnM/ZnE3wszNrSizdCX+6T6fc4bBtnIbdqlQo3At0BqLnW/JG27RdOvjG9vtLrQ9SCy610uD/5Fklixayki7X4Y2Tfc3jy8zFhwt9T/h4SPhaceRgRGEEZgwE8IRgT+vaXqTJl9gzR+xTkjA9jd2nU/Cq0T/cDmm7Dj+8i8USbtGFgs834tM6+XquXwLxp0seLvvdLggVLzAWPuzdJ4neO8s75uk35Om67hfy2IiIiIiGjMTe+aMsFDypX2zGvnvdp1/7h8ut2tnfdK7RVDq7QMFHsnuh8dVCNG/PDOhhFwSoggv3EcI5bboKnHpeps53krivQz2vpz2JmRv7tI5GRp/GqJisveWTLr24ifjfbfauf9gA5aiCQCGIBIzQek/mqYNY5D+syrQ39pxiR+Lnzz3dpVaNOulbDaxrs/avo5dP1e6q5yyRJKzSXaeR/SLw9KTGTXaNefJLDEbT9vMyZ1n0TNZZJ7WwutyG2A1QURqEIMeGfDUyPeefAvcMtRFm9xbkOlpo1o96Novl5mXAvfXLd2ikfi70H8PZJ9S3Mbkd+MQivEgBbgmw9PnfgXOZbLGXKxmdftLZ8el7QsERERERFNe9M4KWMEpP4/4alzHQH+TXf8aBzbUNiuHXdI4nLHoWXsDLT9RgcmZYyA2xQGzemueYex1XEPIqc4tqGwQ1t/icyoJpX45krDpx33wBKvRE5G+Dipe0O7/4H0syi0QQyoDSOI0OESORGBg5wL' +
                'D0Mzr2rPsyU+tGZFmXF5+63IvDYRfdLu0a4/Suxf3DYCM6sl8WHd+l+wk4Ma2fZrhJdJ9PQyH2HGEDxUdqvTtmn77ciurdSDq533wQjKjGtcN4bfyb+3uC9Mc5ddq03/Ncr+TEREREREVM70TcpI4qMSWuZWYiP7JlpuhNU+jo2wutB5P5yTMgAQezfSz/fvjW3EYMadB6zpcR8th45wnKcDaPtvtfOeUb5zbqN23CO+hW5Th8SLwAHi3x+4bMBUEQEEYrpNnSi0oP2OofMdzBqpvtjt41BcZXZf+UVbYyXzmnbeJfWfduu6VWdp+20YUl3Fatfm74l3JgJLxrF5mtPO32nrzyr78GrHnbAz0vgl12pQuy21ym76HNLMyBARERER0XiZrjVlQkdK4l+dy+UCmtOO32nq8fEeXWr2LfctnyVy3KDFNd568dQ7vRsKLW7b0+w2iZ4mNR/YtaZJ78d33qetN0Gt0Uej9efadE25bacFYkK8EN/OHy/E47roRrXtV9r1wJBaJBI8QKovKtOm1puQXTNxPdPu0eTDyLoWBjKiUnNZid6bfk63XYfs2+PYXzv+T7d9ZTdu8Vi1w9KulfbGj2jqH+NzFzLaeqO9+WNIvzLc7caIiIiIiIhGblomZYyQNHwWnhkuw3jt+qO23ey2ZfVYsTrQcY/bwM87V8LHwgj25hHMGpjVDo3OafrlcWyqfy9p/DI8taXjlnkNrTch37R7g+2cdtxlb/zQ2A62tfn72vI/Q9NVnjpUf8CtCAuA3AbtvG+iN0LOvKYd97qfIlVnSmjp0OdXLe3+u73lKqRWjUOeolu3f0ObvjiqakFwLc07qs3CtID0c7rp33T718d4HlNmtW66XLd9FbmNzMgQEREREdH45iem4TVL7ccldIRL8RGkX9aWn07Q5jKa0+Rfkdvk3FxTqs6Eb17v//TNdtxdSHPIbRi3qPlkxpfg26t0RkZz2naT9jw1Brtxaw49z+rGD+v2b4xBbd38Ft3yKd1xA6yuwZfj' +
                'ldiZEn9Pmba0/Qr5TeO1xbgTO6XJB5F9q9zt+DL8C3ZpcR49T9ubPqxNX0BuzEo+a/IvuuFSbfmx28bb7t8zzmvExIxDRlXlRi3kt2rLT+x152nLT2Gndvc6s29q0xfs9Rdr8qExeDciIiIiIqJypl1NGYmfK/WfdN48CNCstt+K9PMT1yarQzvvlbqrHE8IHirR0zTzOgD493FsvPj7S8+MedxqL5fISU6ZLG37jbbfuctu06NPS6CwQ1t+osmHpOocqVoO34IRv0ehWTvv147bkXmlxOQOMw7fXGTXOo69xdTceu24Z7QTQ3YzO/CWtvxUaj/qnBoQQMQ3X3Mbh4ZdLeS3aduvtPsxib1LYu+Ce5keF/lN2vMcOu7R9DPIN49+2ogWkF4NswZaGJzhEgCafgm6GxNS7BTSL2puo3bcJbHTJXrqiK8336SZV9B1v3b/HYVm2Gn+h4GIiIiIiCYoR2G9lJheF1zzQYSWOs59ED/SL2vHneOX3Sg9wPbNlbpPOs4XkCC6H9HOe2GnJX4eoqdDdx03GrA6tPWXyK0b+/ZFjpc5P3facUm7H9Wm/0IxZzTmzDi8syV0KEJHim8B/Avc9tyxU8it0+waZF7R7seQW+c43Ul88NTCCDmWRxGBnUZ+20RPk+m/nxF4Z7hVbxEDhRZYXW4tNCLw1IlvDoIHwbcA3lniqYMnAfHCUz9o0pNmUWiHplFo0fwW5Lci86ZmVqOwbbfSMb1NNWEmYEZLJ1/sHhS2j1FvicFTK965CB4M/97wzRHPDJhReOr6L9ZOw+5CoUVzm1FoQuZVTb+A/HYUdoxrPSYiIiIiIqISo6XplpSBJwGYbgNdK1mZlQsDx427tsrOwu6CWjCiMCMOY3ULhfaxr4LhX2jM/RUC+5c+mt+kW/6fJh8e3+ob4oNZDTMm3pnwzoYZLbHyzuqA1aG5DbDaYXXB7ubj3c8I7fyJihmHeOBJAJ7ehI4YsHtgdaqdgdUBuxt2GnZqEicpjDCMCMwwzFoxQvDU' +
                '9D71Ox9wLbTC6oSmYSWhWXYQIiIiIiKqiOmXlKGRdRCvzL5B4u91Oq7bvqQtP5vYYa1RevdrLbAs60jv7sDwTZuLVd54IiIiIiLaQ3gYAnIbyNZcKlVnOx3V9ju0/Y4Jn2hg71YJEhpwA3mxREREREREFWQwBOREIidJ3Sch/tKH0y9qy48ntvgOEREREe2p/3Sct9I4sAXmfIZiyt7i+uuNA1uk/np2obEfli/eYCx6mn1svGK7eMOe3ELOlCEHvvky4wvwzih9tNCqzd9B5lXGiYiIiKYvc77Uf15ix8FXX/yFdq1C91Pa+pURDETjVyGyTKpP6/uNtj+E9GsjepPxuDRj8TOwUvar88ZwSC8NK3T7zdp89XBfsvARCS8Z22bsTuMB6PpPafKWUQwLAUzkVUj8KplzjdsZe0BUK9ClB9OuVUi/PvwOOaVSFYueRnDBkGho80+QXsmv9om+FwwBleoXEam7EsFDnI5r2y81+RfWcCEiIqJpSxLXGoufgRm1N37afrm2+IP061J9lix8ZJh/7ZfGG2XONQMzMgCk+jSZeeX4zUeYNHzLihkZmGFJXFvh2119BqwUAFS9m51/6jzFsWXSsGL4D+yUj4ax6GaJXsJQTPTgmyGgXR5Hn1S/V6rf73Rcux/Vtl9z/2AiIiKavv9cqr9eai+016zQzRcN/MOyNl9trzkCuSZjwZ1lh3lSf73UngtA2x+yX13al9nR7TdranWFr9Bab79cW9mZFBI/H4C23AkAVadUsiXRS+Cr1/Y/IdcssWMmRRfVjhv6epT9cq12rQJgr1nR/8tpNU2mT3rdgAgs1Za7kWuW8BJjwZ3T86us/5vn1aW9Xzt1l/EbfoIxKUND/6Mj4aOl7iqIw9K2/Gbd/k3ktzBSRERENE3/tRS9RGovsNddhvRKmPNl9m3GgS3FH5m3Er5luvkizayReTeXeZ/aCwDoput080Ww1vcPp5uv1rUn9S+pGPIRs28bmO7pLfMRv0oab+w9Z/GG/lk25nxj' +
                '8QZj36FLzotviOByDCjk0fcO0ngjShW5kMS1xqKne89Z+IgsfKTvTfqZM/pbu++rEr+q97WNNxaX/0jDit6j5SpoSOxEWCltvlpTqyW8BL5lg46WanaxeUPPTFw7sBKK1F9v7Ptqfwsbbyx/yyPHAUD349r+wK7TdooN6LvS3lFWX/TM+caBLTDDMMP9N7EvLANCaix6euiEoODy4mX29a4hn7K7gsuLN3Fotyl5wr6vIrJ06AmunXOU0XbocmMfH2u9Nl1uv7EY6XUILhhy+f0P1M7n2r3v9R6KXzUwYruGdFBAFj099IQBAZeFjwzpyeMbbWu9blgBQAKD1jTBt2xQkIe8p/stcH1t7zMy4Jzit5nT91VxCo/UX28s3tD3niV6xeBzZN7Kie5XTMrQ7vIvQN1V8M4qfdTO6Pbr0cMaVERERDSNkzINn9CWO5FbBXO+seBOCSyy31huv1xrv7EcgISOAqCbLxJvvcs/5SVxLcywplZrxw1uH2bONxY9MHB9k1SfZix6YOhgbM41xUk3AGCGpWFF72DPWq+pl+Eb3BJzvsSOQXrdwDk+xqIH+t+hZIPrr5eZV/YVoZDwEgkvKTG6WHRHf2t99TLnmqFZm2HnCxBcoF1PAEDnw9g5cWaXjxvUbO16FIAkBv2pX6rPgpXS1h8VR3fSsKKvBhB89VJ7btkRl8SOQ65Zk7dox13AmE3bGRJSBBcMWrbmW2Ys+B+JDcgFxJZJ7QfGMLdoLLq5/yYWu83CRwbeAmPB//Sf4KsfesfLdc7RRXvi42Nv+TKKK9T6r+vpgf1KYsuMBTcNeeh2fWSk/nqZc82giPU9icUTFj4yKCDBBdKwov8B8dUPvCMSXmIsuGnCog0A5gwAyDUP6gOL7hgU5Npz+zuJ+y1wf+3OXjfonNwm7VoFX/2QJVTF76tiLSeJnQgzPKCFC2TmlQMvU+atlIYVfedIbNmg8yv93DEpQ2WfwypJfFgiJzgd1447teN27i5MRERE05dvGXz1xWkskvg4' +
                'ggvsLV9GbhUA5FbphuV9SRZtfwCRZc7/7ooBQPczZcals38EX72mVveuMnhjuaZWw1cv9Z8fdF56nW79Qe9Cla0/GDTC7HwIAKoGjOUSH4cZ1vY/DHoHK9X/Dk2X75ob6p3Xs/3m3sUObyxHel2JFuea+9+naxUAiZ4EQJsu1+03D3qHNUe4XXj8XwCg848AtOMWWCmJnVjivMHN1tYfwUpJ7LgSyR1rfe/oLtfct2RDN11XbKRrS66Cr17bHyjeYqTXSWDBCEqQWOvtl2thpWCl+hcTddyA4HJpWDGo/dtvRnH+lDm/NwllhvvD9XKtttyt+e1jlpSZ+VkA2nJ3XyiKC3n6xrfGrC/CDGvXqiFroIbfOUcR7YE3buLik16JXDN89b3vXP95BBdo16r+lrc/BF+9JD7u9sgUn5EB/d9eswK55uKD05sLCC9Brlk3XdcfkIELFc2wplb3LjF7dSnS6wamJ8Y32sWAz/5GX2ZzUB/oC/KrS4vT1nonrbjeAvfX9mWONLOub1Wddtyw8/vq3QO+r66FGe5rlb3miIHr8uw1K2Cl+r7fJH6VxJYNDHLvCRXpV0zK0Mi/mH0SP08Slzt/W72ozd+CFhgqIiIimr7/YoqerpmdyYjIUlgpx81K0i9JYFGZpEzZjwsfiFyzrj2pd31TbpVuWDE07wBoy2/6dmvS1q8U/9pc/Au8dtyAXLOED+z/i3r1Gcg1D9ndyV53gct+T715nIEbJ+VWlRyoDHqftv8DAN+s0cR55+SUYl5DUy8juGDXSTdDm22t164nBs4MksTFALT11oFDX/h6JyNoxw0D82ilVZ0GoHeOTHHIaoaHjs9H05FOAqAtd/bfuOarteVumGGJDxi1Bvfrv8tNl+uG5WPUjS+Br167VvUl4LTjBt3+UwC9mUTfMgQXaGr1oE9Mvz7izjnSaFcqPgPG7VL9TqTX6YblfYsKdfNFyDUPWb01pO/tfEZ+2v/L9EptuR1muDcNEVkKQLf/tD9v23GDrj2p/wsk' +
                'va7/f1rre9MQvvnjGm1j8TM7V/HcLOEl2rWq7xmX6CUILtCWu/ufemu9bv4sAAQPcr8Fw33twEve2eyhlZuqTumb6daXppHGG3sXKC26GWZYvA07v5OXAdCt3+i/8MHfz5V97piUoXJCS90yMoVWbfoi8k2MExEREU1rZgxWd++/742wy4laaOtfSlBiENg1jM+aDzOs+ebBL1w/8K/6peW2AhD/Xr0t6a2E8nH0zfvoenzEVw0g/dKIXqSFNgAwoyNOGezayM6H0Dd9xl3nHwGg5j3FAA5ZqKUtd8IMG4tuLpbkkMYby8x5MedL+ECk1/VOhgJ2TsY5cQw60q4hTb8CAL7ZvR+Ua5bYst6yF403juUWVGb1rkkWTd4HoJhJLK7Cc5vJNYzOOeJoVzA+fStcfMtghhFc0F+15MAW48AW+OrFW+/2Dr5ZAGTONQNfJTOv7EusSGABrNQwc1JD4zDe0e59Ou4elH0oNrv23EGh2Hdl38W63YJyr3VrxsDKTb5lEl7SN9MNxSVgM6+U2nOHLErqPRpYBCvltml9ZZ87Bx7+h5UAwDdPEh+B3+GPOZrVlh9q6nHGiYiIiKY7qwtmZFiZBU/NoOoMJZMykaVoHvcma+uPpPYCqT5Dm68uZiu04/ejeZ9ikmUCRJYVR3RDa3bEjtNyfyLU5C2S/oSEl2hwuURPGrjwAcW/iicfkfi/wDezWJ5Dqt9pr/t3p+lOEr+kb4g+6EBx2o7TJKmx6Wnr7TcWS/31MGMSO643FJEjx/uP9mPZ8UYY7YrFJ7gcvnrkmmGt762r4p64GXHGJ7bHRtt+dSms9b31g6rfqa3L+vKPrlcUHf0tKJel1Y67pGEFqk5B61d6K0kVM619S8DS6zT1fN8kL2Pxhsn+3DEpQ4ARlMRlUnWWw2NhafIhbfkx40RERESkyT8bDR8qFtjT1PMSPNdxcB48SDNrnBMlX5GGD0l4CeJXOf7x3FoPKyXe+kH1/Mz5/QNIBxI+FID2PNn3Ppp6WWLLikMa' +
                'Ta0e8ajY6gIgocN0XNMQ/ckXh22nffXiEq6+2HY9KsEFEv8XiR1X3L9p0OH0yuJVaHEdxMwrJXGxbna4LueavhL/l95oFPNrZtUoQorgQUgO7DMHAEBu88CRNoBiKspY9LTElqlveMPmMp/eDgxaowFAomcD6O20xRNcJjUMs3OOKNoVio80Xo3iBA0AuVWwUppZp2tPGllIc1sA6PpPOU3T0My6YsmeEU+WmYBop1fq1r1kzjXGgpvsdZftLJK1HsCgRYsOyaBSt2BYr3WI5Kpi9Rn1LZPqM/pK/PZ1SHvLl52+wdROiRmGSx+o7HPnNBznf1mnO/FI1XlSs8L5qVivTV+CWgwVEREREXKrkGsubtWhzV9DrtmY9cXenWt9ywZunirVZ6Db7R/x2nInihsn7bLLtcxb2fsRxb2TFj7Se4Jvmcy7GWZ46PqjyKD9ehFcMHDFDbBz+U/DCgBou2fEV51+CYDUXthX1UXqr5fAwtGkIXbdVnnIP06LdT0HFNrsLbe5/lNDrtQ54fUjWCmpPRe+em3/08BBrCx8pMTGz06KSydSq4e0pFi4t7+WR/G6dqZvipsiD51VYaX6a4sUG5l8BIDUXtC3OELqr5fac2GltOMWFDcRb7zRce8qc37vsppRbW6lyVuKazQG7eXccAWAYqfV5C2wUlJ92qDmDV60VaZzjjTaQ1u4e/EZbjrmRmPfV3snX+xMH2jqZQkvkXkr+59Kc7403iizbyvf4JmfHbjaRRLXysJHehvZ/QwAabii/yui2FWGdwnjGm30FhW6Gb56Y+4Pe9dDFTvJ4A2kEFwus28r/sblFpR9bRlt9wCQ2d+Ar37gTDdYSQxcxuhbJrNvG/SsFYM8+xv9URp8wsT0q5HiTJnpnpJB8HBJfAhOK6KtTt3+1WKmk4iIiIgA6PYfypzrtOMu5FbZa86Qxq/31koAtGtVcX6KzL5N883ufxLX5qvhmyXVpxV/hh5Nvw5AN39cFj0g4SWyeEB1j1yzNn9t0D/pqk+T' +
                '6paBKQB74yeGjLik4Yri39VH8Yd6Td6C1GUSXmIsunn0cUv+WXClhJdIcSlQel3pDZiqTsGAwroD2yC5z0rsmPL7gFrrteuJYkiHLNSS8BKEl/Qmp/ozVn8s/Q/l3qUTD5ccIUtsmUQv0eQt2nFLcdKTHDjoFgw+/0XxnSbzvyv4LgDddF1xDCwNK2Tmlb2VR/pSdX3lM3ZZwKWp1WP153rd+g2Z/90hHzFwj3ZtuXPX5g16h3Kdc0TRHiq9clzis+tKtOJVb1gx6LoW3CmxZYOuCyizmZFDg7Fz51ptvhqRpRJeInOukTnXDDla/n6Na7T7WmjGpPZcmXdzcaKQvfHTxoL/kYYVQ962uGOR+y0o+1r3DJE0XCHhJUNK/GrH74ufOOhDBzxr2vojqT5jaJQmoF/tHs6Umd48Can5AIIHQrOwM4N+NAerQ9tv087fM05EREREA7MD2nKnseAmBJfDWq+bL+qfzbFhOXKrZPZtElg0cJjnPNC6aNeda7Xlbt10Xe/f7a319poztP2h/qPtD9lrzhiydkm7VvXVr9HUanvN+3YdQhRXZ/Su0RjFVa89qb8ZVkq33zyyDXcB5Fbp1h/0t7PkLrM7J6eUHAJp1+P9FUDdFffSHrJQy1qv228euAlxcQdip/UmUn0GrFTpTakGbtxrrbfX/XvfBuHatcp+Y+if2bXpcwPDpdm3i2Ng3fqD/p3F0+t06w/652u03qQtd/cPOIsxH+maGtdubK9Z0R+NXd5fm6/W7Tf3NUBb7h46nHbvnCOMdskcwXjHR7tW9b5q4ANlrbfXHDH0zVvu1qb/Lt/gwbtca2q1br+5v8702pMGhXTw0TLGOdo7O+rl2rVKwktk4SPFFIa95n0DPxTpdX17KpW5Ba6vHcateRzF+UEDb016pW66zu1Zs9bb6y7ri4OmVuum64ZmSCv63JX+qrFeSvC/rEREREREI/tndOJamXmltj+krbf2DauKSzzUTumGFS41X8ayGfXXS8OK4syLMmfOWymx' +
                'ZfYby8fqT76y8BEJL+ktFLqn3Z1iWLb+wGWfbyKiPQFnyhARERERjZi2fsV+dSmspDH3W/375gb30/Y/DP3D+57At0xiy7Rr1ZhlZBpvLFbi2AMzMihOcsk1MyNDRHs+1pQhIiIiIhoVa702XV52k+Y9gSQuA3YuuhndOzTeOKTOAgDd/sM98WLjV8FXry13s4cS0Z6PM2WIiIiIiKY4qX7n6Er89ku/Mqig5qgqVkyQmvcA0NabeN+JaBJ8P7OmDBERERERERHRxONMGSIiIiIiIiKiCmBShoiIiIiIiIioApiUISIiIiIiIiKqACZliIiIiIiIiIgqgEkZIiIiIiIiIqIKYFKGiIiIiIiIiKgCmJQhIiIiIiIiIqoAJmWIiIiIiIiIiCqASRkiIiIiIiIiogpgUoaIiIiIiIiIqAKYlCEiIiIiIiIiqgAmZYiIiIiIiIiIKoBJGSIiIiIiIiKiCmBShoiIiIiIiIioApiUISIiIiIiIiKqACZliIiIiIiIiIgqgEkZIiIiIiIiIqIKYFKGiIiIiIiIiKgCmJQhIiIiIiIiIqoAJmWIiIiIiIiIiCqASRkiIiIiIiIiogpgUoaIiIiIiIiIqAKYlCEiIiIiIiIiqgAmZYiIiIiIiIiIKoBJGSIiIiIiIiKiCmBShoiIiIiIiIioApiUISIiIiIiIiKqACZliIiIiIiIiIgqgEkZIiIiIiIiIqIKYFKGiIiIiIiIiKgCPBvetOxcBwNBRERE05zhi9cfPo9xICIioon75wdDQEREREREREQ08ZiUISIiIiIiIiKqACZliIiIiIiIiIgqgEkZIiIiIiIiIqIKYFKGiIiIiIiIiKgCmJQhIiIiIiIiIqoAJmWIiIiIiIiIiCqASRkiIiIiIiIiogpgUoaIiIiIiIiIqAKYlCEiIiIiIiIiqgAmZYiIiIiIiIiIKoBJGSIiIiIiIiKiCmBShoiIiIiIiIioApiUISIiIiIiIiKqACZliIiIiIiIiIgqgEkZIiIiIiIi' +
                'IqIKYFKGiIiIiIiIiKgCmJQhIiIiIiIiIqoAJmWIiIiIiIiIiCqASRkiIiIiIiIiogpgUoaIiIiIiIiIqAKYlCEiIiIiIiIiqgAmZYiIiIiIiIiIKoBJGSIiIiIiIiKiCmBShoiIiIiIiIioApiUISIiIiIiIiKqACZliIiIiIiIiIgqgEkZIiIiIiIiIqIKYFKGiIiIiIiIiKgCmJQhIiIiIiIiIqoAJmWIiIiIiIiIiCqASRkiIiIiIiIiogpgUoaIiIiIiIiIqAKYlCEiIiIiIiIiqgAmZYiIiIiIiIiIKoBJGSIiIiIiIiKiCmBShoiIiIiIiIioApiUISIiIiIiIiKqACZliIiIiIiIiIgq4P8PADoUozXdVNbLAAAAAElFTkSuQmCC'
          },
      ],
      };
      const pdfDefinition: any = {
        header: header,
        content: [
          {
            columns: [
              {
                margin: [0,100,0,0],
                alignment: 'center',
                style: 'title',
                text: [
                  {text: '\nCONTRATOS COBRADOS ', bold: true}
                ]
              },
            ],
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
            margin: [350,0,0,0],
            table: {
              alignment: 'right',
              widths: [200, -49, 5],
              body: [
                [{text: [{text: `Caracas, ${new Date().getDate()} de ${this.getMonthAsString(new Date().getMonth())} de ${new Date().getFullYear()}`}], border: [false, false, false, false]} ]
              ]
            },
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
                alignment: 'center',
                text: [
                  {text: ''}
                ]
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
                {text: `${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.mtotal)} ${this.receiptList[0].xmoneda}`, style: 'tableHeader', fillColor: '#fdd213'}]
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
        footer: function(currentPage, pageCount) {
          return {
            width: 600,
            height: 20,
            margin: [0,19,0,0],
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABdwAAAAoCAIAAABrbK+bAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAFASURBVHja7NixEUAAAARBBGKRVBHaVpMaxAKjCxfYLeGjnxvPY3nuawAA+LdpXtZ9swMA8N39MAEAAADA90QZAAAAgIAoAwAAABAQZQAAAAACogwAAABAQJQBAAAACIgyAAAAAAFRBgAAACAgygAAAAAERBkAAACAgCgDAAAAEBBlAAAAAAKiDAAAAEBAlAEAAAAIiDIAAAAAAVEGAAAAICDKAAAAAAREGQAAAICAKAMAAAAQEGUAAAAAAqIMAAAAQECUAQAAAAiIMgAAAAABUQYAAAAgIMoAAAAABEQZAAAAgIAoAwAAABAQZQAAAAACogwAAABAQJQBAAAACIgyAAAAAAFRBgAAACAgygAAAAAERBkAAACAgCgDAAAAEBBlAAAAAAKiDAAAAEBAlAEAAAAIiDIAAAAAgRcAAP//AwDAGwVS1BukKgAAAABJRU5ErkJggg=='
          };
        },
      }
      pdfMake.createPdf(pdfDefinition).open();
      //pdfMake.createPdf(pdfDefinition).download(`ORDEN DE SERVICIO PARA ${this.getServiceOrderService()} #${this.search_form.get('corden').value}, PARA ${this.search_form.get('xcliente').value}.pdf`, function() { alert('El PDF se está Generando'); });
    }
  }
}
