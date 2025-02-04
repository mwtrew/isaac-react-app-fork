import React from 'react';
import {Link} from "react-router-dom";
import {siteSpecific} from "../../services";
import { Alert } from 'reactstrap';

export const QuestionFinderBanner = () => {
    return <Alert color={siteSpecific("warning", "info")} className={"no-print mt-3"}>
        This page will be removed by the end of 2024; you can <Link to="/questions">find our new and improved question finder here</Link>.
        <br/><Link to="/contact?subject=Old%20question%20finder">Let us know any feedback about this change</Link>.
    </Alert>;
};
