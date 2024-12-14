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
} & (RegisterProps | LoginProps);


export interface MorphButtonProps {
  label: string;
  href: string;
}