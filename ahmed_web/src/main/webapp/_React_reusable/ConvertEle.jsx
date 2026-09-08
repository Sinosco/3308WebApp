

function ConvertEle({ ele }) {

    const containerRef = React.useRef(null);

    React.useEffect(() => {
        const container = containerRef.current;
        if (!container || !ele) return;

        container.innerHTML = '';
        container.appendChild(ele);

        return () => {
            container.innerHTML = '';
        };
    }, [ele]);

    return React.createElement('div', { ref: containerRef });
}