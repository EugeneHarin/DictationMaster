import { Button } from "./button";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { authenticateWithGithub } from "../lib/user-actions";

export default function GitHubLoginForm() {
  return(
    <form action={authenticateWithGithub}>
      <Button className="bg-black mx-auto">
        Sign in with GitHub <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
      </Button>
    </form>
  );
}
