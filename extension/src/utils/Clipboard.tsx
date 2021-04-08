
export const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
        .then(() => {
            console.log("Copied to clipboard!");
        })
        .catch(err => {
            console.log('Error in copying text: ', err);
        });
}
