import {store} from "../../../state/store";
import {closeActiveModal} from "../../../state/actions";
import React from "react";
import {useSelector} from "react-redux";
import {selectors} from "../../../state/selectors";
import {Col, Row} from "reactstrap";

interface GroupEmailModalProps {
    users?: string[];
}

const CurrentGroupEmailModal = ({users}: GroupEmailModalProps) => {
    const group = useSelector(selectors.groups.current);
    return group && <React.Fragment>
        <Col>
            <Row className="mb-3">
                {users && users.join(", ")}
            </Row>
        </Col>
    </React.Fragment>;
};

export const groupEmailModal = (users?: string[]) => {
    return {
        closeAction: () => {store.dispatch(closeActiveModal())},
        title: "Email Users",
        body: <CurrentGroupEmailModal users={users} />
    }
};
