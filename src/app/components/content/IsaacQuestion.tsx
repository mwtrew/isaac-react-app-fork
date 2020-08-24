import React, {useContext, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {attemptQuestion, deregisterQuestion, registerQuestion} from "../../state/actions";
import {IsaacContent} from "./IsaacContent";
import * as ApiTypes from "../../../IsaacApiTypes";
import {selectors} from "../../state/selectors";
import * as RS from "reactstrap";
import {QUESTION_TYPES, selectQuestionPart} from "../../services/questions";
import {DateString, NUMERIC_DATE_AND_TIME} from "../elements/DateString";
import {AccordionSectionContext} from "../../../IsaacAppTypes";
import {NOT_FOUND} from "../../services/constants";
import {RouteComponentProps, withRouter} from "react-router";
import {history} from "../../services/history";
import {useCurrentExamBoard} from "../../services/examBoard";
import {getRelatedConcepts} from "../../services/topics";
import {makeUrl} from "../../services/fastTrack";
import queryString from "query-string";
import {SITE, SITE_SUBJECT} from "../../services/siteConstants";
import {IsaacLinkHints, IsaacTabbedHints} from "./IsaacHints";
import {AppState} from "../../state/reducers";


function goToUrl(url: string, queryParams?: {[key: string]: string | undefined}) {
    history.push(makeUrl(url, queryParams));
}

function retryPreviousQuestion(questionHistory: string[], board?: string) {
    questionHistory = questionHistory.slice();
    let previousQuestionId = questionHistory.pop();
    let commaSeparatedQuestionHistory = questionHistory.join(',');

    return {
        value: "Retry previous question page",
        type: "button",
        onClick: function() {
            goToUrl('/question/' + previousQuestionId, {questionHistory: commaSeparatedQuestionHistory, board});
        }
    };
}

function backToBoard(board: string) {
    return {
        value: "Return to Top 10 Questions",
        type: "button",
        onClick: function() {
            goToUrl('/gameboards#' + board);
        }
    };
}

function showRelatedConceptPage(conceptPage: ApiTypes.ContentSummaryDTO) {
    return {
        type: "button",
        title: "Read suggested related concept page",
        value: "Read related concept page",
        onClick: function() {
            goToUrl(`/concepts/${conceptPage.id}`);
        },
    };
}

function tryEasierQuestion(easierQuestion: ApiTypes.ContentSummaryDTO, currentQuestionId: string|undefined, pageCompleted: boolean|undefined, questionHistory: string[], board: string|undefined) {
    if (!pageCompleted && currentQuestionId) {
        questionHistory = questionHistory.slice();
        questionHistory.push(currentQuestionId);
    }
    const commaSeparatedQuestionHistory = questionHistory.join(',');

    return {
        type: "button",
        title: `Try an easier question${easierQuestion.title ? " on " + easierQuestion.title.toLowerCase() : ""}`,
        value: "Easier question?",
        onClick: function() {
            goToUrl(`/questions/${easierQuestion.id}`, {questionHistory: commaSeparatedQuestionHistory, board});
        }
    };
}

function trySupportingQuestion(supportingQuestion: ApiTypes.ContentSummaryDTO, currentQuestionId: string|undefined, pageCompleted: boolean|undefined, questionHistory: string[], board: string|undefined) {
    if (!pageCompleted && currentQuestionId) {
        questionHistory = questionHistory.slice();
        questionHistory.push(currentQuestionId);
    }
    const commaSeparatedQuestionHistory = questionHistory.join(',');

    return {
        type: "button",
        title: `Try more questions of a similar difficulty${supportingQuestion.title ? " on " + supportingQuestion.title.toLowerCase() : ""}`,
        value: "More practice questions?",
        onClick: function() {
            goToUrl(`/questions/${supportingQuestion.id}`, {questionHistory: commaSeparatedQuestionHistory, board});
        }
    };
}

function getRelatedUnansweredEasierQuestions(doc: ApiTypes.IsaacQuestionBaseDTO, level: number) {
    return doc.relatedContent ? doc.relatedContent.filter((relatedContent) => {
        let isQuestionPage = relatedContent.type && ["isaacQuestionPage", "isaacFastTrackQuestionPage"].indexOf(relatedContent.type) >= 0;
        let isEasier = relatedContent.level && (parseInt(relatedContent.level, 10) < level);
        let isUnanswered = !relatedContent.correct;
        return isQuestionPage && isEasier && isUnanswered;
    }) : [];
}

function getRelatedUnansweredSupportingQuestions(doc: ApiTypes.IsaacQuestionBaseDTO, level: number) {
    return doc.relatedContent ? doc.relatedContent.filter((relatedContent) => {
        let isQuestionPage = relatedContent.type && ["isaacQuestionPage", "isaacFastTrackQuestionPage"].indexOf(relatedContent.type) >= 0;
        let isEqualOrHarder = relatedContent.level && (parseInt(relatedContent.level, 10) >= level);
        let isUnanswered = !relatedContent.correct;
        return isQuestionPage && isEqualOrHarder && isUnanswered;
    }) : [];
}


export const IsaacQuestion = withRouter(({doc, location}: {doc: ApiTypes.IsaacQuestionBaseDTO} & RouteComponentProps) => {
    const {board, questionHistory: questionHistoryUrl}: {board?: string; questionHistory?: string} = queryString.parse(location.search);
    const questionHistory = questionHistoryUrl?.split(",") || [];

    const dispatch = useDispatch();
    const page = useSelector((state: AppState) => state?.doc && state.doc !== NOT_FOUND ? state.doc : undefined);
    const pageCompleted = useSelector((state: AppState) => state?.questions ? state.questions.pageCompleted : undefined);
    const pageQuestions = useSelector(selectors.questions.getQuestions);
    const questionPart = selectQuestionPart(pageQuestions, doc.id);
    const validationResponse = questionPart?.validationResponse;
    const currentAttempt = questionPart?.currentAttempt;
    const locked = questionPart?.locked;
    const canSubmit = questionPart?.canSubmit && !locked;
    const accordion = useContext(AccordionSectionContext);

    useEffect((): (() => void) => {
        dispatch(registerQuestion(doc, accordion.clientId));
        return () => dispatch(deregisterQuestion(doc.id as string));
    }, [dispatch, doc.id]);

    const examBoard = useCurrentExamBoard();

    function submitCurrentAttempt(event: React.FormEvent) {
        if (event) {event.preventDefault();}
        if (currentAttempt) {
            dispatch(attemptQuestion(doc.id as string, currentAttempt));
        }
    }

    const QuestionComponent = QUESTION_TYPES.get(doc.type || "default");

    const sigFigsError = validationResponse && validationResponse.explanation &&
        (validationResponse.explanation.tags || []).includes("sig_figs");

    const isFastTrack = page && page.type === "isaacFastTrackQuestionPage";

    function determineFastTrackPrimaryAction() {
        let questionPartAnsweredCorrectly = validationResponse && validationResponse.correct;
        if (questionPartAnsweredCorrectly) {
            if (pageCompleted) {
                if (questionHistory.length) {
                    return retryPreviousQuestion(questionHistory, board);
                } else {
                    if (board  /* CHECKME: Seems disabled in Physics by commit 70c4b8af899dba7482c14c223412fb3b9ae2f38e:
                        && !questionPart.gameBoardCompletedPerfect*/) {
                        return backToBoard(board);
                    } else {
                        return null; // Gameboard completed
                    }
                }
            } else {
                return null; // CHECKME: Never existed in Physics: questionActions.goToNextQuestionPart();
            }
        } else  {
            return {
                disabled: !canSubmit,
                value: "Check my answer",
                type: "submit"
            };
        }
    }

    function determineFastTrackSecondaryAction() {
        const questionPartNotAnsweredCorrectly = !(validationResponse && validationResponse.correct);
        if (page) {
            if (questionPartNotAnsweredCorrectly) {
                const relatedUnansweredEasierQuestions = getRelatedUnansweredEasierQuestions(doc, page.level || 0);
                if (relatedUnansweredEasierQuestions.length > 0) {
                    const easierQuestion = relatedUnansweredEasierQuestions[0];
                    return tryEasierQuestion(easierQuestion, page.id, pageCompleted, questionHistory, board);
                }
            }
            const relatedUnansweredSupportingQuestions = getRelatedUnansweredSupportingQuestions(doc, page.level || 0);
            if (relatedUnansweredSupportingQuestions.length > 0) {
                const supportingQuestion = relatedUnansweredSupportingQuestions[0];
                return trySupportingQuestion(supportingQuestion, page.id, pageCompleted, questionHistory, board);
            }
        }
        if (doc.relatedContent && doc.relatedContent.length) {
            const relatedConcepts = getRelatedConcepts(doc, examBoard);
            if (relatedConcepts && relatedConcepts.length > 0) {
                return showRelatedConceptPage(relatedConcepts[0]);
            }
        } else {
            return null;
        }
    }

    const primaryAction = isFastTrack ? determineFastTrackPrimaryAction() : {
        disabled: !canSubmit,
        value: "Check my answer",
        type: "submit"
    };

    const secondaryAction = isFastTrack ? determineFastTrackSecondaryAction() : null;

    return <RS.Form onSubmit={submitCurrentAttempt}>
        {/* <h2 className="h-question d-flex pb-3">
            <span className="mr-3">{questionIndex !== undefined ? `Q${questionIndex + 1}` : "Question"}</span>
        </h2> */}
        {/* Difficulty bar */}

        <div className={`question-component p-md-5 ${doc.type} ${doc.type === 'isaacParsonsQuestion' ? "parsons-layout" : ""}`}>
            {/* @ts-ignore as TypeScript is struggling to infer common type for questions */}
            <QuestionComponent questionId={doc.id as string} doc={doc} validationResponse={validationResponse} />
            {SITE_SUBJECT === SITE.CS &&
                <IsaacLinkHints questionPartId={doc.id as string} hints={doc.hints} />
            }

            {validationResponse && !canSubmit && <div className={`validation-response-panel p-3 mt-3 ${validationResponse.correct ? "correct" : ""}`}>
                <div className="pb-1">
                    <h1 className="m-0">{sigFigsError ? "Significant Figures" : validationResponse.correct ? "Correct!" : "Incorrect"}</h1>
                </div>
                {validationResponse.explanation && <div className="mb-2">
                    <IsaacContent doc={validationResponse.explanation} />
                </div>}
            </div>}

            {locked && <RS.Alert color="danger">
                This question is locked until at least {<DateString formatter={NUMERIC_DATE_AND_TIME}>{locked}</DateString>} to prevent repeated guessing.
            </RS.Alert>}

            {(!(validationResponse?.correct) || canSubmit || (isFastTrack && (primaryAction || secondaryAction))) && !locked &&
                <div className={`d-flex align-items-stretch flex-column-reverse flex-sm-row flex-md-column-reverse flex-lg-row ${validationResponse?.correct ? "mt-5 mb-n3" : ""}`}>
                    {secondaryAction &&
                        <div className={`m-auto pt-3 pb-1 w-100 w-sm-50 w-md-100 w-lg-50 ${primaryAction ? "pr-sm-2 pr-md-0 pr-lg-3" : ""}`}>
                            <input {...secondaryAction} className="h-100 btn btn-outline-primary btn-block" />
                        </div>
                    }
                    {primaryAction &&
                        <div className={`m-auto pt-3 pb-1 w-100 w-sm-50 w-md-100 w-lg-50 ${secondaryAction ? "pl-sm-2 pl-md-0 pl-lg-3" : ""}`}>
                            <input {...primaryAction} className="h-100 btn btn-secondary btn-block" />
                        </div>
                    }
                </div>
            }

            {SITE_SUBJECT === SITE.CS && (!validationResponse || !validationResponse.correct || canSubmit) && <RS.Row>
                <RS.Col xl={{size: 10, offset: 1}} >
                    {doc.hints && <p className="no-print text-center pt-2 mb-0">
                        <small>{"Don't forget to use the hints above if you need help."}</small>
                    </p>}
                </RS.Col>
            </RS.Row>}

            {SITE_SUBJECT === SITE.PHY &&
                <div className={validationResponse && validationResponse.correct ? "mt-5" : ""}>
                    <IsaacTabbedHints questionPartId={doc.id as string} hints={doc.hints}/>
                </div>
            }
        </div>
    </RS.Form>;
});
