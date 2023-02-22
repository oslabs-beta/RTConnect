/**
 * @jest-environment jsdom
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { render, screen } from '@testing-library/react';
import VideoComponent from '../../src/components/VideoComponent';
import React, { useRef } from 'react';


describe('VideoComponent', () => {
  it('render video components', () => {
    // const localVideo = useRef<HTMLVideoElement>(null!);
    const options = { controls: true, style: { width: '640px', height: '360px'}};

    const { container } = render(<VideoComponent video = {null} mediaOptions = {options}/>);
  });
});

