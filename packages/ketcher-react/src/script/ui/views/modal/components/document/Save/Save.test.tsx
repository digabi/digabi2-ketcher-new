// import { screen } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
// import Save from '.';
import { renderWithMockContext } from './Save.test.utils';

describe('Save Dialog should be rendered correctly', () => {
  it.skip('should render opened file format dropdown when the closed dropdown is clicked', async () => {
    console.log(
      'renderWithMockContext is printed just to make compiler happy about a skipped test',
      renderWithMockContext,
    );
    // const view = renderWithMockContext(<Save />);
    //
    // await userEvent.click(screen.getByText('MDL Molfile V2000'));
    // await screen.findByText('MDL Molfile V3000');
    //
    // expect(view).toMatchSnapshot();
  });
});
