import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  constructor(private snackbar: MatSnackBar) {
  }

  showSnackbar(message: string): void {
    this.snackbar.open(message, 'Close', {
      duration: 2000,
      horizontalPosition: 'right'
    });
  }
}
