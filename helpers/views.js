export const SimpleView = (content) => {
    return `
        <html>
            <body style="padding: 33px; display:flex; flex-direction: column">
                <p style="font-size: 23px; text-indent: 20px">${content}</p>
            </body>
        </html>
    `
}
