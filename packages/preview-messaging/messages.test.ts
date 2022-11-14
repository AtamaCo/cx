import { focusComponent, dispatch } from './messages';

describe('messages', () => {
  describe('dispatch', () => {
    it('calls postMessage on target', async () => {
      const postMessageSpy = jest.spyOn(window, 'postMessage');
      const action = focusComponent('abc');

      dispatch(action, window);

      expect(postMessageSpy.mock.calls).toHaveLength(1);
      expect(postMessageSpy.mock.calls[0][0]).toEqual(action);
    });
  });
});
