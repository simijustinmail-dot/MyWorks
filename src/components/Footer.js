const Footer = () => (
  <footer className="bg-light text-center py-3 mt-auto border-top">
    <div>
      <small>
        &copy; {new Date().getFullYear()} by IT Team,{' '}
        <a href="http://www.kuhs.ac.in" target="_blank" rel="noopener noreferrer">KUHS</a>
      </small>
    </div>
  </footer>
);
export default Footer;