import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizFutbol } from './quiz-futbol';

describe('QuizFutbol', () => {
  let component: QuizFutbol;
  let fixture: ComponentFixture<QuizFutbol>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizFutbol],
    }).compileComponents();

    fixture = TestBed.createComponent(QuizFutbol);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
