import { Provider } from './types';

export const providers: Provider[] = [
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
    name: 'Lambda',
    slug: 'lambda',
    website: 'https://lambdalabs.com',
    referralUrl: 'https://cloud.lambdalabs.com/',
    description: 'On-demand cloud GPUs for deep learning',
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
    id: 'spheron-ai',
    name: 'Spheron AI',
    slug: 'spheron-ai',
    website: 'https://spheron.network',
    referralUrl: 'https://spheron.network/',
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
