import React from 'react';
import Banner from '../components/Banner';

export default function Error() {

    const data = {
        title: "404 - Not Found",
        content: "The page you are looking for cannot be found",
        destination: "/",
        label: "Back to home"
    }

    return (
        <Banner data = {data}></Banner>
    )
}
