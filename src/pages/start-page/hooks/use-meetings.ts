import { useEffect, useState } from "react";
import randomString from "crypto-random-string";

import { getFromStorage, saveToStorage } from "../../../services/storage";

const MEETINGS_KEY = "MEETINGS";

const useMeetings = () => {
  const [meetings, setMeetings] = useState<IMeeting[]>([]);

  const createNewMeeting = () => {
    const code = getRandomCode();
    const meeting: IMeeting = { code, timestamp: new Date().toLocaleString() };

    setMeetings((meetings) => {
      const newMeetings = [...meetings, meeting];
      saveToStorage(MEETINGS_KEY, newMeetings);
      return newMeetings;
    });
  };

  useEffect(() => {
    setMeetings(getFromStorage(MEETINGS_KEY) || []);

    return () => {
      if (meetings.length) {
        saveToStorage(MEETINGS_KEY, meetings.filter(isMeetingInRange));
      }
    };
  }, []);

  return { meetings, createNewMeeting };
};

const getRandomCode = () => {
  const threeLengthCode = () =>
    randomString({ length: 3, type: "distinguishable" });
  return `${threeLengthCode()}-${threeLengthCode()}-${threeLengthCode()}`;
};

const isMeetingInRange = (meeting: IMeeting) => {
  return (
    new Date().getTime() - new Date(meeting.timestamp).getTime() >
    1000 * 60 * 60
  );
};

type IMeeting = {
  code: string;
  timestamp: string;
};

export { useMeetings };
