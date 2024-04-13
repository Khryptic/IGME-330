const AmiiboSearchUI = ({ term, setTermFun, searchFun, callbackFun }) => {
    return <>
        <button onClick={() => searchFun(term, callbackFun)}>Search</button>
        <label>
            Name:
            <input value={term} onChange={e => setTermFun(e.target.value)} />
        </label>
    </>
}

export default AmiiboSearchUI;