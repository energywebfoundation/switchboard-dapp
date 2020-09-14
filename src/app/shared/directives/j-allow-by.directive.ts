import { Directive, ElementRef, OnInit, Input } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { intersection } from 'lodash';

@Directive({
  selector: '[FHAllowBy]'
})
export class JAllowByDirective implements OnInit {

  @Input('FHAllowBy') roles: Array<string>;

  constructor(private el: ElementRef, private authService: AuthService) {}

  ngOnInit(): void {
    // console.log("1." + this.authService.getRoles());
    // console.log("2." + this.roles);
    // console.log(intersection(this.authService.getRoles(),this.roles));
    if(this.roles && this.roles.length > 0  && intersection(this.authService.getRoles(),this.roles).length == 0){
      this.el.nativeElement.remove();
    }
    
    
    
  
  }

}
