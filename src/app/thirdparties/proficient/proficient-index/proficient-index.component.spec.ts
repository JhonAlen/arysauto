import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProficientIndexComponent } from './proficient-index.component';

describe('ProficientIndexComponent', () => {
  let component: ProficientIndexComponent;
  let fixture: ComponentFixture<ProficientIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProficientIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProficientIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
