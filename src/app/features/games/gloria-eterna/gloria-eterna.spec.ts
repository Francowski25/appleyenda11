import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GloriaEterna } from './gloria-eterna';

describe('GloriaEterna', () => {
  let component: GloriaEterna;
  let fixture: ComponentFixture<GloriaEterna>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GloriaEterna],
    }).compileComponents();

    fixture = TestBed.createComponent(GloriaEterna);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
