import React, {useEffect, useState} from "react";
import {
    loadQuizAssignments,
    markQuizAsCancelled,
    selectors,
    showQuizSettingModal,
    useAppDispatch,
    useAppSelector,
    useGetGroupsQuery
} from "../../../state";
import {Link, RouteComponentProps, withRouter} from "react-router-dom";
import * as RS from "reactstrap";
import {ShowLoading} from "../../handlers/ShowLoading";
import {QuizAssignmentDTO, QuizSummaryDTO, RegisteredUserDTO} from "../../../../IsaacApiTypes";
import {TitleAndBreadcrumb} from "../../elements/TitleAndBreadcrumb";
import {Spacer} from "../../elements/Spacer";
import {formatDate} from "../../elements/DateString";
import {AppQuizAssignment} from "../../../../IsaacAppTypes";
import {
    below, isAda,
    isEventLeaderOrStaff,
    isPhy, isStaff,
    MANAGE_QUIZ_TAB,
    NOT_FOUND, nthHourOf,
    siteSpecific, TODAY,
    useDeviceSize,
    useFilteredQuizzes
} from "../../../services";
import {Tabs} from "../../elements/Tabs";
import {IsaacSpinner} from "../../handlers/IsaacSpinner";
import {PageFragment} from "../../elements/PageFragment";
import {RenderNothing} from "../../elements/RenderNothing";

interface SetQuizzesPageProps extends RouteComponentProps {
    user: RegisteredUserDTO;
}

interface QuizAssignmentProps {
    user: RegisteredUserDTO;
    assignment: AppQuizAssignment;
}

function formatAssignmentOwner(user: RegisteredUserDTO, assignment: QuizAssignmentDTO) {
    if (user.id === assignment.ownerUserId) {
        return "Me";
    } else if (assignment.assignerSummary && assignment.assignerSummary.givenName && assignment.assignerSummary.familyName) {
        return assignment.assignerSummary.givenName + " " + assignment.assignerSummary.familyName;
    } else {
        return "Someone else";
    }
}

function QuizAssignment({user, assignment}: QuizAssignmentProps) {
    const dispatch = useAppDispatch();
    const cancel = () => {
        if (window.confirm("Are you sure you want to cancel?\r\nStudents will no longer be able to take the test or see any feedback, and all previous attempts will be lost.")) {
            dispatch(markQuizAsCancelled(assignment.id as number));
        }
    };
    const assignmentNotYetStarted = assignment?.scheduledStartDate && nthHourOf(0, assignment?.scheduledStartDate) > TODAY();
    const quizTitle = (assignment.quizSummary?.title || assignment.quizId) + (assignmentNotYetStarted ? ` (starts ${formatDate(assignment?.scheduledStartDate)})` : "");
    // TODO RTKQ quiz refactor use isPending from use mutation hook to re-implement this (markQuizAsCancelled would be
    //  the mutation trigger)
    const isCancelling = 'cancelling' in assignment && (assignment as {cancelling: boolean}).cancelling;
    return <div className="p-2">
        <RS.Card className="card-neat">
            <RS.CardBody>
                <h4 className="border-bottom pb-3 mb-3">{quizTitle}</h4>

                <p>Set to: <strong>{assignment.groupName ?? "Unknown"}</strong></p>
                <p>Set on: <strong>{formatDate(assignment.creationDate)} by {formatAssignmentOwner(user, assignment)}</strong></p>
                <RS.Row>
                    {assignment.scheduledStartDate && <RS.Col>
                        <p>Start date: <strong>{formatDate(assignment.scheduledStartDate)}</strong></p>
                    </RS.Col>}
                    <RS.Col>
                        <p>{assignment.dueDate ? <>Due date: <strong>{formatDate(assignment.dueDate)}</strong></> : <>No due date</>}</p>
                    </RS.Col>
                </RS.Row>

                <div className="mt-4 text-right">
                    <RS.Button color="tertiary" size="sm" outline onClick={cancel} disabled={isCancelling} className="mr-1 bg-light">
                        {isCancelling ? <><IsaacSpinner size="sm" /> Cancelling...</> : siteSpecific("Cancel Test", "Cancel test")}
                    </RS.Button>
                    <RS.Button tag={Link} to={`/test/assignment/${assignment.id}/feedback`} disabled={isCancelling} color={isCancelling ? "tertiary" : undefined} size="sm" className="ml-1">
                        View {assignmentNotYetStarted ? siteSpecific("Details", "details") : siteSpecific("Results", "results")}
                    </RS.Button>
                </div>
            </RS.CardBody>
        </RS.Card>
    </div>;
}

