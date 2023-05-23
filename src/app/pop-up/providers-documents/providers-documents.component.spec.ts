import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvidersDocumentsComponent } from './providers-documents.component';

describe('ProvidersDocumentsComponent', () => {
  let component: ProvidersDocumentsComponent;
  let fixture: ComponentFixture<ProvidersDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProvidersDocumentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProvidersDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
