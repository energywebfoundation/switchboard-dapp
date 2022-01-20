interface Element {
  [key: string]: string;
}

export interface SubjectElements {
  bgColor: Element;
  txtColor: Element;
  btnColor: Element;
  listColor: Element;
  txtboxColor: Element;
}

export class ViewColorsSetter {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private params: any) {}

  applyTo(subject): void {
    if (this.params.bgcolor) {
      this.setBgColor(subject, this.params.bgcolor);
    }

    if (this.params.btncolor) {
      this.setBtnColor(subject, this.params.btncolor);
    }

    if (this.params.txtcolor) {
      this.setTextColor(subject, this.params.txtcolor);
    } else {
      this.setTextColor(subject, 'FFFFFF');
    }
  }

  private setTextColor(subject, color): void {
    subject.txtColor.color = `#${color}`;
    subject.listColor.color = `#${color}`;
    subject.btnColor.color = `#${color}`;
  }

  private setBtnColor(subject, color): void {
    subject.btnColor['background-color'] = `#${color}`;
    subject.txtboxColor.color = `#${color}`;
  }

  private setBgColor(subject, color): void {
    subject.bgColor = { 'background-color': `#${color}` };
    subject.listColor['background-color'] = `#${color}`;
  }
}
