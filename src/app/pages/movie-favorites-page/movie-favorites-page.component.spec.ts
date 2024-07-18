import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieFavoritesPageComponent } from './movie-favorites-page.component';

describe('MovieFavoritesPageComponent', () => {
  let component: MovieFavoritesPageComponent;
  let fixture: ComponentFixture<MovieFavoritesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieFavoritesPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MovieFavoritesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
