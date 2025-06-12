const HPBar = ({ current, max }) => {
    const percent = (current / max) * 100;

    return (
        <div style={{
            width: '150px',
            height: '20px',
            backgroundColor: '#ccc',
            border: '1px solid #333',
            borderRadius: '4px',
            marginBottom: '5px'
        }}>
            <div style={{
                width: `${percent}%`,
                height: '100%',
                backgroundColor: 'green',
                transition: 'width 0.3s ease'
            }} />
        </div>
    );
};

export default HPBar;