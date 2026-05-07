import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import ServicePageTemplate from '@/components/services/ServicePageTemplate';
import { MANAGEMENT_DATA } from '@/data/managementData';

export async function getStaticPaths() {
  return {
    paths: Object.keys(MANAGEMENT_DATA).map((slug) => ({ params: { slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const service = MANAGEMENT_DATA[params.slug];
  if (!service) return { notFound: true };
  return { props: { service } };
}

export default function ManagementPage({ service }) {
  return (
    <>
      <Head>
        <title>{`${service.title} — CozyHub Commerce`}</title>
        <meta name="description" content={service.metaDescription} />
      </Head>
      <Layout>
        <ServicePageTemplate service={service} />
      </Layout>
    </>
  );
}
