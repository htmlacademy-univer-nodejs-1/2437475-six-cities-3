export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  type: 'обычный' | 'pro';
}

export interface LoginDTO {
  email: string;
  password: string;
}
