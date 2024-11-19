import React from "react";
import {Circle} from "./Circle";
import { siteSpecific } from "../../../services";
import { Hexagon } from "./Hexagon";

const filterIconWidth = 25;

export interface FilterCountProps extends React.SVGProps<SVGSVGElement> {
    count: number;
}

export const FilterCount = (props: FilterCountProps) => {
    const {count, ...rest} = props;

    return <svg
        {...rest}
        width={`${filterIconWidth}px`}
        height={`${filterIconWidth}px`}
    >
        <title>{`${count} filters selected`}</title>
        <g>
            {siteSpecific(
                <Hexagon halfWidth={filterIconWidth * Math.sqrt(3)/4} quarterHeight={filterIconWidth / 4} className={"hex filter-count"} />,
                <Circle radius={filterIconWidth / 2} className={"circle filter-count"} />
            )}
            <foreignObject width={siteSpecific(filterIconWidth * Math.sqrt(3)/2, filterIconWidth)} height={filterIconWidth}>
                <div aria-hidden={"true"} className={`filter-count-title`}>
                    {count}
                </div>
            </foreignObject>
        </g>
    </svg>;
};
