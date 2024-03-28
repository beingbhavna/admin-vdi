import { TestBed } from '@angular/core/testing';

import { StopUnsaveRedirectionGuard } from './stop-unsave-redirection.guard';

describe('StopUnsaveRedirectionGuard', () => {
  let guard: StopUnsaveRedirectionGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(StopUnsaveRedirectionGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
