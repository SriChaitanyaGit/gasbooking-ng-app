import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDelivery } from './update-delivery';

describe('UpdateDelivery', () => {
  let component: UpdateDelivery;
  let fixture: ComponentFixture<UpdateDelivery>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateDelivery]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateDelivery);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
