import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProficientDetailComponent } from './proficient-detail.component';

describe('ProficientDetailComponent', () => {
  let component: ProficientDetailComponent;
  let fixture: ComponentFixture<ProficientDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProficientDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProficientDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
