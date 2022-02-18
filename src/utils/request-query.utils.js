module.exports = {
  createPageLimitOption(page, limit) {
    let limitOption = {};

    page = Number(page);
    limit = Number(limit);

    page = page >= 1 ? page : 1;

    if (limit >= 0) {
      limitOption = {
        offset: (page - 1) * limit,
        limit: limit,
      };
    }

    return limitOption;
  },
};
