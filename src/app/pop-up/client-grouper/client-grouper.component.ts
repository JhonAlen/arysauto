import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { ClientGrouperBankComponent } from '@app/pop-up/client-grouper-bank/client-grouper-bank.component';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-client-grouper',
  templateUrl: './client-grouper.component.html',
  styleUrls: ['./client-grouper.component.css']
})
export class ClientGrouperComponent implements OnInit {

  @ViewChild('Ximagen', { static: false }) ximagen: ElementRef;
  @Input() public grouper;
  private bankGridApi;
  currentUser;
  popup_form: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  bankList: any[] = [];
  documentTypeList: any[] = [];
  stateList: any[] =[];
  cityList: any[] =[];
  alert = { show : false, type : "", message : "" }
  xrutaimagen: string;
  bankDeletedRowList: any[] = [];

  constructor(public activeModal: NgbActiveModal,
              private modalService: NgbModal,
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private formBuilder: UntypedFormBuilder,
              private translate: TranslateService) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      xcontratoalternativo: ['', Validators.required],
      xnombre: ['', Validators.required],
      xrazonsocial: ['', Validators.required],
      cestado: ['', Validators.required],
      cciudad: ['', Validators.required],
      xdireccionfiscal: ['', Validators.required],
      ctipodocidentidad: ['', Validators.required],
      xdocidentidad: ['', Validators.required],
      bfacturar: [false, Validators.required],
      bcontribuyente: [false, Validators.required],
      bimpuesto: [false, Validators.required],
      xtelefono: ['', Validators.required],
      xfax: [''],
      xemail: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])],
      ximagen: [''],
      bactivo: [true, Validators.required]
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cpais: this.currentUser.data.cpais
      };
      this.http.post(`${environment.apiUrl}/api/valrep/document-type`, params, options).subscribe((response : any) => {
        if(response.data.status){
          for(let i = 0; i < response.data.list.length; i++){
            this.documentTypeList.push({ id: response.data.list[i].ctipodocidentidad, value: response.data.list[i].xtipodocidentidad });
          }
          this.documentTypeList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.DOCUMENTTYPENOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
      this.http.post(`${environment.apiUrl}/api/valrep/state`, params, options).subscribe((response : any) => {
        if(response.data.status){
          for(let i = 0; i < response.data.list.length; i++){
            this.stateList.push({ id: response.data.list[i].cestado, value: response.data.list[i].xestado });
          }
          this.stateList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.STATENOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
      if(this.grouper){
        if(this.grouper.type == 3){
          this.canSave = true;
        }else if(this.grouper.type == 2){
          this.popup_form.get('xcontratoalternativo').setValue(this.grouper.xcontratoalternativo);
          this.popup_form.get('xcontratoalternativo').disable();
          this.popup_form.get('xnombre').setValue(this.grouper.xnombre);
          this.popup_form.get('xnombre').disable();
          this.popup_form.get('xrazonsocial').setValue(this.grouper.xrazonsocial);
          this.popup_form.get('xrazonsocial').disable();
          this.popup_form.get('cestado').setValue(this.grouper.cestado);
          this.popup_form.get('cestado').disable();
          this.cityDropdownDataRequest();
          this.popup_form.get('cciudad').setValue(this.grouper.cciudad);
          this.popup_form.get('cciudad').disable();
          this.popup_form.get('xdireccionfiscal').setValue(this.grouper.xdireccionfiscal);
          this.popup_form.get('xdireccionfiscal').disable();
          this.popup_form.get('ctipodocidentidad').setValue(this.grouper.ctipodocidentidad);
          this.popup_form.get('ctipodocidentidad').disable();
          this.popup_form.get('xdocidentidad').setValue(this.grouper.xdocidentidad);
          this.popup_form.get('xdocidentidad').disable();
          this.popup_form.get('bfacturar').setValue(this.grouper.bfacturar);
          this.popup_form.get('bfacturar').disable();
          this.popup_form.get('bcontribuyente').setValue(this.grouper.bcontribuyente);
          this.popup_form.get('bcontribuyente').disable();
          this.popup_form.get('bimpuesto').setValue(this.grouper.bimpuesto);
          this.popup_form.get('bimpuesto').disable();
          this.popup_form.get('xtelefono').setValue(this.grouper.xtelefono);
          this.popup_form.get('xtelefono').disable();
          this.popup_form.get('xfax').setValue(this.grouper.xfax);
          this.popup_form.get('xfax').disable();
          this.popup_form.get('xemail').setValue(this.grouper.xemail);
          this.popup_form.get('xemail').disable();
          this.popup_form.get('bactivo').setValue(this.grouper.bactivo);
          this.popup_form.get('bactivo').disable();
          this.grouper.xrutaimagen ? this.xrutaimagen = this.grouper.xrutaimagen : this.xrutaimagen = '';
          this.bankList = this.grouper.banks
          this.canSave = false;
        }else if(this.grouper.type == 1){
          this.popup_form.get('xcontratoalternativo').setValue(this.grouper.xcontratoalternativo);
          this.popup_form.get('xnombre').setValue(this.grouper.xnombre);
          this.popup_form.get('xrazonsocial').setValue(this.grouper.xrazonsocial);
          this.popup_form.get('cestado').setValue(this.grouper.cestado);
          this.cityDropdownDataRequest();
          this.popup_form.get('cciudad').setValue(this.grouper.cciudad);
          this.popup_form.get('xdireccionfiscal').setValue(this.grouper.xdireccionfiscal);
          this.popup_form.get('ctipodocidentidad').setValue(this.grouper.ctipodocidentidad);
          this.popup_form.get('xdocidentidad').setValue(this.grouper.xdocidentidad);
          this.popup_form.get('bfacturar').setValue(this.grouper.bfacturar);
          this.popup_form.get('bcontribuyente').setValue(this.grouper.bcontribuyente);
          this.popup_form.get('bimpuesto').setValue(this.grouper.bimpuesto);
          this.popup_form.get('xtelefono').setValue(this.grouper.xtelefono);
          this.popup_form.get('xfax').setValue(this.grouper.xfax);
          this.popup_form.get('xemail').setValue(this.grouper.xemail);
          this.popup_form.get('bactivo').setValue(this.grouper.bactivo);
          this.grouper.xrutaimagen ? this.xrutaimagen = this.grouper.xrutaimagen : this.xrutaimagen = '';
          for(let i =0; i < this.grouper.banks.length; i++){
            this.bankList.push({
              cgrid: i,
              create: this.grouper.banks[i].create,
              cbanco: this.grouper.banks[i].cbanco,
              xbanco: this.grouper.banks[i].xbanco,
              ctipocuentabancaria: this.grouper.banks[i].ctipocuentabancaria,
              xtipocuentabancaria: this.grouper.banks[i].xtipocuentabancaria,
              xnumerocuenta: this.grouper.banks[i].xnumerocuenta,
              xcontrato: this.grouper.banks[i].xcontrato,
              bprincipal: this.grouper.banks[i].bprincipal,
              xprincipal: this.grouper.banks[i].xprincipal
            });
          }
          this.canSave = true;
          this.isEdit = true;
        }
      }
    }
  }

  cityDropdownDataRequest(){
    if(this.popup_form.get('cestado').value){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cpais: this.currentUser.data.cpais,
        cestado: this.popup_form.get('cestado').value
      }
      this.http.post(`${environment.apiUrl}/api/valrep/city`, params, options).subscribe((response : any) => {
        if(response.data.status){
          this.cityList = [];
          for(let i = 0; i < response.data.list.length; i++){
            this.cityList.push({ id: response.data.list[i].cciudad, value: response.data.list[i].xciudad });
          }
          this.cityList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.CITYNOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
    }
  }

  onFileSelect(event){
    const file = event.target.files[0];
    this.popup_form.get('ximagen').setValue(file);
  }

  addBank(){
    let bank = { type: 3 };
    const modalRef = this.modalService.open(ClientGrouperBankComponent);
    modalRef.componentInstance.bank = bank;
    modalRef.result.then((result: any) => { 
      if(result){
        if(result.type == 3){
          this.bankList.push({
            cgrid: this.bankList.length,
            create: true,
            cbanco: result.cbanco,
            xbanco: result.xbanco,
            ctipocuentabancaria: result.ctipocuentabancaria,
            xtipocuentabancaria: result.xtipocuentabancaria,
            xnumerocuenta: result.xnumerocuenta,
            xcontrato: result.xcontrato,
            bprincipal: result.bprincipal,
            xprincipal: result.bprincipal ? this.translate.instant("DROPDOWN.YES") : this.translate.instant("DROPDOWN.NO")
          });
          this.bankGridApi.setRowData(this.bankList);
        }
      }
    });
  }

  bankRowClicked(event: any){
    let bank = {};
    if(this.isEdit){ 
      bank = { 
        type: 1,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        cbanco: event.data.cbanco,
        ctipocuentabancaria: event.data.ctipocuentabancaria,
        xnumerocuenta: event.data.xnumerocuenta,
        xcontrato: event.data.xcontrato,
        bprincipal: event.data.bprincipal,
        delete: false
      };
    }else{ 
      bank = { 
        type: 2,
        create: event.data.create,
        cgrid: event.data.cgrid,
        cbanco: event.data.cbanco,
        ctipocuentabancaria: event.data.ctipocuentabancaria,
        xnumerocuenta: event.data.xnumerocuenta,
        xcontrato: event.data.xcontrato,
        bprincipal: event.data.bprincipal,
        delete: false
      }; 
    }
    const modalRef = this.modalService.open(ClientGrouperBankComponent);
    modalRef.componentInstance.bank = bank;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 1){
          for(let i = 0; i < this.bankList.length; i++){
            if(this.bankList[i].cgrid == result.cgrid){
              this.bankList[i].cbanco = result.cbanco;
              this.bankList[i].xbanco = result.xbanco;
              this.bankList[i].ctipocuentabancaria = result.ctipocuentabancaria;
              this.bankList[i].xnumerocuenta = result.xnumerocuenta;
              this.bankList[i].xcontrato = result.xcontrato;
              this.bankList[i].bprincipal = result.bprincipal;
              this.bankList[i].xprincipal = result.bprincipal ? this.translate.instant("DROPDOWN.YES") : this.translate.instant("DROPDOWN.NO");
              this.bankGridApi.refreshCells();
              return;
            }
          }
        }else if(result.type == 4){
          if(result.delete){
            this.bankDeletedRowList.push({ cbanco: result.cbanco });
          }
          this.bankList = this.bankList.filter((row) => { return row.cgrid != result.cgrid });
          for(let i = 0; i < this.bankList.length; i++){
            this.bankList[i].cgrid = i;
          }
          this.bankGridApi.setRowData(this.bankList);
        }
      }
    });
  }

  onBanksGridReady(event){
    this.bankGridApi = event.api;
  }

  onSubmit(form){
    this.submitted = true;
    this.loading = true;
    if (this.popup_form.invalid) {
      this.loading = false;
      return;
    }
    if(!this.popup_form.get('ximagen').value){
      this.savePopUpForm(form);
    }else{
      const formData = new FormData();
      formData.append('ximagen', this.popup_form.get('ximagen').value);
      formData.append('agentId', '007');
      this.http.post<any>(`${environment.apiUrl}/api/upload/image`, formData).subscribe(response => {
        if(response.data.status){
          this.xrutaimagen = `${environment.apiUrl}/images/${response.data.uploadedFile.filename}`;
          this.savePopUpForm(form);
        }else{
          this.alert.message = "CLIENTS.CLIENTS.CANTUPLOADIMAGE";
          this.alert.type = 'danger';
          this.alert.show = true;
          this.loading = false;
        }
      }, er => {
        this.alert.message = "CLIENTS.CLIENTS.CANTUPLOADIMAGE";
        this.alert.type = 'danger';
        this.alert.show = true;
        this.loading = false;
      });
    }
  }

  savePopUpForm(form){
    this.grouper.xcontratoalternativo = form.xcontratoalternativo;
    this.grouper.xnombre = form.xnombre;
    this.grouper.xrazonsocial = form.xrazonsocial;
    this.grouper.cestado = form.cestado;
    this.grouper.cciudad = form.cciudad;
    this.grouper.xdireccionfiscal = form.xdireccionfiscal;
    this.grouper.ctipodocidentidad = form.ctipodocidentidad;
    this.grouper.xdocidentidad = form.xdocidentidad;
    this.grouper.bfacturar = form.bfacturar;
    this.grouper.bcontribuyente = form.bcontribuyente;
    this.grouper.bimpuesto = form.bimpuesto;
    this.grouper.xtelefono = form.xtelefono;
    this.grouper.xfax = form.xfax;
    this.grouper.xemail = form.xemail;
    this.grouper.bactivo = form.bactivo;
    this.grouper.xrutaimagen = this.xrutaimagen ? this.xrutaimagen : undefined;
    this.grouper.banks = this.bankList;
    if(this.grouper.cagrupador){
      let updateBankList = this.bankList.filter((row) => { return !row.create; });
      let createBankList = this.bankList.filter((row) => { return row.create; });
      this.grouper.banksResult = {
        create: createBankList,
        update: updateBankList,
        delete: this.bankDeletedRowList
      };
    }
    this.activeModal.close(this.grouper);
  }

  deleteGrouper(){
    this.grouper.type = 4;
    if(!this.grouper.create){
      this.grouper.delete = true;
    }
    this.activeModal.close(this.grouper);
  }

}
