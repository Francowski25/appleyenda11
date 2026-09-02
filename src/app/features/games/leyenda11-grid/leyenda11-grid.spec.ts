import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Leyenda11Grid } from './leyenda11-grid';

describe('Leyenda11Grid', () => {
  let component: Leyenda11Grid;
  let fixture: ComponentFixture<Leyenda11Grid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Leyenda11Grid],
    }).compileComponents();

    fixture = TestBed.createComponent(Leyenda11Grid);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
