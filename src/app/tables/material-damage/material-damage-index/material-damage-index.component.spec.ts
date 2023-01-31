import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialDamageIndexComponent } from './material-damage-index.component';

describe('MaterialDamageIndexComponent', () => {
  let component: MaterialDamageIndexComponent;
  let fixture: ComponentFixture<MaterialDamageIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialDamageIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialDamageIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
