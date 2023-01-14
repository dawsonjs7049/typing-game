import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('fadeSlideInOut', [
        transition(':enter', [
            style({ opacity: 0, transform: 'translateY(-30px)' }),
            animate('700ms', style({ opacity: 1, transform: 'translateY(0)' })),
        ]),
        transition(':leave', [
            animate('500ms', style({ opacity: 0, transform: 'translateY(10px)' })),
        ]),
    ])
  ],
})
export class HomeComponent implements OnInit {

  tiltedOn : boolean = false;

  constructor(private router: Router) { }

  ngOnInit(): void {

  }

  goToHistory = () =>
  {
    this.router.navigate(['history']);
  }

  start30 = () =>
  {
    this.router.navigate(['/game/30/' + (this.tiltedOn ? '1' : '0')]);
  }

  start60 = () =>
  {
    this.router.navigate(['/game/60' + (this.tiltedOn ? '1' : '0')]);
  }

  start2 = () =>
  {
    this.router.navigate(['/game/120' + (this.tiltedOn ? '1' : '0')]);
  }

}
