import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionIndexComponent } from './version-index.component';

describe('VersionIndexComponent', () => {
  let component: VersionIndexComponent;
  let fixture: ComponentFixture<VersionIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VersionIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VersionIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
