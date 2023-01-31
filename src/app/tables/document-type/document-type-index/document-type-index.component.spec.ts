import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentTypeIndexComponent } from './document-type-index.component';

describe('DocumentTypeIndexComponent', () => {
  let component: DocumentTypeIndexComponent;
  let fixture: ComponentFixture<DocumentTypeIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentTypeIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentTypeIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
