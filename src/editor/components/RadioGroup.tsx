import React, { ReactNode } from 'react';

export const RadioGroupContext = React.createContext({
	selected: 0,
	// eslint-disable-next-line
	onChange: (n: number) => {
		console.error('Not implemented radio group');
	},
});

type Props = {
	children?: ReactNode | ReactNode[];
	selected: number;
	onChange: (v: number) => void;
};

function RadioGroup({ selected, onChange, children }: Props) {
	return <RadioGroupContext.Provider value={{ selected, onChange }}>{children}</RadioGroupContext.Provider>;
}

export default RadioGroup;
