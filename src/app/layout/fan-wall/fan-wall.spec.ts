import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FanWall } from './fan-wall';

describe('FanWall', () => {
  let component: FanWall;
  let fixture: ComponentFixture<FanWall>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FanWall],
    }).compileComponents();

    fixture = TestBed.createComponent(FanWall);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
