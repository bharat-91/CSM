import { TestBed } from '@angular/core/testing';

import { TokenRetriverService } from '../../_core/service/token-retriver.service'

describe('TokenRetriverService', () => {
  let service: TokenRetriverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenRetriverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
