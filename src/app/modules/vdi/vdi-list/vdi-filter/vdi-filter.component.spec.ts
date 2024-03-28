import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VdiFilterComponent } from './vdi-filter.component';

describe('VdiFilterComponent', () => {
  let component: VdiFilterComponent;
  let fixture: ComponentFixture<VdiFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VdiFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VdiFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
