import { siteCopy, type ProofCase, type ProcessStep, type ResearchFocus, type ServiceTile } from '../data/siteData';

export interface VaultProofPayload {
  projects: ProofCase[];
  research: ResearchFocus[];
  process: ProcessStep[];
  services: ServiceTile[];
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
    services: siteCopy.services
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
