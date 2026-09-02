import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Leyenda11Staddle } from './leyenda11-staddle';

describe('Leyenda11Staddle', () => {
  let component: Leyenda11Staddle;
  let fixture: ComponentFixture<Leyenda11Staddle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Leyenda11Staddle],
    }).compileComponents();

    fixture = TestBed.createComponent(Leyenda11Staddle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
