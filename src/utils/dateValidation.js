const validDate = (date) => {
    const givenDate = new Date(date);
    const currentDate = Date.now();

    return givenDate.getTime() > currentDate;
}

const getFormattedDate = (date) => {
    const givenDate = new Date(date);
    const year = String(givenDate.getFullYear());
    const month = String(givenDate.getMonth() + 1).padStart(2, '0');
    const day = String(givenDate.getDate()).padStart(2, '0');

    return `${day}-${month}-${year}`;
}


module.exports = {validDate, getFormattedDate};