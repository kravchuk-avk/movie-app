import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { DurationPipe } from '../../pipe/duration/duration.pipe'

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, MovieCardComponent, DurationPipe],
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.scss'
})
export class MovieListComponent {

  movies = [
    {
      image: "https://is1-ssl.mzstatic.com/image/thumb/PMcGyfR9w1JdYpgfuH_Waw/1679x945sr.webp",
      id: 653346,
      overview: "In the 1950s, Elizabeth Zott’s dream of being a scientist is challenged by a society that says women belong in the domestic sphere. She accepts a job on a TV cooking show and sets out to teach a nation of overlooked housewives way more than recipes.",
      release: "2023",
      title: "Lessons in Chemistry",
      duration: 5400,
      rating: 8.5
    },
    {
      image: "https://is1-ssl.mzstatic.com/image/thumb/bYeZOr1ocJJzVk9CdQbH0Q/1679x945sr.webp",
      id: 653347,
      overview: "A horrific murder upends the Chicago Prosecuting Attorney’s Office when one of its own is suspected of the crime—leaving the accused fighting to keep his family together.",
      release: "2024",
      title: "Presumed Innocent",
      duration: 5400,
      rating: 9.0
    },
    {
      image: "https://is1-ssl.mzstatic.com/image/thumb/2OIEI5IAQ9WB-2Q9VrTQtw/1679x945sr.webp",
      id: 653348,
      overview: "Forced to flee her underground sanctuary for Earth’s surface, Eva discovers a world unlike anything she expected. As she journeys across perilous terrain and unknown civilizations, Eva searches to answer the ultimate question: Is she the last human?",
      release: "2024",
      title: "WondLa",
      duration: 5400,
      rating: 8.3
    },
    {
      image: "https://is1-ssl.mzstatic.com/image/thumb/IqcQoc9JGJG0LWUrSXCVwQ/1679x945sr.webp",
      id: 653348,
      overview: "2021 Oscar® nominee. In a thrilling WWII story inspired by actual events, Captain Ernest Krause (Tom Hanks) leads an international convoy of 37 ships on a treacherous mission across the Atlantic to deliver soldiers and supplies to Allied forces.",
      release: "2020",
      title: "Greyhound",
      duration: 5400,
      rating: 8.3
    }
  ];


  favorites: any[] = [];
  watchList: any[] = [];

  public isInList(list: any[], movie: any): boolean {
    return list.some(item => item.id === movie.id);
  }

  private toggleMovieInList(list: any[], movie: any): void {
    const index = list.findIndex(item => item.id === movie.id);
    if (index === -1) {
      list.push(movie);
    } else {
      list.splice(index, 1);
    }
  }

  handleAddFavorites(movie: any) {
    this.toggleMovieInList(this.favorites, movie);
  }

  handleAddWatchList(movie: any) {
    this.toggleMovieInList(this.watchList, movie);
  }
}

