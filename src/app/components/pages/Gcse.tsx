import React from "react";
import {Col, Container, Row} from "reactstrap";
import {TitleAndBreadcrumb} from "../elements/TitleAndBreadcrumb";
import {IsaacCard} from "../content/IsaacCard";

export const Gcse = () => {
    return<Container>
        <Row className="pb-4">
            <Col>
                <TitleAndBreadcrumb currentPageTitle={"GCSE Resources"} />
            </Col>
        </Row>
        <Row className="mb-3">
            <Col>
                <p className="subtitle">
                    Isaac Physics provides you with a huge range of resources to support your learning of Physics, in the classroom or at home – all for free.
                </p>
            </Col>
        </Row>
        <Row className="card-deck isaac-cards-body mb-3">
            <IsaacCard doc={{title: "Physics Skills Mastery", subtitle: "Check your answers to our Mastering Essential GCSE Physics book.",
                clickUrl: "/books/phys_book_gcse", image: {src: "/assets/phy/key_stage_sprite.svg#skills-book-cover"}
            }}/>
            <IsaacCard doc={{title: "Question Finder", subtitle: "Practise your problem solving skills with our level 1 questions.",
                clickUrl: "/gameboards/new", image: {src: "/assets/phy/key_stage_sprite.svg#triple"}
            }}/>
        </Row>
        <Row className="card-deck isaac-cards-body my-3">
            <IsaacCard doc={{title: "Mentoring Scheme", subtitle: "Weekly gameboards guided by an experienced teacher.",
                clickUrl: "/pages/isaac_mentor", image: {src: "/assets/phy/key_stage_sprite.svg#teacher-hat"}
            }}/>
            <IsaacCard doc={{title: "Preparation for A Level", subtitle: "Questions to smooth your transition to A Level or equivalent.",
                clickUrl: "/pages/pre_made_gameboards#gcse_to_alevel", image: {src: "/assets/phy/key_stage_sprite.svg#question"}
            }}/>
        </Row>
        <Row className="card-deck isaac-cards-body mb-5 mt-3">
            <IsaacCard doc={{title: "Quick Quizzes", subtitle: "Revise the equations needed at GCSE with our quick quizzes.",
                clickUrl: "/pages/gcse_quizzes", image: {src: "/assets/phy/key_stage_sprite.svg#lightning"}
            }}/>
            <IsaacCard doc={{title: "Events", subtitle: "Find one of our face-to-face or virtual workshops.",
                clickUrl: "/events?types=student", image: {src: "/assets/phy/teacher_features_sprite.svg#calendar"}
            }}/>
        </Row>
    </Container>
};
