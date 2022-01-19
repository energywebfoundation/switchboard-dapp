import { updateHistory } from './update-history';

describe('tests for updating history', () => {
  it('should return empty list when list and history are empty', () => {
    expect(updateHistory([], [])).toEqual([]);
  });

  it('should return empty list when history is empty', () => {
    expect(updateHistory([{}, {}] as any, [])).toEqual([]);
  });

  it('should update history depending on list', () => {
    expect(
      updateHistory(
        [{ id: 1, containsRoles: true, containsApps: false }] as any,
        [{ id: 1 }] as any
      )
    ).toEqual([
      {
        id: 1,
        containsRoles: true,
        containsApps: false,
      },
    ] as any);
  });

  it('should update history when list contains elements that do not exist in history', () => {
    expect(
      updateHistory(
        [
          {
            id: 1,
            containsRoles: false,
            containsApps: true,
          },
          { id: 2 },
          { id: 3 },
        ] as any,
        [{ id: 1 }, { id: 2 }] as any
      )
    ).toEqual([
      {
        id: 1,
        containsRoles: false,
        containsApps: true,
      },
      { id: 2, containsApps: false, containsRoles: false },
    ] as any);
  });
});
