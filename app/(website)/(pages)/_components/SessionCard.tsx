"use client";
import React, { ReactNode } from "react";
import data from "@/app/(website)/_data/agenda.json";
import timeRender from "@/app/(website)/_utils/time-render";

import { useSession } from "./AgendaContext";
type Session = {
  id: string;
  type: string;
  room: string;
  broadcast: string[] | null;
  start: string;
  end: string;
  qa: string | null;
  slide: string | null;
  co_write: string | null;
  record: string | null;
  live: string | null;
  language: string | null;
  uri: string | null;
  zh: { title: string; description: string };
  en: { title: string; description: string };
  speakers: string[];
  tags: string[];
  "": null;
};

const SessionCard = ({ session }: { session: Session }) => {
  // translate session.speaker[i] to data.speaker[speaker[i]].name
  const speakerNames = session.speakers.map((speakerId) => {
    const speaker = data.speakers.find((speaker) => speaker.id === speakerId);
    return speaker ? speaker.zh.name : "";
  });

  return (
    <CardWrapper session={session}>
      {/* {session.type} 區分不同card*/}
      {(session.type === "Ev" || session.type === "L") && ( // Event or Lightning
        <div className="flex h-full w-full items-center justify-center">
          <h3 className="text-[20px] font-bold">{session.zh.title}</h3>
        </div>
      )}
      {session.type === "K" && ( // keynote
        <div className="flex h-full w-full flex-col items-center justify-between">
          <div>
            <h3 className="text-[16px] font-semibold">{session.zh.title}</h3>
            <p>{speakerNames.join(" / ")}</p>
          </div>
          <div className="">
            <span className="mr-1 rounded-md bg-[#eceff7] p-1 text-xs text-black">
              #keynote
            </span>
          </div>
        </div>
      )}
      {(session.type === "E" ||
        session.type === "P" ||
        session.type === "U" ||
        session.type === "PD" ||
        session.type === "S") && ( // Espresso, Presentation, U ?, PD ?, Session
        <div className="flex h-full w-full flex-col items-start justify-between">
          <div>
            <h3 className="mb-2 text-[16px] font-semibold">
              {session.zh.title}
            </h3>
            <p>{speakerNames.join(" / ")}</p>
          </div>
          <div className="flex flex-wrap">
            {session.tags.map((tag) => {
              return (
                <span
                  key={tag}
                  className="my-1 mr-1 rounded-xl bg-[#eceff7] p-1 text-xs text-black"
                >
                  #{tag}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </CardWrapper>
  );
};

// 主要的grid layout邏輯 & 區分可否點開
const CardWrapper = ({
  children,
  session,
}: {
  children: ReactNode;
  session: Session;
}) => {
  const { setSessionIsOpen, setOpenSessionId } = useSession();
  const getRoom = (broadcast: string[] | null, room: string) => {
    if (broadcast === null) {
      switch (room) {
        case "R0":
          return ["R0", "R1"];
        case "R1":
          return ["R1", "R2"];
        case "R2":
          return ["R2", "R3"];
        case "R3":
          return ["R3", "S"];
        case "S":
          return ["S", "S"];
      }
    }
    if (broadcast) {
      switch (broadcast[broadcast.length - 1]) {
        case "R0":
          return [broadcast[0], "R1"];
        case "R1":
          return [broadcast[0], "R2"];
        case "R2":
          return [broadcast[0], "R3"];
        case "R3":
          return [broadcast[0], "S"];
        case "S":
          return [broadcast[0], "end"];
      }
    }
    return ["", ""];
  };

  const textToStyle = (time: string) => {
    // input style format: "08:30"
    // output time format: "t0830"
    return time.replace(":", "").replace(/(\d{2})(\d{2})/, "t$1$2");
  };

  const sessionStyle = (type: string) => {
    const lightStyle = "bg-[#ffffff] text-black";
    const darkStyle = "bg-[#2c3142] text-white";
    switch (type) {
      case "K":
        return lightStyle;
      case "E":
        return lightStyle;
      case "P":
        return lightStyle;
      case "U":
        return lightStyle;
      case "Ev":
        return darkStyle;
      case "PD":
        return lightStyle;
      case "L":
        return lightStyle;
      case "S":
        return darkStyle;
      default:
        return "";
    }
  };

  const [startRoom, endRoom] = getRoom(session.broadcast, session.room);
  const startTime = textToStyle(timeRender(session.start));
  const endTime = textToStyle(timeRender(session.end));

  const isLinkable =
    session.type === "E" ||
    session.type === "P" ||
    session.type === "U" ||
    session.type === "PD" ||
    session.type === "S" ||
    session.type === "K" ||
    session.type === "L";
  const handleCardClick = () => {
    if (!isLinkable) return;
    setOpenSessionId(session.id);
    history.pushState(null, "", `/agenda/${session!.id}/`);
    setSessionIsOpen(true);
  };

  return (
    <div
      key={session.id}
      className={`flex h-full w-full rounded-lg border p-4 ${sessionStyle(session.type)} ${isLinkable && "cursor-pointer"}`}
      style={{
        gridColumn: `${startRoom} / ${endRoom}`,
        gridRow: `${startTime} / ${endTime}`,
      }} // grid layout
      onClick={handleCardClick}
    >
      {children}
    </div>
  );
};

export default SessionCard;
