const Container = ({ children, ...props }) => {
	return <div className={'bg-white w-full min-h-[100vh] float-left p-[20px] rounded-md' + props.style}>{children}</div>
}

export default Container
