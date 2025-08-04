import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CylinderCard } from './cylinder-card';

describe('CylinderCard', () => {
  let component: CylinderCard;
  let fixture: ComponentFixture<CylinderCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CylinderCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CylinderCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
