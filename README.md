# Switchboard dApp
[![Build Status](https://travis-ci.com/energywebfoundation/switchboard-dapp.svg?token=vNERWfuroqqJygVa7Km9&branch=develop)](https://travis-ci.com/energywebfoundation/switchboard-dapp)


`Switchboard dApp` is a revolutionary decentralized application that allows management of identities, assets, applications, services and access controls with DIDs(Decentralised Identifiers) and VCs(Verifiable Credentials)

##


![Identity Creation](screenshots/switchboard.png)


## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them

```
npm version 6+
nodejs version 10+
```

### Installing

A step by step series of examples that tell you how to get a development env running

Install dependencies:
```
npm install
```

Run the project locally:
```
npm run start
```

Build the project for production:
```
npm run build
```


End with an example of getting some data out of the system or using it for a little demo

## Handling feature flags

To hide functionality that shouldn't be visible on production environment we are using feature flags handled entirely on
frontend side. This is done by flag in environment file named `featureVisible`.
To hide some part of html code you should use directive `appIsFeatureEnabled` which works like `*ngIf` directive.
For example:
```angular2html
<div *appIsFeatureEnabled>
    Displayed or hidden functionality depending on 
    featureVisible property in environment file
</div>
```
To prevent navigating to hidden routes you should use `FeatureToggleGuard` which extends CanActivate interface.
Example:
```angular2html
{
    path: 'path-example', 
    canActivate: [FeatureToggleGuard], 
    component: 'ExampleComponent'
}
```

## Active Maintainers
- Mani H. (@manihagh)
- Kim Honoridez (@kim-energyweb)
- Davy Jones Castillo (@davycastillo)

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## License

This project is licensed under the GNU General Public License v3.0 or later - see the [LICENSE](LICENSE) file for details

## FAQ

Frequently asked questions and their answers will be collected here.
