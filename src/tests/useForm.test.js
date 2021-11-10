import { render, within } from '@testing-library/dom';
import '@testing-library/jest-dom';
import * as React from 'react';
import useForm from '../useForm';
import FormAllTypes from './FormAllTypes';
import modelDefault from './modelDefault';



describe('useForm', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	test('initial component render', () => {
		 const { screen } = render(<FormAllTypes model={modelDefault} schema={schema} onSubmit={()=>{}} />);

		//  expect(mockDispatch).toHaveBeenCalledTimes(2);
		//  expect(mockDispatch).toHaveBeenNthCalledWith(1, actions.loadActivityTypes());
		//  expect(mockDispatch).toHaveBeenNthCalledWith(2, actions.loadCustomActivityTypes());

		//  expect(screen.getByRole('heading', { name: /default/i })).toBeTruthy();
		//  expect(screen.getByText(/DEFAULT TYPE 1/i)).toBeTruthy();
		//  expect(screen.getByText(/DEFAULT TYPE 2/i)).toBeTruthy();
		//  expect(screen.getByText(/DEFAULT TYPE 3/i)).toBeTruthy();

		 expect(screen.getByRole('heading', { name: /custom/i })).toBeTruthy();
		 expect(screen.getByRole('checkbox', { name: /hide inactive activity types/i })).toBeChecked();

		//  const { getAllByRole } = within(screen.getByRole('list', { name: /custom-types/i }));
		//  expect(getAllByRole('listitem').length).toBe(1); // only one active custom type
		expect(1).toBe(1);
	});

	// test('display all custom activity types', () => {
	// 	renderRedux(<ActivityTypesPage />, mockState);

	// 	const { getAllByRole } = within(screen.getByRole('list'));

	// 	expect(getAllByRole('listitem').length).toBe(1);

	// 	fireEvent.click(screen.getByRole('checkbox', { name: /hide inactive activity types/i }));

	// 	expect(getAllByRole('listitem').length).toBe(mockState.activityTypes.activityTypes.custom.length); // all custom types
	// });

	// test('open/close create activity type form', () => {
	// 	const { mockDispatch } = renderRedux(<ActivityTypesPage />, mockState);

	// 	fireEvent.click(screen.getByRole('button', { name: /activity type/i }));
	// 	expect(mockDispatch).toHaveBeenCalledWith(actions.addNew());

	// 	expect(screen.getByRole('heading', { name: /create activity type/i })).toBeTruthy();

	// 	fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
	// 	expect(mockDispatch).toHaveBeenCalledWith(actions.toggleForm(false));
	// });

	// test('edit custom activity type', () => {
	// 	const { mockDispatch } = renderRedux(<ActivityTypesPage />, mockState);

	// 	fireEvent.click(screen.getByRole('button', { name: /edit/i }));
	// 	expect(mockDispatch).toHaveBeenNthCalledWith(3, actions.edit(mockState.activityTypes.activityTypes.custom[0].id));
	// });

	// test('access for unauthorized user is rejected', () => {
	// 	renderRedux(<ActivityTypesPage />, mockStateUnauthorized);
	// 	expect(screen.getByText(/It looks like you don't have access to this page/i)).toBeTruthy();
	// });
});

