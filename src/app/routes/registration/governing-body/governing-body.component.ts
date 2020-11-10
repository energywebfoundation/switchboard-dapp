import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-governing-body',
  templateUrl: './governing-body.component.html',
  styleUrls: ['./governing-body.component.scss']
})
export class GoverningBodyComponent implements OnInit {

  constructor(
    private authenticationService: AuthService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.authenticationService.setUser(JSON.stringify({ organizationType: params.get('organizationType') })).then(() => {
        this.router.navigate(['/']).then(() => {
        });
      });
    });

  }

}
