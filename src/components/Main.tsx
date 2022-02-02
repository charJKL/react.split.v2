import {CustomElement, CustomElementProps} from "../type/CustomElement";

import EditorMetrics from './editors/EditorMetrics';

const Main : CustomElement = ({className} : CustomElementProps ) : JSX.Element =>
{
	return (
		<main className={className}>
			<EditorMetrics />
		</main>
	)
} 

export default Main;