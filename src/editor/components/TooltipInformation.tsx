import { BsFillInfoCircleFill } from 'react-icons/bs';
import { Utils } from '../common';
import '../styles/TooltipInformation.css';
import Tooltip from './Tooltip';

type Props = {
	text: string;
	onClick?: () => void;
	disabled?: boolean;
};

export default function TooltipInformation({ text, onClick, disabled = false }: Props) {
	return (
		<Tooltip text={text} onClick={onClick} disabled={disabled}>
			<BsFillInfoCircleFill className={Utils.getClassName({ disabled }, 'tooltipInformation')} />
		</Tooltip>
	);
}
