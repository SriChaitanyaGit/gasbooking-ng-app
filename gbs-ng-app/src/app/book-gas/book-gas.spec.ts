import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookGas } from './book-gas';

describe('BookGas', () => {
  let component: BookGas;
  let fixture: ComponentFixture<BookGas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookGas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookGas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
