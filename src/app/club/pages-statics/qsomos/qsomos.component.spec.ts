import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QsomosComponent } from './qsomos.component';

describe('QsomosComponent', () => {
  let component: QsomosComponent;
  let fixture: ComponentFixture<QsomosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QsomosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QsomosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
