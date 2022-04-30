import { getAuth } from "firebase/auth";

const auth = getAuth();

export default function Settings() {
  const user = auth.currentUser;
  return (
    <div>
      <div>User: {user.displayName}</div>
      <div>
        <button onClick={() => auth.signOut()}>Log Out</button>
      </div>
    </div>
  );
}
