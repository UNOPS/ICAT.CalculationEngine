import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class LocalAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('LocalAuthGuard');
    const apiKeys = ['1234', '56789'];
    const request = context.switchToHttp().getRequest();
    const headerFieldValue = request.headers;
    console.log(headerFieldValue);

    console.log('api-key -----------', request.headers['api-key']);

    console.log(apiKeys);

    return apiKeys.includes(request.headers['api-key']);
  }
}
