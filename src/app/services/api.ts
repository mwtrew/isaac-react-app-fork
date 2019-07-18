import axios, {AxiosPromise} from "axios";
import {API_PATH, MEMBERSHIP_STATUS, TAG_ID} from "./constants";
import * as ApiTypes from "../../IsaacApiTypes";
import * as AppTypes from "../../IsaacAppTypes";
import {ActualBoardLimit, BoardOrder, LoggedInUser, UserPreferencesDTO} from "../../IsaacAppTypes";
import {handleApiGoneAway, handleServerError} from "../state/actions";

export const endpoint = axios.create({
    baseURL: API_PATH,
    withCredentials: true,
});

endpoint.interceptors.response.use((response) => {
    if (response.status >= 500) {
        // eslint-disable-next-line no-console
        console.warn("Uncaught error from API:", response);
    }
    return response;
}, (error) => {
    if (error.response && error.response.status >= 500 && !error.response.data.bypassGenericSiteErrorPage) {
        if (error.response.status == 502) {
            // A '502 Bad Gateway' response means that the API no longer exists:
            handleApiGoneAway();
        } else {
            handleServerError();
        }
        // eslint-disable-next-line no-console
        console.warn("Error from API:", error);
    }
    return Promise.reject(error);
});


export const apiHelper = {
    determineImageUrl: (path: string) => {
        // Check if the image source is a fully qualified link (suggesting it is external to the Isaac site),
        // or else an asset link served by the APP, not the API.
        if ((path.indexOf("http") > -1) || (path.indexOf("/assets/") > -1)) {
            return path;
        } else {
            return API_PATH + "/images/" + path;
        }
    }
};

