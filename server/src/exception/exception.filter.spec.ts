import { PrimaryExceptionFilter } from './exception.filter';

describe('ExceptionFilter', () => {
  it('should be defined', () => {
    expect(new PrimaryExceptionFilter()).toBeDefined();
  });
});
