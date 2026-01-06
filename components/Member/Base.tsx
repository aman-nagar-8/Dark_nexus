"use client";
import Split from "react-split";
import { RiCodeSSlashLine } from "react-icons/ri";
import { BsClipboard2 } from "react-icons/bs";
import { HiOutlineBookOpen } from "react-icons/hi2";
import { FiUser } from "react-icons/fi";
import { VscComment } from "react-icons/vsc";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { TbNotes } from "react-icons/tb";
import { GoQuestion } from "react-icons/go";
import Nav_Link from "@/components/Member/Nav_Link";
import { useEffect } from "react";
// import Split from "react-split";
import { BsFileCode } from "react-icons/bs";
import Editor from "@monaco-editor/react";
import { useState } from "react";
import { beforeMount } from "@/utils/Editor_Customization";
import { useRef } from "react";
import { LuTriangle } from "react-icons/lu";
import { AiOutlineAlignLeft } from "react-icons/ai";
import { IoBookmarkOutline } from "react-icons/io5";
import { IoReload } from "react-icons/io5";
// import { connectSocket, getSocket } from "@/lib/connectsocket";
// import { DefaultEventsMap } from "@socket.io/component-emitter";
// import { Socket } from "socket.io-client";

const Base = ({
  meetingId,
  left,
  right,
}: {
  meetingId: string;
  left: React.ReactNode;
  right: React.ReactNode;
}) => {
  const leftNavArray = [
    {
      title: "Code",
      icon: <RiCodeSSlashLine className="text-green-500" />,
      className: "",
      href: `/meeting/member/${meetingId}`,
    },
  ];

  const rightNavArray = [
    {
      title: "Members",
      icon: <FiUser className="text-yellow-500" />,
      className: "",
      href: `/meeting/member/${meetingId}`,
    },
  ];

  // useEffect(() => {
  //   let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

  //   const connectAndJoin = async () => {
  //     socket = await connectSocket();

  //     const join = () => {
  //       console.log("Socket connected:", socket.id);
  //       socket.emit("joinMeeting", meetingId);
  //       console.log(`Joined meeting: ${meetingId}`);
  //     };

  //     if (socket.connected) {
  //       // 🔥 MOST IMPORTANT LINE
  //       join();
  //     } else {
  //       socket.once("connect", join);
  //     }
  //   };

  //   connectAndJoin();

  //   return () => {
  //     getSocket()?.disconnect();
  //   };
  // }, []);

  /* ───────────────── Types ───────────────── */

  type OutputItem = {
    Data: string;
    time: string;
    type: "success" | "error";
  };

  type RunCodeResponse = {
    stdout?: string;
    stderr?: string;
    compile_output?: string;
  };

  type ErrorClassification =
    | { type: "SYNTAX_ERROR"; reason: string }
    | { type: "RUNTIME_ERROR"; reason: string }
    | { type: "SUCCESS"; reason: string };

  type UserState = "STUCK" | "CONFUSED" | "IMPROVING" | "STRUGGLING" | "NORMAL";

  /* ───────────────── State ───────────────── */

  const [Code, setCode] = useState<string>("");
  const [Output, setOutput] = useState<OutputItem[]>([]);
  const [CodeCompiling, setCodeCompiling] = useState<boolean>(false);

  const [errorCount, setErrorCount] = useState<number>(0);
 const [errorType, setErrorType] = useState<ErrorClassification | null>(null);
  const [lastRun, setLastRun] = useState<Date | null>(null);

  const [isStartedCoding, setIsStartedCoding] = useState<boolean>(false);
  const [priviousCode, setPriviousCode] = useState<string>("");
  const [studentState, setstudentState] = useState<string>("")

  /* ───────────────── Refs ───────────────── */

  const outputRef = useRef<HTMLDivElement | null>(null);
  const savedPriviousCode = useRef<string>("");

  const prevCodeRef = useRef<string>("");

  /* ───────────────── Effects ───────────────── */

  useEffect(() => {
    outputRef.current?.scrollTo({
      top: outputRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [CodeCompiling]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Code.length - prevCodeRef.current.length > 50) {
        setIsStartedCoding(true);
      } else {
        setIsStartedCoding(false);
      }

      prevCodeRef.current = Code;
    }, 30000);

    return () => clearInterval(interval);
  }, [Code]);

  /* ───────────────── Helpers ───────────────── */

  function classifyResult(stderr?: string): ErrorClassification {
    if (
      stderr &&
      (stderr.includes("SyntaxError") ||
        stderr.includes("Unexpected token") ||
        stderr.includes("missing") ||
        stderr.includes("expected"))
    ) {
      return {
        type: "SYNTAX_ERROR",
        reason: "Code failed before execution",
      };
    }

    if (
      stderr &&
      (stderr.includes("TypeError") ||
        stderr.includes("ReferenceError") ||
        stderr.includes("RangeError") ||
        stderr.includes("at "))
    ) {
      return {
        type: "RUNTIME_ERROR",
        reason: "Code crashed during execution",
      };
    }

    return {
      type: "SUCCESS",
      reason: "Unclassified behavior",
    };
  }

  /* ───────────────── Run Code ───────────────── */

  async function runCode(): Promise<void> {
    try {
      setCodeCompiling(true);

      const res = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: Code,
          language_id: 63,
          input: "",
        }),
      });

      const result: RunCodeResponse = await res.json();

      setLastRun(new Date());
       setErrorType(classifyResult(result.stderr))
       setstudentState(evaluateUserState())
  
      setOutput((prev) => [
        ...prev,
        {
          Data:
            result.stdout ||
            result.stderr ||
            result.compile_output ||
            "No output",
          time: new Date().toLocaleTimeString(),
          type: result.stderr || result.compile_output ? "error" : "success",
        },
      ]);
    } catch {
      setOutput((prev) => [
        ...prev,
        {
          Data: "Execution failed",
          time: new Date().toLocaleTimeString(),
          type: "error",
        },
      ]);
    } finally {
      setCodeCompiling(false);
    }
  }

  /* ───────────────── Analysis Helpers ───────────────── */

  function isRepeatedError(lastOutputs: OutputItem[]): boolean {
    if (lastOutputs.length < 3) return false;

    const firstType = lastOutputs[0].type;
    return lastOutputs.every(
      (o) => o.type === firstType && o.type !== "success"
    );
  }

  function hasNoSuccess(lastOutputs: OutputItem[]): boolean {
    return lastOutputs.every((o) => o.type !== "success");
  }

  function isImproving(lastOutputs: OutputItem[]): boolean {
    if (lastOutputs.length < 4) return false;

    return lastOutputs[lastOutputs.length - 1].type === "success";
  }

  function isConfused(lastOutputs: OutputItem[]): boolean {
    const types = lastOutputs.map((o) => o.type);
    return new Set(types).size > 2;
  }

  function evaluateUserState(): UserState {
    const recent = Output.slice(-4);

    if (isRepeatedError(recent)) return "STUCK";
    if (isConfused(recent)) return "CONFUSED";
    if (isImproving(recent)) return "IMPROVING";
    if (hasNoSuccess(recent)) return "STRUGGLING";

    return "NORMAL";
  }

  return (
    <Split
      className="flex h-full w-full overflow-hidden"
      sizes={[80, 20]}
      minSize={[400, 200]}
      expandToMin={false}
      gutterSize={10}
      gutterAlign="center"
      snapOffset={30}
      dragInterval={1}
      direction="horizontal"
      cursor="col-resize"
    >
      {/* left part */}
      <div className="h-full rounded-lg  flex flex-col overflow-hidden">
        <div className="w-full h-9 bg-[#333333] rounded-t-lg p-1 flex items-center border-x-[0.5px] border-t-[0.5px] border-zinc-600 text-zinc-400 gap-1  no-scrollbar">
          {leftNavArray.map((link, index) => (
            <Nav_Link
              key={index}
              title={link.title}
              icon={link.icon}
              className={link.className}
              href={link.href}
            />
          ))}
        </div>
        <div className="flex-1 min-h-0">
          <Split
            className="h-full w-full overflow-hidden"
            sizes={[75, 25]}
            minSize={[200, 38]}
            expandToMin={false}
            gutterSize={10}
            gutterAlign="center"
            snapOffset={30}
            dragInterval={1}
            direction="vertical"
            cursor="row-resize"
          >
            {/* Code section */}
            <div className="bg-[#262626] h-full rounded-b-lg border-x-[0.5px] border-b-[0.5px] border-zinc-600 flex flex-col">
              <div className="border-b-[0.5px] border-zinc-600 w-full h-8 flex items-center justify-end p-1 gap-1">
                <div
                  onClick={runCode}
                  className="group relative p-1.5 rounded-sm hover:bg-[#333333] cursor-pointer"
                >
                  <LuTriangle className="text-zinc-300 rotate-90 text-sm " />
                  <span className="absolute top-full right-0 mb-2 bg-zinc-900 z-10 text-white text-xs px-3 py-1.5 rounded hidden group-hover:block transition whitespace-nowrap">
                    Run
                  </span>
                </div>
                <div className="group relative p-1.5 rounded-sm hover:bg-[#333333] cursor-pointer">
                  <AiOutlineAlignLeft className="text-zinc-300  " />
                  <span className="absolute top-full right-0 mb-2 z-10 bg-zinc-900 text-white text-xs px-3 py-1.5 rounded hidden group-hover:block transition whitespace-nowrap">
                    Formate Code
                  </span>
                </div>
                <div className="group relative p-1.5 rounded-sm hover:bg-[#333333] cursor-pointer">
                  <IoBookmarkOutline className="text-zinc-300  " />
                  <span className="absolute top-full right-0 mb-2 z-10 bg-zinc-900 text-white text-xs px-3 py-1.5 rounded hidden group-hover:block transition whitespace-nowrap">
                    Save
                  </span>
                </div>
              </div>
              <div className="flex-1 min-h-0">
                <Editor
                  height="100%"
                  defaultLanguage="javascript"
                  defaultValue="// write code there"
                  theme="custom-bg"
                  beforeMount={beforeMount}
                  value={Code}
                  options={{
                    fontSize: 14,
                    fontFamily: "JetBrains Mono, monospace",
                    lineHeight: 22,

                    minimap: { enabled: false },
                    wordWrap: "on",

                    cursorBlinking: "smooth",
                    cursorSmoothCaretAnimation: "on",

                    scrollBeyondLastLine: false,
                    smoothScrolling: true,

                    padding: { top: 12, bottom: 12 },

                    renderLineHighlight: "all",
                    scrollbar: {
                      verticalScrollbarSize: 6,
                      horizontalScrollbarSize: 6,
                    },
                  }}
                  onChange={(value) => {
                    setCode(value || "");
                    // sendCode();
                  }}
                />
              </div>
            </div>
            {/* Output section */}
            <div className="bg-[#262626] rounded-lg border-[0.5px] border-zinc-600 flex flex-col h-full min-h-10">
              <div className="w-full h-9 shrink-0 bg-[#333333] justify-between rounded-t-lg p-1 flex items-center gap-1  no-scrollbar text-zinc-400">
                <div
                  className={`flex gap-2 items-center text-sm hover:bg-zinc-700 px-3 h-full rounded-sm cursor-pointer`}
                >
                  <BsFileCode className="text-blue-500" />
                  Output
                </div>
                <div className="flex gap-4" >
                  {errorCount > 2 && (
              <div className="group relative p-1.5 rounded-sm hover:bg-[#333333] cursor-pointer">
                <AiOutlineAlignLeft className="text-red-600  " />
                <span className="absolute bottom-0 mr-2 z-10 right-full bg-zinc-900 text-white text-xs px-3 py-1.5 rounded hidden group-hover:block transition whitespace-nowrap">
                  To many Errors
                </span>
              </div>
            )}
            {!isStartedCoding && (
              <div className="group relative p-1.5 rounded-sm hover:bg-[#333333] cursor-pointer">
                <AiOutlineAlignLeft className="text-red-600  " />
                <span className="absolute bottom-0 mr-2 z-10 right-full bg-zinc-900 text-white text-xs px-3 py-1.5 rounded hidden group-hover:block transition whitespace-nowrap">
                  You are not writing
                </span>
              </div>
            )}
             {studentState && (
              <div className="group relative p-1.5 rounded-sm hover:bg-[#333333] cursor-pointer">
                <span className="text-xs " >{studentState}</span>
                <span className="absolute bottom-0 mr-2 z-10 right-full bg-zinc-900 text-white text-xs px-3 py-1.5 rounded hidden group-hover:block transition whitespace-nowrap">
                  you status 
                </span>
              </div>
            )}
            {errorType && (
              <div className="group relative p-1.5 rounded-sm hover:bg-[#333333] cursor-pointer">
                {/* <AiOutlineAlignLeft className="text-green-600  " /> */}
                <span className="text-xs">{errorType.type}</span>
                <span className="absolute bottom-0 mr-2 z-10 right-full bg-zinc-900 text-white text-xs px-3 py-1.5 rounded hidden group-hover:block transition whitespace-nowrap">
                  You are coding
                </span>
              </div>
            )}
                  <div
                    onClick={() => {
                      setOutput([]);
                    }}
                    className="flex justify-center  items-center group relative mr-2 rounded-md cursor-pointer"
                  >
                    <IoReload className="group-hover:text-zinc-300" />
                    <span className="absolute bottom--[5px] mr-2 z-10 right-full bg-zinc-900 text-white text-xs px-3 py-1.5 rounded hidden group-hover:block transition whitespace-nowrap">
                      Clear output
                    </span>
                  </div>
                </div>
              </div>
              <div
                ref={outputRef}
                className="flex-1 min-h-0 overflow-y-auto px-4 py-3 text-sm leading-relaxed font-mono text-zinc-200 selection:bg-blue-500/30 whitespace-pre-wrap"
              >
                {Output.map((output, index) => (
                  <div
                    key={index}
                    className="py-2 border-b-[0.5px] border-zinc-700"
                  >
                    <pre
                      className={` ${
                        output.type == "error"
                          ? " text-red-500 "
                          : " text-zinc-200 "
                      }  whitespace-pre-wrap`}
                    >
                      {output.Data}
                    </pre>
                    {/* <div className="text-[10px] text-zinc-500" >{output.time}</div> */}
                  </div>
                ))}
                <div className="h-3/4">
                  {CodeCompiling && (
                    <div className="flex items-center gap-1 mt-3">
                      <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-pulse [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-pulse [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-pulse" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Split>
        </div>
      </div>
      {/* right part */}
      <div className="rounded-lg flex flex-col overflow-hidden h-full">
        <div className="w-full h-9 shrink-0 bg-[#333333] rounded-t-lg p-1 flex items-center border-x-[0.5px] border-t-[0.5px] border-zinc-600 gap-1  no-scrollbar text-zinc-400">
          {rightNavArray.map((link, index) => (
            <Nav_Link
              key={index}
              title={link.title}
              icon={link.icon}
              className={link.className}
              href={link.href}
            />
          ))}
        </div>
        <div className="flex-1 min-h-0">{right}</div>
      </div>
    </Split>
  );
};

export default Base;
