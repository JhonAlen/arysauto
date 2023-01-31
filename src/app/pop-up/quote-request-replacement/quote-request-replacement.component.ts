import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-quote-request-replacement',
  templateUrl: './quote-request-replacement.component.html',
  styleUrls: ['./quote-request-replacement.component.css']
})
export class QuoteRequestReplacementComponent implements OnInit {

  @Input() public replacement;
  currentUser;
  popup_form: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  replacementTypeList: any[] = [];
  replacementList: any[] = [];
  damageLevelList: any[] = [];
  coinList: any[] = [];
  alert = { show : false, type : "", message : "" }

  constructor(public activeModal: NgbActiveModal,
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      ctiporepuesto: ['', Validators.required],
      crepuesto: ['', Validators.required],
      ncantidad: ['', Validators.required],
      cniveldano: ['', Validators.required],
      bdisponible: [false, Validators.required],
      munitariorepuesto: ['', Validators.required],
      bdescuento: [false, Validators.required],
      mtotalrepuesto: ['', Validators.required],
      cmoneda: ['', Validators.required],
      xmoneda: ['']
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania
      };
      this.http.post(`${environment.apiUrl}/api/valrep/replacement-type`, params, options).subscribe((response : any) => {
        if(response.data.status){
          for(let i = 0; i < response.data.list.length; i++){
            this.replacementTypeList.push({ id: response.data.list[i].ctiporepuesto, value: response.data.list[i].xtiporepuesto });
          }
          this.replacementTypeList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.REPLACEMENTTYPENOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
      this.http.post(`${environment.apiUrl}/api/valrep/damage-level`, params, options).subscribe((response : any) => {
        if(response.data.status){
          for(let i = 0; i < response.data.list.length; i++){
            this.damageLevelList.push({ id: response.data.list[i].cniveldano, value: response.data.list[i].xniveldano });
          }
          this.damageLevelList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.DAMAGELEVELNOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
      if(this.replacement){
        if(this.replacement.type == 2){
          this.popup_form.get('ctiporepuesto').setValue(this.replacement.ctiporepuesto);
          this.popup_form.get('ctiporepuesto').disable();
          this.replacementDropdownDataRequest();
          this.popup_form.get('crepuesto').setValue(this.replacement.crepuesto);
          this.popup_form.get('crepuesto').disable();
          this.popup_form.get('ncantidad').setValue(this.replacement.ncantidad);
          this.popup_form.get('ncantidad').disable();
          this.popup_form.get('cniveldano').setValue(this.replacement.cniveldano);
          this.popup_form.get('cniveldano').disable();
          this.popup_form.get('bdisponible').setValue(this.replacement.bdisponible);
          this.popup_form.get('bdisponible').disable();
          this.popup_form.get('munitariorepuesto').setValue(this.replacement.munitariorepuesto);
          this.popup_form.get('munitariorepuesto').disable();
          this.searchCoin();
          this.popup_form.get('cmoneda').setValue(this.replacement.cmoneda);
          this.popup_form.get('cmoneda').disable();
          this.popup_form.get('xmoneda').setValue(this.replacement.xmoneda);
          this.popup_form.get('xmoneda').disable();
          this.popup_form.get('bdescuento').setValue(this.replacement.bdescuento);
          this.popup_form.get('bdescuento').disable();
          this.popup_form.get('mtotalrepuesto').setValue(this.replacement.mtotalrepuesto);
          this.popup_form.get('mtotalrepuesto').disable();
          this.canSave = false;
        }else if(this.replacement.type == 1){
          this.popup_form.get('ctiporepuesto').setValue(this.replacement.ctiporepuesto);
          this.popup_form.get('ctiporepuesto').disable();
          this.replacementDropdownDataRequest();
          this.popup_form.get('crepuesto').setValue(this.replacement.crepuesto);
          this.popup_form.get('crepuesto').disable();
          this.popup_form.get('ncantidad').setValue(this.replacement.ncantidad);
          this.popup_form.get('ncantidad').disable();
          this.popup_form.get('cniveldano').setValue(this.replacement.cniveldano);
          this.popup_form.get('cniveldano').disable();
          this.popup_form.get('bdisponible').setValue(this.replacement.bdisponible);
          this.popup_form.get('munitariorepuesto').setValue(this.replacement.munitariorepuesto);
          this.searchCoin();
          this.popup_form.get('bdescuento').setValue(this.replacement.bdescuento);
          this.popup_form.get('mtotalrepuesto').setValue(this.replacement.mtotalrepuesto);
          if(!this.replacement.bdisponible){
            this.popup_form.get('munitariorepuesto').setValue('');
            this.popup_form.get('munitariorepuesto').disable();
            this.popup_form.get('bdescuento').setValue(false);
            this.popup_form.get('bdescuento').disable();
            this.popup_form.get('mtotalrepuesto').setValue('');
            this.popup_form.get('mtotalrepuesto').disable();
          }
          this.canSave = true;
          this.isEdit = true;
        }
      }
    }
  }

  checkAvailable(event: any){
    if(!event.target.checked){
      this.popup_form.get('munitariorepuesto').setValue('');
      this.popup_form.get('munitariorepuesto').disable();
      this.popup_form.get('bdescuento').setValue(false);
      this.popup_form.get('bdescuento').disable();
      this.popup_form.get('mtotalrepuesto').setValue('');
      this.popup_form.get('mtotalrepuesto').disable();
    }else{
      this.popup_form.get('munitariorepuesto').enable();
      this.popup_form.get('bdescuento').enable();
      this.popup_form.get('mtotalrepuesto').enable();
    }
  }

  calculateTotal(){
    let total = this.popup_form.get('ncantidad').value * this.popup_form.get('munitariorepuesto').value;
    this.popup_form.get('mtotalrepuesto').setValue(total);
  }

  replacementDropdownDataRequest(){
    if(this.popup_form.get('ctiporepuesto').value){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania,
        ctiporepuesto: this.popup_form.get('ctiporepuesto').value
      }
      this.http.post(`${environment.apiUrl}/api/valrep/replacement`, params, options).subscribe((response : any) => {
        if(response.data.status){
          this.replacementList = [];
          for(let i = 0; i < response.data.list.length; i++){
            this.replacementList.push({ id: response.data.list[i].crepuesto, value: response.data.list[i].xrepuesto });
          }
          this.replacementList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.REPLACEMENTNOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
    }
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

  onSubmit(form){
    this.submitted = true;
    this.loading = true;
    if (this.popup_form.invalid) {
      this.loading = false;
      return;
    }
    this.replacement.bdisponible = form.bdisponible;
    this.replacement.munitariorepuesto = form.munitariorepuesto;
    this.replacement.bdescuento = form.bdescuento;
    this.replacement.mtotalrepuesto = form.mtotalrepuesto;
    this.replacement.cmoneda = form.cmoneda;
    this.replacement.xmoneda = form.xmoneda;
    this.activeModal.close(this.replacement);
  }

}
