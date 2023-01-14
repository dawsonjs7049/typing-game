import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';


@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
  animations: [
    trigger('fadeSlideInOut', [
        transition(':enter', [
            style({ opacity: 0, transform: 'translateY(20px)' }),
            animate('600ms', style({ opacity: 1, transform: 'translateY(0)' })),
        ]),
        transition(':leave', [
            animate('500ms', style({ opacity: 0, transform: 'translateY(10px)' })),
        ]),
    ])
  ],
})
export class HistoryComponent implements OnInit {

  records: any = [];

  constructor(private router: Router) { }

  ngOnInit(): void {
    let localRecords = localStorage.getItem('tilted-scores');
    
    if(localRecords)
    {
      this.records = JSON.parse(localRecords);
    }
  }

  home()
  {
    this.router.navigate(['home']);
  }

}
