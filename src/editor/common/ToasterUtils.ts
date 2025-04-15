import { Bounce, toast, ToastOptions } from 'react-toastify';

export const TOASTER_OPTIONS: ToastOptions<unknown> = {
	position: 'bottom-right',
	autoClose: 5000,
	hideProgressBar: true,
	closeOnClick: false,
	pauseOnHover: true,
	draggable: false,
	progress: undefined,
	theme: 'dark',
	transition: Bounce,
};

export const notifySuccess = (text: string) => {
	toast.success(text, TOASTER_OPTIONS);
};
