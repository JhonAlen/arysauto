import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TakersIndexComponent } from './takers-index.component';

describe('TakersIndexComponent', () => {
  let component: TakersIndexComponent;
  let fixture: ComponentFixture<TakersIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TakersIndexComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TakersIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
