function formatErrorResponse(res, code, message) {
    const error = {
        error: {
            status: code,
            message: message
        }
    };

    return res.status(code).send(error);
}

function formatSuccessResponse(res, code, payload) {
    const success = {
        success: {
            status: code,
            payload: payload
        }
    }

    return res.status(code).send(success);
}

module.exports = { formatErrorResponse, formatSuccessResponse };