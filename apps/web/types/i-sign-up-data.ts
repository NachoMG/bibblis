export interface ISignUpData {
  firstName: string;
  lastName: string;
  birthDate: Date;
  email: string;
  emailConfirm: string;
  password: string;
  passwordConfirm: string;
  termsAndConditions: boolean;
  acceptedMarketing: boolean;
  lang?: string;
}
