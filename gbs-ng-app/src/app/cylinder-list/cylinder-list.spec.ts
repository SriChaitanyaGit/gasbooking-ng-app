import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CylinderList } from './cylinder-list';

describe('CylinderList', () => {
  let component: CylinderList;
  let fixture: ComponentFixture<CylinderList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CylinderList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CylinderList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
