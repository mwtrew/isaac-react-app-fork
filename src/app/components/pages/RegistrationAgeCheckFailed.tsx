import React, {useState} from "react";
import {Button, Card, CardBody, Col, Container, Form, FormGroup, Input, Label, Row} from "reactstrap";
import {history, SITE_TITLE} from "../../services";
import {TitleAndBreadcrumb} from "../elements/TitleAndBreadcrumb";

export const RegistrationAgeCheckFailed = () => {

    const returnToHomepage = (event: React.MouseEvent) => {
        event.preventDefault();
        history.push("/");
    };

    return <Container>
        <TitleAndBreadcrumb currentPageTitle={`Create an ${SITE_TITLE} account`} className="mb-4" />
        <Card className="my-5">
            <CardBody>
                <h3>Unable to create account</h3>
                <p>Unfortunately we are unable to offer accounts to students under 13 years old.</p>
                <p><b>However, you can still access the whole site for free!</b> However you will not be able to track your progress.</p>
                <hr />
                <Row className="justify-content-end">
                    <Col xs={6} lg={2}>
                        <Button outline color="secondary" onClick={history.goBack}>Back</Button>
                    </Col>
                    <Col xs={6} lg={3}>
                        <Button color="primary" onClick={returnToHomepage}>Home</Button>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    </Container>
}