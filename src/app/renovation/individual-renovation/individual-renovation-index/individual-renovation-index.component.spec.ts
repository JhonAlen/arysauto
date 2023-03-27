import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualRenovationIndexComponent } from './individual-renovation-index.component';

describe('IndividualRenovationIndexComponent', () => {
  let component: IndividualRenovationIndexComponent;
  let fixture: ComponentFixture<IndividualRenovationIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndividualRenovationIndexComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndividualRenovationIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
