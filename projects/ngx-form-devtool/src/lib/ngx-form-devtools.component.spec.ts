import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxFormDevtool } from './ngx-form-devtools.component';

describe('NgxFormDevtool', () => {
  let component: NgxFormDevtool;
  let fixture: ComponentFixture<NgxFormDevtool>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxFormDevtool],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxFormDevtool);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
