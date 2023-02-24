import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberOfServiceComponent } from './number-of-service.component';

describe('NumberOfServiceComponent', () => {
  let component: NumberOfServiceComponent;
  let fixture: ComponentFixture<NumberOfServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NumberOfServiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NumberOfServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
