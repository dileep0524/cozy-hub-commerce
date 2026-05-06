import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import ServicePageTemplate from '@/components/services/ServicePageTemplate';
import { SERVICES_DATA } from '@/data/servicesData';

export async function getStaticPaths() {
  return {
    paths: Object.keys(SERVICES_DATA).map((slug) => ({ params: { slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const service = SERVICES_DATA[params.slug];
  if (!service) return { notFound: true };
  return { props: { service } };
}

export default function ServicePage({ service }) {
  return (
    <>
      <Head>
        <title>{service.title} — CozyHub Commerce</title>
        <meta name="description" content={service.metaDescription} />
      </Head>
      <Layout>
        <ServicePageTemplate service={service} />
      </Layout>
    </>
  );
}
