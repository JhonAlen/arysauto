import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualRenovationDetailComponent } from './individual-renovation-detail.component';

describe('IndividualRenovationDetailComponent', () => {
  let component: IndividualRenovationDetailComponent;
  let fixture: ComponentFixture<IndividualRenovationDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndividualRenovationDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndividualRenovationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
