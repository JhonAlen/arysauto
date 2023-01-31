import { TestBed } from '@angular/core/testing';

import { CssGeneratorService } from './css-generator.service';

describe('CssGeneratorService', () => {
  let service: CssGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CssGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
