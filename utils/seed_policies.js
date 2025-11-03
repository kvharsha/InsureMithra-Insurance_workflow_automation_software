const Policy = require('../models/policy.model');

async function seedPoliciesIfEmpty(logger = console) {
  const count = await Policy.countDocuments();
  if (count > 0) {
    logger.log(`[seed] Policies exist: ${count}, skipping seed.`);
    return;
  }

  const sample = [
    {
      name: 'ICICI Lombard Life Secure',
      type: 'Life',
      insurer: 'ICICI Lombard',
      premium: 1200,
      sumAssured: 500000,
      description: 'Affordable life plan from ICICI Lombard with flexible benefits.',
    },
    {
      name: 'HDFC ERGO Health Plus',
      type: 'Health',
      insurer: 'HDFC ERGO',
      premium: 800,
      sumAssured: 300000,
      description: 'Comprehensive health coverage with cashless network.',
    },
    {
      name: 'LIC Jeevan Anand',
      type: 'Life',
      insurer: 'LIC',
      premium: 1500,
      sumAssured: 700000,
      description: 'Popular LIC life insurance plan with bonuses.',
    },
    {
      name: 'Tata AIG Travel Guard',
      type: 'Travel',
      insurer: 'Tata AIG',
      premium: 600,
      sumAssured: 100000,
      description: 'Travel policy covering medical and trip inconveniences.',
    },
  ];

  await Policy.insertMany(sample);
  logger.log(`[seed] Inserted ${sample.length} sample policies.`);
}

module.exports = { seedPoliciesIfEmpty };


