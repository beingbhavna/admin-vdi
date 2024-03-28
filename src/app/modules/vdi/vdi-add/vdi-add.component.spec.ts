import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VdiAddComponent } from './vdi-add.component';

describe('VdiAddComponent', () => {
  let component: VdiAddComponent;
  let fixture: ComponentFixture<VdiAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VdiAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VdiAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
