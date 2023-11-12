import { UnauthorizedError } from "../errors/customError.js";
import { verifyJWT } from "../utils/tokenUtils.js";
import { updateLastActiveByUserId } from '../services/user.service.js'

export const socketMiddleware = async (socket, next) => {
    const token = socket.handshake.auth.token;
    try {
        const { userId, email } = verifyJWT(token, process.env.JWT_SECRET);
        socket.user = { userId, email };
        await updateLastActiveByUserId(userId)
        next();
    } catch (error) {
        console.log(error)
        const err = new UnauthorizedError('Invalid token at socket')
        next(err);
    }
}

export const socketErrorMiddleware = (req, res, next) => {
    next()
}