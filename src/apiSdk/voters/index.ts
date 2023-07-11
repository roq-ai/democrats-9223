import axios from 'axios';
import queryString from 'query-string';
import { VoterInterface, VoterGetQueryInterface } from 'interfaces/voter';
import { GetQueryInterface } from '../../interfaces';

export const getVoters = async (query?: VoterGetQueryInterface) => {
  const response = await axios.get(`/api/voters${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createVoter = async (voter: VoterInterface) => {
  const response = await axios.post('/api/voters', voter);
  return response.data;
};

export const updateVoterById = async (id: string, voter: VoterInterface) => {
  const response = await axios.put(`/api/voters/${id}`, voter);
  return response.data;
};

export const getVoterById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/voters/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteVoterById = async (id: string) => {
  const response = await axios.delete(`/api/voters/${id}`);
  return response.data;
};
