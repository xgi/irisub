import { child, ref, getDatabase, onValue, update, get, DataSnapshot } from "firebase/database";
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
  console.log(`getting remote project with projectId: ${projectId}`);
  if (projectId === null) return null;

  const snapshot = await get(child(ref(getDatabase()), `projects/${projectId}`));
  if (snapshot.exists()) return snapshotToProject(snapshot);
  return null;
};

function syncProjectEffect(): AtomEffect<Irisub.Project | null> {
  return ({ setSelf, onSet, trigger, getLoadable }) => {
    const projectId = getLoadable(currentProjectIdState).getValue();

    if (trigger === "get") {
      getRemoteProject(projectId).then((project) => setSelf(project));
    }

    onValue(ref(getDatabase(), `projects/${projectId}`), (snapshot) => {
      if (snapshot.exists()) setSelf(snapshotToProject(snapshot));
    });

    onSet((newValue, oldValue, isReset) => {
      if (isReset) {
        getRemoteProject(projectId).then((project) => setSelf(project));
      } else {
        if (newValue !== null) {
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
