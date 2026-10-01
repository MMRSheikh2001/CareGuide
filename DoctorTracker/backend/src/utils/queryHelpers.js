

const getPagination = (query) => {
    const page = Math.max(parseInt(query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(query.limit) || 10, 1), 50);
    return { page, limit, skip: (page - 1) * limit };
};

const buildMeta = (total, page, limit) => ({
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
});

const buildDateRange = (from, to) => {
    if (!from && !to) return null;
    const range = {};
    if (from) range.$gte = new Date(from);
    if (to) {
        const end = new Date(to);
        end.setUTCHours(23, 59, 59, 999);
        range.$lte = end;
    }
    return range;
};

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

module.exports = { getPagination, buildMeta, buildDateRange,escapeRegex };