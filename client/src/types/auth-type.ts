export type RegisterProps = {
  register: string;
  registerHref: string;
};

export type LoginProps = {
  login: string;
  loginHref: string;
};

export type CardWrapperProps = {
  children: React.ReactNode;
  headerTitle: string;
} & (RegisterProps | LoginProps); // Ensure it's a discriminated union


export interface MorphButtonProps {
  label: string;
  href: string;
}