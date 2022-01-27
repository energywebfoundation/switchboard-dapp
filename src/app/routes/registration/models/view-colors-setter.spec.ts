import { SubjectElements, ViewColorsSetter } from './view-colors-setter';

describe('ViewColorsSetter', () => {
  let subject: SubjectElements;

  beforeEach(() => {
    subject = {
      bgColor: {},
      txtColor: {},
      btnColor: {},
      listColor: {},
      txtboxColor: {},
    };
  });

  it('should create an instance', () => {
    expect(new ViewColorsSetter({})).toBeTruthy();
  });

  it('should set background color to background and list', () => {
    const color = 'fafafa';
    const viewColorsSetter = new ViewColorsSetter({ bgcolor: color });
    viewColorsSetter.applyTo(subject);

    expect(subject.bgColor).toEqual(
      jasmine.objectContaining({ 'background-color': `#${color}` })
    );
    expect(subject.listColor).toEqual(
      jasmine.objectContaining({ 'background-color': `#${color}` })
    );
    expect(subject.txtboxColor).toEqual({});
  });

  it('should set color white to text as default', () => {
    const color = 'FFFFFF';
    const viewColorsSetter = new ViewColorsSetter({});
    viewColorsSetter.applyTo(subject);

    expect(subject.txtColor).toEqual(
      jasmine.objectContaining({ color: `#${color}` })
    );
    expect(subject.listColor).toEqual(
      jasmine.objectContaining({ color: `#${color}` })
    );
    expect(subject.btnColor).toEqual(
      jasmine.objectContaining({ color: `#${color}` })
    );
  });
});
