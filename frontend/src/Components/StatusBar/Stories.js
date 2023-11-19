import React, { useRef, useState } from 'react'
import { Avatar } from "@material-ui/core"
import styles from "./Stories.module.css"
import Stories from 'react-insta-stories';
import { useEffect } from 'react';
const StoriesPage = ({ setIsOpen, statusUrls }) => {
    const story = useRef()


    const [divHeight, setDivHeight] = useState();
    const [divWidth, setDivWidth] = useState()
    const [width, setWidth] = useState();
    const [height, setHeight] = useState();

    useEffect(() => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
    });
    const updateDimensions = () => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
    };
    const updateHeight = () => {
        setHeight(window.innerHeight);
    };
    const updateWidth = () => {
        setWidth(window.innerWidth);
    };

    useEffect(() => {
        window.addEventListener("resize", updateHeight);
        window.addEventListener("resize", updateWidth);
        return () => {
            window.removeEventListener("resize", updateDimensions);
        };
    }, [width, height]);

    useEffect(() => {
        if (width > 500 && width < height) {
            setDivWidth(0.34 * width);
            setDivHeight(0.34 * width / 0.5625);
        } else if (width > 500 && width > height) {
            setDivHeight(0.92 * height);
            setDivWidth(0.92 * height * 0.5625)
        } else {
            setDivWidth(width)
            setDivHeight(height)
        }

    }, [width, height]);

    return (
        <>
            <div className={styles.darkBG} onClick={() => setIsOpen(false)} />
            <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
                <svg
                    aria-label="Close"
                    class="fg7vo5n6 lrzqjn8y"
                    color="#ffffff"
                    fill="#ffffff"
                    height="18"
                    role="img"
                    viewBox="0 0 48 48"
                    width="18"
                >
                    <title>Close</title>
                    <path
                        clip-rule="evenodd"
                        d="M41.8 9.8L27.5 24l14.2 14.2c.6.6.6 1.5 0 2.1l-1.4 1.4c-.6.6-1.5.6-2.1 0L24 27.5 9.8 41.8c-.6.6-1.5.6-2.1 0l-1.4-1.4c-.6-.6-.6-1.5 0-2.1L20.5 24 6.2 9.8c-.6-.6-.6-1.5 0-2.1l1.4-1.4c.6-.6 1.5-.6 2.1 0L24 20.5 38.3 6.2c.6-.6 1.5-.6 2.1 0l1.4 1.4c.6.6.6 1.6 0 2.2z"
                        fill-rule="evenodd"
                    ></path>
                </svg>
            </button>
            <div className={styles.modal}>
                <Stories
                    keyboardNavigation
                    stories={statusUrls}
                    defaultInterval={1500}
                    width={divWidth}
                    height={divHeight}
                    loop={true}
                />
            </div>
        </>
    )
}

export default StoriesPage