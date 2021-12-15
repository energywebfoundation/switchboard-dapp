import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent {
  terms = [
    {text: 'Minimum Patron commitment (#of months, minimum and maximum)'},
    {text: 'Patron revenue share (% of total EWT earned by Provider)'},
    {text: 'Minimum EWT amount'},
    {text: 'Maximum EWT amount'},
    {
      text: 'Other specific requirements defined by Providers or dSLA',
      subList: [
        {text: 'location of the Patron (“Non-US Resident”) accredited investors only'},
        {text: 'accredited investors only'},
        {text: 'others...'}
      ]
    }
  ];
  summary = [
    {
      title: 'Account Balance',
      value: '2222.2222 EWT'
    },
    {
      title: 'Active Services',
      value: '1'
    }, {
      title: 'Number of Nodes',
      value: '1'
    },
  ];

  acceptingPatrons = true;
  provider = 'Energy Web Foundation';
  logo = '../assets/img/ew-flex-single-logo.png';
  description = '    Energy Web (EW) is a global nonprofit organization accelerating a low-carbon, customer-centric electricity system by\n' +
    '    unleashing the potential of open-source, decentralized technologies. EW focuses on building core infrastructure and\n' +
    '    shared technology, speeding adoption of commercial solutions, and fostering a community\n' +
    '    of practice.\n' +
    '\n' +
    '    In 2019 EW launched the Energy Web Chain, the world’s first open-source, enterprise blockchain platform tailored to\n' +
    '    the energy sector. EW’s technology roadmap has since grown into the Energy Web Decentralized Operating System\n' +
    '    (EW-DOS), a full stack that includes front-end applications and a variety of software development toolkits. EW also\n' +
    '    grew the world’s largest energy-sector ecosystem—comprising utilities, grid operators, renewable energy developers,\n' +
    '    corporate energy buyers, and others—focused on open-source, decentralized digital technologies.\n';

  constructor(private router: Router) {
  }

  goToEnrolment() {
    this.router.navigate(['stake', 1, 'enrolment']);
  }

}
