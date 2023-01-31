import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationClausesComponent } from './configuration-clauses.component';

describe('ConfigurationClausesComponent', () => {
  let component: ConfigurationClausesComponent;
  let fixture: ComponentFixture<ConfigurationClausesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurationClausesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationClausesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
