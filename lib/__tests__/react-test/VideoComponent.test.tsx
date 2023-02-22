/* eslint-disable @typescript-eslint/no-unused-vars */
/** @jest-environment jsdom */

import React from 'react';
import { render, screen } from '@testing-library/react';
import VideoComponent from '../../src/components/VideoComponent';

describe('VideoComponent', () => {
  // const localVideo = null;
  
  const options = { controls: true, style: { width: '640px', height: '360px'}}; 
  const { controls, style } = options;

  it('controls should be true', () => {
    expect(controls).toBe(true);
    expect(style).toStrictEqual({ width: '640px', height: '360px'});
  });

  // it('render video', () => {
  //   const { container } = render(<VideoComponent video = {localVideo} mediaOptions = {options}/>);
  //   expect(container).toMatchSnapshot();
  // });

});

