// WIP
function requestContextMiddleware(req, res, next) {
    const context = {
        traceId: uuidv4(),
        endpoint: req.originalUrl,
        method: req.method
    };
    attachContextToRequest(req, context);
    next();
}