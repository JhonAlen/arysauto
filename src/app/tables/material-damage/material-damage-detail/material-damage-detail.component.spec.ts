import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialDamageDetailComponent } from './material-damage-detail.component';

describe('MaterialDamageDetailComponent', () => {
  let component: MaterialDamageDetailComponent;
  let fixture: ComponentFixture<MaterialDamageDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialDamageDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialDamageDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
