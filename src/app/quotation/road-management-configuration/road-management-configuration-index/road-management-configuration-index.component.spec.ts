import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoadManagementConfigurationIndexComponent } from './road-management-configuration-index.component';

describe('RoadManagementConfigurationIndexComponent', () => {
  let component: RoadManagementConfigurationIndexComponent;
  let fixture: ComponentFixture<RoadManagementConfigurationIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoadManagementConfigurationIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoadManagementConfigurationIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
