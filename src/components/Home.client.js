'use client';

import { useEffect, useRef, useState } from "react";
import { ConversationsService, LocalStorageService, UsersService } from "../services";

export default function HomePageClient({ initialBlogList, figletText }) {
    const [blogList] = useState(initialBlogList || []);
    const [textArt] = useState(figletText || '');
    const [command, setCommand] = useState("");
    const commandInput = useRef(null);
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [user, setUser] = useState("guest");

    const [color, setColor] = useState("green");
    const [backgroundColor, setBackgroundColor] = useState("black");
    const [userAgent, setUserAgent] = useState('');

    let ctrl = false;

    useEffect(() => {
        if (typeof navigator !== 'undefined') {
            setUserAgent(navigator.userAgent);
        }
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const color = LocalStorageService.get("color");
            const backgroundColor = LocalStorageService.get("background-color");
            if (color) setColor(color);
            if (backgroundColor) setBackgroundColor(backgroundColor);
            setUser(UsersService.getCurrentUserName());
        }
    }, []);

    useEffect(() => {
        let touchPath = 0;

        if (commandInput.current) {
            commandInput.current.focus();
        }

        const _click = () => {
            if (commandInput.current) {
                commandInput.current.focus();
            }
        };

        const _touchstart = (e) => {
            touchPath = 0;
        };

        const _touchmove = (e) => {
            touchPath += 1;
        };

        const _touchend = (e) => {
            if (touchPath === 0 && commandInput.current) {
                commandInput.current.focus();
            }
        };

        if (typeof window !== 'undefined') {
            window.addEventListener("click", _click);
            window.addEventListener("touchstart", _touchstart);
            window.addEventListener("touchmove", _touchmove);
            window.addEventListener("touchend", _touchend);
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener("click", _click);
                window.removeEventListener("touchstart", _touchstart);
                window.removeEventListener("touchmove", _touchmove);
                window.removeEventListener("touchend", _touchend);
            }
        };
    }, []);

    // Analytics effect
    useEffect(() => {
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'page_view', {
                page_location: window.location.href,
                page_path: window.location.pathname,
                page_title: 'Rec-er ' + window.location.pathname
            });
        }
        UsersService.checkSession();
    }, []);

    const checkInterrupt = async (e) => {
        const key = e.key;
        if (ctrl && key === "Control") ctrl = false;
    };

    const executeCommand = async (_command) => {
        let output;
        _command = _command.trim();
        if (_command !== "") {
            const inputCommand = _command.split(" ")[0];
            const inputArgs = _command
                .split(" ")
                .slice(1, _command.split(" ").length);
            const cases = {
                "": {
                    func: (args) => {
                        return "";
                    },
                },
                clear: {
                    func: (args) => {
                        setHistory([]);
                    },
                    helpText: "Clears the screen.",
                },
                ls: {
                    func: (args) => {
                        const argMap = {
                            "-T": (data) => {
                                return blogList[data].Title;
                            },
                            "-t": (data) => {
                                return new Date(parseInt(data))
                                    .toString()
                                    .split(" ")
                                    .slice(0, 4)
                                    .join(" ");
                            },
                            "-a": () => {
                                return `-r-w------ ${user}`;
                            },
                        };
                        const argDefs = {
                            "-T": "Title",
                            "-t": "DateTime",
                            "-a": "Access",
                        };
                        const _args = args.filter((arg) =>
                            Object.keys(argMap).includes(arg)
                        );
                        if (!!args && args.length > _args.length)
                            return "Invalid args";
                        else {
                            if (Object.keys(blogList).length > 0)
                                return [
                                    "BlogID\t",
                                    ..._args.map((arg) => {
                                        return `${argDefs[arg]}\t`;
                                    }),
                                    "\n",
                                    ...Object.keys(blogList)
                                        .map((data, index) => {
                                            var entry = data;
                                            if (args.length) {
                                                args.forEach((arg) => {
                                                    if (
                                                        Object.keys(
                                                            argMap
                                                        ).includes(arg)
                                                    )
                                                        entry += `\t${argMap[
                                                            arg
                                                        ](data)}`;
                                                });
                                            }
                                            return entry;
                                        })
                                        .join("\n"),
                                ];
                            else return "No blogs found.";
                        }
                    },
                    helpText:
                        "Lists all blogs(Linux-style).\n\t-T: Title\n\t-t: DateTime\n\t-a: Access",
                },
                help: {
                    func: (args) => {
                        return Object.keys(cases)
                            .map((_case) => {
                                if (_case !== "") {
                                    return (
                                        "> " +
                                        _case +
                                        ": " +
                                        cases[_case].helpText
                                    );
                                } else return "";
                            })
                            .join("\n")
                            .trim();
                    },
                    helpText: "Display this help text.",
                },
                open: {
                    func: (args) => {
                        if (Object.keys(blogList).includes(args[0])) {
                            if (typeof window !== 'undefined') {
                                window.location.href = `/blog/${args[0]}`;
                            }
                        } else return "Invalid BlogID entered.";
                    },
                    helpText: "Opens the blog",
                },
                search: {
                    func: (args) => {
                        if (args.length === 1) {
                            const keyword = args[0].toLowerCase();
                            const _blogList = Object.keys(blogList).filter(
                                (blog) =>
                                    blogList[blog].Title.toLowerCase().includes(
                                        keyword
                                    )
                                        ? blogList[blog].Title
                                        : "" ||
                                        blogList[blog].Metadata.Tags.map(
                                            (tag) => tag.toLowerCase()
                                        ).filter((tag) =>
                                            tag.includes(keyword)
                                        ).length > 0
                            );
                            if (Object.keys(_blogList).length > 0)
                                return ["BlogID", "\n", _blogList.join("\n")];
                            else return "No blogs found.";
                        } else return "";
                    },
                    helpText:
                        "Searches a given string or date in Blog's title or tags or date.",
                },
                login: {
                    func: async (args) => {
                        const login = await UsersService.login();
                        if (login === 'LOGGED_IN' || login === true) {
                            setUser(UsersService.getCurrentUserName());
                            return 'Successfully logged in';
                        }
                        return 'Login failed';
                    },
                    helpText: "Login",
                },
                logout: {
                    func: async (args) => {
                        UsersService.logout();
                        setUser(UsersService.getCurrentUserName());
                    },
                    helpText: "Logout",
                },
                converse: {
                    func: async (args) => {
                        if (!UsersService.checkSession()) {
                            return "You must be logged in to converse.";
                        }
                        const argMap = {
                            "-c": (data) => {
                                return "";
                            },
                            "-b": (data) => {
                                return new Date(parseInt(data))
                                    .toString()
                                    .split(" ")
                                    .slice(0, 4)
                                    .join(" ");
                            },
                            "-v": (data) => {
                                return "";
                            },
                        };
                        args = args
                            .join(" ")
                            .split("-")
                            .filter((arg) => arg !== "");
                        var _args = args.filter((arg) =>
                            Object.keys(argMap).includes(`-${arg[0]}`)
                        );
                        if (!!args && args.length > _args.length)
                            return "Invalid args";
                        const _argsMap = {};
                        for (var i = 0; i < _args.length; i++) {
                            _argsMap[_args[i][0]] = _args[i]
                                .slice(1, _args[i].length)
                                .trim();
                        }
                        if (_argsMap["v"] === "") {
                            try {
                                const conversations = await ConversationsService.getByBlog(_argsMap["b"]);
                                let _conversations = [];
                                for (var conversation in conversations) {
                                    _conversations.push(
                                        `${conversations[conversation].timestamp
                                        }--${new Date(
                                            conversations[conversation].timestamp
                                        )
                                            .toLocaleString()
                                            .replace(",", "")} ${conversations[conversation].name
                                        } ${conversations[conversation].conversation
                                        }`
                                    );
                                }
                                return _conversations
                                    .sort(
                                        (a, b) =>
                                            b.split("--")[0] - a.split("--")[0]
                                    )
                                    .map((conversation) =>
                                        conversation
                                            .split("--")
                                            .slice(
                                                1,
                                                conversation.split("--").length
                                            )
                                            .join("--")
                                    )
                                    .join("\n");
                            } catch (err) {
                                console.log('Error fetching conversations:', err);
                                return "Error fetching conversations";
                            }
                        } else if (_argsMap["c"]) {
                            try {
                                await ConversationsService.create(
                                    UsersService.getCurrentUserID(),
                                    _argsMap["b"],
                                    _argsMap["c"]
                                );
                            } catch (err) {
                                console.log('Error creating conversation:', err);
                            }
                        }
                    },
                    helpText:
                        "Conversations about a blog.\n-c Conversation to be added about the blog\n-b Blog ID\n-v Existing conversations about the blog.",
                },
                share: {
                    func: async (args) => {
                        if (args.length === 0) return "Invalid args";
                        else {
                            const pathToShare = args[0];
                            if (pathToShare === "." && args.length === 1) {
                                if (typeof navigator !== 'undefined' && navigator.share) {
                                    await navigator.share({
                                        title: document.title,
                                        text: document.title,
                                        url: window.location.href,
                                    });
                                }
                            }
                        }
                    },
                    helpText: "Share a blog.",
                },
                color: {
                    func: (args) => {
                        if (args.length !== 1) return "Invalid args";
                        else {
                            const color = args[0];
                            LocalStorageService.set("color", color);
                            setColor(color);
                        }
                    },
                    helpText: "Changes the color of the text in the terminal.",
                },
                "background-color": {
                    func: (args) => {
                        if (args.length !== 1) return "Invalid args";
                        else {
                            const backgroundColor = args[0];
                            LocalStorageService.set("background-color", backgroundColor);
                            setBackgroundColor(backgroundColor);
                        }
                    },
                    helpText: "Changes the background of the terminal.",
                },
                "exit": {
                    func: (args) => {
                        if (typeof window !== 'undefined') {
                            window.close();
                        }
                    },
                    helpText: "Exits the terminal.",
                }
            };
            switch (inputCommand) {
                case inputCommand:
                    if (Object.keys(cases).includes(inputCommand))
                        output = await cases[inputCommand].func(inputArgs);
                    else output = `~bash ${inputCommand}: command not found`;
                    break;
                default:
                    output = `~bash ${inputCommand}: command not found`;
                    break;
            }
        }
        return output;
    };

    const checkCommand = async (e) => {
        const key = e.key;
        if (key === "Enter") {
            e.preventDefault();
            await (async function () {
                const _output = await executeCommand(command);
                setHistory((_history) => {
                    return [
                        ..._history,
                        {
                            command: `${user} $ ${command}`,
                            output: _output,
                        },
                    ];
                });
            })();
            if (command.slice(0, 4) !== "open" && commandInput.current) {
                commandInput.current.scrollIntoView({
                    block: "end",
                    behavior: "smooth",
                });
            }
            setCommand("");
            setHistoryIndex(history.length);
        }
        if (key === "Tab") {
            e.preventDefault();
        }
        if (key === "ArrowUp") {
            setHistoryIndex((_historyIndex) => {
                if (_historyIndex >= 0 && historyIndex < history.length) {
                    setCommand(history[_historyIndex].command.split("$ ")[1]);
                    if (_historyIndex) return _historyIndex - 1;
                    else return _historyIndex;
                } else return _historyIndex;
            });
        }
        if (key === "ArrowDown") {
            setHistoryIndex((_historyIndex) => {
                if (history.length - 1 > _historyIndex) {
                    setCommand(history[_historyIndex].command.split("$ ")[1]);
                    if (history.length !== _historyIndex)
                        return _historyIndex + 1;
                    return _historyIndex;
                } else return _historyIndex;
            });
        }
        if (key === "Control") ctrl = true;
        if (ctrl && (key === "c" || key === "C")) setCommand("");
    };

    return (
        <div className="App">
            <main
                className="absolute top-0 left-0 min-h-full w-full text-lg sm:text-lg text-xs font-mono break-words"
                style={{ color: color, background: backgroundColor }}
                role="main"
                aria-label="Terminal interface"
            >
                <div className="sr-only">
                    <h1>Rec-er - Trishant Pahwa's Blog</h1>
                    <p>Interactive terminal-style blog interface. Type 'help' to see available commands.</p>
                </div>
                {userAgent}
                <br />
                <pre className="whitespace-pre text-[8px] sm:text-base" aria-label="ASCII art banner">{textArt}</pre>
                <p className="text-[8px] sm:text-xs break-words max-w-full mb-2.5">
                    {
                        "This is Trishant Pahwa's blog, journals, records, and researches. Enter help to get a list of commands."
                    }
                </p>
                <p className="text-[8px] sm:text-xs">
                    Rec-er comes with ABSOLUTELY NO WARRANTY, to the extent permitted
                    by applicable law.
                </p>
                <br />
                Last login: {new Date().toUTCString()} on dev0
                <br />
                <section className="flex flex-col whitespace-pre" aria-label="Command history">
                    {history.map((_command, index) => {
                        return (
                            <div key={index}>
                                <div className="executed-command" role="log">{`${_command.command}`}</div>
                                <div className="max-w-full whitespace-pre-line break-words">
                                    {_command.output}
                                </div>
                            </div>
                        );
                    })}
                </section>
                <form className="flex w-full" onSubmit={(e) => e.preventDefault()} aria-label="Terminal command input">
                    <label htmlFor="terminal-input" className="whitespace-nowrap">{user}</label>
                    &nbsp;$
                    <input
                        id="terminal-input"
                        style={{ color: color }}
                        className="border-0 bg-transparent outline-none text-xs sm:text-lg font-mono h-full w-full ml-0 sm:ml-1.5 focus:outline-none"
                        type="text"
                        value={command}
                        onKeyDown={(e) => checkCommand(e)}
                        onKeyUp={(e) => checkInterrupt(e)}
                        onChange={(e) => setCommand(e.target.value)}
                        ref={commandInput}
                        spellCheck={false}
                        autoComplete="off"
                        autoCapitalize="off"
                        aria-label="Terminal command input"
                    />
                </form>
            </main>
        </div>
    );
}
