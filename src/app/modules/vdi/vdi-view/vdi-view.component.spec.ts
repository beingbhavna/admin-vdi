import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VdiViewComponent } from './vdi-view.component';

describe('VdiViewComponent', () => {
  let component: VdiViewComponent;
  let fixture: ComponentFixture<VdiViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VdiViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VdiViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
