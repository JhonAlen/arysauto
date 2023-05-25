import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-client-plan',
  templateUrl: './client-plan.component.html',
  styleUrls: ['./client-plan.component.css']
})
export class ClientPlanComponent implements OnInit {

  @Input() public plan;
  currentUser;
  popup_form: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  planTypeList: any[] = [];
  planList: any[] = [];
  associateList: any[] = [];
  alert = { show : false, type : "", message : "" }

  constructor(public activeModal: NgbActiveModal,
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      cplan: [''],
      casociado: [''],
      ctipoplan: [''],
      fdesde: [''],
      fhasta: ['']
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania
      };
      this.http.post(`${environment.apiUrl}/api/valrep/plan-type`, params, options).subscribe((response : any) => {
        if(response.data.status){
          for(let i = 0; i < response.data.list.length; i++){
            this.planTypeList.push({ id: response.data.list[i].ctipoplan, value: response.data.list[i].xtipoplan });
          }
          this.planTypeList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.PLANTYPENOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
      if(this.plan){
        for(let i = 0; i < this.plan.associates.length; i++){
          this.associateList.push({ id: this.plan.associates[i].casociado, value: this.plan.associates[i].xasociado });
        }
        if(this.plan.type == 3){
          this.canSave = true;
        }else if(this.plan.type == 2){
          this.popup_form.get('cplan').setValue(this.plan.cplan);
          this.popup_form.get('cplan').disable();
          this.popup_form.get('casociado').setValue(this.plan.casociado);
          this.popup_form.get('casociado').disable();
          this.popup_form.get('ctipoplan').setValue(this.plan.ctipoplan);
          this.popup_form.get('ctipoplan').disable();
          this.planDropdownDataRequest();
          this.popup_form.get('fdesde').setValue(this.plan.fdesde);
          this.popup_form.get('fdesde').disable();
          this.popup_form.get('fhasta').setValue(this.plan.fhasta);
          this.popup_form.get('fhasta').disable();
          this.canSave = false;
        }else if(this.plan.type == 1){
          this.popup_form.get('cplan').setValue(this.plan.cplan);
          this.popup_form.get('casociado').setValue(this.plan.casociado);
          this.popup_form.get('ctipoplan').setValue(this.plan.ctipoplan);
          this.planDropdownDataRequest();
          this.popup_form.get('fdesde').setValue(this.plan.fdesde);
          this.popup_form.get('fhasta').setValue(this.plan.fhasta);
          this.canSave = true;
          this.isEdit = true;
        }
      }
    }
  }

  planDropdownDataRequest(){
    if(this.popup_form.get('ctipoplan').value){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania,
        ctipoplan: this.popup_form.get('ctipoplan').value
      }
      this.http.post(`${environment.apiUrl}/api/valrep/plan`, params, options).subscribe((response : any) => {
        if(response.data.status){
          this.planList = [];
          for(let i = 0; i < response.data.list.length; i++){
            this.planList.push({ id: response.data.list[i].cplan, value: response.data.list[i].xplan });
          }
          this.planList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.PLANNOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
    }
  }

  onSubmit(form){
    this.submitted = true;
    this.loading = true;
    if (this.popup_form.invalid) {
      this.loading = false;
      return;
    }
    let associateFilter = this.associateList.filter((option) => { return option.id == form.casociado; });
    let planTypeFilter = this.planTypeList.filter((option) => { return option.id == form.ctipoplan; });
    let planFilter = this.planList.filter((option) => { return option.id == form.cplan; });
    this.plan.cplan = form.cplan;
    this.plan.xplan = planFilter[0].value;
    this.plan.casociado = form.casociado;
    this.plan.xasociado = associateFilter[0].value;
    this.plan.ctipoplan = form.ctipoplan;
    this.plan.xtipoplan = planTypeFilter[0].value;
    this.plan.fdesde = form.fdesde;
    this.plan.fhasta = form.fhasta;
    this.activeModal.close(this.plan);
  }

  deletePlan(){
    this.plan.type = 4;
    if(!this.plan.create){
      this.plan.delete = true;
    }
    this.activeModal.close(this.plan);
  }

}
