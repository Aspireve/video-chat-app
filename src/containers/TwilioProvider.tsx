import { Logger } from "twilio-video";

import { useLocalTracks, useRoom } from "../hooks";
import { TwilioContext } from "../context/TwilioContext";

const logger = Logger.getLogger("twilio-video");

const originalFactory = logger.methodFactory;
logger.methodFactory = (methodName, logLevel, loggerName) => {
  const method = originalFactory(methodName, logLevel, loggerName);
  return (datetime, logLevel, component, message, data) => {
    const prefix = "[Meet app]";
    if (logLevel !== "debug") {
      method(prefix, datetime, logLevel, component, message, data);
    }
  };
};
logger.setLevel("info");

const TwilioProvider = ({ children }: IProps) => {
  const localTracks = useLocalTracks();
  const { room, connect } = useRoom(localTracks.localTracks);

  return (
    <TwilioContext.Provider
      value={{
        room,
        connect,
        ...localTracks,
      }}
    >
      {children}
    </TwilioContext.Provider>
  );
};

type IProps = {
  children: JSX.Element;
};

export { TwilioProvider };
