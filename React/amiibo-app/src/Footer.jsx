const Footer = ({ name, year }) => {
    return <>
        <hr />
        <footer>
            <p>&copy; {year} {name}</p>
        </footer>
    </>
};

export default Footer;