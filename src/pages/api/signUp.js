import { google } from "googleapis";

async function signUpHandler(req, res) {

    if (req.method == 'POST'){
        const username = req.body['username']
        const password = req.body['password']
        const passwordConfirm = req.body['passwordConfirm']

    }


}

export default signUpHandler;