const SetQuizzesPageComponent = ({user, location}: SetQuizzesPageProps) => {
    const dispatch = useAppDispatch();
    const deviceSize = useDeviceSize();
    const hashAnchor = location.hash?.slice(1) ?? null;
    const [activeTab, setActiveTab] = useState(MANAGE_QUIZ_TAB.set);

    // todo: This is so when the quizAssignments selector tries to augment quizzes with group names, it works. Revisit.
    const { data: groups } = useGetGroupsQuery(false);

    const quizAssignments = useAppSelector(selectors.quizzes.assignments);

    // Set active tab using hash anchor
    useEffect(() => {
        // @ts-ignore
        const tab: MANAGE_QUIZ_TAB =
            (hashAnchor && MANAGE_QUIZ_TAB[hashAnchor as any]) ||
            MANAGE_QUIZ_TAB.set;
        setActiveTab(tab);
    }, [hashAnchor]);

    useEffect(() => {
        dispatch(loadQuizAssignments());
    }, [dispatch]);

    const {titleFilter, setTitleFilter, filteredQuizzes} = useFilteredQuizzes(user);

    const pageTitle= siteSpecific("Set / Manage Tests", "Manage tests");
    const pageHelp = <span>
        Use this page to manage and set tests to your groups. You can assign any test the {siteSpecific("Isaac", "Ada")} team have built.
        <br />
        Students in the group will be emailed when you set a new test.
    </span>;

    // If the user is event admin or above, and the quiz is hidden from teachers, then show that
    // Otherwise, show if the quiz is visible to students
    const roleVisibilitySummary = (quiz: QuizSummaryDTO) => <>
        {isEventLeaderOrStaff(user) && quiz.hiddenFromRoles && quiz.hiddenFromRoles?.includes("TEACHER") && <div className="small text-muted d-none d-md-block ml-2">hidden from teachers</div>}
        {((quiz.hiddenFromRoles && !quiz.hiddenFromRoles?.includes("STUDENT")) || quiz.visibleToStudents) && <div className="small text-muted d-none d-md-block ml-2">visible to students</div>}
    </>;

    return <RS.Container>
        <TitleAndBreadcrumb currentPageTitle={pageTitle} help={pageHelp} modalId={isPhy ? "set_tests_help" : undefined} />
        {isAda && <PageFragment fragmentId={"set_tests_help"} ifNotFound={RenderNothing} />}
        <Tabs className="my-4 mb-5" tabContentClass="mt-4" activeTabOverride={activeTab}>
            {{
                [siteSpecific("Set Tests", "Available tests")]:
                <ShowLoading until={filteredQuizzes}>
                    {filteredQuizzes && <>
                        <p>The following tests are available to set to your groups.</p>
                        <RS.Input
                            id="available-quizzes-title-filter" type="search" className="mb-4"
                            value={titleFilter} onChange={event => setTitleFilter(event.target.value)}
                            placeholder="Search by title" aria-label="Search by title"
                        />
                        {filteredQuizzes.length === 0 && <p><em>There are no tests you can set which match your search term.</em></p>}
                        <RS.ListGroup className="mb-2 quiz-list">
                            {filteredQuizzes.map(quiz =>  <RS.ListGroupItem className="p-0 bg-transparent" key={quiz.id}>
                                <div className="d-flex flex-grow-1 flex-column flex-sm-row align-items-center p-3">
                                    <span className="mb-2 mb-sm-0">{quiz.title}</span>
                                    {roleVisibilitySummary(quiz)}
                                    {quiz.summary && <div className="small text-muted d-none d-md-block">{quiz.summary}</div>}
                                    <Spacer />
                                    <RS.Button className={below["md"](deviceSize) ? "btn-sm" : ""} onClick={() => dispatch(showQuizSettingModal(quiz, isStaff(user)))}>
                                        {siteSpecific("Set Test", "Set test")}
                                    </RS.Button>
                                </div>
                                <div className="d-none d-md-flex align-items-center">
                                    <Link className="my-3 mr-2 pl-3 pr-4 quiz-list-separator" to={{pathname: `/test/preview/${quiz.id}`}}>
                                        <span>Preview</span>
                                    </Link>
                                </div>
                            </RS.ListGroupItem>)}
                        </RS.ListGroup>
                    </>}
                </ShowLoading>,

                [siteSpecific("Manage Tests", "Previously set tests")]:
                <ShowLoading until={quizAssignments} ifNotFound={<RS.Alert color="warning">Tests you have assigned have failed to load, please try refreshing the page.</RS.Alert>}>
                    {quizAssignments && quizAssignments !== NOT_FOUND && <>
                        {quizAssignments.length === 0 && <p>You have not set any tests to your groups yet.</p>}
                        {quizAssignments.length > 0 && <div className="block-grid-xs-1 block-grid-md-2 block-grid-xl-3 my-2">
                            {quizAssignments.map(assignment => <QuizAssignment key={assignment.id} user={user} assignment={assignment} />)}
                        </div>}
                    </>}
                </ShowLoading>,
            }}
        </Tabs>
    </RS.Container>;
};

export const SetQuizzes = withRouter(SetQuizzesPageComponent);
