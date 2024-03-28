import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VdiEditComponent } from './vdi-edit.component';

describe('VdiEditComponent', () => {
  let component: VdiEditComponent;
  let fixture: ComponentFixture<VdiEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VdiEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VdiEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
