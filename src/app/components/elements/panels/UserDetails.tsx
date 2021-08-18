import {CardBody, Col, FormFeedback, FormGroup, Input, Label, Row} from "reactstrap";
import {SubjectInterests, ValidationUser} from "../../../../IsaacAppTypes";
import {UserFacingRole} from "../../../services/constants";
import React from "react";
import {allRequiredInformationIsPresent, validateEmail,} from "../../../services/validation";
import {SchoolInput} from "../inputs/SchoolInput";
import {DobInput} from "../inputs/DobInput";
import {GenderInput} from "../inputs/GenderInput";
import {UserAuthenticationSettingsDTO, UserContext} from "../../../../IsaacApiTypes";
import {SITE, SITE_SUBJECT, TEACHER_REQUEST_ROUTE} from "../../../services/siteConstants";
import {SubjectInterestTableInput} from "../inputs/SubjectInterestTableInput";
import {Link} from "react-router-dom";
import {UserContextAccountInput} from "../inputs/UserContextAccountInput";

interface UserDetailsProps {
    userToUpdate: ValidationUser;
    setUserToUpdate: (user: any) => void;
    subjectInterests: SubjectInterests;
    setSubjectInterests: (si: SubjectInterests) => void;
    userContexts: UserContext[];
    setUserContexts: (uc: UserContext[]) => void;
    submissionAttempted: boolean;
    editingOtherUser: boolean;
    userAuthSettings: UserAuthenticationSettingsDTO | null;
}

export const UserDetails = (props: UserDetailsProps) => {
    const {
        userToUpdate, setUserToUpdate,
        subjectInterests, setSubjectInterests,
        userContexts, setUserContexts,
        submissionAttempted, editingOtherUser
    } = props;

    const allRequiredFieldsValid =
        userToUpdate?.email && allRequiredInformationIsPresent(userToUpdate, {SUBJECT_INTEREST: subjectInterests, EMAIL_PREFERENCE: null}, userContexts);

    return <CardBody className="pt-0">
        <Row>
            <Col>
                <span className="d-block pb-0 text-right text-muted required-before">
                    Required
                </span>
            </Col>
        </Row>
        <Row className="mb-3">
            <Col>
                Account type: <b>{userToUpdate?.role && UserFacingRole[userToUpdate.role]}</b> {userToUpdate?.role == "STUDENT" && <span>
                    <small>(Are you a teacher? {" "}
                        <Link to={TEACHER_REQUEST_ROUTE} target="_blank">
                            Upgrade your account
                        </Link>{".)"}</small>
                </span>}
            </Col>
        </Row>
        <Row>
            <Col md={6}>
                <FormGroup>
                    <Label htmlFor="first-name-input" className="form-required">First name</Label>
                    <Input
                        id="first-name-input" type="text" name="givenName" maxLength={255}
                        defaultValue={userToUpdate.givenName}
                        onChange={e => setUserToUpdate({...userToUpdate, givenName: e.target.value})}
                        required
                    />
                </FormGroup>
            </Col>
            <Col md={6}>
                <FormGroup>
                    <Label htmlFor="last-name-input" className="form-required">Last name</Label>
                    <Input
                        id="last-name-input" type="text" name="last-name" maxLength={255}
                        defaultValue={userToUpdate.familyName}
                        onChange={e => setUserToUpdate({...userToUpdate, familyName: e.target.value})}
                        required
                    />
                </FormGroup>
            </Col>
        </Row>
        <Row>
            <Col md={6}>
                <FormGroup>
                    <Label htmlFor="email-input" className="form-required">Email address</Label>
                    <Input
                        invalid={!validateEmail(userToUpdate.email)} id="email-input" type="email"
                        name="email" defaultValue={userToUpdate.email}
                        onChange={event => setUserToUpdate({...userToUpdate, email: event.target.value})}
                        aria-describedby="emailValidationMessage" required
                    />
                    <FormFeedback id="emailValidationMessage">
                        {(!validateEmail(userToUpdate.email)) ? "Enter a valid email address" : null}
                    </FormFeedback>
                </FormGroup>
            </Col>
            <Col md={6}>
                <DobInput userToUpdate={userToUpdate} setUserToUpdate={setUserToUpdate} submissionAttempted={submissionAttempted} editingOtherUser={editingOtherUser}/>
            </Col>
        </Row>
        <Row>
            <Col md={6}>
                <GenderInput userToUpdate={userToUpdate} setUserToUpdate={setUserToUpdate} submissionAttempted={submissionAttempted}
                    required={SITE_SUBJECT === SITE.CS}/>
            </Col>
            <Col md={6}>
                <UserContextAccountInput user={userToUpdate} userContexts={userContexts} setUserContexts={setUserContexts} submissionAttempted={submissionAttempted} />
            </Col>
            <Col md={6}>
                <SchoolInput userToUpdate={userToUpdate} setUserToUpdate={setUserToUpdate} submissionAttempted={submissionAttempted}
                    required={SITE_SUBJECT === SITE.CS}/>
            </Col>
        </Row>
        {SITE_SUBJECT === SITE.PHY && !editingOtherUser && <Row className="mt-3">
            <Col>
                <SubjectInterestTableInput stateObject={subjectInterests} setStateFunction={setSubjectInterests}/>
            </Col>
        </Row>}

        {submissionAttempted && !allRequiredFieldsValid && <h4 role="alert" className="text-danger text-center mt-4 mb-3">
            Required information in this form is not set
        </h4>}
    </CardBody>
};
