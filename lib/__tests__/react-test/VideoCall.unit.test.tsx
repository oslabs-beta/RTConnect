/* eslint-disable @typescript-eslint/no-unused-vars */
/** @jest-environment jsdom */

import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import VideoCall from '../../src/components/VideoCall';

afterAll(cleanup);

describe('VideoCall', () => {
  const Url = 'ws://localhost:3000';
  const options = {
    controls: true, 
    style: { 
      width: '640px',
      height: '480px'
    }
  };

  const { container } = render(<VideoCall URL={Url} mediaOptions={options}/>);

  it('Check buttons in VideoCall.tsx', () => {

    const submitBtn = screen.getByTestId('submit-username-btn');
    expect(submitBtn.innerHTML).toBe('Submit Username');

    const shareBtn = screen.getByTestId('share-screen-btn');
    expect(shareBtn.innerHTML).toBe('Share Screen');

    const endBtn = screen.getByTestId('end-call-btn');
    expect(endBtn.innerHTML).toBe('End Call');

    const callBtn = screen.getByTestId('call-btn');
    expect(callBtn.innerHTML).toBe('Call');

    // fireEvent.click(submitBtn);
    // expect()
  });
});
