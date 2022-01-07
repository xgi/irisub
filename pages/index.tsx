import type { NextPage } from "next";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import Base from "../components/Base";
import { initDb } from "../store/db";
import { databaseState } from "../store/states";

const Home: NextPage = () => {
  {
    const [database, setDatabase] = useRecoilState(databaseState);

    useEffect(() => {
      if (database === null) {
        (async () => setDatabase(await initDb()))();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  }

  return <Base />;
};

export default Home;
