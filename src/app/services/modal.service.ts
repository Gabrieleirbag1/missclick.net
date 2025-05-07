import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

interface ModalOptions {
  message: string;
}

interface ModalState extends ModalOptions {
  isVisible: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modalState = new Subject<ModalState>();
  modalState$ = this.modalState.asObservable();

  constructor() {}

  open(options: ModalOptions): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.modalState.next({
        isVisible: true,
        message: options.message,
      });

      const confirmSub = this.confirm$.subscribe(() => {
        resolve(true);
        confirmSub.unsubscribe();
        cancelSub.unsubscribe();
      });

      const cancelSub = this.cancel$.subscribe(() => {
        resolve(false);
        confirmSub.unsubscribe();
        cancelSub.unsubscribe();
      });
    });
  }

  private confirm = new Subject<void>();
  confirm$ = this.confirm.asObservable();

  private cancel = new Subject<void>();
  cancel$ = this.cancel.asObservable();

  confirmAction() {
    this.confirm.next();
    this.close();
  }

  cancelAction() {
    this.cancel.next();
    this.close();
  }

  close() {
    this.modalState.next({
      isVisible: false,
      message: '',
    });
  }
}
