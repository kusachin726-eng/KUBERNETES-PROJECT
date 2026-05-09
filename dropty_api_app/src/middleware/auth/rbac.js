const checkPermission = (feature, operation) => {
    return (req, res, next) => {      
      const permissions = req.userRolePermissions.find(p => p.featureName === feature);
      if (!permissions || !permissions[operation]) {
        return res.status(403).json({ success: false,  message: 'Permission Denied.' });
      }
      next();
    };
  };
  
  module.exports = checkPermission;
  