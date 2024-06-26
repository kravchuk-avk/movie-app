// import { AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, Component, DoCheck, OnChanges, OnDestroy, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
// import { MovieCardComponent } from './components/movie-card/movie-card.component';


// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [RouterOutlet, MovieCardComponent],
//   templateUrl: './app.component.html',
//   styleUrl: './app.component.scss'
// })
// export class AppComponent implements OnChanges, OnInit, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked, OnDestroy {
//   // title = 'first';


//   movie = {
//     image: "https://is1-ssl.mzstatic.com/image/thumb/PMcGyfR9w1JdYpgfuH_Waw/1679x945sr.webp",
//     id: 653346,
//     overview: "In the 1950s, Elizabeth Zott’s dream of being a scientist is challenged by a society that says women belong in the domestic sphere. She accepts a job on a TV cooking show and sets out to teach a nation of overlooked housewives way more than recipes.",
//     release: "2023",
//     title: "Lessons in Chemistry",
//     rating: 8.5
//     };

//     handleAddFavorites() {
//       console.log('handleAddFavorites');
//     }

//     handleAddWatchList() {
//       console.log('handleAddWatchList');
//     }

//   constructor() {
//     console.log("constructor");
//   }

//   ngOnChanges(change: SimpleChanges): void {
//     console.log("ngOnChanges");
//   }

//   ngOnInit(): void {
//     console.log("ngOnInit");
//   }

//   ngDoCheck(): void {
//     console.log("ngDoCheck");
//   }

//   ngAfterContentInit(): void {
//     console.log("ngAfterContentInit");
//   }

//   ngAfterContentChecked(): void {
//     console.log("ngAfterContentChecked");
//   }

//   ngAfterViewInit(): void {
//     console.log("ngAfterViewInit");
//   }

//   ngAfterViewChecked(): void {
//     console.log("ngAfterViewChecked");
//   }

//   ngOnDestroy(): void {
//     console.log("ngOnDestroy");
//   }
// }



import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MovieListComponent } from './components/movie-list/movie-list.component'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MovieListComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {}
