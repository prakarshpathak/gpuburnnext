import { Provider } from '@/types';

export const providers: Provider[] = [
  {
    id: 'aws',
    name: 'AWS',
    slug: 'aws',
    website: 'https://aws.amazon.com',
    referralUrl: 'https://aws.amazon.com/ec2/instance-types/',
    description: 'Amazon Web Services - Enterprise-grade cloud GPU infrastructure with global availability and comprehensive AI/ML services',
  },
  {
    id: 'gcp',
    name: 'GCP',
    slug: 'gcp',
    website: 'https://cloud.google.com',
    referralUrl: 'https://cloud.google.com/compute/docs/gpus',
    description: 'Google Cloud Platform - Advanced GPU cloud infrastructure with Vertex AI integration and TPU options',
  },
  {
    id: 'azure',
    name: 'Azure',
    slug: 'azure',
    website: 'https://azure.microsoft.com',
    referralUrl: 'https://azure.microsoft.com/en-us/products/virtual-machines/gpu',
    description: 'Microsoft Azure - Enterprise cloud GPU solutions with comprehensive AI services and global data center presence',
  },
  {
    id: 'vultr',
    name: 'Vultr',
    slug: 'vultr',
    website: 'https://www.vultr.com',
    referralUrl: 'https://www.vultr.com/products/cloud-gpu/',
    description: 'High-performance cloud GPU instances with simple pricing and global availability',
  },
  {
    id: 'vast-ai',
    name: 'Vast.ai',
    slug: 'vast-ai',
    website: 'https://vast.ai',
    referralUrl: 'https://cloud.vast.ai/?ref_id=258548',
    description: 'Peer-to-peer GPU rental marketplace with the lowest prices',
  },
  {
    id: 'runpod',
    name: 'RunPod',
    slug: 'runpod',
    website: 'https://runpod.io',
    referralUrl: 'https://runpod.io/?ref=ywe09aak',
    signupCredit: 'Up to $5',
    description: 'Serverless GPU computing platform for AI/ML workloads',
  },
  {
    id: 'lambda',
    name: 'Lambda Labs',
    slug: 'lambda',
    website: 'https://lambdalabs.com',
    referralUrl: 'https://cloud.lambdalabs.com/',
    description: 'On-demand cloud GPUs for deep learning with ML-optimized infrastructure',
  },
  {
    id: 'tensordock',
    name: 'TensorDock',
    slug: 'tensordock',
    website: 'https://tensordock.com',
    referralUrl: 'https://dashboard.tensordock.com/deploy',
    description: 'Flexible GPU cloud infrastructure',
  },
  {
    id: 'spheron',
    name: 'Spheron',
    slug: 'spheron',
    website: 'https://spheron.network/?utm_source=cheapestgpu&utm_medium=referral&utm_campaign=cheapestgpu-referrals',
    referralUrl: 'https://spheron.network/?utm_source=cheapestgpu&utm_medium=referral&utm_campaign=cheapestgpu-referrals',
    description: 'Decentralized GPU compute network',
  },
  {
    id: 'coreweave',
    name: 'CoreWeave',
    slug: 'coreweave',
    website: 'https://coreweave.com',
    referralUrl: 'https://www.coreweave.com/',
    description: 'Specialized cloud provider for GPU compute',
  },
  {
    id: 'verda',
    name: 'Verda',
    slug: 'verda',
    website: 'https://verda.com',
    referralUrl: 'https://verda.com/',
    description: 'High-performance GPU cloud infrastructure',
  },
  {
    id: 'sesterce',
    name: 'Sesterce Cloud',
    slug: 'sesterce',
    website: 'https://sesterce.com',
    referralUrl: 'https://cloud.sesterce.com/compute?referralCode=SES-RRK6P6-896a',
    description: 'Enterprise-grade GPU cloud services',
  },
  {
    id: 'massed',
    name: 'Massed Compute',
    slug: 'massed',
    website: 'https://massedcompute.com',
    referralUrl: 'https://massedcompute.com/',
    description: 'Distributed GPU compute platform',
  },
  {
    id: 'jarvis',
    name: 'Jarvis Labs',
    slug: 'jarvis',
    website: 'https://jarvislabs.ai',
    referralUrl: 'https://jarvislabs.ai/',
    description: 'Cloud GPU platform for AI development',
  },
  {
    id: 'prime-intellect',
    name: 'Prime Intellect',
    slug: 'prime-intellect',
    website: 'https://primeintellect.ai',
    referralUrl: 'https://primeintellect.ai/',
    description: 'AI-first GPU cloud infrastructure',
  },
];

export function getProviderBySlug(slug: string): Provider | undefined {
  return providers.find(p => p.slug === slug);
}

export function getProviderById(id: string): Provider | undefined {
  return providers.find(p => p.id === id);
}
