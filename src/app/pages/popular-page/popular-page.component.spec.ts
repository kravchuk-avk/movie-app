import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopularPageComponent } from './popular-page.component';

describe('PopularPageComponent', () => {
  let component: PopularPageComponent;
  let fixture: ComponentFixture<PopularPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopularPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PopularPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
