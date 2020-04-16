import { AbstractControl } from '@angular/forms';

export function validateForWhiteSpace(control: AbstractControl): { [key: string]: boolean } {
  const isWhitespace: boolean = (control.value || '').trim().length === 0;
  return !isWhitespace ? null : {'required': true};
}
