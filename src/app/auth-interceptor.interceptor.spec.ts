import { TestBed } from '@angular/core/testing';

import { AuthInterceptoprInterceptor } from './auth-interceptor.interceptor';

describe('AuthInterceptoprInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      AuthInterceptoprInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: AuthInterceptoprInterceptor = TestBed.inject(AuthInterceptoprInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
