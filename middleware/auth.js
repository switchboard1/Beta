import { getUserFromCookie } from "@/helpers";

export default function({ req, redirect }) {
  if (process.server) {
    const user = getUserFromCookie(req);
    if (!user) {
      return redirect("/login");
    } else {
      return redirect("/dashboard");
    }
  }
}
