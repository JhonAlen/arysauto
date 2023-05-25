import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '@environments/environment';

@Component({
  selector: 'app-club-menu-sub-menu',
  templateUrl: './club-menu-sub-menu.component.html',
  styleUrls: ['./club-menu-sub-menu.component.css']
})
export class ClubMenuSubMenuComponent implements OnInit {

  @Input() public subMenu;
  popup_form: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  alert = { show : false, type : "", message : "" }

  constructor(public activeModal: NgbActiveModal,
              private http: HttpClient,
              private formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      xsubmenuclub: [''],
      xcomponente: [''],
      xcontenido: [''],
      bactivo: [true]
    });
    if(this.subMenu){
      if(this.subMenu.type == 3){
        this.canSave = true;
      }else if(this.subMenu.type == 2){
        this.popup_form.get('xsubmenuclub').setValue(this.subMenu.xsubmenuclub);
        this.popup_form.get('xsubmenuclub').disable();
        this.popup_form.get('xcomponente').setValue(this.subMenu.xcomponente);
        this.popup_form.get('xcomponente').disable();
        this.popup_form.get('xcontenido').setValue(this.subMenu.xcontenido);
        this.popup_form.get('xcontenido').disable();
        this.popup_form.get('bactivo').setValue(this.subMenu.bactivo);
        this.popup_form.get('bactivo').disable();
        this.canSave = false;
      }else if(this.subMenu.type == 1){
        this.popup_form.get('xsubmenuclub').setValue(this.subMenu.xsubmenuclub);
        this.popup_form.get('xcomponente').setValue(this.subMenu.xcomponente);
        this.popup_form.get('xcontenido').setValue(this.subMenu.xcontenido);
        this.popup_form.get('bactivo').setValue(this.subMenu.bactivo);
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
    this.subMenu.xsubmenuclub = form.xsubmenuclub;
    this.subMenu.xcomponente = form.xcomponente;
    this.subMenu.xcontenido = form.xcontenido;
    this.subMenu.bactivo = form.bactivo;
    this.activeModal.close(this.subMenu);
  }

  deleteSubMenu(){
    this.subMenu.type = 4;
    if(!this.subMenu.create){
      this.subMenu.delete = true;
    }
    this.activeModal.close(this.subMenu);
  }

}
