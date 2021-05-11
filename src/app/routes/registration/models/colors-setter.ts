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

export class ColorsSetter {
  private colors;
  constructor(public params: any, public defaultColors: any) {
    this.colors = {...defaultColors, ...params};
  }

  applyTo(subject: SubjectElements) {
    if (this.params.bgcolor) {
      this.setBgColor(subject, this.params.bgcolor);
    } else if (this.defaultColors && this.defaultColors.bgcolor) {
      this.setBgColor(subject, this.defaultColors.bgcolor);
    }

    if (this.params.btncolor) {
      this.setBtnColor(subject, this.params.btncolor);
    } else if (this.defaultColors && this.defaultColors.btncolor) {
      this.setBtnColor(subject, this.defaultColors.btncolor);
    }

    if (this.params.txtcolor) {
      this.setTextColor(subject, this.params.txtcolor);
    } else if (this.defaultColors && this.defaultColors.txtcolor) {
      this.setTextColor(subject, this.defaultColors.txtcolor);
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
