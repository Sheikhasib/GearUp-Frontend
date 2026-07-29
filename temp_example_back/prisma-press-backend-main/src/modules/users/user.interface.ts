import { Profile } from "../../../generated/prisma/browser";

interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  profilePhoto?: string; // Optional field for the profile photo
  profile?: Profile; // Optional field for the profile object
}

export default IUser;
