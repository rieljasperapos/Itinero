import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/card";
import { CardWrapperProps, RegisterProps, LoginProps } from "@/types/auth-type";
import Image from "next/image";

export const CardWrapper = ({
  children,
  headerTitle,
  ...buttonProps
}: CardWrapperProps) => {
  return (
    <Card className="w-full max-w-lg p-4">
      <CardHeader className="flex items-center justify-center gap-4">
        <div>
          <Image src="/images/logo.png" alt="logo" width={100} height={100} />
        </div>
        <CardTitle className="text-center">{headerTitle}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter className="flex flex-col items-center">
        {/* <div className="flex items-center w-full">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-2 text-gray-600">Or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div> */}
        {"register" in buttonProps ? (
          <div className="text-sm mt-2">
            <span>{buttonProps.register}</span>
            <a href={buttonProps.registerHref} className="text-blue-600 ml-1">
              Sign up
            </a>
          </div>
        ) : (
          <div className="text-sm mt-2">
            <span>{buttonProps.login}</span>
            <a href={buttonProps.loginHref} className="text-blue-600 ml-1">
              Log in
            </a>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
