import React, {useState} from "react";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {Col, Container, Input, Label, Row} from "reactstrap";
import queryString from "query-string";
import {fetchDoc} from "../../state/actions";
import {AppState} from "../../state/reducers";
import {DOCUMENT_TYPE} from "../../services/constants";
import {ifKeyIsEnter} from "../../services/navigation";

import {InequalityModal} from "../elements/modals/InequalityModal";
import katex from "katex";
import {TitleAndBreadcrumb} from "../elements/TitleAndBreadcrumb";


const stateToProps = (state: AppState, {match: {params: {questionId}}, location: {search}}: any) => {
    return {
        doc: state ? state.doc : null,
        urlQuestionId: questionId,
        queryParams: queryString.parse(search)
    };
};
const dispatchToProps = {fetchDoc};

interface EqualityPageProps {
    queryParams: {board?: string, mode?: string, symbols?: string};
    history: any;
    fetchDoc: (documentType: DOCUMENT_TYPE, questionId: string) => void;
}
const EqualityPageComponent = (props: EqualityPageProps) => {
    const {queryParams} = props;

    const [modalVisible, setModalVisible] = useState(false);
    const [initialEditorSymbols, setInitialEditorSymbols] = useState([]);
    const [currentAttempt, setCurrentAttempt] = useState();
    const [editorSyntax, setEditorSyntax] = useState('logic');
    // Does this really need to be a state variable if it is immutable?
    const [editorMode, setEditorMode] = useState(queryParams.mode || 'logic');

    let availableSymbols = queryParams.symbols && queryParams.symbols.split(',').map(s => s.trim());

    let currentAttemptValue: any | undefined;
    if (currentAttempt && currentAttempt.value) {
        try {
            currentAttemptValue = JSON.parse(currentAttempt.value);
        } catch(e) {
            currentAttemptValue = { result: { tex: '\\textrm{PLACEHOLDER HERE}' } };
        }
    }

    const closeModal = () => {
        document.body.style.overflow = "auto";
        setModalVisible(false);
    };

    const previewText = currentAttemptValue && currentAttemptValue.result && currentAttemptValue.result.tex;

    return <div className="pattern-01">
        <Container>
            <Row>
                <Col>
                    <TitleAndBreadcrumb currentPageTitle="Inequality demo page" />
                </Col>
            </Row>
            <Row>
                <Col md={{size: 2}} className="py-4 syntax-picker mode-picker">
                    <div>
                        <Label for="inequality-mode-select">Editor mode:</Label>
                        <Input type="select" name="mode" id="inequality-mode-select" value={editorMode} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditorMode(e.target.value)}>
                            <option value="maths">Maths</option>
                            <option value="chemistry">Chemistry</option>
                            <option value="logic">Boolean Logic</option>
                        </Input>
                    </div>
                    {(editorMode === 'logic') && <div className="mt-4">
                        <Label for="inequality-syntax-select">Boolean Logic Syntax</Label>
                        <Input type="select" name="syntax" id="inequality-syntax-select" value={editorSyntax} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditorSyntax(e.target.value)}>
                            <option value="logic">Boolean Logic</option>
                            <option value="binary">Digital Electronics</option>
                        </Input>
                    </div>}
                </Col>
                <Col md={{size: 8}} className="py-4 question-panel">
                    <div className="equality-page">
                        <Label>&nbsp;</Label>
                        <div
                            role="button" className={`eqn-editor-preview rounded ${!previewText ? 'empty' : ''}`} tabIndex={0}
                            onClick={() => setModalVisible(true)} onKeyDown={ifKeyIsEnter(() => setModalVisible(true))}
                            dangerouslySetInnerHTML={{ __html: previewText ? katex.renderToString(previewText) : 'Click to enter a formula' }}
                        />
                        {modalVisible && <InequalityModal
                            close={closeModal}
                            onEditorStateChange={(state: any) => {
                                setCurrentAttempt({ type: 'logicFormula', value: JSON.stringify(state), pythonExpression: (state && state.result && state.result.python)||"" })
                                setInitialEditorSymbols(state.symbols);
                            }}
                            availableSymbols={availableSymbols || []}
                            initialEditorSymbols={initialEditorSymbols}
                            editorMode={editorMode}
                            logicSyntax={editorSyntax}
                            visible={modalVisible}
                        />}
                    </div>
                </Col>
            </Row>
            {currentAttempt && <Row>
                <Col md={{size: 8, offset: 2}} className="py-4 inequality-results">
                    <h4>Python</h4>
                    <pre>{currentAttemptValue && currentAttemptValue.result && currentAttemptValue.result.python}</pre>
                    <h4>Available symbols</h4>
                    <pre>{currentAttemptValue && currentAttemptValue.result && currentAttemptValue.result.uniqueSymbols}</pre>
                    <h4>Inequality seed</h4>
                    <pre>{currentAttemptValue && currentAttemptValue.symbols && JSON.stringify(currentAttemptValue.symbols)}</pre>
                    <h4>LaTeX</h4>
                    <pre>{currentAttemptValue && currentAttemptValue.result && currentAttemptValue.result.tex}</pre>
                    <h4>MathML</h4>
                    <pre>{currentAttemptValue && currentAttemptValue.result && currentAttemptValue.result.mathml}</pre>
                </Col>
            </Row>}
        </Container>
    </div>;
};

export const Equality = withRouter(connect(stateToProps, dispatchToProps)(EqualityPageComponent));
