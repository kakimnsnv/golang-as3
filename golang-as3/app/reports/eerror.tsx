"use client";
import React from 'react';

interface ErrorProps {
    errorCode: number;
    errorMessage: string;
}

const ErrorPage: React.FC<ErrorProps> = ({ errorCode, errorMessage }) => {
    return (
        <div>
            <h1>Error {errorCode}</h1>
            <p>{errorMessage}</p>
        </div>
    );
};

export default ErrorPage;