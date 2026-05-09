const AppError = require('./appError');

function isForeignKeyViolation(err) {
    return (
        err?.name === 'SequelizeForeignKeyConstraintError' ||
        err?.parent?.code === '23503' // Postgres foreign_key_violation
    );
}

function formatForeignKeyViolation(err) {
    const table = err?.table || err?.parent?.table || null;
    const constraint = err?.index || err?.constraint || err?.parent?.constraint || null;

    // Domain-friendly messages for known constraints
    if (constraint === 'admin_permissions_featureId_fkey') {
        return new AppError(
            'Cannot update/delete this feature because it is already assigned in permissions. Remove related permissions first.',
            409
        );
    }

    if (constraint === 'admin_permissions_roleId_fkey') {
        return new AppError(
            'Cannot update/delete this role because it is already assigned in permissions. Remove related permissions first.',
            409
        );
    }

    const generic = table
        ? `Cannot update/delete this record because it is referenced by other records in "${table}".`
        : 'Cannot update/delete this record because it is referenced by other records.';

    return new AppError(generic, 409);
}

const erroProd = (err, res)=>{
    const statusCode = err.statusCode || 500;
    
    if(err.isOperational){        
        res.status(statusCode).json({
            success: false,
            message: err.message
        });
    }else{
        // Avoid leaking internals in production
        console.error(err);
        res.status(statusCode).json({
            success: false,
            message: 'Something went very wrong.'
        });
    }
};

const erroDev = (err, res)=>{
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message,
        stack: err.stack
    });
};

module.exports = (err,req,res, next)=>{
    // Normalize common ORM/DB errors into operational AppErrors
    let normalizedErr = err;
    if (isForeignKeyViolation(err)) {
        normalizedErr = formatForeignKeyViolation(err);
    }

    if(process.env.NODE_ENV==="development"){
        erroDev(normalizedErr, res);
    }else{
        erroProd(normalizedErr, res);
    }
}