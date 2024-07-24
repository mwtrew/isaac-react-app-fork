import React from "react";
import {IsaacCard} from "./IsaacCard";
import {IsaacCardDeckDTO} from "../../../IsaacApiTypes";
import {Col, Container, Row} from "reactstrap";
import classNames from "classnames";
import {isAda, isPhy} from "../../services";

interface IsaacCardDeckProps {
    doc: IsaacCardDeckDTO,
    className?: string
    containerClassName?: string
}

export const IsaacCardDeck = ({doc, className, containerClassName}: IsaacCardDeckProps) => {
    return <Container className={classNames("px-0", containerClassName)}>
        {doc.title && <Row className="my-4">
            <Col>
                <h3 className={classNames("h-title", {"text-center": isPhy})}>{doc.title}</h3>
            </Col>
        </Row>}
        <Row xs={12} className={classNames("d-flex flex-row card-deck row-cols-1 row-cols-sm-2 row-cols-xl-3 justify-content-between", {"my-3" : isAda}, {"isaac-cards-body" : isPhy}, className)}>
            {doc?.cards?.map((props, i) => <Container key={i} className="card-container p-3"> 
                <IsaacCard doc={props} imageClassName={props.imageClassName}/>
            </Container>)}
        </Row>
    </Container>;
};