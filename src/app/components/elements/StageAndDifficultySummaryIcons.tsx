import React from "react";
import classNames from "classnames";
import {isAda, isPhy, siteSpecific, STAGE, stageLabelMap} from "../../services";
import {DifficultyIcons} from "./svg/DifficultyIcons";
import {ViewingContext} from "../../../IsaacAppTypes";

export function StageAndDifficultySummaryIcons({audienceViews, className}: {audienceViews: ViewingContext[], className?: string}) {
    return <div className={classNames(className, "mt-1", {"d-flex flex-wrap justify-content-end align-items-baseline": isAda, "d-sm-flex mt-md-0": isPhy})}>
        {audienceViews.map((view, i) =>
            <div key={`${view.stage} ${view.difficulty} ${view.examBoard}`} className={classNames("align-self-center", {"ml-sm-3 ml-md-2": isPhy && (i > 0), "d-flex d-md-block": isPhy, "d-block text-center mx-2 my-1": isAda})}>
                {view.stage && view.stage !== STAGE.ALL && <div className="hierarchy-tags text-center">
                    {stageLabelMap[view.stage]}
                </div>}
                {view.difficulty && <div className={classNames("hierarchy-tags text-center", {"ml-md-0 ml-2": isPhy})}>
                    <DifficultyIcons difficulty={view.difficulty} />
                </div>}
            </div>)
        }
    </div>
}
