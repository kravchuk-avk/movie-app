import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopRatePageComponent } from './top-rate-page.component';

describe('TopRatePageComponent', () => {
  let component: TopRatePageComponent;
  let fixture: ComponentFixture<TopRatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopRatePageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TopRatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
