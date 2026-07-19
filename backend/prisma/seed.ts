import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data
  await prisma.$transaction([
    prisma.bookingPackage.deleteMany(),
    prisma.bookingTest.deleteMany(),
    prisma.booking.deleteMany(),
    prisma.report.deleteMany(),
    prisma.invoice.deleteMany(),
    prisma.payment.deleteMany(),
    prisma.sampleEntry.deleteMany(),
    prisma.doctorBranch.deleteMany(),
    prisma.inventory.deleteMany(),
    prisma.supplier.deleteMany(),
    prisma.attendance.deleteMany(),
    prisma.auditLog.deleteMany(),
    prisma.notification.deleteMany(),
    prisma.contactMessage.deleteMany(),
    prisma.blog.deleteMany(),
    prisma.testimonial.deleteMany(),
    prisma.fAQ.deleteMany(),
    prisma.career.deleteMany(),
    prisma.healthPackageTest.deleteMany(),
    prisma.healthPackage.deleteMany(),
    prisma.test.deleteMany(),
    prisma.testCategory.deleteMany(),
    prisma.labAssistant.deleteMany(),
    prisma.doctor.deleteMany(),
    prisma.patient.deleteMany(),
    prisma.employee.deleteMany(),
    prisma.oTP.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  // Create admin user
  const adminPassword = await bcrypt.hash('Admin@123', 12);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@medilab.com',
      phone: '+919999999999',
      password: adminPassword,
      role: 'SUPER_ADMIN',
      isVerified: true,
    },
  });

  // Create test categories
  const categories = await Promise.all([
    prisma.testCategory.create({ data: { name: 'Complete Blood Count', slug: 'complete-blood-count', description: 'Basic blood tests to evaluate overall health', sortOrder: 1 } }),
    prisma.testCategory.create({ data: { name: 'Diabetes', slug: 'diabetes', description: 'Blood sugar and diabetes monitoring tests', sortOrder: 2 } }),
    prisma.testCategory.create({ data: { name: 'Thyroid', slug: 'thyroid', description: 'Thyroid function tests', sortOrder: 3 } }),
    prisma.testCategory.create({ data: { name: 'Lipid Profile', slug: 'lipid-profile', description: 'Cholesterol and lipid tests', sortOrder: 4 } }),
    prisma.testCategory.create({ data: { name: 'Liver Function', slug: 'liver-function', description: 'Liver health assessment tests', sortOrder: 5 } }),
    prisma.testCategory.create({ data: { name: 'Kidney Function', slug: 'kidney-function', description: 'Kidney health assessment tests', sortOrder: 6 } }),
    prisma.testCategory.create({ data: { name: 'Vitamin & Minerals', slug: 'vitamin-minerals', description: 'Vitamin and mineral deficiency tests', sortOrder: 7 } }),
    prisma.testCategory.create({ data: { name: 'Infectious Diseases', slug: 'infectious-diseases', description: 'Infection detection tests', sortOrder: 8 } }),
  ]);

  // Create tests
  const tests = await Promise.all([
    prisma.test.create({ data: { name: 'Complete Blood Count (CBC)', code: 'CBC', categoryId: categories[0].id, description: 'Measures different components of blood including RBC, WBC, hemoglobin, and platelets.', shortDescription: 'Basic blood health assessment', price: 500, discountPrice: 350, reportTime: '6 hours', sampleType: 'BLOOD', isPopular: true, isFeatured: true, parameters: [{ name: 'Hemoglobin', unit: 'g/dL', referenceRange: '13-17', minValue: 13, maxValue: 17 }, { name: 'WBC Count', unit: 'cells/µL', referenceRange: '4000-11000', minValue: 4000, maxValue: 11000 }, { name: 'Platelet Count', unit: 'cells/µL', referenceRange: '1.5-4.5 lakhs', minValue: 150000, maxValue: 450000 }] } }),
    prisma.test.create({ data: { name: 'Thyroid Profile (T3, T4, TSH)', code: 'THYROID', categoryId: categories[2].id, description: 'Complete thyroid function assessment including T3, T4, and TSH levels.', shortDescription: 'Thyroid function check', price: 800, discountPrice: 599, reportTime: '12 hours', sampleType: 'BLOOD', isPopular: true, parameters: [{ name: 'TSH', unit: 'mIU/L', referenceRange: '0.5-5.0', minValue: 0.5, maxValue: 5.0 }] } }),
    prisma.test.create({ data: { name: 'Fasting Blood Sugar (FBS)', code: 'FBS', categoryId: categories[1].id, description: 'Measures blood glucose after fasting for 8-12 hours.', shortDescription: 'Blood sugar fasting test', price: 150, discountPrice: 100, reportTime: '6 hours', sampleType: 'BLOOD', isPopular: true, preparationInstructions: 'Fast for 8-12 hours before test' } }),
    prisma.test.create({ data: { name: 'HbA1c', code: 'HBA1C', categoryId: categories[1].id, description: 'Measures average blood sugar levels over the past 2-3 months.', shortDescription: 'Average blood sugar test', price: 600, discountPrice: 450, reportTime: '12 hours', sampleType: 'BLOOD', isPopular: true } }),
    prisma.test.create({ data: { name: 'Lipid Profile', code: 'LIPID', categoryId: categories[3].id, description: 'Complete cholesterol and triglyceride assessment.', shortDescription: 'Cholesterol test', price: 550, discountPrice: 399, reportTime: '12 hours', sampleType: 'BLOOD', isPopular: true, preparationInstructions: 'Fast for 9-12 hours before test' } }),
    prisma.test.create({ data: { name: 'Liver Function Test (LFT)', code: 'LFT', categoryId: categories[4].id, description: 'Assesses liver health by measuring enzymes, proteins, and bilirubin.', shortDescription: 'Liver health assessment', price: 600, discountPrice: 450, reportTime: '12 hours', sampleType: 'BLOOD', isPopular: true } }),
    prisma.test.create({ data: { name: 'Kidney Function Test (KFT)', code: 'KFT', categoryId: categories[5].id, description: 'Evaluates kidney function through blood urea, creatinine, and electrolyte levels.', shortDescription: 'Kidney health check', price: 500, discountPrice: 380, reportTime: '12 hours', sampleType: 'BLOOD', isPopular: true } }),
    prisma.test.create({ data: { name: 'Vitamin D Test', code: 'VITD', categoryId: categories[6].id, description: 'Measures vitamin D levels in blood.', shortDescription: 'Vitamin D deficiency check', price: 1200, discountPrice: 899, reportTime: '24 hours', sampleType: 'BLOOD', isPopular: true } }),
    prisma.test.create({ data: { name: 'Vitamin B12 Test', code: 'VITB12', categoryId: categories[6].id, description: 'Measures vitamin B12 levels in blood.', shortDescription: 'Vitamin B12 check', price: 1000, discountPrice: 750, reportTime: '24 hours', sampleType: 'BLOOD', isPopular: true } }),
    prisma.test.create({ data: { name: 'Malaria Test', code: 'MALARIA', categoryId: categories[7].id, description: 'Detection of malaria parasite in blood.', shortDescription: 'Malaria detection', price: 350, discountPrice: 250, reportTime: '6 hours', sampleType: 'BLOOD' } }),
    prisma.test.create({ data: { name: 'Dengue Test (NS1)', code: 'DENGUE', categoryId: categories[7].id, description: 'Early detection of dengue virus NS1 antigen.', shortDescription: 'Dengue detection', price: 800, discountPrice: 599, reportTime: '12 hours', sampleType: 'BLOOD' } }),
    prisma.test.create({ data: { name: 'Urine Routine Analysis', code: 'URINE', categoryId: categories[0].id, description: 'Complete urine analysis for various health indicators.', shortDescription: 'Urine health check', price: 200, discountPrice: 150, reportTime: '6 hours', sampleType: 'URINE' } }),
  ]);

  // Create health packages
  await Promise.all([
    prisma.healthPackage.create({
      data: { name: 'Basic Health Checkup', slug: 'basic-health-checkup', description: 'Essential health screening package covering CBC, blood sugar, and urine analysis.', shortDescription: 'Essential health screening', price: 1500, discountPrice: 999, reportTime: '24 hours', isPopular: true,
        tests: { create: [{ testId: tests[0].id }, { testId: tests[2].id }, { testId: tests[11].id }] },
      },
    }),
    prisma.healthPackage.create({
      data: { name: 'Comprehensive Full Body Checkup', slug: 'comprehensive-full-body-checkup', description: 'Complete health assessment with 40+ parameters including CBC, thyroid, lipid, liver, and kidney function.', shortDescription: 'Complete health assessment - 40+ parameters', price: 4000, discountPrice: 2499, reportTime: '36 hours', isPopular: true, image: '/images/packages/full-body-checkup.jpg',
        tests: { create: [{ testId: tests[0].id }, { testId: tests[1].id }, { testId: tests[3].id }, { testId: tests[4].id }, { testId: tests[5].id }, { testId: tests[6].id }, { testId: tests[11].id }] },
      },
    }),
    prisma.healthPackage.create({
      data: { name: 'Diabetes Care Package', slug: 'diabetes-care-package', description: 'Complete diabetes monitoring package with FBS, HbA1c, lipid profile, and kidney function.', shortDescription: 'Diabetes monitoring', price: 2500, discountPrice: 1799, reportTime: '24 hours', isPopular: true,
        tests: { create: [{ testId: tests[2].id }, { testId: tests[3].id }, { testId: tests[4].id }, { testId: tests[6].id }] },
      },
    }),
    prisma.healthPackage.create({
      data: { name: 'Heart Health Package', slug: 'heart-health-package', description: 'Comprehensive cardiac risk assessment with lipid profile, ECG, and cardiac enzymes.', shortDescription: 'Cardiac risk assessment', price: 3000, discountPrice: 1999, reportTime: '24 hours', isPopular: true,
        tests: { create: [{ testId: tests[4].id }, { testId: tests[5].id }, { testId: tests[6].id }] },
      },
    }),
    prisma.healthPackage.create({
      data: { name: 'Women Wellness Package', slug: 'women-wellness-package', description: 'Specialized health checkup for women including thyroid, vitamins, and complete blood count.', shortDescription: 'Women health checkup', price: 3500, discountPrice: 2499, reportTime: '36 hours',
        tests: { create: [{ testId: tests[0].id }, { testId: tests[1].id }, { testId: tests[7].id }, { testId: tests[8].id }] },
      },
    }),
    prisma.healthPackage.create({
      data: { name: 'Senior Citizen Checkup', slug: 'senior-citizen-checkup', description: 'Comprehensive health checkup designed for senior citizens with all major health parameters.', shortDescription: 'Senior health assessment', price: 5000, discountPrice: 3499, reportTime: '48 hours', isPopular: true,
        tests: { create: [{ testId: tests[0].id }, { testId: tests[1].id }, { testId: tests[3].id }, { testId: tests[4].id }, { testId: tests[5].id }, { testId: tests[6].id }, { testId: tests[7].id }, { testId: tests[8].id }] },
      },
    }),
  ]);

  // Create testimonials
  await Promise.all([
    prisma.testimonial.create({ data: { name: 'Priya Sharma', role: 'Patient', content: 'Excellent service! The home collection was punctual and the reports were delivered on time. Highly professional team.', rating: 5, isFeatured: true } }),
    prisma.testimonial.create({ data: { name: 'Rajesh Kumar', role: 'Patient', content: 'Very accurate results and quick turnaround time. The online report download feature is very convenient.', rating: 5, isFeatured: true } }),
    prisma.testimonial.create({ data: { name: 'Dr. Ananya Patel', role: 'Physician', content: 'As a doctor, I appreciate the precision and reliability of their test results. My go-to lab for all patient investigations.', rating: 5, isFeatured: true } }),
    prisma.testimonial.create({ data: { name: 'Suresh Reddy', role: 'Patient', content: 'The comprehensive health package saved me money and gave me a complete picture of my health. Highly recommended!', rating: 5, isFeatured: true } }),
    prisma.testimonial.create({ data: { name: 'Lakshmi Devi', role: 'Patient', content: 'Very friendly staff at the collection center. They made the process comfortable and explained everything clearly.', rating: 4, isFeatured: true } }),
  ]);

  // Create FAQs
  await Promise.all([
    prisma.fAQ.create({ data: { question: 'How do I book a blood test?', answer: 'You can book a blood test through our website by selecting the tests you need, choosing an appointment time, and completing the payment online. You can also book by calling our helpline.', category: 'Bookings', sortOrder: 1, isActive: true } }),
    prisma.fAQ.create({ data: { question: 'Do I need to fast before a blood test?', answer: 'Some tests require fasting (usually 8-12 hours). Tests like Fasting Blood Sugar, Lipid Profile, and certain metabolic panels require fasting. Upon booking, you will receive specific instructions for each test.', category: 'Tests', sortOrder: 2, isActive: true } }),
    prisma.fAQ.create({ data: { question: 'How long does it take to get reports?', answer: 'Most routine reports are available within 6-24 hours. Specialized tests may take 24-48 hours. You will receive a notification via WhatsApp/Email when your reports are ready.', category: 'Reports', sortOrder: 3, isActive: true } }),
    prisma.fAQ.create({ data: { question: 'Is home sample collection available?', answer: 'Yes, we offer free home sample collection services. Our trained phlebotomists will visit your home at the scheduled time to collect samples.', category: 'Services', sortOrder: 4, isActive: true } }),
    prisma.fAQ.create({ data: { question: 'How can I download my reports?', answer: 'You can download your reports by logging into our patient portal using your registered mobile number and OTP. All your past reports and medical history are available for download.', category: 'Reports', sortOrder: 5, isActive: true } }),
    prisma.fAQ.create({ data: { question: 'What payment methods do you accept?', answer: 'We accept all major payment methods including Credit/Debit Cards, Net Banking, UPI (Google Pay, PhonePe, Paytm), and Digital Wallets.', category: 'Payments', sortOrder: 6, isActive: true } }),
  ]);

  // Create blog posts
  await Promise.all([
    prisma.blog.create({
      data: { title: 'Understanding Your Blood Test Results: A Complete Guide', slug: 'understanding-blood-test-results', excerpt: 'Learn how to read and understand common blood test parameters including CBC, lipid profile, and thyroid function tests.', content: 'Blood tests are essential diagnostic tools that provide valuable insights into your health...', author: 'Dr. Meera Venkatesh', tags: ['Blood Tests', 'Health Guide', 'Diagnostics'], published: true, publishedAt: new Date() },
    }),
    prisma.blog.create({
      data: { title: 'Why Regular Health Checkups Are Important for Preventive Care', slug: 'regular-health-checkups-importance', excerpt: 'Discover why scheduling regular health checkups can help detect health issues early and maintain optimal wellness.', content: 'Preventive healthcare is the foundation of a healthy life. Regular health checkups...', author: 'Dr. Arjun Singh', tags: ['Preventive Care', 'Health Checkup', 'Wellness'], published: true, publishedAt: new Date() },
    }),
    prisma.blog.create({
      data: { title: 'The Role of Vitamin D in Immune Health', slug: 'vitamin-d-immune-health', excerpt: 'Understanding the crucial role Vitamin D plays in maintaining a strong immune system and overall health.', content: 'Vitamin D, often called the sunshine vitamin, plays a crucial role in maintaining...', author: 'Dr. Priya Nair', tags: ['Vitamin D', 'Immunity', 'Nutrition'], published: true, publishedAt: new Date() },
    }),
  ]);

  // Create a branch
  await prisma.branch.create({
    data: {
      name: 'MediLab Diagnostics - Main Lab',
      code: 'ML001',
      address: '42, Tech Park Boulevard, Whitefield',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560066',
      phone: '+918088000100',
      email: 'bangalore@medilab.com',
      latitude: 12.9716,
      longitude: 77.5946,
      isMainLab: true,
    },
  });

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
