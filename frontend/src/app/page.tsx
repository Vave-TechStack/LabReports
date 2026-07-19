'use client';

import { HeroSection } from '@/components/home/HeroSection';
import { LiveStatistics } from '@/components/home/LiveStatistics';
import { HealthPackages } from '@/components/home/HealthPackages';
import { PopularTests } from '@/components/home/PopularTests';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { HowItWorks } from '@/components/home/HowItWorks';
import { SampleCollectionProcess } from '@/components/home/SampleCollectionProcess';
import { DoctorsSection } from '@/components/home/DoctorsSection';
import { CertificationsSection } from '@/components/home/CertificationsSection';
import { HomeCollectionCTA } from '@/components/home/CTASections';
import { CorporateClients } from '@/components/home/CorporateClients';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { BlogSection } from '@/components/home/BlogSection';
import { DownloadReportsCTA } from '@/components/home/CTASections';
import { MobileAppCTA } from '@/components/home/CTASections';
import { ContactSection } from '@/components/home/ContactSection';

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <LiveStatistics />
      <HealthPackages />
      <PopularTests />
      <WhyChooseUs />
      <HowItWorks />
      <SampleCollectionProcess />
      <DoctorsSection />
      <CertificationsSection />
      <HomeCollectionCTA />
      <CorporateClients />
      <TestimonialsSection />
      <BlogSection />
      <DownloadReportsCTA />
      <MobileAppCTA />
      <ContactSection />
    </div>
  );
}
