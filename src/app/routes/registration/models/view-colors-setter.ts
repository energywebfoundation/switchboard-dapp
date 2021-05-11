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
  constructor(private params: any) {
  }

  applyTo(subject: SubjectElements) {
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

  private setTextColor(subject, color) {
    subject.txtColor.color = `#${color}`;
    subject.listColor.color = `#${color}`;
    subject.btnColor.color = `#${color}`;
  }

  private setBtnColor(subject, color) {
    subject.btnColor['background-color'] = `#${color}`;
    subject.txtboxColor.color = `#${color}`;
  }

  private setBgColor(subject, color) {
    subject.bgColor = { 'background-color': `#${color}` };
    subject.listColor['background-color'] = `#${color}`;
  }

}
