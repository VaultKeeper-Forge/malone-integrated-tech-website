import { siteCopy, type ProofCase, type ProcessStep, type ResearchFocus } from '../data/siteData';
import { allPublicOffers, type ServiceOffer } from '../data/serviceData';

export interface VaultProofPayload {
  projects: ProofCase[];
  research: ResearchFocus[];
  process: ProcessStep[];
  services: ServiceOffer[];
}

export const vaultConnection = {
  configured: false,
  endpoint: '/api/vc',
  version: 'v1'
};

export const fetchVaultProofPayload = async (): Promise<VaultProofPayload> => {
  return {
    projects: siteCopy.proof,
    research: siteCopy.research,
    process: siteCopy.process,
    services: allPublicOffers
  };
};

export const isVaultConfigured = (): boolean => vaultConnection.configured;

export const vaultContactEnvelope = ({
  name,
  email,
  organization,
  projectType,
  timeline,
  message
}: {
  name: string;
  email: string;
  organization: string;
  projectType: string;
  timeline: string;
  message: string;
}) => ({
  status: vaultConnection.configured ? 'ready' : 'stub',
  payload: {
    source: 'website_form',
    name,
    email,
    organization,
    projectType,
    timeline,
    message,
    requestedAt: new Date().toISOString()
  }
});
