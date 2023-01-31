import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '@app/_services/authentication.service';
import { NotificationQuoteServiceOrderComponent } from '@app/pop-up/notification-quote-service-order/notification-quote-service-order.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-notification-quote',
  templateUrl: './notification-quote.component.html',
  styleUrls: ['./notification-quote.component.css']
})
export class NotificationQuoteComponent implements OnInit {

  private quotedReplacementGridApi;
  private acceptedReplacementGridApi;
  private serviceOrderGridApi;
  @Input() public quote;
  currentUser;
  submitted: boolean = false;
  popup_form: UntypedFormGroup;
  loading: boolean = false;
  loading_cancel: boolean = false;
  editStatus: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  canCreate: boolean = false;
  canDetail: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;
  showSaveButton: boolean = false;
  showEditButton: boolean = false;
  quotedReplacementList: any[] = [];
  acceptedReplacementList: any[] = [];
  serviceOrderList: any[] = [];
  code;
  alert = { show : false, type : "", message : "" }

  constructor(public activeModal: NgbActiveModal,
              private authenticationService: AuthenticationService,
              private formBuilder: UntypedFormBuilder,
              private modalService : NgbModal) { }

  ngOnInit(): void {
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      if(this.quote){
        if(this.quote.type == 2){
        
          let arrayPerform = this.quote.replacements;
          arrayPerform = arrayPerform.filter((obj) => !obj.bpagar);
          for(let i = 0; i < arrayPerform.length; i ++){
            arrayPerform[i].cgrid = i;
          }
          if(this.quote.baceptacion == false){
            let arrayPerform = this.quote.replacements;
            this.quotedReplacementList = arrayPerform;
          }
          arrayPerform = this.quote.replacements;
          arrayPerform = arrayPerform.filter((obj) => obj.bpagar);
          for(let i = 0; i < arrayPerform.length; i ++){
            arrayPerform[i].cgrid = i;
          }
          if(this.quote.baceptacion == true){
            arrayPerform = this.quote.replacements;
            this.acceptedReplacementList = arrayPerform;
            console.log('hola')
            console.log(this.quote.mtotalcotizacion)
          }
          this.canSave = false;
        }else if(this.quote.type == 1){
          let arrayPerform = this.quote.replacements.filter((obj) => !obj.bpagar);
          for(let i = 0; i < arrayPerform.length; i ++){
            arrayPerform[i].cgrid = i;
          }
          if(this.quote.baceptacion == false){
            let arrayPerform = this.quote.replacements;
            this.quotedReplacementList = arrayPerform;
          }
          arrayPerform = this.quote.replacements.filter((obj) => obj.bpagar);
          for(let i = 0; i < arrayPerform.length; i ++){
            arrayPerform[i].cgrid = i;
          }
          if(this.quote.baceptacion == true){
            arrayPerform = this.quote.replacements;
            this.acceptedReplacementList = arrayPerform;
          }
          this.canCreate = true;
          this.isEdit = true;
        }
      }
    }
  }

  quotedReplacementRowClicked(event: any){
    if(this.quote.type == 1 && event.data.bdisponible){
      let eventObj = event.data;
      eventObj.bpagar = true;
      this.quotedReplacementList = this.quotedReplacementList.filter((obj) => obj.crepuestocotizacion != eventObj.crepuestocotizacion)
      this.quotedReplacementGridApi.setRowData(this.quotedReplacementList);
      this.acceptedReplacementList.push(eventObj);
      for(let i = 0; i < this.acceptedReplacementList.length; i++){
        this.acceptedReplacementList[i].cgrid = i;
        this.acceptedReplacementList[i].baceptacion = true;
      }
      this.acceptedReplacementGridApi.setRowData(this.acceptedReplacementList);
      this.quote.baceptacion = true;
      this.showEditButton = true;
      this.canEdit = true;
      this.canSave = true;
    }
  }

  acceptedReplacementRowClicked(event: any){
    if(this.quote.type == 1){
      let eventObj = event.data;
      eventObj.bpagar = false;
      this.acceptedReplacementList = this.acceptedReplacementList.filter((obj) => obj.crepuestocotizacion != eventObj.crepuestocotizacion)
      this.acceptedReplacementGridApi.setRowData(this.acceptedReplacementList);
      this.quotedReplacementList.push(eventObj);
      for(let i = 0; i < this.quotedReplacementList.length; i++){
        this.quotedReplacementList[i].cgrid = i;
        this.quotedReplacementList[i].baceptacion = false;
      }
      this.quotedReplacementGridApi.setRowData(this.quotedReplacementList);
      this.quote.baceptacion = false;
      this.canCreate = false;
      this.canEdit = false;
      this.canSave = true;
    }
  }

  onQuotedReplacementsGridReady(event){
    this.quotedReplacementGridApi = event.api;
  }

  onAcceptedReplacementsGridReady(event){
    this.acceptedReplacementGridApi = event.api;
  }

  addServiceOrder(){
    if(this.quote){
      let quote = {ccotizacion: this.quote, cnotificacion: this.quote.cnotificacion, cproveedor: this.quote.cproveedor, xnombre: this.quote.xnombre, repuestos: this.acceptedReplacementList, createServiceOrder: true};
      const modalRef = this.modalService.open(NotificationQuoteServiceOrderComponent, {size: 'xl'});
      modalRef.componentInstance.quote = quote;
      modalRef.result.then((result: any) => { 

        let serviceOrder = {
          cgrid: this.serviceOrderList.length,
          createServiceOrder: true,
          edit: false,
          cnotificacion: result.cnotificacion,
          corden: result.corden,
          xservicio: result.xservicio,
          cservicioadicional: result.cservicioadicional,
          xobservacion: result.xobservacion,
          xfecha: result.xfecha,
          xdanos: result.xdanos,
          fajuste: result.fajuste.substring(0,10),
          xdesde: result.xdesde,
          xhacia: result.xhacia,
          mmonto: result.mmonto,
          cimpuesto: 13,
          cmoneda: result.cmoneda,
          xmoneda: result.xmoneda,
          cproveedor: result.cproveedor,
          xnombre: result.xnombre,
          bactivo: result.bactivo,
          baceptacion: result.baceptacion,
          ccotizacion: this.quote.ccotizacion
        }
        console.log(serviceOrder)
        this.activeModal.close(serviceOrder);
      });
    }
  }

  onSubmit(form){
    this.submitted = true;
    this.loading = true;

    if(this.acceptedReplacementList){
      for(let i = 0; i < this.acceptedReplacementList.length; i++){
        this.acceptedReplacementList[i].cgrid = i;
        this.acceptedReplacementList[i].baceptacion = true;
      }
    }else{
      for(let i = 0; i < this.quotedReplacementList.length; i++){
        this.quotedReplacementList[i].cgrid = i;
        this.quotedReplacementList[i].baceptacion = false;
      }
    }
    this.activeModal.close(this.quote);
  }
  
  /*quotedAccepted(){
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cnotificacion: this.quote.cnotificacion
    };
    this.http.post(`${environment.apiUrl}/api/service-order/notification-order`, params, options).subscribe((response : any) => {
      this.aditionalServiceList = [];
      if(this.quote.cnotificacion){
          if (this.quote.cnotificacion == response.data.list[0].cnotificacion){
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
            this.popup_form.get('xcliente').setValue(response.data.list[0].xcliente);
            this.popup_form.get('xcliente').disable();
            this.popup_form.get('xdocumentocliente').setValue(response.data.list[0].xdocumentocliente);
            this.popup_form.get('xdocumentocliente').disable();
            this.popup_form.get('xdireccionfiscal').setValue(response.data.list[0].xdireccionfiscal);
            this.popup_form.get('xdireccionfiscal').disable();
            this.popup_form.get('xtelefono').setValue(response.data.list[0].xtelefono);
            this.popup_form.get('xtelefono').disable();
            this.popup_form.get('xdesde').disable();
            this.popup_form.get('xhacia').disable();
            this.popup_form.get('mmonto').disable();
            this.popup_form.get('xdescripcion').setValue(response.data.list[0].xdescripcion);
            this.popup_form.get('xdescripcion').disable();
            this.popup_form.get('xnombrepropietario').setValue(response.data.list[0].xnombrepropietario);
            this.popup_form.get('xnombrepropietario').disable();
            this.popup_form.get('mmontototal').disable();
            this.popup_form.get('pimpuesto').disable();
            this.popup_form.get('xapellidopropietario').setValue(response.data.list[0].xapellidopropietario);
            this.popup_form.get('xapellidopropietario').disable();
            this.popup_form.get('xdocidentidad').setValue(response.data.list[0].xdocidentidad);
            this.popup_form.get('xdocidentidad').disable();
            this.popup_form.get('xtelefonocelular').setValue(response.data.list[0].xtelefonocelular);
            this.popup_form.get('xtelefonocelular').disable();
            this.popup_form.get('cservicio').setValue(response.data.list[0].cservicio);
            this.popup_form.get('cservicio').enable();
            this.popup_form.get('xplaca').setValue(response.data.list[0].xplaca);
            this.popup_form.get('xplaca').disable();
            this.popup_form.get('xcolor').setValue(response.data.list[0].xcolor);
            this.popup_form.get('xcolor').disable();
            this.popup_form.get('xmoneda').disable();
            this.popup_form.get('xmodelo').setValue(response.data.list[0].xmodelo);
            this.popup_form.get('xmodelo').disable();
            this.popup_form.get('xmarca').setValue(response.data.list[0].xmarca);
            this.popup_form.get('xmarca').disable();
            this.popup_form.get('fano').setValue(response.data.list[0].fano);
            this.popup_form.get('fano').disable();
            this.popup_form.get('fcreacion').setValue(response.data.list[0].fcreacion);
            this.popup_form.get('fcreacion').disable();
            this.popup_form.get('bactivo').setValue(response.data.list[0].bactivo);
            this.popup_form.get('bactivo').disable();
            this.popup_form.get('xactivo').disable();
            this.popup_form.get('xproveedor').setValue(this.quote.xnombre);
            this.popup_form.get('xproveedor').disable();
          }
          this.notificationList.push({ id: response.data.list[0].cnotificacion, ccontratoflota: response.data.list[0].ccontratoflota, nombre: response.data.list[0].xnombre, apellido: response.data.list[0].xapellido, nombrealternativo: response.data.list[0].xnombrealternativo, apellidoalternativo: response.data.list[0].xapellidoalternativo, xmarca: response.data.list[0].xmarca, xdescripcion: response.data.list[0].xdescripcion, xnombrepropietario: response.data.list[0].xnombrepropietario, xapellidopropietario: response.data.list[0].xapellidopropietario, xdocidentidad: response.data.list[0].xdocidentidad, xtelefonocelular: response.data.list[0].xtelefonocelular, xplaca: response.data.list[0].xplaca, xcolor: response.data.list[0].xcolor, xmodelo: response.data.list[0].xmodelo, xcliente: response.data.list[0].xcliente, fano: response.data.list[0].fano, fecha: response.data.list[0].fcreacion });
      }

    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cnotificacion: this.popup_form.get('cnotificacion').value
    }
    this.http.post(`${environment.apiUrl}/api/valrep/aditional-service-quote`, params, options).subscribe((response: any) => {
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.aditionalServiceList.push({ servicio: response.data.list[i].cservicio, value: response.data.list[i].xservicio});
        }
        this.aditionalServiceList.sort((a,b) => a.value > b.value ? 1 : -1);
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.SERVICENOTFOUND"; }
      //else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }*/

}
