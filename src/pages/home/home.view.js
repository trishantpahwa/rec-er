import './Home.css';

function HomeView(props) {
	return (
		<div className="Home">
			{navigator.userAgent}
			<br />
			<div className="text-art">{props.textArt}</div>
			<div className="description-text-art">
				{
					"This is Trishant Pahwa's blog, journals, records, and researches. Enter help to get a list of commands."
				}
			</div>
			Wrec-er comes with ABSOLUTELY NO WARRANTY, to the extent permitted by applicable law.
			<br />
			Last login: {new Date().toUTCString()} on dev0
			<br />
			<div className="history">
				{props.history.map((_command, index) => {
					return (
						<div key={index}>
							<div className="executed-command">{`${_command.command}`}</div>
							<div className="executed-output">{_command.output}</div>
						</div>
					);
				})}
			</div>
			<div className="command">
				<div className="user">{props.user}</div>
				&nbsp;$<input
					id="commandInput"
					type="text"
					value={props.command}
					onKeyDown={(e) => props.checkCommand(e)}
					onKeyUp={(e) => props.checkInterrupt(e)}
					onChange={(e) => props.setCommand(e.target.value)}
					ref={props.commandInput}
					spellCheck={false}
					autoComplete="off"
					autoCapitalize="off"
				/>
			</div>
		</div>
	);
}

export default HomeView;
