import { Size } from "../../types";
import { Page } from "../../store/slice.pages";
import { Metric } from "../../store/slice.metrics";

export interface LayerProps
{
	className: string | undefined;
	page: Page;
	metric: Metric;
	desktopSize: Size;
}
