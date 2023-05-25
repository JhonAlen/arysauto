import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-module',
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.css']
})
export class ModuleComponent implements OnInit {

  @Input() public module;
  popup_form: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;

  constructor(public activeModal: NgbActiveModal,
              private formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      xmodulo: [''],
      xruta: [''],
      bactivo: [true]
    });
    if(this.module){
      if(this.module.type == 3){
        this.canSave = true;
      }else if(this.module.type == 2){
        this.popup_form.get('xmodulo').setValue(this.module.xmodulo);
        this.popup_form.get('xmodulo').disable();
        this.popup_form.get('xruta').setValue(this.module.xruta);
        this.popup_form.get('xruta').disable();
        this.popup_form.get('bactivo').setValue(this.module.bactivo);
        this.popup_form.get('bactivo').disable();
        this.canSave = false;
      }else if(this.module.type == 1){
        this.popup_form.get('xmodulo').setValue(this.module.xmodulo);
        this.popup_form.get('xruta').setValue(this.module.xruta);
        this.popup_form.get('bactivo').setValue(this.module.bactivo);
        this.canSave = true;
        this.isEdit = true;
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
    this.module.xmodulo = form.xmodulo;
    this.module.xruta = form.xruta;
    this.module.bactivo = form.bactivo;
    this.activeModal.close(this.module);
  }

  deleteModule(){
    this.module.type = 4;
    this.activeModal.close(this.module);
  }

}
