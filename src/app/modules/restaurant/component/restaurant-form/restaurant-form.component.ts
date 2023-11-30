import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-restaurant-form',
  templateUrl: './restaurant-form.component.html',
  styleUrls: ['./restaurant-form.component.css'],
})
export class RestaurantFormComponent implements OnInit {
  @Input() currentRestaurant;
  @Output() buttonEmitter: EventEmitter<any> = new EventEmitter();

  restaurantForm: FormGroup;

  constructor(private _fb: FormBuilder) {}

  ngOnInit() {
    this.restaurantForm = this._fb.group({
      username: ['placeholder', Validators.required],
      name: ['', Validators.required],
      address: [''],
      addressNum: [0],
      city: [''],
      description: ['', Validators.required],
      email: [''],
      cell: [0],
      pIva: ['', Validators.required],
      rating: [5],
      status: [true, Validators.required],
      logoUrl: [''],
      coverImg: [''],
    });

    if (this.currentRestaurant) {
      console.log(this.currentRestaurant);

      this.restaurantForm.patchValue({
        username: this.currentRestaurant.profile.username,
        name: this.currentRestaurant.profile.name,
        address: this.currentRestaurant.profile.address,
        addressNum: this.currentRestaurant.profile.addressNum,
        city: this.currentRestaurant.profile.city,
        description: this.currentRestaurant.profile.description,
        email: this.currentRestaurant.profile.email,
        cell: this.currentRestaurant.profile.cell,
        pIva: this.currentRestaurant.profile.pIva,
        rating: this.currentRestaurant.profile.rating,
        status: this.currentRestaurant.profile.status,
        coverImg: this.currentRestaurant.profile.coverImg,
        logoUrl: this.currentRestaurant.profile.logoUrl,
      });
    }
  }

  onSubmit() {
    if (this.restaurantForm.valid && this.restaurantForm.dirty) {
      if (this.currentRestaurant) {
        this.buttonEmitter.emit({
          status: 'submit',
          type: 'edit',
          form: this.restaurantForm,
        });
      } else {
        this.buttonEmitter.emit({
          status: 'submit',
          type: 'new',
          form: this.restaurantForm,
        });
      }
    }
  }

  onCancel() {
    this.buttonEmitter.emit({
      status: 'cancel',
    });
  }
}
