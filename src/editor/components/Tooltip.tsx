import { ReactNode, useLayoutEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
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
	const [style, setStyle] = useState<{ top: number; left: number } | undefined>(undefined);
	const tooltipRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		if (visible && tooltipRef.current && containerRef.current) {
			const tooltipRect = tooltipRef.current.getBoundingClientRect();
			const containerRect = containerRef.current.getBoundingClientRect();
			const viewportWidth = window.innerWidth;
			let left = containerRect.left + containerRect.width / 2 - tooltipRect.width / 2;
			left = Math.max(4, Math.min(left, viewportWidth - tooltipRect.width - 4));
			const top = containerRect.top - tooltipRect.height - 8;
			setStyle({ top, left });
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
			{ReactDOM.createPortal(
				<div ref={tooltipRef} className={Utils.getClassName({ visible }, 'tooltipBox')} style={style}>
					{text}
				</div>,
				document.body,
			)}
		</div>
	);
}
