/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "./config";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

export interface IEmotionSignal {
  emotion: string;

  reasons: string[];

  needs: string[];

  level: 1 | 2 | 3;

  message: string;

  updatedAt: string;
}

export const saveEmotionSignal = async (
  user: "Phuc" | "Linh",

  data: IEmotionSignal
) => {
  const ref = doc(
    db,

    "app_data",

    "homepage_shared"
  );

  await setDoc(
    ref,

    {
      [user === "Phuc" ? "phucSignal" : "linhSignal"]: {
        ...data
      }
    },

    {
      merge: true
    }
  );
};

export const listenEmotionSignal = (callback: (data: any) => void) => {
  const ref = doc(db, "app_data", "homepage_shared");

  return onSnapshot(ref, (snap) => {
    const data = snap.data();

    const result = {
      phucSignal: data?.phucSignal ?? null,
      linhSignal: data?.linhSignal ?? null
    };

    callback({ ...result }); // 👈 force new reference
  });
};
export const subscribeEmotionSignal = (user: "Phuc" | "Linh", callback: (data: any) => void) => {
  const ref = doc(db, "app_data", "homepage_shared");

  return onSnapshot(ref, (snap) => {
    if (!snap.exists()) {
      callback(null);
      return;
    }

    const data = snap.data();

    callback(user === "Phuc" ? data.linhSignal || null : data.phucSignal || null);
  });
};

export const subscribeMySignal = (user: "Phuc" | "Linh", callback: (data: any) => void) => {
  const ref = doc(db, "app_data", "homepage_shared");

  return onSnapshot(ref, (snap) => {
    if (!snap.exists()) return callback(null);

    const data = snap.data();

    callback(user === "Phuc" ? data.phucSignal || null : data.linhSignal || null);
  });
};
export const clearEmotionSignal = async (user: "Phuc" | "Linh") => {
  const ref = doc(db, "app_data", "homepage_shared");

  await setDoc(
    ref,

    {
      [user === "Phuc" ? "phucSignal" : "linhSignal"]: null
    },

    {
      merge: true
    }
  );
};
