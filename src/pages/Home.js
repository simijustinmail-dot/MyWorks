import MainLayout from '../layouts/Mainlayout';

const Home = () => {

  return (
    <MainLayout>
      <div className="container">
        <h1 className="mb-4">Dashboard</h1>
        {/* Dynamically loaded content here */}
      </div>
    </MainLayout>
  );
};

export default Home;