import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-plan-service-coverage',
  templateUrl: './plan-service-coverage.component.html',
  styleUrls: ['./plan-service-coverage.component.css']
})
export class PlanServiceCoverageComponent implements OnInit {

  @Input() public coverage;
  currentUser;
  popup_form: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  coverageList: any[] = [];
  coverageConceptList: any[] = [];
  alert = { show : false, type : "", message : "" }

  constructor(public activeModal: NgbActiveModal,
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      ccobertura: [''],
      cconceptocobertura: ['']
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania
      };
      this.http.post(`${environment.apiUrl}/api/valrep/coverage`, params, options).subscribe((response : any) => {
        if(response.data.status){
          for(let i = 0; i < response.data.list.length; i++){
            this.coverageList.push({ id: response.data.list[i].ccobertura, value: response.data.list[i].xcobertura });
          }
          this.coverageList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.COVERAGENOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
      this.http.post(`${environment.apiUrl}/api/valrep/coverage-concept`, params, options).subscribe((response : any) => {
        if(response.data.status){
          for(let i = 0; i < response.data.list.length; i++){
            this.coverageConceptList.push({ id: response.data.list[i].cconceptocobertura, value: response.data.list[i].xconceptocobertura });
          }
          this.coverageConceptList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.COVERAGECONCEPTNOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
      if(this.coverage){
        if(this.coverage.type == 3){
          this.canSave = true;
        }else if(this.coverage.type == 2){
          this.popup_form.get('ccobertura').setValue(this.coverage.ccobertura);
          this.popup_form.get('ccobertura').disable();
          this.popup_form.get('cconceptocobertura').setValue(this.coverage.cconceptocobertura);
          this.popup_form.get('cconceptocobertura').disable();
          this.canSave = false;
        }else if(this.coverage.type == 1){
          this.popup_form.get('ccobertura').setValue(this.coverage.ccobertura);
          this.popup_form.get('cconceptocobertura').setValue(this.coverage.cconceptocobertura);
          this.canSave = true;
          this.isEdit = true;
        }
      }
    }
  }

  onSubmit(form){
    this.submitted = true;
    this.loading = true;
    if (this.popup_form.invalid) {
      this.loading = false;
      return;
    }
    let coverageFilter = this.coverageList.filter((option) => { return option.id == form.ccobertura; });
    let coverageConceptFilter = this.coverageConceptList.filter((option) => { return option.id == form.cconceptocobertura; });
    this.coverage.ccobertura = form.ccobertura;
    this.coverage.xcobertura = coverageFilter[0].value;
    this.coverage.cconceptocobertura = form.cconceptocobertura;
    this.coverage.xconceptocobertura = coverageConceptFilter[0].value;
    this.activeModal.close(this.coverage);
  }

  deleteCoverage(){
    this.coverage.type = 4;
    if(!this.coverage.create){
      this.coverage.delete = true;
    }
    this.activeModal.close(this.coverage);
  }

}
