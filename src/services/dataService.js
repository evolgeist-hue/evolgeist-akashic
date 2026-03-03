import { users } from '../data/users.mock';
import { contents } from '../data/content.mock';
import { sessions } from '../data/sessions.mock';

export const DataService = {
  getUser() {
    return users[0];
  },

  getContents() {
    return contents;
  },

  getSessions() {
    return sessions;
  },
};