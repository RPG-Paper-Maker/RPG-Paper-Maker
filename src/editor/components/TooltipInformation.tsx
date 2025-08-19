import { BsFillInfoCircleFill } from 'react-icons/bs';
import Tooltip from './Tooltip';

type Props = {
	text: string;
};

export default function TooltipInformation({ text }: Props) {
	return (
		<Tooltip text={text}>
			<BsFillInfoCircleFill />
		</Tooltip>
	);
}
