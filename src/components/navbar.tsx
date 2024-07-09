import { Link } from 'react-router-dom'; // If using React Router

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link className="text-white text-xl font-bold" to="/">Logo</Link>
        <div className="flex space-x-4">
          <Link className="text-white" to="/">Home</Link>
          <Link className="text-white" to="/about">About</Link>
          {/* Add more links as needed */}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;