/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "./config";
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";

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
        ...data,

        updatedAt: new Date().toISOString()
      }
    },

    {
      merge: true
    }
  );
};

export const getEmotionSignal = async (user: "Phuc" | "Linh") => {
  const ref = doc(
    db,

    "app_data",

    "homepage_shared"
  );

  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  const data = snap.data();

  return user === "Phuc" ? data.phucSignal || null : data.linhSignal || null;
};
export const subscribeEmotionSignal = (user: "Phuc" | "Linh", callback: (data: any) => void) => {
  const ref = doc(db, "app_data", "homepage_shared");

  return onSnapshot(ref, (snap) => {
    if (!snap.exists()) {
      callback(null);
      return;
    }

    const data = snap.data();

    callback(user === "Phuc" ? data.phucSignal || null : data.linhSignal || null);
  });
};
