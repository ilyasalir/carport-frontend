import React from 'react';

export const PlainTextDisplay = ({ htmlContent }: { htmlContent: string }) => {
    const plainText = stripHtml(htmlContent);

    return <div>{plainText}</div>;
};