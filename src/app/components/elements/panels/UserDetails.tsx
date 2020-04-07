import {CardBody, Col, FormFeedback, FormGroup, Input, Label, Row, Table} from "reactstrap";
import {SubjectInterests, ValidationUser} from "../../../../IsaacAppTypes";
import {EXAM_BOARD} from "../../../services/constants";
import React, {ChangeEvent} from "react";
import {allRequiredInformationIsPresent, validateEmail, validateExamBoard,} from "../../../services/validation";
import {SchoolInput} from "../inputs/SchoolInput";
import {DobInput} from "../inputs/DobInput";
import {StudyingCsInput} from "../inputs/StudyingCsInput";
import {GenderInput} from "../inputs/GenderInput";
import {UserAuthenticationSettingsDTO} from "../../../../IsaacApiTypes";
import {SITE, SITE_SUBJECT} from "../../../services/siteConstants";
import {SubjectInterestInput} from "../inputs/subjectInterestInput";

interface UserDetailsProps {
    userToUpdate: ValidationUser;
    setUserToUpdate: (user: any) => void;
    subjectInterests: SubjectInterests;
    setSubjectInterests: (si: SubjectInterests) => void;
    submissionAttempted: boolean;
    editingOtherUser: boolean;
    userAuthSettings: UserAuthenticationSettingsDTO | null;
}

export const UserDetails = (props: UserDetailsProps) => {
    const {
        userToUpdate, setUserToUpdate,
        subjectInterests, setSubjectInterests,
        submissionAttempted, editingOtherUser
    } = props;

    console.log(subjectInterests);

    const allRequiredFieldsValid = userToUpdate && userToUpdate.email &&
        allRequiredInformationIsPresent(userToUpdate, {SUBJECT_INTEREST: subjectInterests, EMAIL_PREFERENCE: null});

    return <CardBody className="pt-0">
        <Row>
            <Col>
                <span className="d-block pb-0 text-right text-muted required-before">
                    Required
                </span>
            </Col>
        </Row>

        <Row>
            <Col md={6}>
                <FormGroup>
                    <Label htmlFor="first-name-input" className="form-required">First name</Label>
                    <Input
                        id="first-name-input" type="text" name="givenName" maxLength={255}
                        defaultValue={userToUpdate.givenName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setUserToUpdate(Object.assign({}, userToUpdate, {givenName: e.target.value}))
                        }}
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
                        onChange={(e:  React.ChangeEvent<HTMLInputElement>) => {
                            setUserToUpdate(Object.assign({}, userToUpdate, {familyName: e.target.value}))
                        }}
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
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setUserToUpdate(Object.assign({}, userToUpdate, {email: event.target.value}))
                        }}
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
            {SITE_SUBJECT === SITE.CS && <Col md={6}>
                <FormGroup>
                    <Label className="d-inline-block pr-2 form-required" htmlFor="exam-board-select">
                        Exam board
                    </Label>
                    <Input
                        type="select" name="select" id="exam-board-select"
                        value={userToUpdate.examBoard}
                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                            setUserToUpdate(
                                Object.assign({}, userToUpdate, {examBoard: event.target.value})
                            )
                        }
                        invalid={submissionAttempted && !validateExamBoard(userToUpdate)}
                    >
                        <option value={undefined}></option>
                        <option value={EXAM_BOARD.OTHER}>Other</option>
                        <option value={EXAM_BOARD.AQA}>{EXAM_BOARD.AQA}</option>
                        <option value={EXAM_BOARD.OCR}>{EXAM_BOARD.OCR}</option>
                    </Input>
                </FormGroup>
            </Col>}
            <Col md={6}>
                <SchoolInput userToUpdate={userToUpdate} setUserToUpdate={setUserToUpdate} submissionAttempted={submissionAttempted}
                    required={SITE_SUBJECT === SITE.CS}/>
            </Col>
            {SITE_SUBJECT === SITE.CS && <Col md={6}>
                <div className="mt-2 mb-2 pt-1">
                    <StudyingCsInput subjectInterests={subjectInterests} setSubjectInterests={setSubjectInterests} submissionAttempted={submissionAttempted} />
                </div>
            </Col>}
        </Row>
        {SITE_SUBJECT === SITE.PHY && <Row>
            <Col>
                <FormGroup>
                    <Table>
                        <thead>
                            <tr>
                                <th/>
                                <th>GCSE</th>
                                <th>A Level</th>
                                <th>University</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th scope="row">Physics</th>
                                <td><SubjectInterestInput stateObject={subjectInterests} propertyName={"PHYSICS_GCSE"} setStateFunction={setSubjectInterests}/></td>
                                <td><SubjectInterestInput stateObject={subjectInterests} propertyName={"PHYSICS_ALEVEL"} setStateFunction={setSubjectInterests}/></td>
                                <td><SubjectInterestInput stateObject={subjectInterests} propertyName={"PHYSICS_UNI"} setStateFunction={setSubjectInterests}/></td>
                            </tr>
                            <tr>
                                <th scope="row">Chemistry</th>
                                <td><SubjectInterestInput stateObject={subjectInterests} propertyName={"CHEMISTRY_GCSE"} setStateFunction={setSubjectInterests}/></td>
                                <td><SubjectInterestInput stateObject={subjectInterests} propertyName={"CHEMISTRY_ALEVEL"} setStateFunction={setSubjectInterests}/></td>
                                <td><SubjectInterestInput stateObject={subjectInterests} propertyName={"CHEMISTRY_UNI"} setStateFunction={setSubjectInterests}/></td>
                            </tr>
                            <tr>
                                <th scope="row">Maths</th>
                                <td><SubjectInterestInput stateObject={subjectInterests} propertyName={"MATHS_GCSE"} setStateFunction={setSubjectInterests}/></td>
                                <td><SubjectInterestInput stateObject={subjectInterests} propertyName={"MATHS_ALEVEL"} setStateFunction={setSubjectInterests}/></td>
                                <td><SubjectInterestInput stateObject={subjectInterests} propertyName={"MATHS_UNI"} setStateFunction={setSubjectInterests}/></td>
                            </tr>
                            <tr>
                                <th scope="row">Engineering</th>
                                <td/>
                                <td/>
                                <td><SubjectInterestInput stateObject={subjectInterests} propertyName={"ENGINEERING_UNI"} setStateFunction={setSubjectInterests}/></td>
                            </tr>
                        </tbody>
                    </Table>
                </FormGroup>
            </Col>
        </Row>}

        {userToUpdate && userToUpdate.role == "STUDENT" && <Row>
            <Col className="text-muted text-center mt-2">
                Are you a teacher? {" "}
                <a href="/pages/teacher_accounts" target="_blank" rel="noopener noreferrer">
                    <span className='sr-only'> Are you a teacher? </span>
                    Let us know
                </a> {" "}
                and we&apos;ll convert your account to a teacher account.
            </Col>
        </Row>}

        {submissionAttempted && !allRequiredFieldsValid && <h4 role="alert" className="text-danger text-center mt-4 mb-3">
            Required information in this form is not set
        </h4>}
    </CardBody>
};
