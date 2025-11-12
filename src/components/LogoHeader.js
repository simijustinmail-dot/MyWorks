const LogoHeader = () => (
  <div className="logo-header bg-primary d-flex justify-content-between align-items-center p-2">
    <a href="/dashboard" className="d-flex align-items-center text-white text-decoration-none">
      <img src="/images/kuhs_logo.png" alt="KUHS Logo" height="40" className="me-2" />
      <span className="fw-bold">ASSET REGISTER</span>
    </a>
    {/* <div className="d-flex gap-2">
      <button className="btn btn-sm btn-light"><i className="gg-menu-right"></i></button>
      <button className="btn btn-sm btn-light"><i className="gg-menu-left"></i></button>
    </div> */}
  </div>
);
export default LogoHeader;