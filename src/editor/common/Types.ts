import { BINDING } from './Enum';

export type KeyValue = {
	k?: any;
	v?: any;
};

export type BindingType = [string, string, any, BINDING, any?, any?];
