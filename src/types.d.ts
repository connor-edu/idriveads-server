declare global {
  namespace Express {
    interface Request {
      user?: Account | undefined;
    }
  }
}

export interface Account {
  id: string;
  name: string;
  email: string;
  password: string;
}
