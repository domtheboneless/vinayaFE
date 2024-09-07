import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CoreService } from './core/services/core/core.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'EXPò';
  loading$;

  constructor(private core: CoreService, private cdref: ChangeDetectorRef) {}
  ngOnInit(): void {
    this.core.loading$.subscribe((x) => {
      this.loading$ = x;
      this.cdref.detectChanges();
    });
  }
}
