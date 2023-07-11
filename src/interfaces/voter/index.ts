import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface VoterInterface {
  id?: string;
  name: string;
  sentiment: string;
  flag: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface VoterGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  sentiment?: string;
  flag?: string;
  user_id?: string;
}
