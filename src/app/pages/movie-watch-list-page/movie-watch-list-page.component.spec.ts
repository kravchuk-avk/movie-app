import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieWatchListPageComponent } from './movie-watch-list-page.component';

describe('MovieWatchListPageComponent', () => {
  let component: MovieWatchListPageComponent;
  let fixture: ComponentFixture<MovieWatchListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieWatchListPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MovieWatchListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
