import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-single-restaurant',
  templateUrl: './single-restaurant.component.html',
  styleUrls: ['./single-restaurant.component.css'],
})
export class SingleRestaurantComponent implements OnInit {
  id;

  constructor(private activeRoute: ActivatedRoute) {}

  ngOnInit() {
    this.id = this.activeRoute.snapshot.params['id'];
    console.log(this.id);
  }
}
