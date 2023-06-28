import {anonymisationFunctions, anonymiseIfNeededWith, anonymiseListIfNeededWith, AppState, groupsApi} from "./index";
import {KEY, persistence, NOT_FOUND, isDefined} from "../services";
import {QuizAssignmentDTO} from "../../IsaacApiTypes";
import {AppQuizAssignment, NOT_FOUND_TYPE} from "../../IsaacAppTypes";

export const selectors = {

    topic: {
        currentTopic: (state: AppState) => {
            if (!state) return null;
            if (!state.currentTopic) return null;
            if (state.currentTopic === NOT_FOUND) return null;
            return state.currentTopic;
        }
    },

    boards: {
        boards: (state: AppState) => state?.boards ?? null
    },

    doc: {
        get: (state: AppState) => state?.doc || null,
    },

    questions: {
        getQuestions: (state: AppState) => state?.questions?.questions,
        allQuestionsAttempted: (state: AppState) => {
            return !!state && !!state.questions && state.questions.questions.map(q => !!q.currentAttempt).reduce((prev, current) => prev && current);
        },
        anyQuestionPreviouslyAttempted: (state: AppState) => {
            return !!state && !!state.questions && state.questions.questions.map(q => !!q.bestAttempt).reduce((prev, current) => prev || current);
        }
    },

    error: {
        general: (state: AppState) => state?.error && state.error.type == "generalError" && state.error.generalError || null,
    },

    user:  {
        orNull: (state: AppState) => state?.user || null,
        loggedInOrNull: (state: AppState) => state?.user?.loggedIn && state.user || null,
        progress: (state: AppState) => state?.myProgress,
        snapshot: (state: AppState) => state?.myProgress?.userSnapshot,
        achievementsRecord: (state: AppState) => state?.myProgress?.userSnapshot?.achievementsRecord,
        answeredQuestionsByDate: (state: AppState) => state?.myAnsweredQuestionsByDate,
        preferences: (state: AppState) => state?.userPreferences
    },

    mainContentId: {
        orDefault: (state: AppState) => state?.mainContentId || "main",
    },

    teacher: {
        userProgress: (state: AppState) => state?.userProgress && anonymiseIfNeededWith(anonymisationFunctions.userProgress)(state.userProgress),
        userAnsweredQuestionsByDate: (state: AppState) => state?.userAnsweredQuestionsByDate
    },

    admin: {
        userSearch: (state: AppState) => state?.adminUserSeach,
    },

    connections: {
        activeAuthorisations: (state: AppState) => state?.activeAuthorisations && anonymiseIfNeededWith(anonymisationFunctions.activeAuthorisations)(state?.activeAuthorisations),
        otherUserAuthorisations: (state: AppState) => state?.otherUserAuthorisations && anonymiseIfNeededWith(anonymisationFunctions.otherUserAuthorisations)(state?.otherUserAuthorisations),
        groupMemberships: (state: AppState) => state?.groupMemberships && anonymiseListIfNeededWith(anonymisationFunctions.groupMembershipDetail)(state?.groupMemberships)
    },

    quizzes: {
        preview: (state: AppState) => {
            const qp = state?.quizPreview;
            return {
                quiz: qp && 'quiz' in qp ? qp.quiz : null,
                error: qp && 'error' in qp ? qp.error : null,
            };
        },
        assignedToMe: (state: AppState) => state?.quizAssignedToMe,
        /* Retrieves the current users most recent attempt at the current quiz being viewed */
        currentQuizAttempt: (state: AppState) => state?.quizAttempt,
        /* Retrieves the quiz attempt for the current student being looked at (this is used to render /test/attempt/feedback/[group id]/[student id]) */
        currentStudentQuizAttempt: (state: AppState) => state?.studentQuizAttempt && 'studentAttempt' in state?.studentQuizAttempt ? anonymiseIfNeededWith(anonymisationFunctions.quizAttempt)(state.studentQuizAttempt) : state?.studentQuizAttempt,
        attemptedFreelyByMe: (state: AppState) => state?.quizAttemptedFreelyByMe,
    },
};

// Important type checking to avoid an awkward bug
interface SelectorsWithNoPropArgs {
    // It is important that the selectors do not use the component's props to filter the results as they can be
    // out-of-date. In some cases this can lead to zombie children.
    // A full explanation can be found here: https://react-redux.js.org/next/api/hooks#stale-props-and-zombie-children
    // We avoid this problem by forcing the selectors to be simple, accepting only the app state as an argument.
    // Filtering using the props can be safely done later during the component's render on useAppSelector(...)'s result.
    [type: string]: {[name: string]: (state: AppState) => unknown};
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const selectorsWithoutZombies: SelectorsWithNoPropArgs = selectors; // lgtm[js/unused-local-variable] I don't want to lose selectors' type inference
