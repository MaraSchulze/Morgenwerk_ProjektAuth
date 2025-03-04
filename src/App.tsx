import { useEffect, useState } from "react";
import { fetchAuthSession  } from "@aws-amplify/auth";

function App() {
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
    <main>
      <div>
        <ul>
          {groups.map((group) => (
            <li>{group}</li>
          ))}
        </ul>
      </div>
    </main>
  );
}

export default App;