export const api = {
    search: {
        get: (query: string, types: string): AxiosPromise<ApiTypes.ResultsWrapper<ApiTypes.ContentSummaryDTO>> => {
            return endpoint.get(`/search/` + encodeURIComponent(query), {params: {types}});
        }
    },
    users: {
        getCurrent: (): AxiosPromise<ApiTypes.RegisteredUserDTO> => {
            return endpoint.get(`/users/current_user`);
        },
        getPreferences: (): AxiosPromise<AppTypes.UserPreferencesDTO> => {
            return endpoint.get(`/users/user_preferences`)
        },
        passwordReset: (params: {email: string}): AxiosPromise => {
            return endpoint.post(`/users/resetpassword`, params);
        },
        requestEmailVerification(params: {email: string}): AxiosPromise {
            return endpoint.post(`/users/verifyemail`, params);
        },
        verifyPasswordReset: (token: string | null): AxiosPromise => {
            return endpoint.get(`/users/resetpassword/${token}`)
        },
        handlePasswordReset: (params: {token: string | null; password: string | null}): AxiosPromise => {
            return endpoint.post(`/users/resetpassword/${params.token}`, {password: params.password})
        },
        updateCurrent: (params: {registeredUser: LoggedInUser; userPreferences: UserPreferencesDTO; passwordCurrent: string | null}):  AxiosPromise<ApiTypes.RegisteredUserDTO> => {
            return endpoint.post(`/users`, params);
        },
        passwordResetById: (id: number): AxiosPromise => {
            return endpoint.post(`/users/${id}/resetpassword`);
        }
    },
    authentication: {
        getRedirect: (provider: ApiTypes.AuthenticationProvider): AxiosPromise => {
            return endpoint.get(`/auth/${provider}/authenticate`);
        },
        checkProviderCallback: (provider: ApiTypes.AuthenticationProvider, params: string): AxiosPromise => {
            return endpoint.get(`/auth/${provider}/callback${params}`);
        },
        logout: (): AxiosPromise => {
            return endpoint.post(`/auth/logout`);
        },
        login: (provider: ApiTypes.AuthenticationProvider, params: {email: string; password: string}): AxiosPromise<ApiTypes.RegisteredUserDTO> => {
            return endpoint.post(`/auth/${provider}/authenticate`, params);
        },
        getCurrentUserAuthSettings: (): AxiosPromise<ApiTypes.UserAuthenticationSettingsDTO> => {
            return endpoint.get(`/auth/user_authentication_settings`)
        }
    },
    email: {
        verify: (params: {userid: string | null; token: string | null}): AxiosPromise => {
            return endpoint.get(`/users/verifyemail/${params.userid}/${params.token}`);
        }
    },
    admin: {
        userSearch: {
            get: (queryParams: {}): AxiosPromise<ApiTypes.UserSummaryForAdminUsersDTO[]> => {
                return endpoint.get(`/admin/users/`, {params: queryParams});
            }
        },
        modifyUserRoles: {
            post: (role: ApiTypes.Role, userIds: number[]) => {
                return endpoint.post(`/admin/users/change_role/${role}`, userIds);
            }
        },
        getContentErrors: (): AxiosPromise<AppTypes.ContentErrorsResponse> => {
            return endpoint.get(`/admin/content_problems`)
        },
        getSiteStats: (): AxiosPromise<AppTypes.AdminStatsResponse> => {
            return endpoint.get(`/admin/stats`)
        }
    },
    authorisations: {
        get: (): AxiosPromise<ApiTypes.UserSummaryWithEmailAddressDTO[]> => {
            return endpoint.get(`authorisations`);
        },
        getOtherUsers: (): AxiosPromise<ApiTypes.UserSummaryDTO[]> => {
            return endpoint.get(`/authorisations/other_users`);
        },
        getToken: (groupId: number): AxiosPromise<AppTypes.AppGroupTokenDTO> => {
            return endpoint.get(`/authorisations/token/${groupId}`);
        },
        getTokenOwner: (token: string): AxiosPromise<ApiTypes.UserSummaryWithEmailAddressDTO[]> => {
            return endpoint.get(`/authorisations/token/${token}/owner`);
        },
        useToken: (token: string) => {
            return endpoint.post(`/authorisations/use_token/${token}`);
        },
        revoke: (userId: number) => {
            return endpoint.delete(`/authorisations/${userId}`);
        },
        release: (userId: number) => {
            return endpoint.delete(`/authorisations/release/${userId}`);
        },
        releaseAll: () => {
            return endpoint.delete(`/authorisations/release/`);
        }
    },
    questions: {
        get: (id: string): AxiosPromise<ApiTypes.IsaacQuestionPageDTO> => {
            return endpoint.get(`/pages/questions/${id}`);
        },
        answer: (id: string, answer: ApiTypes.ChoiceDTO): AxiosPromise<ApiTypes.QuestionValidationResponseDTO> => {
            return endpoint.post(`/questions/${id}/answer`, answer);
        }
    },
    concepts: {
        get: (id: string): AxiosPromise<ApiTypes.IsaacConceptPageDTO> => {
            return endpoint.get(`/pages/concepts/${id}`);
        },
    },
    pages: {
        get: (id: string): AxiosPromise<ApiTypes.IsaacConceptPageDTO> => {
            return endpoint.get(`/pages/${id}`);
        },
    },
    fragments: {
        get: (id: string): AxiosPromise<ApiTypes.IsaacConceptPageDTO> => {
            return endpoint.get(`/pages/fragments/${id}`);
        },
    },
    topics: {
        get: (topicName: TAG_ID): AxiosPromise<ApiTypes.IsaacTopicSummaryPageDTO> => {
            return endpoint.get(`/pages/topics/${topicName}`);
        }
    },
    gameboards: {
        get: (gameboardId: string): AxiosPromise<ApiTypes.GameboardDTO> => {
            return endpoint.get(`/gameboards/${gameboardId}`);
        },
        save: (gameboardId: string) => {
            return endpoint.post(`gameboards/user_gameboards/${gameboardId}`, {});
        }
    },
    assignments: {
        getMyAssignments: (): AxiosPromise<ApiTypes.AssignmentDTO[]> => {
            return endpoint.get(`/assignments`);
        },
        getAssignmentsOwnedByMe: (): AxiosPromise<ApiTypes.AssignmentDTO[]> => {
            return endpoint.get(`/assignments/assign`);
        },
        getProgressForAssignment: (assignment: ApiTypes.AssignmentDTO): AxiosPromise<AppTypes.AppAssignmentProgress[]> => {
            return endpoint.get(`/assignments/assign/${assignment._id}/progress`);
        }
    },
    contentVersion: {
        getLiveVersion: (): AxiosPromise<{ liveVersion: string }> => {
            return endpoint.get(`/info/content_versions/live_version`);
        },
        setLiveVersion(version: string): AxiosPromise {
            return endpoint.post(`/admin/live_version/${version}`);
        }
    },
    constants: {
        getUnits: (): AxiosPromise<string[]> => {
            return endpoint.get(`/content/units`);
        },
        getSegueVersion: (): AxiosPromise<{segueVersion: string}> => {
            return endpoint.get(`/info/segue_version`);
        },
        getSegueEnvironment: (): AxiosPromise<{segueEnvironment: string}> => {
            return endpoint.get(`/info/segue_environment`);
        }
    },
    schools: {
        search: (query: string): AxiosPromise<AppTypes.School[]> => {
            return endpoint.get(`/schools/?query=${encodeURIComponent(query)}`);
        },
        getByUrn: (urn: string): AxiosPromise<AppTypes.School[]> => {
            return endpoint.get(`/schools/?urn=${encodeURIComponent(urn)}`);
        }
    },
    contactForm: {
        send: (extra: any, params: {firstName: string; lastName: string; emailAddress: string; subject: string; message: string }): AxiosPromise => {
            return endpoint.post(`/contact/`, params, {});
        }
    },
    groups: {
        get: (archivedGroupsOnly: boolean): AxiosPromise<ApiTypes.UserGroupDTO[]> => {
            return endpoint.get(`/groups?archived_groups_only=${archivedGroupsOnly}`);
        },
        create: (groupName: string): AxiosPromise<ApiTypes.UserGroupDTO> => {
            return endpoint.post(`/groups`, {groupName});
        },
        delete: (group: ApiTypes.UserGroupDTO): AxiosPromise => {
            return endpoint.delete(`/groups/${group.id}`);
        },
        update: (updatedGroup: AppTypes.AppGroup): AxiosPromise => {
            return endpoint.post(`/groups/${updatedGroup.id}`, {...updatedGroup, members: undefined});
        },
        getMyMemberships: (): AxiosPromise<AppTypes.GroupMembershipDetailDTO[]> => {
            return endpoint.get(`/groups/membership`);
        },
        changeMyMembershipStatus: (groupId: number, newStatus: MEMBERSHIP_STATUS) => {
            return endpoint.post(`/groups/membership/${groupId}/${newStatus}`);
        },
        getMembers: (group: ApiTypes.UserGroupDTO): AxiosPromise<ApiTypes.UserSummaryWithGroupMembershipDTO[]> => {
            return endpoint.get(`/groups/${group.id}/membership`);
        },
        deleteMember: (member: AppTypes.AppGroupMembership): AxiosPromise => {
            const info = member.groupMembershipInformation;
            return endpoint.delete(`/groups/${info.groupId}/membership/${info.userId}`);
        },
        addManager: (group: AppTypes.AppGroup, managerEmail: string): AxiosPromise => {
            return endpoint.post(`/groups/${group.id}/manager`, {email: managerEmail});
        },
        deleteManager: (group: AppTypes.AppGroup, manager: ApiTypes.UserSummaryWithEmailAddressDTO): AxiosPromise => {
            return endpoint.delete(`/groups/${group.id}/manager/${manager.id}`);
        }
    },
    boards: {
        get: (startIndex: number, limit: ActualBoardLimit, sort: BoardOrder): AxiosPromise<ApiTypes.GameboardListDTO> => {
            return endpoint.get(`/gameboards/user_gameboards`, {params: {"start_index": startIndex, limit, sort}});
        },
        delete: (board: ApiTypes.GameboardDTO) => {
            return endpoint.delete(`/gameboards/user_gameboards/${board.id}`);
        },
        getGroupsForBoard: (board: ApiTypes.GameboardDTO): AxiosPromise<{[key: string]: ApiTypes.UserGroupDTO[]}> => {
            return endpoint.get(`/assignments/assign/groups`, {params: {"gameboard_ids": board.id}});
        },
        unassign: (board: ApiTypes.GameboardDTO, group: ApiTypes.UserGroupDTO) => {
            return endpoint.delete(`/assignments/assign/${board.id}/${group.id}`);
        },
        assign: (board: ApiTypes.GameboardDTO, groupId: number, dueDate?: number) => {
            return endpoint.post(`/assignments/assign`, {dueDate, gameboardId: board.id, groupId})
        },
        getById: (boardId: string): AxiosPromise<ApiTypes.GameboardDTO> => {
            return endpoint.get(`/gameboards/${boardId}`);
        }
    },
    logger: {
        log : (eventDetails: object): AxiosPromise<void> => {
            return endpoint.post(`/log`, eventDetails);
        },
    },
};
