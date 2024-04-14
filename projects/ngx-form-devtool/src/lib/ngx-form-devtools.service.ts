import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NgxFormDevtoolService {
  constructor() {}
}
export function Required(target: object, propertyKey: string) {
  console.log(target);
  console.log(propertyKey);
  Object.defineProperty(target, propertyKey, {
    get() {
      throw new Error(`Attribute ${propertyKey} is required`);
    },
    set(value) {
      Object.defineProperty(target, propertyKey, {
        value,
        writable: true,
        configurable: true,
      });
    },
    configurable: true,
  });
}
