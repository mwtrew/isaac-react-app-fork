import React from "react";
import * as RS from "reactstrap";
import * as AppTypes from "../../../../IsaacAppTypes";
import {closeActiveModal} from "../../../state/actions";
import {useDispatch} from "react-redux";
import classNames from "classnames";

interface ActiveModalProps {
    activeModal?: AppTypes.ActiveModal | null;
}

export const ActiveModal = ({activeModal}: ActiveModalProps) => {
    const ModalBody = activeModal && activeModal.body;
    const dispatch = useDispatch();

    const toggle = () => {
        dispatch(closeActiveModal());
    };

    return <RS.Modal toggle={toggle} isOpen={true} size={(activeModal && activeModal.size) || "lg"} centered={activeModal?.centered}>
        {activeModal && <React.Fragment>
            {<RS.ModalHeader
                    className={classNames({"h-title pb-5 mb-4": !!activeModal.title}, {"position-absolute": !activeModal.title})}
                    style={activeModal.title ? {} : {top: 0, width: "100%", height: 0, zIndex: 1}}
                    close={
                        activeModal.closeAction ?
                            <button className="close" onClick={activeModal.closeAction}>
                                {activeModal?.closeLabelOverride || "Close"}
                            </button>
                            :
                            null
                    }
                >
                {activeModal.title}
            </RS.ModalHeader>}
            <RS.ModalBody className={classNames("pb-2 mx-4", {"pt-0": !activeModal.title, "overflow-visible": activeModal?.overflowVisible})}>
                {typeof ModalBody === "function" ? <ModalBody /> : ModalBody}
            </RS.ModalBody>
            {activeModal.buttons &&
                <RS.ModalFooter className="mb-4 mx-2 align-self-center">
                    {activeModal.buttons}
                </RS.ModalFooter>
            }
        </React.Fragment>}
    </RS.Modal>
};
