const validDate = (date) => {
    const givenDate = new Date(date);
    const currentDate = Date.now();

    return givenDate.getTime() > currentDate;
}




module.exports = {validDate};