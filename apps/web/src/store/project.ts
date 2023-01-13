import { getAuth } from "firebase/auth";
import {
  child,
  ref,
  getDatabase,
  onValue,
  update,
  get,
  DataSnapshot,
  set,
} from "firebase/database";
import { Irisub } from "irisub-common";
import { atom, AtomEffect } from "recoil";
import { currentProjectIdState } from "./states";

const snapshotToProject = (snapshot: DataSnapshot): Irisub.Project | null => {
  if (snapshot.exists()) {
    const entry = snapshot.val();
    return {
      title: entry.title,
    } satisfies Irisub.Project;
  } else {
    return null;
  }
};

const getRemoteProject = async (projectId: string | null): Promise<Irisub.Project | null> => {
  if (projectId === null) return null;

  const snapshot = await get(child(ref(getDatabase()), `projects/${projectId}`));
  if (snapshot.exists()) return snapshotToProject(snapshot);

  console.log(`Project with id ${projectId} didn't exist on remote -- creating it`);
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  const newProject = { title: "", owner: userId };
  set(ref(getDatabase(), `projects/${projectId}`), newProject);
  return newProject;
};

function syncProjectEffect(): AtomEffect<Irisub.Project | null> {
  return ({ setSelf, onSet, trigger, getLoadable }) => {
    const projectId = getLoadable(currentProjectIdState).getValue();

    if (projectId !== null) {
      if (trigger === "get") {
        getRemoteProject(projectId).then((project) => setSelf(project));
      }

      onValue(ref(getDatabase(), `projects/${projectId}`), (snapshot) => {
        if (snapshot.exists()) setSelf(snapshotToProject(snapshot));
      });
    }

    onSet((newValue, oldValue, isReset) => {
      const projectId = getLoadable(currentProjectIdState).getValue();

      if (isReset || newValue === null) {
        getRemoteProject(projectId).then((project) => setSelf(project));
      } else {
        if (newValue !== null) {
          // TODO: consider limiting the number of projects per user
          // Option 1:
          // If project doesn't exist in DB yet, call a createProject API. Also add
          // DB rule to disallow writing if the project doesn't exist yet (maybe have
          // that API call if this update command fails because of that rule).
          //
          // Option 2:
          // Alternatively, we may be able to keep a list of the user's projects
          // in an add-only list (or increment-only counter) in the realtime DB,
          // and add a DB rule checking the size of that before adding a new project.
          // The list/counter would only support deletion/decrements through a delete
          // API, which is perhaps more reasonable to keep online-only.

          update(ref(getDatabase(), `projects/${projectId}`), newValue);
        }
      }
    });
  };
}

export const currentProjectState = atom<Irisub.Project | null>({
  key: "currentProjectState",
  default: null,
  effects: [syncProjectEffect()],
});
