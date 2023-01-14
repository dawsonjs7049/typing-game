import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
  animations: [
    trigger('fadeSlideInOut', [
        transition(':enter', [
            style({ opacity: 0, transform: 'translateY(10px)' }),
            animate('500ms', style({ opacity: 1, transform: 'translateY(0)' })),
        ]),
        transition(':leave', [
            animate('500ms', style({ opacity: 0, transform: 'translateY(10px)' })),
        ]),
    ])
],
})
export class GameComponent implements OnInit {

  time : any = 30;
  tiltedOn : boolean = false;
  quote : any = { content: 'test', author: 'test author' };
  countdown : any;
  countdown_time : any;
  show_results_row : boolean = false;
  typing_enabled : boolean = true;
  current_wpm : number = 0;
  final_wpm : number = 0;
  quote_input : string = '';
  last_input : string = '';
  total_words : number = 0;
  sound_effects : any = ['bruh-sound', 'oh-no-sound', 'you-serious-sound'];

  @ViewChild('quoteContainer') quoteContainer!: ElementRef;

  constructor(private router: Router, private route: ActivatedRoute, private api: ApiService, private renderer: Renderer2) { }

  ngOnInit(): void {
    this.time = this.route.snapshot.paramMap.get('time');
    this.tiltedOn = (this.route.snapshot.paramMap.get('tiltOn') == '1' ? true : false);
  }

  ngAfterViewInit(): void {
    this.startGame();
  }

  getQuote()
  {
    // empty container first
    this.renderer.setProperty(this.quoteContainer.nativeElement, 'innerHTML', "");

    this.api.getQuote().subscribe(response => { 
      this.quote = response; 

      this.quote.content.split("").forEach((word: string) => {
          let span: HTMLSpanElement = this.renderer.createElement('span');
          span.innerHTML = word;
          this.renderer.appendChild(this.quoteContainer.nativeElement, span);
      });
    })

  }

  async startGame()
  {
    // reset everything in-case user is retrying
    this.show_results_row = false;
    this.total_words = 0;
    this.typing_enabled = true;
    this.current_wpm = 0;
    this.quote_input = "";

    // get a quote
    this.getQuote();

    // set initial countdown time
    this.countdown_time = this.time;

    this.countdown = setInterval(() => {
      // every second we decrement the time shown
      this.countdown_time -= 1;

      if(this.countdown_time == 0)
      {
        // game is over
        this.typing_enabled = false;

        // compare current quote to what user currently has typed, add correctly typed words to count and calc final wpm
        let input = this.quote_input.split(" ");
        this.quote.content.split(" ").forEach((word:string, index:number) => {
          if(word == input[index])
          {
            // input word matches word in original quote, add to word_count
            this.total_words += 1;
          }
        });

        this.final_wpm = (this.total_words * 60) / this.time;
        
        // show results row
        this.show_results_row = true;

        // store result in local storage
        this.storeScore();

        window.clearInterval(this.countdown);
      }
    }, 1000);

  }

  storeScore()
  {
    let scores = localStorage.getItem("tilted-scores");
    let arr;

    if(scores)
    {
      // we have prior scores
      arr = JSON.parse(scores);

      // store new score
      arr.push({ score: this.final_wpm, date: new Date().getTime() });
      
      // only want to store top 10 scores - sort by best, return top 10
      arr.sort((recordA:any, recordB:any) => recordB.score - recordA.score);
      arr = arr.slice(0, 10);
    }
    else
    {
      // no prior scores stored
      arr = [{ score: this.final_wpm, date: new Date().getTime() }];
    }

    localStorage.setItem('tilted-scores', JSON.stringify(arr));
  }

  checkInput(input: any)
  {
    let spanArr = document.querySelectorAll('span');
    let quoteArr = input.split("");
    let correct = true;

    spanArr.forEach((spanCharacter, index) => {
      const character = quoteArr[index];

      switch(character) {
        case null || undefined:
          spanCharacter.classList.remove("correct");
          spanCharacter.classList.remove("incorrect");

          break;
        case spanCharacter.innerText:
          spanCharacter.classList.add("correct");
          spanCharacter.classList.remove("incorrect");

          break;
        default:
          spanCharacter.classList.add("incorrect");
          spanCharacter.classList.remove("correct");

          correct = false;
      }
    });

    if(correct && (this.quote.content == input) )
    {
      // correctly typed the quote, add total words to running count
      this.total_words += this.quote.content.split(" ").length;
      this.current_wpm = Number(((this.total_words * 60) / (this.time - this.countdown_time)).toFixed(0));

      this.quote_input = "";

      // go to next quote
      this.getQuote();
    }
    else if(!correct && this.tiltedOn)
    {
      // play sound effect (only when user is activly typing - not deleting characters?)
      if(input.length > this.last_input.length)
      {
        this.playAudio();
      }
    }

    this.last_input = input;
  }

  playAudio()
  {
    // random number of 0 - 2 (inclusive)
    let rand = Math.floor(Math.random() * 3);
    let audio = new Audio();
    
    audio.src = "../../../assets/" + this.sound_effects[rand] + ".mp3";
    audio.load();
    audio.play();
  }

  retry() 
  {
    this.startGame();
  }

  history()
  {
    this.router.navigate(['history']);
  }

  home()
  {
    this.router.navigate(['home']);
  }

}
