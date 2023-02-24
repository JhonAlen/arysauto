import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-number-of-service',
  templateUrl: './number-of-service.component.html',
  styleUrls: ['./number-of-service.component.css']
})
export class NumberOfServiceComponent implements OnInit {

  @Input() public quantity;
  currentUser;
  popup_form: FormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  coverageList: any[] = [];
  serviceList: any[] = [];
  alert = { show : false, type : "", message : "" }

  constructor(public activeModal: NgbActiveModal,
              private modalService: NgbModal,
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      ncantidad: [''],
    });
  }

  onSubmit(form){
    this.submitted = true;
    this.loading = true;

    // this.quantity.cservicio = this.quantity.cservicio;
    // if(form.ncantidad){
    //   this.quantity.ncantidad = form.ncantidad
    // }else{
    //   this.quantity.ncantidad = 0
    // }

    let cantidad = []
    cantidad.push({
      cservicio: this.quantity.cservicio,
      xservicio: this.quantity.xservicio,
      ncantidad: form.ncantidad
    })

    this.quantity = cantidad;
    
    this.activeModal.close(this.quantity);
  }

}
