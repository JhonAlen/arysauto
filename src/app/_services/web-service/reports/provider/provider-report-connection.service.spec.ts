import { TestBed } from '@angular/core/testing';

import { ProviderReportConnectionService } from './provider-report-connection.service';

describe('ProviderReportConnectionService', () => {
  let service: ProviderReportConnectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProviderReportConnectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
