import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientDocumentComponent } from './client-document.component';

describe('ClientDocumentComponent', () => {
  let component: ClientDocumentComponent;
  let fixture: ComponentFixture<ClientDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
