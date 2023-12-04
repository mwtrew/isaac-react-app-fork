import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { Button } from 'reactstrap';

export const YOUTUBE_COOKIE = "youtubeCookiesAccepted";
export const ANVIL_COOKIE = "anvilCookiesAccepted";

const youtubeHomepageCookieText = <p className="text-muted m-0"><small>We use YouTube to show you videos on our website. By clicking the above, you agree to the <a href="https://policies.google.com/technologies/cookies" target="_blank" rel="noopener noreferrer"><b>Google Cookie Policy</b></a> and <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer"><b>Privacy Policy</b></a>.</small></p>;
const youtubeCookieText = <p>[SAMPLE TEXT] We use YouTube to show you videos on our website. We ask for your permission before loading the content, as YouTube may be using cookies to help them track usage and improve their services.<br/><br/>You may wish to read the <a href="https://policies.google.com/technologies/cookies" target="_blank" rel="noopener noreferrer"><b>Google Cookie Policy</b></a> and <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer"><b>Privacy Policy</b></a> before accepting.</p>;
const anvilCookieText = <p>[SAMPLE TEXT] We use Anvil to show you interactive content on our website. We ask for your permission before loading the content, as Anvil may be using cookies to help them track usage and improve their services.<br/><br/>You may wish to read the <a href="https://anvil.works/privacy" target="_blank" rel="noopener noreferrer"><b>Anvil Privacy Policy</b></a> before accepting.</p>;

const setCookie = (name: string) => {
    Cookies.set(name, "1", { expires: 720 /* days*/ });
};

const isCookieSet = (name: string) => {
    return Cookies.get(name) === "1";
};

export interface InterstitialCookieHandlerProps {
    accepted: boolean;
    beforeAccepted: JSX.Element;
    afterAccepted: JSX.Element;
}

export const InterstitialCookieHandler = (props: InterstitialCookieHandlerProps) => {
    return props.accepted ? <>{props.afterAccepted}</> : <>{props.beforeAccepted}</>;
};

// TODO: image alt text
export const HomepageYoutubeCookieHandler = () => {
    const [accepted, setAccepted] = useState(isCookieSet(YOUTUBE_COOKIE));
    const [autoplay, setAutoplay] = useState(false);
    const [videoActive, setVideoActive] = useState(false);
    const [copyActive, setCopyActive] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);

    return <InterstitialCookieHandler
        accepted={accepted}
        beforeAccepted={<div className="homepage-video">
            <div className="position-relative">
                <div className="youtube-fade" />
                <div className="youtube-header w-100">
                    <div className="d-flex align-items-center">
                        {/* eslint-disable-next-line jsx-a11y/anchor-has-content -- content in css */}
                        <a className="channel-icon" href="https://www.youtube.com/@isaacphysics"/>
                        <a className="video-name" href="https://www.youtube.com/watch?v=kWA2AISiHXQ">Why use Isaac Physics?</a>
                    </div>
                    <div className="copy-container d-flex flex-column align-items-center">
                        <button className={classNames("copy-link m-0", {"copied" : linkCopied}, {"selected" : copyActive})} onClick={() => {
                            navigator.clipboard.writeText("https://www.youtube.com/watch?v=kWA2AISiHXQ");
                            setLinkCopied(true);
                        }} onMouseLeave={() => setLinkCopied(false)}
                        onFocus={() => setCopyActive(true)} onBlur={() => setCopyActive(false)}/>
                        <div className="copy-text">{linkCopied ? "Copied!" : "Copy Link"}</div>
                    </div>
                </div>
                <button className={`youtube-play w-100 h-100 p-0 m-0 ${videoActive ? "selected" : ""}`} type="button" onClick={() => {
                    setCookie(YOUTUBE_COOKIE);
                    setAccepted(true);
                    setAutoplay(true);
                }} onFocus={() => setVideoActive(true)} onBlur={() => setVideoActive(false)}>
                    {/* <img src="" alt="" className="w-100 h-100 youtube-play"/> */}
                </button>
                <img src="/assets/phy/isaac-homepage-video-thumbnail.jpeg" alt="A group of students solving problems at an in-person Isaac event." className="w-100 h-100"/>  
            </div>
            {youtubeHomepageCookieText}
        </div>}
        afterAccepted={<iframe
            title="Isaac Physics introduction video"
            src={`https://www.youtube-nocookie.com/embed/kWA2AISiHXQ?enablejsapi=1&rel=0&fs=1&autoplay=${autoplay ? 1 : 0}&modestbranding=1&origin=home`}
            allowFullScreen className="mw-100"
        />}
    />;
};

export const GenericYoutubeCookieHandler = ({afterAcceptedElement} : {afterAcceptedElement: JSX.Element}) => {
    const [accepted, setAccepted] = React.useState(isCookieSet(YOUTUBE_COOKIE));

    return <InterstitialCookieHandler
        accepted={accepted}
        beforeAccepted={<div className="interstitial-cookie-page">
            <h3>Allow YouTube content?</h3>
            {youtubeCookieText}
            <div className="w-100 d-flex justify-content-center">
                <Button className="" onClick={() => {
                    setCookie(YOUTUBE_COOKIE);
                    setAccepted(true);
                }}>Accept</Button>
            </div>
        </div>}
        afterAccepted={<>{afterAcceptedElement}</>}
    />;
};

export const GenericAnvilCookieHandler = ({afterAcceptedElement} : {afterAcceptedElement: JSX.Element}) => {
    const [accepted, setAccepted] = React.useState(isCookieSet(ANVIL_COOKIE));

    return <InterstitialCookieHandler
        accepted={accepted}
        beforeAccepted={<div className="interstitial-cookie-page">
            <h3>Allow Anvil content?</h3>
            {anvilCookieText}
            <div className="w-100 d-flex justify-content-center">
                <Button onClick={() => {
                    setCookie(ANVIL_COOKIE);
                    setAccepted(true);
                }}>Accept</Button>
            </div>
        </div>}
        afterAccepted={<>{afterAcceptedElement}</>}
    />;
};
