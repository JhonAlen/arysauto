import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporativeIssuanceComponent } from './corporative-issuance.component';

describe('CorporativeIssuanceComponent', () => {
  let component: CorporativeIssuanceComponent;
  let fixture: ComponentFixture<CorporativeIssuanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorporativeIssuanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CorporativeIssuanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
