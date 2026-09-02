import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Leyenda11Top10 } from './leyenda11-top10';

describe('Leyenda11Top10', () => {
  let component: Leyenda11Top10;
  let fixture: ComponentFixture<Leyenda11Top10>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Leyenda11Top10],
    }).compileComponents();

    fixture = TestBed.createComponent(Leyenda11Top10);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
