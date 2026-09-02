import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeyendaMisteriosa } from './leyenda-misteriosa';

describe('LeyendaMisteriosa', () => {
  let component: LeyendaMisteriosa;
  let fixture: ComponentFixture<LeyendaMisteriosa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeyendaMisteriosa],
    }).compileComponents();

    fixture = TestBed.createComponent(LeyendaMisteriosa);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
