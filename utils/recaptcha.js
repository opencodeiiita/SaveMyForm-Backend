const verifycaptcha = async(token) => {
    const secret_key = process.env.GOOGLE_RECAPTCHA_SECRET_KEY;
    const options = {
    url: `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${token}`,
    headers: { "Content-Type": "application/x-www-form-urlencoded", 'json': true }
    }
    try {
        const re = await request(options);
        if (!JSON.parse(re.body)['success']) {
            return false;
        }
        return res.send({ response: "Successful" });
    } catch (error) {
        console.log(error);
        return false;
    }
}

module.exports = verifycaptcha
