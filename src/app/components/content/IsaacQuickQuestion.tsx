import React, {useRef, useState} from "react";
import {Alert, Button, Col, Row} from "reactstrap";
import * as ApiTypes from "../../../IsaacApiTypes";
import {ContentDTO} from "../../../IsaacApiTypes";
import {IsaacContentValueOrChildren} from "./IsaacContentValueOrChildren";
import {useDispatch} from "react-redux";
import {logAction} from "../../state/actions";
import {determineFastTrackSecondaryAction, useFastTrackInformation} from "../../services/fastTrack";
import {RouteComponentProps, withRouter} from "react-router";
import uuid from "uuid";

export const IsaacQuickQuestion = withRouter(({doc, location}: {doc: ApiTypes.IsaacQuickQuestionDTO} & RouteComponentProps) => {
    const dispatch = useDispatch();
    const fastTrackInfo = useFastTrackInformation(doc, location);
    const [isVisible, setVisible] = useState(false);
    const answer: ContentDTO = doc.answer as ContentDTO;
    const secondaryAction = determineFastTrackSecondaryAction(fastTrackInfo);
    const attemptUuid = useRef(uuid.v4().slice(0, 8));

    const toggle = (payload: string) => {
        if (isVisible) {
            const eventDetails = {type: "QUICK_QUESTION_CORRECT", questionId: doc.id, attemptUuid: attemptUuid.current, correct: payload};
            dispatch(logAction(eventDetails));
            attemptUuid.current = uuid.v4().slice(0, 8);
        } else {
            const eventDetails = {type: "QUICK_QUESTION_CONFIDENCE", questionId: doc.id, attemptUuid: attemptUuid.current, confidence: payload};
            dispatch(logAction(eventDetails));
        }
        const isNowVisible = !isVisible;
        setVisible(isNowVisible);
    };

    return <form onSubmit={e => e.preventDefault()}>
        <div className="question-component p-md-5">
            <div className={!fastTrackInfo.isFastTrackPage ? "quick-question" : ""}>
                <div className="question-content clearfix">
                    <IsaacContentValueOrChildren {...doc} />
                </div>
                {!fastTrackInfo.isFastTrackPage ?
                    <div className="quick-question-options">
                        <Row>
                            <Col>
                                <h4>{isVisible ?  "Click a button to hide the answer" : "Click a button to show the answer"}</h4>
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <Col>
                                {isVisible ? "Was your own answer correct?" : "What is your level of confidence (that your own answer is correct)?"}
                            </Col>
                        </Row>
                        <Row>
                            <Col sm="4" md="4">
                                <Button color="red" block className={isVisible ? "active" : ""} onClick={() => toggle(isVisible ? "No" : "Low")}>
                                    {isVisible ? "No" : "Low"}
                                </Button>
                            </Col>
                            <Col sm="4" md="4">
                                <Button color="yellow" block className={isVisible ? "active" : ""} onClick={() => toggle(isVisible ? "Probably" : "Medium")}>
                                    {isVisible ? "Probably" : "Medium"}
                                </Button>
                            </Col>
                            <Col sm="4" md="4">
                                <Button color="green" block className={isVisible ? "active" : ""} onClick={() => toggle(isVisible ? "Yes" : "High")}>
                                    {isVisible ? "Yes" : "High"}
                                </Button>
                            </Col>
                        </Row>
                    </div>
                    :
                    <div className={`d-flex align-items-stretch flex-column-reverse flex-sm-row flex-md-column-reverse flex-lg-row mb-4`}>
                        {secondaryAction && <div className={`m-auto pt-3 pb-1 w-100 w-sm-50 w-md-100 w-lg-50 pr-sm-2 pr-md-0 pr-lg-3`}>
                            <input {...secondaryAction} className="h-100 btn btn-outline-primary btn-block" />
                        </div>}
                        <div className={`m-auto pt-3 pb-1 w-100 w-sm-50 w-md-100 w-lg-50 "pl-sm-2 pl-md-0 pl-lg-3`}>
                            <input
                                onClick={() => toggle("fasttrack")} value={isVisible ? "Hide answer" : "Show answer"}
                                className={`h-100 btn btn-secondary btn-block {isVisible ? "active" : ""}`}
                            />
                        </div>
                    </div>
                }
                {isVisible && <Row>
                    <Col sm="12" md={!fastTrackInfo.isFastTrackPage ? {size: 10, offset: 1} : {}}>
                        <Alert color="secondary" className="overflow-auto">
                            <IsaacContentValueOrChildren {...answer} />
                        </Alert>
                    </Col>
                </Row>}
            </div>
        </div>
    </form>;
});
