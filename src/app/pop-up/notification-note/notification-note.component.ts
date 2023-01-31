import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-notification-note',
  templateUrl: './notification-note.component.html',
  styleUrls: ['./notification-note.component.css']
})
export class NotificationNoteComponent implements OnInit {

  @ViewChild('Xarchivo', { static: false }) xarchivo: ElementRef;
  @Input() public note;
  currentUser;
  popup_form: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  canSave: boolean = false;
  canSaveSettlement: boolean = false;
  isEdit: boolean = false;
  finiquito: boolean = false;
  alert = { show : false, type : "", message : "" }
  xrutaarchivo: string;

  constructor(public activeModal: NgbActiveModal,
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      xnotanotificacion: ['', Validators.required],
      xarchivo: [''],
      cfiniquito: [''],
      cnotificacion: [''],
      corden: [''],
      mmontofiniquito: [''],
      xobservacion: [''],
      xdanos: [''],
      crepuesto: [''],
      xrepuesto: [''],
      ccompania: [''],
      mtotal: [''],
      ccontratoflota: [''],
      xnombres: [''],
      xdocidentidad: [''],
      xtelefonocelular: [''],
      cpropietario: [''],
      cvehiculopropietario: [''],
      cmarca: [''],
      xmarca: [''],
      cmodelo: [''],
      xmodelo: [''],
      xplaca: [''],
      fano: [''],
      xserialcarroceria: [''],
      xcolor: [''],
      cmoneda: [''],
      xmoneda: [''],
      fcreacionnotificacion: [''],
      mtotalcotizacion: [''],
      mmontototalgrua: [''],
      fcreacionnoti: [''],
      cservicio: [''],
      cservicioadicional: [''],
      xdesde: [''],
      xhasta: [''],
      xcausafiniquito: ['']
    });
    if(this.note){
      if(this.note.type == 3){
        this.canSave = true;
      }else if(this.note.type == 2){
        this.popup_form.get('xnotanotificacion').setValue(this.note.xnotanotificacion);
        this.popup_form.get('xnotanotificacion').disable();
        this.xrutaarchivo = this.note.xrutaarchivo;
        this.canSaveSettlement = true;
        this.searchSettlement();
        this.canSave = false;
        
      }else if(this.note.type == 1){
        this.popup_form.get('xnotanotificacion').setValue(this.note.xnotanotificacion);
        this.xrutaarchivo = this.note.xrutaarchivo;
        this.canSave = true;
        this.isEdit = true;
      }
    }
  }

  onFileSelect(event){
    const file = event.target.files[0];
    this.popup_form.get('xarchivo').setValue(file);
  }

  onSubmit(form){
    this.submitted = true;
    this.loading = true;
    if (this.popup_form.invalid) {
      this.loading = false;
      return;
    }
    if(!this.popup_form.get('xarchivo').value){
      this.savePopUpForm(form);
    }else{
      const formData = new FormData();
      formData.append('xdocumento', this.popup_form.get('xarchivo').value);
      formData.append('agentId', '007');
      this.http.post<any>(`${environment.apiUrl}/api/upload/document`, formData).subscribe(response => {
        if(response.data.status){
          console.log('hola')
          this.xrutaarchivo = `${environment.apiUrl}/documents/${response.data.uploadedFile.filename}`;
          this.savePopUpForm(form);
        }else{
          this.alert.message = "EVENTS.NOTIFICATIONS.CANTUPLOADDOCUMENT";
          this.alert.type = 'danger';
          this.alert.show = true;
          this.loading = false;
        }
      }, err => {
        this.alert.message = "EVENTS.NOTIFICATIONS.CANTUPLOADDOCUMENT";
        this.alert.type = 'danger';
        this.alert.show = true;
        this.loading = false;
      });
    }
  }

  savePopUpForm(form){
    this.note.xnotanotificacion = form.xnotanotificacion;
    this.note.xrutaarchivo = this.xrutaarchivo ? this.xrutaarchivo : "n/a";
    this.activeModal.close(this.note);
  }

  deleteNote(){
    this.note.type = 4;
    if(!this.note.create){
      this.note.delete = true;
    }
    this.activeModal.close(this.note);
  }

  searchSettlement(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cfiniquito: this.note.cfiniquito,
      ccompania: this.note.ccompania
    };
    this.http.post(`${environment.apiUrl}/api/notification/detail-settlement`, params, options).subscribe((response : any) => {
      if(response.data.status){
        this.popup_form.get('cfiniquito').setValue(response.data.cfiniquito);
        this.popup_form.get('cnotificacion').setValue(response.data.cnotificacion);
        this.popup_form.get('corden').setValue(response.data.corden);
        this.popup_form.get('mmontofiniquito').setValue(response.data.mmontofiniquito);
        this.popup_form.get('xobservacion').setValue(response.data.xobservacion);
        this.popup_form.get('xdanos').setValue(response.data.xdanos);
        this.popup_form.get('xrepuesto').setValue(response.data.xrepuesto);
        this.popup_form.get('ccompania').setValue(response.data.ccompania);
        this.popup_form.get('mmontototalgrua').setValue(response.data.mmontototalgrua);
        this.popup_form.get('ccontratoflota').setValue(response.data.ccontratoflota);
        this.popup_form.get('xnombres').setValue(response.data.xnombres);
        this.popup_form.get('xdocidentidad').setValue(response.data.xdocidentidad);
        this.popup_form.get('xtelefonocelular').setValue(response.data.xtelefonocelular);
        this.popup_form.get('cpropietario').setValue(response.data.cpropietario);
        this.popup_form.get('cvehiculopropietario').setValue(response.data.cvehiculopropietario);
        this.popup_form.get('xmarca').setValue(response.data.xmarca);
        this.popup_form.get('xmodelo').setValue(response.data.xmodelo);
        this.popup_form.get('xplaca').setValue(response.data.xplaca);
        this.popup_form.get('xcausafiniquito').setValue(response.data.xcausafiniquito);
        this.popup_form.get('xcausafiniquito').disable();
        if(this.popup_form.get('xcausafiniquito').value){
          this.finiquito = true;
        }
        this.popup_form.get('fano').setValue(response.data.fano);
        this.popup_form.get('xserialcarroceria').setValue(response.data.xserialcarroceria);
        this.popup_form.get('cservicio').setValue(response.data.cservicio);
        this.popup_form.get('cservicioadicional').setValue(response.data.cservicioadicional);
        this.popup_form.get('xdesde').setValue(response.data.xdesde);
        this.popup_form.get('xhasta').setValue(response.data.xhasta);
        this.popup_form.get('mtotalcotizacion').setValue(response.data.mtotalcotizacion);
        this.popup_form.get('xcolor').setValue(response.data.xcolor);
        this.popup_form.get('cmoneda').setValue(response.data.cmoneda);
        this.popup_form.get('xmoneda').setValue(response.data.xmoneda);
        if(response.data.fcreacionnotificacion){
          let dateFormat = new Date(response.data.fcreacionnotificacion);
          let dd = dateFormat.getDay();
          let mm = dateFormat.getMonth();
          let yyyy = dateFormat.getFullYear();
          response.data.fcreacionnotificacion = dd + '/' + mm + '/' + yyyy;
          this.popup_form.get('fcreacionnotificacion').setValue(response.data.fcreacionnotificacion);
          this.popup_form.get('fcreacionnotificacion').disable();
        }
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.TAXESCONFIGURATION.TAXNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }

  generatePdf(){
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
              image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAjUAAADXCAYAAADiBqA4AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAEEdSURBVHhe7Z0HeFRV+ocTYv2vru6qa19WBZUqgigI9rL2gm1dK4qigih2RRHrWkEBG6ioWEBUUIqKgBQp0qsU6b1DElpmJnz/8ztzz3Dmzs1kWkLm5vc+z/eEzNw+IefNd75zTo4QQgghhPgASg0hhBBCfAGlhhBCCCG+gFJDCCGEEF9AqSGEEEKIL6DUEEIIIcQXUGoIIYQQ4gsoNYQQQgjxBZQaQgghhPgCSg0hhBBCfAGlhhBCCCG+gFJDCCGEEF9AqSGEEEKIL6DUEEIIIcQXUGoIIYQQ4gsoNYQQQgjxBZQaQgghhPgCSg0hhBBCfAGlhhBCCCG+gFJDCCGEEF9AqSGEEEKIL6DUEEIIIcQXUGoIIYQQ4gsoNYQQQgjxBZQaQgghhPgCSg0hhBBCfAGlhhBCCCG+gFJDCCGEEF9AqSGEEEKIL6DUEEIIIcQXUGoIIYQQ4gsoNYQQQgjxBZQaQgghhPgCSg0hhBBCfAGlhhBCCCG+gFJDCCGEEF9AqSGEEEKIL6DUEEIIIcQXUGoIIYQQ4gsoNYQQQgjxBZQaQgghhPgCSg0hhBBCfAGlhhBCCCG+gFJDCCGEEF9AqSGEEEKIL6DUEEIIIcQXUGoIIYQQ4gsoNYQQQgjxBZQaQgghhPgCSg0hhBBCfAGlhhBCCCG+gFJDCCGEEF9AqamkFG/dKtunjpfCX/pJ4Y9fS8GAnlLww0dSOOgT2TK0l2z9ra9snzxEgmuXOnsQQgghFRtKTSWgeMcO2TJliqz7sqcsf/YJWfjfy2XBOXVk8YV1ZMkVdWXZtfVk+c31ZGXzk2Vly/qyunUDWd22gax55BRZ+3hDWffcubL5w/tky09dZceMYRLatMo5MiGEEFJxoNT4mI3DRsicO+6WSbVqy5TaNWT6yTXl' +
              'j1NrybymtWThubVl8SV1ZOlVJ8myG+vJitt3Cc2ah5XMPKFk5ulTZf2zkBr19QUVL54WDvXvDZ0ul63DP5Tiwg3O2QghhJDdC6XGZwTzC2Tpux/L+Ebny+gjj5ffjzlBJlY/UabU2iU1f57hSM2ldWXZNXXDWZo7ldC0qr9LaJ5pGJaX/50mG19tJBvfUF/fVF87OaH+veH101Q0lYK+7SWwbIZzBYQQQsjugVLjE7bMXSB/tHlahh9eV379ezUZcUh1+U1Jzbh/nSATlNRMrqmkpp6H1FxbT1bcoqTmLiU0bRrI2kdPCWdoIDSvOCLzdiPZ1LWxbHrvdNn0/umyuZv6t/qqv1ev431Iz+ZPbpftUwfIzuKQc1WEEEJI+UGpyXJ2hkIy/+WuMnj/E2Xw/x0nQ/Y/Tob9TUnNwdVl1OHHy9h/Hi/jjztBSc2JMq1eDZlldz8ZqbnN6Xp6UEnNEw1lfQcnQ6OEZlOXsMDkf6hkpof6+lkTKei5K/I/aSKbP3ZEB4LTqZHkf9pcgusWOldICCGElA+UmnJgc3CnzN5WLBMKQzK+ICQztxTL+sBO593UKZz9p4xtcpX8vM9xkRiy33Ey9K/VZPhB1WTkYdVl9FFKao49QSadeKJMrVNDZp5SQ+Y0qSkLzgnX1KD7SWdqIDVtG8i6J8M1NLrLCRkaZGaUtGiJ6aXim6ZS+K2Kvk3Cof5d0EfFV0pwlPBAfpDB2dj5TNk2rqfs3Jn+fRJCCCGJQKkpI/JDO+VXJTAdVwWkw/KAPLs0IO2XBKTdYhULA/LUgoA8r6L/2pCsLUqu4YcoLHyzm/xyQI0ooUEM/ouSmv2Pi+mC0nU1tWvIjAY1ZXbjmjL/rFqy6KI6srTZSVFSs7bdKbrrCd1JyLxs7t44nJ3p7UhMfyU0A8+XLYMulC0/XqK/6u8HnCUF/c4ICw4yOMjsvNtI8r+8S0IbljhXTgghhJQdlJoMU6yEY1RhSF5aGZDnVuwSmmcgM5bQPP5nQB6bF5BH5wbkkdlB' +
              '+X51SALFpcvNtsXLZdzZ18XITCTQBbXfcTLswGoyXHdBVY/qgjJ1NfPOrCWLLwiPflp+U7imBt1PyNQYqYGU6CzNV+GMDMRFi8zgZrJ16I2ybdjNsvXX28Jfh9wgW3++Iiw53zvZGyU3kKJN750t2yf1ce6AEEIIKRsoNRlki5KSD9cF5fkkhOZhJTQP/RGUtjOD8sLcoKzdUbLYbF20VEZUb+otM1bobM1fq+lszchDw11QGAUV3QUVrqtZclldWX7DSeHRT63DNTW6+8lITQ8lNeh26ndGODvzy7VhkRnRUrb/1ka2jW6rQ/975L36PWwTkZveSmzUMXCsbaO7O3dCCCGEZB5KTYYoDO2Ud9YGUhaaNjOCcv/0oLRT/16zPVZsEhUaHTHZmuNlXNXjZUI1ZGtqyIz6NWV2o11dULqu5raTZdW94dFPKBRGTY3ufkKmRkkNBAVZGp2hgdCMeVi2j28vOyY+Lzsmvahj+4QOsn3cE1pwtg5vruWmcMA54bobZG26NZbtYyk2hBBCygZKTQbIlNDcPzUoracE5fFpQVltiU1SQuOEXVvjztZMq1tDZjUMj4JadH5tWXKl1QWFYuGnndFPbzfStTG6+wlS89NluqsJ0rLj96ekaPL/pGj621I08x0pmvV++Cu+V6/jfZ29UdtjP521QTGxOt6asd10Nx0hhBCSSSg1aZJpobl3UlDumRiUR9X3q7ftTEloTLhra7yyNQvOdkZBXaukpvnJkS4oXVeDId3vh0c+oUgYmRojNcjKFE3rJEV/dJPAvM+laH5vHYE/v5SiOZ/IjhldwtmbsY/JthEtdB0Oiox1d9THp8u00R9QbAghhGQUSk0alJXQtJyg4vegPDK+SL5v+h9PYUkkzLw1ZiSUmWHY1NZ4ZmtahmcVxozCkS4o1NX0aaq7klAQvH1UK931pKVGCUxg4bcSWjJIgsuGhGPxAAks6COB2R/pbbAt6m10rQ1GSTliM3lsD4oNIYSQjEGpSZGyFpq7xwXljrHq' +
              '3/2Wy1fHnuUpLYmEKRo289ZEjYTCsgmnWbU1mIjvdle2plMjXQtjuqAwwgmZF9TO7Jj6hpaa4KJ+Elo+TIJrxkto3WQJrZ0owZWjwnIz73OdtdH1NkqGIEWQI4jNxh5nyNBF0yg2hBBCMgKlJgXKS2juGB2U5r8F5bbeS+WLqmd4SkupYRUNm1mG7XlrZjaoqSfjMyOhsLjlqhZObc0zDfVSCZFsDSbeG3h+uFh4dFvdvYRaGmRlIDUQmuLN86W4YIkUb5oXlpulg3W3lC02dsZmSa8bpN/GLRQbQgghaUOpSZLyFppbRwbllhFB+W/PxfJZ1dRqa+xuKF00bHVD6aJhZz0oM28NJuNbdU94JJQZ3m1qa/TQbhQMO9kadC8hG6O7n9aMl535C2Xnjo1SXJSv5Qaigy4p1NposTFdUabG5qsmMmJoR+mzKUixIYQQkhaUmiRwC037ZbFC8+T8WKF5eFas0Nw3OVZoWkBmXEJz6/Cg3KzixmFBufrDhfLp0U08xaW0iJq7xt0NhQn5SuiG0pPxvaik5q1GeiI9PbxbyQiyLbq2BgXDGPU0v3c4W7N+muzcskKKQzu02EBydLeUkp6iuZ+Fa2yUDOniYYyK6ttE8ns2lY9mTpTeGyg2hBBCUodSkyC7W2j+M1TFL0G5qPN8+SRFsSlpNNSUWruWT9BrQl1qTciHWYadId5Y3FLPW2OKhofeGB7ebXdDrRihxUZ3QW1bK8WFy6R4wwz9OgqKMVoKQ771pH3DbtbdWejWWtzrWnlxcYF8uS4oIYoNIYSQFKDUJEBFEZrrBgflmp+Dcs6rf8onR6UgNqa+Bqt4Y12oI3bV1+iZhnV9jTPT8BVKbJy5azxHQzn1NRATd32NHgGF7MzGWVK8aY6WnNCq0bpw2GRrMI8NJvHT3VDOHDaDh3TRz/SLNRQbQgghyUOpKYWKJjTX/BiSqwcGpdFzc1MSm6SHed/sDPN+5BRZ/2xYbPRClZ84K3Y7hcM6YzPxed0VhRobCIzujlIy' +
              'owOjoxb/EBkNhW2xD/Y12ZrVn18kz84v1DVJn62k2BBCCEkOSk0cKqLQNBsUkisHhOSyH4JycrvZ0iMVsfFYG2r8saUXDhux2fB6eF2oKLFxzV+j56iZ31sP94bgaKFZ0EdnaiIT8415OLycwk+X6QLk/M9Pl69G9o08z0+WU2wIIYQkDqWmBCqy0Fyh4vL+Ibnw26DUfniW9DgyTbE5bJfYTK6hxKZejeiVvJvFio17Yj69gvfgZuFRUWMfC3dHYckE1NDM+STc7YSvWE4B3U/I1BipsWYbntv7Vv08H5kTfp4fLw1RbAghhCQEpcaDbBCaS74PyaX9QnJO76Ac33qmfJyG2MRMzKfERo+IKkVs9Bw2pnjYLHpp1odC1gYT9GHByymvapHRMjP1DS08Zm0oIzV63holR8j+vD1uon6ebdXzfEA9xw8XVW6xCYWKZebsZRmJHTsCzlH9zabNW2T5yg1xY83azc7W5Usi17Y5f6uzNSEkGSg1LrJJaP7dV8W3ITnjs6D8q+UM+fiI5MUGhcNhsakuo7yGettic5VVY4PiYTMqCsO9Mesw1oj6NjwyCqKy9dfb9Jw0ekVvCI4SGS0zGNKN0U8jWkYWvIxIzWdN5Ldv20WEps208Hw+HyyovGKDBi7noJsyEnPmrXCO6m8efKqn5/3bse+Rt5e72BQXF0vNxo95Xo8dTz7fy9mDEJIMlBqLbBSaC78JyXlfh+TU7kE5+o7p8lGKYqOHervFxpWxiVnR+8EGsrbdKXoeG7345Xunh7ujeoUn6UOtjZaboTfqjIyWGCU5+uuIFmGhQZZm0IXhEVC9m+hMzfoPzpCnJqyOCA2eJZ7ju/Mqp9jsVPeMxrCoKCjz5q+Srt0HS9WT2ng2hogDj7lLPvr8V5k1Z5ls21ak98UxTFQGAoGgLFuxXj74ZKiccNojns8JUd7y0HfABM/r+L+jmsvjz30lE6cslLXr8iUYDDl7EEKSgVLjEE9onloUKzSm5sMWGjTCbqG5e3ys0Nw+' +
              'KlZobhwSKzRXD4wVmksgMy6hOa9XSM5RcVLnoBxxc+bFBjU2pnh4wXnh4d5YTkHPY4N1oh5vKOs7nKrrbDa+Hc7aIOMCSdFyg8zNj5fodaP0EgkIyAwyNBCa/k11hgfDuiFFkKPuPw+KEho8x7vUc+wyhzU2YOHiNXLI8fd4NpBDhs9wtiJgxh9LJe+Qmz2f1V+rttDdQeUBhLLh+c94Xkfbdj2drQgh6UCpUfhBaM78IiRNPw9JjVeDcuh/p8uHaXVFRRcPR0ZFNawVmccGE/Qtvf4kPfPwqnvDdTbojtJZGyyrgCLi7o7coN4G0gLBwWzEKCpWoYuD8RreU9tg2/wPT9cjqwZ83THqOUJo8AybjwlK5z8oNqDFA91jGsf9q96psxQkmuMatI15ViZefLOvs1XZ8ouSTa/zI1556wdnK0JIOlR6qfGT0DT9LCSNPg1J1Q4B+ccNmRMbex4bswDmgrNr6yUVUECs62wwSV8bZ3XvDuFaG90lBbnp5oySwtpRXzkZHBOQmc9PjwgNsjTI9kzqdles0PwWfoZYC6vTTCU2xZVbbHp8OSKmcazd5HHnXWJz8tlPxTwrEwdVaylbtmx3tiw7zrnyRc/zI55gDQ0hGaFSS01+cKd0VvLy2soi3wjNqZ+o+DgkRz4ekIOvmS7dD09ebGLmsXEm6DMre8+oX1NmNwqvFYUCYj37MJZVaO5kbVBEjDWjLLmBqOiaG3RNIRvzcbj+Bl/19+p1IzTI9Kx87Wz1DIs8hcY8vzemVW6x+eaH32Max5POfNJ5l9gYqTmiVis5rMZ9Mc+t03uDnC3LhjHj50XO1eDcdlHnRtzd9kNnS0JIOlRaqYHQ/G9+UB5QcvLEjG3y3LIi3whNw49CcnK3oBzcJiAHXT1duqUpNnpJBSU2WFJhghKbyTVr6AJi1Nlg9mHdHXVJHVl2jZKbm+vJqhb1ZXWr8CzEEbl5SckNam6QvXlLRRclMV2dUP/WMtOpkZ7YDyK0/oVTpd2QuSUKzQ3q+V2v' +
              'nt+rUyqv2Hw3YHxM41jvLEqNF8fWf1A/H9S0vNa5f8xzO7JW6zId7n75f9/Q50FW6Ot+42LOf+3tbztbEkLSoVJKjS00GDYMMXlgYqG0X1TkC6Gp3z0k9bqFpM67QTng7oD8/UolNoelKDZYUsFZK2rU4cdHFxDXDXdHYSFMO2uja21ucUZItQ5nbtAthfWj1j0XrruBuGCeGy06KvBvLTPqPUgQ6nPe6d0vrtCYZ/fKxMopNpSaxPn7cXfr53NBs/9JQcE2+duxd8U8u26fDnO2zizTZi6JnOO5176V0b/PjTov4tyrXnK2JoSkQ6WTms0uobFH2LQck+8boTnpg5DUei8kNd4Kyl9uDciBl6UoNs5aUZHVva06m4knhLujpp/sDPtuWkuv8o1aGz30+wYlN7edrDM36JbCEHBkbyA4GAoOycEkfia09CiZQXZn7aOnSN8uL5cqNHh2eG4vTah8YkOpSQyMOqpycHj0k8mIPPvKNzHPDsXEZTGU+sa7uurjY9j2+g0F8sfc5THn5udGSGaoVFITV2iUkNw5JiB3jtrsG6Gp825IanYNyXGvBWWfGwOy/8XT5f0UxMas7m3X2US6o6qFJ+qLZG0a1dRz2mDoN7qkMGFfJHPT/GQ9cZ/ummqjJKdtWHK06CiJ0f9++JTw6+r9X15+JCGhMc/t+d8rl9hQahIDmRnzfDBiDEAu/nL0HVHPDvFFn9H6/Uzx54JVEaHChIBg5aqNMef9Z902+j1CSHpUGqkpTWggJLcrGbllREBuGbrBN0JzYpeQHN85JEe9EJS9rgnJfv+eKe8dmoLYqHDX2US6o451sja1nFobPfQ73CVl5AaZm2XX1tPz2xjBQQYHkoOlF5DJ0aH+jdfQdTW0/f0JC83F/dTz+i4k7cdUHrHJRql5+JnP5ZTzno7EipUbnXfKjqXL10eeD85veKT9F1HPDoHRY5isMFPc9WB42P0e/7hFXwfYvr0o5rz7/fMO/V5pXH9HZ6nR6NGE4u0PfnL2Sox2' +
              'L37teRx3GDEEg36ZKh3fHeQZv0+a72yVGnP/XOl5XHd07rbrPrHPeHXeYSNnSf+fJuv6pU++GiHvfTxEF4Nj6HyHV7+Vp1/6Wp56obeefBEjz/D9869/pyetHDF6tl6qIt2fg42btsiCRWsSinTquXp9Nzbq/xQmeEwVzLDtdX3xorCw7EcOJkOlkJpEhcZ0dVz7c0BuGLReC82DkJkEhAbzp7iF5qZfY4Xm2p9ihebSH2KF5oI+sUJzZs9YoWnwYazQ1HonWmiOe0tFx2I59OmQ5F0ekn0vSENs7O6og6qHh307WRvU2pih3zPqhwuJjdzoYuILldxcVldnbyA46J7C7MSQHHRTRUJ9j4Lj4Y+2SEpoznMk8JlRIQlWArHJRqm595GPo6731bf7O++UHdNnLY2cDw2XARmTvQ+/Lep6EP0GTnS2SA80jHseeqs+5m33ve+8GsbrvJgxujTQ0K5bXyA/DZ0m1U55KOYYV9z0pkyaujChY7lB1xsaNfxcnX/1y1HHhXRBkhYvXafXIjNg7p32//tGGv/7Wcm1tjf7jJ0wz9kyeeYvXK3PCflseslzUcfe54jb5fZW7+ufnw97/ursEZa+C695RRd+29sj8MwhQD17j9Kyg8a/z/fj9PcvdeynPyPcB64b22Nixhvu7CxffTtG8guSX4vr869/k7pnPBFzHXZgZnBcLzJ6qeIeBYm6sVR5o+tAfT1H1b4/6ph2HHrivXLW5S/IJTe8Jpf+53UtgRUJ30tNskIDEcFyBZf0DUizfmt9IzRVVRzxRrEc+LASm0tCsve5M+Wdf6QmNu7uKDtrg1qb8AipaLlBMbGekRjz25wfrrvBBH66sBhdVM2U6FxTNxL4fuS9tyYtNHheZ30VkieH+19ssk1q0NAeXL1l1PXiL/+yXrph1Ng5kfPZf9UDt2QhTj3/mYxcE2YJNsfEkhU2XsPKV63e5LybGJg52t4fxdCZmnhx69YdUuv0XWtUISNTGpi52UicCSzZMWX6YmeL1MHn' +
              'gcyKOS4+03hg+y7df466lgP+1cJ5Nz5YWgSyc9UtHSNdh5AoLGORyuzTi5aslRMbRS/Vsddht+pMUiZodmunqGNDLk1WMFXw/Hr3HRszE/ct975b4Zfw8LXUpCo0NzgCcuYXQbmyzxrfCM1hr6t4tVj2vTckuReFZK+zZkrXVMVGBbqjorI2Tq1NpEvKkhsUE6NbCjU3mJVY190owUEGB5KDLA5ER8vOJeGvQ1s0jwgN1sByCw2emZfQoIuusXpejw/zt9hkm9R8P2hizPUixk3809mibEDjYc71aa+RzqthsNyE1xIKyECkA7IpKAzGsa68+U3n1V24GzmEW3xKAxMG2vujEc4kj3X4Uh8XApao5Jkshx0Q2WTvzQvIAY6HjEsi14Nt7KVEEpUaG3Rl2dkWiKP7ZygR3BNlYoh/JtiwsTBGJBHIPGWCs6+InjCyrP+vZgLfSk1JQmMvLhlPaK5WAgL5qP9+QC7rtcY3QnPgK8Wy3/+KZa/bldhcEJK8M9ITm5iszcFWl1RVD7mpV1NmNHCyN1pwaupRU5AcdFPpOhwlO4iBd7RMSmhMzRGEBs+rYY+QPPyLf8Um26Tmmtve0tdoZzAQ9zz8kbNF2YDuBXMur66lW+99L+p6EJj9Nx2eeblP5FiYeM8Nujns8yFKyz64QTeQvT9GWWUSNN44bjLDzY3U1Gn6eNS1QYywGGs6oO4Ex4IsJgqu3VxDKlIDkP1C15Q5DgI1OImKHoAc2fvb3aDp8O5Hv+jjoZvs8JqtIsdH12Qy11cSDzz5WeSYiHQzQOWBL6UmU0KjG9C+Qan+ekAu/XK1b4Rm/5eKZZ8XQlLlP0pszgvJnumKjQo7axPpknLJDbqlUHODgmJbcGaeEl4w84/TwqOn0FWF+OaO+9MSGvOs2v7sT7HJJqnBX5RIuSONvzl/qy5oNNeMxgYp/7LC7oYY/tsfzqu7wBBrdz0IwktGEgH1F+h2wTHOvOx559VoLr7+1ZjzIZOVDKivsff/792ZlRqzovi/' +
              'r33FeaV0jNRghXS7+wpxdJ37dU1OqkAucJxkpOai63Y951SlBuBZQxzMsRCPPvul827pTJ62KGrfTNWSNbowLMeosTKZNRO/jZvrbJU6KKy3j4k6sYqO76QmGaHByJp4QnNpv3ADekGfoBz1TEAu+Wy1L4Rm3xeLZc8X1NcOIcm7WonNuSHZo6kSm0PSExtkbcyEfV5yY2puUFCM0VKYwM8IDoaEa8mpHxYdxMct26ctNHhO9d4PyQPqc/Cb2GST1GD0Ca7vPy266O+7dh8cdd0oxiwrXnijb+Q8JdV3mCySHZfd+LrzbnKgwTLHKKkWBQJinwuBLopkKGupMd2FqUgNRnihENtdzIy5gFId8ZaK1NjymI7UAEwNYGdDED8OKb3WCLilBrNapwtGeuFYyIKhzsU9/5E9Si1VKDW7mbIQGkgHGs+mnwXlkLYBueDjVb4Qmv97Phx7Pq2k5jIVZ4dkr8YzpUu6YqNCj5BClxTk5m+75AbdUqbmBqOlIoLjZHAgOViCAaKDSf1eeLZXRoTGDG9vrT4LP4lNNkmN6W4ZOHiK/t5kbsx1Y8RFWWH/YkYNjRcTpyyMbGPH1BnJFbki44TRIdgXtRgldQHc92iPmHO9+c5A593EKGup+eHHSfq4qUoNWLJsnZ6Dx75O1BNhlFWy7G6pAV9+MzpyPAQ+a3Ov8SgLqUEXGI710NO7pik47YL2kXNgxf50F2ql1OxGIDQv/5m60KCboyShMY1n/feDcsA9Smy6r/SF0Oz1nBOPh6TKBUpszgpIXqPp6WdsnIjIzV+r7crcoObm0PBoKZO9iQjOsWHJQTcVROeuD2ZmTGjwnKq9HZJ71PH8IjbZIjUYropr+8cJ90aNnLiu+duR60b3D7osygL8xWrOg7lDSsLuqjCBLodkMDUOiHgT+WFOGPs8CLyWDNkgNQCfv3u0FxZehdgmQ0WQGkjqCadFF3ljHpzSyLTU4LP/V70H9LFs8X6/RzgjagL1ZOlAqdlN2EKD4deZEBoz8Z1p' +
              'PJso2WiiGs4TXw/Kfs0Dcv77K30hNHs/q7ZpXyxVHg5K7tkByT1Dic2p06XLwZkRG0RU5saRG4yWMtkbCA4yOFh+QUtO1eNlVPW6ckW/HRkVGjynY94slhZ9i30hNtkiNZjHBNdmZtQ1IGtjX3umRmy4wdII5hz2HCtuRo6ZHXU9CMgW0vyJgEbXNDT4Gm/o6+tdBsScC8PLkyFbpAbMnL1ML+ZpXy+Gzicz/0tFkBpgfp5N4D5KI9NSg7lhcBwUZNtgyDnq1sx5zrv6Zeed1KDU7AbKU2ggGZi995/tg/J/NwXknHdXaqHBsRIRGjTMbqHBEGS30DRSDbRbaOqoRtotNKahtoXmiNdihQYy4xaav3TYJTR57UOyx9Mh2buVEpumSmxOD8geDTMrNgjIjSko1tkbp2sqIjjI4GjJqS69m1xbJkJztBI+PKPbv81+sckGqbH/osQvdhs0+naNQvWGmRmx4cZMJId0fGmccenzkesxccf93Zx34/NZr12jrFAzFA9MGGefA5FsViibpAbg84dY2NeM551oF0lFkRp7gVIExLe0e8i01NzZpps+DuTYjVlrDIFrS6c4m1JTzpQmNHdkSGgaO1kTCA0EA43mIQ8EZK/rA3J21xW+EJp924Vkz6dCkttCiU1jJTaNdkhe/anSNcNio8PIjZO9iRacsOR0vL5DmQnNP9TzOUg9nxv7ZLfYZIPUmOwHRsJ4CQsmNLOvPxMjNtyYkVaYJbU0UPhpXw8CSxygNiQeEAxMJIjtMTcKJq+Lh3sWWESyM8Fmm9QAjChzr7kF6UykLqWiSA2uAz8T5riI0kbKZVJqULcFQcfEgF5F14N/nR51rnSGj1NqypHdKTRoNKt3Dsr+dwRkz6tDcsbby30hNFWeDMleT6ivNxdJ7qk7JLehEpt6U6XLQWUgNk5EsjdKcCIZnAOryUOPfFOmQoPnk6ueyXVfKbEJZafYZIPUmHqWkoawzpm3Iur6MzFiw40ZgQOxKg2IV/1z2kVdE+L+xz91' +
              'tvDG/ixefLOv82rJDB0xM+r4iAbntnPeTYxslBrw66hZUV0kCIw0K21ph4oiNSDZuppMSg1GCuIYJRXXo4sVw+fNuY6t/6D+WUkFSk05sTmQvNBguv1MCE1N1WgerxpN1LL887WQ7P2f8HpKTTst94XQ5D2u/gp5VEUzJTanKLFpsE3y6k4uU7ExYQRn8P7V5ZpuS7XQnNs7VmhQb+QWmpPUc4oRGvV84gkNnkWuuv/r1DGzUWwqutTgL0o0JKUVAdsT0WVixIYbM6tsk4s7OK/ExyuLgka4pBE7ECGTDUKjHq8Y2eBu5BDHnPyg825iZKvUAAx1d8+Ei8LxeHVIFUlqMDmjOS4CBbrxyKTUYM0lHCNeEbAZGWUi1fWZKDXlQKaEBuKRjtAc0yksFQd3UHKgpKbKRSE5veMKXwjNPo+orw8FJPfi7ZJbf5vknqTEpvZk6fr30z1lJNPx7uktykRoDnw5Vmj2fix8v9d9GMw6sanoUoO1Y3BNWIYA2ZKSAo2NfQ/pjtiwgXCYxhONQSJAFryWMcBqzl7Y6X40AomAoeX2sRHJNrrZLDXg2/7jPdcWKimrUJGkBgW45rgIrO4dj0xJDdYHM88MQ+W9/j8h3PPpYPHPVKDUlDEVTWjMKKO/PhqS3AtVnK8E5fXlWS80e2IkFKSmTZHknq3ERklNbp0tkldzsnQpB7G5s/3wchWavdoEZO/WAWn2XiCrxKaiSw1W8HVfXyKRzLT8pYHaFnPcZJYRMEsE2IEskteChmZ9HMhTor/0cRz38RHxMhVusl1qAFayRibPvo+7237oWX9VkaTm9Is6RI6LQJdaPDIlNR3fHRR1nEQDdUyFhclnQCk1ZYiX0GA9pt0tNKY7I6+lkppzVZwdktNeXZb1QlPlwYDk3a++3qfEpvFWLTW5tZTYnFC2GZsvjzl/twhNlXuKJK/FDrmmS/aITUWWmtVrNuu/KLFcAGaWxQKP8eKmlu9E3Uc6IzZsUEhpjpnMkGk0oGbUlh2Yndhm9O9z' +
              'I+8lOkoKQEjcjTkCzyJR3FJjZmvOFFgnC8ctS6kB3T4dFnUfCAz/d4tNRZEaXJd73p3SVu/OlNTg/zf2R3bQ/X/IHe45a5KdsRpQasqIii40EAkIRN6NSmrODOhh0ae9sizrhQaxRyslNaqxz22gpKYGokD2rD6pzDI2j7TosduEZo87dkjeLdulWceirBCbiiw1b73/o76eRBerdBfOPvfat8476WFPHV9S91FJ2BPpmcBcK3bNDwpc8ToEZfbcFc6riWHWh7IDhdOJgsbV3jdTKz8bTEGq1yrjJZGK1IBO78VmINyTEVYUqYFwm2Mi0FVZGpmQmumzlup9E536AJkZe6TZWZe/4LyTOJSaMiBRocEMv5kQGjScqQgNGsy9n1ZScFl4npfc03bIaS8vzX6hua9IN/q5tyixqVMguScUSI6KvGpKbP6WWbH54cC68u8em3er0OTdtF32vH6bNHtlR4UXm4osNWYEUaKLQiLrYI/YQNFsSbUVyYDzm2O+8tYPzquJgYbZ/Rc5Al0AADO5mteuvqWTfi0ZcI/2cRHJLqJpixG6RDIJxBLHvfmed51XSidVqQEYNWbuxYQ9kqyiSE2v78K1YiYS+bnKhNRgAU3s684WxsO9uviCRd7LhJQEpSbDFHoM2y5voUGDmYjQ7PNMSDeauUoScs8OD4fG6KGGLy7RQoPJ+xIRGpzTLTRHq8baLTSmwbaFBo23W2hwXW6h+YuSGbfQ7NU2Vmj2vDcsNFXuLpK97tqhG/vcE5XYVFdRbbPkHTsho2Lz0mXPVgihybtGxdXb5KoXK7bYlIfUYJ4ZZCPizcTrZsYfyf1FaXjqhd5R9+K1onayYJSNOR4W1UwWr5l/j6jVSnbsCOjuHvPauIl/OnskzslnPxV1XMSAnyc77yaGPVkguvvWb0i8+6o0IGo4rpG4REhHasCTz/eK3I8Jc/6KIjXIXJlj4pmjeLc00pUa/P8zxb/JdM26M6CYDTkZKDUZ5uNloZSEBnPG7A6hgTCg4dy7' +
              'VUBPXmdGDp363OKsF5q97ww3/rlXqntSQpNznIpjldhU/V26ZkBsvjmssVzQfWOFEZqcy7dKzqVb5aoO2yus2JS11GBtHmRPSpsd181jHZL/ixKg+8a+l1RHbNjYCxDi38mCFP7fjo3tJsJfzZj8DP9GoXAqoCDafVzMSpwM7kbn4y+GO++kB+4bEoBjljbxoE26UgMJbvPEp1H3hEB9SEWQGqxjZddCtW0XvfRHSaQrNT8Pm6b3S/ZnzZ0BrXpSm6QyoJSaDLIpsFMempEZocFIpEwIjS0TJQmNEYXc25UA1AuPGkKBbUMlNlkvNM13SJXbtkvOv7doocn910YdeUf/Ll0OTE9smj8+tMIJTe6F6j7P2yJXPa3EJljxxKYspQaNC/5SRxdJaZOi2eAvyiNrtdbXkkqxL9bRMfeS6ogNG2RnzPGQtUmFDq+Gu2FKip+GTnO2TI5rbnsr5lioLUkGkxUzgeeXiW67zt1+0sdrmMC6RjbpSg3Az569CCkCImGWltidUgPRNsfDkOpEfz7TlRp0AWK/VIp93dkvZG8SJVNSg98F6f5fTpQKKzXjNxZnrdAYSdiz2XYtNLk1VZxYIA2eXZz9QnOripvVfZ1ZoIUm559KbI7eKHscqcTmgNTE5tXzHwt/Ji6hwXNyCw3qm8pTaHLPUV/PLJSrntxW4cQG83zYv3AQmZIaZGdwvGQzB78Mn6H3SzV7Yc5rIpVf4jamLgSBkUqpgIyVaazdgeedTBebjVm/x45nXu7jvJs47jlTUKSdDvMXro7U6mAEVDJkQmoA5BhD1O37MhmS3SU1/X+aHDnWXofdKsNGxh/GbZOO1BQUbNP3jMC/k8WdAcVcQImSCanBPqixQ5dteVBhpWbchuIoobl7XGaEBsW6mRAaSEM8odnnviLZF3JwgVOHcny4DqVB+8XZLzT/3SZ73KgEoGG+FprcI1UcsVHyjkhebL4+oqmc031zykKD5+MWGiObttCYgudUhCanqYpGBXLVwxVLbMzkdnac' +
              'dGb6UoNRP2hAsKxAMrU0wPxFmeoEeqgJsWeaPfOy5513UsPOhkyautB5NXlMl5o7MEIoVVo91iPmeM1bf+C8mziQEDR45hjoFktWRg3z5q+Smo0f08fBaKpkhc1ITWlrXyUCupuuuqVj5L5M7A6pwSi6g6uHVxlHHU2ysoefPXMdiGSkBmKPfdLpjrUzoPseeXvCq6OnKzX4/YE/cDLVLZoIFVZq/sgvziqhsUcOGaHZs6VqSO9UEnBaoRaaXHTZHLNZ6iuxyXqhUTKQe+1WqVJb3ZMSmtzDN0rOYesl79Cx0uWviYvNzU+O3C1Cg3twC03uxR5C07hAC03OKQVSpUG+XPXg1gojNv/r9H3ULxwERuukmjnAfvYIlGR/cWNuDPzCRKODJRJS5fo7OkfdE+oYUuW4Bm0jx8FEb6mCYtC9D78t6rqwpk4yk+XZ4FmfdkH7qOMh6p7xhLNFcmBpB/ciixj5kkgRK0CXFbp3zBBgNIKJNnwG3JN5RpmqvcBf9xddt0tMEMlIDRYJNfulKjUQkn+ccK8+xl+rttAZ0mSxR+EhXurYz3knPnimjS4MLyNS2gR/8fjgk6FR5+/+2TDnnfigZsjeL5nPFdf+wJOf6SHvqf4/SYUKKzV4IE9O8xaaG4dlRmjQaJal0JhGNPcmJQC187XQ5DhdNic/szirhabKddtkr2bqvq5QIlB9kxaa3ENV/EOJzSFjpGsCYtPh8hezSmhy6qlQEnd92+R+2ZcFaITcs5qawHwsm/O36m3w/yhe4JcN1irq8/24qL+K8YsU7yeD6btPN7vinh8GGY1UcHfPQRjSySC4MyupjKYyeGXZEMiyQA5TATVDmPXYPh6yClinCF1S6ALB8gxYwwqTEs6as0xPfHfDnZ0jWQgElpNIZP0qNxOn7MpGpJPBcoPPDHOsmGMnKjX4+Tf1XWa/ZH6mUUuGeiqTOcRzTKZo2gbLKJjrQCQ6UeIQpzsXn2M6XXpz/1wZdf46TR9PSDTcXYD4mUkEHBuTUWIf' +
              'CHd5UmGlBvy+rjghoTGLSKYrNJCKTAgN5MA0opACNKRVVAOaU82pQTkq3F1T/+nF2S00V6nXrlSvXaxEoOoGLTQ5h6yV3IPWSt5BY6TL/iWLzYsXPZOVQpNTU8WJm6Rrz/TT66mAX8rTZi6RW+99L+qXTaYjmXoBMHDwlMjKyxh6mupf6rg/d1cPusK+6DM6oQYJ26CroEv3n2MaeAQKn9HAYJK7ZAtqUexosiH4yz3ZbBS61tBImS66kgJ1OsgOJJspAcjMoJvCHqGTaKDwFd2GyTT8AI0/sgj2ytWYpBCF7KkKmhvUkpjMVqJS467PQpQ2TQDufcr0xXpBSJPlg6RDQpP9eTHgDwx0C9vXgYxYaXMSQUDtTCPq1VLFjJ6yAyvPx/sZXrp8vf4c7X1qN3lcizCWEfEKdDOhjg3ShO2x0GuyP0/pUqGlBvy4ojjrhQa1GzkQAjT+qEFxumuQ2WjQbnF2C42SgiqXqThficAR67TQ5PxdiY2KvL//psSmse+EBpmpGhfmOz+hZc+osXP0L3J07bi7GMoikLJPBEzkhfWU8AvM3YiaDAHeb/lQ/FmFWz/2iZY0bIu5bezj2IFiQ2xT0orfyDThvF77egWuedGStc7eiWFGv7zc6XvnldJB1gOFpe7zJxL4zBNdXdwGmRiMpEKGw87C2IFrwmeHe0KDmUqjjRqgo2rfL4eeeG+JgQUWS1vFOhHwHCF88aTmvkd76CxIjUaPet4zsi4Y0YVt8DMHwUSmCj+r+NnD84aUI1sFscHoslTpO2CC/r9kZN8d+PnD/SAbYv8c3vVgdz3/kLu7EwE5wvXi2lFLVRLIdqL7EcdGRrckycVnh+5eM4IP3c/Y74qb3tTddV77JBNYzqG8qfBSAwYtLU5YaKLWDUpDaCARmRCavf/rCI3TmFY5ozAiNMhs5B68VuopsYHQ6MY6g0KT4yE0Oa1jhQbX7BYaXLtbaPKu2R4jNCiszbtEfb1oi+Q1VSKATM3flNj8bbXkHLha8g5UYrPf' +
              'LrHxg9DkHKfiXxtl9MTEhzqnA/5ix+Ru5RWr12x2zhwfDNH02t8d4yfNd/bwBt0WXvuVFCV1ISH74rV9vEg2pY9sC/azl0ooDaTi3edNJtJpWA24bsyAjM8C3VAoCC7POodMAbGJ9/M0YfICz2dYWmA/POdEf/YTAdlKr3N5hf3zlOg9xBsijc/Xa5+SwtRezZy9zPP9VAKfU3lnaUBWSA3ov6Q464UGjWmVK5QU1NscERpkNpDVOOnJJVktNHtc4MhBQyUBfw8LTc4BKvZfKXn7j9Ri4yehyam6UXp9n3ofNyGEkMyTNVIDflhYnJTQNMiQ0GCdpEwJje6qQTdUtQ0RoQlnNRbLzT3zs1toIAdnKzmoqxp+R2hy91spOSpOr/26/Ed9Xn4RmpyjKDWEEFLRyCqpAX0XFKcsNGa0UbpCg0ncUhUaiAAa1NxzCyX3iPVhoTlgibR7ZaS+v/t/zHKhgSBgXpfj10eE5l81vtBpyPXbdso138YKDYa3Z5vQ5By5UYaOKp/JpAghhCRG1kkN+O7P4qwWmirnOw1qE9V4HrwsIjSGBwdludAoScg9TUlC1XVy8LEDo2aSXLd1p1ylPrN4QlP1jVih2ffFWKHBZ+IWmpzbw/dS1kJzTMNNu6W/mBBCSMlkpdSAb+YWpyU09l//6QiNLQVJCY2SgL3PK5RvhnrPB9FmYJYLzakFcvrthbJxU+y03hCbK78qH6HJca49SmjOcq7XFpqTExeanMM2yCtvJz9dOSGEkLIla6UGfD2nOKuFpv9v8UfPPDAge4Wm7g2Fsqmg5EwGxObSzyuu0ORUixWa3MM3aKE59+p8qYgLXBJCSGUnq6UGfDWrOG2hyVPikAmhwRwumRIawwP9w9eWTUJT5/pCWbux9Dkv1m7ZKRcqIc0moWl6Wb5sUddNCCGk4pH1UgN6zijWQmPqNNIVGkhCJoTGNKipCo3hwR+KfSc0BojNuR9TaAghhKSPL6QGfDat2JdCY2j9fbEWGlyjW2jQ0LuFRi+m' +
              '6RKaPZUAuIUm94ZYocE9uIUG9+EWmipN0hMawxolCk27U2gIIYSkh2+kBvSYWhwRGnRpZEJobDlIR2j2OTd1oTE80DfkO6ExrCncKQ3fp9CQikswGJSVK1emvAYQIaTs8ZXUgI8mFftSaAytvgv5TmgMq5XYnPgOhYZUHDZv3ixz586VUaNGSb9+/WTAgAHOO7uHUCikr2nTpk3q53KL/p4QsgvfSQ3oNnFnlNDgr/9MCM1eSgh2p9AY2nyjrt1nQmPQYtOJQkN2P8uWLZPvvvsuKkaOjJ5TqrxYu3atjBs3Tr7//vuo68H348ePl1mzZun3Cans+FJqwHvjd5YoNCi6zYTQGBkoT6ExtP465DuhMawuUGLziiU0zn1RaEh5smPHDi0TU6dOjUjEtGnh1YzLC0zwOGPGjMj5IS7Lly+X9evXy+LFi+XXX3+NvPfjjz86exFSefGt1IC3x+3crUIzYHTZCI3h/t7qHnwmNIbV+UpsnitBaK6NFZocMzLLFhp1nRQaki4LFiyIiMOiRYucV8uH2bNnR86N63AD6Zk0aZJ+/5dffnFeJaTy4mupAW+N3RlXaJANyITQ7GFJQHkIjeH+L4O+ExoDxKbm00UZE5rcGh5C808KDYnP5MmTI2KxYcMG59Wyp6CgQPr27avPO3ToUOfVWFBXgyzNsGHDnFcIqbz4XmpAp9/C87z4TWgMrb9Q9+EzoTGs3qzE5jF1b+UgNGdQaIgHw4cPj0gNRkCVFyhQNuf9/fffnVe9+eOPP+S3335zviOk8lIppAa8Naq4VKHJUWKQbUJjuL9nwHdCY4DY1HlA3ReFhpQz6N754YcftFj8/PPPzqvlw5QpUyJS079//3IVKkKylUojNeCt4cVJCQ2EIBuExtD6s4AWmrybYoUGo7TcQqPFwCU0RhCihEZJwu4SGsPqTTulRislaxQaUo5g2LQRi7Fjxzqvlg+o3zHnRiATwyHchMSnUkkNeGtYyJdCY2jdI+A7oTGs3qjE5m51DxQakmEw' +
              '0mnevHm6LmXgwIEyaNAgPbII3T5GKtDFUxLYH++jWBf7o8YFQ63TqcHBMd1DuDFfDl5PFtTnoDYI2SbMtYOvGMm1detWZwtvMPrL3m/w4MF6NBZkz4uioiJZvXq1LnAeM2aMvl4Dsl6YYwdD5fH+hAkT9PPGcHQ3uEdI3ejRo/WzhMytWbNGf4/rWbdunT6ezbZt2+TPP//U3YX4DBD4DBcuXBg3y4XjYBsM1zefHQQS90Gyj0onNeDtIaGkhcaIQEUWGkOrj9R9+UxoDFpsmqt7oNCQDIAGbebMmXpiPQSGTKOxhdTYMoHAUGov0EBjXwgNRigh0DhiH0gJGvJUWbVqVaRY2ASOjdcTATJgxAxCAFGAfOF68RokJRAIOFvvAnICKcE2Q4YM0Y0+7gv3iNcgOMhcofFHETO+nz9/vn7PDoidAWLlfh9hjyjDtUCE7HuGULmzVgjIDTCfoXkd14XvISnmNXTfQdDc4D7Ndrjf6dOn63vB9/g3yT4qpdSAjr+EfCk0htbdA74TGsPqDcVS4xZ1/RQakgZo8CExaMDw1c6A2I26CTTKbpBlwHtoSO1sADI0Zr94I5cSYcmSJZFj2YGam3jdUXgP0oFtITJ2ZgNZKXMczMNjA7GASOA9DBe398NzgSCYfe3ALMcQB1sm5syZ4+wZBsdGlgUyZbaxs1nIttj7IyCYkBwIlZExyCKyTPjMzPbYzi2QmMvHHAe1UYWFhc47YczINvsZIEOD1yByJPuotFIDOv4UTEloIAEVWWgMrT4o8p3QGLTYXK/ug0JDUsRICzIDXus5oQE33T9oTO3GHZj5a9CYesmFEQNEad08pYE1p0wGwQ7cQ0lrUSFLYrZxs3379sgx3JP2mQJlnM8ri2NLBzIi2B5SaK7DzpqUlFEqbUSZW+SMHEFi0MWE9wGyT3jfS1gMdhcisnAGfL7m9aVLlzqvhmUQr0G+SPZRqaUGvDUo6EuhMbR6r8h3QmNYvb5YajYrlNw6SmQoNCQJIAmmQcvPz3de' +
              'jQaNdEnzxKAhNl1MEB782x12F4o7Y5EKEBGTebFj4sSJzha7QNbEvI8G3+v67GOYBtyWHYiKF7YkeImEneEqSebMiLKffvrJeSUaPC9zDK/7A/YyFugCLAlbkGyB27hxY9TryBIByCvuiwuXZieVXmpAxwFBXwqNodU7Smx8JjQGiE2Ny9X1W0KTe0ys0OQeSqEhYdBYmSwKJKEk0JVhGj13w2rPIYMuGnRjxAuveo5UQINrN/gmTObCYMQC2Rav63GHadCRWTHHLKmmBDU2eB9ZLK+GH6KC99FN5QVEx5yjpBFltjh5dfvhOdhi5pVRMkBazXYIiBvAPqY7CwGxYXYm+6HUOHT8IehLoTHc32WH74TGsHpdsZx0ZX5coTmvGYWGhDE1E4h4GRT7L3zUoNhg1A5eR23I7sCWKoTdxYQskskSQbiSwc5gQSzc2KKHbiY3EAXz/ogRI5xXo7HP4TXyCZiCZK9uP2Bnokr7DPA8zLYIdDsZ7JobEyh4JtkLpcaic/+g57BtSMB+FxTKwDHZKTSGF3sWyb7qPryE5uLWW2RjfvY2+oVKWJ7vvF2ObqykxhKaE5tskk7vb1e/2Cg0JAyKZk0Dhi6MkrAXksRwYgMaWfMXPmo6dhfIcpjrQ9bCYHerJNvthXszWSwc086AQA4gKngP0uFVR4SFNs25UWvjhZ1p8hpRFq/bz2DLCGp84oGuJLOt/ZwMkCx38fOKFSucd0m2QalxMWpmSK57brvso6QGQrPfRYVy96vbZdZCf0x6tbFgp3TqVSQ3PbtNbmq/TR7quF1mzvfPhF7FxTtl6qygTJoWlJmzs1tCSdmAYlHTeHktEmkwRagI02UB7AJTdMVkGtSHoEuoNOxMkr3uk50JKUks4oH9TYE0jovh1MhemOwJnktJ3T0YMWTOXdKzNQXMCK+upXjdfgYUC5ttIGHxsGtv7EJhG3SJmW4zBO6VZCeUmhIIhXZKUWCnbiQJIf4Bw3dN4xVPHsxcNahLcWP/ZR+vngMNtFf3' +
              'STzQkKOBLW0/e1g2skoGu4aktOHk6MaxQZYEI4GwH8QGXTu4f1wPnhVqg+Jdl/1sS6pPKa1rCec3x3B3+xnsjBDCawSVwYy0wvlM4TI+M2S0bJDRMQXMCBYKZyeUGkJIpcJuNCEuXlJiN5pe3Rv2KCSvbAIaa2RS0JAmO6uwKZK1u7zc4JpR2Irt3PeAc9uNsz25nQFdR2aiOSMEaNRNETDuyc5OJYo93BsZHxtcF7I3pXUt4brMMUqa1RfCYboAvc5lKGmEFI6L/d2YLJJ7mDvJHig1hJBKBUb62A0i5qlBNwgadzSO9pBkBKQB3Rb4i99gd7MgUGuCBhSZDEgE5ACNN2o/ksWcH+f16p6xJ6jDObzmgrG72BBorLEdrg9FxqgtgdDY2Qq7hgj7Q0DQ+GMfSB62RRbIq5bGgGdpjoEsD2pTkA1CdxG6iYzQIPA88XzsZwSRsruBvIaMG+xiaUiIW8JwbnM+ZJnszIvpurOzSbgvk0VisXD2QqkhhFQ6zMR5XoH1gpCpsF9DVsEeNo2sg12o6w4co6T5b0rDFgPIFwTDLFMAObHneCkpC4RJ6uzJ/9yB49gzKAOvpQhKCgiLV5G111IJCMgF6nvc7+NeIDwQDlyTyT6ZwHPH/SPc0oLPwEwUiECXIMQMxzPPEOfF925MTQ7Oh8wdZBbnwmvIlOHYJDuh1BBCKiX4Sx7ygYYM9SNoVE3NCP6yR6YEjWS8yfkgG2jgTQOKbinITzqNIkZnIQuBUULIANnZDQSyNJCDeLU8ANKCIdPIyGA/CATuMV63FrpozPaJBDI4NrhvXDueHd6HeOGYRkjwPJENwVc8a5M9wfu4tnhhZ1psULeEz8vUOeF54Ryox3GLmwHPBdJnRnMh8LPg1VVHsgtKDSGkUuMlIGhAkxGTdCSmNHBsNPpYGbs0kSmJRK8PggAhQGOP7ipkY9A9hCwRshsQLrtuJt6ij17njFfQmwlS+RywTyr7kYoJpYYQQojODCHL4a4/cQMBMN1EyLgQUpGg' +
              '1BBCSCXHrDaOLpnSshaYp8cUWruHRROyu6HUEEJIJQZZGSMpqIGJl6XBe6YIN9nZigkpDyg1hBBSicFQZnuIO0Z+edXuYPizGaqOzA7rUEhFhFJDCCGVHHsmYIQZDYZCYCyKaeaOwbBn9yzEhFQkKDWEEFLJQdYFi0tiZJOdtcEwcLyG4dGpzrtDSHlCqSGEEBJFvLoaQioylBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQX0CpIYQQQogvoNQQQgghxBdQagghhBDiCyg1hBBCCPEFlBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQX0CpIYQQQogvoNQQQgghxBdQagghhBDiCyg1hBBCCPEFlBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQX0CpIYQQQogvoNQQQgghxBdQagghhBDiCyg1hBBCCPEFlBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQX0CpIYQQQogvoNQQQgghxBdQagghhBDiCyg1hBBCCPEFlBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQX0CpIYQQQogvoNQQQgghxBdQagghhBDiCyg1hBBCCPEFlBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQX0CpIYQQQogvoNQQQgghxBdQagghhBDiCyg1hBBCCPEFlBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQX0CpIYQQQogvoNQQQgghxBdQagghhBDiCyg1hBBCCPEFlBpCCCGE+AJKDSGEEEJ8AaWGEEIIIb6AUkMIIYQQHyDy//O30PvAjFjdAAAAAElFTkSuQmCC',
              alignment: 'right'
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
          alignment: 'center',
          style: 'title',
          text: [
            {text: '\nFINIQUITO # ', bold: true}, {text: this.popup_form.get('cfiniquito').value, bold: true}
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
          columns: [
            {
              width: 100,
              style: 'data',
              alignment: 'left',
              text: [
                {text: 'Notificación: ', bold: true}, {text: `${this.popup_form.get('cnotificacion').value}`}
              ]
            },
            {
              style: 'data',
              alignment: 'right',
              text: [
                {text: 'Placa: ', bold: true}, {text: `${this.popup_form.get('xplaca').value}`}
              ]
            }
          ]
        },
        {
          columns: [
            {
              style: 'data',
              alignment: 'left',
              text: [
                {text: 'Asegurado: ', bold: true}, {text: `${this.popup_form.get('xnombres').value}`}
              ]
            },            
            {
              style: 'data',
              alignment: 'right',
              text: [
                {text: 'Color: ', bold: true}, {text: `${this.popup_form.get('xcolor').value}`}
              ]
            }
          ]
        },
        {
          columns: [
            {
              style: 'data',
              alignment: 'left',
              text: [
                {text: 'Contrato: ', bold: true}, {text: `${this.popup_form.get('ccontratoflota').value}`}
              ]
            },            
            {
              style: 'data',
              alignment: 'right',
              text: [
                {text: 'Serial Carr.: ', bold: true}, {text: `${this.popup_form.get('xserialcarroceria').value}`}
              ]
            }
          ]
        },
        {
          columns: [
            {
              style: 'data',
              alignment: 'left',
              text: [
                {text: 'Vehículo: ', bold: true}, {text: `${this.popup_form.get('xmarca').value}`}
              ]
            }
          ]
        },
        {
          columns: [
            {
              style: 'data',
              alignment: 'left',
              text: [
                {text: 'Modelo: ', bold: true}, {text: `${this.popup_form.get('xmodelo').value}`}
              ]
            }
          ]
        },
        {
          columns: [
            {
              style: 'data',
              alignment: 'left',
              text: [
                {text: 'Año: ', bold: true}, {text: `${this.popup_form.get('fano').value}`}
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
              fontSize: 12,
              style: 'data',
              alignment: 'justify',
              text: [
                {text: 'Yo, '}, {text: `${this.popup_form.get('xnombres').value} `, bold: true}, {text: 'portador de la cedula de identidad No. '}, {text: `${this.popup_form.get('xdocidentidad').value}`, bold: true}, {text: '  '}, {text: 'he recibido de La Mundial de Seguros la cantidad de '}, {text: `${this.popup_form.get('mmontofiniquito').value} `, bold: true}, {text: `${this.popup_form.get('xmoneda').value} `, bold: true},
                {text: 'concepto de Finiquito del '}, {text: `${this.popup_form.get('xdanos').value} `, bold: true}, {text: 'definitiva, del vehículo descrito en este documento amparado bajo el certificado de afiliación #'}, {text: `${this.popup_form.get('ccontratoflota').value} `, bold: true}, {text: 'a consecuencia del siniestro #'}, {text: `${this.popup_form.get('cnotificacion').value} `,  bold: true}, {text: 'ocurrido el día '},
                {text: `${this.popup_form.get('fcreacionnotificacion').value}. `, bold: true}
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
              fontSize: 12,
              style: 'data',
              alignment: 'justify',
              text: [
                {text: 'En virtud de este pago declaro: que no tengo nada más que reclamar a Mundial Autos por el referido concepto quedando la misma libre de responsabilidad con respecto a todas las consecuencias del mencionado siniestro. Firmo el presente en la ciudad de ___________ a los _____ días del mes de _______________ de _________'}
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
              fontSize: 12,
              style: 'data',
              alignment: 'center',
              text: [
                {text: '___________________________________________'}
              ]
            }
          ]
        },
        {
          columns: [
            {
              fontSize: 10,
              alignment: 'center',
              text: [
                {text: 'Firma del Beneficiario'}
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
              fontSize: 10,
              alignment: 'right',
              text: [
                {text: '                                Huellas Dactilares'}
              ]
            },
            {
              fontSize: 10,
              alignment: 'right',
              text: [
                {text: '_____________       '}, {text: '_____________'}
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
              fontSize: 10,
              alignment: 'center',
              text: [
                {text: 'Dirección: Av. Francisco de Miranda, Edif. Cavendes, Piso 11 OF 1101 Urb. Los Palos Grandes, 1060 Chacao, Caracas. Teléfonos: 0212 283-9619/ 0424 206-1351 '}
              ]
            }
          ]
        },
      ],
      styles: {
        data: {
          fontSize: 11
        },
        header: {
          fontSize: 7.5,
          color: 'gray'
        },
      }
    }
    pdfMake.createPdf(pdfDefinition).open();
  }
}
