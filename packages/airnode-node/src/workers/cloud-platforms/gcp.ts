import { GoogleAuth } from 'google-auth-library';
import { WorkerParameters, WorkerResponse } from '../../types';

export async function spawn(params: WorkerParameters): Promise<WorkerResponse> {
  const auth = new GoogleAuth();

  const resolvedName = `airnode-${params.airnodeAddressShort}-${params.stage}-${params.functionName}`;
  const url = `https://${params.region}-${params.projectId}.cloudfunctions.net/${resolvedName}`;

  const axiosClient = await auth.getIdTokenClient(url);

  const response = await axiosClient.request<WorkerResponse>({
    url,
    method: 'POST',
    data: params.payload
  });

  return response.data;
}
