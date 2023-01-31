import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationProcessDetailComponent } from './configuration-process-detail.component';

describe('ConfigurationProcessDetailComponent', () => {
  let component: ConfigurationProcessDetailComponent;
  let fixture: ComponentFixture<ConfigurationProcessDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurationProcessDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationProcessDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
