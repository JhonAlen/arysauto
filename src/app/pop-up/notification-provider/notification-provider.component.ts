import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NotificationSearchExistentReplacementComponent } from '@app/pop-up/notification-search-existent-replacement/notification-search-existent-replacement.component';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-notification-provider',
  templateUrl: './notification-provider.component.html',
  styleUrls: ['./notification-provider.component.css']
})
export class NotificationProviderComponent implements OnInit {

  private replacementGridApi;
  @Input() public provider;
  currentUser;
  popup_form: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  providerList: any[] = [];
  replacementList: any[] = [];
  alert = { show : false, type : "", message : "" }
  replacementDeletedRowList

  constructor(public activeModal: NgbActiveModal,
              private modalService: NgbModal,
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      cproveedor: ['', Validators.required],
      xobservacion: ['', Validators.required]
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania,
        cproveedor: this.provider.cproveedor
      };
      this.http.post(`${environment.apiUrl}/api/valrep/provider`, params, options).subscribe((response : any) => {
        if(response.data.status){
          for(let i = 0; i < response.data.list.length; i++){
            this.providerList.push({ id: response.data.list[i].cproveedor, value: response.data.list[i].xnombre });
          }
          console.log(this.providerList)
          //this.providerList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.PROVIDERNOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
      if(this.provider){
        if(this.provider.type == 3){
          this.popup_form.get('cproveedor').setValue(this.provider.cproveedor);
          this.popup_form.get('cproveedor').disable();
          this.canSave = true;
        }else if(this.provider.type == 2){
          this.popup_form.get('cproveedor').setValue(this.provider.cproveedor);
          this.popup_form.get('cproveedor').disable();
          this.popup_form.get('xobservacion').setValue(this.provider.xobservacion);
          this.popup_form.get('xobservacion').disable();
          this.replacementList = this.provider.replacements
          this.canSave = false;
        }else if(this.provider.type == 1){
          this.popup_form.get('cproveedor').setValue(this.provider.cproveedor);
          this.popup_form.get('cproveedor').disable();
          this.popup_form.get('xobservacion').setValue(this.provider.xobservacion);
          for(let i =0; i < this.provider.replacements.length; i++){
            this.replacementList.push({
              cgrid: i,
              create: this.provider.replacements[i].create,
              crepuestocotizacion: this.provider.replacements[i].crepuestocotizacion,
              crepuesto: this.provider.replacements[i].crepuesto,
              xrepuesto: this.provider.replacements[i].xrepuesto,
              ctiporepuesto: this.provider.replacements[i].ctiporepuesto,
              ncantidad: this.provider.replacements[i].ncantidad,
              cniveldano: this.provider.replacements[i].cniveldano
            });
          }
          this.canSave = true;
          this.isEdit = true;
        }
      }
    }
  }

  addReplacement(){
    let replacement = { cnotificacion: this.provider.cnotificacion }
    const modalRef = this.modalService.open(NotificationSearchExistentReplacementComponent, { size: 'xl' });
    modalRef.componentInstance.replacement = replacement;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 3){
          this.replacementList.push({
            cgrid:  this.replacementList.length,
            create: true,
            crepuesto: result.crepuesto,
            xrepuesto: result.xrepuesto,
            ctiporepuesto: result.ctiporepuesto,
            xtiporepuesto: result.xtiporepuesto,
            ncantidad: result.ncantidad,
            cniveldano: result.cniveldano,
            xniveldano: result.xniveldano
          });
          this.replacementGridApi.setRowData(this.replacementList);
        }
      }
    });
  }

  replacementRowClicked(event: any){
    if(this.provider.type == 1 || this.provider.type == 3){
      if(event.data.crepuestocotizacion){
        this.replacementDeletedRowList.push({ crepuestocotizacion: event.data.crepuestocotizacion });
      }
      this.replacementList = this.replacementList.filter((row) => { return row.cgrid != event.data.cgrid });
      for(let i = 0; i < this.replacementList.length; i++){
        this.replacementList[i].cgrid = i;
      }
      this.replacementGridApi.setRowData(this.replacementList);
    }
  }

  onReplacementsGridReady(event){
    this.replacementGridApi = event.api;
  }

  onSubmit(form){
    this.submitted = true;
    this.loading = true;
    if (this.popup_form.invalid) {
      this.loading = false;
      return;
    }
    console.log(this.popup_form.get('cproveedor').value)
    
    let providerFilter = this.providerList.filter((option) => { return option.id == this.popup_form.get('cproveedor').value });
    console.log(providerFilter[0].value)
    this.provider.cproveedor = this.popup_form.get('cproveedor').value;
    this.provider.xnombre = providerFilter[0].value;
    console.log(this.provider.xnombre)
    this.provider.xobservacion = form.xobservacion;
    this.provider.replacements = this.replacementList;
    if(this.provider.ccotizacion){
      let updateReplacementList = this.replacementList.filter((row) => { return !row.create; });
      let createReplacementList = this.replacementList.filter((row) => { return row.create; });
      this.provider.replacementsResult = {
        create: createReplacementList,
        update: updateReplacementList,
        delete: this.replacementDeletedRowList
      };
    }
    this.activeModal.close(this.provider);
  }

  deleteProvider(){
    this.provider.type = 4;
    if(!this.provider.create){
      this.provider.delete = true;
    }
    this.activeModal.close(this.provider);
  }

}
