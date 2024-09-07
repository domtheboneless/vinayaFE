import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckOrderDialogComponent } from './check-order-dialog.component';

describe('CheckOrderDialogComponent', () => {
  let component: CheckOrderDialogComponent;
  let fixture: ComponentFixture<CheckOrderDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CheckOrderDialogComponent]
    });
    fixture = TestBed.createComponent(CheckOrderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
