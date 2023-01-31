import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-quote-by-fleet-extra-coverage',
  templateUrl: './quote-by-fleet-extra-coverage.component.html',
  styleUrls: ['./quote-by-fleet-extra-coverage.component.css']
})
export class QuoteByFleetExtraCoverageComponent implements OnInit {

  @Input() public extraCoverage;
  currentUser;
  popup_form: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  extraCoverageList: any[] = [];
  alert = { show : false, type : "", message : "" }

  constructor(public activeModal: NgbActiveModal,
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      ccoberturaextra: ['', Validators.required]
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania,
        ccliente: this.extraCoverage.ccliente,
        casociado: this.extraCoverage.casociado
      };
      this.http.post(`${environment.apiUrl}/api/valrep/client/extra-coverage`, params, options).subscribe((response : any) => {
        if(response.data.status){
          for(let i = 0; i < response.data.list.length; i++){
            this.extraCoverageList.push({ id: response.data.list[i].ccoberturaextra, value: response.data.list[i].xdescripcion });
          }
          this.extraCoverageList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.EXTRACOVERAGENOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
      if(this.extraCoverage){
        if(this.extraCoverage.type == 3){
          this.canSave = true;
        }else if(this.extraCoverage.type == 2){
          this.popup_form.get('ccoberturaextra').setValue(this.extraCoverage.ccoberturaextra);
          this.popup_form.get('ccoberturaextra').disable();
          this.canSave = false;
        }else if(this.extraCoverage.type == 1){
          this.popup_form.get('ccoberturaextra').setValue(this.extraCoverage.ccoberturaextra);
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
    let extraCoverageFilter = this.extraCoverageList.filter((option) => { return option.id == form.ccoberturaextra; });
    this.extraCoverage.ccoberturaextra = form.ccoberturaextra;
    this.extraCoverage.xcoberturaextra = extraCoverageFilter[0].value;
    this.activeModal.close(this.extraCoverage);
  }

  deleteExtraCoverage(){
    this.extraCoverage.type = 4;
    if(!this.extraCoverage.create){
      this.extraCoverage.delete = true;
    }
    this.activeModal.close(this.extraCoverage);
  }

}
