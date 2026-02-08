import { ReactNode, useLayoutEffect, useRef, useState } from 'react';
import { Utils } from '../common';
import '../styles/Tooltip.css';

type Props = {
	children: ReactNode;
	text: string;
	onClick?: () => void;
	disabled?: boolean;
};

export default function Tooltip({ children, text, onClick, disabled = false }: Props) {
	const [visible, setVisible] = useState(false);
	const [isCentered, setIsCentered] = useState(true);
	const tooltipRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		if (visible && tooltipRef.current && containerRef.current) {
			const tooltipRect = tooltipRef.current.getBoundingClientRect();
			const containerRect = containerRef.current.getBoundingClientRect();
			const viewportWidth = window.innerWidth;
			setIsCentered(containerRect.left + tooltipRect.width / 2 <= viewportWidth);
		}
	}, [visible]);

	return (
		<div
			ref={containerRef}
			className='tooltip'
			onMouseEnter={disabled ? undefined : () => setVisible(true)}
			onMouseLeave={disabled ? undefined : () => setVisible(false)}
			onClick={disabled ? undefined : onClick}
		>
			{children}
			<div ref={tooltipRef} className={Utils.getClassName({ visible, right: !isCentered }, 'tooltipBox')}>
				{text}
			</div>
		</div>
	);
}
