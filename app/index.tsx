import { Redirect } from "expo-router";

// simulate login state for now
const isLoggedIn = false;

export default function Index() {
  if (!isLoggedIn) return <Redirect href="./auth/" />;
  return <Redirect href="/courseList" />;
}
