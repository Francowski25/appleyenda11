import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotMascot } from './bot-mascot';

describe('BotMascot', () => {
  let component: BotMascot;
  let fixture: ComponentFixture<BotMascot>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotMascot],
    }).compileComponents();

    fixture = TestBed.createComponent(BotMascot);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
