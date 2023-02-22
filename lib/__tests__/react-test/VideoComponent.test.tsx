/**
 * @jest-environment jsdom
 */

/**
 * @jest-environment jsdom
 */

/* eslint-disable @typescript-eslint/no-unused-vars */


import { render, screen } from '@testing-library/react';
import VideoComponent from '../../src/components/VideoComponent';
import React from 'react';


describe('VideoComponent', () => {
  it('render video components', () => {
    const options = { controls: true, style: { width: '640px', height: '360px'}};
    const { container } = render(<VideoComponent video = {null} mediaOptions = {options}/>);
    expect(options.controls).toBe(true);
  });

});

