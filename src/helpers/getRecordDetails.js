import models from '../models';

export const getRecordDetails = async (modelName, where, excludes, includes) => {
    const details = await models?.[modelName].findAll({
        where,
        attributes: excludes,
        include: includes,
      });
      return details;
} 
