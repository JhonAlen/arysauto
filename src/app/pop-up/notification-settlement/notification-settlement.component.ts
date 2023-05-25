import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
import { color } from 'html2canvas/dist/types/css/types/color';
// import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-notification-settlement',
  templateUrl: './notification-settlement.component.html',
  styleUrls: ['./notification-settlement.component.css']
})
export class NotificationSettlementComponent implements OnInit {

  private replacementGridApi;
  @Input() public notificacion;
  sub;
  currentUser;
  popup_form: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  loading_cancel: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  replacementList: any[] = [];
  replacementList2: any[] = [];
  replacementList3: any[] = [];
  replacementList4: any[] = [];
  replacementList5: any[] = [];
  replacementList6: any[] = [];
  replacementList7: any[] = [];
  replacementList8: any[] = [];
  canCreate: boolean = false;
  canDetail: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;
  corden: number;
  variablex: number;
  showSaveButton: boolean = false;
  showEditButton: boolean = false;
  notificationList: any[] = [];
  coinList: any[] = []
  code;
  danos;
  alert = { show : false, type : "", message : "" }
  repuesto2: boolean = false;
  repuesto3: boolean = false;
  repuesto4: boolean = false;
  repuesto5: boolean = false;
  repuesto6: boolean = false;
  repuesto7: boolean = false;
  repuesto8: boolean = false;
  activarCheck: boolean = false;
  activarCheck2: boolean = false;
  activarCheck3: boolean = false;
  activarCheck4: boolean = false;
  activarCheck5: boolean = false;
  activarCheck6: boolean = false;
  activarCheck7: boolean = false;
  activarCheck8: boolean = false;
  causaList: any [] = []

