import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleRestaurantComponent } from './single-restaurant.component';

describe('SingleRestaurantComponent', () => {
  let component: SingleRestaurantComponent;
  let fixture: ComponentFixture<SingleRestaurantComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SingleRestaurantComponent]
    });
    fixture = TestBed.createComponent(SingleRestaurantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
