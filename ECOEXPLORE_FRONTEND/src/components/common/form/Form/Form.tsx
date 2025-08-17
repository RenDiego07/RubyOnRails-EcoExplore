import { FormEvent } from 'react';

export default function Form({
  children,
  onSubmit = () => {},
  ...props
}: React.FormHTMLAttributes<HTMLFormElement>) {
  return (
    <form
      {...props}
      onSubmit={(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(e);
      }}
    >
      {children}
    </form>
  );
}
