import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-plan-amount-rcv',
  templateUrl: './plan-amount-rcv.component.html',
  styleUrls: ['./plan-amount-rcv.component.css']
})
export class PlanAmountRcvComponent implements OnInit {

  @Input() public rcv;
  currentUser;
  popup_form: FormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  coverageList: any[] = [];
  alert = { show : false, type : "", message : "" }

  constructor(public activeModal: NgbActiveModal,
              private modalService: NgbModal,
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      msuma_dc: [''],
      msuma_personas: [''],
      msuma_exceso: [''],
      msuma_dp: [''],
      msuma_muerte: [''],
      msuma_invalidez: [''],
      msuma_gm: [''],
      msuma_gf: ['']
    });
    this.canSave = true;
  }

  onSubmit(form){
    this.submitted = true;
    this.loading = true;

    if(form.msuma_dc){
      this.rcv.msuma_dc = form.msuma_dc
    }else{
      this.rcv.msuma_dc = 0
    }

    if(form.msuma_personas){
      this.rcv.msuma_personas = form.msuma_personas
    }else{
      this.rcv.msuma_personas = 0
    }

    if(form.msuma_exceso){
      this.rcv.msuma_exceso = form.msuma_exceso
    }else{
      this.rcv.msuma_exceso = 0
    }

    if(form.msuma_dp){
      this.rcv.msuma_dp = form.msuma_dp
    }else{
      this.rcv.msuma_dp = 0
    }

    if(form.msuma_muerte){
      this.rcv.msuma_muerte = form.msuma_muerte
    }else{
      this.rcv.msuma_muerte = 0
    }

    if(form.msuma_invalidez){
      this.rcv.msuma_invalidez = form.msuma_invalidez
    }else{
      this.rcv.msuma_invalidez = 0
    }

    if(form.msuma_gm){
      this.rcv.msuma_gm = form.msuma_gm
    }else{
      this.rcv.msuma_gm = 0
    }

    if(form.msuma_gf){
      this.rcv.msuma_gf = form.msuma_gf
    }else{
      this.rcv.msuma_msuma_gfgm = 0
    }
    
    this.activeModal.close(this.rcv);
  }
}