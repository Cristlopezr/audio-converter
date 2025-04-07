import { ConverToProps } from '../../application/shared/types/convert-to';

export interface AudioProcessor {
    convertTo: (props: ConverToProps) => void;
}
