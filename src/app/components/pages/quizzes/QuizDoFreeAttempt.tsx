import React, {useEffect} from "react";
import {useDispatch} from "react-redux";
import {withRouter} from "react-router-dom";
import * as RS from "reactstrap";

import {ShowLoading} from "../../handlers/ShowLoading";
import {clearQuizAttempt, loadFreeQuizAttempt} from "../../../state/actions/quizzes";
import {isDefined} from "../../../services/miscUtils";
import {useCurrentQuizAttempt} from "../../../services/quiz";
import {myQuizzesCrumbs, QuizAttemptComponent, QuizAttemptProps} from "../../elements/quiz/QuizAttemptComponent";
import {QuizAttemptDTO} from "../../../../IsaacApiTypes";
import {TitleAndBreadcrumb} from "../../elements/TitleAndBreadcrumb";
import {QuizAttemptFooter} from "../../elements/quiz/QuizAttemptFooter";
import {useSectionViewLogging} from "../../elements/quiz/useSectionViewLogging";

interface QuizDoFreeAttemptProps {
    match: {params: {quizId: string, page: string}}
}

const pageLink = (attempt: QuizAttemptDTO, page?: number) => {
    if (page !== undefined) {
        return `/quiz/attempt/${attempt.quizId}/page/${page}`;
    } else {
        return `/quiz/attempt/${attempt.quizId}`;
    }
};


const pageHelp = <span>
    Answer the questions on each section of the quiz, then mark the quiz as complete to see your feedback.
</span>;

const QuizDoFreeAttemptComponent = ({match: {params: {quizId, page}}}: QuizDoFreeAttemptProps) => {
    const {attempt, questions, sections, error} = useCurrentQuizAttempt();

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadFreeQuizAttempt(quizId));

        return () => {
            dispatch(clearQuizAttempt());
        };
    }, [dispatch, quizId]);

    const pageNumber = isDefined(page) ? parseInt(page, 10) : null;
    useSectionViewLogging(attempt, pageNumber);

    const assignedQuizError = error?.toString().includes("You are currently set this quiz");

    const subProps: QuizAttemptProps = {attempt: attempt as QuizAttemptDTO, page: pageNumber, questions, sections, pageLink, pageHelp};

    return <RS.Container className="mb-5">
        <ShowLoading until={attempt || error}>
            {attempt && <>
                <QuizAttemptComponent {...subProps} />
                <QuizAttemptFooter {...subProps} />
            </>}
            {error && <>
                <TitleAndBreadcrumb currentPageTitle="Quiz" intermediateCrumbs={myQuizzesCrumbs} />
                <RS.Alert color={assignedQuizError ? "warning" : "danger"} className="mt-4">
                    <h4 className="alert-heading">Error loading quiz!</h4>
                    <p>{error}</p>
                    {assignedQuizError && <>
                        <p>You can view your assigned quizzes <a href={"/quizzes"} target="_self" rel="noopener noreferrer">here</a>.</p>
                    </>}
                </RS.Alert>
            </>}
        </ShowLoading>
    </RS.Container>;
};

export const QuizDoFreeAttempt = withRouter(QuizDoFreeAttemptComponent);
