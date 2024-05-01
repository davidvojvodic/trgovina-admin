import { SignUp } from "@clerk/nextjs";

export default function Page({ onSignUp }) {
  return (
    <SignUp
      formFields={[
        "email_address",
        "first_name",
        "last_name",
        "password",
        "phone_number",
      ]}
      onSignUp={(frontendApiResponse) => {
        // Do something with the sign-up response
        onSignUp(frontendApiResponse);
      }}
    />
  );
}
