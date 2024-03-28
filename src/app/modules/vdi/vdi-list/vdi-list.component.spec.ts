import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VdiListComponent } from './vdi-list.component';

describe('VdiListComponent', () => {
  let component: VdiListComponent;
  let fixture: ComponentFixture<VdiListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VdiListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VdiListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
