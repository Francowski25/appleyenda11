import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnceIdeal } from './once-ideal';

describe('OnceIdeal', () => {
  let component: OnceIdeal;
  let fixture: ComponentFixture<OnceIdeal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnceIdeal],
    }).compileComponents();

    fixture = TestBed.createComponent(OnceIdeal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
