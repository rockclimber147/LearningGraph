import { describe, it, expect } from 'vitest';
import { thingThatReturns1 } from '../fileUtils';

describe('pre_deploy', () => {
  it('does thing correctly', () => {
    expect(thingThatReturns1()).toBe(1);
  });
});