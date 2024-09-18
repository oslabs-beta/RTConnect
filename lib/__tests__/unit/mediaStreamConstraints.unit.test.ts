'use strict';
import constraints from '../../src/constants/mediaStreamConstraints';

describe('Check mediaStreamConstraints object', () => {
  const testConstraints = {
    video: {
      width: { min:640, ideal:1920, max:1920 },
      height: { min:480, ideal:1080, max:1080 },
    },
    // audio: true
    audio: {
      echoCancellation: true
    }
  };

  test('Check all constraint values', () => {
    expect(constraints).toMatchObject(testConstraints);
  });
});