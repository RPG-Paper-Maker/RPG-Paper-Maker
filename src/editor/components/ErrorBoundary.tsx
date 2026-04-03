/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React from 'react';

type Props = {
	children: React.ReactNode;
};

type State = {
	hasError: boolean;
	error: Error | null;
};

class ErrorBoundary extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, info: React.ErrorInfo) {
		console.error('[ErrorBoundary] Dialog render error:', error, info.componentStack);
	}

	render() {
		if (this.state.hasError) {
			return null;
		}
		return this.props.children;
	}
}

export default ErrorBoundary;
