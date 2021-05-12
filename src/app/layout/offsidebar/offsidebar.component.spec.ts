import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OffsidebarComponent } from './offsidebar.component';


xdescribe('OffsidebarComponent', () => {
    let component: OffsidebarComponent;
    let fixture: ComponentFixture<OffsidebarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ OffsidebarComponent ]
        })
          .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(OffsidebarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
