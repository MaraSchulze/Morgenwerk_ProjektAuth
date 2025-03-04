import { useEffect, useState } from "react";
import { fetchAuthSession  } from "@aws-amplify/auth";
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

function App() {
  // get groups of user by parsing the IDToken
  const [groups, setGroups] = useState<string[]>([]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const { tokens } = await fetchAuthSession();
        const idToken = tokens?.idToken?.toString();

        if (idToken) {
          const { ["cognito:groups"]: userGroups = [] } = JSON.parse(atob(idToken.split(".")[1]));
          setGroups(userGroups);
        }
      } catch (error) {
        console.error("Error fetching user groups:", error);
      }
    };

    fetchGroups();
  }, []);

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          // Print the user name
          <h1>Hello {user?.signInDetails?.loginId}</h1>
        
          // Print the groups of the user
          <div>
            <ul>
              {groups.map((group) => (
                <li>{group}</li>
              ))}
            </ul>
          </div>

          // Sign out button
          <button onClick={signOut}>Sign out</button>
        </main>
      )}
    </Authenticator>
  );
}

export default App;