  constructor(public activeModal: NgbActiveModal,
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private formBuilder: UntypedFormBuilder,
              private router: Router) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      cnotificacion: [''],
      corden: [''],
      cservicio: [''],
      ccontratoflota: [''],
      xnombre: [''],
      xapellido: [''],
      xnombrealternativo: [''],
      xapellidoalternativo: [''],
      xobservacion: [''],
      fcreacion: [''],
      xdanos: [''],
      xnombrepropietario: [''],
      xapellidopropietario: [''],
      xdocidentidad: [''],
      xtelefonocelular: [''],
      xplaca:[''],
      xcolor: [''],
      xmodelo: [''],
      xmarca: [''],
      bactivo: [true],
      xactivo: [''],
      mmontofiniquito: [''],
      ccausafiniquito: [''],
      xcausafiniquito: [''],
      crepuesto: [''],
      xrepuesto: [''],
      xrepuesto2: [''],
      xrepuesto3: [''],
      xrepuesto4: [''],
      xrepuesto5: [''],
      xrepuesto6: [''],
      xrepuesto7: [''],
      xrepuesto8: [''],
      xcausa: [''],
      repuestos: [''],
      xdescripcion: [''],
      xnombres: [''],
      xauto: [''],
      xnombrespropietario: [''],
      xnombresalternativos: [''],
      cmoneda: [''],
      botro: [false],
      botro2: [false],
      botro3: [false],
      botro4: [false],
      botro5: [false],
      botro6: [false],
      botro7: [false],
      botro8: [false],
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 95
      }
      this.http.post(`${environment.apiUrl}/api/security/verify-module-permission`, params, options).subscribe((response : any) => {
        if(response.data.status){
          this.canCreate = response.data.bcrear;
          this.canDetail = response.data.bdetalle;
          this.canEdit = response.data.beditar;
          this.canDelete = response.data.beliminar;
          this.initializeDetailModule();
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 401){
        }else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
    }
  }

  initializeDetailModule(){
    if(this.notificacion.createSettlement){
      this.canSave = true;
      this.createSettlement();
      this.repuestos();
      this.searchCoin();
      this.getCauseSettlement();
    }
  }

  createSettlement(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cnotificacion: this.notificacion.cnotificacion
    };
    this.http.post(`${environment.apiUrl}/api/service-order/notification-order`, params, options).subscribe((response : any) => {
      if(this.notificacion.cnotificacion){
          if (this.notificacion.cnotificacion == response.data.list[0].cnotificacion){
            this.popup_form.get('cnotificacion').setValue(response.data.list[0].cnotificacion);
            this.popup_form.get('cnotificacion').disable();
            this.popup_form.get('ccontratoflota').setValue(response.data.list[0].ccontratoflota);
            this.popup_form.get('ccontratoflota').disable();
            this.popup_form.get('xnombre').setValue(response.data.list[0].xnombre);
            this.popup_form.get('xnombre').disable();
            this.popup_form.get('xapellido').setValue(response.data.list[0].xapellido);
            this.popup_form.get('xapellido').disable();
            this.popup_form.get('xnombrealternativo').setValue(response.data.list[0].xnombrealternativo);
            this.popup_form.get('xnombrealternativo').disable();
            this.popup_form.get('xapellidoalternativo').setValue(response.data.list[0].xapellidoalternativo);
            this.popup_form.get('xapellidoalternativo').disable();
            this.popup_form.get('xdescripcion').setValue(response.data.list[0].xdescripcion);
            this.popup_form.get('xdescripcion').disable();
            this.popup_form.get('xnombrepropietario').setValue(response.data.list[0].xnombrepropietario);
            this.popup_form.get('xnombrepropietario').disable();
            this.popup_form.get('xapellidopropietario').setValue(response.data.list[0].xapellidopropietario);
            this.popup_form.get('xapellidopropietario').disable();
            this.popup_form.get('xdocidentidad').setValue(response.data.list[0].xdocidentidad);
            this.popup_form.get('xdocidentidad').disable();
            this.popup_form.get('xtelefonocelular').setValue(response.data.list[0].xtelefonocelular);
            this.popup_form.get('xtelefonocelular').disable();
            this.popup_form.get('xplaca').setValue(response.data.list[0].xplaca);
            this.popup_form.get('xplaca').disable();
            this.popup_form.get('xcolor').setValue(response.data.list[0].xcolor);
            this.popup_form.get('xcolor').disable();
            this.popup_form.get('xmodelo').setValue(response.data.list[0].xmodelo);
            this.popup_form.get('xmodelo').disable();
            this.popup_form.get('xmarca').setValue(response.data.list[0].xmarca);
            this.popup_form.get('xmarca').disable();
            this.popup_form.get('bactivo').setValue(response.data.list[0].bactivo);
            this.popup_form.get('bactivo').disable();
            this.popup_form.get('xactivo').disable();
            this.popup_form.get('xauto').setValue(response.data.list[0].xauto);
            this.popup_form.get('xauto').disable(); 
            this.popup_form.get('xnombres').setValue(response.data.list[0].xnombres);
            this.popup_form.get('xnombres').disable(); 
            this.popup_form.get('xnombrespropietario').setValue(response.data.list[0].xnombrespropietario);
            this.popup_form.get('xnombrespropietario').disable(); 
            this.popup_form.get('xnombresalternativos').setValue(response.data.list[0].xnombresalternativos);
            this.popup_form.get('xnombresalternativos').disable(); 
          }
          this.notificationList.push({ id: response.data.list[0].cnotificacion, ccontratoflota: response.data.list[0].ccontratoflota, nombre: response.data.list[0].xnombre, apellido: response.data.list[0].xapellido, nombrealternativo: response.data.list[0].xnombrealternativo, apellidoalternativo: response.data.list[0].xapellidoalternativo, xmarca: response.data.list[0].xmarca, xdescripcion: response.data.list[0].xdescripcion, xnombrepropietario: response.data.list[0].xnombrepropietario, xapellidopropietario: response.data.list[0].xapellidopropietario, xdocidentidad: response.data.list[0].xdocidentidad, xtelefonocelular: response.data.list[0].xtelefonocelular, xplaca: response.data.list[0].xplaca, xcolor: response.data.list[0].xcolor, xmodelo: response.data.list[0].xmodelo, xcliente: response.data.list[0].xcliente, fano: response.data.list[0].fano, fecha: response.data.list[0].fcreacion });
      }

    if(this.notificacion.createSettlement){
      if(!this.canDetail){
        this.router.navigate([`/permission-error`]);
        return;
      }
      if(this.canEdit){ this.showEditButton = true; }
    }else{
      if(!this.canCreate){
        this.router.navigate([`/permission-error`]);
        return;
      }
      this.notificacion.createSettlement = true;
    }
  },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.NOTIFICATIONNOTFOUND"; }
      //else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }

  repuestos(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cnotificacion: this.notificacion.cnotificacion
    };
    this.http.post(`${environment.apiUrl}/api/valrep/settlement/replacement`, params, options).subscribe((response : any) => {
      if(response.data.list){
        for(let i = 0; i < response.data.list.length; i++){
          this.replacementList.push({ id: response.data.list[i].crepuesto, value: response.data.list[i].xrepuesto});
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

  searchCoin(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cpais: this.currentUser.data.cpais
    };
    this.http.post(`${environment.apiUrl}/api/valrep/coin`, params, options).subscribe((response : any) => {
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.coinList.push({ id: response.data.list[i].cmoneda, value: response.data.list[i].xmoneda });
        }
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.COINNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }

  activateCheck(){
    this.activarCheck = true;
    this.popup_form.get('botro').enable();
  }

  activateCheck2(){
    this.activarCheck2 = true;
    this.popup_form.get('botro2').enable();
  }

  activateCheck3(){
    this.activarCheck3 = true;
    this.popup_form.get('botro3').enable();
  }

  activateCheck4(){
    this.activarCheck4 = true;
    this.popup_form.get('botro4').enable();
  }

  activateCheck5(){
    this.activarCheck5 = true;
    this.popup_form.get('botro5').enable();
  }

  activateCheck6(){
    this.activarCheck6 = true;
    this.popup_form.get('botro6').enable();
  }

  activateCheck7(){
    this.activarCheck7 = true;
    this.popup_form.get('botro7').enable();
  }

  activateCheck8(){
    this.activarCheck8 = true;
    this.popup_form.get('botro8').enable();
  }

  activateReplacement(form){
    if(form.botro == true){
      this.activarCheck = false;
      this.repuesto2 = true;
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cnotificacion: this.notificacion.cnotificacion
      };
      this.http.post(`${environment.apiUrl}/api/valrep/settlement/replacement`, params, options).subscribe((response : any) => {
        this.replacementList2 = [];
        if(response.data.list){
          for(let i = 0; i < response.data.list.length; i++){
            this.replacementList2.push({ id2: response.data.list[i].crepuesto, value2: response.data.list[i].xrepuesto});
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
  }

  activateReplacement2(form){
    if(form.botro2 == true){
      this.activarCheck2 = false;
      this.repuesto3 = true;
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cnotificacion: this.notificacion.cnotificacion
      };
      this.http.post(`${environment.apiUrl}/api/valrep/settlement/replacement`, params, options).subscribe((response : any) => {
        this.replacementList3 = [];
        if(response.data.list){
          for(let i = 0; i < response.data.list.length; i++){
            this.replacementList3.push({ id3: response.data.list[i].crepuesto, value3: response.data.list[i].xrepuesto});
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
  }

  activateReplacement3(form){
    if(form.botro3 == true){
      this.activarCheck3 = false;
      this.repuesto4 = true;
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cnotificacion: this.notificacion.cnotificacion
      };
      this.http.post(`${environment.apiUrl}/api/valrep/settlement/replacement`, params, options).subscribe((response : any) => {
        this.replacementList4 = [];
        if(response.data.list){
          for(let i = 0; i < response.data.list.length; i++){
            this.replacementList4.push({ id4: response.data.list[i].crepuesto, value4: response.data.list[i].xrepuesto});
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
  }

  activateReplacement4(form){
    if(form.botro4 == true){
      this.activarCheck4 = false;
      this.repuesto5 = true;
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cnotificacion: this.notificacion.cnotificacion
      };
      this.http.post(`${environment.apiUrl}/api/valrep/settlement/replacement`, params, options).subscribe((response : any) => {
        this.replacementList5 = [];
        if(response.data.list){
          for(let i = 0; i < response.data.list.length; i++){
            this.replacementList5.push({ id5: response.data.list[i].crepuesto, value5: response.data.list[i].xrepuesto});
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
  }

  activateReplacement5(form){
    if(form.botro5 == true){
      this.activarCheck5 = false;
      this.repuesto6 = true;
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cnotificacion: this.notificacion.cnotificacion
      };
      this.http.post(`${environment.apiUrl}/api/valrep/settlement/replacement`, params, options).subscribe((response : any) => {
        this.replacementList6 = [];
        if(response.data.list){
          for(let i = 0; i < response.data.list.length; i++){
            this.replacementList6.push({ id6: response.data.list[i].crepuesto, value6: response.data.list[i].xrepuesto});
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
  }

  activateReplacement6(form){
    if(form.botro6 == true){
      this.activarCheck = false;
      this.repuesto7 = true;
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cnotificacion: this.notificacion.cnotificacion
      };
      this.http.post(`${environment.apiUrl}/api/valrep/settlement/replacement`, params, options).subscribe((response : any) => {
        this.replacementList7 = [];
        if(response.data.list){
          for(let i = 0; i < response.data.list.length; i++){
            this.replacementList7.push({ id7: response.data.list[i].crepuesto, value7: response.data.list[i].xrepuesto});
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
  }

  activateReplacement7(form){
    if(form.botro7 == true){
      this.activarCheck7 = false;
      this.repuesto8 = true;
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cnotificacion: this.notificacion.cnotificacion
      };
      this.http.post(`${environment.apiUrl}/api/valrep/settlement/replacement`, params, options).subscribe((response : any) => {
        this.replacementList8 = [];
        if(response.data.list){
          for(let i = 0; i < response.data.list.length; i++){
            this.replacementList8.push({ id8: response.data.list[i].crepuesto, value8: response.data.list[i].xrepuesto});
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
  }

  getCauseSettlement(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cnotificacion: this.notificacion.cnotificacion
    };
    this.http.post(`${environment.apiUrl}/api/valrep/cause-settlement`, params, options).subscribe((response : any) => {
      this.causaList = [];
      if(response.data.list){
        for(let i = 0; i < response.data.list.length; i++){
          this.causaList.push({ id: response.data.list[i].ccausafiniquito, value: response.data.list[i].xcausafiniquito});
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

  onSubmit(form){
     this.submitted = true;
     this.loading = true;

    let notificacionFilter = this.notificationList.filter((option) => { return option.id == this.popup_form.get('cnotificacion').value; });
    let replacementFilter = this.replacementList.filter((option) => { return option.value == this.popup_form.get('xrepuesto').value; });
    let replacement2Filter = this.replacementList2.filter((option) => { return option.value2 == this.popup_form.get('xrepuesto2').value; });
    let replacement3Filter = this.replacementList3.filter((option) => { return option.value3 == this.popup_form.get('xrepuesto3').value; });
    let replacement4Filter = this.replacementList4.filter((option) => { return option.value4 == this.popup_form.get('xrepuesto4').value; });
    let replacement5Filter = this.replacementList5.filter((option) => { return option.value5 == this.popup_form.get('xrepuesto5').value; });
    let replacement6Filter = this.replacementList6.filter((option) => { return option.value6 == this.popup_form.get('xrepuesto6').value; });
    let replacement7Filter = this.replacementList7.filter((option) => { return option.value7 == this.popup_form.get('xrepuesto7').value; });
    let replacement8Filter = this.replacementList8.filter((option) => { return option.value8 == this.popup_form.get('xrepuesto8').value; });


    let repuesto1;
    let repuesto2;
    let repuesto3;
    let repuesto4;
    let repuesto5;
    let repuesto6;
    let repuesto7;
    let repuesto8;

    repuesto1 = replacementFilter[0].value

    if(this.popup_form.get('xrepuesto2').value){
       repuesto2 = this.popup_form.get('xrepuesto2').value;
    }else{
       repuesto2 = ' ';
    }

    if(this.popup_form.get('xrepuesto3').value){
       repuesto3 = this.popup_form.get('xrepuesto3').value;
    }else{
       repuesto3 = ' ';
    }

    if(this.popup_form.get('xrepuesto4').value){
       repuesto4 = this.popup_form.get('xrepuesto4').value;
    }else{
       repuesto4 = ' ';
    }

    if(this.popup_form.get('xrepuesto5').value){
       repuesto5 = this.popup_form.get('xrepuesto5').value;
    }else{
       repuesto5 = ' ';
    }

    if(this.popup_form.get('xrepuesto6').value){
       repuesto6 = this.popup_form.get('xrepuesto6').value;
    }else{
       repuesto6 = ' ';
    }

    if(this.popup_form.get('xrepuesto7').value){
       repuesto7 = this.popup_form.get('xrepuesto7').value;
    }else{
       repuesto7 = ' ';
    }

    if(this.popup_form.get('xrepuesto8').value){
       repuesto8 = this.popup_form.get('xrepuesto8').value;
    }else{
       repuesto8 = ' ';
    }

    let repuestos = "";

    if(repuesto1){
      repuestos = repuesto1
    }else{
      repuestos = ' '
    }
    if(repuesto2){
      repuestos = repuesto1  + ' ' +  repuesto2
    }else{
      repuestos = ' '
    }
    if(repuesto3){
      repuestos = repuesto1  + ' ' + repuesto2  + ' ' + repuesto3
    }else{
      repuestos = ' '
    }
    if(repuesto4){
      repuestos = repuesto1  + ' ' + repuesto2  + ' ' + repuesto3  + ' ' + repuesto4
    }else{
      repuestos = ' '
    }
    if(repuesto5){
      repuestos = repuesto1  + ' ' + repuesto2  + ' ' + repuesto3  + ' ' + repuesto4  + ' ' 
                  + repuesto5
    }else{
      repuestos = ' '
    }
    if(repuesto6){
      repuestos = repuesto1  + ' ' + repuesto2  + ' ' + repuesto3  + ' ' + repuesto4  + ' ' 
                  + repuesto5  + ' ' + repuesto6
    }else{
      repuestos = ' '
    }
    if(repuesto7){
      repuestos = repuesto1  + ' ' + repuesto2  + ' ' + repuesto3  + ' ' + repuesto4  + ' ' 
                  + repuesto5  + ' ' + repuesto6  + ' ' + repuesto7
    }else{
      repuestos = ' '
    }
    if(repuesto8){
      repuestos = repuesto1 + ' ' + repuesto2 + ' ' + repuesto3 + ' ' + repuesto4 + ' ' 
      + repuesto5 + ' ' + repuesto6  + ' ' + repuesto7  + ' ' + repuesto8
    }else{
      repuestos = ' '
    }

    this.notificacion.xobservacion = form.xobservacion;
    this.notificacion.xdanos = repuestos.trim();
    this.notificacion.mmontofiniquito = form.mmontofiniquito;
    this.notificacion.cmoneda = this.popup_form.get('cmoneda').value;
    this.notificacion.ccausafiniquito = this.popup_form.get('ccausafiniquito').value;

    console.log(this.notificacion.ccausafiniquito)
    this.activeModal.close(this.notificacion);
  }
}
