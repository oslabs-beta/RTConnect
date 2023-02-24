/** @jest-environment jsdom */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import VideoCall from '../../src/components/VideoCall';

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

  it('Check Submit Username button', () => {

    const submitBtn = screen.getByTestId('submit-username-btn');
    expect(submitBtn.innerHTML).toBe('Submit Username');
    // fireEvent.click(submitBtn);
    // expect()
  });
});
