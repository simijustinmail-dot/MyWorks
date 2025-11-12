import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/Topnavbar';
import Footer from '../components/Footer';

const MainLayout = ({ children }) => (
  <div className="d-flex">
    <Sidebar />
    <div className="flex-grow-1 d-flex flex-column min-vh-100" style={{ marginLeft: '250px' }}>
      <TopNavbar />
      <main className="flex-grow-1 p-4">{children}</main>
      <Footer />
    </div>
  </div>
);
export default MainLayout;