const csrfProtection = (req, res, next) => {
    if (req.method === 'GET') {
      return next();
    }

    const token = req.headers['x-csrf-token'] || req.headers['x-xsrf-token'];
    if (!token || token !== req.csrfToken()) {
      return res.status(403).json({ error: 'Invalid CSRF token' });
    }
    next();
  };

  module.exports = csrfProtection;