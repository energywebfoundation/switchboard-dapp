# EWF SSI/IAM Stack architecture

## EWF SSI/IAM Stack Context Diagram

Below is a [C4 context](https://c4model.com/#ContextDiagram) diagram of the EWF SSI/IAM stack.
An objective of EWF IAM stack is that it can be used interoperably with parties using other SSI Wallets and Agents.
Both SSI systems can trust EWF's SSI Governance (Switchboard Org/Apps/Roles).

![ewf-ssi-context](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.githubusercontent.com/energywebfoundation/switchboard-dapp/add-architecture-diagram/diagrams/ewf-ssi.context.plantuml)

## EWF SSI/IAM Stack Container Diagram

Below is a [C4 container](https://c4model.com/#ContainerDiagram) diagram of the EWF SSI/IAM stack.
This diagram expresses that the EWF IAM stack is composed of an SSI Agent layer and a UI layer.
For an introduction in the layering concept for SSI, see the [DIF FAQ](https://identity.foundation/faq/#how-is-this-faq-structured).

The SSI Agent layer is currently spread across:
- [iam-cache-server](https://github.com/energywebfoundation/iam-cache-server)
- [ssi-server](https://github.com/energywebfoundation/ssi)

EWF currently offers [Switchboard](https://github.com/energywebfoundation/switchboard-dapp) as a Wallet UI layer.

![ewf-iam-stack](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.githubusercontent.com/energywebfoundation/switchboard-dapp/add-architecture-diagram/diagrams/ewf-ssi.container.plantuml)

## EWF IAM Stack Component Diagram