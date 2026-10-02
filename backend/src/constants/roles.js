const ROLES = {
  CONSUMER: 'consumer',
  MANUFACTURER: 'manufacturer',
  DISTRIBUTOR: 'distributor',
  RETAILER: 'retailer',
  ADMIN: 'admin',
};

const ALL_ROLES = Object.values(ROLES);

const PARTNER_ROLES = [ROLES.DISTRIBUTOR, ROLES.RETAILER];

module.exports = {
  ROLES,
  ALL_ROLES,
  PARTNER_ROLES,
};
