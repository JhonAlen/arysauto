import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-plan-valuation-exceso',
  templateUrl: './plan-valuation-exceso.component.html',
  styleUrls: ['./plan-valuation-exceso.component.css']
})
export class PlanValuationExcesoComponent implements OnInit {

  @Input() public exceso;
  currentUser;
  popup_form: FormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  valuationList: any[] = [];
  alert = { show : false, type : "", message : "" }

  constructor(public activeModal: NgbActiveModal,
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      ms_defensa_penal: [''],
      mp_defensa_penal: [''],
      ms_exceso_limite: [''],
      mp_exceso_limite: [''],
    });
  }

  onSubmit(form){
    this.submitted = true;
    this.loading = true;

    this.valuationList.push({
      cplan: this.exceso.cplan,
      ctarifa: this.exceso.ctarifa,
      ms_defensa_penal: this.popup_form.get('ms_defensa_penal').value,
      mp_defensa_penal: this.popup_form.get('mp_defensa_penal').value,
      ms_exceso_limite: this.popup_form.get('ms_exceso_limite').value,
      mp_exceso_limite: this.popup_form.get('mp_exceso_limite').value,
    });

    this.exceso = this.valuationList;

    this.activeModal.close(this.exceso);
  }
}
