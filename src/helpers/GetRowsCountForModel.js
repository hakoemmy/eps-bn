import models from '../models';

export const getRowsCountPerModel = async (modelName, where, attribute, includes, groupBy) => {
    const loadBonuses = await models?.[modelName].findAll({
        where,
        include: includes,
        attributes: attribute,
        group: groupBy,
        raw: true
      });
      return loadBonuses.length;
} 
