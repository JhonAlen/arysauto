import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerDocumentComponent } from './owner-document.component';

describe('OwnerDocumentComponent', () => {
  let component: OwnerDocumentComponent;
  let fixture: ComponentFixture<OwnerDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnerDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnerDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
