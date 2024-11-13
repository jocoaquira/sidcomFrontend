import { TestBed } from '@angular/core/testing';

import { InterceptorAuthInterceptor } from './interceptor-auth.interceptor';

describe('InterceptorAuthInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      InterceptorAuthInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: InterceptorAuthInterceptor = TestBed.inject(InterceptorAuthInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
