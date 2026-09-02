import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Leyenda11Bingo } from './leyenda11-bingo';

describe('Leyenda11Bingo', () => {
  let component: Leyenda11Bingo;
  let fixture: ComponentFixture<Leyenda11Bingo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Leyenda11Bingo],
    }).compileComponents();

    fixture = TestBed.createComponent(Leyenda11Bingo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
